"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useWeb3 } from "@/lib/web3-provider";
import { ALLOWED_TOKENS, ZERO_ADDRESS } from "@/lib/contract";
import { DareStatus, type DareData } from "@/lib/types";
import {
  shortenAddress,
  formatStake,
  getStatusLabel,
  getStatusColor,
  timeRemaining,
  isDeadlinePassed,
  isInProofWindow,
  isInConfirmWindow,
  isInJudgeWindow,
} from "@/lib/helpers";
import { DareTimeline } from "@/components/dare-timeline";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Loader2,
  AlertCircle,
  ExternalLink,
  Copy,
  Check,
  Clock,
  Coins,
  User,
  Swords,
  FileCheck,
  ShieldAlert,
  Gavel,
  XCircle,
  Ban,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { type Address } from "viem";
import Link from "next/link";

interface DareDetailProps {
  dare: DareData;
  onRefresh: () => void;
}

// helpers shared with create form
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

export function DareDetail({ dare, onRefresh }: DareDetailProps) {
  const { address, isConnected, writeContract, approveToken, getAllowance, readContract, connect } =
    useWeb3();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [proofURI, setProofURI] = useState("");
  const [copied, setCopied] = useState(false);
  const [judgeAddress, setJudgeAddress] = useState<string>("");

  const stakeFormatted = formatStake(dare.stake);
  const tokenMeta = tokenMetaFromAddress(dare.token);
  const isETH =
    dare.token === ZERO_ADDRESS ||
    dare.token === "0x0000000000000000000000000000000000000000";
  const isCreator = address?.toLowerCase() === dare.creator.toLowerCase();
  const isAccepter = address?.toLowerCase() === dare.accepter.toLowerCase();
  const noAccepter =
    dare.accepter === ZERO_ADDRESS ||
    dare.accepter === "0x0000000000000000000000000000000000000000";

  // Fetch judge address
  useEffect(() => {
    readContract("judge")
      .then((j) => setJudgeAddress(j as string))
      .catch(() => {});
  }, [readContract]);

  const isJudge = address?.toLowerCase() === judgeAddress?.toLowerCase();

  const copyAddress = (addr: string) => {
    navigator.clipboard.writeText(addr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const executeAction = async (action: () => Promise<unknown>, label: string) => {
    setError("");
    setSuccess("");
    setIsLoading(true);
    try {
      await action();
      setSuccess(`${label} successful! Refreshing...`);
      setTimeout(onRefresh, 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message.slice(0, 200) : "Transaction failed");
    } finally {
      setIsLoading(false);
    }
  };

  // Accept Dare
  const handleAcceptDare = () =>
    executeAction(async () => {
      if (!isETH) {
        const allowance = await getAllowance(dare.token as Address, address!);
        if (allowance < dare.stake) {
          await approveToken(dare.token as Address, dare.stake);
          await new Promise((r) => setTimeout(r, 3000));
        }
      }
      await writeContract(
        "acceptDare",
        [BigInt(dare.id)],
        isETH ? dare.stake : undefined
      );
    }, "Dare accepted");

  // Cancel Dare (creator only, open)
  const handleCancel = () =>
    executeAction(
      () => writeContract("cancelOpenDare", [BigInt(dare.id)]),
      "Dare cancelled"
    );

  // Expire unaccepted dare
  const handleExpire = () =>
    executeAction(
      () => writeContract("expireUnacceptedDare", [BigInt(dare.id)]),
      "Dare expired"
    );

  // Submit proof (accepter only)
  const handleSubmitProof = () =>
    executeAction(
      () => writeContract("submitProof", [BigInt(dare.id), proofURI]),
      "Proof submitted"
    );

  // Confirm success (creator only)
  const handleConfirmSuccess = () =>
    executeAction(
      () => writeContract("confirmSuccess", [BigInt(dare.id)]),
      "Dare confirmed"
    );

  // Dispute (creator only)
  const handleDispute = () =>
    executeAction(
      () => writeContract("disputeDare", [BigInt(dare.id)]),
      "Dare disputed"
    );

  // Resolve after confirm timeout (anyone)
  const handleResolveConfirmTimeout = () =>
    executeAction(
      () => writeContract("resolveAfterConfirmTimeout", [BigInt(dare.id)]),
      "Resolved"
    );

  // Resolve after proof timeout (anyone)
  const handleResolveProofTimeout = () =>
    executeAction(
      () => writeContract("resolveAfterProofTimeout", [BigInt(dare.id)]),
      "Resolved"
    );

  // Judge resolve
  const handleJudgeResolve = (creatorWins: boolean) =>
    executeAction(
      () => writeContract("judgeResolve", [BigInt(dare.id), creatorWins]),
      "Judge resolved"
    );

  return (
    <div className="flex flex-col gap-6 text-white">
      {/* Timeline */}
      <DareTimeline status={dare.status} />

      {/* Status badge + stake */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span
          className={cn(
            "inline-flex items-center rounded-full px-3 py-1 text-sm font-medium",
            getStatusColor(dare.status)
          )}
        >
          {getStatusLabel(dare.status)}
        </span>
        <div className="flex items-center gap-2 rounded-lg bg-neutral-900 px-3 py-2 border border-neutral-800">
          <div className="h-5 w-5 rounded-full overflow-hidden bg-neutral-950 flex-shrink-0">
            <Image
              src={tokenMeta.icon}
              alt={tokenMeta.symbol}
              width={20}
              height={20}
              className="h-full w-full object-contain"
            />
          </div>
          <span className="font-mono text-sm font-bold">
            {stakeFormatted} {tokenMeta.symbol}
          </span>
          <span className="text-xs text-gray-400">each side</span>
        </div>
      </div>

      {/* Description */}
      <div className="rounded-xl bg-neutral-900 border border-neutral-800 p-4">
        <p className="leading-relaxed text-gray-100">{dare.description}</p>
      </div>

      {/* Participants */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="flex items-center gap-3 rounded-lg border border-neutral-800 p-3 bg-neutral-950">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20">
            <User className="h-4 w-4 text-primary" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs text-gray-400">Creator</span>
            <Link
              href={`/profile/${dare.creator}`}
              className="font-mono text-xs text-white hover:text-primary truncate"
            >
              {shortenAddress(dare.creator)}
            </Link>
          </div>
          <button
            onClick={() => copyAddress(dare.creator)}
            className="ml-auto shrink-0 p-1"
            aria-label="Copy address"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-emerald-400" />
            ) : (
              <Copy className="h-3.5 w-3.5 text-gray-400" />
            )}
          </button>
        </div>

        {!noAccepter && (
          <div className="flex items-center gap-3 rounded-lg border border-neutral-800 p-3 bg-neutral-950">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-500/20">
              <Swords className="h-4 w-4 text-sky-400" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs text-gray-400">Accepter</span>
              <Link
                href={`/profile/${dare.accepter}`}
                className="font-mono text-xs text-white hover:text-sky-400 truncate"
              >
                {shortenAddress(dare.accepter)}
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Time info */}
      <div className="flex flex-wrap gap-3 text-xs text-gray-400">
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          <span>
            Deadline: {new Date(Number(dare.deadline) * 1000).toLocaleDateString()}{" "}
            {new Date(Number(dare.deadline) * 1000).toLocaleTimeString()}
          </span>
        </div>
        {(dare.status === DareStatus.Open || dare.status === DareStatus.Running) && (
          <div className="flex items-center gap-1">
            <span className="text-primary font-medium">
              {timeRemaining(dare.deadline)} remaining
            </span>
          </div>
        )}
      </div>

      {/* Proof info */}
      {dare.proofSubmitted && dare.proofURI && (
        <div className="rounded-lg border border-neutral-800 bg-neutral-950 p-3">
          <div className="flex items-center gap-2 mb-2">
            <FileCheck className="h-4 w-4 text-emerald-400" />
            <span className="text-sm font-medium text-white">Proof Submitted</span>
          </div>
          <a
            href={dare.proofURI}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm text-sky-400 hover:underline break-all"
          >
            {dare.proofURI.length > 60
              ? dare.proofURI.slice(0, 60) + "..."
              : dare.proofURI}
            <ExternalLink className="h-3 w-3 shrink-0" />
          </a>
        </div>
      )}

      {/* Action Buttons based on state */}
      <div className="flex flex-col gap-3">
        {/* --- OPEN STATE --- */}
        {dare.status === DareStatus.Open && (
          <>
            {/* Accept button (not creator) */}
            {isConnected && !isCreator && (
              <Button
                onClick={handleAcceptDare}
                disabled={isLoading}
                className="w-full h-12 bg-sky-500 text-black hover:bg-sky-400 text-base font-semibold"
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Swords className="mr-2 h-4 w-4" />
                )}
                Accept Dare ({stakeFormatted} {tokenMeta.symbol})
              </Button>
            )}

            {/* Cancel (creator only, before deadline) */}
            {isConnected && isCreator && !isDeadlinePassed(dare.deadline) && (
              <Button
                onClick={handleCancel}
                disabled={isLoading}
                variant="outline"
                className="w-full h-12 border-red-500 text-red-400 hover:bg-red-500/10"
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <XCircle className="mr-2 h-4 w-4" />
                )}
                Cancel Dare
              </Button>
            )}

            {/* Expire (anyone, after deadline) */}
            {isDeadlinePassed(dare.deadline) && (
              <Button
                onClick={handleExpire}
                disabled={isLoading}
                variant="outline"
                className="w-full h-12 border-neutral-700 text-gray-200 hover:bg-neutral-800"
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Ban className="mr-2 h-4 w-4" />
                )}
                Expire & Refund Creator
              </Button>
            )}

            {!isConnected && (
              <Button
                onClick={connect}
                className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Connect Wallet to Accept
              </Button>
            )}
          </>
        )}

        {/* --- RUNNING STATE --- */}
        {dare.status === DareStatus.Running && (
          <>
            {/* Submit proof (accepter only, within proof window) */}
            {isConnected &&
              isAccepter &&
              isDeadlinePassed(dare.deadline) &&
              isInProofWindow(dare.deadline) && (
                <div className="flex flex-col gap-3 rounded-lg border border-primary/40 bg-neutral-950 p-4">
                  <div className="flex items-center gap-2">
                    <FileCheck className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-white">Submit Your Proof</span>
                  </div>
                  <Input
                    value={proofURI}
                    onChange={(e) => setProofURI(e.target.value)}
                    placeholder="Proof URL (e.g. screenshot, video link)"
                    className="bg-neutral-900 border-neutral-800 text-white text-base"
                  />
                  <Button
                    onClick={handleSubmitProof}
                    disabled={isLoading || !proofURI.trim()}
                    className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    {isLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <FileCheck className="mr-2 h-4 w-4" />
                    )}
                    Submit Proof
                  </Button>
                </div>
              )}

            {/* Show message if not yet deadline */}
            {isAccepter && !isDeadlinePassed(dare.deadline) && (
              <div className="rounded-lg bg-neutral-900 border border-neutral-800 p-4 text-sm text-gray-300">
                <Clock className="inline h-4 w-4 mr-1" />
                Dare is in progress. Submit proof after the deadline (
                {timeRemaining(dare.deadline)} remaining).
              </div>
            )}

            {/* Resolve after proof timeout (anyone) */}
            {isDeadlinePassed(dare.deadline) &&
              !isInProofWindow(dare.deadline) &&
              !dare.proofSubmitted && (
                <Button
                  onClick={handleResolveProofTimeout}
                  disabled={isLoading}
                  className="w-full h-12 bg-amber-500 text-black hover:bg-amber-400"
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Gavel className="mr-2 h-4 w-4" />
                  )}
                  Resolve (No Proof - Creator Wins)
                </Button>
              )}
          </>
        )}

        {/* --- PROOF SUBMITTED STATE --- */}
        {dare.status === DareStatus.ProofSubmitted && (
          <>
            {/* Creator actions */}
            {isConnected && isCreator && isInConfirmWindow(dare.proofTime) && (
              <div className="flex flex-col gap-3">
                <p className="text-sm text-gray-300">
                  Review the proof and confirm or dispute within 24 hours.
                </p>
                <div className="flex gap-3">
                  <Button
                    onClick={handleConfirmSuccess}
                    disabled={isLoading}
                    className="flex-1 h-12 bg-emerald-500 text-black hover:bg-emerald-400"
                  >
                    {isLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Check className="mr-2 h-4 w-4" />
                    )}
                    Confirm
                  </Button>
                  <Button
                    onClick={handleDispute}
                    disabled={isLoading}
                    variant="outline"
                    className="flex-1 h-12 border-red-500 text-red-400 hover:bg-red-500/10"
                  >
                    {isLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <ShieldAlert className="mr-2 h-4 w-4" />
                    )}
                    Dispute
                  </Button>
                </div>
              </div>
            )}

            {/* Resolve after confirm timeout (anyone) */}
            {!isInConfirmWindow(dare.proofTime) && (
              <Button
                onClick={handleResolveConfirmTimeout}
                disabled={isLoading}
                className="w-full h-12 bg-sky-500 text-black hover:bg-sky-400"
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Gavel className="mr-2 h-4 w-4" />
                )}
                Resolve (Creator Inactive - Accepter Wins)
              </Button>
            )}
          </>
        )}

        {/* --- DISPUTED STATE --- */}
        {dare.status === DareStatus.Disputed && (
          <>
            {isJudge && isInJudgeWindow(dare.disputeTime) && (
              <div className="flex flex-col gap-3 rounded-lg border border-amber-500/40 bg-neutral-950 p-4">
                <div className="flex items-center gap-2">
                  <Gavel className="h-4 w-4 text-amber-400" />
                  <span className="text-sm font-medium text-white">Judge Resolution</span>
                </div>
                <p className="text-xs text-gray-400">
                  As the judge, decide who wins this disputed dare.
                </p>
                <div className="flex gap-3">
                  <Button
                    onClick={() => handleJudgeResolve(true)}
                    disabled={isLoading}
                    variant="outline"
                    className="flex-1 h-12 border-primary text-primary hover:bg-primary/10"
                  >
                    Creator Wins
                  </Button>
                  <Button
                    onClick={() => handleJudgeResolve(false)}
                    disabled={isLoading}
                    variant="outline"
                    className="flex-1 h-12 border-sky-500 text-sky-400 hover:bg-sky-500/10"
                  >
                    Accepter Wins
                  </Button>
                </div>
              </div>
            )}

            {!isJudge && (
              <div className="rounded-lg bg-red-500/10 border border-red-500/40 p-4 text-sm text-red-400 flex items-center gap-2">
                <ShieldAlert className="h-4 w-4" />
                <span>This dare is under dispute. A judge will resolve it within 72 hours.</span>
              </div>
            )}
          </>
        )}

        {/* --- RESOLVED --- */}
        {dare.status === DareStatus.Resolved && (
          <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/40 p-4 text-center">
            <Check className="h-6 w-6 text-emerald-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-emerald-400">Dare Resolved</p>
          </div>
        )}

        {/* --- CANCELLED --- */}
        {dare.status === DareStatus.Cancelled && (
          <div className="rounded-lg bg-neutral-900 border border-neutral-800 p-4 text-center">
            <Ban className="h-6 w-6 text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-300">Dare Cancelled</p>
          </div>
        )}
      </div>

      {/* Feedback messages */}
      {error && (
        <div className="flex items-start gap-2 rounded-lg bg-red-500/10 border border-red-500/40 p-3 text-sm text-red-400">
          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="flex items-start gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/40 p-3 text-sm text-emerald-400">
          <Check className="h-4 w-4 mt-0.5 shrink-0" />
          <span>{success}</span>
        </div>
      )}
    </div>
  );
}
