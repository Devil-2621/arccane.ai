"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { AlertTriangle, ArrowLeft, RefreshCcw } from "lucide-react";

import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";

type ErrorProjectProps = {
  projectId?: string;
  error?: (Error & { digest?: string }) | null;
  resetErrorBoundary?: () => void;
};

const projectRecoverySuggestions = [
  "Retry loading the project to fetch the latest workspace data.",
  "Confirm the project still exists and that you have access to it.",
  "If the problem persists, share the reference code with the team for a quick fix.",
];

export const ErrorProject = ({
  projectId,
  error,
  resetErrorBoundary,
}: ErrorProjectProps) => {
  const router = useRouter();

  useEffect(() => {
    if (error) {
      console.error("Project section error", { projectId, error });
    } else {
      console.error("Project section error: unknown");
    }
  }, [projectId, error]);

  const handleRetry = () => {
    if (resetErrorBoundary) {
      resetErrorBoundary();
      return;
    }

    router.refresh();
  };

  return (
    <div className="relative flex min-h-full flex-1 flex-col overflow-hidden bg-background">
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
                <AlertTriangle className="size-6" aria-hidden />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground/70">
                  Project view issue
                </p>
                <h2 className="mt-1 text-2xl font-semibold text-foreground sm:text-3xl">
                  We couldn’t load this project
                </h2>
              </div>
            </div>
            <Logo width={38} height={38} className="size-10 rounded-full" />
          </div>

          <p className="mt-6 text-base leading-relaxed text-muted-foreground">
            Something interrupted the project panel while it was fetching data.
            Your project files are safe—try again or jump back to keep working
            elsewhere.
          </p>

          <ul className="mt-6 flex flex-col gap-3 text-sm leading-6 text-muted-foreground/90">
            {projectRecoverySuggestions.map((tip) => (
              <li
                key={tip}
                className="flex items-start gap-3 rounded-lg border border-border/50 bg-muted/30 px-4 py-3"
              >
                <span className="mt-1 inline-flex size-1.5 rounded-full bg-primary/70" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>

          {error?.digest && (
            <div className="mt-6 rounded-lg border border-primary/25 bg-primary/10 px-4 py-3 text-xs text-primary">
              <p className="font-semibold uppercase tracking-wide text-primary/80">
                Reference code
              </p>
              <code className="mt-1 block truncate font-mono text-sm">
                {error.digest}
              </code>
            </div>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Button onClick={handleRetry} className="gap-2">
              <RefreshCcw className="size-4" />
              Retry load
            </Button>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => router.back()}
              >
                <ArrowLeft className="size-4" />
                Go back
              </Button>
              <Button variant="tertiary" asChild className="gap-2">
                <Link href="/">Home</Link>
              </Button>
            </div>
          </div>
        </motion.section>
      </main>
    </div>
  );
};

export default ErrorProject;
