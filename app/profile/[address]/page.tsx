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

type FarcasterUser = {
  fid: number;
  username: string;
  display_name?: string;
  pfp_url?: string;
};

export default function ProfilePage({
  params,
}: {
  params: Promise<{ address: string }>;
}) {
  const { address: paramAddress } = use(params);
  const { readContract, address: connectedAddress } = useWeb3();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [badge, setBadge] = useState<number>(0);
  const [userDares, setUserDares] = useState<DareData[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [fcUser, setFcUser] = useState<FarcasterUser | null>(null);

  const profileAddress = paramAddress;
  const isOwnProfile =
    connectedAddress?.toLowerCase() === profileAddress.toLowerCase();

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch stats and badge in parallel
      const [statsResult, badgeResult, dareCount] = await Promise.all([
        readContract("getUserStats", [profileAddress]),
        readContract("getUserBadge", [profileAddress]),
        readContract("dareCount"),
      ]);

      const s = statsResult as [
        bigint,
        bigint,
        bigint,
        bigint,
        bigint,
        bigint,
        bigint
      ];
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

      // Fetch user's dares (scan last 200)
      const total = Number(dareCount as bigint);
      const userDaresList: DareData[] = [];
      const start = Math.max(0, total - 200);

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
        } catch {
          // ignore bad dare
        }
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

  // TODO: yahan apna real FID set karo (testing ke liye hard-coded)
  const fid = 0; // e.g. 1234

  useEffect(() => {
    async function fetchFarcasterProfile() {
      try {
        if (!fid) return;

        const res = await fetch(
          `https://api.neynar.com/v2/farcaster/user/by_id?fid=${fid}`,
          {
            headers: {
              "x-api-key": process.env.NEXT_PUBLIC_NEYNAR_API_KEY as string,
            },
          }
        );

        if (!res.ok) {
          console.error("Failed to fetch Farcaster user", await res.text());
          return;
        }

        const data = await res.json();
        const user = data.user;

        setFcUser({
          fid: user.fid,
          username: user.username,
          display_name: user.display_name,
          pfp_url: user.pfp_url || user.profile?.pfp_url,
        });
      } catch (err) {
        console.error("Error fetching Farcaster user", err);
      }
    }

    fetchFarcasterProfile();
  }, [fid]);

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

          <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(212,175,55,0.45)] bg-[rgba(10,10,10,0.9)] px-3 py-1 text-[11px] text-[#f5d566] backdrop-blur-md shadow-[0_0_25px_rgba(212,175,55,0.25)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d4af37] opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#d4af37]" />
            </span>
            On‑chain profile
          </div>
        </div>

        {/* Profile Header */}
        <div className="mb-6 rounded-2xl border border-[rgba(212,175,55,0.35)] bg-[rgba(5,5,5,0.96)] px-4 py-4 flex items-center justify-between gap-4 shadow-[0_18px_60px_rgba(0,0,0,0.9)]">
          <div className="flex items-center gap-3">
            {/* Farcaster avatar (fallback to blocky if missing) */}
            <div className="relative h-12 w-12">
              {fcUser?.pfp_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={fcUser.pfp_url}
                  alt={
                    fcUser.display_name ||
                    fcUser.username ||
                    "Farcaster profile"
                  }
                  className="h-12 w-12 rounded-2xl border border-[rgba(212,175,55,0.6)] object-cover"
                />
              ) : (
                <div className="h-12 w-12 rounded-2xl border border-[rgba(212,175,55,0.6)] bg-gradient-to-br from-slate-800 to-slate-900" />
              )}
            </div>

            <div className="flex flex-col min-w-0">
              {fcUser && (
                <span className="text-xs text-white/70">
                  @{fcUser.username}
                </span>
              )}
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-medium text-white truncate">
                  {shortenAddress(profileAddress)}
                </span>
                <button
                  onClick={handleCopy}
                  className="shrink-0 rounded-full border border-white/10 bg-black/40 p-1 hover:bg-black/80 transition-colors"
                  aria-label="Copy address"
                >
                  {copied ? (
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="h-3.5 w-3.5 text-white/50 hover:text-white" />
                  )}
                </button>
                <a
                  href={`https://basescan.org/address/${profileAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 rounded-full border border-white/10 bg-black/40 p-1 hover:bg-black/80 transition-colors"
                  aria-label="View on BaseScan"
                >
                  <ExternalLink className="h-3.5 w-3.5 text-white/50 hover:text-white" />
                </a>
              </div>
              <span className="text-xs text-white/55">
                {isOwnProfile
                  ? "Your on‑chain dare history"
                  : "Public dare profile"}
              </span>
            </div>
          </div>

          <div className="hidden sm:flex flex-col items-end text-xs text-white/60">
            <div className="inline-flex items-center gap-1 rounded-full bg-[rgba(10,10,10,0.95)] px-2 py-1 border border-white/10">
              <Trophy className="h-3.5 w-3.5 text-[#f5d566]" />
              <span className="font-mono">
                Wins: {stats ? Number(stats.totalWins) : 0}
              </span>
            </div>
            {isOwnProfile && (
              <span className="mt-1 inline-flex items-center text-[11px] text-[#f5d566] gap-1">
                <Sparkles className="h-3 w-3" />
                Your Profile
              </span>
            )}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-[#f5d566]" />
            <p className="text-xs text-white/60">Fetching profile data…</p>
          </div>
        )}

        {/* Content */}
        {!loading && stats && (
          <>
            <UserStatsCard
              stats={stats}
              badge={badge}
              address={profileAddress}
            />

            <Tabs defaultValue="active" className="mt-8">
              <TabsList className="grid w-full grid-cols-2 bg-[rgba(10,10,10,0.95)] rounded-full p-1 border border-white/10">
                <TabsTrigger
                  value="active"
                  className="text-white/70 data-[state=active]:bg-[#f5d566] data-[state=active]:text-black rounded-full text-sm transition-all data-[state=active]:shadow-[0_0_20px_rgba(245,213,102,0.6)]"
                >
                  Active ({activeDares.length})
                </TabsTrigger>
                <TabsTrigger
                  value="history"
                  className="text-white/70 data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:border data-[state=active]:border-white/15 rounded-full text-sm transition-all"
                >
                  History ({pastDares.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="active" className="mt-4">
                {activeDares.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center text-sm text-white/60">
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
                  <div className="flex flex-col items-center justify-center py-10 text-center text-sm text-white/60">
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
