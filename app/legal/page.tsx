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
          <div className="inline-flex items-center gap-2 rounded-full border border-red-500/60 bg-red-500/10 px-3 py-1 text-xs text-red-300 backdrop-blur-md shadow-[0_0_30px_rgba(248,113,113,0.35)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
            </span>
            High‑risk experimental protocol • Read before using
          </div>

          <div className="flex items-start justify-between gap-4">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1 rounded-full border border-red-400/40 bg-red-500/10 px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-red-200">
                <ShieldAlert className="h-3 w-3 text-red-300" />
                <span>Risk disclosure</span>
              </div>

              <h1
                className="text-3xl md:text-4xl font-bold tracking-tight mb-1"
                style={{
                  background:
                    "linear-gradient(to right,#fca5a5,#fecaca,#fee2e2)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Legal Disclaimer
              </h1>
              <p className="text-sm md:text-base text-white/70 max-w-xl">
                Using Dare Protocol means you accept the risks of experimental
                on‑chain contracts and volatile crypto assets.
              </p>
            </div>

            <div className="hidden md:flex items-center justify-center rounded-2xl border border-red-500/60 bg-[rgba(15,15,15,0.95)] px-4 py-3 shadow-[0_18px_60px_rgba(0,0,0,0.9)]">
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
          <div className="group rounded-2xl border border-[rgba(212,175,55,0.35)] bg-[rgba(5,5,5,0.96)] p-5 transition-all duration-250 hover:border-[rgba(245,213,102,0.9)] hover:bg-black hover:shadow-[0_18px_60px_rgba(0,0,0,0.9)] hover:-translate-y-0.5">
            <div className="flex items-center gap-3 mb-3">
              <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-[rgba(248,250,252,0.03)]">
                <span className="absolute inset-0 rounded-full bg-[rgba(245,213,102,0.18)] blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
                <ScrollText className="relative h-5 w-5 text-[#f5d566]" />
              </div>
              <h2 className="text-lg font-semibold text-white">
                On‑chain, immutable rules
              </h2>
            </div>
            <p className="text-sm text-white/75">
              Dare Protocol is experimental smart‑contract software deployed on
              Base Sepolia. Once a dare is created, funds are locked and
              controlled entirely by contract logic. There is no manual
              intervention, support desk, or "undo" button.
            </p>
          </div>

          {/* No custody / no advice */}
          <div className="group rounded-2xl border border-[rgba(212,175,55,0.35)] bg-[rgba(5,5,5,0.96)] p-5 transition-all duration-250 hover:border-[rgba(245,213,102,0.9)] hover:bg-black hover:shadow-[0_18px_60px_rgba(0,0,0,0.9)] hover:-translate-y-0.5">
            <div className="flex items-center gap-3 mb-3">
              <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-[rgba(248,250,252,0.03)]">
                <span className="absolute inset-0 rounded-full bg-[rgba(245,213,102,0.18)] blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
                <Scale className="relative h-5 w-5 text-[#f5d566]" />
              </div>
              <h2 className="text-lg font-semibold text-white">
                No custody, no legal advice
              </h2>
            </div>
            <p className="text-sm text-white/75">
              The protocol and frontends do not custody assets on your behalf.
              All balances move directly between user wallets and the contract.
              Nothing here is legal, tax, or investment advice; always consult
              qualified professionals for your jurisdiction.
            </p>
          </div>

          {/* Risk + volatility */}
          <div className="group rounded-2xl border border-[rgba(212,175,55,0.35)] bg-[rgba(5,5,5,0.96)] p-5 transition-all duration-250 hover:border-[rgba(245,213,102,0.9)] hover:bg-black hover:shadow-[0_18px_60px_rgba(0,0,0,0.9)] hover:-translate-y-0.5">
            <div className="flex items-center gap-3 mb-3">
              <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-[rgba(248,250,252,0.03)]">
                <span className="absolute inset-0 rounded-full bg-[rgba(245,213,102,0.18)] blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
                <AlertTriangle className="relative h-5 w-5 text-[#f5d566]" />
              </div>
              <h2 className="text-lg font-semibold text-white">
                Volatility and loss of funds
              </h2>
            </div>
            <p className="text-sm text-white/75">
              Crypto assets are highly volatile and smart contracts can fail or
              be exploited. By using Dare Protocol you accept that you may lose
              part or all of the assets you interact with, and that neither
              deployers nor frontend operators are liable for that loss.
            </p>
          </div>

          {/* User responsibility */}
          <div className="group rounded-2xl border border-[rgba(212,175,55,0.35)] bg-[rgba(5,5,5,0.96)] p-5 transition-all duration-250 hover:border-[rgba(245,213,102,0.9)] hover:bg-black hover:shadow-[0_18px_60px_rgba(0,0,0,0.9)] hover:-translate-y-0.5">
            <div className="flex items-center gap-3 mb-3">
              <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-[rgba(248,250,252,0.03)]">
                <span className="absolute inset-0 rounded-full bg-[rgba(245,213,102,0.18)] blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
                <Scale className="relative h-5 w-5 text-[#f5d566]" />
              </div>
              <h2 className="text-lg font-semibold text-white">
                Your responsibility
              </h2>
            </div>
            <p className="text-sm text-white/75">
              You are responsible for verifying contract addresses, reading the
              code or audits if available, and understanding how the protocol
              works before staking any funds. By proceeding, you acknowledge
              that you use the protocol entirely at your own risk.
            </p>
          </div>
        </section>

        <p className="mt-8 text-xs text-white/45">
          By continuing to use Dare Protocol you confirm that you understand and
          accept these terms and the risks of interacting with experimental
          on‑chain systems.
        </p>
      </main>
    </div>
  );
}
