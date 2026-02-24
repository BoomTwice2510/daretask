// app/home-client.tsx
"use client";

import { useEffect } from "react";
import { sdk } from "@farcaster/miniapp-sdk";
import { Header } from "@/components/header";
import { LandingDesktop } from "@/components/landing-desktop";
import { LandingMobile } from "@/components/landing-mobile";

export default function HomePageClient() {
  useEffect(() => {
    let cancelled = false;

    const markReady = async () => {
      try {
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

      {/* Desktop landing */}
      <div className="hidden md:block">
        <LandingDesktop />
      </div>

      {/* Mobile landing – mini‑app style */}
      <div className="block md:hidden">
        <LandingMobile />
      </div>
    </div>
  );
}
