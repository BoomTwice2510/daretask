"use client";

import Link from "next/link";
import Image from "next/image";
import type { DareData } from "@/lib/types";
import { shortenAddress, formatStake, getStatusLabel, timeRemaining, timeAgo } from "@/lib/helpers";
import { ZERO_ADDRESS, ALLOWED_TOKENS } from "@/lib/contract";
import { ArrowRight, Clock, Share2, User } from "lucide-react";

function tokenMeta(address: string) {
  if (address === ZERO_ADDRESS || address === "0x0000000000000000000000000000000000000000") return { symbol:"ETH", icon:"/images/eth.png" };
  const token = ALLOWED_TOKENS.find((item) => item.address.toLowerCase() === address.toLowerCase());
  const symbol = token?.symbol === "USDC" ? "USDC" : token?.symbol || "ETH";
  return { symbol, icon:`/images/${symbol.toLowerCase()}.png` };
}

export function DareCard({ dare }: { dare: DareData }) {
  const meta = tokenMeta(dare.token);
  const open = dare.status === 0 || dare.status === 1;
  const url = typeof window === "undefined" ? "https://dareprotocol.com" : window.location.origin;
  const share = (network: "x" | "whatsapp" | "farcaster") => {
    const link = `${url}/dare/${dare.id}`;
    const text = `On-chain dare: ${dare.description.slice(0, 120)}`;
    const target = network === "x" ? `https://twitter.com/intent/tweet?${new URLSearchParams({text,url:link})}` : network === "whatsapp" ? `https://wa.me/?${new URLSearchParams({text:`${text} ${link}`})}` : `https://warpcast.com/~/compose?${new URLSearchParams({text:`${text} ${link}`})}`;
    window.open(target, "_blank", "noopener,noreferrer");
  };
  return <article className="dare-feed-card">
    <Link href={`/dare/${dare.id}`}>
      <div className="dare-feed-card-top"><span className="dare-feed-status">{getStatusLabel(dare.status)}</span><span className="dare-feed-time"><Clock size={11} className="inline mr-1" />{open ? timeRemaining(dare.deadline) : timeAgo(dare.createdAt)}</span></div>
      <div className="dare-feed-title">{dare.description}</div>
      <div className="dare-feed-stake"><span className="font-semibold">◉ {formatStake(dare.stake)} {meta.symbol}</span>{dare.status === 0 && <span>Pool: {formatStake(dare.stake * 2n)} {meta.symbol}</span>}</div>
      <div className="dare-feed-bottom"><span><User size={11} className="inline mr-1" />{shortenAddress(dare.creator)}</span><span>{dare.accepter !== ZERO_ADDRESS && dare.accepter !== "0x0000000000000000000000000000000000000000" ? `vs ${shortenAddress(dare.accepter)}` : "Open to accept"}<ArrowRight size={12} className="inline ml-2" /></span></div>
    </Link>
    <div className="dare-feed-bottom" style={{borderTop:"1px solid #e7edf3", paddingTop:8}}><span><Share2 size={11} className="inline mr-1" />Share dare</span><span className="dare-feed-share"><button onClick={() => share("x")}><Image src="/icons/x.svg" alt="X" width={12} height={12}/></button><button onClick={() => share("whatsapp")}><Image src="/icons/whatsapp.svg" alt="WhatsApp" width={12} height={12}/></button><button onClick={() => share("farcaster")}><Image src="/icons/farcaster.svg" alt="Farcaster" width={12} height={12}/></button></span></div>
  </article>;
}
