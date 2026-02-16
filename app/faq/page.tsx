"use client";

import { Header } from "@/components/header";
import { useState } from "react";
import { MessageCircle, ChevronDown, Sparkles } from "lucide-react";

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
          <div className="inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-950 px-3 py-1 text-xs text-gray-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            Need help? Start here.
          </div>

          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-1">
                Frequently Asked Questions
              </h1>
              <p className="text-sm md:text-base text-gray-400 max-w-xl">
                Quick answers about staking, dares, and how the Dare Protocol behaves
                on Base Sepolia.
              </p>
            </div>

            <div className="hidden md:flex items-center justify-center rounded-2xl border border-primary/40 bg-primary/10 px-4 py-3 shadow-[0_0_40px_rgba(59,130,246,0.35)]">
              <MessageCircle className="h-6 w-6 text-primary animate-bounce mr-2" />
              <span className="text-xs font-medium text-primary uppercase tracking-wide">
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
                className="rounded-2xl border border-neutral-800 bg-neutral-950/80 hover:border-primary/50 hover:bg-neutral-900/80 transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between gap-3 px-4 py-3 md:px-5 md:py-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      <Sparkles className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm md:text-base font-medium text-left">
                      {item.q}
                    </span>
                  </div>
                  <ChevronDown
                    className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <div
                  className={`px-4 pb-3 md:px-5 md:pb-4 text-sm text-gray-300 transition-all duration-200 ${
                    isOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
                  }`}
                >
                  {item.a}
                </div>
              </div>
            );
          })}
        </section>

        <p className="mt-8 text-xs text-gray-500">
          Still confused? Check the How It Works page or inspect the on‑chain contract
          directly on Base Sepolia.
        </p>
      </main>
    </div>
  );
}
