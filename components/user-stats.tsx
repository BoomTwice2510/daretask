"use client";

import type { UserStats } from "@/lib/types";
import { formatStake } from "@/lib/helpers";
import { BadgeDisplay } from "@/components/badge-display";
import { BADGE_XP_THRESHOLDS, BADGE_LABELS } from "@/lib/contract";
import { Trophy, Target, Flame, Coins, Shield, Swords, TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface UserStatsCardProps {
  stats: UserStats;
  badge: number;
  address: string;
}

export function UserStatsCard({ stats, badge, address }: UserStatsCardProps) {
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
        progressPercent = Math.min(100, Math.max(0, ((xp - currentMin) / range) * 100));
      }
    }
  } else {
    progressPercent = 100;
  }

  const statItems = [
    { label: "Wins", value: Number(stats.totalWins), icon: <Trophy className="h-4 w-4" />, color: "text-emerald-400" },
    { label: "Losses", value: Number(stats.totalLosses), icon: <Target className="h-4 w-4" />, color: "text-red-400" },
    { label: "XP", value: xp, icon: <Flame className="h-4 w-4" />, color: "text-primary" },
    { label: "Volume", value: formatStake(stats.totalVolume) + " ETH", icon: <Coins className="h-4 w-4" />, color: "text-sky-400" },
    { label: "Dispute Wins", value: Number(stats.totalDisputeWins), icon: <Swords className="h-4 w-4" />, color: "text-amber-400" },
    { label: "Active (Creator)", value: Number(stats.activeCountCreator), icon: <Shield className="h-4 w-4" />, color: "text-gray-300" },
    { label: "Active (Accepter)", value: Number(stats.activeCountAccepter), icon: <TrendingUp className="h-4 w-4" />, color: "text-gray-300" },
  ];

  return (
    <div className="flex flex-col gap-5">
      {/* Badge + XP Progress */}
      <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4">
        <div className="flex items-center justify-between mb-3">
          <BadgeDisplay badge={badge} size="lg" />
          <span className="font-mono text-lg font-bold text-primary">{xp} XP</span>
        </div>
        {badge < 7 && nextBadge && (
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs text-gray-400">
              <span>{badgeLabel}</span>
              <span>{nextBadge}</span>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>
        )}
        {badge === 7 && (
          <p className="text-xs text-sky-400 text-center font-medium">Maximum rank achieved</p>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        {statItems.map((item) => (
          <div
            key={item.label}
            className="rounded-lg border border-neutral-800 bg-neutral-950 p-3 flex flex-col gap-1"
          >
            <div className={`flex items-center gap-1.5 ${item.color}`}>
              {item.icon}
              <span className="text-xs text-gray-400">{item.label}</span>
            </div>
            <span className="font-mono text-lg font-bold text-white">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
