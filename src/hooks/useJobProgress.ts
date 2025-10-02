import { useEffect, useState } from "react";

interface Stage {
  id: string;
  title: string;
}

interface ProgressState {
  stages: Stage[];
  currentStageId: string | null;
  error?: string;
}

export function useJobProgress(projectId: string) {
  const [progress, setProgress] = useState<ProgressState>({
    stages: [],
    currentStageId: null,
  });

  useEffect(() => {
    if (!projectId) return;
    const es = new EventSource(`/api/inngest/progress?projectId=${projectId}`);

    es.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        if (data.error) {
          setProgress((p) => ({ ...p, error: data.message || "Job failed" }));
        } else {
          setProgress((p) => ({
            ...p,
            ...data,
          }));
        }
      } catch (err) {
        console.error("Failed to parse SSE", err);
      }
    };

    return () => {
      es.close();
    };
  }, [projectId]);

  return progress;
}
