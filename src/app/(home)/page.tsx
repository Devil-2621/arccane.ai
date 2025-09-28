"use client";

import Image from "next/image";

import { ProjectForm } from "@/modules/home/ui/components/project-form";
import { ProjectsList } from "@/modules/home/ui/components/projects-llist";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

const Page = () => {
  const { theme, setTheme } = useTheme();
  const currentTheme = theme === "system" ? setTheme : theme;

  return (
    <div className="flex flex-col max-w-5xl mx-auto w-full z-10">
      <section className="space-y-6 py-[16vh] 2xl:py-48">
        <div className="flex felx-col items-center justify-center">
          <Image
            src={
              currentTheme === "light" || currentTheme === "system"
                ? "/Arccane_logo_dark.svg"
                : "/Arccane_logo.svg"
            }
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

      <div className="absolute top-4 right-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>
              Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Page;
