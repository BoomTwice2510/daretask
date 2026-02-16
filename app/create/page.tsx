"use client";

import { Header } from "@/components/header";
import { CreateDareForm } from "@/components/create-dare-form";
import { ArrowLeft, Zap, Coins, Gauge } from "lucide-react";
import Link from "next/link";

export default function CreateDarePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <main className="mx-auto max-w-3xl px-4 py-8 pb-24">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to feed
          </Link>

          <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-[11px] text-primary">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            On‑chain dare creation
          </div>
        </div>

        {/* Hero */}
        <section className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Create a Dare
            </h1>
            <p className="text-sm md:text-base text-gray-400 mt-2 max-w-xl">
              Set the rules, lock in your stake, and let someone match you. The
              contract handles timing, proof windows, and payouts automatically.
            </p>
          </div>

          <div className="mt-3 md:mt-0 flex flex-col gap-2 text-xs text-gray-300">
            <div className="inline-flex items-center gap-2 rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2">
              <Zap className="h-4 w-4 text-primary animate-pulse" />
              <span>Network: Base Sepolia (testnet)</span>
            </div>
            <div className="inline-flex items-center gap-2 rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2">
              <Gauge className="h-4 w-4 text-emerald-400" />
              <span>
                Mainnet reference: simple Base tx ≈{" "}
                <span className="font-mono">0.001–0.005 USD</span> gas;
                dare create + accept typically stays under a few cents total in
                normal conditions.
              </span>
            </div>
          </div>
        </section>

        {/* Form card */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-950/90 p-5 md:p-6 shadow-[0_0_40px_rgba(15,23,42,0.6)] hover:border-primary/50 hover:bg-neutral-900/90 transition-colors">
          <CreateDareForm />
        </div>

        {/* Info card */}
        <div className="mt-6 rounded-2xl bg-neutral-900 border border-neutral-800 p-4 md:p-5 text-xs text-gray-400 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Coins className="h-4 w-4 text-primary" />
            <p className="font-medium text-white text-sm">
              How it works (stakes + fees)
            </p>
          </div>
          <ul className="flex flex-col gap-1.5 list-disc pl-4">
            <li>
              You choose description, duration (1–7 days), token, and stake
              amount (min 0.0001).
            </li>
            <li>
              Someone accepts and matches your stake — the dare becomes{" "}
              <span className="text-emerald-400 font-medium">Running</span>.
            </li>
            <li>
              After the deadline, the accepter has a limited proof window to
              submit a URI (image, video, IPFS, etc.).
            </li>
            <li>
              You can confirm or dispute the proof. If you stay inactive, the
              accepter can win by timeout.
            </li>
            <li>
              Winner receives the full pot minus a 3% protocol fee (further
              reduced for higher badge tiers).
            </li>
            <li>
              XP: win = +100 XP, loss = −20 XP — used for badges and
              leaderboard rank.
            </li>
            <li className="text-[11px] text-gray-500 mt-1">
              Gas note: actual gas cost depends on Base network usage and your
              wallet settings. Values above are rough mainnet references, not a
              guarantee.[web:88][web:97]
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}
