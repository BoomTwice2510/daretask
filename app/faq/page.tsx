"use client";

import { Header } from "@/components/header";
import { useState } from "react";
import { MessageCircle, ChevronDown, Sparkles, HelpCircle } from "lucide-react";

const faqs = [
  {
    q: "What is Dare Protocol?",
    a: "A fully on-chain staking challenge system on Base Sepolia.",
  },
  {
    q: "What tokens are allowed?",
    a: "ETH and specific allowed tokens as defined in the contract.",
  },
  {
    q: "Is my stake refundable?",
    a: "Only before acceptance or if a dare expires without being accepted.",
  },
  {
    q: "What if no proof is submitted?",
    a: "If the accepter does not submit proof in time, the creator can win by timeout.",
  },
  {
    q: "Who resolves disputes?",
    a: "The judge address from the contract resolves disputed dares.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Hero */}
        <section className="mb-8 flex flex-col gap-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(212,175,55,0.45)] bg-[rgba(10,10,10,0.9)] px-3 py-1 text-xs text-[#f5d566] backdrop-blur-md shadow-[0_0_25px_rgba(212,175,55,0.25)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d4af37] opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#d4af37]" />
            </span>
            Need help? Start here.
          </div>

          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1 rounded-full border border-yellow-500/20 bg-yellow-500/5 px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-yellow-300">
                <HelpCircle className="h-3 w-3 text-yellow-300" />
                <span>FAQ · On‑chain</span>
              </div>

              <h1
                className="text-3xl md:text-4xl font-bold tracking-tight mb-1"
                style={{
                  background:
                    "linear-gradient(to right,#f5d566,#e6c547,#d4af37,#f97316)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Frequently Asked Questions
              </h1>
              <p className="text-sm md:text-base text-white/70 max-w-xl">
                Quick answers about staking, dares, and how the Dare Protocol
                behaves on Base Sepolia.
              </p>
            </div>

            <div className="hidden md:flex items-center justify-center rounded-2xl border border-[rgba(212,175,55,0.45)] bg-[rgba(10,10,10,0.95)] px-4 py-3 shadow-[0_18px_60px_rgba(0,0,0,0.9)]">
              <MessageCircle className="h-6 w-6 text-[#f5d566] animate-bounce mr-2" />
              <span className="text-xs font-medium text-[#f5d566] uppercase tracking-wide">
                Support • On‑chain
              </span>
            </div>
          </div>
        </section>

        {/* FAQ list */}
        <section className="space-y-3">
          {faqs.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={item.q}
                className="group rounded-2xl border border-[rgba(212,175,55,0.35)] bg-[rgba(5,5,5,0.96)] transition-all duration-250 hover:border-[rgba(245,213,102,0.9)] hover:bg-black hover:shadow-[0_18px_60px_rgba(0,0,0,0.9)]"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between gap-3 px-4 py-3 md:px-5 md:py-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-[rgba(245,213,102,0.12)]">
                      <span className="absolute inset-0 rounded-full bg-[rgba(245,213,102,0.18)] blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
                      <Sparkles className="relative h-4 w-4 text-[#f5d566]" />
                    </div>
                    <span className="text-sm md:text-base font-medium text-left text-white">
                      {item.q}
                    </span>
                  </div>
                  <ChevronDown
                    className={`h-4 w-4 text-white/60 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <div
                  className={`px-4 pb-3 md:px-5 md:pb-4 text-sm text-white/70 transition-all duration-200 ${
                    isOpen
                      ? "max-h-40 opacity-100"
                      : "max-h-0 opacity-0 overflow-hidden"
                  }`}
                >
                  {item.a}
                </div>
              </div>
            );
          })}
        </section>

        <p className="mt-8 text-xs text-white/45">
          Still confused? Check the How It Works page or inspect the on‑chain
          contract directly on Base Sepolia.
        </p>
      </main>
    </div>
  );
}
