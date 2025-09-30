"use client";

import { useEffect, useState } from "react";

import Link from "next/link";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { formatDistanceToNow } from "date-fns";
import { useQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export const ProjectsList = () => {
  const trpc = useTRPC();
  const { user } = useUser();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  // Ensure this runs only after hydration
  useEffect(() => setMounted(true), []);
  const { data: projects } = useQuery(trpc.projects.getMany.queryOptions());

  const logoSrc = !mounted
    ? "/Arccane_logo.svg" // fallback during SSR (same everywhere)
    : resolvedTheme === "light"
    ? "/Arccane_logo_dark.svg"
    : "/Arccane_logo.svg";

  if (!projects) return null;
  if (!user) return null;

  return (
    <div className="w-full bg-sidebar rounded-xl p-8 border flex flex-col gap-y-6 sm:gap-y-4">
      <h2 className="text-2xl font-semibold">{user?.firstName}&apos;s Arcs</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {projects.length === 0 && (
          <div className="col-span-full text-center">
            <p className=" text-sm text-muted-foreground">No projects found.</p>
          </div>
        )}
        {projects?.map((project) => (
          <Button
            key={project.id}
            variant="outline"
            className="font-normal h-auto justify-start w-full text-start p-4"
            asChild
          >
            <Link
              href={`/projects/${project.id}`}
              className="flex flex-col items-start gap-2 w-full"
            >
              <div className="flex items-center gap-x-4">
                <Image
                  src={logoSrc}
                  alt="Arccane Logo"
                  width={32}
                  height={32}
                  className="object-contain rounded-full"
                />
                <div className="flex flex-col ">
                  <h3 className="truncate font-medium">
                    {project.name || "Untitled Project"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {formatDistanceToNow(project.updatedAt, {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>
            </Link>
          </Button>
        ))}
      </div>
    </div>
  );
};
