"use client";

import { Header } from "@/components/header";
import { ShieldAlert, Scale, AlertTriangle, ScrollText } from "lucide-react";

export default function Legal() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Hero */}
        <section className="mb-8 flex flex-col gap-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-red-500/40 bg-red-500/10 px-3 py-1 text-xs text-red-300">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
            </span>
            High‑risk experimental protocol • Read before using
          </div>

          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-1">
                Legal Disclaimer
              </h1>
              <p className="text-sm md:text-base text-gray-400 max-w-xl">
                Using Dare Protocol means you accept the risks of experimental
                on‑chain contracts and volatile crypto assets.
              </p>
            </div>

            <div className="hidden md:flex items-center justify-center rounded-2xl border border-red-500/50 bg-red-500/10 px-4 py-3 shadow-[0_0_40px_rgba(248,113,113,0.45)]">
              <ShieldAlert className="h-6 w-6 text-red-400 animate-bounce mr-2" />
              <span className="text-xs font-medium text-red-300 uppercase tracking-wide">
                No guarantees • No refunds
              </span>
            </div>
          </div>
        </section>

        {/* Cards */}
        <section className="space-y-5">
          {/* Contract behaviour */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-950/80 p-5 hover:border-primary/50 hover:bg-neutral-900/80 transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                <ScrollText className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-lg font-semibold">On‑chain, immutable rules</h2>
            </div>
            <p className="text-sm text-gray-300">
              Dare Protocol is experimental smart‑contract software deployed on Base
              Sepolia. Once a dare is created, funds are locked and controlled
              entirely by contract logic. There is no manual intervention, support
              desk, or \"undo\" button.
            </p>
          </div>

          {/* No custody / no advice */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-950/80 p-5 hover:border-sky-500/50 hover:bg-neutral-900/80 transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-500/10">
                <Scale className="h-5 w-5 text-sky-400" />
              </div>
            <h2 className="text-lg font-semibold">No custody, no legal advice</h2>
            </div>
            <p className="text-sm text-gray-300">
              The protocol and frontends do not custody assets on your behalf. All
              balances move directly between user wallets and the contract. Nothing
              here is legal, tax, or investment advice; always consult qualified
              professionals for your jurisdiction.
            </p>
          </div>

          {/* Risk + volatility */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-950/80 p-5 hover:border-amber-500/50 hover:bg-neutral-900/80 transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-500/10">
                <AlertTriangle className="h-5 w-5 text-amber-400" />
              </div>
              <h2 className="text-lg font-semibold">Volatility and loss of funds</h2>
            </div>
            <p className="text-sm text-gray-300">
              Crypto assets are highly volatile and smart contracts can fail or be
              exploited. By using Dare Protocol you accept that you may lose part or
              all of the assets you interact with, and that neither deployers nor
              frontend operators are liable for that loss.
            </p>
          </div>

          {/* User responsibility */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-950/80 p-5 hover:border-emerald-500/50 hover:bg-neutral-900/80 transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/10">
                <Scale className="h-5 w-5 text-emerald-400" />
              </div>
              <h2 className="text-lg font-semibold">Your responsibility</h2>
            </div>
            <p className="text-sm text-gray-300">
              You are responsible for verifying contract addresses, reading the code
              or audits if available, and understanding how the protocol works before
              staking any funds. By proceeding, you acknowledge that you use the
              protocol entirely at your own risk.
            </p>
          </div>
        </section>

        <p className="mt-8 text-xs text-gray-500">
          By continuing to use Dare Protocol you confirm that you understand and
          accept these terms and the risks of interacting with experimental
          on‑chain systems.
        </p>
      </main>
    </div>
  );
}
