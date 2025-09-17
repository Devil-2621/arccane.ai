import { z } from "zod";

import { PROMPT } from "@/prompt";

import { inngest } from "@/inngest/client";
import { openai, createAgent, gemini, createTool, createNetwork } from "@inngest/agent-kit";

import { Sandbox} from "@e2b/code-interpreter";
import { getSandbox, lastAssistantTextMessageContent } from "./utils";

export const codingAgent = inngest.createFunction(
  { id: "coding-agent" },
  { event: "test/coding.agent" },
  async ({ event, step }) => {

    const sandboxId = await step.run("get-sandbox-id", async () => {
      const sandbox = await Sandbox.create("arccane-ai-nextjs");
      return sandbox.sandboxId;
    });

    const codeAgent = createAgent({
      name: "code-agent",
      description: "An expert coding and application building AI agent",
      system: PROMPT,
      model: gemini({ 
        model: "gemini-2.0-flash",
      }),
      tools: [
        createTool({
          name: "terminal",
          description: "run command in the terminal",
          parameters: z.object({
            command: z.string(),
          }),
          handler: async ({ command }, { step }) => {
            return await step?.run("terminal", async () => {
              const buffers = { stdout: "", stderr: "" };

              try {
                const sandbox = await getSandbox(sandboxId);
                const result = await sandbox.commands.run(command, {
                  onStdout: (data: string) => {
                    buffers.stdout += data;
                  },
                  onStderr: (data: string) => {
                    buffers.stderr += data;
                  },
                });
                return result.stdout;
              } catch (err) {
                console.error(
                  `Command failed: ${err} \nstdout: ${buffers.stdout} \nstderr: ${buffers.stderr}`,
                );
                return `Command failed: ${err} \nstdout: ${buffers.stdout} \nstderr: ${buffers.stderr}`;
              }
            });
          }
        }),
        createTool({
          name: "createOrUpdateFiles",
          description: "Create or update files in the sandbox",
          parameters: z.object({
            files: z.array(
              z.object({
                path: z.string(),
                content: z.string(),
              }),
            ),
          }),
          handler: async (
            { files },
            { step, network },
          ) => {
            const newFiles = await step?.run("createorupdatefiles", async () => {
              try {
                const updatedFiles = network.state.data.files || {};
                const sandbox = await getSandbox(sandboxId);
                for (const file of files) {
                  await sandbox.files.write(file.path, file.content);
                  updatedFiles[file.path] = file.content;
                }

                return updatedFiles;
              } catch (err) {
                return "Error creating or updating files: " + err;
              }
            });

            if(typeof newFiles === "object") {
              network.state.data.files = newFiles;
            }
          }
        }),
        createTool({
          name: "readFile",
          description: "Read a file from the sandbox",
          parameters: z.object({
            files: z.array(z.string()),
          }),
          handler: async ({ files }, { step }) => {
            return await step?.run("readfile", async () => {
              try {
                const sandbox = await getSandbox(sandboxId);
                const contents = [];
                for (const file of files) {
                  const content = await sandbox.files.read(file);
                  contents.push({ path: file, content });
                }

                return JSON.stringify(contents);
              } catch (err) {
                return "Error reading files: " + err;
              }
            });
          }
      }),
      ],
      lifecycle: {
        onResponse: async ({ result, network }) => {
          const lastAssistantMessageText = lastAssistantTextMessageContent(result);

          if (lastAssistantMessageText && network) {
            if(lastAssistantMessageText.includes("<task_summary>")) {
              network.state.data.summary = lastAssistantMessageText;
            }
          }

          return result;
          },
      }
    });

    const network = createNetwork({
      name: "coding-agent-network",
      agents: [codeAgent],
      maxIter: 15,
      router : async ({ network }) => {
        const summary =  network.state.data.summary;

        if(summary) {
          return;
        }

        return codeAgent;
      }
    });

    const result = await network.run(event.data.value);

    const sandboxUrl = await step.run("get-sandbox-url", async () => {
      const sandbox = await getSandbox(sandboxId);
      const host =  sandbox.getHost(3000);
      return `http://${host}`;
    });

    return { 
      url: sandboxUrl,
      title: "Fragment",
      files: result.state.data.files,
      summary: result.state.data.summary,
    };
  },
);