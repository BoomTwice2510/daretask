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
          <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(212,175,55,0.45)] bg-[rgba(10,10,10,0.9)] px-3 py-1 text-xs text-[#f5d566] backdrop-blur-md shadow-[0_0_25px_rgba(212,175,55,0.25)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d4af37] opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#d4af37]" />
            </span>
            Live on Base Sepolia • On‑chain dares
          </div>

          <div className="flex items-start justify-between gap-4">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1 rounded-full border border-yellow-500/20 bg-yellow-500/5 px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-yellow-300">
                <Sparkles className="h-3 w-3 text-yellow-300" />
                <span>Protocol overview</span>
              </div>

              <h1
                className="text-3xl md:text-4xl font-bold tracking-tight"
                style={{
                  background:
                    "linear-gradient(to right,#f5d566,#e6c547,#d4af37,#f97316)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                How Dare Protocol Works
              </h1>
              <p className="text-sm md:text-base text-white/70 max-w-xl">
                Create high‑stakes on‑chain challenges, let someone match your
                stake, and let the smart contract handle the outcome.
              </p>
            </div>

            <div className="hidden md:flex items-center justify-center rounded-2xl border border-[rgba(212,175,55,0.45)] bg-[rgba(10,10,10,0.95)] px-4 py-3 shadow-[0_18px_60px_rgba(0,0,0,0.9)]">
              <Coins className="h-6 w-6 text-[#f5d566] animate-bounce mr-2" />
              <span className="text-xs font-medium text-[#f5d566] uppercase tracking-wide">
                Stake • Dare • Win
              </span>
            </div>
          </div>
        </section>

        {/* Steps */}
        <section className="grid gap-6 md:grid-cols-2">
          {/* Step 1 */}
          <div className="group rounded-2xl border border-[rgba(212,175,55,0.35)] bg-[rgba(5,5,5,0.96)] p-5 transition-all duration-250 hover:border-[rgba(245,213,102,0.9)] hover:bg-black hover:shadow-[0_18px_60px_rgba(0,0,0,0.9)] hover:-translate-y-0.5">
            <div className="flex items-center gap-3 mb-3">
              <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-[rgba(245,213,102,0.12)]">
                <span className="absolute inset-0 rounded-full bg-[rgba(245,213,102,0.18)] blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
                <Sparkles className="relative h-5 w-5 text-[#f5d566]" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-mono text-white/50">Step 1</span>
                <h2 className="text-lg font-semibold text-white">
                  Create a Dare
                </h2>
              </div>
            </div>
            <ul className="list-disc ml-5 space-y-1.5 text-sm text-white/75">
              <li>User initiates a dare with description, duration, and stake.</li>
              <li>Stake must be ≥ 0.0001 ETH equivalent.</li>
              <li>Funds are locked in the contract until resolution.</li>
            </ul>
          </div>

          {/* Step 2 */}
          <div className="group rounded-2xl border border-[rgba(212,175,55,0.35)] bg-[rgba(5,5,5,0.96)] p-5 transition-all duration-250 hover:border-[rgba(245,213,102,0.9)] hover:bg-black hover:shadow-[0_18px_60px_rgba(0,0,0,0.9)] hover:-translate-y-0.5">
            <div className="flex items-center gap-3 mb-3">
              <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-[rgba(245,213,102,0.12)]">
                <span className="absolute inset-0 rounded-full bg-[rgba(245,213,102,0.18)] blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
                <Swords className="relative h-5 w-5 text-[#f5d566]" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-mono text-white/50">Step 2</span>
                <h2 className="text-lg font-semibold text-white">
                  Accept a Dare
                </h2>
              </div>
            </div>
            <ul className="list-disc ml-5 space-y-1.5 text-sm text-white/75">
              <li>Another user accepts by staking an equal amount.</li>
              <li>Both stakes form the total pot.</li>
              <li>Dare status turns active and the countdown begins.</li>
            </ul>
          </div>

          {/* Step 3 */}
          <div className="group rounded-2xl border border-[rgba(212,175,55,0.35)] bg-[rgba(5,5,5,0.96)] p-5 transition-all duration-250 hover:border-[rgba(245,213,102,0.9)] hover:bg-black hover:shadow-[0_18px_60px_rgba(0,0,0,0.9)] hover:-translate-y-0.5">
            <div className="flex items-center gap-3 mb-3">
              <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-[rgba(245,213,102,0.12)]">
                <span className="absolute inset-0 rounded-full bg-[rgba(245,213,102,0.18)] blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
                <FileCheck2 className="relative h-5 w-5 text-[#f5d566]" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-mono text-white/50">Step 3</span>
                <h2 className="text-lg font-semibold text-white">
                  Submit Proof
                </h2>
              </div>
            </div>
            <p className="text-sm text-white/75">
              After the deadline, the accepter submits proof (image, video,
              link, or IPFS URI) within the proof window. The proof is stored
              as a URI on‑chain.
            </p>
          </div>

          {/* Step 4 */}
          <div className="group rounded-2xl border border-[rgba(212,175,55,0.35)] bg-[rgba(5,5,5,0.96)] p-5 transition-all duration-250 hover:border-[rgba(245,213,102,0.9)] hover:bg-black hover:shadow-[0_18px_60px_rgba(0,0,0,0.9)] hover:-translate-y-0.5">
            <div className="flex items-center gap-3 mb-3">
              <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-[rgba(245,213,102,0.12)]">
                <span className="absolute inset-0 rounded-full bg-[rgba(245,213,102,0.18)] blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
                <Gavel className="relative h-5 w-5 text-[#f5d566]" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-mono text-white/50">Step 4</span>
                <h2 className="text-lg font-semibold text-white">
                  Resolve the Dare
                </h2>
              </div>
            </div>
            <ul className="list-disc ml-5 space-y-1.5 text-sm text-white/75">
              <li>Creator confirms or disputes the proof.</li>
              <li>If inactive, contract auto‑resolves to the other side.</li>
              <li>
                In disputes, the judge address resolves and winner gets the pot
                minus fee.
              </li>
            </ul>
          </div>
        </section>

        {/* Bottom hint */}
        <p className="mt-8 text-xs text-white/45">
          All logic runs on-chain: no centralized custody, no manual payouts —
          only smart contract rules.
        </p>
      </main>
    </div>
  );
}
