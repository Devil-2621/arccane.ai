import { Sandbox} from "@e2b/code-interpreter";

import { inngest } from "@/inngest/client";
import { openai, createAgent, gemini } from "@inngest/agent-kit";
import { stepsSchemas } from "inngest/api/schema";
import { getSandbox } from "./utils";

export const codeAgent = inngest.createFunction(
  { id: "code-agent" },
  { event: "test/code.agent" },
  async ({ event, step }) => {

    const sandboxId = await step.run("get-sandbox-id", async () => {
      const sandbox = await Sandbox.create("arccane-ai-nextjs");
      return sandbox.sandboxId;
    });

    const writer = createAgent({
      name: "writer",
      system: "You are an expert writer.  You write readable, concise, simple content.",
      model: gemini({ model: "gemini-2.0-flash" }),
    });

    const { output } = await writer.run(
      `Here's the output: ${event.data.value}.`
    );


    const sandboxUrl = await step.run("get-sandbox-url", async () => {
      const sandbox = await getSandbox(sandboxId);
      const host =  sandbox.getHost(3000);
      return `http://${host}`;
    });

    
    return { output, sandboxUrl };
  },
);