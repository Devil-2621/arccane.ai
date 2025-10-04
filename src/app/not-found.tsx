"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowLeft, Compass, Home, Mail, Sparkles } from "lucide-react";

import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";

const explorationTips = [
  "Double-check the project link or prompt you followed—sometimes the path shifts after a generation.",
  "Browse the dashboard to jump into an existing workspace or start something new from scratch.",
  "Need a hand? Reach out and share your latest prompt so we can point you to the right place fast.",
];

const NotFoundPage = () => {
  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden bg-background">
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-[10%] h-80 w-80 rounded-full bg-primary/25 blur-3xl dark:bg-primary/20"
        animate={{ opacity: [0.4, 0.75, 0.5], scale: [1, 1.1, 1] }}
        transition={{ duration: 13, repeat: Infinity, repeatType: "mirror" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -bottom-28 right-[8%] h-72 w-72 rounded-full bg-secondary/35 blur-3xl dark:bg-secondary/25"
        animate={{
          opacity: [0.3, 0.6, 0.3],
          scale: [1.05, 0.95, 1.05],
          rotate: [0, -4, 6],
        }}
        transition={{ duration: 18, repeat: Infinity, repeatType: "mirror" }}
      />

      <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="w-full max-w-3xl rounded-2xl border border-border/60 bg-card/85 p-8 shadow-xl shadow-black/5 backdrop-blur sm:p-12"
        >
          <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-muted/40 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground/70">
                <Sparkles className="size-3.5 text-primary" aria-hidden />
                Lost in transit
              </span>
              <div>
                <h1 className="text-3xl font-semibold text-foreground sm:text-4xl">
                  The page you’re scouting doesn’t exist
                </h1>
                <p className="mt-3 max-w-xl text-base leading-relaxed text-muted-foreground">
                  We traced every branch and couldn’t find this route. It might
                  have moved, been renamed, or never existed. Let’s navigate you
                  back to safer terrain.
                </p>
              </div>
            </div>
            <Logo width={56} height={56} className="size-12 rounded-full" />
          </div>

          <motion.div
            className="mt-10 grid gap-6 rounded-2xl border border-border/60 bg-muted/20 p-6 sm:grid-cols-[auto,1fr] sm:items-center"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.4, ease: "easeOut" }}
          >
            <div className="relative mx-auto flex size-28 items-center justify-center rounded-2xl bg-primary/10">
              <motion.div
                className="absolute inset-3 rounded-xl border border-primary/40"
                animate={{ rotate: [0, -6, 4, 0] }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  repeatType: "mirror",
                }}
              />
              <motion.span
                className="text-5xl font-black tracking-tight text-primary"
                animate={{
                  opacity: [0.85, 1, 0.85],
                  scale: [1, 1.04, 1],
                }}
                transition={{
                  duration: 2.6,
                  repeat: Infinity,
                  repeatType: "mirror",
                }}
              >
                404
              </motion.span>
            </div>
            <ul className="space-y-4 text-sm leading-6 text-muted-foreground/90">
              {explorationTips.map((tip) => (
                <li
                  key={tip}
                  className="flex items-start gap-3 rounded-lg border border-border/40 bg-card/60 px-4 py-3"
                >
                  <span className="mt-1 inline-flex size-1.5 rounded-full bg-primary/70" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Button variant="default" asChild className="gap-2">
              <Link href="/">
                <Home className="size-4" />
                Back to dashboard
              </Link>
            </Button>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button variant="outline" className="gap-2" asChild>
                <Link href="/">
                  <Compass className="size-4" />
                  Explore projects
                </Link>
              </Button>
              <Button variant="ghost" className="gap-2" asChild>
                <Link href="">
                  <Mail className="size-4" />
                  Contact support
                </Link>
              </Button>
            </div>
          </div>

          <div className="mt-8 flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-muted-foreground/70">
            <ArrowLeft className="size-3.5" aria-hidden />
            Prefer to go back? Try your previous page and reconnect the
            breadcrumbs.
          </div>
        </motion.section>
      </main>
    </div>
  );
};

export default NotFoundPage;
