"use client";

import { Header } from "@/components/header";
import {
  AlertTriangle,
  FileText,
  Scale,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

const legalSections = [
  {
    title: "Decentralized & Autonomous Execution",
    body: "Dare Protocol operates through immutable, self-executing smart contracts deployed on Base. Once collateral is deposited into escrow, state transitions, timers, and payout settlements are governed strictly by code logic without administrative overrides.",
    icon: FileText,
    tone: "from-blue-50 via-white to-blue-100/70 border-blue-200/80 text-[#0052FF] shadow-[0_4px_14px_rgba(0,82,255,0.12)]",
    aura: "bg-blue-400/10",
  },
  {
    title: "Non-Custodial Architecture & Advice Disclaimer",
    body: "The frontend interface and developers never take custody of your private keys or escrowed assets. Nothing presented on this application constitutes financial, legal, investment, or tax advice. You retain sole responsibility for your transactions.",
    icon: Scale,
    tone: "from-indigo-50 via-white to-indigo-100/70 border-indigo-200/80 text-indigo-600 shadow-[0_4px_14px_rgba(99,102,241,0.12)]",
    aura: "bg-indigo-400/10",
  },
  {
    title: "Market Volatility & Protocol Risks",
    body: "Cryptocurrency assets carry intrinsic market price volatility. Software bugs, EVM network reorgs, RPC outages, or contract edge-cases may occur. You may experience partial or permanent loss of staked capital.",
    icon: AlertTriangle,
    tone: "from-rose-50 via-white to-rose-100/70 border-rose-200/80 text-rose-600 shadow-[0_4px_14px_rgba(244,63,94,0.14)]",
    aura: "bg-rose-400/10",
  },
  {
    title: "User Due Diligence & Proof Standards",
    body: "Always verify on-chain contract addresses and inspect challenge requirements before locking collateral. Proof submissions require clear, inspectable evidence for human settlement and dispute adjudication.",
    icon: ShieldAlert,
    tone: "from-amber-50 via-white to-amber-100/70 border-amber-200/80 text-amber-600 shadow-[0_4px_14px_rgba(245,158,11,0.14)]",
    aura: "bg-amber-400/10",
  },
] as const;

export default function Legal() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-white text-slate-900">
      {/* Background Ambient Moving Light Spheres */}
      <div className="pointer-events-none max-md:hidden absolute -top-24 -left-20 h-96 w-96 rounded-full bg-gradient-to-br from-rose-100/20 via-blue-100/15 to-transparent blur-3xl animate-drift" />
      <div
        className="pointer-events-none max-md:hidden absolute top-1/3 -right-24 h-[420px] w-[420px] rounded-full bg-gradient-to-bl from-amber-100/15 via-rose-100/15 to-blue-100/15 blur-3xl animate-drift"
        style={{ animationDelay: "-6s" }}
      />

      <Header />

      <main className="relative mx-auto w-full max-w-[1120px] px-4 pb-[calc(6rem+env(safe-area-inset-bottom))] pt-5 sm:px-6 lg:px-8 lg:pb-20 lg:pt-8">
        {/* Header Eyebrow & Titles */}
        <div className="mb-10 max-w-3xl space-y-2.5">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-50/90 border border-rose-200/70 px-3 py-1 text-[10.5px] font-black uppercase tracking-[0.16em] text-rose-600 shadow-xs">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-rose-500" />
            </span>
            Mandatory Risk Disclosure
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Legal Disclaimer & <span className="text-gradient-soothing">Terms</span>
          </h1>

          <p className="text-xs sm:text-sm md:text-base leading-relaxed text-slate-500 font-medium">
            Please review these terms carefully before connecting your wallet, deploying smart contracts, or staking digital assets on Base.
          </p>
        </div>

        {/* 4-Card Legal & Risk Grid */}
        <section className="grid gap-4 sm:gap-5 md:grid-cols-2">
          {legalSections.map((card) => {
            const Icon = card.icon;
            return (
              <article
                key={card.title}
                className="glass-card-interactive group relative flex flex-col justify-between overflow-hidden rounded-[28px] p-6 sm:p-7 transition-all duration-300"
              >
                {/* Subtle Card Ambient Glow */}
                <div className="pointer-events-none absolute -top-12 -right-12 h-28 w-28 rounded-full bg-slate-100/50 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div>
                  {/* 3D Micro-Glass Icon Node */}
                  <div
                    className={`relative mb-5 flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br border ${card.tone} group-hover:scale-105 group-hover:rotate-3 transition-all duration-300`}
                  >
                    <div className={`absolute inset-1 rounded-xl blur-xs ${card.aura}`} />
                    <Icon className="relative z-10 h-6 w-6 stroke-[2.2]" />
                  </div>

                  {/* Section Title */}
                  <h2 className="text-base sm:text-lg font-black tracking-tight text-slate-900 group-hover:text-[#0052FF] transition-colors leading-snug">
                    {card.title}
                  </h2>

                  {/* Section Description */}
                  <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-slate-500 font-medium">
                    {card.body}
                  </p>
                </div>
              </article>
            );
          })}
        </section>

        {/* Bottom Acknowledgment Banner */}
        <div className="mt-8 glass-panel relative overflow-hidden rounded-[26px] p-5 sm:p-6 border-slate-200/80 bg-gradient-to-br from-slate-50/70 via-white to-slate-50/50 shadow-xs">
          <div className="flex items-start gap-4">
            <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-50 via-white to-slate-100 border border-slate-200 text-slate-700 shadow-xs">
              <ShieldCheck className="h-5 w-5 stroke-[2.2]" />
            </div>

            <div className="space-y-1">
              <div className="text-xs sm:text-sm font-black text-slate-900">
                User Acknowledgment & Consent
              </div>
              <p className="text-xs leading-relaxed text-slate-500 font-medium">
                By accessing this dApp and connecting your Web3 wallet, you explicitly acknowledge the experimental nature of on-chain protocols and assume all associated operational, cryptographic, and financial risks.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}