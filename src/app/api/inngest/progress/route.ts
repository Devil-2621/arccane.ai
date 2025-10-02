import { NextRequest } from "next/server";

let clients: any[] = [];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get("projectId");
  if (!projectId) return new Response("Missing projectId", { status: 400 });

  return new Response(
    new ReadableStream({
      start(controller) {
        const client = { projectId, controller };
        clients.push(client);

        controller.enqueue(
          new TextEncoder().encode(`event: connected\ndata: connected\n\n`)
        );

        req.signal.addEventListener("abort", () => {
          clients = clients.filter((c) => c !== client);
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
  const { projectId, ...payload } = await req.json();
  clients.forEach((c) => {
    if (c.projectId === projectId) {
      c.controller.enqueue(
        new TextEncoder().encode(
          `event: progress\ndata: ${JSON.stringify(payload)}\n\n`
        )
      );
    }
  });
  return new Response("ok");
}
