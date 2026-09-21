"use client";

import { useCallback, useEffect, useState } from "react";
import { useWeb3 } from "@/lib/web3-provider";
import { Activity, Database, Layers, Sparkles } from "lucide-react";

export function LiveProtocolStats() {
  const { readContract } = useWeb3();
  const [s, setS] = useState({ total: 0, active: 0 });
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const total = Number(await readContract("dareCount"));
      let active = 0;
      const start = Math.max(0, total - 100);
      for (let i = start; i < total; i++) {
        try {
          const d = (await readContract("getDare", [BigInt(i)])) as any[];
          if (Number(d[11]) <= 3) active++;
        } catch {}
      }
      setS({ total, active });
    } catch {
      setS({ total: 0, active: 0 });
    } finally {
      setLoading(false);
    }
  }, [readContract]);

  useEffect(() => {
    load();
  }, [load]);

  const n = (x: number) => (loading ? "—" : x.toLocaleString());

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3">
      {/* Stat 1: Total Dares Created */}
      <div className="glass-card-interactive group relative overflow-hidden rounded-[22px] p-4 sm:p-5 transition-all duration-300">
        <div className="flex items-center justify-between">
          <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
            Dares Created
          </span>
          <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 via-white to-blue-100/60 border border-blue-200/80 text-[#0052FF] shadow-[0_4px_14px_rgba(0,82,255,0.12)] group-hover:scale-105 group-hover:rotate-3 transition-all duration-300">
            <div className="absolute inset-1 rounded-xl bg-blue-400/10 blur-xs" />
            <Database className="relative z-10 h-4.5 w-4.5 stroke-[2.2]" />
          </div>
        </div>
        <b className="mt-3 block font-mono text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
          {loading ? (
            <span className="inline-block h-8 w-16 animate-pulse rounded-lg bg-slate-100" />
          ) : (
            n(s.total)
          )}
        </b>
      </div>

      {/* Stat 2: Active Dares Now */}
      <div className="glass-card-interactive group relative overflow-hidden rounded-[22px] p-4 sm:p-5 transition-all duration-300">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-black uppercase tracking-[0.14em] text-emerald-700">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            Active Now
          </span>
          <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-50 via-white to-emerald-100/60 border border-emerald-200/80 text-emerald-600 shadow-[0_4px_14px_rgba(16,185,129,0.12)] group-hover:scale-105 group-hover:-rotate-3 transition-all duration-300">
            <div className="absolute inset-1 rounded-xl bg-emerald-400/10 blur-xs" />
            <Activity className="relative z-10 h-4.5 w-4.5 stroke-[2.2]" />
          </div>
        </div>
        <b className="mt-3 block font-mono text-2xl sm:text-3xl font-black tracking-tight text-emerald-600">
          {loading ? (
            <span className="inline-block h-8 w-14 animate-pulse rounded-lg bg-emerald-50" />
          ) : (
            n(s.active)
          )}
        </b>
      </div>

      {/* Stat 3: On-Chain Network */}
      <div className="glass-card-interactive group relative col-span-2 sm:col-span-1 overflow-hidden rounded-[22px] p-4 sm:p-5 transition-all duration-300">
        <div className="flex items-center justify-between">
          <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
            On-Chain Network
          </span>
          <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-50 via-white to-indigo-100/60 border border-indigo-200/80 text-indigo-600 shadow-[0_4px_14px_rgba(99,102,241,0.12)] group-hover:scale-105 group-hover:rotate-3 transition-all duration-300">
            <div className="absolute inset-1 rounded-xl bg-indigo-400/10 blur-xs" />
            <Layers className="relative z-10 h-4.5 w-4.5 stroke-[2.2]" />
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <b className="block text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
            Base
          </b>
          <span className="rounded-lg bg-blue-50 border border-blue-200/60 px-2 py-0.5 text-[9.5px] font-black uppercase tracking-wider text-[#0052FF] shadow-xs">
            Sepolia
          </span>
        </div>
      </div>
    </div>
  );
}