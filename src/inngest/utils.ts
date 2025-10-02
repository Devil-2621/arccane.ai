import { Sandbox } from "@e2b/code-interpreter";
import { AgentResult, Message, TextMessage } from "@inngest/agent-kit";

export async function getSandbox(sandboxId: string) {
    const sandbox = await Sandbox.connect(sandboxId);
    return sandbox;
}

export function lastAssistantTextMessageContent(result: AgentResult) {
    const lastAssistantTextMessageContent = result.output.findLastIndex(
        (message) => message.role === "assistant",
    );

    const message = result.output[lastAssistantTextMessageContent] as
        | TextMessage
        | undefined;

    return message?.content
        ? typeof message.content === "string"
            ? message.content
            : message.content.map((c) => c.text).join("")
        : undefined;
};

export const parseAgentOutput = (value: Message[]) => {
  if (value.length === 0) {
    return "Fragment";
  }

  const output = value[0];

  if (output.type !== "text") {
    return "Fragment";
  }

  // Type narrowed: output is now a TextMessage
  const content = output.content;

  if (!content) {
    return "Fragment";
  }

  if (Array.isArray(content)) {
    return content.length > 0 ? content.join(" ") : "Fragment";
  }

  return content;
}