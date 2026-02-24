// components/landing-desktop.tsx
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
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

function InfoCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-[rgba(212,175,55,0.4)] bg-[rgba(6,6,6,0.98)] p-4 shadow-[0_0_40px_rgba(0,0,0,0.9)] transition-transform duration-200 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(0,0,0,0.9)]">
      {/* glow on hover */}
      <div className="pointer-events-none absolute -inset-1 opacity-0 group-hover:opacity-40 bg-[radial-gradient(circle_at_top,rgba(245,213,102,0.25),transparent_55%)] transition-opacity duration-300" />
      <div className="relative space-y-2">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[rgba(212,175,55,0.12)]">
            {icon}
          </div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#f5d566]">
            {title}
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}

export function LandingDesktop() {
  return (
    <>
      {/* background aura + grid */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.16),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(12,12,12,1),rgba(0,0,0,1))]" />
        <div className="absolute inset-0 opacity-[0.06] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <main className="mx-auto max-w-4xl px-4 pb-28 pt-4">
        {/* Hero */}
        <section className="relative flex flex-col items-center text-center pt-16 md:pt-20 gap-8">
          {/* glow */}
          <div className="pointer-events-none absolute inset-x-0 -top-6 -z-10 flex justify-center">
            <div className="h-60 w-[26rem] bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.45),transparent_65%)] blur-3xl opacity-90" />
          </div>

          {/* floating badge */}
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_220deg,rgba(212,175,55,0.2),transparent,rgba(212,175,55,0.3),transparent)] blur-xl opacity-80 animate-spin-slow" />
            <div className="relative rounded-full overflow-hidden w-28 h-28 md:w-32 md:h-32 bg-black border border-[rgba(212,175,55,0.6)] shadow-[0_0_80px_rgba(212,175,55,0.6)] flex items-center justify-center">
              <Image
                src="/images/logo-gold.png"
                alt="Dare Protocol"
                width={128}
                height={128}
                className="object-contain w-full h-full"
                priority
              />
            </div>
          </div>

          <div className="max-w-xl space-y-4">
            <div className="flex items-center justify-center gap-2 text-[11px] text-[#e6c547]/80">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d4af37] opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#d4af37]" />
              </span>
              <span className="uppercase tracking-[0.18em] text-[10px] text-[#f5d566]/80">
                Base Sepolia • On‑chain dares
              </span>
            </div>

            <h1
              className="text-3xl md:text-5xl font-bold text-balance leading-tight drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]"
              style={{
                background:
                  "linear-gradient(to right,#fef9c3,#facc15,#d4af37)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Dare. Stake. Prove it.
            </h1>

            <p className="text-sm md:text-base text-white/70 mt-2 text-pretty">
              Put real stakes behind real commitments. No screenshots. No
              promises. No excuses. Every dare, decision and payout is locked
              onchain.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 mt-2">
            <Link href="/create">
              <Button
                className={cn(
                  "group relative h-11 px-7 md:h-12 md:px-10 text-base md:text-lg font-semibold shadow-[0_18px_40px_rgba(212,175,55,0.45)] transition-transform active:scale-95 overflow-hidden",
                )}
                style={{
                  background:
                    "linear-gradient(135deg, #d4af37, #facc15, #e6c547)",
                  color: "#000",
                }}
              >
                <span className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-[radial-gradient(circle_at_top,white,transparent_55%)] transition-opacity" />
                <Plus className="mr-2 h-5 w-5" />
                Create a Dare
              </Button>
            </Link>
            <div className="flex items-center gap-2 text-xs text-white/60">
              <Sparkles className="h-4 w-4 text-[#f5d566] animate-pulse" />
              <span>
                Win dares to earn XP and unlock your on‑chain reputation.
              </span>
            </div>
          </div>

          {/* mini stats strip */}
          <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-2 rounded-full border border-[rgba(212,175,55,0.3)] bg-black/70 px-4 py-2 text-[11px] text-white/60">
            <span className="flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              Trustless payouts
            </span>
            <span className="h-1 w-1 rounded-full bg-white/20" />
            <span className="flex items-center gap-1">
              <Globe2 className="h-3.5 w-3.5 text-sky-300" />
              Global, permissionless dares
            </span>
            <span className="h-1 w-1 rounded-full bg-white/20" />
            <span className="flex items-center gap-1">
              <Trophy className="h-3.5 w-3.5 text-amber-300" />
              XP, badges and leaderboards
            </span>
          </div>
        </section>

        {/* Info cards section */}
        <section className="mt-10 grid gap-4 md:grid-cols-3">
          {/* How it works */}
          <InfoCard
            title="How it works"
            icon={<Zap className="h-4 w-4 text-[#f5d566]" />}
          >
            <ol className="space-y-1.5 text-[11px] text-white/70 list-decimal list-inside">
              <li>Create a dare with description, duration, token and stake.</li>
              <li>Someone accepts and locks the matching stake.</li>
              <li>The accepter submits proof before the deadline.</li>
              <li>
                Creator or judge confirms, disputes, or lets the dare expire.
              </li>
              <li>Winner takes both stakes minus protocol fee.</li>
            </ol>
          </InfoCard>

          {/* Protocol details */}
          <InfoCard
            title="Protocol details"
            icon={<ShieldCheck className="h-4 w-4 text-emerald-300" />}
          >
            <ul className="space-y-1.5 text-[11px] text-white/70">
              <li>• Deployed on Base Sepolia (L2 on Ethereum).</li>
              <li>• ETH and curated ERC‑20 tokens supported as stake.</li>
              <li>• XP, badges and limits reduce spam and griefing.</li>
              <li>• Judge can resolve disputes and punish bad actors.</li>
              <li>• All dares, stakes and outcomes are fully on‑chain.</li>
            </ul>
          </InfoCard>

          {/* Quick guide */}
          <InfoCard
            title="Quick guide"
            icon={<Users className="h-4 w-4 text-sky-300" />}
          >
            <ul className="space-y-1.5 text-[11px] text-white/70">
              <li>1. Connect your wallet on Base Sepolia.</li>
              <li>2. Use Explore (footer) to browse live dares.</li>
              <li>3. Create clear, fair dares your friends will accept.</li>
              <li>4. Share dare links in chats, Farcaster or socials.</li>
              <li>5. Track wins and XP on your profile & leaderboard.</li>
            </ul>
          </InfoCard>
        </section>
      </main>
    </>
  );
}
