"use client";

import { Logo } from "@/components/logo";

import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";

import { ProjectForm } from "@/modules/home/ui/components/project-form";
import { ProjectsList } from "@/modules/home/ui/components/projects-list";
import { Usage } from "@/modules/projects/ui/components/usage";
import { Sparkles } from "lucide-react";

const Page = () => {
  const trpc = useTRPC();
  const { data: usage } = useQuery(trpc.usage.status.queryOptions());
  const showUsage = !!usage;

  return (
    <div className="flex flex-col max-w-5xl mx-auto w-full z-10">
      <section className="space-y-4 py-[5vh] 2xl:py-28">
        <div className="flex flex-col gap-4 items-center justify-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/40 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.3em] shadow-sm">
            <Sparkles className="size-3 text-primary" aria-hidden />
            Arcane AI
          </span>
          <Logo
            width={80}
            height={80}
            className="hidden md:block rounded-full"
          />
        </div>
        <h1 className="text-2xl md:text-5xl font-bold text-center">
          Let&apos;s Build Something Amazing
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground text-center">
          Create apps and websites with Arccane AI. <br />
          Fast, Easy, and with Vibe.
        </p>
        <div className="max-w-4xl mx-auto w-full">
          <ProjectForm />
        </div>
      </section>

      {showUsage && (
        <Usage
          points={usage.remainingPoints}
          msBeforeNext={usage.msBeforeNext}
          isPro={usage.hasProAccess}
          className="max-w-sm"
        />
      )}
      <ProjectsList />
    </div>
  );
};

export default Page;
