"use client";

import { useState, useEffect } from "react";

import { useTheme } from "next-themes";
import Image from "next/image";

const ShimmerMessages = () => {
  const messages = [
    "Thinking...",
    "Loading...",
    "Generating...",
    "Almost there...",
    "Analyzing your request...",
    "Building your website...",
    "Crafting components...",
    "Optimizing Layout...",
    "Adding final touches...",
    "Almost ready...",
    "Just a moment...",
    "Preparing your content...",
  ];

  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [messages.length]);
  return (
    <div className="flex items-center gap-2">
      <span className="text-base text-muted-foreground animate-pulse">
        {messages[currentMessageIndex]}
      </span>
    </div>
  );
};

export const MessageLoading = () => {
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
    <div className="flex flex-col group px-2 pb-4">
      <div className="flex items-center gap-2 pl-2 mb-2">
        <Image
          src={logoSrc}
          alt="Arccane Logo"
          width={20}
          height={20}
          className="shrink-0 rounded-full"
        />
        <span className="text-sm font-medium">Arccane</span>
      </div>
      <div className="pl-8 flex flex-col gap-y-4">
        <ShimmerMessages />
      </div>
    </div>
  );
};
