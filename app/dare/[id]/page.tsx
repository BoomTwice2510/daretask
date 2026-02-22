"use client";

import { use, useState, useEffect, useCallback } from "react";
import { useWeb3 } from "@/lib/web3-provider";
import { Header } from "@/components/header";
import { DareDetail } from "@/components/dare-detail";
import type { DareData } from "@/lib/types";
import {
  ArrowLeft,
  Loader2,
  AlertCircle,
  Sparkles,
  Clock,
  Trophy,
} from "lucide-react";
import Link from "next/link";

export default function DareDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { readContract } = useWeb3();
  const [dare, setDare] = useState<DareData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [winnerAddress, setWinnerAddress] = useState<string | null>(null);

  const dareId = parseInt(id, 10);

  const fetchDare = useCallback(async () => {
    if (isNaN(dareId)) {
      setError("Invalid dare ID");
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const result = (await readContract("getDare", [BigInt(dareId)])) as [
        string,
        string,
        string,
        string,
        bigint,
        bigint,
        bigint,
        boolean,
        string,
        bigint,
        bigint,
        number
      ];
      setDare({
        id: dareId,
        creator: result[0],
        accepter: result[1],
        description: result[2],
        token: result[3],
        stake: result[4],
        createdAt: result[5],
        deadline: result[6],
        proofSubmitted: result[7],
        proofURI: result[8],
        proofTime: result[9],
        disputeTime: result[10],
        status: result[11],
      });

      // Fetch winner if resolved
      if (result[11] === 4) {
        try {
          const winner = (await readContract("winnerOf", [
            BigInt(dareId),
          ])) as string;
          setWinnerAddress(winner);
        } catch {
          // ignore
        }
      }
    } catch (err) {
      setError("Failed to load dare data");
    } finally {
      setLoading(false);
    }
  }, [dareId, readContract]);

  useEffect(() => {
    fetchDare();
  }, [fetchDare]);

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      {/* yahan core fix: pb-32 md:pb-24 */}
      <main className="mx-auto max-w-3xl px-4 py-8 pb-32 md:pb-24">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/"
            className="group inline-flex items-center gap-1 text-sm text-white/60 transition-colors hover:text-[#f5d566]"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
            <span className="relative">
              Back to feed
              <span className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-gradient-to-r from-transparent via-[#f5d566] to-transparent transition-transform duration-200 group-hover:scale-x-100" />
            </span>
          </Link>

          <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(212,175,55,0.45)] bg-[rgba(10,10,10,0.9)] px-3 py-1 text-[11px] text-[#f5d566] backdrop-blur-md shadow-[0_0_25px_rgba(212,175,55,0.35)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d4af37] opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#d4af37]" />
            </span>
            On‑chain dare detail
          </div>
        </div>

        {/* Hero header */}
        {dare && !loading && !error && (
          <section className="mb-4 flex items-start justify-between gap-4">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1 rounded-full border border-yellow-500/20 bg-yellow-500/5 px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-yellow-300">
                <Sparkles className="h-3 w-3 text-yellow-300" />
                <span>Dare detail</span>
              </div>

              <h1
                className="text-2xl md:text-3xl font-bold tracking-tight"
                style={{
                  background:
                    "linear-gradient(to right,#f5d566,#e6c547,#d4af37,#f97316)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Dare #{dareId}
              </h1>

              <p className="mt-0.5 text-xs text-white/60 flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-[#f5d566]" />
                Created at{" "}
                {new Date(Number(dare.createdAt) * 1000).toLocaleString()}
              </p>
            </div>

            {winnerAddress &&
              winnerAddress !==
                "0x0000000000000000000000000000000000000000" && (
                <Link
                  href={`/profile/${winnerAddress}`}
                  className="group inline-flex flex-col items-end text-xs text-emerald-400"
                >
                  <span className="inline-flex items-center gap-1 font-medium">
                    <div className="relative">
                      <span className="absolute inset-0 rounded-full bg-emerald-500/30 blur-sm group-hover:blur-md transition-all" />
                      <Trophy className="relative h-3.5 w-3.5 text-emerald-300 group-hover:scale-110 transition-transform duration-200" />
                    </div>
                    <span>Winner</span>
                  </span>
                  <span className="font-mono text-white/80 group-hover:text-white transition-colors">
                    {winnerAddress.slice(0, 6)}...{winnerAddress.slice(-4)}
                  </span>
                  <span className="mt-0.5 text-[10px] text-white/40 group-hover:text-emerald-300/80 transition-colors">
                    View on‑chain profile
                  </span>
                </Link>
              )}
          </section>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-[#f5d566]" />
            <p className="text-xs text-white/60">
              Fetching on‑chain dare data…
            </p>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <AlertCircle className="h-10 w-10 text-red-400" />
            <p className="text-white font-medium">{error}</p>
            <p className="text-xs text-white/50">
              Check your connection or try again in a moment.
            </p>
          </div>
        )}

        {/* Dare content */}
        {dare && !loading && !error && (
          <div className="group rounded-2xl border border-[rgba(212,175,55,0.35)] bg-[rgba(5,5,5,0.96)] p-5 md:p-6 shadow-[0_18px_60px_rgba(0,0,0,0.9)] transition-all duration-300 hover:shadow-[0_24px_80px_rgba(0,0,0,1)] hover:-translate-y-0.5">
            <DareDetail dare={dare} onRefresh={fetchDare} />
          </div>
        )}
      </main>
    </div>
  );
}
