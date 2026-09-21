"use client";

import type { Address } from "viem";

type AvatarSize = "sm" | "md" | "lg";

function makePattern(address: Address) {
  const hex = address.slice(2).toLowerCase();
  const cells: boolean[] = [];

  for (let i = 0; i < 15; i++) {
    const value = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
    cells.push((value & 1) === 1);
  }

  return cells;
}

export function UserAvatar({
  address,
  size = "md",
  className = "",
}: {
  address: Address | null;
  size?: AvatarSize;
  className?: string;
}) {
  const sizes = {
    sm: "h-9 w-9",
    md: "h-14 w-14",
    lg: "h-24 w-24",
  };

  if (!address) {
    return (
      <div
        className={`${sizes[size]} rounded-full bg-slate-100 ring-1 ring-slate-200 ${className}`}
      />
    );
  }

  const pattern = makePattern(address);

  return (
    <div
      className={`${sizes[size]} overflow-hidden rounded-full bg-[#eef4ff] ring-4 ring-white shadow-lg shadow-blue-100 ${className}`}
      aria-label={`Avatar for ${address}`}
    >
      <svg viewBox="0 0 5 5" className="h-full w-full" role="img" aria-hidden="true">
        <rect width="5" height="5" fill="#eef4ff" />
        {pattern.map((active, index) => {
          if (!active) return null;
          const row = Math.floor(index / 3);
          const col = index % 3;
          return (
            <g key={index}>
              <rect x={col} y={row + 1} width="1" height="1" fill="#0f3b82" />
              <rect x={4 - col} y={row + 1} width="1" height="1" fill="#0f3b82" />
            </g>
          );
        })}
        <circle cx="2.5" cy="2.5" r="0.42" fill="#2563eb" />
      </svg>
    </div>
  );
}
