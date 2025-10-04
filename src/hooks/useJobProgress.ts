import { useEffect, useState } from "react";
import type { ProgressStatus } from "@/inngest/progress";

interface Stage {
  id: string;
  title: string;
  description?: string;
  hint?: string;
}

interface ProgressState {
  stages: Stage[];
  currentStageId: string | null;
  error?: string;
  status: ProgressStatus;
  message?: string;
}

export function useJobProgress(projectId: string) {
  const [progress, setProgress] = useState<ProgressState>({
    stages: [],
    currentStageId: null,
    status: "idle",
  });

  useEffect(() => {
    if (!projectId) return;

    const es = new EventSource(`/api/inngest/progress?projectId=${projectId}`);

    const handleProgress = (event: MessageEvent) => {
      if (!event.data) return;

      try {
        const data = JSON.parse(event.data);
        if (data.error) {
          setProgress((p) => ({
            ...p,
            error: typeof data.error === "string" ? data.error : data.message || "Job failed",
            status: data.status ?? "failed",
            message: data.message,
          }));
          return;
        }

        setProgress((prev) => {
          const suppliedStatus = data.status as ProgressStatus | undefined;
          const hasStageActivity =
            typeof data.currentStageId === "string" ||
            (Array.isArray(data.stages) && data.stages.length > 0);
          const nextStatus: ProgressStatus = suppliedStatus
            ? suppliedStatus
            : hasStageActivity
            ? "running"
            : prev.status;

          const nextError =
            typeof data.error === "string"
              ? data.error
              : nextStatus === "running"
              ? undefined
              : prev.error;

          const nextMessage =
            typeof data.message === "string" ? data.message : prev.message;

          return {
            stages: Array.isArray(data.stages) ? data.stages : prev.stages,
            currentStageId:
              "currentStageId" in data
                ? (data.currentStageId as string | null | undefined) ?? null
                : prev.currentStageId,
            status: nextStatus,
            error: nextError,
            message: nextMessage,
          } satisfies ProgressState;
        });
  } catch {
        // ignore keep-alive pings or plain-text events
        if (process.env.NODE_ENV === "development") {
          console.debug("Ignoring non-JSON progress payload", event.data);
        }
      }
    };

    const handleError = (event: Event) => {
      console.error("Progress SSE error", event);
    };

    es.addEventListener("progress", handleProgress);
    es.addEventListener("message", handleProgress);
    es.addEventListener("error", handleError);

    return () => {
      es.removeEventListener("progress", handleProgress);
      es.removeEventListener("message", handleProgress);
      es.removeEventListener("error", handleError);
      es.close();
    };
  }, [projectId]);

  return progress;
}
