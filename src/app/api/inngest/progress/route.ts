import type { ProgressPayload } from "@/inngest/progress";
import { NextRequest } from "next/server";

type ProgressClient = {
  projectId: string;
  controller: ReadableStreamDefaultController<Uint8Array>;
};

type ProgressEvent = ProgressPayload & { projectId: string };

const clients: ProgressClient[] = [];
const encoder = new TextEncoder();

function encodeEvent(event: string, data: unknown) {
  return encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get("projectId");
  if (!projectId) return new Response("Missing projectId", { status: 400 });

  return new Response(
    new ReadableStream<Uint8Array>({
      start(controller) {
        const client: ProgressClient = { projectId, controller };
        clients.push(client);

        controller.enqueue(encodeEvent("connected", "connected"));

        req.signal.addEventListener("abort", () => {
          const index = clients.indexOf(client);
          if (index !== -1) {
            clients.splice(index, 1);
          }
        });
      },
    }),
    {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    }
  );
}

export async function POST(req: Request) {
  const body = (await req.json()) as ProgressEvent;
  const { projectId, ...payload } = body;

  if (!projectId) {
    return new Response("Missing projectId", { status: 400 });
  }

  for (const client of clients) {
    if (client.projectId === projectId) {
      client.controller.enqueue(encodeEvent("progress", payload));
    }
  }
  return new Response("ok");
}
