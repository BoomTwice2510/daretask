"use client";

import { useState, useEffect, useCallback } from "react";
import { useWeb3 } from "@/lib/web3-provider";
import { Header } from "@/components/header";
import { BadgeDisplay } from "@/components/badge-display";
import { shortenAddress, formatStake } from "@/lib/helpers";
import {
  ArrowLeft,
  Loader2,
  Trophy,
  Flame,
  Coins,
  Crown,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

interface LeaderEntry {
  address: string;
  wins: bigint;
  losses: bigint;
  xp: bigint;
  volume: bigint;
  badge: number;
}

export default function LeaderboardPage() {
  const { readContract } = useWeb3();
  const [entries, setEntries] = useState<LeaderEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<"xp" | "wins" | "volume">("xp");

  const fetchLeaderboard = useCallback(async () => {
    setLoading(true);
    try {
      const count = (await readContract("dareCount")) as bigint;
      const total = Number(count);

      // Collect unique addresses from dares
      const addressSet = new Set<string>();
      const start = Math.max(0, total - 200);

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
        } catch {}
      }

      // Fetch stats for each address
      const leaderEntries: LeaderEntry[] = [];
      const addresses = Array.from(addressSet);

      await Promise.all(
        addresses.map(async (addr) => {
          try {
            const [statsResult, badgeResult] = await Promise.all([
              readContract("getUserStats", [addr]),
              readContract("getUserBadge", [addr]),
            ]);
            const s = statsResult as [bigint, bigint, bigint, bigint, bigint, bigint, bigint];
            leaderEntries.push({
              address: addr,
              wins: s[3],
              losses: s[4],
              xp: s[2],
              volume: s[5],
              badge: badgeResult as number,
            });
          } catch {}
        })
      );

      setEntries(leaderEntries);
    } catch (err) {
      console.error("Failed to fetch leaderboard:", err);
    } finally {
      setLoading(false);
    }
  }, [readContract]);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  const sortedEntries = [...entries].sort((a, b) => {
    if (sortBy === "xp") return Number(b.xp) - Number(a.xp);
    if (sortBy === "wins") return Number(b.wins) - Number(a.wins);
    return Number(b.volume) - Number(a.volume);
  });

  const sortTabs = [
    { key: "xp" as const, label: "XP", icon: <Flame className="h-3.5 w-3.5" /> },
    { key: "wins" as const, label: "Wins", icon: <Trophy className="h-3.5 w-3.5" /> },
    { key: "volume" as const, label: "Volume", icon: <Coins className="h-3.5 w-3.5" /> },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <main className="mx-auto max-w-3xl px-4 py-8 pb-24">
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to feed
          </Link>

          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-[11px] text-amber-200">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-400" />
            </span>
            Live leaderboard
          </div>
        </div>

        <section className="mb-6 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/15 border border-primary/40 shadow-[0_0_30px_rgba(59,130,246,0.5)]">
              <Crown className="h-6 w-6 text-primary animate-bounce" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Leaderboard</h1>
              <p className="text-xs md:text-sm text-gray-400">
                Ranked by XP, wins, or total on‑chain volume across all dares.
              </p>
            </div>
          </div>

          {sortedEntries.length > 0 && (
            <div className="hidden md:flex flex-col items-end text-xs text-gray-400">
              <div className="inline-flex items-center gap-1 rounded-full bg-neutral-900 px-2 py-1 border border-neutral-700">
                <Sparkles className="h-3 w-3 text-primary" />
                <span className="font-mono">
                  Total players: {sortedEntries.length}
                </span>
              </div>
            </div>
          )}
        </section>

        {/* Sort Tabs */}
        <div className="flex items-center gap-1.5 mb-6">
          {sortTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSortBy(tab.key)}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                sortBy === tab.key
                  ? "bg-primary text-black shadow-lg shadow-primary/40"
                  : "bg-neutral-900 text-gray-400 hover:text-white hover:bg-neutral-800"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {!loading && sortedEntries.length === 0 && (
          <p className="text-center text-sm text-gray-400 py-16">
            No players found yet. Be the first to create a dare.
          </p>
        )}

        {!loading && sortedEntries.length > 0 && (
          <div className="flex flex-col gap-2">
            {sortedEntries.map((entry, index) => (
              <Link
                key={entry.address}
                href={`/profile/${entry.address}`}
                className="flex items-center gap-3 rounded-xl border border-neutral-800 bg-neutral-950/90 p-3 hover:border-primary/50 hover:bg-neutral-900/90 transition-colors"
              >
                {/* Rank */}
                <div
                  className={`relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                    index === 0
                      ? "bg-primary/25 text-primary"
                      : index === 1
                      ? "bg-sky-500/20 text-sky-400"
                      : index === 2
                      ? "bg-amber-500/20 text-amber-400"
                      : "bg-neutral-900 text-gray-400"
                  }`}
                >
                  {index + 1}
                  {index === 0 && (
                    <span className="absolute inset-0 rounded-full border border-primary/50 animate-pulse" />
                  )}
                </div>

                {/* Address + Badge */}
                <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                  <span className="font-mono text-xs text-white truncate">
                    {shortenAddress(entry.address)}
                  </span>
                  <BadgeDisplay badge={entry.badge} size="sm" />
                </div>

                {/* Stat value */}
                <div className="text-right shrink-0">
                  <div className="font-mono text-sm font-bold text-white">
                    {sortBy === "xp" && `${Number(entry.xp)} XP`}
                    {sortBy === "wins" && `${Number(entry.wins)}W / ${Number(entry.losses)}L`}
                    {sortBy === "volume" && `${formatStake(entry.volume)} ETH`}
                  </div>
                  <div className="text-[11px] text-gray-500">
                    Wins: {Number(entry.wins)} • Vol: {formatStake(entry.volume)} ETH
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
