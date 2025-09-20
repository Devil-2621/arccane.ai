import Image from "next/image";
import { useState, useEffect } from "react";

const ShimmerMeassages = () => {
  const messages = [
    "Thinking...",
    "Loading...",
    "Generating...",
    "Almost there...",
    "Analyzing your request...",
    "Building you website...",
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
    }, 2000);

    return () => clearInterval(interval);
  }, [messages.length]);
  return (
    <div className="felx items-center gap-2">
      <span className="text-base text-muted-foreground animate-pulse">
        {messages[currentMessageIndex]}
      </span>
    </div>
  );
};

export const MessageLoading = () => {
  return (
    <div className="flex flex-col group px-2 pb-4">
      <div className="flex items-center gap-2 pl-2 mb-2">
        <Image
          src="/Arccane_logo_dark.svg"
          alt="Arccane Logo"
          width={20}
          height={20}
          className="shrink-0"
        />
        <span className="text-sm font-medium">Arccane</span>
      </div>
      <div className="pl-8 flex flex-col gap-y-4">
        <ShimmerMeassages />
      </div>
    </div>
  );
};
