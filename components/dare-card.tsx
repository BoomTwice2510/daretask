"use client";

import type React from "react";
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
    const text = `On-chain dare on Dare Protocol: "${dare.description.slice(
      0,
      140
    )}"`;

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
    <div
      className="group rounded-2xl border border-[rgba(212,175,55,0.36)] bg-[rgba(5,5,5,0.96)] p-5 md:p-6 shadow-[0_18px_40px_rgba(0,0,0,0.85)] transition-all duration-300 space-y-3 hover:-translate-y-[2px] hover:shadow-[0_24px_70px_rgba(0,0,0,0.95)]"
    >
      <Link href={`/dare/${dare.id}`} className="block space-y-3">
        {/* Status + Time row */}
        <div className="flex items-center justify-between">
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold border border-white/10 bg-black/70",
              statusColor
            )}
          >
            {statusLabel}
          </span>
          <span className="flex items-center gap-1 text-xs text-white/70">
            <Clock className="h-3 w-3 text-[#f5d566]" />
            {isOpen || isRunning
              ? timeRemaining(dare.deadline)
              : timeAgo(dare.createdAt)}
          </span>
        </div>

        {/* Description */}
        <p className="text-sm md:text-[15px] font-medium text-white mb-1 line-clamp-2 leading-relaxed">
          {dare.description}
        </p>

        {/* Stake */}
        <div className="flex items-center gap-2 mb-1 rounded-xl px-3 py-2 bg-[rgba(10,10,10,0.9)] border border-white/10">
          <div className="relative h-6 w-6 rounded-full overflow-hidden bg-black flex-shrink-0">
            <span className="absolute inset-0 rounded-full bg-[rgba(245,213,102,0.18)] blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
            <Image
              src={tokenMeta.icon}
              alt={tokenMeta.symbol}
              width={24}
              height={24}
              className="relative h-full w-full object-contain"
            />
          </div>
          <span className="font-mono text-sm font-semibold text-[#f5f5f5]">
            {stakeFormatted} {tokenMeta.symbol}
          </span>
          {isOpen && (
            <span className="ml-auto text-[11px] text-white/60">
              Pool:{" "}
              <span className="font-mono text-[#f5d566]">
                {formatStake(dare.stake * 2n)} {tokenMeta.symbol}
              </span>
            </span>
          )}
        </div>

        {/* Creator / Accepter */}
        <div className="flex items-center justify-between text-xs text-white/70">
          <div className="flex items-center gap-1.5">
            <User className="h-3.5 w-3.5 text-white/60" />
            <span className="font-mono text-[11px]">
              {shortenAddress(dare.creator)}
            </span>
          </div>
          {dare.accepter !== ZERO_ADDRESS &&
            dare.accepter !==
              "0x0000000000000000000000000000000000000000" && (
              <div className="flex items-center gap-1.5">
                <span className="text-white/50">vs</span>
                <span className="font-mono text-[11px]">
                  {shortenAddress(dare.accepter)}
                </span>
              </div>
            )}
          <ArrowRight className="h-3.5 w-3.5 text-white/40 group-hover:text-[#f5d566] transition-colors" />
        </div>
      </Link>

      {/* Share row */}
      <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between">
        <span className="text-[11px] text-white/60 flex items-center gap-1">
          <Share2 className="h-3 w-3 text-[#f5d566]" />
          Share dare
        </span>
        <div className="flex items-center gap-2">
          {/* X */}
          <button
            type="button"
            onClick={() => handleShare("x")}
            className="h-7 w-7 rounded-full border border-white/15 bg-black flex items-center justify-center hover:border-[#f5d566]/80 transition-colors"
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
            className="h-7 w-7 rounded-full border border-white/15 bg-black flex items-center justify-center hover:border-emerald-400/80 transition-colors"
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
            className="h-7 w-7 rounded-full border border-white/15 bg-black flex items-center justify-center hover:border-violet-400/80 transition-colors"
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
