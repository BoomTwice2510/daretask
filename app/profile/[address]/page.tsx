"use client";

import { use, useState, useEffect, useCallback } from "react";
import { useWeb3 } from "@/lib/web3-provider";
import { Header } from "@/components/header";
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

const INITIAL_LIMIT = 20;
const SECOND_LIMIT = 30;
const MAX_LIMIT = 50;
const SCAN_WINDOW = 200; // last N dares to scan for this user

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
  const [displayLimit, setDisplayLimit] = useState<number>(INITIAL_LIMIT);
  const [totalFound, setTotalFound] = useState<number>(0);

  const profileAddress = paramAddress;
  const isOwnProfile =
    connectedAddress?.toLowerCase() === profileAddress.toLowerCase();

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      // Badge is derived from XP returned by the deployed contract.
      const [statsResult, dareCount] = await Promise.all([
        readContract("getUserStats", [profileAddress]),
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
      const xpNumber = Number(s[2]);
      setBadge(
        xpNumber >= 7500 ? 7 :
        xpNumber >= 5000 ? 6 :
        xpNumber >= 3000 ? 5 :
        xpNumber >= 2000 ? 4 :
        xpNumber >= 1000 ? 3 :
        xpNumber >= 500 ? 2 :
        xpNumber >= 1 ? 1 : 0
      );

      // Scan last SCAN_WINDOW dares, but stop when we collected MAX_LIMIT for this user
      const total = Number(dareCount as bigint);
      const start = Math.max(0, total - SCAN_WINDOW);

      const found: DareData[] = [];

      for (let i = total - 1; i >= start; i--) {
        if (found.length >= MAX_LIMIT) break;
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

          const creator = result[0];
          const accepter = result[1];

          if (
            creator.toLowerCase() === profileAddress.toLowerCase() ||
            accepter.toLowerCase() === profileAddress.toLowerCase()
          ) {
            found.push({
              id: i,
              creator,
              accepter,
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

      setUserDares(found);
      setTotalFound(found.length);
      setDisplayLimit(INITIAL_LIMIT);
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
              "x-api-key": process.env
                .NEXT_PUBLIC_NEYNAR_API_KEY as string,
            },
          },
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

  const activeDaresAll = userDares.filter((d) => d.status <= 3);
  const pastDaresAll = userDares.filter((d) => d.status >= 4);

  const activeDares = activeDaresAll.slice(0, displayLimit);
  const pastDares = pastDaresAll.slice(0, displayLimit);

  const canExpand =
    !loading && totalFound > displayLimit && displayLimit < MAX_LIMIT;

  const handleExpand = () => {
    setDisplayLimit((prev) => {
      if (prev < SECOND_LIMIT) return SECOND_LIMIT;
      if (prev < MAX_LIMIT) return MAX_LIMIT;
      return prev;
    });
  };

  return (
    <div className="dare-light-shell dare-profile-page">
      <Header />

      <main className="dare-page-wide">
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
        <div className="mb-6 rounded-2xl border border-[#dce5f1] bg-white px-4 py-4 flex items-center justify-between gap-4 shadow-[0_12px_35px_rgba(35,65,110,0.07)]">
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
                <span className="text-xs text-[#60718c]">
                  @{fcUser.username}
                </span>
              )}
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-medium text-[#173154] truncate">
                  {shortenAddress(profileAddress)}
                </span>
                <button
                  onClick={handleCopy}
                  className="shrink-0 rounded-full border border-[#dce5f1] bg-[#f8fafc] p-1 hover:bg-[#eef5ff] transition-colors"
                  aria-label="Copy address"
                >
                  {copied ? (
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="h-3.5 w-3.5 text-[#7b8aa1] hover:text-[#1268f3]" />
                  )}
                </button>
                <a
                  href={`https://basescan.org/address/${profileAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 rounded-full border border-[#dce5f1] bg-[#f8fafc] p-1 hover:bg-[#eef5ff] transition-colors"
                  aria-label="View on BaseScan"
                >
                  <ExternalLink className="h-3.5 w-3.5 text-[#7b8aa1] hover:text-[#1268f3]" />
                </a>
              </div>
              <span className="text-xs text-[#7b8aa1]">
                {isOwnProfile
                  ? "Your on‑chain dare history"
                  : "Public dare profile"}
              </span>
            </div>
          </div>

          <div className="hidden sm:flex flex-col items-end text-xs text-[#60718c]">
            <div className="inline-flex items-center gap-1 rounded-full bg-[#f8fafc] px-2 py-1 border border-[#dce5f1]">
              <Trophy className="h-3.5 w-3.5 text-[#f5d566]" />
              <span className="font-mono">
                Wins: {stats ? Number(stats.totalWins) : 0}
              </span>
            </div>
            {isOwnProfile && (
              <span className="mt-1 inline-flex items-center text-[11px] text-[#1268f3] gap-1">
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
            <p className="text-xs text-[#7b8aa1]">Fetching profile data…</p>
          </div>
        )}

        {/* Content */}
        {!loading && stats && (
          <>
            <section className="rounded-3xl border border-[#dce5f1] bg-white p-5 shadow-[0_16px_45px_rgba(35,65,110,0.08)] sm:p-6">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[#dce5f1] bg-[#f5f8fc] text-[#1268f3]">
                    <Trophy className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#7b8aa1]">Dare reputation</div>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-xl font-extrabold text-[#173154]">
                        {["None", "Rookie", "Challenger", "Contender", "Gladiator", "Champion", "Legend", "Mythic"][badge]}
                      </span>
                      <span className="rounded-full border border-[#cfe0f8] bg-[#f1f7ff] px-2.5 py-1 text-[10px] font-bold text-[#1268f3]">
                        {Number(stats.xpPoints)} XP
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:min-w-[520px]">
                  {[
                    ["Wins", Number(stats.totalWins)],
                    ["Losses", Number(stats.totalLosses)],
                    ["Dispute wins", Number(stats.totalDisputeWins)],
                    ["Active", Number(stats.activeCountCreator) + Number(stats.activeCountAccepter)],
                  ].map(([label, value]) => (
                    <div key={String(label)} className="rounded-2xl border border-[#e4eaf2] bg-[#f8fafc] px-3 py-3">
                      <div className="text-[10px] font-semibold uppercase tracking-wide text-[#7b8aa1]">{label}</div>
                      <div className="mt-1 text-lg font-extrabold text-[#173154]">{value}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-[#e4eaf2] bg-[#fbfcfe] px-4 py-3">
                  <div className="text-[10px] font-semibold uppercase tracking-wide text-[#7b8aa1]">XP progress</div>
                  <div className="mt-1 text-sm font-bold text-[#173154]">{Number(stats.xpPoints)} points</div>
                </div>
                <div className="rounded-2xl border border-[#e4eaf2] bg-[#fbfcfe] px-4 py-3">
                  <div className="text-[10px] font-semibold uppercase tracking-wide text-[#7b8aa1]">On-chain volume</div>
                  <div className="mt-1 text-sm font-bold text-[#173154]">${(Number(stats.totalVolume) / 1_000_000).toFixed(2)}</div>
                </div>
                <div className="rounded-2xl border border-[#e4eaf2] bg-[#fbfcfe] px-4 py-3">
                  <div className="text-[10px] font-semibold uppercase tracking-wide text-[#7b8aa1]">Profile status</div>
                  <div className="mt-1 text-sm font-bold text-emerald-600">{isOwnProfile ? "Your profile" : "Public profile"}</div>
                </div>
              </div>
            </section>

            <Tabs defaultValue="active" className="mt-7">
              <TabsList className="grid w-full grid-cols-2 rounded-2xl border border-[#dce5f1] bg-white p-1 shadow-[0_8px_25px_rgba(35,65,110,0.05)]">
                <TabsTrigger
                  value="active"
                  className="rounded-xl text-sm font-semibold text-[#60718c] data-[state=active]:bg-[#1268f3] data-[state=active]:text-white data-[state=active]:shadow-[0_6px_18px_rgba(18,104,243,0.18)]"
                >
                  Active ({activeDaresAll.length})
                </TabsTrigger>
                <TabsTrigger
                  value="history"
                  className="rounded-xl text-sm font-semibold text-[#60718c] data-[state=active]:bg-[#eef5ff] data-[state=active]:text-[#1268f3]"
                >
                  History ({pastDaresAll.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="active" className="mt-4">
                {activeDares.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center text-sm text-[#7b8aa1]">
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
                  <div className="flex flex-col items-center justify-center py-10 text-center text-sm text-[#7b8aa1]">
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

            {canExpand && (
              <div className="mt-6 flex justify-center">
                <button
                  onClick={handleExpand}
                  className="text-xs font-semibold px-4 py-2 rounded-full border border-[#cfe0f8] text-[#1268f3] bg-white hover:bg-[#f1f7ff] transition-colors"
                >
                  Show more dares ({displayLimit} →{" "}
                  {displayLimit < SECOND_LIMIT
                    ? SECOND_LIMIT
                    : MAX_LIMIT}
                  )
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
