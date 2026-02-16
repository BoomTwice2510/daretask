import { ZERO_ADDRESS, TOKEN_MAP, STATUS_LABELS, BADGE_LABELS } from "./contract";
import { formatEther } from "viem";

export function shortenAddress(addr: string): string {
  if (!addr || addr.length < 10) return addr;
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export function getTokenSymbol(tokenAddress: string): string {
  const key = tokenAddress === ZERO_ADDRESS || tokenAddress === "0x0000000000000000000000000000000000000000"
    ? ZERO_ADDRESS
    : tokenAddress;
  return TOKEN_MAP[key]?.symbol || "???";
}

export function getTokenName(tokenAddress: string): string {
  const key = tokenAddress === ZERO_ADDRESS || tokenAddress === "0x0000000000000000000000000000000000000000"
    ? ZERO_ADDRESS
    : tokenAddress;
  return TOKEN_MAP[key]?.name || "Unknown Token";
}

export function formatStake(stake: bigint): string {
  const val = formatEther(stake);
  const num = parseFloat(val);
  if (num >= 1) return num.toFixed(4);
  if (num >= 0.01) return num.toFixed(6);
  return num.toFixed(8);
}

export function getStatusLabel(status: number): string {
  return STATUS_LABELS[status] || "Unknown";
}

export function getBadgeLabel(badge: number): string {
  return BADGE_LABELS[badge] || "None";
}

export function getStatusColor(status: number): string {
  switch (status) {
    case 0: return "bg-accent/20 text-accent";
    case 1: return "bg-primary/20 text-primary";
    case 2: return "bg-warning/20 text-warning";
    case 3: return "bg-destructive/20 text-destructive";
    case 4: return "bg-success/20 text-success";
    case 5: return "bg-muted text-muted-foreground";
    default: return "bg-muted text-muted-foreground";
  }
}

export function getBadgeColor(badge: number): string {
  switch (badge) {
    case 0: return "text-muted-foreground";
    case 1: return "text-emerald-400";
    case 2: return "text-blue-400";
    case 3: return "text-purple-400";
    case 4: return "text-orange-400";
    case 5: return "text-yellow-400";
    case 6: return "text-primary";
    case 7: return "text-accent";
    default: return "text-muted-foreground";
  }
}

export function timeRemaining(deadline: bigint): string {
  const now = BigInt(Math.floor(Date.now() / 1000));
  if (now >= deadline) return "Expired";
  const diff = Number(deadline - now);
  const days = Math.floor(diff / 86400);
  const hours = Math.floor((diff % 86400) / 3600);
  const mins = Math.floor((diff % 3600) / 60);
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${mins}m`;
  return `${mins}m`;
}

export function timeAgo(timestamp: bigint): string {
  const now = Math.floor(Date.now() / 1000);
  const diff = now - Number(timestamp);
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export function isDeadlinePassed(deadline: bigint): boolean {
  return BigInt(Math.floor(Date.now() / 1000)) > deadline;
}

export function isInProofWindow(deadline: bigint): boolean {
  const now = BigInt(Math.floor(Date.now() / 1000));
  const proofEnd = deadline + BigInt(86400); // 24h
  return now >= deadline && now <= proofEnd;
}

export function isInConfirmWindow(proofTime: bigint): boolean {
  if (proofTime === 0n) return false;
  const now = BigInt(Math.floor(Date.now() / 1000));
  const confirmEnd = proofTime + BigInt(86400); // 24h
  return now <= confirmEnd;
}

export function isInJudgeWindow(disputeTime: bigint): boolean {
  if (disputeTime === 0n) return false;
  const now = BigInt(Math.floor(Date.now() / 1000));
  const judgeEnd = disputeTime + BigInt(259200); // 72h
  return now <= judgeEnd;
}
