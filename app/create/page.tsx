"use client";

import { Header } from "@/components/header";
import { CreateDareForm } from "@/components/create-dare-form";
import { ArrowLeft, CheckCircle2, ShieldCheck, Sparkles, Zap } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

export default function CreateDarePage() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-white text-slate-900">
      {/* Background Ambient Moving Light Drift */}
      <div className="pointer-events-none max-md:hidden absolute -top-24 -left-20 h-96 w-96 rounded-full bg-gradient-to-br from-blue-200/20 via-indigo-100/15 to-transparent blur-3xl animate-drift" />
      <div
        className="pointer-events-none max-md:hidden absolute top-1/3 -right-24 h-[400px] w-[400px] rounded-full bg-gradient-to-bl from-rose-100/15 via-amber-100/15 to-blue-100/15 blur-3xl animate-drift"
        style={{ animationDelay: "-6s" }}
      />

      <Header />

      <main className="relative mx-auto w-full max-w-[1240px] px-4 pb-[calc(6rem+env(safe-area-inset-bottom))] pt-5 sm:px-6 lg:px-8 lg:pb-20 lg:pt-8">
        
        {/* Top Back Navigation & Network Status Row */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/explore"
            className="glass-card-interactive group inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-black text-slate-600 hover:text-[#0052FF] transition-all"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
            <span>Back to Explore</span>
          </Link>

          <div className="glass-panel hidden items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-black text-slate-700 shadow-xs sm:inline-flex">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            Base Sepolia Testnet
          </div>
        </div>

        {/* Page Hero Header & Benefit Cards */}
        <section className="mb-8 grid gap-6 lg:grid-cols-[1fr_380px] lg:items-end">
          <div>
            <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-blue-50/90 border border-blue-200/70 px-3 py-1 text-[10.5px] font-black uppercase tracking-[0.16em] text-[#0052FF] shadow-xs">
              <Sparkles className="h-3 w-3" />
              On-Chain Challenge Creator
            </div>

            <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl lg:text-[44px] lg:leading-[1.04]">
              Put real stakes behind a{" "}
              <span className="text-gradient-soothing">clear commitment.</span>
            </h1>

            <p className="mt-3 max-w-2xl text-xs sm:text-sm leading-relaxed text-slate-500 font-medium">
              Define what must happen, configure duration and collateral, then verify provability before locking funds into smart contract escrow.
            </p>
          </div>

          {/* 3D Frosted Glass Benefit Highlights */}
          <div className="grid grid-cols-2 gap-3">
            {/* Highlight 1 */}
            <div className="glass-card-interactive group flex flex-col rounded-3xl p-4 transition-all">
              <div className="relative mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50/90 via-white to-blue-100/60 border border-blue-200/80 text-[#0052FF] shadow-[0_4px_14px_rgba(0,82,255,0.12)] group-hover:scale-105 group-hover:rotate-3 transition-all duration-300">
                <div className="absolute inset-1 rounded-xl bg-blue-400/10 blur-xs" />
                <CheckCircle2 className="relative z-10 h-5 w-5 stroke-[2.4]" />
              </div>
              <div className="text-xs sm:text-sm font-black text-slate-900">Clear Rules</div>
              <div className="mt-1 text-[11px] leading-snug text-slate-500 font-medium">
                Both challenger and creator abide by identical on-chain terms.
              </div>
            </div>

            {/* Highlight 2 */}
            <div className="glass-card-interactive group flex flex-col rounded-3xl p-4 transition-all">
              <div className="relative mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-50/90 via-white to-emerald-100/60 border border-emerald-200/80 text-emerald-600 shadow-[0_4px_14px_rgba(16,185,129,0.12)] group-hover:scale-105 group-hover:-rotate-3 transition-all duration-300">
                <div className="absolute inset-1 rounded-xl bg-emerald-400/10 blur-xs" />
                <ShieldCheck className="relative z-10 h-5 w-5 stroke-[2.4]" />
              </div>
              <div className="text-xs sm:text-sm font-black text-slate-900">Proof First</div>
              <div className="mt-1 text-[11px] leading-snug text-slate-500 font-medium">
                Confirm evidence is checkable before locking collateral.
              </div>
            </div>
          </div>
        </section>

        {/* Create Dare Interactive Form Shell */}
        <Suspense
          fallback={
            <div className="glass-panel flex min-h-[360px] items-center justify-center rounded-[30px] p-8 text-center text-xs font-bold text-slate-400 shadow-xs">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#0052FF] animate-ping" />
                Loading challenge builder...
              </div>
            </div>
          }
        >
          <CreateDareForm />
        </Suspense>
      </main>
    </div>
  );
}