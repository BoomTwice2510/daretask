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
import { Avatar } from "@coinbase/onchainkit/identity";
import { base } from "viem/chains";

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

      // Collect unique addresses from recent dares
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
        } catch {
          // ignore broken dare reads
        }
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
              volume: s[5],
              badge: badgeResult as number,
            });
          } catch {
            // ignore this user
          }
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
    {
      key: "wins" as const,
      label: "Wins",
      icon: <Trophy className="h-3.5 w-3.5" />,
    },
    {
      key: "volume" as const,
      label: "Volume",
      icon: <Coins className="h-3.5 w-3.5" />,
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <main className="mx-auto max-w-3xl px-4 py-8 pb-24">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/"
            className="group inline-flex items-center gap-1 text-sm text-white/60 transition-colors hover:text-[#f5d566]"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
            <span className="relative">
              Back to feed
              <span className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-gradient-to-r from-transparent via-[#f5d566] to-transparent transition-transform duration-200 group-hover:scale-x-100" />
            </span>
          </Link>

          <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(212,175,55,0.45)] bg-[rgba(10,10,10,0.9)] px-3 py-1 text-[11px] text-[#f5d566] backdrop-blur-md shadow-[0_0_25px_rgba(212,175,55,0.25)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d4af37] opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#d4af37]" />
            </span>
            Live leaderboard
          </div>
        </div>

        {/* Hero */}
        <section className="mb-6 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-[rgba(245,213,102,0.15)] border border-[rgba(212,175,55,0.45)] shadow-[0_18px_60px_rgba(0,0,0,0.9)]">
              <span className="absolute inset-0 rounded-2xl bg-[rgba(245,213,102,0.25)] blur-md opacity-0 md:opacity-100" />
              <Crown className="relative h-6 w-6 text-[#f5d566] animate-bounce" />
            </div>
            <div>
              <h1
                className="text-2xl md:text-3xl font-bold tracking-tight"
                style={{
                  background:
                    "linear-gradient(to right,#f5d566,#e6c547,#d4af37,#f97316)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Leaderboard
              </h1>
              <p className="text-xs md:text-sm text-white/70">
                Ranked by XP, wins, or total on‑chain volume across all dares.
              </p>
            </div>
          </div>

          {sortedEntries.length > 0 && (
            <div className="hidden md:flex flex-col items-end text-xs text-white/60">
              <div className="inline-flex items-center gap-1 rounded-full bg-[rgba(10,10,10,0.95)] px-2 py-1 border border-white/10">
                <Sparkles className="h-3 w-3 text-[#f5d566]" />
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
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                sortBy === tab.key
                  ? "bg-[#f5d566] text-black shadow-[0_0_25px_rgba(245,213,102,0.6)]"
                  : "bg-[rgba(15,15,15,0.95)] text-white/60 hover:text-white hover:bg-black border border-white/10"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-[#f5d566]" />
            <p className="text-xs text-white/60">
              Fetching on‑chain leaderboard…
            </p>
          </div>
        )}

        {/* Empty state */}
        {!loading && sortedEntries.length === 0 && (
          <p className="text-center text-sm text-white/60 py-16">
            No players found yet. Be the first to create a dare.
          </p>
        )}

        {/* List */}
        {!loading && sortedEntries.length > 0 && (
          <div className="flex flex-col gap-2">
            {sortedEntries.map((entry, index) => (
              <Link
                key={entry.address}
                href={`/profile/${entry.address}`}
                className="group flex items-center gap-3 rounded-xl border border-[rgba(212,175,55,0.35)] bg-[rgba(5,5,5,0.96)] p-3 transition-all duration-200 hover:border-[rgba(245,213,102,0.9)] hover:bg-black hover:shadow-[0_18px_60px_rgba(0,0,0,0.9)] hover:-translate-y-0.5"
              >
                {/* Rank */}
                <div
                  className={`relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                    index === 0
                      ? "bg-[rgba(245,213,102,0.18)] text-[#f5d566]"
                      : index === 1
                      ? "bg-white/10 text-white"
                      : index === 2
                      ? "bg-white/5 text-white/80"
                      : "bg-black text-white/60"
                  }`}
                >
                  {index === 0 && (
                    <span className="absolute inset-0 rounded-full border border-[#f5d566] animate-pulse" />
                  )}
                  {index + 1}
                </div>

                {/* Avatar */}
                <Avatar
                  address={entry.address as `0x${string}`}
                  chain={base}
                  className="h-8 w-8 rounded-full shrink-0"
                />

                {/* Address + Badge */}
                <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                  <span className="font-mono text-xs text-white truncate">
                    {shortenAddress(entry.address)}
                  </span>
                  <div className="flex items-center gap-1">
                    <BadgeDisplay badge={entry.badge} size="sm" />
                  </div>
                </div>

                {/* Stat value */}
                <div className="text-right shrink-0">
                  <div className="font-mono text-sm font-bold text-white">
                    {sortBy === "xp" && `${Number(entry.xp)} XP`}
                    {sortBy === "wins" &&
                      `${Number(entry.wins)}W / ${Number(entry.losses)}L`}
                    {sortBy === "volume" &&
                      `${formatStake(entry.volume)} ETH`}
                  </div>
                  <div className="text-[11px] text-white/55">
                    Wins: {Number(entry.wins)} • Vol:{" "}
                    {formatStake(entry.volume)} ETH
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
