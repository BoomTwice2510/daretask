"use client";

import type { UserStats } from "@/lib/types";
import { formatStake } from "@/lib/helpers";
import { BadgeDisplay } from "@/components/badge-display";
import { BADGE_XP_THRESHOLDS, BADGE_LABELS } from "@/lib/contract";
import {
  Trophy,
  Target,
  Flame,
  Coins,
  Shield,
  Swords,
  TrendingUp,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface UserStatsCardProps {
  stats: UserStats;
  badge: number;
  address: string;
}

export function UserStatsCard({ stats, badge }: UserStatsCardProps) {
  const xp = Number(stats.xpPoints);
  const badgeLabel = BADGE_LABELS[badge] || "None";
  const thresholds = BADGE_XP_THRESHOLDS[badgeLabel];

  // Calculate XP progress to next badge
  let nextBadge = "";
  let progressPercent = 0;
  if (badge < 7) {
    const nextBadgeNum = badge + 1;
    nextBadge = BADGE_LABELS[nextBadgeNum];
    const nextThresholds = BADGE_XP_THRESHOLDS[nextBadge];
    if (nextThresholds && thresholds) {
      const currentMin = thresholds.min;
      const nextMin = nextThresholds.min;
      const range = nextMin - currentMin;
      if (range > 0) {
        progressPercent = Math.min(
          100,
          Math.max(0, ((xp - currentMin) / range) * 100)
        );
      }
    }
  } else {
    progressPercent = 100;
  }

  const statItems = [
    {
      label: "Wins",
      value: Number(stats.totalWins),
      icon: <Trophy className="h-4 w-4" />,
      color: "text-emerald-400",
    },
    {
      label: "Losses",
      value: Number(stats.totalLosses),
      icon: <Target className="h-4 w-4" />,
      color: "text-red-400",
    },
    {
      label: "XP",
      value: xp,
      icon: <Flame className="h-4 w-4" />,
      color: "text-[#f5d566]",
    },
    {
      label: "Volume",
      value: formatStake(stats.totalVolume) + " ETH",
      icon: <Coins className="h-4 w-4" />,
      color: "text-sky-400",
    },
    {
      label: "Dispute Wins",
      value: Number(stats.totalDisputeWins),
      icon: <Swords className="h-4 w-4" />,
      color: "text-amber-400",
    },
    {
      label: "Active (Creator)",
      value: Number(stats.activeCountCreator),
      icon: <Shield className="h-4 w-4" />,
      color: "text-white/80",
    },
    {
      label: "Active (Accepter)",
      value: Number(stats.activeCountAccepter),
      icon: <TrendingUp className="h-4 w-4" />,
      color: "text-white/80",
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      {/* Badge + XP Progress */}
      <div className="rounded-2xl border border-[rgba(212,175,55,0.35)] bg-[radial-gradient(circle_at_top,_rgba(245,213,102,0.16),_rgba(5,5,5,0.98))] p-4 shadow-[0_18px_40px_rgba(0,0,0,0.8)] transition-all duration-300 hover:-translate-y-[2px] hover:shadow-[0_24px_70px_rgba(0,0,0,0.95)]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute -inset-2 rounded-2xl bg-[conic-gradient(from_0deg,_rgba(245,213,102,0.25),_transparent_40%,_rgba(56,189,248,0.25),_transparent_80%)] opacity-60 blur-md" />
              <div className="relative rounded-2xl bg-black/60 p-1.5 border border-[rgba(212,175,55,0.6)]">
                <BadgeDisplay badge={badge} size="lg" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xs uppercase tracking-[0.16em] text-white/55">
                Badge
              </span>
              <span className="text-sm font-semibold text-[#f5d566]">
                {badgeLabel}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-xs text-white/55">Total XP</span>
            <span className="font-mono text-lg font-bold text-[#f5d566]">
              {xp}
            </span>
          </div>
        </div>

        {badge < 7 && nextBadge && (
          <div className="flex flex-col gap-1.5 mt-2">
            <div className="flex justify-between text-[11px] text-white/60">
              <span>{badgeLabel}</span>
              <span>Next: {nextBadge}</span>
            </div>
            <Progress
              value={progressPercent}
              className="h-2 bg-black/70 [&>div]:bg-gradient-to-r [&>div]:from-[#f5d566] [&>div]:via-amber-400 [&>div]:to-emerald-400"
            />
            <span className="text-[11px] text-white/45">
              {progressPercent.toFixed(0)}% of the way to {nextBadge}.
            </span>
          </div>
        )}
        {badge === 7 && (
          <p className="text-xs text-sky-400 text-center font-medium mt-1">
            Max rank achieved. You’re at the top of the ladder.
          </p>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        {statItems.map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-white/10 bg-[rgba(10,10,10,0.95)] p-3 flex flex-col gap-1.5 transition-all duration-200 hover:-translate-y-[1px] hover:border-[rgba(245,213,102,0.7)] hover:shadow-[0_0_26px_rgba(245,213,102,0.25)]"
          >
            <div className={`flex items-center gap-1.5 ${item.color}`}>
              {item.icon}
              <span className="text-xs text-white/60">{item.label}</span>
            </div>
            <span className="font-mono text-lg font-bold text-white">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
