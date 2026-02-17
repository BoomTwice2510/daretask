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

const BADGE_ICONS: Record<number, React.ReactNode> = {
  0: <CircleOff className="h-4 w-4" />,
  1: <Shield className="h-4 w-4" />,
  2: <Swords className="h-4 w-4" />,
  3: <Award className="h-4 w-4" />,
  4: <Flame className="h-4 w-4" />,
  5: <Crown className="h-4 w-4" />,
  6: <Star className="h-4 w-4" />,
  7: <Zap className="h-4 w-4" />,
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
  const label = getBadgeLabel(badge);
  const color = getBadgeColor(badge);

  const sizeClasses = {
    sm: "text-[11px] gap-1 px-2 py-0.5",
    md: "text-xs gap-1.5 px-2.5 py-1",
    lg: "text-sm gap-2 px-3 py-1.5",
  };

  const isTopBadge = badge >= 5; // 5,6,7 ke liye thoda extra glow

  return (
    <span
      className={cn(
        "group inline-flex items-center rounded-full border border-[rgba(212,175,55,0.35)] bg-[rgba(10,10,10,0.9)] text-white/90 shadow-[0_0_18px_rgba(0,0,0,0.6)]",
        "transition-all duration-200 hover:-translate-y-[1px] hover:shadow-[0_0_26px_rgba(245,213,102,0.55)]",
        color,
        sizeClasses[size]
      )}
    >
      <span
        className={cn(
          "relative flex items-center justify-center",
          isTopBadge && "animate-glow"
        )}
      >
        {BADGE_ICONS[badge]}
      </span>
      {showLabel && (
        <span className="whitespace-nowrap group-hover:text-[#f5d566] transition-colors">
          {label}
        </span>
      )}
    </span>
  );
}
