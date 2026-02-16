"use client";

import { getBadgeLabel, getBadgeColor } from "@/lib/helpers";
import { Shield, Swords, Crown, Star, Flame, Zap, Award, CircleOff } from "lucide-react";
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

export function BadgeDisplay({ badge, size = "md", showLabel = true }: BadgeDisplayProps) {
  const label = getBadgeLabel(badge);
  const color = getBadgeColor(badge);

  const sizeClasses = {
    sm: "text-xs gap-1 px-2 py-0.5",
    md: "text-sm gap-1.5 px-2.5 py-1",
    lg: "text-base gap-2 px-3 py-1.5",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-neutral-900 text-white",
        color,
        sizeClasses[size]
      )}
    >
      {BADGE_ICONS[badge]}
      {showLabel && label}
    </span>
  );
}
