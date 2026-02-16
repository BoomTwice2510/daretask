"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useWeb3 } from "@/lib/web3-provider";
import { ALLOWED_TOKENS, ZERO_ADDRESS } from "@/lib/contract";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Loader2, AlertCircle, Coins, Zap, CheckCircle2, X } from "lucide-react";
import { parseEther, type Address } from "viem";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

// ---------- Flash Task types + data ----------

export interface FlashTaskTemplate {
  id: string;
  title: string;
  description: string;
  deadline: number; // seconds
  proofType: string;
  failureRate: string;
}

export interface FlashTaskCategory {
  id: string;
  name: string;
  emoji: string;
  description: string;
  failureRating: number; // 1-4 flames
  templates: FlashTaskTemplate[];
}

export const FLASH_TASK_CATEGORIES: FlashTaskCategory[] = [
  {
    id: "build",
    name: "Build / Ship",
    emoji: "🔨",
    description: "High ego, high fail. Builders overestimate themselves.",
    failureRating: 3,
    templates: [
      {
        id: "ship-feature",
        title: "Ship any feature (UI or contract) in 24h",
        description: "Build and deploy a new feature to your project within 24 hours",
        deadline: 86400,
        proofType: "GitHub link / deployment tx",
        failureRate: "🔥🔥🔥",
      },
      {
        id: "deploy-contract",
        title: "Deploy any contract on testnet in 12h",
        description: "Deploy a smart contract to a testnet within 12 hours",
        deadline: 43200,
        proofType: "Deployment transaction hash",
        failureRate: "🔥🔥🔥",
      },
      {
        id: "github-commits",
        title: "Push 3 GitHub commits in 24h",
        description: "Make 3 meaningful commits to your repository within 24 hours",
        deadline: 86400,
        proofType: "GitHub commit links",
        failureRate: "🔥🔥🔥",
      },
      {
        id: "fix-issue",
        title: "Fix 1 open issue in your repo today",
        description: "Identify and fix one open issue in your repository by end of day",
        deadline: 86400,
        proofType: "GitHub issue link",
        failureRate: "🔥🔥🔥",
      },
      {
        id: "landing-page",
        title: "Launch a landing page (any stack) in 24h",
        description: "Build and launch a complete landing page within 24 hours",
        deadline: 86400,
        proofType: "Deployed URL",
        failureRate: "🔥🔥🔥",
      },
    ],
  },
  {
    id: "social",
    name: "Post / Social",
    emoji: "📢",
    description: "Low effort but consistency kills people.",
    failureRating: 2,
    templates: [
      {
        id: "farcaster-daily",
        title: "Post 1 Farcaster cast daily for 7 days",
        description: "Share a meaningful cast on Farcaster every day for 7 days",
        deadline: 604800,
        proofType: "Profile link with 7 casts",
        failureRate: "🔥🔥",
      },
      {
        id: "tweet-daily",
        title: "Tweet once daily for next 5 days",
        description: "Post a tweet every day for the next 5 days",
        deadline: 432000,
        proofType: "Twitter/X profile link",
        failureRate: "🔥🔥",
      },
      {
        id: "reply-casts",
        title: "Reply to 10 casts today",
        description: "Engage by replying to 10 different casts on Farcaster today",
        deadline: 86400,
        proofType: "Profile screenshot",
        failureRate: "🔥🔥",
      },
      {
        id: "build-update",
        title: "Post 1 build update in 24h",
        description: "Share progress on what you are currently building",
        deadline: 86400,
        proofType: "Profile link / tweet link",
        failureRate: "🔥🔥",
      },
      {
        id: "onchain-share",
        title: "Share 1 onchain tx publicly today",
        description: "Complete an onchain transaction and share it publicly today",
        deadline: 86400,
        proofType: "Profile link with tx share",
        failureRate: "🔥🔥",
      },
    ],
  },
  {
    id: "learn",
    name: "Learn / Study",
    emoji: "📚",
    description: "People think they will do it. They won't.",
    failureRating: 3,
    templates: [
      {
        id: "whitepaper",
        title: "Read 1 whitepaper + summary in 24h",
        description: "Read a blockchain/crypto whitepaper and write a summary",
        deadline: 86400,
        proofType: "Notion / doc / link",
        failureRate: "🔥🔥🔥",
      },
      {
        id: "dev-tutorial",
        title: "Watch 1 dev tutorial + notes today",
        description: "Complete a development tutorial and take detailed notes",
        deadline: 86400,
        proofType: "Notion / doc / link",
        failureRate: "🔥🔥🔥",
      },
      {
        id: "protocol-feature",
        title: "Learn 1 new protocol feature in 12h",
        description: "Deep dive into one feature of your favorite protocol",
        deadline: 43200,
        proofType: "Twitter/Farcaster thread",
        failureRate: "🔥🔥🔥",
      },
      {
        id: "write-summary",
        title: "Write 200 words about any crypto topic",
        description: "Write thoughtful content on a crypto topic of your choice",
        deadline: 86400,
        proofType: "Notion / Medium / blog",
        failureRate: "🔥🔥🔥",
      },
      {
        id: "study-docs",
        title: "Study documentation for 2 hours",
        description: "Dedicate 2 hours to learning from official protocol documentation",
        deadline: 86400,
        proofType: "Self-attestation + challenge window",
        failureRate: "🔥🔥🔥",
      },
    ],
  },
  {
    id: "onchain",
    name: "Onchain Actions",
    emoji: "⛓️",
    description: "Best for automation. Clean & verifiable.",
    failureRating: 1,
    templates: [
      {
        id: "any-tx",
        title: "Do 1 onchain tx today (any chain)",
        description: "Execute any transaction on any blockchain today",
        deadline: 86400,
        proofType: "Transaction hash",
        failureRate: "🔥",
      },
      {
        id: "bridge-funds",
        title: "Bridge funds to any L2 in 12h",
        description: "Bridge tokens to a Layer 2 network within 12 hours",
        deadline: 43200,
        proofType: "Bridge transaction hash",
        failureRate: "🔥",
      },
      {
        id: "swap-token",
        title: "Swap any token on DEX today",
        description: "Complete a token swap on any decentralized exchange today",
        deadline: 86400,
        proofType: "Swap transaction hash",
        failureRate: "🔥",
      },
      {
        id: "mint-nft",
        title: "Mint any NFT in 24h",
        description: "Mint an NFT from any collection within 24 hours",
        deadline: 86400,
        proofType: "NFT transaction hash",
        failureRate: "🔥",
      },
      {
        id: "dao-vote",
        title: "Vote on 1 DAO proposal",
        description: "Participate in DAO governance by voting on a proposal",
        deadline: 604800,
        proofType: "Vote transaction hash",
        failureRate: "🔥",
      },
    ],
  },
  {
    id: "money",
    name: "Money / Discipline",
    emoji: "💰",
    description: "Money rules behavior. Painful = good.",
    failureRating: 4,
    templates: [
      {
        id: "no-degen-trading",
        title: "No degen trading for 48h",
        description: "Abstain from high-risk trading for 48 hours",
        deadline: 172800,
        proofType: "Wallet history / self-attest",
        failureRate: "🔥🔥🔥🔥",
      },
      {
        id: "no-leverage",
        title: "No leverage trades for 72h",
        description: "Avoid all leverage trades for 72 hours",
        deadline: 259200,
        proofType: "Wallet history / self-attest",
        failureRate: "🔥🔥🔥🔥",
      },
      {
        id: "hold-eth",
        title: "Hold ETH without selling for 7 days",
        description: "Hold your ETH position without selling for 7 days",
        deadline: 604800,
        proofType: "Wallet history / self-attest",
        failureRate: "🔥🔥🔥🔥",
      },
      {
        id: "no-new-nfts",
        title: "No new NFTs minted for 5 days",
        description: "Avoid minting new NFTs for 5 days",
        deadline: 432000,
        proofType: "Wallet history / self-attest",
        failureRate: "🔥🔥🔥🔥",
      },
      {
        id: "track-expenses",
        title: "Track expenses today & share summary",
        description: "Track all your expenses today and share a summary",
        deadline: 86400,
        proofType: "Screenshot / spreadsheet",
        failureRate: "🔥🔥🔥🔥",
      },
    ],
  },
  {
    id: "health",
    name: "Health",
    emoji: "💪",
    description: "Crypto crowd secretly wants discipline.",
    failureRating: 3,
    templates: [
      {
        id: "no-junk-food",
        title: "No junk food for 24h",
        description: "Avoid all junk food and eat clean for 24 hours",
        deadline: 86400,
        proofType: "Photo / self-attestation",
        failureRate: "🔥🔥🔥",
      },
      {
        id: "wake-early",
        title: "Wake up before 7 AM tomorrow",
        description: "Wake up and be productive before 7 AM tomorrow",
        deadline: 86400,
        proofType: "Screenshot / photo",
        failureRate: "🔥🔥🔥",
      },
      {
        id: "walk-steps",
        title: "Walk 5,000 steps today",
        description: "Complete 5,000 steps today for your health",
        deadline: 86400,
        proofType: "Health app screenshot",
        failureRate: "🔥🔥🔥",
      },
      {
        id: "no-smoking",
        title: "No smoking for 24h",
        description: "Stay smoke-free for the next 24 hours",
        deadline: 86400,
        proofType: "Self-attestation",
        failureRate: "🔥🔥🔥",
      },
      {
        id: "pushups",
        title: "30 pushups in one session",
        description: "Complete 30 pushups in a single session today",
        deadline: 86400,
        proofType: "Photo / video",
        failureRate: "🔥🔥🔥",
      },
    ],
  },
];

// ---------- Flash Task inline bar (top of form) ----------

function secondsToDuration(deadline: number): { type: "hours" | "days"; value: number } {
  if (deadline % 86400 === 0) {
    return { type: "days", value: Math.max(1, deadline / 86400) };
  }
  return { type: "hours", value: Math.max(1, Math.round(deadline / 3600)) };
}

interface FlashTaskBarProps {
  onApplyTemplate: (template: FlashTaskTemplate, category: FlashTaskCategory) => void;
}

function FlashTaskBar({ onApplyTemplate }: FlashTaskBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategoryId, setActiveCategoryId] = useState<string>("build");
  const activeCategory =
    FLASH_TASK_CATEGORIES.find((c) => c.id === activeCategoryId) ?? FLASH_TASK_CATEGORIES[0];

  return (
    <div className="relative mb-4">
      {/* Tab header (compact, glassy) */}
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="flex w-full items-center justify-between rounded-lg border border-neutral-800 bg-neutral-900/80 px-3 py-2 text-left hover:border-pink-500/70 hover:bg-neutral-900 transition-colors"
      >
        <div className="flex items-center gap-2">
          <div className="relative flex h-7 w-7 items-center justify-center rounded-full bg-pink-500/20">
            <span className="absolute inset-0 rounded-full bg-pink-500/40 blur-md opacity-40 group-hover:opacity-70 transition-opacity" />
            <Zap className="relative h-4 w-4 text-pink-300" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold uppercase tracking-wide text-pink-300">
              Flash Task
            </span>
            <span className="text-[11px] text-gray-400">
              Tap to browse quick templates (optional)
            </span>
          </div>
        </div>
        <span className="text-xs text-gray-400">
          {isOpen ? "Hide" : "Show"} • {FLASH_TASK_CATEGORIES.length} categories
        </span>
      </button>

      {/* Floating panel – feels like it opens over the form, not pushing layout */}
      <div
        className={cn(
          "absolute left-0 right-0 z-20 mt-2 origin-top rounded-xl border border-pink-500/40 bg-neutral-950/98 shadow-[0_18px_60px_rgba(236,72,153,0.35)] backdrop-blur-xl transition-all",
          isOpen
            ? "pointer-events-auto scale-100 opacity-100"
            : "pointer-events-none scale-95 opacity-0"
        )}
      >
        {/* top accent line */}
        <div className="h-0.5 w-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-sky-500" />

        <div className="p-3 md:p-4">
          {/* Category pills – no visible scrollbar, gradient fade at edges */}
          <div className="relative mb-3">
            <div className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-neutral-950 via-neutral-950/40 to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-neutral-950 via-neutral-950/40 to-transparent" />
            <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1 pr-2">
              {FLASH_TASK_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategoryId(cat.id)}
                  className={cn(
                    "whitespace-nowrap rounded-full border px-3 py-1 text-xs md:text-[13px] transition-colors",
                    cat.id === activeCategoryId
                      ? "border-pink-500 bg-pink-500/20 text-pink-100"
                      : "border-neutral-700 bg-neutral-900/80 text-gray-300 hover:border-pink-500/60 hover:text-pink-100"
                  )}
                >
                  <span className="mr-1">{cat.emoji}</span>
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Templates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[260px] overflow-y-auto pr-1 no-scrollbar">
            {activeCategory.templates.map((t) => {
              const dur = secondsToDuration(t.deadline);
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => onApplyTemplate(t, activeCategory)}
                  className="group relative flex flex-col items-start rounded-lg border border-neutral-800 bg-neutral-900/90 px-3 py-2 text-left hover:border-pink-500/80 hover:bg-neutral-900 transition-all"
                >
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-pink-500/10 via-transparent to-fuchsia-500/10 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity" />
                  <p className="relative text-[11px] font-semibold text-pink-300 mb-0.5">
                    {activeCategory.emoji} {activeCategory.name}
                  </p>
                  <p className="relative text-sm font-semibold text-white mb-0.5 line-clamp-1">
                    {t.title}
                  </p>
                  <p className="relative text-[11px] text-gray-400 mb-1 line-clamp-2">
                    {t.description}
                  </p>
                  <div className="relative flex items-center justify-between w-full text-[10px] text-gray-400">
                    <span>
                      ⏱ {dur.value} {dur.type === "hours" ? "hr" : "day"}
                      {dur.value !== 1 ? "s" : ""}
                    </span>
                    <span className="text-[10px] text-amber-300">{t.failureRate}</span>
                    <span className="ml-auto text-[10px] text-pink-300">Tap to paste</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- Premium success modal ----------

type DareSuccessModalProps = {
  open: boolean;
  onClose: () => void;
  txHash?: string;
};

function DareSuccessModal({ open, onClose, txHash }: DareSuccessModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative w-full max-w-sm rounded-3xl border border-pink-500/40 bg-gradient-to-b from-neutral-950 via-neutral-950 to-black shadow-[0_0_80px_rgba(236,72,153,0.45)] px-5 py-6"
            initial={{ scale: 0.85, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 10 }}
            transition={{ type: "spring", stiffness: 210, damping: 20 }}
          >
            <button
              onClick={onClose}
              className="absolute right-3 top-3 rounded-full bg-black/60 p-1 text-gray-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-pink-500/15 relative">
              <div className="absolute inset-0 rounded-full bg-pink-500/40 blur-xl opacity-60" />
              <motion.div
                className="relative flex h-12 w-12 items-center justify-center rounded-full bg-black"
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.05 }}
              >
                <CheckCircle2 className="h-7 w-7 text-pink-400" />
              </motion.div>
            </div>

            <div className="text-center space-y-2">
              <p className="text-xs uppercase tracking-[0.2em] text-pink-400 flex items-center justify-center gap-1">
                <Zap className="h-3 w-3" />
                Dare created
              </p>
              <h2 className="text-xl font-semibold text-white">You’re officially live</h2>
              <p className="text-sm text-gray-300">
                Your dare is on‑chain on Base Sepolia. Share it or wait for someone to
                match your stake.
              </p>
            </div>

            {txHash && (
              <a
                href={`https://sepolia.basescan.org/tx/${txHash}`}
                target="_blank"
                rel="noreferrer"
                className="mt-4 block rounded-xl border border-neutral-800 bg-neutral-900/80 px-3 py-2 text-xs text-gray-400 hover:border-pink-500/60 hover:text-pink-100 transition-colors"
              >
                View transaction on BaseScan
              </a>
            )}

            <div className="mt-5 flex items-center gap-2">
              <Button
                className="flex-1 h-10 bg-pink-500 text-white hover:bg-pink-500/90 text-sm"
                onClick={onClose}
              >
                Back to feed
              </Button>
              <Button
                variant="outline"
                className="h-10 border-neutral-700 bg-neutral-950 text-xs text-gray-200 hover:border-pink-500/60"
                onClick={onClose}
              >
                Stay here
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ---------- CreateDareForm ----------

export function CreateDareForm() {
  const { isConnected, address, writeContract, approveToken, getAllowance, connect } = useWeb3();
  const router = useRouter();

  const [description, setDescription] = useState("");
  const [durationValue, setDurationValue] = useState(3);
  const [durationType, setDurationType] = useState<"hours" | "days">("days");
  const [token, setToken] = useState(ZERO_ADDRESS);
  const [stake, setStake] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [showSuccess, setShowSuccess] = useState(false);
  const [successTxHash, setSuccessTxHash] = useState<string | undefined>(undefined);

  const durationSeconds =
    durationType === "hours" ? durationValue * 3600 : durationValue * 86400;
  const isETH = token === ZERO_ADDRESS;

  // remove TOKEN2 / TOKEN3 from list
  const filteredTokens = ALLOWED_TOKENS.filter(
    (t) => !["TKN2", "TOKEN2", "TKN3", "TOKEN3"].includes(t.symbol)
  );

  function symbolToDisplayName(symbol: string) {
    if (symbol === "USDC9CIRCLE0" || symbol === "USDC_CIRCLE") return "USDC";
    if (symbol === "TKN1" || symbol === "TOKEN1") return "JESSE";
    if (symbol === "TKN4" || symbol === "TOKEN4") return "AERO";
    if (symbol === "TKN5" || symbol === "TOKEN5") return "ZORA";
    if (symbol === "ETH") return "ETH";
    return symbol;
  }

  function symbolToIcon(symbol: string) {
    const display = symbolToDisplayName(symbol).toLowerCase(); // eth, usdc, jesse, aero, zora
    return `/images/${display}.png`;
  }

  function getTokenLabel() {
    const t = filteredTokens.find((tok) => tok.address === token);
    if (!t) return "???";
    return symbolToDisplayName(t.symbol);
  }

  const handleApplyFlashTemplate = (template: FlashTaskTemplate, category: FlashTaskCategory) => {
    const dur = secondsToDuration(template.deadline);
    setDescription(
      `${template.title}\n\n${template.description}\n\nProof: ${template.proofType}`
    );
    setDurationType(dur.type);
    setDurationValue(dur.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isConnected || !address) {
      connect();
      return;
    }

    if (!description.trim()) {
      setError("Description is required");
      return;
    }

    if (!stake || parseFloat(stake) <= 0) {
      setError("Stake must be greater than 0");
      return;
    }

    const stakeWei = parseEther(stake);
    if (stakeWei < parseEther("0.0001")) {
      setError("Minimum stake is 0.0001");
      return;
    }

    setIsSubmitting(true);
    try {
      if (!isETH) {
        const allowance = await getAllowance(token as Address, address);
        if (allowance < stakeWei) {
          await approveToken(token as Address, stakeWei);
          await new Promise((resolve) => setTimeout(resolve, 3000));
        }
      }

      const txHash = await writeContract(
        "createDare",
        [description, BigInt(durationSeconds), token, stakeWei],
        isETH ? stakeWei : undefined
      );

      setSuccessTxHash(typeof txHash === "string" ? txHash : undefined);
      setShowSuccess(true);

      // optional: reset form
      setDescription("");
      setStake("");
      setDurationType("days");
      setDurationValue(3);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Transaction failed";
      if (message.includes("Wait 30m")) {
        setError("Please wait 30 minutes between creating dares");
      } else if (message.includes("Max active")) {
        setError("You have reached your maximum active dares limit");
      } else {
        setError(message.slice(0, 200));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-7 bg-neutral-950 rounded-xl border border-neutral-800 p-6 md:p-8"
      >
        {/* Flash Task inline tab section (top, no page shift) */}
        <FlashTaskBar onApplyTemplate={handleApplyFlashTemplate} />

        {/* Description */}
        <div className="flex flex-col gap-2.5">
          <Label htmlFor="description" className="text-sm font-semibold text-white">
            Dare Description
          </Label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your dare clearly and make it memorable..."
            className="min-h-[120px] w-full rounded-lg border border-neutral-800 bg-neutral-900 px-4 py-3 text-base text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/60 focus:border-primary resize-none transition-colors"
            maxLength={500}
          />
          <span className="text-xs text-gray-400 text-right">{description.length}/500</span>
        </div>

        {/* Duration */}
        <div className="flex flex-col gap-4">
          <Label className="text-sm font-medium text-white">
            Duration:{" "}
            <span className="text-primary font-semibold">
              {durationValue} {durationType === "hours" ? "hour" : "day"}
              {durationValue !== 1 ? "s" : ""}
            </span>
          </Label>

          {/* Duration Type Toggle */}
          <div className="flex gap-2 bg-neutral-900 rounded-lg p-1 border border-neutral-800">
            <button
              type="button"
              onClick={() => {
                setDurationType("hours");
                setDurationValue(1);
              }}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                durationType === "hours"
                  ? "bg-primary text-primary-foreground"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Hours
            </button>
            <button
              type="button"
              onClick={() => {
                setDurationType("days");
                setDurationValue(1);
              }}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                durationType === "days"
                  ? "bg-primary text-primary-foreground"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Days
            </button>
          </div>

          {/* Duration Slider */}
          <Slider
            value={[durationValue]}
            onValueChange={(v) => setDurationValue(v[0])}
            min={durationType === "hours" ? 1 : 1}
            max={durationType === "hours" ? 168 : 7}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-400">
            <span>{durationType === "hours" ? "1 hour" : "1 day"}</span>
            <span>{durationType === "hours" ? "168 hours (7 days)" : "7 days"}</span>
          </div>
        </div>

        {/* Token Selection */}
        <div className="flex flex-col gap-2.5">
          <Label className="text-sm font-semibold text-white">Stake Token</Label>
          <Select
            value={token}
            onValueChange={(val) => {
              setToken(val);
            }}
          >
            <SelectTrigger className="w-full bg-neutral-900 border-neutral-800 text-white rounded-lg h-11 focus:ring-primary/60">
              <SelectValue>
                {(() => {
                  const t =
                    filteredTokens.find((tok) => tok.address === token) ?? filteredTokens[0];
                  const display = symbolToDisplayName(t.symbol);
                  return (
                    <span className="flex items-center gap-2">
                      <div className="h-5 w-5 rounded-full overflow-hidden bg-neutral-900 flex-shrink-0">
                        <Image
                          src={symbolToIcon(t.symbol)}
                          alt={display}
                          width={20}
                          height={20}
                          className="h-full w-full object-contain"
                        />
                      </div>
                      <span>{display}</span>
                    </span>
                  );
                })()}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-neutral-950 border-neutral-800 rounded-lg">
              {filteredTokens.map((t) => {
                const display = symbolToDisplayName(t.symbol);
                return (
                  <SelectItem key={t.address} value={t.address} className="text-white">
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-5 rounded-full overflow-hidden bg-neutral-900 flex-shrink-0">
                        <Image
                          src={symbolToIcon(t.symbol)}
                          alt={display}
                          width={20}
                          height={20}
                          className="h-full w-full object-contain"
                        />
                      </div>
                      <span>{display}</span>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        {/* Stake Amount */}
        <div className="flex flex-col gap-2.5">
          <Label htmlFor="stake" className="text-sm font-semibold text-white">
            Stake Amount
          </Label>
          <div className="relative">
            <Coins className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
            <Input
              id="stake"
              type="number"
              step="any"
              min="0.0001"
              value={stake}
              onChange={(e) => setStake(e.target.value)}
              placeholder="Enter amount"
              className="pl-11 bg-neutral-900 border-neutral-800 text-white text-base rounded-lg h-11 focus:ring-primary/60 transition-colors"
            />
          </div>
          <p className="text-xs text-gray-400">
            Minimum: 0.0001 {getTokenLabel()} — Your opponent matches your stake, total pot = 2x
          </p>
        </div>

        {/* Fee info */}
        {stake && parseFloat(stake) > 0 && (
          <div className="rounded-lg bg-gradient-to-r from-primary/15 to-sky-500/10 border border-primary/30 p-4 text-sm">
            <div className="space-y-2.5">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Your stake</span>
                <span className="text-white font-semibold font-mono">
                  {stake} {getTokenLabel()}
                </span>
              </div>
              <div className="h-px bg-neutral-800" />
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Total pot (with opponent)</span>
                <span className="text-white font-semibold font-mono">
                  {(parseFloat(stake) * 2).toFixed(6)} {getTokenLabel()}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs text-gray-400">
                <span>Platform fee (3%)</span>
                <span className="font-mono">
                  {(parseFloat(stake) * 2 * 0.03).toFixed(6)} {getTokenLabel()}
                </span>
              </div>
              <div className="h-px bg-neutral-800" />
              <div className="flex justify-between items-center">
                <span className="text-emerald-400 font-medium">Winner receives</span>
                <span className="text-emerald-400 font-semibold font-mono">
                  {(parseFloat(stake) * 2 * 0.97).toFixed(6)} {getTokenLabel()}
                </span>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-start gap-2 rounded-lg bg-red-500/10 border border-red-500/40 p-3 text-sm text-red-400">
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <Button
          type="submit"
          disabled={isSubmitting || !isConnected}
          className="w-full h-12 md:h-13 bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95 text-base md:text-lg font-semibold rounded-lg transition-all shadow-lg shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Creating Dare...
            </>
          ) : !isConnected ? (
            "Connect Wallet First"
          ) : (
            "Create Dare"
          )}
        </Button>
      </form>

      <DareSuccessModal
        open={showSuccess}
        onClose={() => {
          setShowSuccess(false);
          router.push("/");
        }}
        txHash={successTxHash}
      />
    </>
  );
}
