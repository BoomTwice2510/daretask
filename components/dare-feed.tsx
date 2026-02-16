"use client";

import { useState, useEffect, useCallback } from "react";
import { useWeb3 } from "@/lib/web3-provider";
import { DareCard } from "@/components/dare-card";
import { Button } from "@/components/ui/button";
import type { DareData } from "@/lib/types";
import { STATUS_LABELS } from "@/lib/contract";
import { Loader2, RefreshCw, Filter, AlertCircle } from "lucide-react";

type FilterStatus = "all" | "0" | "1" | "2" | "3" | "4" | "5";

export function DareFeed() {
  const { readContract } = useWeb3();
  const [dares, setDares] = useState<DareData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [error, setError] = useState<string | null>(null);

  const fetchDares = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("[v0] Fetching dare count from contract...");

      const count = (await readContract("dareCount")) as bigint;
      console.log("[v0] Dare count:", count.toString());
      const total = Number(count);
      if (total === 0) {
        setDares([]);
        setLoading(false);
        return;
      }

      // Fetch latest dares (max 50)
      const start = Math.max(0, total - 50);
      const promises: Promise<DareData>[] = [];

      for (let i = total - 1; i >= start; i--) {
        promises.push(
          (async () => {
            const result = (await readContract("getDare", [BigInt(i)])) as [
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
            return {
              id: i,
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
            };
          })()
        );
      }

      const results = await Promise.all(promises);
      setDares(results);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch dares";
      console.error("[v0] Failed to fetch dares:", err);
      setError(errorMessage);
      setDares([]);
    } finally {
      setLoading(false);
    }
  }, [readContract]);

  useEffect(() => {
    fetchDares();
  }, [fetchDares]);

  const filteredDares =
    filter === "all"
      ? dares
      : dares.filter((d) => d.status === parseInt(filter));

  const filterOptions: { value: FilterStatus; label: string }[] = [
    { value: "all", label: "All" },
    { value: "0", label: "Open" },
    { value: "1", label: "Running" },
    { value: "2", label: "Proof" },
    { value: "3", label: "Disputed" },
    { value: "4", label: "Resolved" },
  ];

  return (
    <div className="flex flex-col gap-6 text-white">
      {/* Filter + Refresh */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="w-full md:w-auto flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
          {filterOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFilter(opt.value)}
              className={`shrink-0 rounded-lg px-3 md:px-4 py-2 text-xs md:text-sm font-medium transition-all duration-200 ${
                filter === opt.value
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30 scale-100"
                  : "bg-neutral-900 text-gray-400 hover:text-white hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700"
              }`}
            >
              <span className="block">{opt.label}</span>
              {filter !== opt.value && (
                <span className="text-xs text-gray-500">
                  {opt.value === "all"
                    ? dares.length
                    : dares.filter((d) => d.status === parseInt(opt.value)).length}
                </span>
              )}
            </button>
          ))}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={fetchDares}
          disabled={loading}
          className="h-10 w-10 shrink-0 text-gray-400 hover:text-white hover:bg-neutral-900"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
        </Button>
      </div>

      {/* Error State */}
      {error && (
        <div className="flex items-start gap-3 rounded-lg bg-red-500/10 border border-red-500/40 p-4">
          <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="font-medium text-red-400">Connection Error</p>
            <p className="text-sm text-red-300 mt-1">
              {error.includes("timeout")
                ? "RPC endpoint is not responding. Try again in a moment."
                : "Could not connect to the Dare Protocol contract. Verify the contract exists on Base network."}
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={fetchDares}
              className="mt-3 text-red-400 hover:text-red-400 hover:bg-red-500/10 h-8 px-3"
            >
              <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
              Try Again
            </Button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredDares.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Filter className="h-12 w-12 text-gray-500 mb-3" />
          <p className="text-white font-medium">No dares found</p>
          <p className="text-sm text-gray-400 mt-1">
            {filter !== "all" ? "Try a different filter" : "Be the first to create a dare"}
          </p>
        </div>
      )}

      {/* Dare List */}
      {!loading && (
        <div className="flex flex-col gap-3">
          {filteredDares.map((dare) => (
            <DareCard key={dare.id} dare={dare} />
          ))}
        </div>
      )}
    </div>
  );
}
