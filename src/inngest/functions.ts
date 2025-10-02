import { z } from "zod";

import { FRAGMENT_TITLE_PROMPT, PROMPT, RESPONSE_PROMPT } from "@/prompt";
import { prisma } from "@/lib/db";

import { inngest } from "@/inngest/client";
import { openai, gemini, createAgent,  createTool, createNetwork, type Tool, type Message, createState } from "@inngest/agent-kit";

import { Sandbox} from "@e2b/code-interpreter";
import { getSandbox, lastAssistantTextMessageContent, parseAgentOutput } from "./utils";

interface AgentState{
  summary: string;
  files: { [path: string]: string};
};


export const codingAgentFunction = inngest.createFunction(
  { id: "coding-agent" },
  { event: "coding-agent/run" },
  async ({ event, step }) => {

    const sandboxId = await step.run("get-sandbox-id", async () => {
      const sandbox = await Sandbox.create("arccane-ai-nextjs");
      return sandbox.sandboxId;
    });

    const previousMessages = await step.run("get-previous-messages", async () => {
      const formattedMessages: Message[] = [];
      
      const messages = await prisma.message.findMany({
        where: {
          projectId: event.data.projectId,
        },
        orderBy: { createdAt: "desc" }, //TODO: change to asc if AI doesn't work as expected
      });

      for (const message of messages) {
        formattedMessages.push({
          type: "text",
          role: message.role === "ASSISTANT" ? "assistant" : "user",
          content: message.content,
        });
      }

      return formattedMessages;
    });

    const state = createState<AgentState>(
      {
        summary: "",
        files: {},
      },
      {
        messages: previousMessages,
      },
    );

    const codeAgent = createAgent<AgentState>({
      name: "code-agent",
      description: "An expert coding and web application building AI agent",
      system: PROMPT,
      model: openai({ 
        model: "x-ai/grok-4-fast:free",
        apiKey: process.env.OPENROUTER_API_KEY,
        baseUrl: "https://openrouter.ai/api/v1",
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
            { step, network }: Tool.Options<AgentState>,
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

    const network = createNetwork<AgentState>({
      name: "coding-agent-network",
      agents: [codeAgent],
      maxIter: 15,
      defaultState: state,
      router : async ({ network }) => {
        const summary =  network.state.data.summary;

        if(summary) {
          return;
        }

        return codeAgent;
      }
    });

    const result = await network.run(event.data.value, { state });

    const fragmentTitleGenerator = createAgent({
      name: "fragment-title-generator",
      description: "Generate a short title for a code fragment",
      system: FRAGMENT_TITLE_PROMPT,
      model: openai({ 
        model: "x-ai/grok-4-fast:free",
        apiKey: process.env.OPENROUTER_API_KEY,
        baseUrl: "https://openrouter.ai/api/v1",
      }),
    })

    const responseGenerator = createAgent({
      name: "response-generator",
      description: "Generate a response for a code fragment",
      system: RESPONSE_PROMPT,
      model: openai({ 
        model: "x-ai/grok-4-fast:free",
        apiKey: process.env.OPENROUTER_API_KEY,
        baseUrl: "https://openrouter.ai/api/v1",
      }),
    })

    const { output: fragmentTitleOutput } = await fragmentTitleGenerator.run(result.state.data.summary);
    const { output: responseOutput } = await responseGenerator.run(result.state.data.summary);

    const isError  = 
    !result.state.data.summary || 
    Object.keys(result.state.data.files || {}).length === 0;

    const sandboxUrl = await step.run("get-sandbox-url", async () => {
      const sandbox = await getSandbox(sandboxId);
      const host =  sandbox.getHost(3000);
      return `http://${host}`;
    });

    await step.run("save-result", async () => {
      if(isError) {
        return await prisma.message.create({
            data:{
              projectId: event.data.projectId,
              content:"Something went wrong. Please try again.",
              role: "ASSISTANT",
              type: "ERROR",
            },
        });
      }

      return await prisma.message.create({
        data:{
          projectId: event.data.projectId,
          content: parseAgentOutput(responseOutput),
          role: "ASSISTANT",
          type: "RESULT",
          fragment: {
              create:{
                content: result.state.data.summary, // If you want to store files as content
                sandboxUrl: sandboxUrl,
                titles: parseAgentOutput(fragmentTitleOutput),
                files: result.state.data.files,
              },
          },
        },
      });
    });

    return { 
      url: sandboxUrl,
      title: "Fragment",
      files: result.state.data.files,
      summary: result.state.data.summary,
    };
  },
);