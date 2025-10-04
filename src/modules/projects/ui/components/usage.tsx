import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { CrownIcon } from "lucide-react";
import { formatDuration, intervalToDuration } from "date-fns";

import { Button } from "@/components/ui/button";
import { useMemo } from "react";

interface Props {
  points: number;
  msBeforeNext: number;
  className?: string;
  isPro?: boolean;
}

export const Usage = ({ points, msBeforeNext, className, isPro }: Props) => {
  const { has } = useAuth();
  const hasProAccess = isPro ?? has?.({ plan: "pro" });

  const resetTime = useMemo(() => {
    try {
      const duration = intervalToDuration({
        start: new Date(),
        end: new Date(Date.now() + Math.max(msBeforeNext, 0)),
      });

      const formatted = formatDuration(duration, {
        format: ["months", "days", "hours"],
      });

      return formatted || "soon";
    } catch (error) {
      console.error("Error formatting duration ", error);
      return "unknown";
    }
  }, [msBeforeNext]);

  return (
    <div
      className={`rounded-t-lg bg-background border border-b-0 p-2.5 ${className}`}
    >
      <div className="flex items-center gap-x-2">
        <div>
          <p className="text-sm">
            {points} {hasProAccess ? "" : "free"} credits remaining
          </p>
          <p className="text-xs text-muted-foreground">Resets in {resetTime}</p>
        </div>
        {!hasProAccess && (
          <Button asChild size="sm" variant="tertiary" className="ml-auto">
            <Link href="/pricing">
              <CrownIcon />
              Upgrade
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
};
