"use client";

import { Header } from "@/components/header";
import {
  ChevronDown,
  HelpCircle,
  Sparkles,
  ShieldAlert,
  Coins,
  Clock,
  FileCheck2,
  Gavel,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    icon: Sparkles,
    question: "What exactly is Dare Protocol?",
    answer:
      "Dare Protocol is a decentralized, peer-to-peer challenge settlement layer deployed on Base. A creator sets a specific, verifiable task with a custom stake and deadline. A challenger accepts by depositing an equal matching stake into a trustless smart contract escrow. Funds are released strictly when on-chain requirements are fulfilled.",
  },
  {
    icon: Coins,
    question: "What tokens can I stake?",
    answer:
      "Currently, Dare Protocol supports native ETH and verified ERC-20 stablecoins such as USDC on Base Sepolia. Both the creator and the challenger must lock identical amounts of the chosen asset before the challenge officially starts.",
  },
  {
    icon: Clock,
    question: "How long can a challenge run?",
    answer:
      "Challenge durations can range from 1 hour up to a protocol maximum of 7 days. If a challenge is not accepted before its deadline, the creator can cancel and reclaim 100% of their deposited collateral without penalty.",
  },
  {
    icon: FileCheck2,
    question: "How does the proof submission process work?",
    answer:
      "When a dare requires proof, the challenger must submit inspectable evidence (such as a Strava workout link, GitHub pull request, image URI, or social cast link) before the timer expires. Once submitted, a 24-hour review window opens for the creator to confirm or dispute.",
  },
  {
    icon: Gavel,
    question: "Who resolves disputes if there is a disagreement?",
    answer:
      "If the creator rejects the submitted proof, the dare enters a Disputed state. An independent protocol judge has 72 hours to inspect the evidence and declare a binding on-chain ruling. If the creator becomes inactive during review, the contract automatically resolves in favor of the challenger.",
  },
  {
    icon: ShieldCheck,
    question: "Can I cancel a dare after someone accepts it?",
    answer:
      "No. Once both parties have locked their stakes in escrow, the challenge is legally and cryptographically binding on-chain. Neither party can unilaterally withdraw funds until the dare resolves, expires, or is decided by a judge.",
  },
] as const;

export default function FAQ() {
  const [open, setOpen] = useState<number>(0);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-white text-slate-900">
      {/* Background Ambient Moving Light Spheres */}
      <div className="pointer-events-none max-md:hidden absolute -top-24 -left-20 h-96 w-96 rounded-full bg-gradient-to-br from-blue-200/20 via-indigo-100/15 to-transparent blur-3xl animate-drift" />
      <div
        className="pointer-events-none max-md:hidden absolute top-1/3 -right-24 h-[420px] w-[420px] rounded-full bg-gradient-to-bl from-rose-100/15 via-amber-100/15 to-blue-100/15 blur-3xl animate-drift"
        style={{ animationDelay: "-6s" }}
      />

      <Header />

      <main className="relative mx-auto w-full max-w-[1040px] px-4 pb-[calc(6rem+env(safe-area-inset-bottom))] pt-5 sm:px-6 lg:px-8 lg:pb-20 lg:pt-8">
        {/* Header Eyebrow & Titles */}
        <div className="mb-8 space-y-2">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50/90 border border-blue-200/70 px-3 py-1 text-[10.5px] font-black uppercase tracking-[0.16em] text-[#0052FF] shadow-xs">
            <Sparkles className="h-3 w-3" />
            Protocol Knowledge Base
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Frequently Asked <span className="text-gradient-soothing">Questions</span>
          </h1>

          <p className="max-w-2xl text-xs sm:text-sm leading-relaxed text-slate-500 font-medium">
            Everything you need to know about peer-to-peer escrow, proof verification, and dispute resolution on Base.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <section className="space-y-3.5">
          {faqs.map((item, i) => {
            const isOpen = open === i;
            const Icon = item.icon;

            return (
              <div
                key={item.question}
                className={cn(
                  "glass-card-interactive rounded-[24px] transition-all duration-300 overflow-hidden",
                  isOpen
                    ? "border-[#0052FF]/50 bg-white shadow-[0_12px_32px_rgba(0,82,255,0.08)] ring-2 ring-blue-100/60"
                    : "border-slate-200/80 bg-white/90"
                )}
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  className="flex w-full items-center justify-between gap-4 p-5 sm:p-6 text-left cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
                    {/* 3D Layered Micro-Glass Icon */}
                    <div
                      className={cn(
                        "relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border transition-all duration-300",
                        isOpen
                          ? "bg-gradient-to-br from-blue-50 via-white to-blue-100/80 border-blue-200/90 text-[#0052FF] shadow-[0_4px_14px_rgba(0,82,255,0.14)] scale-105"
                          : "bg-slate-50/80 border-slate-200/70 text-slate-500"
                      )}
                    >
                      <div className="absolute inset-1 rounded-xl bg-blue-400/10 blur-xs" />
                      <Icon className="relative z-10 h-5 w-5 stroke-[2.2]" />
                    </div>

                    <span className="text-sm sm:text-base font-black text-slate-900 tracking-tight leading-snug">
                      {item.question}
                    </span>
                  </div>

                  {/* Rotating Chevron Glass Capsule */}
                  <div
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-slate-200/70 bg-white text-slate-400 transition-all duration-300 shadow-xs",
                      isOpen && "rotate-180 text-[#0052FF] border-blue-200/80 bg-blue-50/50 shadow-xs"
                    )}
                  >
                    <ChevronDown className="h-4 w-4 stroke-[2.5]" />
                  </div>
                </button>

                {/* Animated Answer Drawer */}
                {isOpen && (
                  <div className="border-t border-slate-100 px-5 pb-6 pt-4 sm:px-6 animate-menu-slide">
                    <p className="text-xs sm:text-sm leading-relaxed text-slate-600 font-medium pl-0 sm:pl-[58px]">
                      {item.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </section>

        {/* Important Protocol Notice Callout */}
        <div className="mt-8 glass-panel relative overflow-hidden rounded-[26px] p-5 sm:p-6 border-amber-200/80 bg-gradient-to-br from-amber-50/70 via-white to-amber-50/40 shadow-xs">
          <div className="flex items-start gap-4">
            <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-50 via-white to-amber-100/80 border border-amber-200/90 text-amber-600 shadow-[0_4px_14px_rgba(245,158,11,0.14)]">
              <div className="absolute inset-1 rounded-xl bg-amber-400/10 blur-xs" />
              <ShieldAlert className="relative z-10 h-5 w-5 stroke-[2.2]" />
            </div>

            <div className="space-y-1">
              <div className="text-xs sm:text-sm font-black text-slate-900">
                Important Rule: Proof is Human-Verifiable Evidence
              </div>
              <p className="text-xs leading-relaxed text-slate-600 font-medium">
                Proof serves as inspectable evidence for human and judge review, not an automated oracle. To ensure swift, fair resolution, always make tasks specific, measurable, time-bounded, and independently verifiable.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}