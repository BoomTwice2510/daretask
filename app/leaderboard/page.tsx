"use client";

import { useState, useEffect, useCallback } from "react";
import { useWeb3 } from "@/lib/web3-provider";
import { Header } from "@/components/header";
import { BadgeDisplay } from "@/components/badge-display";
import { UserAvatar } from "@/components/user-avatar";
import { shortenAddress } from "@/lib/helpers";
import {
  ArrowLeft,
  Loader2,
  Trophy,
  Sparkles,
  Users,
  Target,
  BarChart3,
  Zap,
  ArrowRight,
  Crown,
  Medal,
} from "lucide-react";
import Link from "next/link";
import { type Address } from "viem";
import { cn } from "@/lib/utils";

interface LeaderEntry {
  address: string;
  wins: bigint;
  losses: bigint;
  xp: bigint;
  volumeUsd6: bigint;
  badge: number;
}

const INITIAL_LIMIT = 20;
const SECOND_LIMIT = 30;
const MAX_LIMIT = 50;
const SCAN_WINDOW = 200;

function formatUsd6(value: bigint) {
  const dollars = Number(value) / 1_000_000;
  if (!Number.isFinite(dollars)) return "$0.00";
  return `$${dollars.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function getBadgeFromXp(xp: bigint) {
  const value = Number(xp);
  if (value >= 7500) return 7;
  if (value >= 5000) return 6;
  if (value >= 3000) return 5;
  if (value >= 2000) return 4;
  if (value >= 1000) return 3;
  if (value >= 500) return 2;
  if (value >= 1) return 1;
  return 0;
}

export default function LeaderboardPage() {
  const { readContract } = useWeb3();
  const [entries, setEntries] = useState<LeaderEntry[]>([]);
  const [totalDares, setTotalDares] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<"xp" | "wins" | "volume">("xp");
  const [displayLimit, setDisplayLimit] = useState(INITIAL_LIMIT);

  const fetchLeaderboard = useCallback(async () => {
    setLoading(true);
    try {
      const count = (await readContract("dareCount")) as bigint;
      const total = Number(count);
      setTotalDares(total);

      const addressSet = new Set<string>();
      const start = Math.max(0, total - SCAN_WINDOW);

      for (let i = total - 1; i >= start; i--) {
        try {
          const result = (await readContract("getDare", [BigInt(i)])) as [
            string,
            string,
            string,
            string,
            bigint,
            bigint,
            bigint,
            boolean,
            string,
            bigint,
            bigint,
            number
          ];

          addressSet.add(result[0]);
          if (result[1] !== "0x0000000000000000000000000000000000000000") {
            addressSet.add(result[1]);
          }
        } catch {
          // Ignore an individual dare that cannot be read.
        }
      }

      const addresses = Array.from(addressSet).slice(0, MAX_LIMIT);
      const leaderEntries: LeaderEntry[] = [];

      for (let i = 0; i < addresses.length; i += 10) {
        const chunk = addresses.slice(i, i + 10);
        // eslint-disable-next-line no-await-in-loop
        await Promise.all(
          chunk.map(async (addr) => {
            try {
              const statsResult = await readContract("getUserStats", [addr]);
              const s = statsResult as [
                bigint,
                bigint,
                bigint,
                bigint,
                bigint,
                bigint,
                bigint
              ];

              leaderEntries.push({
                address: addr,
                wins: s[3],
                losses: s[4],
                xp: s[2],
                volumeUsd6: s[5],
                badge: getBadgeFromXp(s[2]),
              });
            } catch {
              // Ignore a player whose stats are unavailable.
            }
          }),
        );
      }

      setEntries(leaderEntries);
      setDisplayLimit(INITIAL_LIMIT);
    } catch (err) {
      console.error("Failed to fetch leaderboard:", err);
      setEntries([]);
    } finally {
      setLoading(false);
    }
  }, [readContract]);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  const sortedEntriesAll = [...entries].sort((a, b) => {
    if (sortBy === "xp") return b.xp > a.xp ? 1 : b.xp < a.xp ? -1 : 0;
    if (sortBy === "wins") return b.wins > a.wins ? 1 : b.wins < a.wins ? -1 : 0;
    return b.volumeUsd6 > a.volumeUsd6 ? 1 : b.volumeUsd6 < a.volumeUsd6 ? -1 : 0;
  });

  const sortedEntries = sortedEntriesAll.slice(0, displayLimit);
  const canExpand = !loading && sortedEntriesAll.length > displayLimit && displayLimit < MAX_LIMIT;

  const sortTabs = [
    { key: "xp" as const, label: "XP Points", icon: Zap },
    { key: "wins" as const, label: "Total Wins", icon: Trophy },
    { key: "volume" as const, label: "Matched Volume", icon: BarChart3 },
  ];

  const handleExpand = () => {
    setDisplayLimit((prev) => (prev < SECOND_LIMIT ? SECOND_LIMIT : MAX_LIMIT));
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-white text-slate-900">
      {/* Ambient Moving Light Spheres */}
      <div className="pointer-events-none absolute -top-24 -left-20 h-96 w-96 rounded-full bg-gradient-to-br from-blue-200/20 via-indigo-100/15 to-transparent blur-3xl animate-drift" />
      <div
        className="pointer-events-none absolute top-1/3 -right-24 h-[420px] w-[420px] rounded-full bg-gradient-to-bl from-amber-100/15 via-rose-100/15 to-blue-100/15 blur-3xl animate-drift"
        style={{ animationDelay: "-6s" }}
      />

      <Header />

      <main className="relative mx-auto w-full max-w-[1240px] px-4 pb-[calc(6rem+env(safe-area-inset-bottom))] pt-5 sm:px-6 lg:px-8 lg:pb-20 lg:pt-8">
        
        {/* Top Back Navigation & Live Pill */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="glass-card-interactive group inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-black text-slate-600 hover:text-[#0052FF] transition-all"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
            <span>Back to Home</span>
          </Link>

          <div className="glass-panel inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-black text-slate-700 shadow-xs">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span>Live On-Chain Rankings</span>
          </div>
        </div>

        {/* Hero Section & Quick Stats */}
        <section className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-blue-50/90 border border-blue-200/70 px-3 py-1 text-[10.5px] font-black uppercase tracking-[0.16em] text-[#0052FF] shadow-xs">
              <Sparkles className="h-3 w-3" />
              Hall of Fame
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 leading-tight">
              Protocol <span className="text-gradient-soothing">Leaderboard</span>
            </h1>
            
            <p className="mt-2 max-w-xl text-xs sm:text-sm leading-relaxed text-slate-500 font-medium">
              Rank the most reputable dare creators and challengers by verifiable on-chain XP, win-loss ratio, and total escrow volume.
            </p>
          </div>

          {/* Metric Micro Counter Cards */}
          <div className="grid grid-cols-2 gap-3 sm:min-w-[360px]">
            {/* Card 1 */}
            <div className="glass-card-interactive group flex flex-col rounded-3xl p-4 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500">Players Indexed</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-[#0052FF] shadow-xs group-hover:scale-110 transition-transform">
                  <Users className="h-4 w-4 stroke-[2.2]" />
                </div>
              </div>
              <div className="mt-2 font-mono text-2xl sm:text-3xl font-black text-slate-900">
                {loading ? "..." : sortedEntriesAll.length}
              </div>
            </div>

            {/* Card 2 */}
            <div className="glass-card-interactive group flex flex-col rounded-3xl p-4 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500">Total Dares</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 shadow-xs group-hover:scale-110 transition-transform">
                  <Target className="h-4 w-4 stroke-[2.2]" />
                </div>
              </div>
              <div className="mt-2 font-mono text-2xl sm:text-3xl font-black text-slate-900">
                {loading ? "..." : totalDares.toLocaleString()}
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Sort Pill Tabs */}
        <div className="mb-6 flex flex-wrap gap-2.5">
          {sortTabs.map((tab) => {
            const Icon = tab.icon;
            const active = sortBy === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setSortBy(tab.key)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs sm:text-sm font-black transition-all duration-200 cursor-pointer active:scale-95 shadow-xs",
                  active
                    ? "bg-gradient-to-r from-[#0052FF] to-[#0045d8] text-white shadow-[0_4px_16px_rgba(0,82,255,0.28)] scale-[1.02]"
                    : "glass-card-interactive border-slate-200/80 bg-white/90 text-slate-600 hover:text-slate-900 hover:bg-white"
                )}
              >
                <Icon className={cn("h-4 w-4", active ? "stroke-[2.5]" : "text-slate-400")} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="glass-panel flex flex-col items-center justify-center rounded-[32px] py-24 gap-3 text-center shadow-xs">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-[#0052FF] shadow-xs">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
            <p className="text-xs sm:text-sm font-bold text-slate-500">
              Indexing on-chain reputation and XP metrics from Base...
            </p>
          </div>
        )}

        {/* Empty State */}
        {!loading && sortedEntriesAll.length === 0 && (
          <div className="glass-panel flex flex-col items-center justify-center rounded-[32px] px-6 py-20 text-center shadow-xs">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-[#0052FF] shadow-xs">
              <Sparkles className="h-7 w-7 stroke-[2.2]" />
            </div>
            <h2 className="mt-4 text-xl font-black text-slate-900">No Ranked Challengers Yet</h2>
            <p className="mx-auto mt-1 max-w-md text-xs sm:text-sm leading-relaxed text-slate-500 font-medium">
              Create or accept a dare to earn your first XP points and take the #1 spot on the leaderboard.
            </p>
            <Link
              href="/explore"
              className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-b from-[#0052FF] to-[#0045d8] px-6 py-3 text-xs sm:text-sm font-black text-white shadow-[0_6px_20px_rgba(0,82,255,0.25)] active:scale-95 transition-all cursor-pointer"
            >
              <span>Explore Dares</span>
              <ArrowRight className="h-4 w-4 stroke-[2.5]" />
            </Link>
          </div>
        )}

        {/* Ranked Players Table Sheet */}
        {!loading && sortedEntries.length > 0 && (
          <>
            <div className="glass-panel overflow-hidden rounded-[30px] shadow-[0_12px_40px_rgba(15,23,42,0.035)]">
              {/* Desktop Header */}
              <div className="hidden grid-cols-[80px_minmax(0,1fr)_160px_160px_180px] border-b border-slate-100/90 bg-slate-50/50 px-6 py-3.5 text-xs font-black uppercase tracking-wider text-slate-400 sm:grid">
                <div>Rank</div>
                <div>Player</div>
                <div className="text-right">Total XP</div>
                <div className="text-right">Wins / Losses</div>
                <div className="text-right">Escrow Volume</div>
              </div>

              {/* Table Rows */}
              <div className="divide-y divide-slate-100/90">
                {sortedEntries.map((entry, index) => {
                  const isFirst = index === 0;
                  const isSecond = index === 1;
                  const isThird = index === 2;

                  return (
                    <Link
                      key={entry.address}
                      href={`/profile/${entry.address}`}
                      className="group grid grid-cols-[46px_minmax(0,1fr)_auto] items-center gap-3.5 px-5 py-4 transition-all duration-200 hover:bg-slate-50/80 sm:grid-cols-[80px_minmax(0,1fr)_160px_160px_180px] sm:px-6 cursor-pointer"
                    >
                      {/* Rank Indicator Badge */}
                      <div className="flex items-center">
                        <div
                          className={cn(
                            "flex h-9 w-9 items-center justify-center rounded-2xl font-mono text-sm font-black shadow-xs transition-transform group-hover:scale-110",
                            isFirst
                              ? "bg-gradient-to-br from-amber-100 via-amber-50 to-yellow-200/90 border border-amber-300 text-amber-800 shadow-[0_2px_10px_rgba(245,158,11,0.2)]"
                              : isSecond
                              ? "bg-gradient-to-br from-slate-100 via-white to-blue-100/80 border border-slate-200 text-slate-700 shadow-xs"
                              : isThird
                              ? "bg-gradient-to-br from-amber-50 via-white to-orange-100/70 border border-orange-200 text-orange-700 shadow-xs"
                              : "bg-slate-50 border border-slate-200/70 text-slate-500"
                          )}
                        >
                          {isFirst ? (
                            <Crown className="h-4 w-4 text-amber-600" />
                          ) : (
                            index + 1
                          )}
                        </div>
                      </div>

                      {/* Player Profile & Badge */}
                      <div className="flex min-w-0 items-center gap-3.5">
                        <UserAvatar
                          address={entry.address as Address}
                          size="sm"
                          className="shrink-0 group-hover:scale-105 transition-transform"
                        />
                        <div className="min-w-0">
                          <div className="truncate font-mono text-xs sm:text-sm font-black text-slate-900 group-hover:text-[#0052FF] transition-colors">
                            {shortenAddress(entry.address)}
                          </div>
                          <div className="mt-1 flex items-center gap-1.5">
                            <BadgeDisplay badge={entry.badge} size="sm" />
                          </div>
                        </div>
                      </div>

                      {/* XP Points */}
                      <div className="text-right font-mono text-xs sm:text-sm font-black text-[#0052FF]">
                        {Number(entry.xp).toLocaleString()} XP
                      </div>

                      {/* Wins / Losses */}
                      <div className="hidden text-right text-xs sm:text-sm font-black text-slate-900 sm:block">
                        <span className="text-emerald-600">{Number(entry.wins)}W</span>
                        <span className="font-semibold text-slate-400"> / </span>
                        <span className="text-slate-400 font-semibold">{Number(entry.losses)}L</span>
                      </div>

                      {/* Matched Volume */}
                      <div className="hidden text-right font-mono text-xs sm:text-sm font-black text-slate-700 sm:block">
                        {formatUsd6(entry.volumeUsd6)}
                      </div>

                      {/* Mobile Row Subtitle */}
                      <div className="col-span-full flex items-center justify-between border-t border-slate-100/80 pt-2 text-[11px] font-semibold text-slate-500 sm:hidden">
                        <span>
                          <b className="text-emerald-600">{Number(entry.wins)}W</b> · {Number(entry.losses)}L
                        </span>
                        <span className="font-mono font-bold text-slate-700">
                          {formatUsd6(entry.volumeUsd6)}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Pagination Button */}
            {canExpand && (
              <div className="mt-6 flex justify-center">
                <button
                  type="button"
                  onClick={handleExpand}
                  className="glass-card-interactive rounded-2xl px-6 py-3 text-xs sm:text-sm font-black text-slate-700 hover:text-[#0052FF] hover:border-blue-200/80 transition-all cursor-pointer"
                >
                  Show More Ranked Players
                </button>
              </div>
            )}

            {/* Bottom Motivation Callout Banner */}
            <div className="glass-panel mt-10 rounded-[32px] p-8 sm:p-10 text-center shadow-[0_12px_45px_rgba(15,23,42,0.035)]">
              <div className="relative mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 via-white to-blue-100/70 border border-blue-200/80 text-[#0052FF] shadow-[0_4px_16px_rgba(0,82,255,0.12)]">
                <div className="absolute inset-1 rounded-xl bg-blue-400/10 blur-xs" />
                <BarChart3 className="relative z-10 h-7 w-7 stroke-[2.2]" />
              </div>
              
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Keep Challenging. Keep Climbing.
              </h2>
              
              <p className="mx-auto mt-1.5 max-w-md text-xs sm:text-sm leading-relaxed text-slate-500 font-medium">
                Win dares, submit verified proofs, and unlock exclusive high-tier reputation badges on Base.
              </p>
              
              <Link
                href="/explore"
                className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-b from-[#0052FF] to-[#0045d8] px-6 py-3.5 text-xs sm:text-sm font-black text-white shadow-[0_6px_20px_rgba(0,82,255,0.25)] hover:shadow-[0_8px_24px_rgba(0,82,255,0.35)] active:scale-95 transition-all cursor-pointer"
              >
                <span>Browse Live Dares</span>
                <ArrowRight className="h-4 w-4 stroke-[2.5]" />
              </Link>
            </div>
          </>
        )}
      </main>
    </div>
  );
}