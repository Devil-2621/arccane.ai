import { z } from "zod";
import { FRAGMENT_TITLE_PROMPT, PROMPT, RESPONSE_PROMPT } from "@/prompt";
import { prisma } from "@/lib/db";
import { inngest } from "@/inngest/client";
import {
  openai,
  gemini,
  createAgent,
  createTool,
  createNetwork,
  type Tool,
  type Message,
  createState,
} from "@inngest/agent-kit";
import { Sandbox } from "@e2b/code-interpreter";
import {
  getSandbox,
  parseAgentOutput,
  lastAssistantTextMessageContent,
} from "./utils";
import { postProgress, type ProgressStage } from "@/inngest/progress";

class JobCancelledError extends Error {
  constructor() {
    super("Generation cancelled by user");
    this.name = "JobCancelledError";
  }
}

const normalizeAgentOutput = (output: unknown, fallback: string): string => {
  if (typeof output === "string") {
    return output.trim() || fallback;
  }

  if (Array.isArray(output)) {
    try {
      return parseAgentOutput(output as Message[]) || fallback;
    } catch {
      return fallback;
    }
  }

  return fallback;
};

interface AgentState {
  summary: string;
  files: { [path: string]: string };
}

export const codingAgentFunction = inngest.createFunction(
  { id: "coding-agent" },
  { event: "coding-agent/run" },
  async ({ event, step }) => {
    const projectId = event.data.projectId;

    const stages: ProgressStage[] = [
      { id: "get-sandbox-id", title: "Getting sandbox id" },
      { id: "get-previous-messages", title: "Fetching previous messages" },
      { id: "code-agent", title: "Running code agent" },
      { id: "terminal", title: "Running terminal command" },
      { id: "createorupdatefiles", title: "Updating files" },
      { id: "fragment-title-generator", title: "Generating fragment title" },
      { id: "get-sandbox-url", title: "Getting sandbox URL" },
      { id: "save-result", title: "Saving result" },
      { id: "finalization", title: "Finalization" },
    ];

    try {
      await postProgress(projectId, {
        currentStageId: "get-sandbox-id",
        stages,
        status: "running",
        message: "Preparing workspace...",
      });

      const sandboxId = await step.run("get-sandbox-id", async () => {
        const sandbox = await Sandbox.create("arccane-ai-nextjs");
        return sandbox.sandboxId;
      });

      await postProgress(projectId, {
        currentStageId: "get-previous-messages",
        status: "running",
        message: "Syncing previous context...",
      });

      const previousMessages = await step.run(
        "get-previous-messages",
        async () => {
          const formattedMessages: Message[] = [];
          const messages = await prisma.message.findMany({
            where: { projectId },
            orderBy: { createdAt: "desc" },
          });
          for (const message of messages) {
            formattedMessages.push({
              type: "text",
              role: message.role === "ASSISTANT" ? "assistant" : "user",
              content: message.content,
            });
          }
          return formattedMessages;
        }
      );

      const state = createState<AgentState>(
        { summary: "", files: {} },
        { messages: previousMessages }
      );

      await postProgress(projectId, {
        currentStageId: "code-agent",
        status: "running",
        message: "Running the coding agent...",
      });

      const codeAgent = createAgent<AgentState>({
        name: "code-agent",
        description: "An expert coding and web application building AI agent",
        system: PROMPT,
        model: gemini({
          model: "gemini-2.5-pro",
          // apiKey: process.env.OPENROUTER_API_KEY,
          // baseUrl: "https://openrouter.ai/api/v1",
        }),
        tools: [
          createTool({
            name: "terminal",
            description: "run command in the terminal",
            parameters: z.object({ command: z.string() }),
            handler: async ({ command }, { step }) => {
              await postProgress(projectId, {
                currentStageId: "terminal",
                status: "running",
                message: "Running requested command...",
              });

              return await step?.run("terminal", async () => {
                const buffers = { stdout: "", stderr: "" };
                try {
                  const sandbox = await getSandbox(sandboxId);
                  const result = await sandbox.commands.run(command, {
                    stdin: false,
                    onStdout: (d) => {
                      buffers.stdout += d;
                    },
                    onStderr: (d) => {
                      buffers.stderr += d;
                    },
                  });
                  return result.stdout;
                } catch (err) {
                  return `Command failed: ${err}\nstdout: ${buffers.stdout}\nstderr: ${buffers.stderr}`;
                }
              });
            },
          }),
          createTool({
            name: "createOrUpdateFiles",
            description: "Create or update files in the sandbox",
            parameters: z.object({
              files: z.array(
                z.object({ path: z.string(), content: z.string() })
              ),
            }),
            handler: async (
              { files },
              { step, network }: Tool.Options<AgentState>
            ) => {
              await postProgress(projectId, {
                currentStageId: "createorupdatefiles",
                status: "running",
                message: "Applying suggested file updates...",
              });
              const newFiles = await step?.run(
                "createorupdatefiles",
                async () => {
                  const updatedFiles = network.state.data.files || {};
                  const sandbox = await getSandbox(sandboxId);
                  for (const file of files) {
                    await sandbox.files.write(file.path, file.content);
                    updatedFiles[file.path] = file.content;
                  }
                  return updatedFiles;
                }
              );
              if (typeof newFiles === "object")
                network.state.data.files = newFiles;
            },
          }),
        ],
        lifecycle: {
          onResponse: async ({ result, network }) => {
            const text = lastAssistantTextMessageContent(result);
            if (!text || !network) {
              return result;
            }

            const summaryMatch = text.match(
              /<task_summary>([\s\S]*?)<\/task_summary>/i
            );
            if (summaryMatch) {
              network.state.data.summary = summaryMatch[1].trim();
            } else if (text.includes("<task_summary>")) {
              network.state.data.summary = text
                .replace("<task_summary>", "")
                .trim();
            } else {
              const trimmed = text.trim();
              if (trimmed) {
                network.state.data.summary = trimmed;
              }
            }

            return result;
          },
        },
      });

      const network = createNetwork<AgentState>({
        name: "coding-agent-network",
        agents: [codeAgent],
        maxIter: 15,
        defaultState: state,
        router: async ({ network }) => {
          if (network.state.data.summary) return;
          return codeAgent;
        },
      });

      const result = await network.run(event.data.value, { state });

      await postProgress(projectId, {
        currentStageId: "fragment-title-generator",
        status: "running",
        message: "Crafting responses...",
      });
      const fragmentTitleGenerator = createAgent({
        name: "fragment-title-generator",
        description: "Generate a short title for a code fragment",
        system: FRAGMENT_TITLE_PROMPT,
        model: gemini({
          model: "gemini-2.5-pro",
          // apiKey: process.env.OPENROUTER_API_KEY,
          // baseUrl: "https://openrouter.ai/api/v1",
        }),
      });

      const responseGenerator = createAgent({
        name: "response-generator",
        description: "Generate a response for a code fragment",
        system: RESPONSE_PROMPT,
        model: openai({
          model: "openai/gpt-4o-mini",
          apiKey: process.env.OPENROUTER_API_KEY,
          baseUrl: "https://openrouter.ai/api/v1",
        }),
      });

      const [fragmentTitleResult, responseResult] = await Promise.all([
        fragmentTitleGenerator.run(result.state.data.summary),
        responseGenerator.run(result.state.data.summary),
      ]);

      const fragmentTitleText = normalizeAgentOutput(
        fragmentTitleResult.output,
        "Generated Fragment"
      );
      const responseText = normalizeAgentOutput(
        responseResult.output,
        result.state.data.summary
      );

      await postProgress(projectId, {
        currentStageId: "get-sandbox-url",
        status: "running",
        message: "Preparing live preview...",
      });
      const sandboxUrl = await step.run("get-sandbox-url", async () => {
        const sandbox = await getSandbox(sandboxId);
        const host = sandbox.getHost(3000);

        if (!host) {
          return null;
        }

        if (/^https?:\/\//i.test(host)) {
          return host.replace(/^http:\/\//i, "https://");
        }

        return `https://${host}`;
      });

      if (!sandboxUrl) {
        throw new Error("Unable to resolve sandbox preview URL");
      }

      await postProgress(projectId, {
        currentStageId: "save-result",
        status: "running",
        message: "Persisting assistant output...",
      });

      await step.run("save-result", async () => {
        return prisma.message.create({
          data: {
            projectId,
            content: responseText,
            role: "ASSISTANT",
            type: "RESULT",
            fragment: {
              create: {
                content: result.state.data.summary,
                sandboxUrl,
                titles: fragmentTitleText,
                files: result.state.data.files,
              },
            },
          },
        });
      });

      await postProgress(projectId, {
        currentStageId: "finalization",
        status: "completed",
        message: "Web app generation completed successfully.",
      });

      return { url: sandboxUrl };
    } catch (error) {
      if (error instanceof JobCancelledError) {
        return { cancelled: true };
      }

      const message =
        error instanceof Error ? error.message : "Unknown error occurred";

      await postProgress(projectId, {
        status: "failed",
        error: message,
        message,
      });

      throw error;
    }
  }
);
