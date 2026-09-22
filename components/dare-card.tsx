"use client";

import Link from "next/link";
import Image from "next/image";
import type { DareData } from "@/lib/types";
import { shortenAddress, formatStake, getStatusLabel, timeRemaining, timeAgo } from "@/lib/helpers";
import { ZERO_ADDRESS, ALLOWED_TOKENS } from "@/lib/contract";
import { ArrowRight, Clock, Share2, UserRound, Sparkles, Flame, ShieldCheck } from "lucide-react";

function tokenMeta(address: string) {
  if (address === ZERO_ADDRESS || address === "0x0000000000000000000000000000000000000000") return { symbol: "ETH", icon: "/images/eth.png" };
  const token = ALLOWED_TOKENS.find((item) => item.address.toLowerCase() === address.toLowerCase());
  const symbol = token?.symbol === "USDC" ? "USDC" : token?.symbol || "ETH";
  return { symbol, icon: `/images/${symbol.toLowerCase()}.png` };
}

export function DareCard({ dare }: { dare: DareData }) {
  const meta = tokenMeta(dare.token);
  const open = dare.status === 0 || dare.status === 1;
  const url = typeof window === "undefined" ? "https://dareprotocol.com" : window.location.origin;

  const share = (network: "x" | "whatsapp" | "farcaster") => {
    const link = `${url}/dare/${dare.id}`;
    const text = `On-chain dare: ${dare.description.slice(0, 120)}`;
    const target = network === "x"
      ? `https://twitter.com/intent/tweet?${new URLSearchParams({ text, url: link })}`
      : network === "whatsapp"
        ? `https://wa.me/?${new URLSearchParams({ text: `${text}${link}` })}`
        : `https://warpcast.com/~/compose?${new URLSearchParams({ text: `${text}${link}` })}`;
    window.open(target, "_blank", "noopener,noreferrer");
  };

  const isCompleted = dare.status === 2 || dare.status === 3;

  return (
    <article className="glass-card-interactive group relative flex flex-col overflow-hidden max-md:rounded-2xl rounded-[24px] transition-all duration-300">
      
      {/* Top Ambient Highlight Gradient Wash on Hover */}
      <div className="pointer-events-none max-md:hidden absolute -top-16 -right-16 h-32 w-32 rounded-full bg-blue-100/30 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <Link href={`/dare/${dare.id}`} className="block max-md:p-4 p-5 sm:p-5.5">
        
        {/* Status Pill & Live Time Counter */}
        <div className="flex items-center justify-between gap-2">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10.5px] font-black tracking-wide border shadow-xs ${
              dare.status === 0
                ? "bg-emerald-50/90 text-emerald-700 border-emerald-200/80"
                : isCompleted
                ? "bg-blue-50/90 text-[#0052FF] border-blue-200/80"
                : "bg-slate-50/90 text-slate-600 border-slate-200/70"
            }`}
          >
            {dare.status === 0 && (
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
            )}
            {getStatusLabel(dare.status)}
          </span>

          <span className="inline-flex items-center text-[11.5px] font-semibold text-slate-400">
            <Clock className="mr-1.5 h-3.5 w-3.5 text-slate-300 group-hover:text-[#0052FF] transition-colors" />
            {open ? timeRemaining(dare.deadline) : timeAgo(dare.createdAt)}
          </span>
        </div>

        {/* Dare Description with Soothing Dark Contrast */}
        <h2 className="mt-3.5 line-clamp-2 text-base font-black leading-snug text-slate-900 group-hover:text-[#0052FF] transition-colors">
          {dare.description}
        </h2>

        {/* Staking & Pool Module with Micro-Glass Depth */}
        <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-slate-100/90 bg-gradient-to-r from-slate-50/80 via-white to-slate-50/60 p-3.5 shadow-xs">
          <div>
            <span className="block text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-400">
              Stake each side
            </span>
            <div className="mt-1 flex items-center gap-2 font-mono text-sm sm:text-base font-black text-slate-900">
              <div className="flex h-5 w-5 items-center justify-center rounded-lg bg-white p-0.5 shadow-xs border border-slate-100">
                <Image src={meta.icon} alt={meta.symbol} width={18} height={18} className="h-4 w-4 object-contain" />
              </div>
              <span>{formatStake(dare.stake)} {meta.symbol}</span>
            </div>
          </div>

          {dare.status === 0 && (
            <div className="text-right">
              <span className="block text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-400">
                Matched pool
              </span>
              <div className="mt-1 font-mono text-sm sm:text-base font-black text-[#0052FF]">
                {formatStake(dare.stake * 2n)} {meta.symbol}
              </div>
            </div>
          )}
        </div>

        {/* Challenger vs Creator Module with Layered Glass Avatars */}
        <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
          <span className="inline-flex items-center gap-2 font-semibold text-slate-700">
            <div className="flex h-6 w-6 items-center justify-center rounded-xl bg-blue-50/90 border border-blue-200/70 text-[#0052FF] shadow-xs">
              <UserRound className="h-3.5 w-3.5 stroke-[2.2]" />
            </div>
            {shortenAddress(dare.creator)}
          </span>

          <span className="inline-flex items-center gap-1.5 font-black text-[#0052FF]">
            {dare.accepter !== ZERO_ADDRESS && dare.accepter !== "0x0000000000000000000000000000000000000000" ? (
              <span className="inline-flex items-center gap-1.5 text-slate-700">
                <div className="flex h-6 w-6 items-center justify-center rounded-xl bg-emerald-50/90 border border-emerald-200/70 text-emerald-600 shadow-xs">
                  <ShieldCheck className="h-3.5 w-3.5 stroke-[2.2]" />
                </div>
                vs {shortenAddress(dare.accepter)}
              </span>
            ) : (
              <span>Open to accept</span>
            )}
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </span>
        </div>
      </Link>

      {/* Share Actions Strip */}
      <div className="mt-auto flex items-center justify-between border-t border-slate-100/90 bg-slate-50/40 px-5 py-3 text-xs text-slate-400">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
          <Share2 className="h-3.5 w-3.5 text-slate-400" />
          Share challenge
        </span>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            aria-label="Share on X"
            onClick={() => share("x")}
            className="flex h-7 w-7 items-center justify-center rounded-xl border border-slate-200/70 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-900 hover:scale-110 active:scale-90 transition-all shadow-xs cursor-pointer"
          >
            <Image src="/icons/x.svg" alt="X" width={12} height={12} />
          </button>
          <button
            type="button"
            aria-label="Share on WhatsApp"
            onClick={() => share("whatsapp")}
            className="flex h-7 w-7 items-center justify-center rounded-xl border border-slate-200/70 bg-white text-slate-500 hover:bg-emerald-50 hover:text-emerald-600 hover:scale-110 active:scale-90 transition-all shadow-xs cursor-pointer"
          >
            <Image src="/icons/whatsapp.svg" alt="WhatsApp" width={12} height={12} />
          </button>
          <button
            type="button"
            aria-label="Share on Farcaster"
            onClick={() => share("farcaster")}
            className="flex h-7 w-7 items-center justify-center rounded-xl border border-slate-200/70 bg-white text-slate-500 hover:bg-purple-50 hover:text-purple-600 hover:scale-110 active:scale-90 transition-all shadow-xs cursor-pointer"
          >
            <Image src="/icons/farcaster.svg" alt="Farcaster" width={12} height={12} />
          </button>
        </div>
      </div>
    </article>
  );
}