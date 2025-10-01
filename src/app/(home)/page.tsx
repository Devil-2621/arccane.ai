"use client";

import { Logo } from "@/components/logo";

import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";

import { ProjectForm } from "@/modules/home/ui/components/project-form";
import { ProjectsList } from "@/modules/home/ui/components/projects-llist";
import { Usage } from "@/modules/projects/ui/components/usage";

const Page = () => {
  const trpc = useTRPC();
  const { data: usage } = useQuery(trpc.usage.status.queryOptions());
  const showUsage = !!usage;

  return (
    <div className="flex flex-col max-w-5xl mx-auto w-full z-10">
      <section className="space-y-6 py-[16vh] 2xl:py-48">
        <div className="flex flex-col items-center justify-center">
          <Logo
            width={80}
            height={80}
            className="hidden md:block rounded-full"
          />
        </div>
        <h1 className="text-2xl md:text-5xl font-bold text-center">
          Build Something Amazing with Arccane AI
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground text-center">
          Create apps and websites with Arccane AI. <br />
          Fast, Easy, and with Vibe.
        </p>
        <div className="max-w-3xl mx-auto w-full">
          <ProjectForm />
        </div>
      </section>

      {showUsage && (
        <Usage
          points={usage.remainingPoints}
          msBeforeNext={usage.msBeforeNext}
          className="max-w-sm"
        />
      )}
      <ProjectsList />
    </div>
  );
};

export default Page;
