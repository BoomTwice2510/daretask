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
  Target,
  Swords,
  Activity,
  Coins,
  ShieldCheck,
  ChevronRight,
  Pencil,
  Camera,
  X,
  Save,
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
const SCAN_WINDOW = 200;

const BADGES = [
  "None",
  "Rookie",
  "Challenger",
  "Contender",
  "Gladiator",
  "Champion",
  "Legend",
  "Mythic",
] as const;

const BADGE_MIN_XP = [0, 1, 500, 1000, 2000, 3000, 5000, 7500];

function badgeFromXp(xp: number) {
  for (let i = BADGE_MIN_XP.length - 1; i >= 0; i--) {
    if (xp >= BADGE_MIN_XP[i]) return i;
  }
  return 0;
}

function xpProgress(xp: number, badge: number) {
  if (badge >= 7) return 100;
  const current = BADGE_MIN_XP[badge];
  const next = BADGE_MIN_XP[badge + 1];
  return Math.min(100, Math.max(0, ((xp - current) / (next - current)) * 100));
}

export default function ProfilePage({
  params,
}: {
  params: Promise<{ address: string }>;
}) {
  const { address: paramAddress } = use(params);
  const { readContract, address: connectedAddress, signMessage } = useWeb3();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [badge, setBadge] = useState<number>(0);
  const [userDares, setUserDares] = useState<DareData[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [fcUser, setFcUser] = useState<FarcasterUser | null>(null);
  const [displayLimit, setDisplayLimit] = useState<number>(INITIAL_LIMIT);
  const [totalFound, setTotalFound] = useState<number>(0);
  const [profileMeta, setProfileMeta] = useState<{
    username: string | null;
    avatar_url: string | null;
  }>({ username: null, avatar_url: null });
  const [editingProfile, setEditingProfile] = useState(false);
  const [usernameInput, setUsernameInput] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSaveError, setProfileSaveError] = useState("");

  const profileAddress = paramAddress;
  const isOwnProfile =
    connectedAddress?.toLowerCase() === profileAddress.toLowerCase();

  const fetchProfileMeta = useCallback(async () => {
    try {
      const res = await fetch(`/api/profile?address=${encodeURIComponent(profileAddress)}`, {
        cache: "no-store",
      });
      if (!res.ok) return;
      const data = await res.json();
      setProfileMeta({
        username: data.profile?.username ?? null,
        avatar_url: data.profile?.avatar_url ?? null,
      });
    } catch {
      // Supabase profile metadata is optional; on-chain profile remains usable.
    }
  }, [profileAddress]);

  useEffect(() => {
    fetchProfileMeta();
  }, [fetchProfileMeta]);

  const handleAvatarChange = (file: File | null) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setProfileSaveError("Please select an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setProfileSaveError("Avatar must be 5 MB or smaller.");
      return;
    }
    setProfileSaveError("");
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSaveProfile = async () => {
    if (!connectedAddress || !isOwnProfile) return;

    const username = usernameInput.trim();
    if (username && !/^[a-zA-Z0-9_]{3,24}$/.test(username)) {
      setProfileSaveError("Username must be 3-24 characters: letters, numbers or underscore.");
      return;
    }

    setSavingProfile(true);
    setProfileSaveError("");

    try {
      const timestamp = Math.floor(Date.now() / 1000);
      const message = [
        "Dare Profile Update",
        `Wallet: ${connectedAddress.toLowerCase()}`,
        `Timestamp: ${timestamp}`,
      ].join("\n");

      const signature = await signMessage(message);
      const form = new FormData();
      form.append("wallet", connectedAddress);
      form.append("message", message);
      form.append("signature", signature);
      form.append("username", username);
      form.append("badge", String(badge));
      if (avatarFile) form.append("avatar", avatarFile);

      const res = await fetch("/api/profile", {
        method: "POST",
        body: form,
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Could not save profile.");
      }

      setProfileMeta({
        username: data.profile?.username ?? null,
        avatar_url: data.profile?.avatar_url ?? null,
      });
      setAvatarFile(null);
      setAvatarPreview(null);
      setEditingProfile(false);
    } catch (error: any) {
      setProfileSaveError(error?.message || "Could not save profile.");
    } finally {
      setSavingProfile(false);
    }
  };

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
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
      setBadge(badgeFromXp(xpNumber));

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
          // Ignore an unreadable dare and continue the scan.
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

  const fid = 0;

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
          },
        );
        if (!res.ok) return;
        const data = await res.json();
        const user = data.user;
        setFcUser({
          fid: user.fid,
          username: user.username,
          display_name: user.display_name,
          pfp_url: user.pfp_url || user.profile?.pfp_url,
        });
      } catch {
        // Farcaster identity is optional for an on-chain profile.
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

  const xp = stats ? Number(stats.xpPoints) : 0;
  const progress = xpProgress(xp, badge);
  const nextBadge = badge < 7 ? BADGES[badge + 1] : "Max rank";
  const nextXp = badge < 7 ? BADGE_MIN_XP[badge + 1] : BADGE_MIN_XP[7];

  return (
    <div className="dare-light-shell min-h-screen bg-[#f5f8fc] text-[#173154]">
      <Header />

      <main className="dare-page-wide pb-16 pt-5 sm:pt-7">
        <div className="mb-5 flex items-center justify-between gap-3">
          <Link
            href="/explore"
            className="group inline-flex items-center gap-2 text-xs font-semibold text-[#60718c] transition-colors hover:text-[#1268f3]"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            Back to explore
          </Link>
          <span className="inline-flex items-center gap-2 rounded-full border border-[#dce5f1] bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#60718c] shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            On-chain profile
          </span>
        </div>

        <section className="overflow-hidden rounded-[28px] border border-[#dce5f1] bg-white shadow-[0_18px_55px_rgba(35,65,110,0.08)]">
          <div className="h-1.5 bg-gradient-to-r from-[#1268f3] via-[#f5d566] to-[#1268f3]" />
          <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6 lg:p-7">
            <div className="flex min-w-0 items-center gap-4">
              <div className="relative shrink-0">
                <div className="absolute -inset-1 rounded-[20px] bg-[#f5d566]/20 blur-md" />
                {profileMeta.avatar_url || fcUser?.pfp_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={profileMeta.avatar_url || fcUser?.pfp_url || ""}
                    alt={profileMeta.username || fcUser?.display_name || fcUser?.username || "Profile"}
                    className="relative h-16 w-16 rounded-[20px] border border-[#d8b93f] object-cover sm:h-[72px] sm:w-[72px]"
                  />
                ) : (
                  <div className="relative flex h-16 w-16 items-center justify-center rounded-[20px] border border-[#dce5f1] bg-[#f5f8fc] text-[#1268f3] sm:h-[72px] sm:w-[72px]">
                    <span className="text-lg font-black">D</span>
                  </div>
                )}
                {isOwnProfile && (
                  <button
                    type="button"
                    onClick={() => {
                      setUsernameInput(profileMeta.username || "");
                      setEditingProfile((value) => !value);
                      setProfileSaveError("");
                    }}
                    className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[#1268f3] text-white shadow-lg transition hover:bg-[#0d58d1]"
                    aria-label="Edit profile"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              <div className="min-w-0">
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-[#eef5ff] px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em] text-[#1268f3]">
                    Dare reputation
                  </span>
                  {isOwnProfile && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#fff8df] px-2 py-0.5 text-[9px] font-bold text-[#9a7610]">
                      <Sparkles className="h-3 w-3" /> Your profile
                    </span>
                  )}
                </div>
                {(profileMeta.username || fcUser?.username) && (
                  <div className="text-xs font-semibold text-[#60718c]">
                    @{profileMeta.username || fcUser?.username}
                  </div>
                )}
                <div className="mt-1 flex min-w-0 items-center gap-2">
                  <span className="truncate font-mono text-sm font-bold text-[#173154] sm:text-base">
                    {shortenAddress(profileAddress)}
                  </span>
                  <button
                    onClick={handleCopy}
                    className="shrink-0 rounded-lg border border-[#dce5f1] bg-[#f8fafc] p-1.5 text-[#7b8aa1] transition hover:border-[#b9cde8] hover:bg-[#eef5ff] hover:text-[#1268f3]"
                    aria-label="Copy address"
                  >
                    {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                  <a
                    href={`https://basescan.org/address/${profileAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 rounded-lg border border-[#dce5f1] bg-[#f8fafc] p-1.5 text-[#7b8aa1] transition hover:border-[#b9cde8] hover:bg-[#eef5ff] hover:text-[#1268f3]"
                    aria-label="View on BaseScan"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
                <p className="mt-1 text-[11px] text-[#7b8aa1]">
                  {isOwnProfile ? "Your on-chain dare history" : "Public dare profile"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:min-w-[250px]">
              <div className="rounded-2xl border border-[#e4eaf2] bg-[#f8fafc] px-4 py-3">
                <div className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#7b8aa1]">Wins</div>
                <div className="mt-1 flex items-center gap-1.5 text-lg font-black text-[#173154]">
                  <Trophy className="h-4 w-4 text-[#d8ad25]" />
                  {stats ? Number(stats.totalWins) : 0}
                </div>
              </div>
              <div className="rounded-2xl border border-[#e4eaf2] bg-[#f8fafc] px-4 py-3">
                <div className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#7b8aa1]">XP</div>
                <div className="mt-1 text-lg font-black text-[#1268f3]">{xp}</div>
              </div>
            </div>
          </div>
        </section>

        {isOwnProfile && editingProfile && (
          <section className="mt-4 rounded-[24px] border border-[#cfe0f8] bg-white p-5 shadow-[0_14px_40px_rgba(35,65,110,0.07)] sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#1268f3]">Profile settings</div>
                <h2 className="mt-1 text-lg font-black text-[#173154]">Customize your Dare identity</h2>
                <p className="mt-1 text-xs text-[#7b8aa1]">Username and avatar are stored off-chain. Your wallet and reputation remain on-chain.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingProfile(false);
                  setAvatarFile(null);
                  setAvatarPreview(null);
                  setProfileSaveError("");
                }}
                className="rounded-xl border border-[#dce5f1] p-2 text-[#7b8aa1] hover:bg-[#f5f8fc]"
                aria-label="Close profile editor"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5 grid gap-5 sm:grid-cols-[auto_1fr] sm:items-center">
              <label className="group relative flex h-24 w-24 cursor-pointer items-center justify-center overflow-hidden rounded-[24px] border border-[#dce5f1] bg-[#f5f8fc]">
                {avatarPreview || profileMeta.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={avatarPreview || profileMeta.avatar_url || ""}
                    alt="Avatar preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-1 text-[#1268f3]">
                    <Camera className="h-5 w-5" />
                    <span className="text-[9px] font-bold uppercase">Add DP</span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  className="sr-only"
                  onChange={(event) => handleAvatarChange(event.target.files?.[0] || null)}
                />
              </label>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#7b8aa1]">
                  Username
                </label>
                <div className="mt-2 flex gap-2">
                  <div className="flex min-w-0 flex-1 items-center rounded-xl border border-[#dce5f1] bg-[#f8fafc] px-3">
                    <span className="text-sm font-bold text-[#9aa7b8]">@</span>
                    <input
                      value={usernameInput}
                      onChange={(event) => setUsernameInput(event.target.value.replace(/[^a-zA-Z0-9_]/g, "").slice(0, 24))}
                      placeholder="your_username"
                      className="min-w-0 flex-1 bg-transparent px-2 py-2.5 text-sm font-semibold text-[#173154] outline-none placeholder:text-[#aeb9c7]"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleSaveProfile}
                    disabled={savingProfile}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#1268f3] px-4 py-2.5 text-xs font-bold text-white shadow-[0_8px_20px_rgba(18,104,243,0.18)] transition hover:bg-[#0d58d1] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {savingProfile ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Save
                  </button>
                </div>
                <p className="mt-2 text-[10px] text-[#9aa7b8]">3-24 characters. Letters, numbers and underscore only. Max avatar size: 5 MB.</p>
                {profileSaveError && (
                  <p className="mt-2 text-xs font-semibold text-rose-600">{profileSaveError}</p>
                )}
              </div>
            </div>
          </section>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center gap-3 py-24">
            <Loader2 className="h-8 w-8 animate-spin text-[#1268f3]" />
            <p className="text-xs font-medium text-[#7b8aa1]">Reading on-chain profile data…</p>
          </div>
        )}

        {!loading && stats && (
          <>
            <section className="mt-5 overflow-hidden rounded-[28px] border border-[#dce5f1] bg-white shadow-[0_16px_45px_rgba(35,65,110,0.07)]">
              <div className="flex flex-col gap-5 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between lg:p-7">
                <div className="flex min-w-0 items-center gap-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[22px] border border-[#e4d17a] bg-gradient-to-br from-[#fffdf2] to-[#fff6c9] text-[#b18a16] shadow-[0_8px_25px_rgba(216,173,37,0.16)]">
                    <Trophy className="h-7 w-7" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#7b8aa1]">Current rank</div>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      <h1 className="text-2xl font-black tracking-tight text-[#173154] sm:text-3xl">{BADGES[badge]}</h1>
                      <span className="rounded-full border border-[#f0df91] bg-[#fff9df] px-2.5 py-1 text-[10px] font-black text-[#9a7610]">{xp} XP</span>
                    </div>
                    <p className="mt-1 text-xs text-[#7b8aa1]">
                      {badge >= 7 ? "Maximum reputation tier reached." : `${Math.max(0, nextXp - xp)} XP to ${nextBadge}.`}
                    </p>
                  </div>
                </div>

                <div className="w-full lg:max-w-[520px]">
                  <div className="mb-2 flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.1em] text-[#7b8aa1]">
                    <span>{BADGES[badge]}</span>
                    <span>{badge >= 7 ? "MAX" : nextBadge}</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-[#edf2f7]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#1268f3] via-[#5d8ff0] to-[#f5d566] transition-all duration-700"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="mt-2 text-right text-[10px] font-semibold text-[#9aa7b8]">{progress.toFixed(0)}% complete</div>
                </div>
              </div>

              <div className="grid border-t border-[#edf1f6] sm:grid-cols-2 lg:grid-cols-4">
                {([
                  { label: "Wins", value: Number(stats.totalWins), Icon: Trophy, color: "text-emerald-600" },
                  { label: "Losses", value: Number(stats.totalLosses), Icon: Target, color: "text-rose-500" },
                  { label: "Dispute wins", value: Number(stats.totalDisputeWins), Icon: Swords, color: "text-amber-600" },
                  { label: "Active dares", value: Number(stats.activeCountCreator) + Number(stats.activeCountAccepter), Icon: Activity, color: "text-[#1268f3]" },
                ] as const).map(({ label, value, Icon: StatIcon, color }, index) => {
                  return (
                    <div key={String(label)} className={`px-5 py-4 ${index > 0 ? "border-t border-[#edf1f6] sm:border-l sm:border-t-0" : ""} ${index === 2 ? "lg:border-l" : ""}`}>
                      <div className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.12em] ${String(color)}`}>
                        <StatIcon className="h-3.5 w-3.5" />
                        {label}
                      </div>
                      <div className="mt-1 text-xl font-black text-[#173154]">{String(value)}</div>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-2xl border border-[#dce5f1] bg-white p-4 shadow-[0_8px_25px_rgba(35,65,110,0.04)]">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[#7b8aa1]"><Coins className="h-3.5 w-3.5 text-[#1268f3]" /> On-chain volume</div>
                <div className="mt-2 text-lg font-black text-[#173154]">${(Number(stats.totalVolume) / 1_000_000).toFixed(2)}</div>
                <div className="mt-1 text-[10px] text-[#9aa7b8]">Tracked by the protocol in USD 6 decimals</div>
              </div>
              <div className="rounded-2xl border border-[#dce5f1] bg-white p-4 shadow-[0_8px_25px_rgba(35,65,110,0.04)]">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[#7b8aa1]"><ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> Creator activity</div>
                <div className="mt-2 text-lg font-black text-[#173154]">{Number(stats.activeCountCreator)}</div>
                <div className="mt-1 text-[10px] text-[#9aa7b8]">Currently active as dare creator</div>
              </div>
              <div className="rounded-2xl border border-[#dce5f1] bg-white p-4 shadow-[0_8px_25px_rgba(35,65,110,0.04)]">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[#7b8aa1]"><Activity className="h-3.5 w-3.5 text-[#1268f3]" /> Accepter activity</div>
                <div className="mt-2 text-lg font-black text-[#173154]">{Number(stats.activeCountAccepter)}</div>
                <div className="mt-1 text-[10px] text-[#9aa7b8]">Currently active as dare accepter</div>
              </div>
            </section>

            <Tabs defaultValue="active" className="mt-7">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#7b8aa1]">Dare activity</div>
                  <h2 className="mt-1 text-xl font-black text-[#173154]">On-chain history</h2>
                </div>
                <TabsList className="grid h-11 w-full grid-cols-2 rounded-2xl border border-[#dce5f1] bg-white p-1 shadow-[0_8px_25px_rgba(35,65,110,0.05)] sm:w-[330px]">
                  <TabsTrigger value="active" className="rounded-xl text-xs font-bold text-[#60718c] data-[state=active]:bg-[#1268f3] data-[state=active]:text-white data-[state=active]:shadow-[0_6px_18px_rgba(18,104,243,0.18)]">Active ({activeDaresAll.length})</TabsTrigger>
                  <TabsTrigger value="history" className="rounded-xl text-xs font-bold text-[#60718c] data-[state=active]:bg-[#eef5ff] data-[state=active]:text-[#1268f3]">History ({pastDaresAll.length})</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="active" className="mt-4">
                {activeDares.length === 0 ? (
                  <div className="rounded-3xl border border-dashed border-[#cfdbea] bg-white py-14 text-center text-sm text-[#7b8aa1]">No active dares</div>
                ) : (
                  <div className="flex flex-col gap-3">{activeDares.map((d) => <DareCard key={d.id} dare={d} />)}</div>
                )}
              </TabsContent>

              <TabsContent value="history" className="mt-4">
                {pastDares.length === 0 ? (
                  <div className="rounded-3xl border border-dashed border-[#cfdbea] bg-white py-14 text-center text-sm text-[#7b8aa1]">No past dares</div>
                ) : (
                  <div className="flex flex-col gap-3">{pastDares.map((d) => <DareCard key={d.id} dare={d} />)}</div>
                )}
              </TabsContent>
            </Tabs>

            {canExpand && (
              <div className="mt-6 flex justify-center">
                <button onClick={handleExpand} className="inline-flex items-center gap-1 rounded-full border border-[#cfe0f8] bg-white px-4 py-2 text-xs font-bold text-[#1268f3] shadow-sm transition hover:bg-[#eef5ff]">
                  Show more dares
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
