"use client";

import { useCallback, useEffect, useState } from "react";
import { useWeb3 } from "@/lib/web3-provider";
import { DareCard } from "@/components/dare-card";
import type { DareData } from "@/lib/types";
import { Loader2, RefreshCw } from "lucide-react";

type FilterStatus = "0" | "1" | "2" | "3" | "4" | "5";

export function DareFeed() {
  const { readContract } = useWeb3();
  const [dares, setDares] = useState<DareData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterStatus>("0");
  const [error, setError] = useState<string | null>(null);

  const fetchDares = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const count = (await readContract("dareCount")) as bigint;
      const total = Number(count);
      const start = Math.max(0, total - 50);
      const results = await Promise.all(Array.from({ length: total - start }, (_, offset) => {
        const i = total - 1 - offset;
        return (async () => {
          const result = (await readContract("getDare", [BigInt(i)])) as [string,string,string,string,bigint,bigint,bigint,boolean,string,bigint,bigint,number];
          return { id:i, creator:result[0], accepter:result[1], description:result[2], token:result[3], stake:result[4], createdAt:result[5], deadline:result[6], proofSubmitted:result[7], proofURI:result[8], proofTime:result[9], disputeTime:result[10], status:result[11] } as DareData;
        })();
      }));
      setDares(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load dares");
      setDares([]);
    } finally { setLoading(false); }
  }, [readContract]);

  useEffect(() => { fetchDares(); }, [fetchDares]);

  const filters = [
    ["0", "Open"], ["1", "Running"], ["2", "Proof"], ["3", "Disputed"], ["4", "Resolved"], ["5", "Cancelled"],
  ] as const;
  const filtered = dares.filter((d) => d.status === Number(filter));

  return <div>
    <div className="dare-feed-heading"><div className="dare-eyebrow">EXPLORE</div><h1>Find a dare worth taking.</h1><p>Browse open challenges with clear stakes, time windows and proof expectations.</p></div>
    <div className="dare-feed-toolbar">
      <div className="dare-filter-row">{filters.map(([value,label]) => <button key={value} onClick={() => setFilter(value)} className={`dare-filter ${filter === value ? "is-active" : ""}`}>{label}{filter !== value && <span> {dares.filter(d => d.status === Number(value)).length}</span>}</button>)}</div>
      <button className="dare-feed-refresh" onClick={fetchDares} disabled={loading} aria-label="Refresh dares"><RefreshCw className={loading ? "animate-spin" : ""} size={15} /></button>
    </div>
    {error && <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 mb-3">Could not load live dares. {error.includes("timeout") ? "The RPC endpoint timed out." : "Check the wallet network and contract connection."}</div>}
    {loading && <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-600" /></div>}
    {!loading && !error && filtered.length === 0 && <div className="dare-soft-card py-20 text-center text-xs text-slate-500">No dares found for this filter.</div>}
    {!loading && <div className="dare-feed-list">{filtered.map((dare) => <DareCard key={dare.id} dare={dare} />)}</div>}
  </div>;
}
