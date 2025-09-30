"use client";

import { useEffect, useState } from "react";

import Image from "next/image";
import { useTheme } from "next-themes";

import { ProjectForm } from "@/modules/home/ui/components/project-form";
import { ProjectsList } from "@/modules/home/ui/components/projects-llist";

const Page = () => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Ensure this runs only after hydration
  useEffect(() => setMounted(true), []);

  const logoSrc = !mounted
    ? "/Arccane_logo.svg" // fallback during SSR (same everywhere)
    : resolvedTheme === "light"
    ? "/Arccane_logo_dark.svg"
    : "/Arccane_logo.svg";

  return (
    <div className="flex flex-col max-w-5xl mx-auto w-full z-10">
      <section className="space-y-6 py-[16vh] 2xl:py-48">
        <div className="flex flex-col items-center justify-center">
          <Image
            src={logoSrc}
            alt="Arccane Logo"
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

      <ProjectsList />
    </div>
  );
};

export default Page;
