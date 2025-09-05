import { inngest } from "@/inngest/client";

import { openai, createAgent, gemini } from "@inngest/agent-kit";

export const codeAgent = inngest.createFunction(
  { id: "code-agent" },
  { event: "test/code.agent" },
  async ({ event }) => {

    const writer = createAgent({
      name: "writer",
      system: "You are an expert writer.  You write readable, concise, simple content.",
      model: gemini({ model: "gemini-2.0-flash" }),
    });

    const { output } = await writer.run(
      `Here's the output: ${event.data.value}.`
    );

    console.log(output);
    return { output };
  },
);