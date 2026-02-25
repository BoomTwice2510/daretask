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
  Target,
  Banknote,
  Landmark,
  MessageCircle,
  Rocket,
  Lock,
  BadgeCheck,
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

      <main className="mx-auto max-w-4xl px-4 pb-32 pt-4">
        {/* HERO */}
        <section className="relative flex flex-col items-center text-center pt-16 md:pt-20 gap-8">
          <div className="pointer-events-none absolute inset-x-0 -top-6 -z-10 flex justify-center">
            <div className="h-60 w-[26rem] bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.45),transparent_65%)] blur-3xl opacity-90" />
          </div>

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
                  "group relative h-11 px-7 md:h-12 md:px-10 text-base md:text-lg font-semibold shadow-[0_18px_40px_rgba(212,175,55,0.45)] transition-transform active:scale-95 overflow-hidden"
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

        {/* INFO CARDS (top strip) */}
        <section className="mt-10 grid gap-4 md:grid-cols-3">
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

        {/* HOW IT WORKS – MULTICOLOR STRIP */}
        <section className="mt-16">
          <h2 className="text-center text-2xl md:text-3xl font-semibold text-white mb-6">
            How It Works
          </h2>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="rounded-2xl px-4 py-5 text-left border border-white/5 bg-gradient-to-br from-[#111827] via-[#1f2937] to-[#4f46e5]/40 shadow-[0_0_40px_rgba(79,70,229,0.4)]">
              <p className="text-xs font-semibold text-[#fbbf24] mb-1">01</p>
              <h3 className="text-sm font-semibold mb-1 text-white">
                Create a Dare
              </h3>
              <p className="text-xs text-white/80">
                Define outcome, timeline and resolution rules.
              </p>
            </div>

            <div className="rounded-2xl px-4 py-5 text-left border border-white/5 bg-gradient-to-br from-[#111827] via-[#064e3b] to-[#22c55e]/40 shadow-[0_0_40px_rgba(34,197,94,0.4)]">
              <p className="text-xs font-semibold text-[#bef264] mb-1">02</p>
              <h3 className="text-sm font-semibold mb-1 text-white">
                Stake Capital
              </h3>
              <p className="text-xs text-white/80">
                Back your belief with real value.
              </p>
            </div>

            <div className="rounded-2xl px-4 py-5 text-left border border-white/5 bg-gradient-to-br from-[#111827] via-[#7f1d1d] to-[#f97316]/40 shadow-[0_0_40px_rgba(249,115,22,0.4)]">
              <p className="text-xs font-semibold text-[#fed7aa] mb-1">03</p>
              <h3 className="text-sm font-semibold mb-1 text-white">
                Counter‑Stake
              </h3>
              <p className="text-xs text-white/80">
                Others can challenge and oppose your claim.
              </p>
            </div>

            <div className="rounded-2xl px-4 py-5 text-left border border-white/5 bg-gradient-to-br from-[#111827] via-[#312e81] to-[#e11d48]/40 shadow-[0_0_40px_rgba(225,29,72,0.4)]">
              <p className="text-xs font-semibold text-[#f9a8d4] mb-1">04</p>
              <h3 className="text-sm font-semibold mb-1 text-white">
                Transparent Resolution
              </h3>
              <p className="text-xs text-white/80">
                Outcome finalized via predefined on‑chain mechanism.
              </p>
            </div>
          </div>

          <p className="mt-6 text-center text-xs md:text-sm font-semibold text-white/80">
            No inflation. No emissions. No fake APY.
          </p>
        </section>

        {/* USE CASES – MULTICOLOR CARDS */}
        <section className="mt-16">
          <h2 className="text-center text-2xl md:text-3xl font-semibold text-white mb-6">
            Use Cases
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl px-5 py-6 flex flex-col gap-2 border border-white/5 bg-gradient-to-br from-[#020617] via-[#0369a1] to-[#22d3ee]/40 shadow-[0_0_40px_rgba(56,189,248,0.45)]">
              <div className="flex items-center gap-2 text-[#e0f2fe] mb-1">
                <Target className="h-4 w-4" />
                <span className="text-sm font-semibold">
                  Market predictions
                </span>
              </div>
              <p className="text-xs text-white/85">
                Put skin in the game on price moves, events and trends.
              </p>
            </div>

            <div className="rounded-2xl px-5 py-6 flex flex-col gap-2 border border-white/5 bg-gradient-to-br from-[#020617] via-[#15803d] to-[#4ade80]/40 shadow-[0_0_40px_rgba(74,222,128,0.45)]">
              <div className="flex items-center gap-2 text-[#bbf7d0] mb-1">
                <Banknote className="h-4 w-4" />
                <span className="text-sm font-semibold">
                  Crypto price calls
                </span>
              </div>
              <p className="text-xs text-white/85">
                Lock ETH or tokens on bold price predictions and settle
                on‑chain.
              </p>
            </div>

            <div className="rounded-2xl px-5 py-6 flex flex-col gap-2 border border-white/5 bg-gradient-to-br from-[#020617] via-[#7c2d12] to-[#f97316]/40 shadow-[0_0_40px_rgba(248,113,22,0.45)]">
              <div className="flex items-center gap-2 text-[#fed7aa] mb-1">
                <Landmark className="h-4 w-4" />
                <span className="text-sm font-semibold">
                  Political outcomes
                </span>
              </div>
              <p className="text-xs text-white/85">
                Stake on elections, referendums or policy decisions with
                transparent resolution.
              </p>
            </div>

            <div className="rounded-2xl px-5 py-6 flex flex-col gap-2 border border-white/5 bg-gradient-to-br from-[#020617] via-[#4338ca] to-[#a855f7]/40 shadow-[0_0_40px_rgba(168,85,247,0.5)]">
              <div className="flex items-center gap-2 text-[#e9d5ff] mb-1">
                <Rocket className="h-4 w-4" />
                <span className="text-sm font-semibold">
                  Startup milestones
                </span>
              </div>
              <p className="text-xs text-white/85">
                Tie funding, launches or KPIs to verifiable dare outcomes.
              </p>
            </div>

            <div className="rounded-2xl px-5 py-6 flex flex-col gap-2 border border-white/5 bg-gradient-to-br from-[#020617] via-[#4a044e] to-[#ec4899]/40 shadow-[0_0_40px_rgba(236,72,153,0.5)]">
              <div className="flex items-center gap-2 text-[#f9a8d4] mb-1">
                <MessageCircle className="h-4 w-4" />
                <span className="text-sm font-semibold">Public debates</span>
              </div>
              <p className="text-xs text-white/85">
                Turn hot takes into accountable, high‑conviction on‑chain
                dares.
              </p>
            </div>

            <div className="rounded-2xl px-5 py-6 flex flex-col gap-2 border border-white/5 bg-gradient-to-br from-[#020617] via-[#065f46] to-[#22c55e]/40 shadow-[0_0_40px_rgba(34,197,94,0.5)]">
              <div className="flex items-center gap-2 text-[#bbf7d0] mb-1">
                <Users className="h-4 w-4" />
                <span className="text-sm font-semibold">
                  Social challenges
                </span>
              </div>
              <p className="text-xs text-white/85">
                Friendly bets, habit challenges and social dares settled
                on‑chain.
              </p>
            </div>
          </div>
        </section>

        {/* SECURITY & FAIRNESS – NEON STRIPS */}
        <section className="mt-16">
          <h2 className="text-center text-2xl md:text-3xl font-semibold text-white mb-6">
            Security &amp; Fairness
          </h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3 rounded-2xl px-5 py-4 border border-[#22c55e]/30 bg-gradient-to-r from-[#022c22] via-[#064e3b] to-transparent shadow-[0_0_32px_rgba(34,197,94,0.4)]">
              <BadgeCheck className="h-4 w-4 text-[#4ade80]" />
              <div>
                <p className="text-sm font-semibold text-white">
                  Smart contract enforced
                </p>
                <p className="text-xs text-white/80">
                  Every dare, stake and payout is executed by audited contracts.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl px-5 py-4 border border-[#38bdf8]/30 bg-gradient-to-r from-[#02131f] via-[#0c4a6e] to-transparent shadow-[0_0_32px_rgba(56,189,248,0.4)]">
              <Globe2 className="h-4 w-4 text-[#38bdf8]" />
              <div>
                <p className="text-sm font-semibold text-white">
                  Transparent pools
                </p>
                <p className="text-xs text-white/80">
                  All stakes, odds and outcomes visible on‑chain.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl px-5 py-4 border border-[#f97316]/40 bg-gradient-to-r from-[#1b0a02] via-[#7c2d12] to-transparent shadow-[0_0_32px_rgba(249,115,22,0.5)]">
              <Zap className="h-4 w-4 text-[#fb923c]" />
              <div>
                <p className="text-sm font-semibold text-white">
                  Predefined resolution logic
                </p>
                <p className="text-xs text-white/80">
                  Clear rules baked into each dare before any capital is
                  locked.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl px-5 py-4 border border-[#a855f7]/40 bg-gradient-to-r from-[#13011f] via-[#4c1d95] to-transparent shadow-[0_0_32px_rgba(168,85,247,0.5)]">
              <Lock className="h-4 w-4 text-[#a855f7]" />
              <div>
                <p className="text-sm font-semibold text-white">No custody</p>
                <p className="text-xs text-white/80">
                  Funds live in the protocol, not on centralized servers.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl px-5 py-4 border border-[#facc15]/40 bg-gradient-to-r from-[#171002] via-[#854d0e] to-transparent shadow-[0_0_32px_rgba(250,204,21,0.45)]">
              <ShieldCheck className="h-4 w-4 text-[#facc15]" />
              <div>
                <p className="text-sm font-semibold text-white">
                  Immutable stakes
                </p>
                <p className="text-xs text-white/80">
                  Once locked, positions cannot be edited or rugged by admins.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CONVICTION ENGINE FLOW */}
        <section className="mt-16">
          <h2 className="text-center text-xl md:text-2xl font-semibold text-white mb-4">
            It&apos;s a conviction engine built on‑chain.
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-black">
            {[
              "Create Dare",
              "Stake",
              "Oppose",
              "Lock Period",
              "Resolution",
              "Distribution",
            ].map((step) => (
              <div
                key={step}
                className="flex items-center gap-2 rounded-xl bg-[#f5d566] px-4 py-2"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-black/70" />
                <span className="font-semibold">{step}</span>
              </div>
            ))}
          </div>
        </section>

        {/* BELIEF HEADLINE */}
        <section className="mt-20 text-center">
          <p className="text-[22px] md:text-[28px] font-bold tracking-tight text-[#f5d566]">
            Belief Without Risk Is Noise.
          </p>
          <p className="mt-2 text-sm md:text-base text-white/70">
            Dare Protocol turns opinions into on‑chain commitments with real
            stakes, transparent rules and trustless payouts.
          </p>
        </section>
      </main>
    </>
  );
}
