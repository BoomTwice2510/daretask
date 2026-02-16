"use client";

import { Header } from "@/components/header";
import { Sparkles, Swords, FileCheck2, Gavel, Coins } from "lucide-react";

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Top hero */}
        <section className="mb-10 flex flex-col gap-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-950 px-3 py-1 text-xs text-gray-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            Live on Base Sepolia • On‑chain dares
          </div>

          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                How Dare Protocol Works
              </h1>
              <p className="mt-3 text-sm md:text-base text-gray-400 max-w-xl">
                Create high‑stakes on‑chain challenges, let someone match your stake,
                and let the smart contract handle the outcome.
              </p>
            </div>

            <div className="hidden md:flex items-center justify-center rounded-2xl border border-primary/40 bg-primary/10 px-4 py-3 shadow-[0_0_40px_rgba(59,130,246,0.35)]">
              <Coins className="h-6 w-6 text-primary animate-bounce mr-2" />
              <span className="text-xs font-medium text-primary uppercase tracking-wide">
                Stake • Dare • Win
              </span>
            </div>
          </div>
        </section>

        {/* Steps */}
        <section className="grid gap-6 md:grid-cols-2">
          {/* Step 1 */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-950/80 p-5 hover:border-primary/60 hover:bg-neutral-900/80 transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                <Sparkles className="h-5 w-5 text-primary animate-pulse" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-mono text-gray-400">Step 1</span>
                <h2 className="text-lg font-semibold">Create a Dare</h2>
              </div>
            </div>
            <ul className="list-disc ml-5 space-y-1.5 text-sm text-gray-300">
              <li>User initiates a dare with description, duration, and stake.</li>
              <li>Stake must be ≥ 0.0001 ETH equivalent.</li>
              <li>Funds are locked in the contract until resolution.</li>
            </ul>
          </div>

          {/* Step 2 */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-950/80 p-5 hover:border-sky-500/60 hover:bg-neutral-900/80 transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-500/10">
                <Swords className="h-5 w-5 text-sky-400 animate-pulse" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-mono text-gray-400">Step 2</span>
                <h2 className="text-lg font-semibold">Accept a Dare</h2>
              </div>
            </div>
            <ul className="list-disc ml-5 space-y-1.5 text-sm text-gray-300">
              <li>Another user accepts by staking an equal amount.</li>
              <li>Both stakes form the total pot.</li>
              <li>Dare status turns active and the countdown begins.</li>
            </ul>
          </div>

          {/* Step 3 */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-950/80 p-5 hover:border-emerald-500/60 hover:bg-neutral-900/80 transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/10">
                <FileCheck2 className="h-5 w-5 text-emerald-400 animate-pulse" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-mono text-gray-400">Step 3</span>
                <h2 className="text-lg font-semibold">Submit Proof</h2>
              </div>
            </div>
            <p className="text-sm text-gray-300">
              After the deadline, the accepter submits proof (image, video, link, or
              IPFS URI) within the proof window. The proof is stored as a URI on‑chain.
            </p>
          </div>

          {/* Step 4 */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-950/80 p-5 hover:border-amber-500/60 hover:bg-neutral-900/80 transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-500/10">
                <Gavel className="h-5 w-5 text-amber-400 animate-pulse" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-mono text-gray-400">Step 4</span>
                <h2 className="text-lg font-semibold">Resolve the Dare</h2>
              </div>
            </div>
            <ul className="list-disc ml-5 space-y-1.5 text-sm text-gray-300">
              <li>Creator confirms or disputes the proof.</li>
              <li>If inactive, contract auto‑resolves to the other side.</li>
              <li>In disputes, the judge address resolves and winner gets the pot minus fee.</li>
            </ul>
          </div>
        </section>

        {/* Bottom hint */}
        <p className="mt-8 text-xs text-gray-500">
          All logic runs on-chain: no centralized custody, no manual payouts — only
          smart contract rules.
        </p>
      </main>
    </div>
  );
}
