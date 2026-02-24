// app/AppGuard.tsx
"use client";

import { usePathname } from "next/navigation";
import { useWeb3 } from "@/lib/web3-provider";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";

const PUBLIC_PATHS = ["/"]; // landing/home allowed without wallet

export function AppGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isConnected, connect, isConnecting } = useWeb3();

  const isPublic = PUBLIC_PATHS.some((p) =>
    pathname === p || pathname.startsWith(p),
  );

  if (isPublic) {
    // landing/home hamesha allowed
    return <>{children}</>;
  }

  if (!isConnected) {
    // wallet nahi connected for protected route
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-4">
        <div className="max-w-sm rounded-2xl border border-[rgba(212,175,55,0.4)] bg-[rgba(6,6,6,0.98)] p-6 text-center shadow-[0_0_40px_rgba(0,0,0,0.9)] space-y-4">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(212,175,55,0.18)]">
            <Wallet className="h-5 w-5 text-[#f5d566]" />
          </div>
          <h1 className="text-lg font-semibold">Connect wallet first</h1>
          <p className="text-xs text-white/65">
            To browse dares, create challenges or view profiles, please connect
            your wallet on Base Sepolia from the top bar.
          </p>
          <Button
            onClick={connect}
            disabled={isConnecting}
            className="w-full h-9 text-sm font-semibold"
            style={{
              background:
                "linear-gradient(135deg, #d4af37, #facc15, #e6c547)",
              color: "#000",
            }}
          >
            {isConnecting ? "Connecting..." : "Connect wallet"}
          </Button>
        </div>
      </main>
    );
  }

  // connected + protected route: normal content
  return <>{children}</>;
}
