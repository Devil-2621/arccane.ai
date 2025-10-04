function sanitizeOrigin(value: string | undefined | null) {
  if (!value) return undefined;

  const trimmed = value.trim();
  if (!trimmed) return undefined;

  // Ensure we always return an https/http URL that EventSource can reach.
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed.replace(/\/$/, "");
  }

  return `https://${trimmed.replace(/\/$/, "")}`;
}

const APP_ORIGIN = (() => {
  const candidates = [
    sanitizeOrigin(process.env.APP_ORIGIN),
    sanitizeOrigin(process.env.NEXT_PUBLIC_APP_URL),
    sanitizeOrigin(process.env.VERCEL_PROJECT_PRODUCTION_URL),
    sanitizeOrigin(process.env.VERCEL_BRANCH_URL),
    sanitizeOrigin(process.env.VERCEL_URL),
  ];

  for (const candidate of candidates) {
    if (candidate) return candidate;
  }

  return "http://localhost:3000";
})();

export type ProgressStage = {
  id: string;
  title: string;
  description?: string;
  hint?: string;
};

export type ProgressStatus =
  | "idle"
  | "running"
  | "completed"
  | "failed"
  | "cancelled";

export type ProgressPayload = {
  currentStageId?: string | null;
  stages?: ProgressStage[];
  status?: ProgressStatus;
  message?: string;
  error?: string;
} & Record<string, unknown>;

export async function postProgress(
  projectId: string,
  payload: ProgressPayload
) {
  try {
    const response = await fetch(`${APP_ORIGIN}/api/inngest/progress`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId, ...payload }),
    });
    if (!response.ok) {
      console.error(
        `Failed to post progress update. Status: ${response.status} ${response.statusText}`,
        await response.text()
      );
    }
  } catch (error) {
    console.error("Failed to post progress", error);
  }
}
