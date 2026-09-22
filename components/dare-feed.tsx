"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useWeb3 } from "@/lib/web3-provider";
import { DareCard } from "@/components/dare-card";
import type { DareData } from "@/lib/types";
import { RefreshCw, Search, SlidersHorizontal, Sparkles, Activity, Clock3, Database } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const STATUS_FILTERS = [
  ["all", "All"],
  ["0", "Open"],
  ["1", "Running"],
  ["2", "Proof"],
  ["3", "Disputed"],
  ["4", "Resolved"],
] as const;

type Filter = (typeof STATUS_FILTERS)[number][0];

type SortMode = "newest" | "ending" | "stake";

export function DareFeed() {
  const { readContract } = useWeb3();
  const [dares, setDares] = useState<DareData[]>([]);
  const [totalOnChain, setTotalOnChain] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("all");
  const [tokenFilter, setTokenFilter] = useState<"all" | "ETH" | "USDC">("all");
  const [sort, setSort] = useState<SortMode>("newest");
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);

  const fetchDares = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const count = (await readContract("dareCount")) as bigint;
      const total = Number(count);
      setTotalOnChain(total);
      const start = Math.max(0, total - 50);

      const results = await Promise.all(
        Array.from({ length: total - start }, (_, offset) => {
          const id = total - 1 - offset;
          return (async () => {
            const result = (await readContract("getDare", [BigInt(id)])) as [
              string, string, string, string, bigint, bigint, bigint, boolean,
              string, bigint, bigint, number
            ];
            return {
              id,
              creator: result[0],
              accepter: result[1],
              description: result[2],
              token: result[3],
              stake: result[4],
              createdAt: result[5],
              deadline: result[6],
              proofSubmitted: result[7],
              proofURI: result[8],
              proofTime: result[9],
              disputeTime: result[10],
              status: result[11],
            } as DareData;
          })();
        }),
      );
      setDares(results);
    } catch (err) {
      setDares([]);
      setError(err instanceof Error ? err.message : "Could not load on-chain dares.");
    } finally {
      setLoading(false);
    }
  }, [readContract]);

  useEffect(() => {
    fetchDares();
  }, [fetchDares]);

  const tokenOf = (address: string) =>
    address === "0x0000000000000000000000000000000000000000" ? "ETH" : "USDC";

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return [...dares]
      .filter((dare) => filter === "all" || dare.status === Number(filter))
      .filter((dare) => tokenFilter === "all" || tokenOf(dare.token) === tokenFilter)
      .filter((dare) => !needle || dare.description.toLowerCase().includes(needle))
      .sort((a, b) => {
        if (sort === "ending") return Number(a.deadline - b.deadline);
        if (sort === "stake") return a.stake === b.stake ? 0 : a.stake > b.stake ? -1 : 1;
        return Number(b.createdAt - a.createdAt);
      });
  }, [dares, filter, tokenFilter, query, sort]);

  const openCount = dares.filter((d) => d.status === 0).length;
  const runningCount = dares.filter((d) => d.status === 1).length;

  return (
    <div className="space-y-6">
      {/* Top Banner - Frosted Glass Soft Panel */}
      <section className="glass-panel relative overflow-hidden max-md:rounded-2xl max-md:p-4 rounded-[26px] p-5 sm:p-7 md:p-8 shadow-[0_8px_35px_rgba(15,23,42,0.03)]">
        {/* Subtle Ambient Glow Orb */}
        <div className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-blue-100/30 blur-3xl animate-drift" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-200/70 bg-gradient-to-r from-blue-50/90 to-indigo-50/80 px-3.5 py-1 text-[10.5px] font-black uppercase tracking-[0.14em] text-[#0052FF] shadow-xs">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#0052FF] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#0052FF]" />
              </span>
              Live On-Chain Marketplace
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 leading-tight">
              Explore Dares
            </h1>
            <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-600 font-medium">
              Discover real challenges with matched stakes, countdown deadlines, and smart contract escrow proof on Base.
            </p>
          </div>

          {/* Metric Micro-Counters with 3D Layered Glass Icons */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {([
              {
                label: "Dares",
                value: totalOnChain.toLocaleString(),
                Icon: Database,
                tone: "bg-gradient-to-br from-blue-50 to-blue-100/60 border-blue-200/70 text-[#0052FF]",
                numColor: "text-slate-900",
              },
              {
                label: "Open",
                value: openCount.toString(),
                Icon: Activity,
                tone: "bg-gradient-to-br from-emerald-50 to-emerald-100/60 border-emerald-200/70 text-emerald-600",
                numColor: "text-emerald-600",
              },
              {
                label: "Running",
                value: runningCount.toString(),
                Icon: Clock3,
                tone: "bg-gradient-to-br from-indigo-50 to-indigo-100/60 border-indigo-200/70 text-indigo-600",
                numColor: "text-indigo-600",
              },
            ] as { label: string; value: string; Icon: LucideIcon; tone: string; numColor: string }[]).map(
              ({ label, value, Icon, tone, numColor }) => (
                <div
                  key={String(label)}
                  className="glass-card-interactive group flex flex-col max-md:rounded-xl max-md:p-2.5 rounded-2xl p-3 text-center transition-all"
                >
                  <div className="flex items-center justify-center">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-xl border ${tone} shadow-xs group-hover:scale-110 transition-transform`}>
                      <Icon className="h-4 w-4 stroke-[2.2]" />
                    </div>
                  </div>
                  <div className={`mt-2 font-mono text-base sm:text-lg font-black tracking-tight ${numColor}`}>
                    {value}
                  </div>
                  <div className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider">
                    {label}
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* Filter & Toolbar Shell */}
      <section className="glass-panel max-md:rounded-xl max-md:p-3 rounded-2xl p-4 sm:p-5 shadow-[0_4px_20px_rgba(15,23,42,0.02)] space-y-3.5">
        <div className="flex flex-col gap-2.5 sm:gap-3 lg:flex-row">
          
          {/* Search Input Box */}
          <label className="relative flex-1">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded-lg bg-blue-50 text-[#0052FF]">
              <Search className="h-3.5 w-3.5 stroke-[2.5]" />
            </div>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search dare descriptions..."
              className="h-11 w-full rounded-2xl border border-slate-200/80 bg-white/90 pl-11 pr-4 text-xs sm:text-sm text-slate-900 placeholder-slate-400 shadow-xs outline-none transition-all focus:border-[#0052FF] focus:ring-4 focus:ring-blue-100/70"
            />
          </label>

          {/* Dropdown Filters & Refresh Actions */}
          <div className="flex items-center gap-2">
            <select
              value={tokenFilter}
              onChange={(e) => setTokenFilter(e.target.value as "all" | "ETH" | "USDC")}
              className="h-11 rounded-2xl border border-slate-200/80 bg-white/95 px-3.5 text-xs sm:text-sm font-bold text-slate-700 shadow-xs outline-none transition-all focus:border-[#0052FF] focus:ring-2 focus:ring-blue-100 cursor-pointer"
            >
              <option value="all">All Tokens</option>
              <option value="ETH">ETH</option>
              <option value="USDC">USDC</option>
            </select>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortMode)}
              className="h-11 rounded-2xl border border-slate-200/80 bg-white/95 px-3.5 text-xs sm:text-sm font-bold text-slate-700 shadow-xs outline-none transition-all focus:border-[#0052FF] focus:ring-2 focus:ring-blue-100 cursor-pointer"
            >
              <option value="newest">Newest</option>
              <option value="ending">Ending Soon</option>
              <option value="stake">Highest Stake</option>
            </select>

            <button
              type="button"
              onClick={fetchDares}
              disabled={loading}
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-slate-200/80 bg-white text-slate-600 hover:text-[#0052FF] hover:border-blue-200/80 hover:bg-blue-50/50 hover:scale-105 active:scale-90 disabled:opacity-50 transition-all cursor-pointer shadow-xs"
              aria-label="Refresh dares"
            >
              <RefreshCw className={loading ? "h-4 w-4 animate-spin text-[#0052FF]" : "h-4 w-4 stroke-[2.2]"} />
            </button>
          </div>
        </div>

        {/* Horizontal Status Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {STATUS_FILTERS.map(([value, label]) => {
            const count = value === "all" ? dares.length : dares.filter((d) => d.status === Number(value)).length;
            const active = filter === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => setFilter(value)}
                className={`shrink-0 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-black transition-all active:scale-95 cursor-pointer ${
                  active
                    ? "bg-gradient-to-r from-[#0052FF] to-[#0045d8] text-white shadow-[0_4px_16px_rgba(0,82,255,0.28)] scale-[1.02]"
                    : "border border-slate-200/80 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 shadow-xs"
                }`}
              >
                <span>{label}</span>
                <span className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${active ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Error Feedback Box */}
      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50/80 p-4 text-xs font-bold text-rose-700 shadow-xs">
          Could not load live dares. Please check your wallet network and contract connection.
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && (
        <div className="glass-panel rounded-3xl py-20 text-center text-xs font-bold text-slate-500 shadow-xs">
          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-[#0052FF] shadow-xs">
            <RefreshCw className="h-5 w-5 animate-spin" />
          </div>
          Loading live on-chain dares from Base...
        </div>
      )}

      {/* Empty State View */}
      {!loading && !error && visible.length === 0 && (
        <div className="glass-panel rounded-3xl border border-dashed border-slate-200 bg-white/80 py-20 text-center shadow-xs">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100/80 border border-slate-200/70 text-slate-400 shadow-xs">
            <SlidersHorizontal className="h-6 w-6 stroke-[2]" />
          </div>
          <p className="mt-3.5 text-base font-black text-slate-900">No dares match these filters</p>
          <p className="mt-1 text-xs text-slate-400 font-medium">Try changing the status, token, or searching for different keywords.</p>
        </div>
      )}

      {/* Visible Cards Grid */}
      {!loading && !error && visible.length > 0 && (
        <div className="grid gap-3 md:gap-4 md:grid-cols-2">
          {visible.map((dare) => (
            <DareCard key={dare.id} dare={dare} />
          ))}
        </div>
      )}

      {!loading && !error && dares.length > 0 && (
        <p className="text-center text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          Showing {visible.length} of {dares.length} live on-chain dares
        </p>
      )}
    </div>
  );
}