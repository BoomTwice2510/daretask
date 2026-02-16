"use client";

import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/header";
import { DareFeed } from "@/components/dare-feed";
import { Button } from "@/components/ui/button";
import { Plus, Zap, Sparkles } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <main className="mx-auto max-w-4xl px-4 pb-24">
        {/* Hero */}
        <section className="relative flex flex-col items-center text-center py-12 md:py-16 gap-6 md:gap-8">
          {/* subtle glow background */}
          <div className="pointer-events-none absolute inset-x-0 -top-10 -z-10 flex justify-center">
            <div className="h-40 w-72 md:w-96 bg-primary/30 blur-3xl opacity-40" />
          </div>

          <div className="relative rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(59,130,246,0.5)] w-24 h-24 md:w-32 md:h-32 bg-neutral-900 border border-primary/40">
            <Image
              src="/images/logo.png"
              alt="Dare Protocol"
              width={128}
              height={128}
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
              priority
            />
          </div>

          <div className="max-w-lg">
            <div className="mb-3 flex items-center justify-center gap-2 text-[11px] text-gray-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              On‑chain dares on Base Sepolia
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white text-balance leading-tight">
              Stake. Dare. Win.
            </h1>
            <p className="text-sm md:text-base text-gray-400 mt-3 md:mt-4 text-pretty">
              Create or accept on-chain dares with real stakes on Base Sepolia. Earn XP,
              climb the leaderboard, and build your on‑chain legend.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <Link href="/create">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-6 md:h-12 md:px-8 text-base md:text-lg font-semibold shadow-lg shadow-primary/40">
                <Plus className="mr-2 h-5 w-5" />
                Create a Dare
              </Button>
            </Link>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Sparkles className="h-4 w-4 text-amber-300" />
              <span>Win dares to earn XP and badges</span>
            </div>
          </div>
        </section>

        {/* Stats bar */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 py-4 mb-8 px-3 md:px-4 rounded-lg md:rounded-xl bg-neutral-900/90 border border-neutral-800 backdrop-blur-sm">
          <div className="flex items-center gap-1.5 text-xs md:text-sm text-gray-400">
            <Zap className="h-4 w-4 text-primary flex-shrink-0 animate-pulse" />
            <span>Network</span>
            <span className="font-semibold text-sky-400">Base Sepolia</span>
          </div>
          <div className="h-3 w-px bg-neutral-800 hidden md:block" />
          <span className="text-xs md:text-sm text-gray-400 text-center flex items-center gap-1">
            <span className="text-white font-mono text-[11px] md:text-xs">
              0xee48...8586
            </span>
            <span className="hidden sm:inline text-[11px] text-gray-500">
              • Dare Protocol contract
            </span>
          </span>
        </div>

        {/* Feed */}
        <DareFeed />
      </main>

      {/* Mobile FAB */}
      <Link
        href="/create"
        className="fixed bottom-6 right-6 z-50 md:hidden flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/25 active:scale-95 transition-transform"
        aria-label="Create Dare"
      >
        <Plus className="h-6 w-6" />
      </Link>
    </div>
  );
}
