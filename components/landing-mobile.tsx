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
      {/* Top hero card like mini‑app */}
      <section className="mt-4">
        <div className="relative overflow-hidden rounded-3xl border border-[rgba(212,175,55,0.5)] bg-[rgba(5,5,5,0.98)] p-4 shadow-[0_18px_40px_rgba(0,0,0,0.9)]">
          <div className="absolute -top-16 right-[-40px] h-32 w-32 rounded-full bg-[radial-gradient(circle_at_center,rgba(245,213,102,0.45),transparent_55%)] blur-xl opacity-80" />
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-12 rounded-2xl border border-[rgba(212,175,55,0.7)] bg-black/80 flex items-center justify-center overflow-hidden">
              <Image
                src="/images/logo-gold.png"
                alt="Dare Protocol"
                width={48}
                height={48}
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xs uppercase tracking-[0.18em] text-[#f5d566]/80">
                Dare Protocol
              </span>
              <span className="text-[11px] text-white/60">
                Base Sepolia • On‑chain dares
              </span>
            </div>
          </div>

          <h1 className="mt-4 text-2xl font-semibold text-white leading-snug">
            Dare. Stake. Prove it.
          </h1>
          <p className="mt-2 text-[13px] text-white/70">
            Turn real‑life commitments into on‑chain dares. Stake ETH, invite
            friends, and settle everything on Base.
          </p>

          <div className="mt-4 flex flex-col gap-2">
            <Link href="/create">
              <Button
                className="w-full h-11 text-[15px] font-semibold shadow-[0_12px_30px_rgba(212,175,55,0.45)]"
                style={{
                  background:
                    "linear-gradient(135deg,#d4af37,#facc15,#e6c547)",
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
                className="w-full h-10 border-white/15 bg-black/60 text-[13px] text-white/80"
              >
                <Zap className="mr-2 h-4 w-4 text-[#f5d566]" />
                Explore live dares
              </Button>
            </Link>
          </div>

          <div className="mt-4 flex items-center gap-2 text-[11px] text-white/60">
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
