
// app/AppGuard.tsx
"use client";

import { usePathname } from "next/navigation";
import { useWeb3 } from "@/lib/web3-provider";
import { Button } from "@/components/ui/button";
import { Wallet, Sparkles, Loader2, ShieldAlert } from "lucide-react";

const PUBLIC_PATHS = ["/"]; // landing/home allowed without wallet

export function AppGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isConnected, connect, isConnecting } = useWeb3();

  const isPublic = PUBLIC_PATHS.includes(pathname);

  if (isPublic) {
    // landing/home hamesha allowed
    return <>{children}</>;
  }

  if (!isConnected) {
    // wallet nahi connected for protected route
    return (
      <main className="relative min-h-screen w-full overflow-hidden bg-white text-slate-900 flex flex-col items-center justify-center px-4 pb-[calc(2rem+env(safe-area-inset-bottom))]">
        {/* Background Ambient Moving Light Spheres */}
        <div className="pointer-events-none fixed -top-24 -left-20 hidden h-96 w-96 rounded-full bg-gradient-to-br from-blue-200/20 via-indigo-100/15 to-transparent blur-3xl animate-drift md:block" />
        <div
          className="pointer-events-none fixed top-1/3 -right-24 hidden h-[420px] w-[420px] rounded-full bg-gradient-to-bl from-rose-100/15 via-amber-100/15 to-blue-100/15 blur-3xl animate-drift md:block"
          style={{ animationDelay: "-6s" }}
        />

        {/* 3D Frosted Glass Auth Card */}
        <div className="glass-panel relative w-full max-w-sm rounded-[32px] p-6 sm:p-8 text-center shadow-[0_20px_60px_rgba(15,23,42,0.08)] space-y-4">
          {/* Bigger 3D Glass Wallet Node */}
          <div className="relative mx-auto flex h-16 w-16 items-center justify-center">
            <div className="absolute inset-0 rounded-2xl bg-blue-400/20 blur-xl animate-pulse" />
            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 via-white to-blue-100/80 border border-blue-200/90 text-[#0052FF] shadow-[0_4px_16px_rgba(0,82,255,0.18)]">
              <div className="absolute inset-1 rounded-xl bg-blue-400/10 blur-xs" />
              <Wallet className="relative z-10 h-7 w-7 stroke-[2.2]" />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50/90 border border-blue-200/70 px-2.5 py-0.5 text-[9.5px] font-black uppercase tracking-[0.16em] text-[#0052FF] shadow-xs">
              <Sparkles className="h-3 w-3" />
              Web3 Authentication
            </div>

            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 leading-tight">
              Connect Wallet First
            </h1>

            <p className="text-xs sm:text-sm leading-relaxed text-slate-500 font-medium">
              To browse live challenges, match escrow stakes, or view on-chain player reputation, please connect your wallet on Base.
            </p>
          </div>

          <Button
            onClick={connect}
            disabled={isConnecting}
            className="animate-pulse-glow w-full h-12 rounded-2xl bg-gradient-to-b from-[#0052FF] to-[#0045d8] hover:to-[#003bb8] text-white text-sm font-black shadow-[0_6px_20px_rgba(0,82,255,0.28)] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-60"
          >
            {isConnecting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connecting Wallet...
              </>
            ) : (
              <>
                <Wallet className="mr-2 h-4 w-4 stroke-[2.2]" />
                Connect Wallet
              </>
            )}
          </Button>

          <div className="flex items-center justify-center gap-1 text-[11px] font-semibold text-slate-400 pt-1">
            <ShieldAlert className="h-3.5 w-3.5 text-slate-400" />
            <span>Base Sepolia Testnet Supported</span>
          </div>
        </div>
      </main>
    );
  }

  // connected + protected route: normal content
  return <>{children}</>;
}