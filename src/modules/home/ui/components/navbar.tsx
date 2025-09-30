"use client";

import { useEffect, useState } from "react";

import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
  UserProfile,
} from "@clerk/nextjs";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Laptop, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserControl } from "@/components/user-control";

export const Navbar = () => {
  const { resolvedTheme, theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Ensure this runs only after hydration
  useEffect(() => setMounted(true), []);

  const logoSrc = !mounted
    ? "/Arccane_logo.svg" // fallback during SSR (same everywhere)
    : resolvedTheme === "light"
    ? "/Arccane_logo_dark.svg"
    : "/Arccane_logo.svg";

  return (
    <nav className="p-4 gap-2 bg-transparent sticky top-0 left-0 right-0 z-50 transition-all duration-200 border-b border-transparent">
      <div className="p-3 max-w-5xl mx-auto w-full flex justify-between items-center bg-background shadow-accent shadow-md backdrop-blur-xl border rounded-full">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src={logoSrc}
            alt="Arccane Logo"
            width={32}
            height={32}
            className="rounded-full"
          />
          <span className="font-semibold text-lg">Arccane.ai</span>
        </Link>
        <SignedOut>
          <div className="flex gap-2">
            <SignUpButton>
              <Button variant="outline" size="sm">
                Sign Up
              </Button>
            </SignUpButton>
            <SignInButton>
              <Button size="sm">Sign In</Button>
            </SignInButton>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                >
                  {/* Show correct icon only after hydration */}
                  {mounted && theme === "light" && (
                    <Sun className="h-[1rem] w-[1rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                  )}
                  {mounted && theme === "dark" && (
                    <Moon className="h-[1rem] w-[1rem] scale-0 rotate-0 transition-all dark:scale-100 dark:-rotate-90" />
                  )}
                  {mounted && theme === "system" && (
                    <Laptop className="h-[1rem] w-[1rem] scale-0 rotate-90 transition-all dark:scale-100 dark:-rotate-0" />
                  )}
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  <Sun className="h-[1rem] w-[1rem]" />
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  <Moon className="h-[1rem] w-[1rem]" />
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  <Laptop className="h-[1rem] w-[1rem]" />
                  System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </SignedOut>

        <SignedIn>
          <div className="flex gap-2">
            <UserControl />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                >
                  {/* Show correct icon only after hydration */}
                  {mounted && theme === "light" && (
                    <Sun className="h-[1rem] w-[1rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                  )}
                  {mounted && theme === "dark" && (
                    <Moon className="h-[1rem] w-[1rem] scale-0 rotate-0 transition-all dark:scale-100 dark:-rotate-90" />
                  )}
                  {mounted && theme === "system" && (
                    <Laptop className="h-[1rem] w-[1rem] scale-0 rotate-90 transition-all dark:scale-100 dark:-rotate-0" />
                  )}
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  <Sun className="h-[1rem] w-[1rem]" />
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  <Moon className="h-[1rem] w-[1rem]" />
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  <Laptop className="h-[1rem] w-[1rem]" />
                  System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </SignedIn>
      </div>
    </nav>
  );
};
