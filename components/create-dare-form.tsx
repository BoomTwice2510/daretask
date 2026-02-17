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
import { Loader2, AlertCircle, Coins, Zap, CheckCircle2, X } from "lucide-react";
import { parseEther, type Address } from "viem";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

// ---------- Premium success modal (gold) ----------

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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative w-full max-w-sm rounded-3xl border border-[rgba(212,175,55,0.45)] bg-gradient-to-b from-black via-[#050505] to-black shadow-[0_0_80px_rgba(0,0,0,0.9)] px-5 py-6"
            initial={{ scale: 0.85, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 10 }}
            transition={{ type: "spring", stiffness: 210, damping: 20 }}
          >
            <button
              onClick={onClose}
              className="absolute right-3 top-3 rounded-full bg-black/70 p-1 text-white/60 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[rgba(212,175,55,0.18)] relative">
              <div className="absolute inset-0 rounded-full bg-[rgba(212,175,55,0.5)] blur-xl opacity-60" />
              <motion.div
                className="relative flex h-12 w-12 items-center justify-center rounded-full bg-black"
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 18,
                  delay: 0.05,
                }}
              >
                <CheckCircle2 className="h-7 w-7 text-[#f5d566]" />
              </motion.div>
            </div>

            <div className="text-center space-y-2">
              <p className="text-xs uppercase tracking-[0.2em] text-[#f5d566] flex items-center justify-center gap-1">
                <Zap className="h-3 w-3" />
                Dare created
              </p>
              <h2 className="text-xl font-semibold text-white">You’re officially live</h2>
              <p className="text-sm text-white/70">
                Your dare is on‑chain on Base Sepolia. Share it or wait for someone to
                match your stake.
              </p>
            </div>

            {txHash && (
              <a
                href={`https://sepolia.basescan.org/tx/${txHash}`}
                target="_blank"
                rel="noreferrer"
                className="mt-4 block rounded-xl border border-white/10 bg-black/80 px-3 py-2 text-xs text-white/65 hover:border-[rgba(245,213,102,0.7)] hover:text-[#fefce8] transition-colors"
              >
                View transaction on BaseScan
              </a>
            )}

            <div className="mt-5 flex items-center gap-2">
              <Button
                className="flex-1 h-10 text-sm font-semibold"
                style={{
                  background: "linear-gradient(135deg,#d4af37,#e6c547)",
                  color: "#000",
                  boxShadow: "0 14px 30px rgba(212,175,55,0.45)",
                }}
                onClick={onClose}
              >
                Back to feed
              </Button>
              <Button
                variant="outline"
                className="h-10 border-white/15 bg-black/80 text-xs text-white/70 hover:border-[rgba(245,213,102,0.7)]"
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
  const { isConnected, address, writeContract, approveToken, getAllowance, connect } =
    useWeb3();
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
    const display = symbolToDisplayName(symbol).toLowerCase();
    return `/images/${display}.png`;
  }

  function getTokenLabel() {
    const t = filteredTokens.find((tok) => tok.address === token);
    if (!t) return "???";
    return symbolToDisplayName(t.symbol);
  }

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
        className="flex flex-col gap-7 rounded-2xl border border-[rgba(212,175,55,0.35)] bg-[rgba(5,5,5,0.96)] p-6 md:p-8 shadow-[0_18px_60px_rgba(0,0,0,0.9)]"
      >
        {/* Description */}
        <div className="flex flex-col gap-2.5">
          <Label htmlFor="description" className="text-sm font-semibold text-white">
            Dare Description
          </Label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your dare clearly about task and their duration in details and make it memorable..."
            className="min-h-[120px] w-full rounded-lg border border-white/10 bg-black/80 px-4 py-3 text-base text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[rgba(245,213,102,0.6)] focus:border-[rgba(245,213,102,0.9)] resize-none transition-colors"
            maxLength={500}
          />
          <span className="text-xs text-white/45 text-right">
            {description.length}/500
          </span>
        </div>

        {/* Duration */}
        <div className="flex flex-col gap-4">
          <Label className="text-sm font-medium text-white">
            Duration:{" "}
            <span className="text-[#f5d566] font-semibold">
              {durationValue} {durationType === "hours" ? "hour" : "day"}
              {durationValue !== 1 ? "s" : ""}
            </span>
          </Label>

          {/* Duration Type Toggle */}
          <div className="flex gap-2 bg-black/70 rounded-lg p-1 border border-white/10">
            <button
              type="button"
              onClick={() => {
                setDurationType("hours");
                setDurationValue(1);
              }}
              className={cn(
                "flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors",
                durationType === "hours"
                  ? "bg-[rgba(212,175,55,0.95)] text-black"
                  : "text-white/60 hover:text-white"
              )}
            >
              Hours
            </button>
            <button
              type="button"
              onClick={() => {
                setDurationType("days");
                setDurationValue(1);
              }}
              className={cn(
                "flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors",
                durationType === "days"
                  ? "bg-[rgba(212,175,55,0.95)] text-black"
                  : "text-white/60 hover:text-white"
              )}
            >
              Days
            </button>
          </div>

          {/* Custom gold slider */}
          <div className="w-full">
            <div
              className="relative h-2 w-full rounded-full bg-white/10 cursor-pointer"
              onClick={(e) => {
                const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
                const ratio = (e.clientX - rect.left) / rect.width;
                const max = durationType === "hours" ? 168 : 7;
                const min = 1;
                const raw = min + ratio * (max - min);
                const next = Math.min(max, Math.max(min, Math.round(raw)));
                setDurationValue(next);
              }}
            >
              <div
                className="h-2 rounded-full bg-[#f5d566]"
                style={{
                  width: `${
                    ((durationValue - 1) /
                      ((durationType === "hours" ? 168 : 7) - 1 || 1)) *
                    100
                  }%`,
                }}
              />
              <div
                className="absolute -top-[6px] h-4 w-4 rounded-full border-2 border-black bg-[#f5d566] shadow-[0_0_8px_rgba(245,213,102,0.8)]"
                style={{
                  left: `calc(${
                    ((durationValue - 1) /
                      ((durationType === "hours" ? 168 : 7) - 1 || 1)) *
                    100
                  }% - 8px)`,
                }}
              />
            </div>
          </div>

          <div className="flex justify-between text-xs text-white/50">
            <span>{durationType === "hours" ? "1 hour" : "1 day"}</span>
            <span>
              {durationType === "hours" ? "168 hours (7 days)" : "7 days"}
            </span>
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
            <SelectTrigger className="w-full bg-black/80 border-white/10 text-white rounded-lg h-11 focus:ring-[rgba(245,213,102,0.6)]">
              <SelectValue>
                {(() => {
                  const t =
                    filteredTokens.find((tok) => tok.address === token) ??
                    filteredTokens[0];
                  const display = symbolToDisplayName(t.symbol);
                  return (
                    <span className="flex items-center gap-2">
                      <div className="h-5 w-5 rounded-full overflow-hidden bg-black flex-shrink-0">
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
            <SelectContent className="bg-black border-white/10 rounded-lg">
              {filteredTokens.map((t) => {
                const display = symbolToDisplayName(t.symbol);
                return (
                  <SelectItem
                    key={t.address}
                    value={t.address}
                    className="text-white focus:bg-white/10"
                  >
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-5 rounded-full overflow-hidden bg-black flex-shrink-0">
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
            <Coins className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/45" />
            <Input
              id="stake"
              type="number"
              step="any"
              min="0.0001"
              value={stake}
              onChange={(e) => setStake(e.target.value)}
              placeholder="Enter amount"
              className="pl-11 bg-black/80 border-white/10 text-white text-base rounded-lg h-11 focus:ring-[rgba(245,213,102,0.6)] transition-colors"
            />
          </div>
          <p className="text-xs text-white/55">
            Minimum: 0.0001 {getTokenLabel()} — Your opponent matches your stake,
            total pot = 2x
          </p>
        </div>

        {/* Fee info */}
        {stake && parseFloat(stake) > 0 && (
          <div className="rounded-lg bg-gradient-to-r from-[rgba(212,175,55,0.14)] to-[rgba(10,10,10,0.9)] border border-[rgba(212,175,55,0.4)] p-4 text-sm">
            <div className="space-y-2.5">
              <div className="flex justify-between items-center">
                <span className="text-white/70">Your stake</span>
                <span className="text-white font-semibold font-mono">
                  {stake} {getTokenLabel()}
                </span>
              </div>
              <div className="h-px bg-white/10" />
              <div className="flex justify-between items-center">
                <span className="text-white/70">Total pot (with opponent)</span>
                <span className="text-white font-semibold font-mono">
                  {(parseFloat(stake) * 2).toFixed(6)} {getTokenLabel()}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs text-white/60">
                <span>Platform fee (3%)</span>
                <span className="font-mono">
                  {(parseFloat(stake) * 2 * 0.03).toFixed(6)} {getTokenLabel()}
                </span>
              </div>
              <div className="h-px bg-white/10" />
              <div className="flex justify-between items-center">
                <span className="text-emerald-400 font-medium">
                  Winner receives
                </span>
                <span className="text-emerald-400 font-semibold font-mono">
                  {(parseFloat(stake) * 2 * 0.97).toFixed(6)} {getTokenLabel()}
                </span>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-start gap-2 rounded-lg bg-red-500/10 border border-red-500/40 p-3 text-sm text-red-300">
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <Button
          type="submit"
          disabled={isSubmitting || !isConnected}
          className="w-full h-12 md:h-13 text-base md:text-lg font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: isConnected
              ? "linear-gradient(135deg,#d4af37,#e6c547)"
              : "linear-gradient(135deg,#4b5563,#6b7280)",
            color: "#000",
            boxShadow: isConnected
              ? "0 18px 40px rgba(212,175,55,0.45)"
              : "0 12px 28px rgba(0,0,0,0.8)",
          }}
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
