"use client";

import { DareStatus } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Check, Circle, X, AlertTriangle } from "lucide-react";

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
      <div className="flex items-center justify-center gap-2.5 rounded-2xl bg-rose-50/90 px-4 py-3 border border-rose-200/80 shadow-xs">
        <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-rose-100/80 text-rose-600">
          <X className="h-4 w-4 stroke-[3]" />
        </div>
        <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-rose-700">
          Dare Cancelled & Escrow Refunded
        </span>
      </div>
    );
  }

  const activeIndex =
    status === DareStatus.Disputed
      ? 2
      : steps.findIndex((s) => s.status === status);

  return (
    <div className="flex items-center gap-1.5 w-full min-w-0 py-1">
      {steps.map((step, i) => {
        const isComplete = i < activeIndex || status === DareStatus.Resolved;
        const isActive = i === activeIndex && status !== DareStatus.Resolved;
        const isDisputed = status === DareStatus.Disputed && i === 2;

        return (
          <div key={step.label} className="flex min-w-0 flex-1 items-center">
            <div className="flex min-w-0 flex-1 flex-col items-center gap-1.5">
              {/* Stepper Glass Node */}
              <div
                className={cn(
                  "relative flex h-9 w-9 shrink-0 sm:h-10 sm:w-10 items-center justify-center rounded-2xl transition-all duration-300 border shadow-xs",
                  isComplete &&
                    "bg-gradient-to-br from-emerald-50 via-white to-emerald-100/70 border-emerald-200/90 text-emerald-600 shadow-[0_4px_14px_rgba(16,185,129,0.18)] scale-105",
                  isActive &&
                    !isDisputed &&
                    "bg-gradient-to-br from-blue-50 via-white to-blue-100/80 border-[#0052FF]/60 text-[#0052FF] shadow-[0_4px_16px_rgba(0,82,255,0.22)] scale-110 ring-4 ring-blue-100/70",
                  isDisputed &&
                    "bg-gradient-to-br from-rose-50 via-white to-rose-100/80 border-rose-300 text-rose-600 shadow-[0_4px_16px_rgba(244,63,94,0.22)] scale-110 ring-4 ring-rose-100/70",
                  !isComplete &&
                    !isActive &&
                    !isDisputed &&
                    "bg-white/80 border-slate-200/70 text-slate-300"
                )}
              >
                {/* Active Sonar Ring for Live Stage */}
                {isActive && (
                  <span className="absolute -inset-1 rounded-2xl border-2 border-[#0052FF]/30 animate-ping opacity-70 pointer-events-none" />
                )}
                {isDisputed && (
                  <span className="absolute -inset-1 rounded-2xl border-2 border-rose-500/30 animate-ping opacity-70 pointer-events-none" />
                )}

                {isComplete ? (
                  <Check className="h-4 w-4 sm:h-4.5 sm:w-4.5 stroke-[3]" />
                ) : isDisputed ? (
                  <AlertTriangle className="h-4 w-4 sm:h-4.5 sm:w-4.5 stroke-[2.5]" />
                ) : isActive ? (
                  <span className="h-2 w-2 rounded-full bg-[#0052FF] animate-pulse" />
                ) : (
                  <Circle className="h-3 w-3 stroke-[2.2]" />
                )}
              </div>

              {/* Stage Text Label */}
              <span
                className={cn(
                  "whitespace-nowrap text-center text-[10px] sm:text-[11px] font-black tracking-tight",
                  isComplete && "text-emerald-700",
                  isActive && !isDisputed && "text-[#0052FF]",
                  isDisputed && "text-rose-600",
                  !isComplete &&
                    !isActive &&
                    !isDisputed &&
                    "text-slate-400 font-semibold"
                )}
              >
                {isDisputed ? "Disputed" : step.label}
              </span>
            </div>

            {/* Connecting Bridge Track Line */}
            {i < steps.length - 1 && (
              <div
                className={cn(
                  "h-1 min-w-0 flex-1 -mt-4.5 rounded-full transition-all duration-300",
                  i < activeIndex || status === DareStatus.Resolved
                    ? "bg-gradient-to-r from-emerald-400 to-emerald-500 shadow-[0_1px_6px_rgba(16,185,129,0.2)]"
                    : "bg-slate-100"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}