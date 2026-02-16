"use client";

import Link from "next/link";
import Image from "next/image";
import type { DareData } from "@/lib/types";
import {
  shortenAddress,
  formatStake,
  getStatusLabel,
  getStatusColor,
  timeRemaining,
  timeAgo,
} from "@/lib/helpers";
import { ZERO_ADDRESS, ALLOWED_TOKENS } from "@/lib/contract";
import { Clock, User, ArrowRight, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface DareCardProps {
  dare: DareData;
}

function symbolToDisplayName(symbol: string) {
  if (symbol === "USDC9CIRCLE0" || symbol === "USDC_CIRCLE") return "USDC";
  if (symbol === "TKN1" || symbol === "TOKEN1") return "JESSE";
  if (symbol === "TKN4" || symbol === "TOKEN4") return "AERO";
  if (symbol === "TKN5" || symbol === "TOKEN5") return "ZORA";
  if (symbol === "ETH") return "ETH";
  return symbol;
}

function tokenMetaFromAddress(tokenAddress: string) {
  if (
    tokenAddress === ZERO_ADDRESS ||
    tokenAddress === "0x0000000000000000000000000000000000000000"
  ) {
    return { symbol: "ETH", icon: "/images/eth.png" };
  }

  const meta = ALLOWED_TOKENS.find(
    (t) => t.address.toLowerCase() === tokenAddress.toLowerCase()
  );
  if (!meta) {
    return { symbol: "???", icon: "/images/eth.png" };
  }
  const display = symbolToDisplayName(meta.symbol);
  return {
    symbol: display,
    icon: `/images/${display.toLowerCase()}.png`,
  };
}

function getBaseUrl() {
  if (typeof window === "undefined") return "https://dare-protocol.xyz";
  return window.location.origin;
}

export function DareCard({ dare }: DareCardProps) {
  const isOpen = dare.status === 0;
  const isRunning = dare.status === 1;
  const statusColor = getStatusColor(dare.status);
  const statusLabel = getStatusLabel(dare.status);
  const stakeFormatted = formatStake(dare.stake);
  const tokenMeta = tokenMetaFromAddress(dare.token);

  function handleShare(network: "x" | "whatsapp" | "farcaster") {
    const baseUrl = getBaseUrl();
    const url = `${baseUrl}/dare/${dare.id}`;
    const text = `On-chain dare on Dare Protocol: "${dare.description.slice(0, 140)}"`;

    let shareUrl = "";
    if (network === "x") {
      const params = new URLSearchParams({ text, url });
      shareUrl = `https://twitter.com/intent/tweet?${params.toString()}`;
    } else if (network === "whatsapp") {
      const params = new URLSearchParams({ text: `${text} ${url}` });
      shareUrl = `https://wa.me/?${params.toString()}`;
    } else if (network === "farcaster") {
      const params = new URLSearchParams({ text: `${text} ${url}` });
      shareUrl = `https://warpcast.com/~/compose?${params.toString()}`;
    }

    if (typeof window !== "undefined") {
      window.open(shareUrl, "_blank", "noopener,noreferrer");
    }
  }

  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 transition-all duration-200 hover:border-primary/60 hover:bg-neutral-900">
      <Link href={`/dare/${dare.id}`} className="block group">
        {/* Status + Time row */}
        <div className="flex items-center justify-between mb-3">
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
              statusColor
            )}
          >
            {statusLabel}
          </span>
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <Clock className="h-3 w-3" />
            {isOpen || isRunning ? timeRemaining(dare.deadline) : timeAgo(dare.createdAt)}
          </span>
        </div>

        {/* Description */}
        <p className="text-sm font-medium text-white mb-3 line-clamp-2 leading-relaxed">
          {dare.description}
        </p>

        {/* Stake */}
        <div className="flex items-center gap-2 mb-3 rounded-lg bg-neutral-900 px-3 py-2">
          <div className="h-5 w-5 rounded-full overflow-hidden bg-neutral-950 flex-shrink-0">
            <Image
              src={tokenMeta.icon}
              alt={tokenMeta.symbol}
              width={20}
              height={20}
              className="h-full w-full object-contain"
            />
          </div>
          <span className="font-mono text-sm font-semibold text-white">
            {stakeFormatted} {tokenMeta.symbol}
          </span>
          {isOpen && (
            <span className="ml-auto text-xs text-gray-400">
              Total pot: {formatStake(dare.stake * 2n)} {tokenMeta.symbol}
            </span>
          )}
        </div>

        {/* Creator / Accepter */}
        <div className="flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-1">
            <User className="h-3 w-3" />
            <span>{shortenAddress(dare.creator)}</span>
          </div>
          {dare.accepter !== ZERO_ADDRESS &&
            dare.accepter !== "0x0000000000000000000000000000000000000000" && (
              <div className="flex items-center gap-1">
                <span>vs</span>
                <span>{shortenAddress(dare.accepter)}</span>
              </div>
            )}
          <ArrowRight className="h-3.5 w-3.5 text-gray-500 group-hover:text-primary transition-colors" />
        </div>
      </Link>

      {/* Share row */}
      <div className="mt-3 pt-2 border-t border-neutral-800 flex items-center justify-between">
        <span className="text-[11px] text-gray-500 flex items-center gap-1">
          <Share2 className="h-3 w-3" />
          Share dare
        </span>
        <div className="flex items-center gap-2">
          {/* X */}
          <button
            type="button"
            onClick={() => handleShare("x")}
            className="h-7 w-7 rounded-full border border-neutral-700 bg-neutral-950 flex items-center justify-center hover:border-pink-500/70 transition-colors"
            aria-label="Share to X"
          >
            <Image
              src="/icons/x.svg"
              alt="X"
              width={14}
              height={14}
              className="h-3.5 w-3.5"
            />
          </button>
          {/* WhatsApp */}
          <button
            type="button"
            onClick={() => handleShare("whatsapp")}
            className="h-7 w-7 rounded-full border border-neutral-700 bg-neutral-950 flex items-center justify-center hover:border-emerald-500/80 transition-colors"
            aria-label="Share to WhatsApp"
          >
            <Image
              src="/icons/whatsapp.svg"
              alt="WhatsApp"
              width={14}
              height={14}
              className="h-3.5 w-3.5"
            />
          </button>
          {/* Farcaster */}
          <button
            type="button"
            onClick={() => handleShare("farcaster")}
            className="h-7 w-7 rounded-full border border-neutral-700 bg-neutral-950 flex items-center justify-center hover:border-violet-500/80 transition-colors"
            aria-label="Share to Farcaster"
          >
            <Image
              src="/icons/farcaster.svg"
              alt="Farcaster"
              width={14}
              height={14}
              className="h-3.5 w-3.5"
            />
          </button>
        </div>
      </div>
    </div>
  );
}
