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
  Sparkles,
  Zap,
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
      label: "Total Wins",
      value: Number(stats.totalWins),
      icon: Trophy,
      tone: "from-emerald-50 via-white to-emerald-100/70 border-emerald-200/80 text-emerald-600 shadow-[0_4px_14px_rgba(16,185,129,0.12)]",
      aura: "bg-emerald-400/10",
      numColor: "text-emerald-700",
    },
    {
      label: "Total Losses",
      value: Number(stats.totalLosses),
      icon: Target,
      tone: "from-rose-50 via-white to-rose-100/70 border-rose-200/80 text-rose-600 shadow-[0_4px_14px_rgba(244,63,94,0.12)]",
      aura: "bg-rose-400/10",
      numColor: "text-slate-900",
    },
    {
      label: "Protocol XP",
      value: xp.toLocaleString(),
      icon: Flame,
      tone: "from-amber-50 via-white to-amber-100/70 border-amber-200/80 text-amber-600 shadow-[0_4px_14px_rgba(245,158,11,0.14)]",
      aura: "bg-amber-400/10",
      numColor: "text-amber-700",
    },
    {
      label: "Total Volume",
      value: `${formatStake(stats.totalVolume)} ETH`,
      icon: Coins,
      tone: "from-blue-50 via-white to-blue-100/70 border-blue-200/80 text-[#0052FF] shadow-[0_4px_14px_rgba(0,82,255,0.12)]",
      aura: "bg-blue-400/10",
      numColor: "text-[#0052FF]",
    },
    {
      label: "Dispute Wins",
      value: Number(stats.totalDisputeWins),
      icon: Swords,
      tone: "from-violet-50 via-white to-violet-100/70 border-violet-200/80 text-violet-600 shadow-[0_4px_14px_rgba(139,92,246,0.12)]",
      aura: "bg-violet-400/10",
      numColor: "text-slate-900",
    },
    {
      label: "Active as Creator",
      value: Number(stats.activeCountCreator),
      icon: Shield,
      tone: "from-slate-50 via-white to-slate-100/80 border-slate-200/80 text-slate-600 shadow-xs",
      aura: "bg-slate-300/10",
      numColor: "text-slate-900",
    },
    {
      label: "Active as Accepter",
      value: Number(stats.activeCountAccepter),
      icon: TrendingUp,
      tone: "from-indigo-50 via-white to-indigo-100/70 border-indigo-200/80 text-indigo-600 shadow-[0_4px_14px_rgba(99,102,241,0.12)]",
      aura: "bg-indigo-400/10",
      numColor: "text-slate-900",
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      {/* Badge & XP Progress Showcase Card */}
      <div className="glass-panel relative overflow-hidden rounded-[28px] p-5 sm:p-6 shadow-[0_8px_35px_rgba(15,23,42,0.035)] transition-all duration-300 hover:shadow-[0_16px_40px_rgba(0,82,255,0.06)]">
        {/* Subtle Ambient Light Wash */}
        <div className="pointer-events-none absolute -top-16 -right-16 hidden h-44 w-44 rounded-full bg-blue-100/30 blur-3xl animate-drift sm:block" />

        <div className="relative flex flex-col gap-3 mb-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-3.5">
            <div className="relative shrink-0">
              <BadgeDisplay badge={badge} size="lg" />
            </div>
            <div className="min-w-0 flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                Rank Badge
              </span>
              <span className="truncate text-base font-black tracking-tight text-slate-900">
                {badgeLabel}
              </span>
            </div>
          </div>

          <div className="flex shrink-0 flex-col items-start sm:items-end">
            <span className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
              Total XP
            </span>
            <span className="font-mono text-xl sm:text-2xl font-black text-[#0052FF]">
              {xp.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Progress Bar Module */}
        {badge < 7 && nextBadge ? (
          <div className="relative flex flex-col gap-2 pt-2 border-t border-slate-100/90">
            <div className="flex justify-between gap-3 text-xs font-bold text-slate-600">
              <span className="min-w-0 truncate">{badgeLabel} Tier</span>
              <span className="shrink-0 text-[#0052FF]">
                Next: {nextBadge}
              </span>
            </div>

            <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-slate-100/90 p-0.5 shadow-inner">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#0052FF] via-indigo-500 to-emerald-500 transition-all duration-500 shadow-xs"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="flex items-center justify-between gap-3 text-[11px] font-semibold text-slate-400">
              <span>{progressPercent.toFixed(0)}% completed</span>
              <span>Level up on-chain</span>
            </div>
          </div>
        ) : (
          <div className="mt-2 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-50/90 to-indigo-50/80 border border-blue-200/70 p-3 text-center shadow-xs">
            <Sparkles className="h-4 w-4 shrink-0 text-[#0052FF]" />
            <p className="text-xs font-black text-[#0052FF] uppercase tracking-wider">
              Max Rank Achieved · Top of the Leaderboard
            </p>
          </div>
        )}
      </div>

      {/* Stats Grid with 3D Layered Glass Icons */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {statItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="glass-card-interactive group flex flex-col justify-between rounded-2xl p-4 transition-all duration-300"
            >
              <div className="flex min-w-0 items-center justify-between gap-2">
                <span className="min-w-0 truncate text-[11px] font-bold text-slate-500">
                  {item.label}
                </span>

                {/* 3D Micro-Glass Squircle Container */}
                <div
                  className={`relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br border ${item.tone} group-hover:scale-105 group-hover:rotate-3 transition-all duration-300`}
                >
                  <div
                    className={`absolute inset-1 rounded-lg blur-xs ${item.aura}`}
                  />
                  <Icon className="relative z-10 h-4 w-4 stroke-[2.2]" />
                </div>
              </div>

              <div
                className={`mt-3 font-mono text-xl sm:text-2xl font-black tracking-tight ${item.numColor}`}
              >
                {item.value}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}