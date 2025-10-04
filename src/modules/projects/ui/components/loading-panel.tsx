"use client";

import { motion } from "motion/react";
import { Loader2 } from "lucide-react";

import { Logo } from "@/components/logo";

type LoadingPanelProps = {
  title?: string;
  subtitle?: string;
  hints?: string[];
  contextLabel?: string;
};

const defaultHints = [
  "Spinning up the project workspace and caching dependencies.",
  "Fetching the latest prompts, conversations, and project state.",
  "Warming the sandbox so you can dive straight into editing.",
];

export const LoadingPanel = ({
  title = "Preparing your workspace",
  subtitle = "We’re getting everything synced before you jump back in.",
  hints = defaultHints,
  contextLabel = "Arccane loading state",
}: LoadingPanelProps) => {
  return (
    <div
      className="relative flex min-h-full flex-1 flex-col overflow-hidden bg-background"
      role="status"
      aria-live="polite"
      aria-label={contextLabel}
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-28 -top-20 h-56 w-56 rounded-full bg-primary/25 blur-3xl dark:bg-primary/20"
        animate={{ opacity: [0.4, 0.75, 0.5], scale: [1, 1.08, 1] }}
        transition={{ duration: 12, repeat: Infinity, repeatType: "mirror" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 left-[-10%] h-64 w-64 rounded-full bg-secondary/40 blur-3xl dark:bg-secondary/25"
        animate={{
          opacity: [0.3, 0.6, 0.3],
          scale: [1.05, 0.92, 1.05],
          rotate: [0, 6, -4],
        }}
        transition={{ duration: 16, repeat: Infinity, repeatType: "mirror" }}
      />

      <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-12 sm:px-6">
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="w-full max-w-xl rounded-2xl border border-border/60 bg-card/80 p-6 shadow-xl shadow-black/5 backdrop-blur sm:p-8"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="inline-flex size-12 items-center justify-center rounded-xl bg-primary/15 text-primary">
                <Loader2 className="size-6 animate-spin" aria-hidden />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground/70">
                  {contextLabel}
                </p>
                <h2 className="mt-1 text-2xl font-semibold text-foreground sm:text-3xl">
                  {title}
                </h2>
              </div>
            </div>
            <Logo width={38} height={38} className="size-10 rounded-full" />
          </div>

          <p className="mt-6 text-base leading-relaxed text-muted-foreground">
            {subtitle}
          </p>

          {!!hints.length && (
            <ul className="mt-6 flex flex-col gap-3 text-sm leading-6 text-muted-foreground/90">
              {hints.map((tip) => (
                <li
                  key={tip}
                  className="flex items-start gap-3 rounded-lg border border-border/50 bg-muted/30 px-4 py-3"
                >
                  <span className="mt-1 inline-flex size-1.5 rounded-full bg-primary/70" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-8 flex items-center gap-3 text-sm text-muted-foreground/80">
            <span className="inline-flex size-2 rounded-full bg-primary/70" />
            <span>Thanks for your patience—this won’t take long.</span>
          </div>
        </motion.section>
      </main>
    </div>
  );
};

export default LoadingPanel;
