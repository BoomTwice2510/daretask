"use client";

import { use, useState, useEffect, useCallback } from "react";
import { useWeb3 } from "@/lib/web3-provider";
import { Header } from "@/components/header";
import { DareDetail } from "@/components/dare-detail";
import type { DareData } from "@/lib/types";
import { ArrowLeft, Loader2, AlertCircle, Sparkles, Clock } from "lucide-react";
import Link from "next/link";

export default function DareDetailPage({ params }: { params: Promise<{ id: string }> }) {
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
          const winner = (await readContract("winnerOf", [BigInt(dareId)])) as string;
          setWinnerAddress(winner);
        } catch {}
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

      <main className="mx-auto max-w-3xl px-4 py-8 pb-24">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to feed
          </Link>

          <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-[11px] text-primary">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            On‑chain dare detail
          </div>
        </div>

        {/* Hero header */}
        {dare && !loading && !error && (
          <section className="mb-4 flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">
                Dare #{dareId}
              </h1>
              <p className="mt-1 text-xs text-gray-400 flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-primary" />
                Created at{" "}
                {new Date(Number(dare.createdAt) * 1000).toLocaleString()}
              </p>
            </div>

            {winnerAddress &&
              winnerAddress !== "0x0000000000000000000000000000000000000000" && (
                <Link
                  href={`/profile/${winnerAddress}`}
                  className="inline-flex flex-col items-end text-xs text-emerald-400 hover:underline"
                >
                  <span className="inline-flex items-center gap-1 font-medium">
                    <Sparkles className="h-3 w-3" />
                    Winner
                  </span>
                  <span className="font-mono">
                    {winnerAddress.slice(0, 6)}...{winnerAddress.slice(-4)}
                  </span>
                </Link>
              )}
          </section>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <AlertCircle className="h-10 w-10 text-red-400" />
            <p className="text-white font-medium">{error}</p>
          </div>
        )}

        {/* Dare content */}
        {dare && !loading && !error && (
          <div className="rounded-2xl border border-neutral-800 bg-neutral-950/90 p-5 md:p-6 shadow-[0_0_40px_rgba(15,23,42,0.7)]">
            <DareDetail dare={dare} onRefresh={fetchDare} />
          </div>
        )}
      </main>
    </div>
  );
}
