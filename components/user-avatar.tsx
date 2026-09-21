"use client";
import { Avatar } from "@coinbase/onchainkit/identity";
import { base } from "viem/chains";
import type { Address } from "viem";
export function UserAvatar({ address, size="md", className="" }: { address: Address|null; size?:"sm"|"md"|"lg"; className?:string }) {
  const sizes={sm:"h-9 w-9",md:"h-14 w-14",lg:"h-24 w-24"};
  if(!address) return <div className={`${sizes[size]} rounded-full bg-slate-100 ring-1 ring-slate-200 ${className}`} />;
  return <div className={`${sizes[size]} overflow-hidden rounded-full bg-[#eef4ff] ring-4 ring-white shadow-lg shadow-blue-100 ${className}`}><Avatar address={address} chain={base} className="h-full w-full" /></div>;
}
