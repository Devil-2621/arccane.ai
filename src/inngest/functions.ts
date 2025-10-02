import { z } from "zod";
import { FRAGMENT_TITLE_PROMPT, PROMPT, RESPONSE_PROMPT } from "@/prompt";
import { prisma } from "@/lib/db";
import { inngest } from "@/inngest/client";
import { openai, createAgent, createTool, createNetwork, type Tool, type Message, createState } from "@inngest/agent-kit";
import { Sandbox } from "@e2b/code-interpreter";
import { getSandbox, parseAgentOutput, lastAssistantTextMessageContent } from "./utils";

// --- helper to broadcast progress to frontend ---
const APP_ORIGIN =
  process.env.APP_ORIGIN ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

async function postProgress(projectId: string, payload: any) {
  try {
    await fetch(`${APP_ORIGIN}/api/inngest/progress`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId, ...payload }),
    });
  } catch (error) {
    console.error("Failed to post progress", error);
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

    // define stages (mirror Inngest trace)
    const stages = [
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

    // --- Stage 1: sandbox id ---
    await postProgress(projectId, { currentStageId: "get-sandbox-id", stages });
    const sandboxId = await step.run("get-sandbox-id", async () => {
      const sandbox = await Sandbox.create("arccane-ai-nextjs");
      return sandbox.sandboxId;
    });

    // --- Stage 2: previous messages ---
    await postProgress(projectId, { currentStageId: "get-previous-messages" });
    const previousMessages = await step.run("get-previous-messages", async () => {
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
    });

    const state = createState<AgentState>(
      { summary: "", files: {} },
      { messages: previousMessages },
    );

    // --- Stage 3: run code agent ---
    await postProgress(projectId, { currentStageId: "code-agent" });

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
          parameters: z.object({ command: z.string() }),
          handler: async ({ command }, { step }) => {
            await postProgress(projectId, { currentStageId: "terminal" });
            return await step?.run("terminal", async () => {
              const buffers = { stdout: "", stderr: "" };
              try {
                const sandbox = await getSandbox(sandboxId);
                const result = await sandbox.commands.run(command, {
                  onStdout: (d: string) => {
                    buffers.stdout += d;
                  },
                  onStderr: (d: string) => {
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
            files: z.array(z.object({ path: z.string(), content: z.string() })),
          }),
          handler: async ({ files }, { step, network }: Tool.Options<AgentState>) => {
            await postProgress(projectId, { currentStageId: "createorupdatefiles" });
            const newFiles = await step?.run("createorupdatefiles", async () => {
              const updatedFiles = network.state.data.files || {};
              const sandbox = await getSandbox(sandboxId);
              for (const file of files) {
                await sandbox.files.write(file.path, file.content);
                updatedFiles[file.path] = file.content;
              }
              return updatedFiles;
            });
            if (typeof newFiles === "object") network.state.data.files = newFiles;
          },
        }),
      ],
      lifecycle: {
        onResponse: async ({ result, network }) => {
          const text = lastAssistantTextMessageContent(result);
          if (!text || !network) {
            return result;
          }

          const summaryMatch = text.match(/<task_summary>([\s\S]*?)<\/task_summary>/i);
          if (summaryMatch) {
            network.state.data.summary = summaryMatch[1].trim();
          } else if (text.includes("<task_summary>")) {
            network.state.data.summary = text.replace("<task_summary>", "").trim();
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

    // --- Stage 4: fragment title generator ---
    await postProgress(projectId, { currentStageId: "fragment-title-generator" });
    const fragmentTitleGenerator = createAgent({
      name: "fragment-title-generator",
      description: "Generate a short title for a code fragment",
      system: FRAGMENT_TITLE_PROMPT,
      model: openai({
        model: "x-ai/grok-4-fast:free",
        apiKey: process.env.OPENROUTER_API_KEY,
        baseUrl: "https://openrouter.ai/api/v1",
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
      "Generated Fragment",
    );
    const responseText = normalizeAgentOutput(
      responseResult.output,
      result.state.data.summary,
    );

    // --- Stage 5: sandbox URL ---
    await postProgress(projectId, { currentStageId: "get-sandbox-url" });
    const sandboxUrl = await step.run("get-sandbox-url", async () => {
      const sandbox = await getSandbox(sandboxId);
      const host = sandbox.getHost(3000);
      return `http://${host}`;
    });

    // --- Stage 6: save result ---
    await postProgress(projectId, { currentStageId: "save-result" });
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

    await postProgress(projectId, { currentStageId: "finalization" });
    return { url: sandboxUrl };
  },
);
