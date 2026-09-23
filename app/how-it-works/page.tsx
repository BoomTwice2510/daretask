"use client";

import { Header } from "@/components/header";
import { ArrowRight, CheckCircle2, Coins, FileCheck2, Gavel, LockKeyhole, Search, ShieldCheck, Timer } from "lucide-react";

const steps = [
  { n: "01", icon: Search, color: "blue", title: "Define the dare", text: "Write one clear, measurable challenge. Choose the deadline, stake asset and whether proof is required." },
  { n: "02", icon: Coins, color: "indigo", title: "Lock the creator stake", text: "The creator deposits the selected ETH or USDC amount into the protocol escrow." },
  { n: "03", icon: LockKeyhole, color: "emerald", title: "Someone accepts", text: "An accepter joins by depositing the matching stake. The challenge is now running on-chain." },
  { n: "04", icon: Timer, color: "orange", title: "Deadline and proof window", text: "The clock controls when the challenge can progress. If proof is required, the accepter submits inspectable evidence during the allowed window." },
  { n: "05", icon: Gavel, color: "rose", title: "Review and settle", text: "The creator can confirm or dispute submitted proof. If a dispute remains, the protocol judge resolves the escrow according to the contract rules." },
];

const tone: Record<string, string> = {
  blue: "border-blue-200 bg-blue-50 text-[#0052FF]",
  indigo: "border-indigo-200 bg-indigo-50 text-indigo-600",
  emerald: "border-emerald-200 bg-emerald-50 text-emerald-600",
  orange: "border-orange-200 bg-orange-50 text-orange-600",
  rose: "border-rose-200 bg-rose-50 text-rose-600",
};

export default function HowItWorks() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-white text-slate-900">
      <div className="pointer-events-none max-md:hidden absolute -top-24 -right-24 h-96 w-96 rounded-full bg-blue-200/20 blur-3xl animate-drift" />
      <div className="pointer-events-none max-md:hidden absolute top-1/2 -left-32 h-96 w-96 rounded-full bg-emerald-100/20 blur-3xl animate-drift" />
      <Header />

      <main className="relative mx-auto w-full max-w-[1120px] px-4 pb-[calc(6rem+env(safe-area-inset-bottom))] pt-5 sm:px-6 lg:px-8 lg:pb-20 lg:pt-10">
        <header className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-[#0052FF]">
            <ShieldCheck className="h-3.5 w-3.5" /> Protocol Flow
          </div>
          <h1 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900">
            From dare to <span className="text-[#0052FF]">settlement.</span>
          </h1>
          <p className="mt-2 max-w-2xl text-xs sm:text-sm leading-relaxed text-[#36506f] font-semibold">
            A simple view of what happens to a challenge after you create it, who acts at each stage, and how the escrow reaches its final state.
          </p>
        </header>

        <section className="mt-8 grid gap-3 sm:gap-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <article key={step.n} className="relative overflow-hidden rounded-[26px] border border-slate-200 bg-white p-4 sm:p-6 shadow-[0_6px_24px_rgba(15,23,42,0.04)]">
                {index < steps.length - 1 && <div className="pointer-events-none absolute left-[31px] top-[76px] hidden h-[calc(100%-46px)] w-px bg-gradient-to-b from-blue-200 to-emerald-100 sm:block" />}
                <div className="flex items-start gap-4 sm:gap-5">
                  <div className={`relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border ${tone[step.color]}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-[10px] font-black tracking-[0.16em] text-[#4f6b8a]">STEP {step.n}</span>
                      {index === 0 && <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[9px] font-black uppercase text-[#0052FF]">Creator</span>}
                      {index === 2 && <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-black uppercase text-emerald-700">Accepter</span>}
                    </div>
                    <h2 className="mt-1 text-base sm:text-lg font-black text-slate-900">{step.title}</h2>
                    <p className="mt-1.5 max-w-3xl text-xs sm:text-sm leading-relaxed text-[#36506f] font-semibold">{step.text}</p>
                  </div>
                  <CheckCircle2 className="hidden sm:block h-5 w-5 shrink-0 text-emerald-500" />
                </div>
              </article>
            );
          })}
        </section>

        <section className="mt-8 grid gap-4 lg:grid-cols-3">
          <div className="rounded-[24px] border border-blue-200 bg-blue-50/55 p-5">
            <FileCheck2 className="h-5 w-5 text-[#0052FF]" />
            <h2 className="mt-3 text-sm font-black text-blue-950">Good proof</h2>
            <p className="mt-1 text-xs leading-relaxed text-[#36506f] font-semibold">A public, dated and independently inspectable record that directly matches the task.</p>
          </div>
          <div className="rounded-[24px] border border-amber-200 bg-amber-50/60 p-5">
            <Timer className="h-5 w-5 text-amber-600" />
            <h2 className="mt-3 text-sm font-black text-amber-950">Good deadline</h2>
            <p className="mt-1 text-xs leading-relaxed text-amber-900/80 font-semibold">Enough time to complete the task, but specific enough that the contract can enforce the boundary.</p>
          </div>
          <div className="rounded-[24px] border border-emerald-200 bg-emerald-50/60 p-5">
            <ShieldCheck className="h-5 w-5 text-emerald-600" />
            <h2 className="mt-3 text-sm font-black text-emerald-950">Good dare</h2>
            <p className="mt-1 text-xs leading-relaxed text-emerald-900/80 font-semibold">Clear objective + matched stake + deadline + evidence path = less ambiguity during settlement.</p>
          </div>
        </section>

        <div className="mt-8 flex justify-center">
          <a href="/create" className="inline-flex min-h-12 items-center gap-2 rounded-2xl bg-gradient-to-b from-[#0052FF] to-[#0045d8] px-6 text-xs sm:text-sm font-black text-white shadow-[0_8px_24px_rgba(0,82,255,0.25)] active:scale-95 transition-all touch-manipulation">
            Create a Dare <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </main>
    </div>
  );
}
