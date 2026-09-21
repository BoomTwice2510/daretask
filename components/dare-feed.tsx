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
    <div className="space-y-7">
      <section className="rounded-[28px] border border-[#dce5f1] bg-white p-5 shadow-[0_18px_55px_rgba(35,65,110,0.07)] sm:p-7">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#dce5f1] bg-[#f7faff] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-[#1268f3]">
              <Sparkles className="h-3.5 w-3.5" /> Live on-chain marketplace
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-[#10213f] sm:text-4xl">Explore Dares</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#71819a] sm:text-base">
              Discover real challenges with matched stakes, deadlines and proof rules enforced by the Dare Protocol.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {([
              { label: "Dares", value: totalOnChain.toLocaleString(), Icon: Database },
              { label: "Open", value: openCount.toString(), Icon: Activity },
              { label: "Running", value: runningCount.toString(), Icon: Clock3 },
            ] as { label: string; value: string; Icon: LucideIcon }[]).map(({ label, value, Icon }) => (
              <div key={String(label)} className="min-w-[92px] rounded-2xl border border-[#e1e8f2] bg-[#f9fbfe] px-3 py-3 sm:min-w-[110px]">
                <Icon className="h-4 w-4 text-[#1268f3]" />
                <div className="mt-2 text-lg font-extrabold text-[#10213f]">{value}</div>
                <div className="text-[11px] text-[#8190a7]">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-[24px] border border-[#dce5f1] bg-white p-4 shadow-[0_12px_35px_rgba(35,65,110,0.05)] sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row">
          <label className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8a99ae]" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search dare descriptions..." className="h-11 w-full rounded-xl border border-[#dce5f1] bg-[#f9fbfe] pl-10 pr-4 text-sm text-[#173154] outline-none transition focus:border-[#1268f3] focus:bg-white" />
          </label>
          <div className="flex gap-2">
            <select value={tokenFilter} onChange={(e) => setTokenFilter(e.target.value as "all" | "ETH" | "USDC")} className="h-11 rounded-xl border border-[#dce5f1] bg-white px-3 text-sm font-semibold text-[#52657f] outline-none">
              <option value="all">All tokens</option><option value="ETH">ETH</option><option value="USDC">USDC</option>
            </select>
            <select value={sort} onChange={(e) => setSort(e.target.value as SortMode)} className="h-11 rounded-xl border border-[#dce5f1] bg-white px-3 text-sm font-semibold text-[#52657f] outline-none">
              <option value="newest">Newest</option><option value="ending">Ending soon</option><option value="stake">Highest stake</option>
            </select>
            <button onClick={fetchDares} disabled={loading} className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#dce5f1] bg-white text-[#1268f3] hover:bg-[#f4f8ff] disabled:opacity-50" aria-label="Refresh dares">
              <RefreshCw className={loading ? "h-4 w-4 animate-spin" : "h-4 w-4"} />
            </button>
          </div>
        </div>
        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          {STATUS_FILTERS.map(([value, label]) => (
            <button key={value} onClick={() => setFilter(value)} className={`shrink-0 rounded-full border px-4 py-2 text-xs font-bold transition ${filter === value ? "border-[#1268f3] bg-[#1268f3] text-white shadow-[0_8px_18px_rgba(18,104,243,0.18)]" : "border-[#dce5f1] bg-white text-[#60718c] hover:border-[#b9cce7]"}`}>
              {label}{value !== "all" && <span className="ml-1.5 opacity-70">{dares.filter((d) => d.status === Number(value)).length}</span>}
            </button>
          ))}
        </div>
      </section>

      {error && <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">Could not load live dares. Check the wallet network and contract connection.</div>}
      {loading && <div className="rounded-[24px] border border-[#dce5f1] bg-white py-20 text-center text-sm text-[#71819a]">Loading latest on-chain dares...</div>}
      {!loading && !error && visible.length === 0 && <div className="rounded-[24px] border border-dashed border-[#cbd8e8] bg-white py-20 text-center"><SlidersHorizontal className="mx-auto h-8 w-8 text-[#9aa9bd]" /><p className="mt-3 font-bold text-[#173154]">No dares match these filters</p><p className="mt-1 text-sm text-[#8190a7]">Try another status, token or search term.</p></div>}
      {!loading && !error && visible.length > 0 && <div className="grid gap-4 md:grid-cols-2">{visible.map((dare) => <DareCard key={dare.id} dare={dare} />)}</div>}

      {!loading && !error && dares.length > 0 && <p className="text-center text-xs text-[#91a0b4]">Showing the latest {dares.length} on-chain dares.</p>}
    </div>
  );
}
