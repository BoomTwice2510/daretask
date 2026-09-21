"use client";

import { useState, useEffect, useCallback } from "react";
import { useWeb3 } from "@/lib/web3-provider";
import { Header } from "@/components/header";
import { BadgeDisplay } from "@/components/badge-display";
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
} from "lucide-react";
import Link from "next/link";

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
    { key: "xp" as const, label: "XP", icon: <Zap className="h-4 w-4" /> },
    { key: "wins" as const, label: "Wins", icon: <Trophy className="h-4 w-4" /> },
    { key: "volume" as const, label: "Volume", icon: <BarChart3 className="h-4 w-4" /> },
  ];

  const handleExpand = () => {
    setDisplayLimit((prev) => (prev < SECOND_LIMIT ? SECOND_LIMIT : MAX_LIMIT));
  };

  return (
    <div className="dare-light-shell">
      <Header />

      <main className="dare-page-wide dare-leaderboard-page pb-20">
        <div className="mb-8 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-[#71819a] hover:text-[#1268f3]">
            <ArrowLeft className="h-4 w-4" />
            Back to feed
          </Link>

          <div className="hidden items-center gap-2 rounded-full border border-[#dce5f1] bg-white px-3 py-1.5 text-xs font-semibold text-[#60718c] shadow-sm sm:inline-flex">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            On-chain data
          </div>
        </div>

        <section className="mb-7 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[#dbe7ff] bg-[#eef5ff] text-[#1268f3] shadow-sm">
              <Trophy className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-[#10213f] sm:text-4xl">Leaderboard</h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-[#71819a] sm:text-base">
              Rank challengers by XP, wins, or total matched stake volume recorded by the protocol.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:min-w-[360px]">
            <div className="rounded-2xl border border-[#dce5f1] bg-white p-4 shadow-[0_12px_35px_rgba(35,65,110,0.06)]">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#8190a7]"><Users className="h-4 w-4 text-[#1268f3]" /> Players indexed</div>
              <div className="mt-2 text-2xl font-extrabold text-[#10213f]">{loading ? "..." : sortedEntriesAll.length}</div>
            </div>
            <div className="rounded-2xl border border-[#dce5f1] bg-white p-4 shadow-[0_12px_35px_rgba(35,65,110,0.06)]">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#8190a7]"><Target className="h-4 w-4 text-violet-500" /> Total dares</div>
              <div className="mt-2 text-2xl font-extrabold text-[#10213f]">{loading ? "..." : totalDares.toLocaleString()}</div>
            </div>
          </div>
        </section>

        <div className="mb-5 flex flex-wrap gap-2">
          {sortTabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setSortBy(tab.key)}
              className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-bold transition ${
                sortBy === tab.key
                  ? "border-[#1268f3] bg-[#1268f3] text-white shadow-[0_8px_22px_rgba(18,104,243,0.20)]"
                  : "border-[#dce5f1] bg-white text-[#60718c] hover:border-[#b9cbe4] hover:text-[#173154]"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {loading && (
          <div className="rounded-3xl border border-[#dce5f1] bg-white py-20 text-center shadow-[0_15px_45px_rgba(35,65,110,0.05)]">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#1268f3]" />
            <p className="mt-3 text-sm text-[#71819a]">Reading live leaderboard data from Base...</p>
          </div>
        )}

        {!loading && sortedEntriesAll.length === 0 && (
          <div className="rounded-3xl border border-[#dce5f1] bg-white px-6 py-20 text-center shadow-[0_15px_45px_rgba(35,65,110,0.05)]">
            <Sparkles className="mx-auto h-8 w-8 text-[#1268f3]" />
            <h2 className="mt-4 text-xl font-extrabold text-[#10213f]">No ranked challengers yet</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#71819a]">Create or accept a dare to start building your on-chain record.</p>
            <Link href="/explore" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#1268f3] px-5 py-3 text-sm font-bold text-white shadow-[0_10px_25px_rgba(18,104,243,0.20)]">
              Explore Dares <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}

        {!loading && sortedEntries.length > 0 && (
          <>
            <div className="overflow-hidden rounded-3xl border border-[#dce5f1] bg-white shadow-[0_15px_45px_rgba(35,65,110,0.06)]">
              <div className="hidden grid-cols-[70px_minmax(0,1fr)_150px_150px_180px] border-b border-[#e7edf5] px-5 py-3 text-xs font-bold uppercase tracking-wide text-[#8190a7] sm:grid">
                <div>#</div><div>Player</div><div className="text-right">XP</div><div className="text-right">Wins</div><div className="text-right">Volume</div>
              </div>

              {sortedEntries.map((entry, index) => (
                <Link
                  key={entry.address}
                  href={`/profile/${entry.address}`}
                  className="grid grid-cols-[42px_minmax(0,1fr)_auto] items-center gap-3 border-b border-[#edf1f6] px-4 py-4 transition last:border-b-0 hover:bg-[#f8fbff] sm:grid-cols-[70px_minmax(0,1fr)_150px_150px_180px] sm:px-5"
                >
                  <div className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-extrabold ${index === 0 ? "bg-[#fff5c9] text-[#b68a00]" : "bg-[#f1f5fa] text-[#71819a]"}`}>
                    {index + 1}
                  </div>

                  <div className="flex min-w-0 items-center gap-3">
                    <div className="h-10 w-10 shrink-0 rounded-full border border-[#dce5f1] bg-gradient-to-br from-[#eaf2ff] to-[#cbd7e8]" />
                    <div className="min-w-0">
                      <div className="truncate font-mono text-sm font-bold text-[#173154]">{shortenAddress(entry.address)}</div>
                      <div className="mt-1 flex items-center gap-2"><BadgeDisplay badge={entry.badge} size="sm" /></div>
                    </div>
                  </div>

                  <div className="text-right text-sm font-bold text-[#1268f3]">{Number(entry.xp)} XP</div>
                  <div className="hidden text-right text-sm font-bold text-[#173154] sm:block">{Number(entry.wins)} <span className="font-normal text-[#9aa8bb]">/ {Number(entry.losses)} L</span></div>
                  <div className="hidden text-right text-sm font-bold text-[#7c3aed] sm:block">{formatUsd6(entry.volumeUsd6)}</div>

                  <div className="col-span-full flex justify-between border-t border-[#f0f3f7] pt-2 text-xs sm:hidden">
                    <span className="text-[#71819a]">Wins {Number(entry.wins)} · Losses {Number(entry.losses)}</span>
                    <span className="font-bold text-[#7c3aed]">{formatUsd6(entry.volumeUsd6)}</span>
                  </div>
                </Link>
              ))}
            </div>

            {canExpand && (
              <div className="mt-6 flex justify-center">
                <button type="button" onClick={handleExpand} className="rounded-xl border border-[#dce5f1] bg-white px-5 py-2.5 text-sm font-bold text-[#60718c] hover:border-[#1268f3] hover:text-[#1268f3]">
                  Show more players
                </button>
              </div>
            )}

            <div className="mt-8 rounded-3xl border border-[#dce5f1] bg-white p-8 text-center shadow-[0_15px_45px_rgba(35,65,110,0.04)]">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eef5ff] text-[#1268f3]"><BarChart3 className="h-6 w-6" /></div>
              <h2 className="mt-4 text-xl font-extrabold text-[#10213f]">Keep challenging. Keep climbing.</h2>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#71819a]">Complete dares, earn XP, and build a verifiable on-chain reputation.</p>
              <Link href="/explore" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#1268f3] px-5 py-3 text-sm font-bold text-white shadow-[0_10px_25px_rgba(18,104,243,0.20)]">
                Explore Dares <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
