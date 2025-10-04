const APP_ORIGIN =
  process.env.APP_ORIGIN ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export type ProgressStage = {
  id: string;
  title: string;
  description?: string;
  hint?: string;
};

export type ProgressStatus = "idle" | "running" | "completed" | "failed" | "cancelled";

export type ProgressPayload = {
  currentStageId?: string | null;
  stages?: ProgressStage[];
  status?: ProgressStatus;
  message?: string;
  error?: string;
} & Record<string, unknown>;

export async function postProgress(projectId: string, payload: ProgressPayload) {
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
