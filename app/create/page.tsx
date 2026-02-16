"use client";

import { Header } from "@/components/header";
import { CreateDareForm } from "@/components/create-dare-form";
import { ArrowLeft, Zap, Coins, Gauge } from "lucide-react";
import Link from "next/link";

export default function CreateDarePage() {
  return (
    <div className="min-h-screen bg-black text-foreground">
      <Header />

      <main className="mx-auto max-w-3xl px-4 py-10 pb-24">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm text-white/60 hover:text-[#f5d566] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to feed
          </Link>

          <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(212,175,55,0.45)] bg-[rgba(10,10,10,0.9)] px-3 py-1 text-[11px] text-[#f5d566] backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d4af37] opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#d4af37]" />
            </span>
            On‑chain dare creation
          </div>
        </div>

        {/* Hero */}
        <section className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1
              className="text-3xl md:text-4xl font-bold"
              style={{
                background: "linear-gradient(to right,#f5d566,#e6c547,#d4af37)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Create a Dare
            </h1>
            <p className="text-sm md:text-base text-white/70 mt-2 max-w-xl">
              Put real stakes behind real commitments. Define your challenge and let the contract
              handle timing, proof windows, and payouts automatically.
            </p>
          </div>

          <div className="mt-3 md:mt-0 flex flex-col gap-2 text-xs text-white/70">
            <div className="inline-flex items-center gap-2 rounded-xl border border-[rgba(212,175,55,0.35)] bg-[rgba(10,10,10,0.9)] px-3 py-2 backdrop-blur-md">
              <Zap className="h-4 w-4 text-[#f5d566] animate-pulse" />
              <span>Network: Base Sepolia (testnet)</span>
            </div>
            <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-[rgba(15,15,15,0.9)] px-3 py-2 backdrop-blur-md">
              <Gauge className="h-4 w-4 text-emerald-400" />
              <span>
                Mainnet reference: simple Base tx ≈{" "}
                <span className="font-mono">0.001–0.005 USD</span> gas; dare create + accept
                typically stays under a few cents in normal conditions.
              </span>
            </div>
          </div>
        </section>

        {/* Form card */}
        <div
          className="rounded-2xl p-5 md:p-6 shadow-[0_18px_60px_rgba(0,0,0,0.85)] transition-all duration-300"
          style={{
            backdropFilter: "blur(14px)",
            background:
              "linear-gradient(135deg, rgba(212,175,55,0.12), rgba(10,10,10,0.96))",
            border: "1px solid rgba(212,175,55,0.35)",
          }}
        >
          <CreateDareForm />
        </div>

        {/* Info card */}
        <div
          className="mt-6 rounded-2xl p-4 md:p-5 text-xs flex flex-col gap-3"
          style={{
            backdropFilter: "blur(10px)",
            backgroundColor: "rgba(10,10,10,0.9)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div className="flex items-center gap-2">
            <Coins className="h-4 w-4 text-[#f5d566]" />
            <p className="font-medium text-white text-sm">
              How it works (stakes + fees)
            </p>
          </div>
          <ul className="flex flex-col gap-1.5 list-disc pl-4 text-white/70">
            <li>
              You choose description, duration (1–7 days), token, and stake amount (min 0.0001).
            </li>
            <li>
              Someone accepts and matches your stake — the dare becomes{" "}
              <span className="text-emerald-400 font-medium">Running</span>.
            </li>
            <li>
              After the deadline, the accepter has a limited proof window to submit a URI
              (image, video, IPFS, etc.).
            </li>
            <li>
              You can confirm or dispute the proof. If you stay inactive, the accepter can win
              by timeout.
            </li>
            <li>
              Winner receives the full pot minus a 3% protocol fee (further reduced for higher
              badge tiers).
            </li>
            <li>
              XP: win = +100 XP, loss = −20 XP — used for badges and leaderboard rank.
            </li>
            <li className="text-[11px] text-white/40 mt-1">
              Gas note: actual gas cost depends on Base network usage and your wallet settings.
              Values above are rough mainnet references, not a guarantee.
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}
