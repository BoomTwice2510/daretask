"use client";

import Link from "next/link";
import { LiveProtocolStats } from "@/components/live-protocol-stats";
import { ArrowRight, Plus, ShieldCheck, Trophy, Zap } from "lucide-react";

export function LandingMobile() {
  return (
    <main className="relative min-h-[calc(100vh-60px)] w-full overflow-hidden bg-white px-3.5 pt-2 pb-28 space-y-3.5">
      {/* Hero Glass Card */}
      <section className="glass-card-interactive relative overflow-hidden rounded-2xl p-4 shadow-none">
        {/* Iridescent Live Tag */}
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/70 bg-gradient-to-r from-blue-50/90 to-indigo-50/80 px-3 py-1 shadow-xs">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#0052FF] opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#0052FF]" />
          </span>
          <span className="text-[10px] font-black uppercase tracking-[0.14em] text-[#0052FF]">
            Base · Real Stakes · Clear Proof
          </span>
        </div>

        {/* Hero Headings */}
        <h1 className="mt-3.5 text-[32px] font-black leading-[1.03] tracking-tight text-slate-900">
          Dare someone.
          <br />
          <span className="text-gradient-soothing">
            Prove it on-chain.
          </span>
        </h1>

        <p className="mt-2 text-[12.5px] leading-relaxed text-slate-600 font-medium">
          Turn real commitments into matched-stake challenges with trustless on-chain proof.
        </p>

        {/* Action Buttons with High Tactile Elevation */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Link
            href="/create"
            className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-b from-[#0052FF] to-[#0045d8] px-4 text-xs font-black text-white shadow-[0_8px_22px_rgba(0,82,255,0.32)] transition-all active:scale-[0.96] cursor-pointer"
          >
            <div className="flex h-5 w-5 items-center justify-center rounded-lg bg-white/20">
              <Plus className="h-3.5 w-3.5 stroke-[3]" />
            </div>
            Create Dare
          </Link>

          <Link
            href="/explore"
            className="flex h-12 items-center justify-center gap-1.5 rounded-2xl border border-slate-200/90 bg-white/95 px-4 text-xs font-bold text-slate-800 shadow-[0_4px_14px_rgba(15,23,42,0.03)] transition-all active:scale-[0.96] cursor-pointer"
          >
            Explore
            <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
          </Link>
        </div>
      </section>

      {/* Protocol Live Metrics */}
      <LiveProtocolStats />

{/* Feature Cards with Bigger 3D Glass Icons & Interactive Lift */}
      <section className="space-y-2.5">
        {/* Feature 1 */}
        <div className="glass-card-interactive group flex items-center gap-3.5 rounded-2xl p-3">
          <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50/90 via-white to-blue-100/60 border border-blue-200/80 shadow-none transition-all duration-300">
            <div className="absolute inset-1 rounded-xl bg-blue-400/10 blur-xs" />
            <Zap className="relative z-10 h-6 w-6 text-[#0052FF] stroke-[2.2]" />
          </div>
          <div className="min-w-0 flex-1">
            <b className="text-xs font-black text-slate-900">How it works</b>
            <p className="mt-0.5 text-[11px] leading-snug text-slate-500 font-medium">
              Create a dare, match the stake, submit proof, resolve the outcome on-chain.
            </p>
          </div>
        </div>

        {/* Feature 2 */}
        <div className="glass-card-interactive group flex items-center gap-3.5 rounded-2xl p-3">
          <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-50/90 via-white to-emerald-100/60 border border-emerald-200/80 shadow-none transition-all duration-300">
            <div className="absolute inset-1 rounded-xl bg-emerald-400/10 blur-xs" />
            <ShieldCheck className="relative z-10 h-6 w-6 text-emerald-600 stroke-[2.2]" />
          </div>
          <div className="min-w-0 flex-1">
            <b className="text-xs font-black text-slate-900">Trustless rules</b>
            <p className="mt-0.5 text-[11px] leading-snug text-slate-500 font-medium">
              The smart contract controls escrow and releases funds strictly after verification.
            </p>
          </div>
        </div>

        {/* Feature 3 */}
        <div className="glass-card-interactive group flex items-center gap-3.5 rounded-2xl p-3">
          <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-50/90 via-white to-amber-100/60 border border-amber-200/80 shadow-none transition-all duration-300">
            <div className="absolute inset-1 rounded-xl bg-amber-400/10 blur-xs" />
            <Trophy className="relative z-10 h-6 w-6 text-amber-600 stroke-[2.2]" />
          </div>
          <div className="min-w-0 flex-1">
            <b className="text-xs font-black text-slate-900">Earn XP Badges</b>
            <p className="mt-0.5 text-[11px] leading-snug text-slate-500 font-medium">
              Win dares to build your on-chain reputation, unlock higher stakes, and climb ranks.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}