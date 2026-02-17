"use client";

import { DareStatus } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Check, Circle, X } from "lucide-react";

interface DareTimelineProps {
  status: number;
}

const steps = [
  { label: "Open", status: DareStatus.Open },
  { label: "Running", status: DareStatus.Running },
  { label: "Proof", status: DareStatus.ProofSubmitted },
  { label: "Resolved", status: DareStatus.Resolved },
];

export function DareTimeline({ status }: DareTimelineProps) {
  if (status === DareStatus.Cancelled) {
    return (
      <div className="flex items-center justify-center gap-2 rounded-lg bg-red-500/10 px-4 py-2 border border-red-500/40">
        <X className="h-4 w-4 text-red-400" />
        <span className="text-sm font-medium text-red-400">Cancelled</span>
      </div>
    );
  }

  const activeIndex =
    status === DareStatus.Disputed
      ? 2
      : steps.findIndex((s) => s.status === status);

  return (
    <div className="flex items-center gap-1 w-full">
      {steps.map((step, i) => {
        const isComplete = i < activeIndex || status === DareStatus.Resolved;
        const isActive = i === activeIndex && status !== DareStatus.Resolved;
        const isDisputed = status === DareStatus.Disputed && i === 2;

        return (
          <div key={step.label} className="flex items-center flex-1">
            <div className="flex flex-col items-center gap-1 flex-1">
              <div
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium transition-colors border",
                  isComplete &&
                    "bg-emerald-500 text-black border-emerald-400 shadow-[0_0_14px_rgba(16,185,129,0.7)]",
                  isActive &&
                    !isDisputed &&
                    "bg-[#f5d566] text-black border-[rgba(212,175,55,0.9)] shadow-[0_0_14px_rgba(245,213,102,0.7)] animate-glow",
                  isDisputed &&
                    "bg-red-500 text-black border-red-400 shadow-[0_0_14px_rgba(248,113,113,0.7)] animate-glow",
                  !isComplete &&
                    !isActive &&
                    !isDisputed &&
                    "bg-black border-white/10 text-white/50"
                )}
              >
                {isComplete ? (
                  <Check className="h-3.5 w-3.5" />
                ) : (
                  <Circle className="h-3 w-3" />
                )}
              </div>
              <span
                className={cn(
                  "text-[10px] font-medium",
                  isComplete && "text-emerald-400",
                  isActive && !isDisputed && "text-[#f5d566]",
                  isDisputed && "text-red-400",
                  !isComplete &&
                    !isActive &&
                    !isDisputed &&
                    "text-white/45"
                )}
              >
                {isDisputed ? "Disputed" : step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={cn(
                  "h-0.5 flex-1 -mt-4",
                  i < activeIndex || status === DareStatus.Resolved
                    ? "bg-emerald-500"
                    : "bg-white/10"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
