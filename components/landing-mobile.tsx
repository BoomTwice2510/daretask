// components/landing-mobile.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Sparkles,
  ShieldCheck,
  Trophy,
  Globe2,
  Zap,
} from "lucide-react";

export function LandingMobile() {
  return (
    <main className="px-4 pb-24 pt-4">
      // HERO – optimized, tighter card
<section className="mt-2">
  <div className="relative mx-auto max-w-sm overflow-hidden rounded-2xl border border-[rgba(212,175,55,0.45)] bg-[#050505]/95 px-4 py-3 shadow-[0_18px_40px_rgba(0,0,0,0.95)]">
    {/* soft halo instead of big blob */}
    <div className="pointer-events-none absolute -top-24 right-[-80px] h-40 w-40 rounded-full bg-[radial-gradient(circle_at_center,rgba(245,213,102,0.5),transparent_60%)] blur-2xl opacity-80" />

    {/* top row: logo + chain + menu gap adjust ho jayega layout se */}
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="relative h-11 w-11 rounded-xl border border-[rgba(212,175,55,0.7)] bg-black/80 flex items-center justify-center overflow-hidden">
          <Image
            src="/images/logo-gold.png"
            alt="Dare Protocol"
            width={44}
            height={44}
            className="object-contain"
            priority
          />
        </div>
        <div className="flex flex-col">
          <span className="text-[11px] uppercase tracking-[0.18em] text-[#f5d566]/80">
            Dare Protocol
          </span>
          <span className="text-[10px] text-white/60">
            Base Sepolia • On‑chain dares
          </span>
        </div>
      </div>
    </div>

    <h1 className="mt-3 text-[19px] font-semibold leading-snug text-white">
      Dare. Stake. Prove it.
    </h1>
    <p className="mt-1.5 text-[12px] text-white/70">
      Put real stakes behind real commitments. No screenshots. No promises.
      Every dare, decision and payout is locked onchain.
    </p>

    <div className="mt-3 flex flex-col gap-1.5">
      <Link href="/create">
        <Button
          className="w-full h-10 text-[14px] font-semibold shadow-[0_10px_26px_rgba(212,175,55,0.6)]"
          style={{
            background: "linear-gradient(135deg,#d4af37,#facc15,#e6c547)",
            color: "#000",
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Create a Dare
        </Button>
      </Link>
      <Link href="/explore" className="w-full">
        <Button
          variant="outline"
          className="w-full h-9 border-white/15 bg-black/70 text-[12px] text-white/80"
        >
          <Zap className="mr-2 h-3.5 w-3.5 text-[#f5d566]" />
          Explore live dares
        </Button>
      </Link>
    </div>

    <div className="mt-3 flex items-center gap-2 text-[10px] text-white/65">
      <Sparkles className="h-3.5 w-3.5 text-[#f5d566]" />
      <span>Win dares to earn XP and climb the leaderboard.</span>
    </div>
  </div>
</section>

      {/* Quick bullets – mini info */}
      <section className="mt-4 space-y-3">
        <div className="rounded-2xl border border-white/10 bg-black/80 p-3">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="h-3.5 w-3.5 text-[#f5d566]" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#f5d566]">
              How it works
            </span>
          </div>
          <ul className="space-y-1 text-[11px] text-white/70">
            <li>• Create a dare with stake and deadline.</li>
            <li>• Someone accepts and locks the same stake.</li>
            <li>• They submit proof on time or you win by default.</li>
            <li>• Judge can resolve disputes if needed.</li>
          </ul>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/80 p-3">
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-300">
              Protocol
            </span>
          </div>
          <ul className="space-y-1 text-[11px] text-white/70">
            <li>• Base Sepolia testnet.</li>
            <li>• ETH + selected tokens as stake.</li>
            <li>• XP & badges to prevent spam.</li>
            <li>• All dares fully on‑chain.</li>
          </ul>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/80 p-3">
          <div className="flex items-center gap-2 mb-1">
            <Globe2 className="h-3.5 w-3.5 text-sky-300" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-300">
              Next steps
            </span>
          </div>
          <ul className="space-y-1 text-[11px] text-white/70">
            <li>• Connect wallet from the header.</li>
            <li>• Browse dares via the Explore tab.</li>
            <li>• Share links into chats or Farcaster.</li>
            <li>• Track your XP and wins on Profile.</li>
          </ul>
        </div>
      </section>
    </main>
  );
}
