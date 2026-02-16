"use client";

import { use, useState, useEffect, useCallback } from "react";
import { useWeb3 } from "@/lib/web3-provider";
import { Header } from "@/components/header";
import { UserStatsCard } from "@/components/user-stats";
import { DareCard } from "@/components/dare-card";
import type { DareData, UserStats } from "@/lib/types";
import { shortenAddress } from "@/lib/helpers";
import {
  ArrowLeft,
  Loader2,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  Trophy,
} from "lucide-react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ProfilePage({ params }: { params: Promise<{ address: string }> }) {
  const { address: paramAddress } = use(params);
  const { readContract, address: connectedAddress } = useWeb3();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [badge, setBadge] = useState<number>(0);
  const [userDares, setUserDares] = useState<DareData[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const profileAddress = paramAddress;
  const isOwnProfile = connectedAddress?.toLowerCase() === profileAddress.toLowerCase();

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch stats and badge in parallel
      const [statsResult, badgeResult, dareCount] = await Promise.all([
        readContract("getUserStats", [profileAddress]),
        readContract("getUserBadge", [profileAddress]),
        readContract("dareCount"),
      ]);

      const s = statsResult as [bigint, bigint, bigint, bigint, bigint, bigint, bigint];
      setStats({
        activeCountCreator: s[0],
        activeCountAccepter: s[1],
        xpPoints: s[2],
        totalWins: s[3],
        totalLosses: s[4],
        totalVolume: s[5],
        totalDisputeWins: s[6],
      });
      setBadge(badgeResult as number);

      // Fetch user's dares (scan all dares)
      const total = Number(dareCount as bigint);
      const userDaresList: DareData[] = [];

      const batchSize = 50;
      const start = Math.max(0, total - 200); // Scan last 200 dares max

      for (let i = total - 1; i >= start && userDaresList.length < 50; i--) {
        try {
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

          if (
            result[0].toLowerCase() === profileAddress.toLowerCase() ||
            result[1].toLowerCase() === profileAddress.toLowerCase()
          ) {
            userDaresList.push({
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
            });
          }
        } catch {}
      }

      setUserDares(userDaresList);
    } catch (err) {
      console.error("Failed to fetch profile:", err);
    } finally {
      setLoading(false);
    }
  }, [profileAddress, readContract]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleCopy = () => {
    navigator.clipboard.writeText(profileAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const activeDares = userDares.filter((d) => d.status <= 3);
  const pastDares = userDares.filter((d) => d.status >= 4);

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <main className="mx-auto max-w-3xl px-4 py-8 pb-24">
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to feed
          </Link>

          <div className="inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-950 px-3 py-1 text-[11px] text-gray-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            On‑chain profile
          </div>
        </div>

        {/* Profile Header */}
        <div className="mb-6 rounded-2xl border border-neutral-800 bg-neutral-950/80 px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/20 text-primary text-lg font-bold">
              {profileAddress.slice(2, 4).toUpperCase()}
              <span className="absolute inset-0 rounded-2xl border border-primary/40 blur-[1px]" />
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-medium text-white truncate">
                  {shortenAddress(profileAddress)}
                </span>
                <button onClick={handleCopy} className="shrink-0" aria-label="Copy address">
                  {copied ? (
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="h-3.5 w-3.5 text-gray-400 hover:text-white" />
                  )}
                </button>
                <a
                  href={`https://basescan.org/address/${profileAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0"
                  aria-label="View on BaseScan"
                >
                  <ExternalLink className="h-3.5 w-3.5 text-gray-400 hover:text-white" />
                </a>
              </div>
              <span className="text-xs text-gray-500">
                {isOwnProfile ? "Your on‑chain dare history" : "Public dare profile"}
              </span>
            </div>
          </div>

          <div className="hidden sm:flex flex-col items-end text-xs text-gray-400">
            <div className="inline-flex items-center gap-1 rounded-full bg-neutral-900 px-2 py-1 border border-neutral-700">
              <Trophy className="h-3.5 w-3.5 text-amber-400" />
              <span className="font-mono">
                Wins: {stats ? Number(stats.totalWins) : 0}
              </span>
            </div>
            {isOwnProfile && (
              <span className="mt-1 inline-flex items-center text-[11px] text-primary gap-1">
                <Sparkles className="h-3 w-3" />
                Your Profile
              </span>
            )}
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {!loading && stats && (
          <>
            <UserStatsCard stats={stats} badge={badge} address={profileAddress} />

            <Tabs defaultValue="active" className="mt-8">
              <TabsList className="grid w-full grid-cols-2 bg-neutral-900 rounded-full p-1 border border-neutral-800">
                <TabsTrigger
                  value="active"
                  className="text-gray-300 data-[state=active]:bg-primary data-[state=active]:text-black rounded-full text-sm"
                >
                  Active ({activeDares.length})
                </TabsTrigger>
                <TabsTrigger
                  value="history"
                  className="text-gray-300 data-[state=active]:bg-neutral-700 data-[state=active]:text-white rounded-full text-sm"
                >
                  History ({pastDares.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="active" className="mt-4">
                {activeDares.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center text-sm text-gray-400">
                    No active dares
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {activeDares.map((d) => (
                      <DareCard key={d.id} dare={d} />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="history" className="mt-4">
                {pastDares.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center text-sm text-gray-400">
                    No past dares
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {pastDares.map((d) => (
                      <DareCard key={d.id} dare={d} />
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </>
        )}
      </main>
    </div>
  );
}
