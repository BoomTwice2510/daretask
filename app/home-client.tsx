// app/home-client.tsx
"use client";

import { useEffect } from "react";
import { sdk } from "@farcaster/miniapp-sdk";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/header";
import { DareFeed } from "@/components/dare-feed";
import { Button } from "@/components/ui/button";
import { Plus, Sparkles } from "lucide-react";

export default function HomePageClient() {
  useEffect(() => {
    let cancelled = false;

    const markReady = async () => {
      try {
        // Farcaster / Base Mini App context me splash hide karega,
        // normal browser me quietly no-op rahega.
        if (!sdk || cancelled) return;
        await sdk.actions.ready();
      } catch (err) {
        console.error("sdk.actions.ready() failed", err);
      }
    };

    markReady();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-foreground">
      <Header />

      <main className="mx-auto max-w-4xl px-4 pb-24">
        {/* Hero */}
        <section className="relative flex flex-col items-center text-center py-16 md:py-20 gap-8">
          {/* subtle gold glow background */}
          <div className="pointer-events-none absolute inset-x-0 -top-10 -z-10 flex justify-center">
            <div className="h-56 w-80 md:w-[26rem] bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.32),transparent_60%)] blur-3xl opacity-80" />
          </div>

          {/* Logo in gold ring */}
          <div className="relative rounded-full overflow-hidden w-28 h-28 md:w-32 md:h-32 bg-black border border-[rgba(212,175,55,0.5)] shadow-[0_0_60px_rgba(212,175,55,0.45)] flex items-center justify-center">
            <Image
              src="/images/logo-gold.png"
              alt="Dare Protocol"
              width={128}
              height={128}
              className="object-contain w-full h-full"
              priority
            />
          </div>

          <div className="max-w-xl">
            <div className="mb-4 flex items-center justify-center gap-2 text-[11px] text-[#e6c547]/80">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d4af37] opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#d4af37]" />
              </span>
              <span className="uppercase tracking-[0.18em] text-[10px] text-[#f5d566]/80">
                Base Sepolia • On‑chain dares
              </span>
            </div>

            <h1
              className="text-3xl md:text-5xl font-bold text-balance leading-tight"
              style={{
                background:
                  "linear-gradient(to right,#f5d566,#e6c547,#d4af37)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Dare. Stake. Prove it.
            </h1>

            <p className="text-sm md:text-base text-white/70 mt-4 text-pretty">
              Put real stakes behind real commitments. No screenshots. No
              promises. No excuses.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link href="/create">
              <Button
                className="h-11 px-7 md:h-12 md:px-10 text-base md:text-lg font-semibold shadow-lg transition-transform active:scale-95"
                style={{
                  background:
                    "linear-gradient(135deg, #d4af37, #e6c547)",
                  color: "#000",
                  boxShadow: "0 18px 40px rgba(212,175,55,0.45)",
                }}
              >
                <Plus className="mr-2 h-5 w-5" />
                Create a Dare
              </Button>
            </Link>
            <div className="flex items-center gap-2 text-xs text-white/60">
              <Sparkles className="h-4 w-4 text-[#f5d566]" />
              <span>
                Win dares to earn XP and unlock your on‑chain reputation.
              </span>
            </div>
          </div>
        </section>

        {/* Feed */}
        <DareFeed />
      </main>
    </div>
  );
}
