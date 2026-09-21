"use client";

import Link from "next/link";
import Image from "next/image";
import type { DareData } from "@/lib/types";
import { shortenAddress, formatStake, getStatusLabel, timeRemaining, timeAgo } from "@/lib/helpers";
import { ZERO_ADDRESS, ALLOWED_TOKENS } from "@/lib/contract";
import { ArrowRight, Clock, Share2, UserRound } from "lucide-react";

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
        ? `https://wa.me/?${new URLSearchParams({ text: `${text} ${link}` })}`
        : `https://warpcast.com/~/compose?${new URLSearchParams({ text: `${text} ${link}` })}`;
    window.open(target, "_blank", "noopener,noreferrer");
  };

  return (
    <article className="group overflow-hidden rounded-[22px] border border-[#dce5f1] bg-white shadow-[0_12px_32px_rgba(35,65,110,0.05)] transition hover:-translate-y-0.5 hover:border-[#bcd0eb] hover:shadow-[0_18px_45px_rgba(35,65,110,0.09)]">
      <Link href={`/dare/${dare.id}`} className="block p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <span className={`rounded-full border px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.1em] ${dare.status === 0 ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-[#dce5f1] bg-[#f7f9fc] text-[#61728c]"}`}>
            {getStatusLabel(dare.status)}
          </span>
          <span className="inline-flex items-center text-xs font-semibold text-[#8190a7]"><Clock className="mr-1 h-3.5 w-3.5" />{open ? timeRemaining(dare.deadline) : timeAgo(dare.createdAt)}</span>
        </div>

        <h2 className="mt-4 line-clamp-2 text-lg font-extrabold leading-7 text-[#10213f]">{dare.description}</h2>

        <div className="mt-5 flex items-center justify-between gap-3 rounded-2xl border border-[#e0e7f0] bg-[#f8fafd] px-4 py-3">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#8a99ae]">Stake each side</div>
            <div className="mt-1 flex items-center gap-2 text-base font-extrabold text-[#173154]"><Image src={meta.icon} alt="" width={18} height={18} />{formatStake(dare.stake)} {meta.symbol}</div>
          </div>
          {dare.status === 0 && <div className="text-right"><div className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#8a99ae]">Matched pool</div><div className="mt-1 text-sm font-bold text-[#1268f3]">{formatStake(dare.stake * 2n)} {meta.symbol}</div></div>}
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 text-xs text-[#71819a]">
          <span className="inline-flex items-center gap-1.5"><UserRound className="h-3.5 w-3.5" />{shortenAddress(dare.creator)}</span>
          <span className="inline-flex items-center gap-1 font-bold text-[#1268f3]">{dare.accepter !== ZERO_ADDRESS && dare.accepter !== "0x0000000000000000000000000000000000000000" ? `vs ${shortenAddress(dare.accepter)}` : "Open to accept"}<ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" /></span>
        </div>
      </Link>

      <div className="flex items-center justify-between border-t border-[#e7edf5] px-5 py-3 text-xs text-[#8190a7] sm:px-6">
        <span className="inline-flex items-center gap-1.5"><Share2 className="h-3.5 w-3.5" />Share dare</span>
        <span className="flex items-center gap-1.5">
          <button aria-label="Share on X" onClick={() => share("x")} className="rounded-lg p-1.5 hover:bg-[#f0f5fb]"><Image src="/icons/x.svg" alt="X" width={13} height={13} /></button>
          <button aria-label="Share on WhatsApp" onClick={() => share("whatsapp")} className="rounded-lg p-1.5 hover:bg-[#f0f5fb]"><Image src="/icons/whatsapp.svg" alt="WhatsApp" width={13} height={13} /></button>
          <button aria-label="Share on Farcaster" onClick={() => share("farcaster")} className="rounded-lg p-1.5 hover:bg-[#f0f5fb]"><Image src="/icons/farcaster.svg" alt="Farcaster" width={13} height={13} /></button>
        </span>
      </div>
    </article>
  );
}
