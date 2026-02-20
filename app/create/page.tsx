"use client";

import { Header } from "@/components/header";
import { CreateDareForm } from "@/components/create-dare-form";
import { ArrowLeft, Zap, Gauge, Sparkles } from "lucide-react";
import Link from "next/link";
import { Suspense, useState } from "react";

export default function CreateDarePage() {
  const [showSuccess, setShowSuccess] = useState(false);

  // yeh handler CreateDareForm ko pass karega
  const handleDareCreated = () => {
    setShowSuccess(true);
  };

  const handleSuccessClose = () => setShowSuccess(false);

  const handleBackToFeed = () => {
    window.location.href = "/"; // ya router.push("/")
  };

  return (
    <div className="relative min-h-screen bg-black text-foreground">
      <Header />

      <main className="mx-auto max-w-3xl px-4 py-10 pb-24">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/"
            className="group inline-flex items-center gap-1 text-sm text-white/60 transition-colors hover:text-[#f5d566]"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
            <span className="relative">
              Back to feed
              <span className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-gradient-to-r from-transparent via-[#f5d566] to-transparent transition-transform duration-200 group-hover:scale-x-100" />
            </span>
          </Link>

          <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(212,175,55,0.45)] bg-[rgba(10,10,10,0.9)] px-3 py-1 text-[11px] text-[#f5d566] backdrop-blur-md shadow-[0_0_25px_rgba(212,175,55,0.35)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d4af37] opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#d4af37]" />
            </span>
            On‑chain dare creation
          </div>
        </div>

        {/* Hero */}
        <section className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1 rounded-full border border-yellow-500/20 bg-yellow-500/5 px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-yellow-300">
              <Sparkles className="h-3 w-3 text-yellow-300" />
              <span>New dare</span>
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
              Create a Dare
            </h1>

            <p className="text-sm md:text-base text-white/70 max-w-xl">
              Put real stakes behind real commitments. Define your challenge and
              let the contract handle timing, proof windows, and payouts
              automatically.
            </p>
          </div>

          <div className="mt-3 md:mt-0 flex flex-col gap-2 text-xs text-white/70">
            <div className="group inline-flex items-center gap-2 rounded-xl border border-[rgba(212,175,55,0.35)] bg-[rgba(10,10,10,0.9)] px-3 py-2 backdrop-blur-md transition-all duration-200 hover:border-[#f5d566] hover:shadow-[0_0_30px_rgba(245,213,102,0.28)]">
              <Zap className="h-4 w-4 text-[#f5d566] transition-transform duration-200 group-hover:rotate-6" />
              <span>Network: Base Sepolia (testnet)</span>
            </div>
            <div className="group inline-flex items-center gap-2 rounded-xl border border-white/10 bg-[rgba(15,15,15,0.9)] px-3 py-2 backdrop-blur-md transition-all duration-200 hover:border-emerald-400/60 hover:shadow-[0_0_28px_rgba(16,185,129,0.25)]">
              <Gauge className="h-4 w-4 text-emerald-400 transition-transform duration-200 group-hover:scale-110" />
              <span>
                Mainnet reference: simple Base tx ≈{" "}
                <span className="font-mono">0.001–0.005 USD</span> gas; dare
                create + accept typically stays under a few cents in normal
                conditions.
              </span>
            </div>
          </div>
        </section>

        {/* Form card */}
        <div
          className="group rounded-2xl p-5 md:p-6 shadow-[0_18px_60px_rgba(0,0,0,0.85)] transition-all duration-300 hover:shadow-[0_24px_80px_rgba(0,0,0,0.95)] hover:-translate-y-0.5"
          style={{
            backdropFilter: "blur(14px)",
            background:
              "linear-gradient(135deg, rgba(212,175,55,0.12), rgba(10,10,10,0.96))",
            border: "1px solid rgba(212,175,55,0.35)",
          }}
        >
          <div className="mb-3 flex items-center justify-between text-[11px] text-white/50">
            <span>Step 1 · Configure dare</span>
            <span className="inline-flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Live on Base
            </span>
          </div>

          <Suspense fallback={null}>
            {/* yaha CreateDareForm ko callback pass karo */}
            <CreateDareForm onDareCreated={handleDareCreated} />
          </Suspense>
        </div>

        {/* Info card (unchanged placeholder) */}
        <div
          className="mt-6 rounded-2xl p-4 md:p-5 text-xs flex flex-col gap-3 transition-all duration-300 hover:border-white/20 hover:shadow-[0_20px_60px_rgba(0,0,0,0.9)]"
          style={{
            backdropFilter: "blur(10px)",
            backgroundColor: "rgba(10,10,10,0.9)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          {/* ...rest of your info card unchanged ... */}
        </div>
      </main>

      {/* Mobile/desktop success overlay – slider se independent */}
      {showSuccess && (
        <div className="fixed inset-0 z-[45] flex items-end lg:items-center justify-center p-5 pointer-events-none">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto"
            onClick={handleSuccessClose}
          />

          {/* Card */}
          <div
            className="relative w-full max-w-md rounded-3xl border border-[rgba(212,175,55,0.5)] bg-[rgba(5,5,5,0.97)] shadow-[0_24px_80px_rgba(0,0,0,0.95)] pointer-events-auto overflow-hidden"
            style={{
              marginBottom: "env(safe-area-inset-bottom, 20px)",
            }}
          >
            <div className="px-6 pt-5 pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-[rgba(212,175,55,0.18)]">
                  <span className="absolute inset-0 rounded-full bg-[rgba(212,175,55,0.55)] blur-md opacity-60" />
                  <Zap className="relative h-5 w-5 text-[#f5d566]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#f5d566]">
                    Dare Created
                  </span>
                  <span className="text-sm text-white/80">
                    You’re officially live on Base Sepolia.
                  </span>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 text-sm text-white/75">
              <p>
                Your dare is on‑chain. Share it or wait for someone to match
                your stake.
              </p>
            </div>

            <div className="px-6 pb-5 pt-1 flex flex-col gap-2">
              <button
                type="button"
                className="h-11 w-full rounded-full bg-gradient-to-r from-[#f5d566] to-[#d4af37] text-black text-sm font-semibold shadow-[0_0_28px_rgba(245,213,102,0.8)] active:scale-[0.98] transition"
                onClick={handleBackToFeed}
              >
                Back to feed
              </button>
              <button
                type="button"
                className="h-10 w-full rounded-full border border-white/15 bg-black/70 text-xs text-white/70 hover:bg-black/80 transition"
                onClick={handleSuccessClose}
              >
                Stay here
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
