"use client";

import { Avatar } from "@coinbase/onchainkit/identity";
import { base } from "viem/chains";
import type { Address } from "viem";

type Props = {
  address: Address | null;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizeMap = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-12 w-12",
};

export function UserAvatar({ address, size = "md", className = "" }: Props) {
  if (!address) {
    // wallet disconnected – placeholder
    return (
      <div
        className={`${sizeMap[size]} rounded-full bg-white/5 border border-white/10 ${className}`}
      />
    );
  }

  return (
    <Avatar
      address={address}
      chain={base}
      className={`${sizeMap[size]} rounded-full ${className}`}
    />
  );
}
