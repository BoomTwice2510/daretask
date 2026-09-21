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
    <div className="relative min-h-screen w-full overflow-x-clip bg-white text-slate-900">
      {/* Background Ambient Moving Light Spheres */}
      <div className="pointer-events-none fixed -top-24 -left-20 h-96 w-96 rounded-full bg-gradient-to-br from-blue-200/20 via-indigo-100/15 to-transparent blur-3xl animate-drift" />
      <div
        className="pointer-events-none fixed top-1/3 -right-24 h-[420px] w-[420px] rounded-full bg-gradient-to-bl from-rose-100/15 via-amber-100/15 to-blue-100/15 blur-3xl animate-drift"
        style={{ animationDelay: "-6s" }}
      />

      <Header />

      {/* Desktop landing view */}
      <div className="relative z-10 hidden md:block">
        <LandingDesktop />
      </div>

      {/* Mobile landing view – PWA & Farcaster Mini-App style */}
      <div className="relative z-10 block pb-[calc(4rem+env(safe-area-inset-bottom))] md:hidden">
        <LandingMobile />
      </div>
    </div>
  );
}