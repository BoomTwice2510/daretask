"use client";

import { getBadgeLabel, getBadgeColor } from "@/lib/helpers";
import {
  Shield,
  Swords,
  Crown,
  Star,
  Flame,
  Zap,
  Award,
  CircleOff,
} from "lucide-react";
import { cn } from "@/lib/utils";

const BADGE_CONFIG: Record<
  number,
  {
    icon: React.ComponentType<{ className?: string }>;
    tone: string;
    iconColor: string;
    border: string;
    glow: string;
  }
> = {
  0: {
    icon: CircleOff,
    tone: "bg-slate-50/90 text-slate-500",
    iconColor: "text-slate-400",
    border: "border-slate-200/80",
    glow: "shadow-[0_2px_8px_rgba(15,23,42,0.03)]",
  },
  1: {
    icon: Shield,
    tone: "bg-gradient-to-r from-blue-50/90 to-blue-100/60 text-[#0052FF]",
    iconColor: "text-[#0052FF]",
    border: "border-blue-200/80",
    glow: "shadow-[0_2px_10px_rgba(0,82,255,0.12)]",
  },
  2: {
    icon: Swords,
    tone: "bg-gradient-to-r from-indigo-50/90 to-indigo-100/60 text-indigo-600",
    iconColor: "text-indigo-600",
    border: "border-indigo-200/80",
    glow: "shadow-[0_2px_10px_rgba(99,102,241,0.14)]",
  },
  3: {
    icon: Award,
    tone: "bg-gradient-to-r from-emerald-50/90 to-emerald-100/60 text-emerald-700",
    iconColor: "text-emerald-600",
    border: "border-emerald-200/80",
    glow: "shadow-[0_2px_10px_rgba(16,185,129,0.14)]",
  },
  4: {
    icon: Flame,
    tone: "bg-gradient-to-r from-amber-50/90 to-amber-100/60 text-amber-700",
    iconColor: "text-amber-600",
    border: "border-amber-200/80",
    glow: "shadow-[0_2px_12px_rgba(245,158,11,0.16)]",
  },
  5: {
    icon: Crown,
    tone: "bg-gradient-to-r from-amber-100/90 via-amber-50 to-yellow-100/80 text-amber-800",
    iconColor: "text-amber-600",
    border: "border-amber-300/90",
    glow: "shadow-[0_4px_16px_rgba(245,158,11,0.22)]",
  },
  6: {
    icon: Star,
    tone: "bg-gradient-to-r from-violet-50/90 to-purple-100/70 text-violet-700",
    iconColor: "text-violet-600",
    border: "border-violet-200/90",
    glow: "shadow-[0_4px_16px_rgba(139,92,246,0.22)]",
  },
  7: {
    icon: Zap,
    tone: "bg-gradient-to-r from-rose-50/90 via-amber-50/80 to-blue-50/90 text-slate-900",
    iconColor: "text-[#0052FF]",
    border: "border-blue-300/90",
    glow: "shadow-[0_4px_20px_rgba(0,82,255,0.25)]",
  },
};

interface BadgeDisplayProps {
  badge: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export function BadgeDisplay({
  badge,
  size = "md",
  showLabel = true,
}: BadgeDisplayProps) {
  const label = getBadgeLabel(badge); //
  const config = BADGE_CONFIG[badge] || BADGE_CONFIG[0];
  const IconComponent = config.icon;
  const isTopBadge = badge >= 5; //[cite: 22]

  const sizeClasses = {
    sm: "text-[10px] gap-1 px-2 py-0.5 rounded-full",
    md: "text-[11.5px] gap-1.5 px-2.5 py-1 rounded-full",
    lg: "text-xs gap-2 px-3.5 py-1.5 rounded-2xl",
  };

  const iconSizes = {
    sm: "h-3 w-3 stroke-[2.4]",
    md: "h-3.5 w-3.5 stroke-[2.4]",
    lg: "h-4 w-4 stroke-[2.4]",
  };

  return (
    <span
      className={cn(
        "group relative inline-flex items-center font-black tracking-tight border transition-all duration-300 backdrop-blur-md cursor-default",
        config.tone,
        config.border,
        config.glow,
        sizeClasses[size],
        "hover:-translate-y-0.5 hover:scale-105"
      )}
    >
      {/* 3D Glass Layered Micro-Icon Container */}
      <span className="relative flex items-center justify-center">
        {isTopBadge && (
          <span className="absolute -inset-1 rounded-full bg-current opacity-20 animate-ping pointer-events-none" />
        )}
        <IconComponent className={cn(iconSizes[size], config.iconColor, "transition-transform group-hover:rotate-6")} />
      </span>

      {/* Label Text */}
      {showLabel && (
        <span className="whitespace-nowrap font-black leading-none">
          {label}
        </span>
      )}
    </span>
  );
}