"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

import { Logo } from "@/components/logo";
import { useJobProgress } from "@/hooks/useJobProgress";
import { useTRPC } from "@/trpc/client";
import type { ProgressStatus } from "@/inngest/progress";

export interface AgentStage {
  id: string;
  title: string;
  description?: string;
  hint?: string;
}

const DISPLAY_INTERVAL_MS = 3400;

const DEFAULT_PHASES: AgentStage[] = [
  {
    id: "fallback-preparing-workspace",
    title: "Preparing workspace",
    description: "Booting the sandbox and warming up project dependencies.",
    hint: "Provisioning sandbox",
  },
  {
    id: "fallback-syncing-context",
    title: "Syncing project context",
    description: "Loading recent prompts and agent notes for continuity.",
    hint: "Fetching history",
  },
  {
    id: "fallback-scanning-repo",
    title: "Scanning repository",
    description: "Listing directories and evaluating project structure.",
    hint: "Inspecting /src",
  },
  {
    id: "fallback-reading-files",
    title: "Reading key files",
    description: "Pulling latest layouts and configs into memory.",
    hint: "Reading layout.tsx",
  },
  {
    id: "fallback-analyzing-instructions",
    title: "Analyzing instructions",
    description: "Matching your request with code areas that must change.",
    hint: "Planning workflow",
  },
  {
    id: "fallback-installing-deps",
    title: "Installing dependencies",
    description: "Queueing package installs required for new features.",
    hint: "Running package manager",
  },
  {
    id: "fallback-updating-files",
    title: "Updating files",
    description: "Applying edits, writing components, and syncing styles.",
    hint: "Modifying source",
  },
  {
    id: "fallback-running-commands",
    title: "Running commands",
    description: "Executing build checks and verifying lint output.",
    hint: "Terminal in progress",
  },
  {
    id: "fallback-summarizing",
    title: "Summarizing changes",
    description: "Drafting final notes and preparing the assistant response.",
    hint: "Generating summary",
  },
  {
    id: "fallback-sharing-preview",
    title: "Sharing preview",
    description: "Finalizing fragment details and sharing sandbox link.",
    hint: "Publishing results",
  },
];

const STAGE_OVERRIDES: Record<string, Partial<AgentStage>> = {
  "get-sandbox-id": {
    title: "Preparing workspace",
    description: "Booting the sandbox and warming up project dependencies.",
    hint: "Provisioning sandbox",
  },
  "get-previous-messages": {
    title: "Syncing project context",
    description: "Loading recent prompts and agent notes for continuity.",
    hint: "Fetching history",
  },
  "code-agent": {
    title: "Analyzing instructions",
    description: "Matching your request with code areas that must change.",
    hint: "Planning workflow",
  },
  terminal: {
    title: "Running commands",
    description: "Executing build checks and verifying lint output.",
    hint: "Terminal in progress",
  },
  createorupdatefiles: {
    title: "Updating files",
    description: "Applying edits, writing components, and syncing styles.",
    hint: "Modifying source",
  },
  "fragment-title-generator": {
    title: "Summarizing changes",
    description: "Drafting concise titles for the generated fragment.",
    hint: "Generating summary",
  },
  "get-sandbox-url": {
    title: "Sharing preview",
    description: "Preparing a live sandbox link for quick review.",
    hint: "Publishing preview",
  },
  "save-result": {
    title: "Saving result",
    description: "Persisting assistant response and generated files.",
    hint: "Writing to database",
  },
  finalization: {
    title: "Finalizing",
    description: "Tidying up the workspace and wrapping the session.",
    hint: "Complete",
  },
};

const AnimatedDots = () => (
  <span className="inline-flex items-center gap-1">
    <span className="size-1.5 rounded-full bg-primary/80 animate-[pulse_900ms_ease-in-out_infinite]" />
    <span className="size-1.5 rounded-full bg-primary/60 animate-[pulse_900ms_ease-in-out_infinite] [animation-delay:140ms]" />
    <span className="size-1.5 rounded-full bg-primary/40 animate-[pulse_900ms_ease-in-out_infinite] [animation-delay:280ms]" />
  </span>
);

const PhaseTimeline = ({
  stages,
  currentIndex,
}: {
  stages: AgentStage[];
  currentIndex: number;
}) => {
  const recent = useMemo(() => {
    const start = Math.max(0, currentIndex - 2);
    return stages.slice(start, currentIndex).reverse();
  }, [stages, currentIndex]);

  if (recent.length === 0) return null;

  return (
    <div className="flex flex-col gap-2 text-xs text-muted-foreground/70">
      {recent.map((phase) => (
        <div
          key={phase.id}
          className="flex items-start gap-2 rounded-md border border-border/40 bg-muted/30 px-3 py-2"
        >
          <span className="mt-0.5 size-1.5 rounded-full bg-primary/60" />
          <div>
            <p className="font-medium text-foreground/80">{phase.title}</p>
            {phase.hint && <p>{phase.hint}</p>}
          </div>
        </div>
      ))}
    </div>
  );
};

interface MessageLoadingProps {
  projectId: string;
  stages?: AgentStage[];
  currentStageId?: string;
}

export const MessageLoading = ({
  projectId,
  stages = [],
  currentStageId,
}: MessageLoadingProps) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const messagesQueryOptions = useMemo(
    () => trpc.messages.getMany.queryOptions({ projectId }),
    [trpc, projectId]
  );
  const {
    stages: realtimeStages,
    currentStageId: realtimeStageId,
    error,
    status,
    message: statusMessage,
  } = useJobProgress(projectId);

  const hasRealtimeStages = realtimeStages.length > 0;
  const hasInvalidatedRef = useRef(false);

  const resolvedStages = useMemo<AgentStage[]>(() => {
    const sourceStages = hasRealtimeStages ? realtimeStages : stages;

    if (!sourceStages.length) {
      return DEFAULT_PHASES;
    }

    return sourceStages.map((stage) => {
      const overrides = STAGE_OVERRIDES[stage.id] ?? {};
      return {
        id: stage.id,
        title: stage.title ?? overrides.title ?? stage.id,
        description: stage.description ?? overrides.description,
        hint: stage.hint ?? overrides.hint,
      } satisfies AgentStage;
    });
  }, [hasRealtimeStages, realtimeStages, stages]);

  const effectiveCurrentStageId = useMemo(() => {
    if (hasRealtimeStages) {
      return realtimeStageId ?? null;
    }
    return currentStageId ?? null;
  }, [hasRealtimeStages, realtimeStageId, currentStageId]);

  const stageIndex = useMemo(() => {
    if (!effectiveCurrentStageId) return -1;
    return resolvedStages.findIndex(
      (stage) => stage.id === effectiveCurrentStageId
    );
  }, [resolvedStages, effectiveCurrentStageId]);

  const [currentIndex, setCurrentIndex] = useState(0);

  const statusStyles: Record<
    ProgressStatus,
    { label: string; className: string }
  > = {
    idle: {
      label: "idle",
      className: "border-border/60 bg-muted/60 text-muted-foreground/70",
    },
    running: {
      label: "running",
      className: "border-border/70 bg-muted/60 text-muted-foreground/80",
    },
    completed: {
      label: "completed",
      className: "border-emerald-400/50 bg-emerald-500/10 text-emerald-500",
    },
    failed: {
      label: "failed",
      className: "border-destructive/50 bg-destructive/10 text-destructive",
    },
    cancelled: {
      label: "cancelled",
      className: "border-amber-300/60 bg-amber-100/15 text-amber-500",
    },
  };

  const derivedStatus = useMemo<ProgressStatus>(() => {
    if (status !== "idle") return status;

    if (error) return "failed";

    if (statusMessage && statusMessage.toLowerCase().includes("cancel")) {
      return "cancelled";
    }

    if (hasRealtimeStages) {
      if (realtimeStageId === "finalization") {
        return "completed";
      }

      if (stageIndex >= 0 || resolvedStages.length > 0) {
        return "running";
      }
    }

    return "idle";
  }, [
    status,
    error,
    statusMessage,
    hasRealtimeStages,
    realtimeStageId,
    stageIndex,
    resolvedStages,
  ]);

  const statusMeta = statusStyles[derivedStatus] ?? statusStyles.idle;

  useEffect(() => {
    if (!hasRealtimeStages) {
      hasInvalidatedRef.current = false;
      return;
    }

    if (!realtimeStageId) {
      return;
    }

    if (realtimeStageId === "get-sandbox-id") {
      hasInvalidatedRef.current = false;
    }

    const shouldInvalidate = ["save-result", "finalization"].includes(
      realtimeStageId
    );

    if (shouldInvalidate && !hasInvalidatedRef.current) {
      queryClient.invalidateQueries(messagesQueryOptions);
      hasInvalidatedRef.current = true;
    }
  }, [
    hasRealtimeStages,
    realtimeStageId,
    projectId,
    queryClient,
    messagesQueryOptions,
  ]);

  useEffect(() => {
    if (!resolvedStages.length) {
      return;
    }

    if (hasRealtimeStages) {
      if (stageIndex >= 0) {
        setCurrentIndex(stageIndex);
      } else {
        setCurrentIndex((prev) =>
          Math.min(prev, Math.max(resolvedStages.length - 1, 0))
        );
      }
      return;
    }

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % resolvedStages.length);
    }, DISPLAY_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [resolvedStages, stageIndex, hasRealtimeStages]);

  const activeStage = resolvedStages[currentIndex] ?? DEFAULT_PHASES[0];
  const hasNext = resolvedStages.length > 1;
  const nextStage = hasNext
    ? resolvedStages[(currentIndex + 1) % resolvedStages.length]
    : activeStage;
  const progressPercentage = resolvedStages.length
    ? ((currentIndex + 1) / resolvedStages.length) * 100
    : 0;

  return (
    <div className="flex flex-col px-2 pb-4 ml-1.5">
      <div className="flex items-center gap-2 pl-2 mb-3">
        <Logo width={20} height={20} className="shrink-0 rounded-full" />
        <span className="text-sm font-medium text-foreground/90">
          Arccane AI
        </span>
        <span
          className={`inline-flex items-center gap-1 rounded-full border px-2 py-[2px] text-[10px] uppercase tracking-[0.2em] ${statusMeta.className}`}
        >
          <Sparkles className="size-3 text-primary" />
          {statusMeta.label}
        </span>
      </div>

      <div className="relative overflow-hidden rounded-xl border border-border/70 bg-card/80 p-4 shadow-[0px_18px_45px_-32px_rgba(15,23,42,0.35)]">
        {error && (
          <div className="mb-3 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">
            {error}
          </div>
        )}

        {!error && statusMessage && derivedStatus !== "idle" && (
          <div
            className={`mb-3 rounded-lg border px-3 py-2 text-xs ${
              derivedStatus === "cancelled"
                ? "border-amber-300/60 bg-amber-100/15 text-amber-500"
                : derivedStatus === "completed"
                ? "border-emerald-400/50 bg-emerald-500/10 text-emerald-500"
                : "border-border/70 bg-muted/60 text-muted-foreground/80"
            }`}
          >
            {statusMessage}
          </div>
        )}

        <div className="pointer-events-none absolute inset-x-6 top-0 h-20 rounded-b-full bg-primary/10 blur-2xl" />

        <div className="relative flex items-center gap-3">
          <div className="relative flex size-11 items-center justify-center rounded-full border border-border/80 bg-muted/60">
            <span className="absolute inset-0 rounded-full bg-primary/15 blur-md" />
            <span className="absolute inset-1 rounded-full border border-primary/30 animate-ping" />
            <span className="absolute inset-2 rounded-full border border-dashed border-primary/35" />
            <Loader2 className="relative size-4 animate-spin text-primary" />
          </div>

          <div className="flex-1">
            <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground/80">
              Agent status
            </p>
            <h3 className="text-base font-semibold text-foreground">
              {activeStage.title}
            </h3>
            <p className="text-sm text-muted-foreground/80">
              {activeStage.description}
            </p>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted/50">
            <div
              className="h-full rounded-full bg-primary/60 transition-[width] duration-700 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground/80">
            <span className="inline-flex items-center gap-2">
              <span className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground/70">
                Next
              </span>
              <span className="font-medium text-foreground/80">
                {nextStage.title}
              </span>
            </span>
            <AnimatedDots />
          </div>
        </div>

        <div className="mt-5 border-t border-border/60 pt-4">
          <p className="mb-2 text-[11px] uppercase tracking-[0.16em] text-muted-foreground/70">
            Recent steps
          </p>
          <PhaseTimeline stages={resolvedStages} currentIndex={currentIndex} />
        </div>
      </div>
    </div>
  );
};
