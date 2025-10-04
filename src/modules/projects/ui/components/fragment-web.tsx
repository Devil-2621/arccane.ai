"use client";

import { useState, type ReactNode } from "react";
import {
  ExternalLinkIcon,
  RefreshCcwDotIcon,
  MonitorSmartphone,
  FileCode2,
  Sparkles,
  Loader2,
} from "lucide-react";

import { Fragment } from "@/generated/prisma";
import { Button } from "@/components/ui/button";
import { Hint } from "@/components/hint";

interface Props {
  data: Fragment;
}

function normalizeSandboxUrl(url?: string | null) {
  if (!url) return null;

  const trimmed = url.trim();
  if (!trimmed) return null;

  const ensureProtocol = (input: string) =>
    /^https?:\/\//i.test(input) ? input : `https://${input}`;

  try {
    const parsed = new URL(ensureProtocol(trimmed));
    parsed.protocol = "https:";
    return parsed.toString();
  } catch {
    const sanitized = trimmed.replace(/^https?:\/\//i, "").replace(/^\/+/, "");
    if (!sanitized) return null;
    return `https://${sanitized}`;
  }
}

export function FragmentWeb({ data }: Props) {
  const [fragmentKey, setFragmentKey] = useState(0);
  const [copied, setCopied] = useState(false);

  const safeSandboxUrl = normalizeSandboxUrl(data.sandboxUrl);

  const onRefresh = () => {
    setFragmentKey((prev) => prev + 1);
  };

  const handleCopy = () => {
    if (!safeSandboxUrl) return;
    navigator.clipboard.writeText(safeSandboxUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col w-full h-full">
      <div className="p-2 border-b bg-sidebar flex items-center gap-x-2">
        <Hint text="Refresh" side="bottom" align="start">
          <Button size="sm" variant="outline" onClick={onRefresh}>
            <RefreshCcwDotIcon className="size-4" />
          </Button>
        </Hint>
        <Hint text="Click to copy" side="bottom">
          <Button
            size="sm"
            variant="outline"
            onClick={handleCopy}
            disabled={!safeSandboxUrl || copied}
            className="flex-1 justify-start text-start font-normal"
          >
            <span className="truncate">
              {copied
                ? "Copied to clipboard"
                : safeSandboxUrl ?? "Waiting for preview"}
            </span>
          </Button>
        </Hint>
        <Hint text="Open in a new tab" side="bottom" align="start">
          <Button
            size="sm"
            disabled={!safeSandboxUrl}
            variant="outline"
            onClick={() => {
              if (!safeSandboxUrl) return;
              window.open(safeSandboxUrl, "_blank");
            }}
          >
            <ExternalLinkIcon className="size-4" />
          </Button>
        </Hint>
      </div>
      {safeSandboxUrl ? (
        <iframe
          key={fragmentKey}
          className="h-full w-full bg-background"
          sandbox="allow-forms allow-scripts allow-same-origin"
          loading="lazy"
          src={safeSandboxUrl}
        />
      ) : (
        <FragmentPlaceholder variant="preview" />
      )}
    </div>
  );
}

type FragmentPlaceholderProps = {
  variant: "preview" | "code";
};

const VARIANT_COPY: Record<
  FragmentPlaceholderProps["variant"],
  {
    icon: ReactNode;
    label: string;
    title: string;
    description: string;
    hint: string;
  }
> = {
  preview: {
    icon: <MonitorSmartphone className="size-6 text-primary" />,
    label: "Live demo incoming",
    title: "Your interactive preview is nearly here",
    description:
      "We’re wiring the sandbox, syncing assets, and giving your build a fresh coat of polish.",
    hint: "The moment the agent publishes, the preview pops in right here.",
  },
  code: {
    icon: <FileCode2 className="size-6 text-primary" />,
    label: "Code drop loading",
    title: "Hold tight—source files are compiling",
    description:
      "The agent is capturing diffs, formatting with care, and bundling every file for review.",
    hint: "Once ready, navigate the folders, copy snippets, and keep iterating.",
  },
};

export function FragmentPlaceholder({ variant }: FragmentPlaceholderProps) {
  const copy = VARIANT_COPY[variant];

  return (
    <div className="relative flex h-full min-h-[320px] flex-col items-center justify-center overflow-hidden border border-dashed border-border/70 bg-muted/20 px-8 py-12 text-center">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_0%,color-mix(in_oklch,var(--primary)_30%,transparent)_0%,transparent_70%)] opacity-70" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(160deg,rgba(15,23,42,0.12)_0%,rgba(15,23,42,0.04)_45%,transparent_100%)]" />

      <div className="relative z-10 flex flex-col items-center gap-4">
        <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/70 px-4 py-1 text-[11px] uppercase tracking-[0.28em] text-muted-foreground/90">
          <Sparkles className="size-4 text-primary" /> {copy.label}
        </span>
        <div className="flex items-center justify-center rounded-full border border-primary/20 bg-primary/10 p-6">
          <div className="relative flex size-14 items-center justify-center">
            <span className="absolute inset-0 rounded-full border border-primary/30 animate-[ping_2s_linear_infinite]" />
            <span className="absolute inset-1 rounded-full bg-primary/15 blur-md" />
            <Loader2 className="relative size-6 animate-spin text-primary" />
          </div>
        </div>

        <div className="flex flex-col items-center gap-2">
          <h3 className="text-xl font-semibold text-foreground md:text-2xl">
            {copy.title}
          </h3>
          <p className="max-w-xl text-sm text-muted-foreground md:text-base">
            {copy.description}
          </p>
        </div>

        <p className="text-xs text-muted-foreground/80">{copy.hint}</p>

        <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/70 px-4 py-1 text-xs text-muted-foreground/90">
          {copy.icon}
          <span>Stay tuned—this space updates automatically.</span>
        </div>
      </div>
    </div>
  );
}
