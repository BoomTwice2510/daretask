"use client";

import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface GlassIconProps {
  icon: LucideIcon;
  tone?: "blue" | "emerald" | "amber" | "violet" | "rose" | "indigo";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  animate?: boolean;
}

const TONES = {
  blue: {
    bg: "bg-gradient-to-br from-blue-50/90 via-white to-blue-100/50",
    border: "border-blue-200/60 shadow-[0_4px_16px_rgba(0,82,255,0.12)]",
    icon: "text-[#0052FF]",
    glow: "bg-blue-400/20",
  },
  emerald: {
    bg: "bg-gradient-to-br from-emerald-50/90 via-white to-emerald-100/50",
    border: "border-emerald-200/60 shadow-[0_4px_16px_rgba(16,185,129,0.12)]",
    icon: "text-emerald-600",
    glow: "bg-emerald-400/20",
  },
  amber: {
    bg: "bg-gradient-to-br from-amber-50/90 via-white to-amber-100/50",
    border: "border-amber-200/60 shadow-[0_4px_16px_rgba(245,158,11,0.12)]",
    icon: "text-amber-600",
    glow: "bg-amber-400/20",
  },
  violet: {
    bg: "bg-gradient-to-br from-violet-50/90 via-white to-violet-100/50",
    border: "border-violet-200/60 shadow-[0_4px_16px_rgba(139,92,246,0.12)]",
    icon: "text-violet-600",
    glow: "bg-violet-400/20",
  },
  rose: {
    bg: "bg-gradient-to-br from-rose-50/90 via-white to-rose-100/50",
    border: "border-rose-200/60 shadow-[0_4px_16px_rgba(244,63,94,0.12)]",
    icon: "text-rose-600",
    glow: "bg-rose-400/20",
  },
  indigo: {
    bg: "bg-gradient-to-br from-indigo-50/90 via-white to-indigo-100/50",
    border: "border-indigo-200/60 shadow-[0_4px_16px_rgba(99,102,241,0.12)]",
    icon: "text-indigo-600",
    glow: "bg-indigo-400/20",
  },
};

const SIZES = {
  sm: { box: "h-8 w-8 rounded-xl", icon: "h-4 w-4 stroke-[2.2]" },
  md: { box: "h-10 w-10 rounded-2xl", icon: "h-5 w-5 stroke-[2.2]" },
  lg: { box: "h-12 w-12 rounded-[18px]", icon: "h-6 w-6 stroke-[2.2]" },
  xl: { box: "h-14 w-14 rounded-2xl", icon: "h-7 w-7 stroke-[2.4]" },
};

export function GlassIcon({
  icon: Icon,
  tone = "blue",
  size = "md",
  className,
  animate = false,
}: GlassIconProps) {
  const selectedTone = TONES[tone];
  const selectedSize = SIZES[size];

  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center backdrop-blur-xl border transition-all duration-300",
        selectedTone.bg,
        selectedTone.border,
        selectedSize.box,
        animate && "hover:rotate-6 hover:scale-110",
        className
      )}
    >
      {/* Micro-glow aura inside */}
      <div
        className={cn(
          "pointer-events-none absolute inset-1.5 rounded-full blur-sm opacity-50",
          selectedTone.glow
        )}
      />
      {/* Front Icon with crisp stroke */}
      <Icon className={cn("relative z-10 transition-transform", selectedTone.icon, selectedSize.icon)} />
    </div>
  );
}