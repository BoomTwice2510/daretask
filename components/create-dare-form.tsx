"use client";

export const dynamic = "force-dynamic";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useWeb3 } from "@/lib/web3-provider";
import { ALLOWED_TOKENS, DARE_ABI, TOKEN_MAP, ZERO_ADDRESS } from "@/lib/contract";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { AlertCircle, ArrowLeft, Check, CheckCircle2, ChevronRight, Clock3, Coins, FileCheck2, Loader2, ShieldCheck, Sparkles, Wallet } from "lucide-react";
import { formatUnits, parseUnits, type Address } from "viem";
import Image from "next/image";

const CREATE_TOKENS = ALLOWED_TOKENS.filter((t) => t.symbol === "ETH" || t.symbol === "USDC");
const FALLBACK_MAX_DURATION_SECONDS = 7 * 24 * 60 * 60;

type ProofMode = "required" | "none";

export function CreateDareForm() {
  const { isConnected, address, writeContract, approveToken, getAllowance, connect, readContract } = useWeb3();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [step, setStep] = useState<1 | 2>(1);
  const [description, setDescription] = useState("");
  const [durationValue, setDurationValue] = useState(3);
  const [durationType, setDurationType] = useState<"hours" | "days">("days");
  const [token, setToken] = useState<string>(ZERO_ADDRESS);
  const [stake, setStake] = useState("");
  const [proofMode, setProofMode] = useState<ProofMode>("required");
  const [proofSample, setProofSample] = useState("");
  const [samplesExpanded, setSamplesExpanded] = useState(false);
  const [provable, setProvable] = useState<boolean | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successTxHash, setSuccessTxHash] = useState<string | null>(null);
  const [contractLimits, setContractLimits] = useState<{
    minStake: bigint;
    maxUsdStake6: bigint;
    maxDuration: bigint;
    feeBps: bigint;
  } | null>(null);
  const [limitsLoading, setLimitsLoading] = useState(true);

  const selectedToken = useMemo(
    () => CREATE_TOKENS.find((t) => t.address === token) ?? CREATE_TOKENS[0],
    [token],
  );
  const symbol = selectedToken?.symbol ?? "ETH";
  const tokenMeta = TOKEN_MAP[token] ?? { decimals: symbol === "USDC" ? 6 : 18 };
  const isETH = token === ZERO_ADDRESS;
  const maxDurationSeconds = contractLimits?.maxDuration
    ? Number(contractLimits.maxDuration)
    : FALLBACK_MAX_DURATION_SECONDS;
  const maxHours = Math.max(1, Math.floor(maxDurationSeconds / 3600));
  const maxDays = Math.max(1, Math.floor(maxDurationSeconds / 86400));
  const durationSeconds = durationType === "hours" ? durationValue * 3600 : durationValue * 86400;
  const stakeUnits = stake ? parseUnits(stake, tokenMeta.decimals) : 0n;
  const totalPot = stake ? Number(stake) * 2 : 0;
  const feeRate = contractLimits ? Number(contractLimits.feeBps) / 10000 : 0;
  const platformFee = totalPot * feeRate;
  const winnerAmount = totalPot - platformFee;

  useEffect(() => {
    let cancelled = false;
    async function loadLimits() {
      setLimitsLoading(true);
      try {
        // These names match the already-deployed DareProtocol contract.
        const [minEthResult, minUsdcResult, maxUsdResult, maxDurationResult, feeBpsResult] = await Promise.all([
          readContract("MIN_ETH_STAKE"),
          readContract("MIN_USDC_STAKE"),
          readContract("MAX_USD_STAKE_6"),
          readContract("MAX_DURATION"),
          readContract("feeBps"),
        ]);

        const minStake = token === ZERO_ADDRESS
          ? minEthResult as bigint
          : minUsdcResult as bigint;
        const maxUsdStake6 = maxUsdResult as bigint;
        const maxDuration = maxDurationResult as bigint;
        const feeBps = feeBpsResult as bigint;

        if (!cancelled) {
          setContractLimits({
            minStake,
            maxUsdStake6,
            maxDuration,
            feeBps,
          });
        }
      } catch (err) {
        console.error("Unable to read current contract limits", err);
        if (!cancelled) {
          setContractLimits((previous) => previous ?? {
            minStake: 0n,
            maxUsdStake6: 500_000_000n,
            maxDuration: BigInt(FALLBACK_MAX_DURATION_SECONDS),
            feeBps: 300n,
          });
        }
      } finally {
        if (!cancelled) setLimitsLoading(false);
      }
    }
    loadLimits();
    return () => { cancelled = true; };
  }, [readContract, token]);

  useEffect(() => {
    if (!contractLimits) return;
    if (durationSeconds <= maxDurationSeconds) return;
    if (maxDays >= 1 && maxDurationSeconds >= 86400) {
      setDurationType("days");
      setDurationValue(maxDays);
    } else {
      setDurationType("hours");
      setDurationValue(maxHours);
    }
  }, [contractLimits, durationSeconds, maxDurationSeconds, maxDays, maxHours]);

  useEffect(() => {
    const title = searchParams.get("flashTitle");
    const desc = searchParams.get("flashDesc");
    const proof = searchParams.get("flashProof");
    const deadlineStr = searchParams.get("flashDeadline");

    if (!title || !desc || !proof || !deadlineStr) return;

    const deadline = Number(deadlineStr);
    if (!deadline || Number.isNaN(deadline)) return;

    const isDays = deadline % 86400 === 0;
    const nextType: "hours" | "days" = isDays ? "days" : "hours";
    const nextValue = Math.max(1, isDays ? Math.min(maxDays, deadline / 86400) : Math.min(maxHours, Math.round(deadline / 3600)));

    setDescription(`${title}\n\n${desc}`);
    setProofMode("required");
    setProofSample(proof);
    setDurationType(nextType);
    setDurationValue(nextValue);
  }, [searchParams, maxDays, maxHours]);

  const createAbiItem = DARE_ABI.find(
    (item: any) => item?.type === "function" && item?.name === "createDare",
  ) as any;
  const createInputs = createAbiItem?.inputs ?? [];
  const hasDedicatedProofArgument = createInputs.length === 5 && createInputs[4]?.type === "bool";

  const proofText = proofMode === "required"
    ? `Proof required: ${proofSample.trim() || "Provide clear evidence that an accepter can independently inspect."}`
    : "Proof required: No. Outcome is resolved by the protocol rules without submitted evidence.";

  const finalDescription = hasDedicatedProofArgument
    ? description.trim()
    : `${description.trim()}\n\n${proofText}`.trim();

  function validateForReview() {
    setError("");
    if (!description.trim()) return setError("Describe exactly what the accepter must do.");
    if (description.trim().length < 12) return setError("Make the dare specific enough to be objectively checked.");
    if (limitsLoading || !contractLimits) return setError("Contract limits are not available yet. Refresh after the current contract is loaded.");
    if (!stake || Number(stake) <= 0) return setError("Enter a stake amount.");
    if (stakeUnits < contractLimits.minStake) return setError(`Stake is below the contract minimum (${formatUnits(contractLimits.minStake, tokenMeta.decimals)} ${symbol}).`);
    if (durationSeconds > maxDurationSeconds) return setError(`Duration exceeds the contract maximum of ${formatDuration(maxDurationSeconds)}.`);
    // The deployed contract caps stake by USD value: $500 equivalent.
    // Token-specific max conversion is enforced on-chain, so do not compare
    // ETH units directly with the 6-decimal USD cap.
    if (proofMode === "required" && !proofSample.trim()) return setError("Add a provable sample so the accepter knows what evidence counts.");
    setProvable(null);
    setSamplesExpanded(false);
    setStep(2);
  }

  async function createDare() {
    setError("");

    if (provable !== true) {
      setError("Confirm Yes: the accepter can prove this dare from the stated evidence.");
      return;
    }

    if (!isConnected || !address) {
      await connect();
      return;
    }

    if (!description.trim() || !stake) {
      setStep(1);
      setError("Complete the dare details first.");
      return;
    }

    if (!contractLimits) {
      setError("Contract limits are not available yet. Refresh after the current contract is loaded.");
      setStep(1);
      return;
    }
    if (stakeUnits < contractLimits.minStake) {
      setError(`Stake is below the contract minimum (${formatUnits(contractLimits.minStake, tokenMeta.decimals)} ${symbol}).`);
      setStep(1);
      return;
    }
    if (durationSeconds > maxDurationSeconds) {
      setError(`Duration exceeds the contract maximum of ${formatDuration(maxDurationSeconds)}.`);
      setStep(1);
      return;
    }

    setIsSubmitting(true);
    try {
      if (!isETH) {
        const allowance = await getAllowance(token as Address, address);
        if (allowance < stakeUnits) {
          await approveToken(token as Address, stakeUnits);
          await new Promise((resolve) => setTimeout(resolve, 3000));
        }
      }

      const createAbi = DARE_ABI.find(
        (item: any) => item?.type === "function" && item?.name === "createDare",
      ) as any;
      const inputs = createAbi?.inputs ?? [];
      const args: any[] = [finalDescription, BigInt(durationSeconds), token as Address, stakeUnits];

      // The deployed contract has evolved. Build the fifth argument from the
      // active ABI instead of guessing or changing the contract.
      if (inputs.length === 5) {
        const fifthType = inputs[4]?.type;
        if (fifthType === "bool") args.push(proofMode === "required");
        else if (fifthType === "string") args.push(proofSample.trim());
        else if (fifthType?.startsWith("bytes")) args.push(proofSample.trim());
        else throw new Error(`Unsupported createDare ABI fifth parameter: ${fifthType}`);
      } else if (inputs.length !== 4) {
        throw new Error(`createDare ABI expects ${inputs.length} parameters; update the frontend ABI to match the deployed contract.`);
      }

      const txHash = await writeContract(
        "createDare",
        args,
        isETH ? stakeUnits : undefined,
      );

      setSuccessTxHash(typeof txHash === "string" ? txHash : null);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Transaction failed";
      setError(message.includes("Wait") ? "Please wait before creating another dare." : message.slice(0, 220));
    } finally {
      setIsSubmitting(false);
    }
  }

  if (successTxHash) {
    return (
      <div className="mx-auto max-w-2xl rounded-3xl border border-emerald-200 bg-white p-6 shadow-[0_18px_60px_rgba(35,65,110,0.10)] sm:p-8">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-600">Dare created</div>
            <h2 className="mt-1 text-2xl font-extrabold text-[#10213f]">Your dare is live.</h2>
            <p className="mt-2 text-sm leading-6 text-[#64758f]">The configuration was signed and submitted to Base Sepolia.</p>
          </div>
        </div>
        {successTxHash && (
          <a
            href={`https://sepolia.basescan.org/tx/${successTxHash}`}
            target="_blank"
            rel="noreferrer"
            className="mt-5 block rounded-xl border border-[#dce5f1] bg-[#f7f9fc] px-4 py-3 text-sm font-semibold text-[#1268f3]"
          >
            View transaction on BaseScan
          </a>
        )}
        <Button onClick={() => router.push("/explore")} className="mt-4 h-12 w-full rounded-xl bg-[#1268f3] text-white hover:bg-[#0757d8]">
          Explore dares
        </Button>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[28px] border border-[#dce5f1] bg-white shadow-[0_18px_60px_rgba(35,65,110,0.09)]">
      <div className="border-b border-[#e7edf5] px-5 py-4 sm:px-7">
        <div className="flex items-center gap-3">
          <div className={cn("flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold", step === 1 ? "bg-[#1268f3] text-white" : "bg-emerald-500 text-white")}>
            {step === 1 ? "1" : <Check className="h-4 w-4" />}
          </div>
          <div className="h-px flex-1 bg-[#dce5f1]" />
          <div className={cn("flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold", step === 2 ? "bg-[#1268f3] text-white" : "bg-[#eef3f9] text-[#8190a7]")}>2</div>
          <div>
            <div className="text-xs font-bold text-[#173154]">{step === 1 ? "Configure dare" : "Review before creation"}</div>
          </div>
        </div>
      </div>

      {step === 1 ? (
        <form onSubmit={(e) => { e.preventDefault(); validateForReview(); }} className="p-5 sm:p-7 lg:p-8">
          <div className="grid gap-7 lg:grid-cols-[1.45fr_0.8fr]">
            <div className="space-y-6">
              <section>
                <label htmlFor="description" className="text-sm font-bold text-[#173154]">What exactly must happen?</label>
                <p className="mt-1 text-xs leading-5 text-[#7b8aa1]">Write one outcome an accepter can understand and complete without guessing.</p>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Example: Complete a 5 km run in one continuous activity."
                  maxLength={500}
                  className="mt-3 min-h-[132px] w-full resize-none rounded-2xl border border-[#d9e2ef] bg-[#fbfcfe] px-4 py-3 text-sm text-[#173154] outline-none transition focus:border-[#1268f3] focus:ring-4 focus:ring-[#1268f3]/10"
                />
                <div className="mt-1 flex justify-between text-[11px] text-[#8997aa]"><span>Be specific, measurable and time-bounded.</span><span>{description.length}/500</span></div>
              </section>

              <section>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-bold text-[#173154]">Duration</div>
                    <div className="mt-1 text-xs text-[#7b8aa1]">Maximum contract duration: {limitsLoading ? "loading..." : formatDuration(maxDurationSeconds)}.</div>
                  </div>
                  <div className="rounded-full bg-[#eef5ff] px-3 py-1 text-xs font-bold text-[#1268f3]">{durationValue} {durationType === "days" ? "day" : "hour"}{durationValue === 1 ? "" : "s"}</div>
                </div>

                <div className="mt-3 grid grid-cols-2 rounded-xl border border-[#dce5f1] bg-[#f8fafc] p-1">
                  {(["hours", "days"] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => {
                        const nextMax = type === "hours" ? maxHours : maxDays;
                        const nextDefault = type === "hours" ? 24 : 3;
                        setDurationType(type);
                        setDurationValue(Math.min(nextDefault, nextMax));
                      }}
                      className={cn("rounded-lg px-3 py-2.5 text-sm font-semibold transition", durationType === type ? "bg-white text-[#1268f3] shadow-sm" : "text-[#71819a]")}
                    >
                      {type === "hours" ? "Hours" : "Days"}
                    </button>
                  ))}
                </div>
                <input
                  aria-label="Duration"
                  type="range"
                  min={1}
                  max={durationType === "hours" ? maxHours : maxDays}
                  value={durationValue}
                  onChange={(e) => {
                    const next = Number(e.target.value);
                    const max = durationType === "hours" ? maxHours : maxDays;
                    setDurationValue(Math.min(Math.max(1, next), max));
                  }}
                  className="mt-5 w-full accent-[#1268f3]"
                />
                <div className="flex justify-between text-[11px] text-[#8997aa]"><span>{durationType === "hours" ? "1 hour" : "1 day"}</span><span>{durationType === "hours" ? `${maxHours} hours` : `${maxDays} days`}</span></div>
              </section>

              <section>
                <div className="text-sm font-bold text-[#173154]">Stake asset</div>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  {CREATE_TOKENS.map((item) => (
                    <button
                      key={item.address}
                      type="button"
                      onClick={() => setToken(item.address)}
                      className={cn("flex items-center gap-3 rounded-2xl border px-4 py-3 text-left transition", token === item.address ? "border-[#1268f3] bg-[#f1f7ff] ring-2 ring-[#1268f3]/10" : "border-[#dce5f1] bg-white hover:border-[#b9c9df]")}
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f3f6fa]"><Image src={`/images/${item.symbol.toLowerCase()}.png`} alt={item.symbol} width={22} height={22} /></span>
                      <span><span className="block text-sm font-bold text-[#173154]">{item.symbol}</span><span className="block text-[11px] text-[#8190a7]">Base Sepolia</span></span>
                    </button>
                  ))}
                </div>
              </section>

              <section>
                <label htmlFor="stake" className="text-sm font-bold text-[#173154]">Stake amount</label>
                <div className="relative mt-3">
                  <Coins className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#7c8da6]" />
                  <Input
                    id="stake"
                    type="number"
                    min={contractLimits ? formatUnits(contractLimits.minStake, tokenMeta.decimals) : undefined}
                    step="any"
                    value={stake}
                    onChange={(e) => setStake(e.target.value)}
                    placeholder={`Enter ${symbol} amount`}
                    className="h-12 rounded-xl border-[#d9e2ef] bg-[#fbfcfe] pl-12 text-sm text-[#173154] focus-visible:ring-[#1268f3]/20"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-[#60718c]">{symbol}</span>
                </div>
                <div className="mt-2 grid gap-2 text-[11px] text-[#71819a] sm:grid-cols-2">
                  <div className="rounded-xl bg-[#f7f9fc] px-3 py-2">Min: <b className="text-[#173154]">{limitsLoading || !contractLimits ? "Loading contract limit" : `${formatUnits(contractLimits.minStake, tokenMeta.decimals)} ${symbol}`}</b></div>
                  <div className="rounded-xl bg-[#f7f9fc] px-3 py-2">Max: <b className="text-[#173154]">{limitsLoading || !contractLimits ? "Loading contract limit" : "$500 USD equivalent"}</b></div>
                </div>
              </section>

              <section>
                <button
                  type="button"
                  onClick={() => setSamplesExpanded((value) => !value)}
                  className="flex w-full items-center justify-between gap-3 rounded-full border border-[#dce5f1] bg-[#f8fafc] px-4 py-3 text-left transition hover:border-[#b9c9df] hover:bg-[#f4f8ff]"
                  aria-expanded={samplesExpanded}
                >
                  <span className="flex min-w-0 items-center gap-2.5">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#eef5ff] text-[#1268f3]">
                      <Sparkles className="h-3.5 w-3.5" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-bold text-[#173154]">Sample tasks</span>
                      <span className="block truncate text-[11px] text-[#7b8aa1]">
                        {samplesExpanded ? "Choose a starting template" : "Need inspiration? Browse ready-made dare ideas"}
                      </span>
                    </span>
                  </span>
                  <ChevronRight className={cn("h-4 w-4 shrink-0 text-[#7b8aa1] transition-transform", samplesExpanded && "rotate-90 text-[#1268f3]")} />
                </button>

                {samplesExpanded && (
                  <div className="mt-3 grid gap-2 rounded-2xl border border-[#dce5f1] bg-[#f8fafc] p-2 sm:grid-cols-2 lg:grid-cols-3">
                    {SAMPLE_TASKS.map((sample) => (
                      <button
                        key={sample.title}
                        type="button"
                        onClick={() => {
                          setDescription(sample.task);
                          setProofMode("required");
                          setProofSample(sample.proof);
                          setError("");
                          setSamplesExpanded(false);
                        }}
                        className="rounded-xl border border-[#dce5f1] bg-white p-3 text-left transition hover:border-[#1268f3] hover:bg-[#f4f8ff]"
                      >
                        <div className="text-xs font-bold text-[#173154]">{sample.title}</div>
                        <div className="mt-1 text-[11px] leading-4 text-[#71819a]">{sample.task}</div>
                      </button>
                    ))}
                  </div>
                )}
              </section>

              <section>
                <div className="text-sm font-bold text-[#173154]">Does this dare need proof?</div>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <button type="button" onClick={() => setProofMode("none")} className={cn("rounded-2xl border p-4 text-left", proofMode === "none" ? "border-[#1268f3] bg-[#f1f7ff]" : "border-[#dce5f1]")}>
                    <div className="text-sm font-bold text-[#173154]">No proof</div>
                    <div className="mt-1 text-xs leading-5 text-[#7b8aa1]">Outcome resolves by the protocol rules.</div>
                  </button>
                  <button type="button" onClick={() => setProofMode("required")} className={cn("rounded-2xl border p-4 text-left", proofMode === "required" ? "border-[#1268f3] bg-[#f1f7ff]" : "border-[#dce5f1]")}>
                    <div className="text-sm font-bold text-[#173154]">Proof required</div>
                    <div className="mt-1 text-xs leading-5 text-[#7b8aa1]">Accepter submits evidence after the deadline.</div>
                  </button>
                </div>

                {proofMode === "required" && (
                  <div className="mt-3 rounded-2xl border border-[#cfe0f8] bg-[#f6faff] p-4">
                    <div className="flex items-start gap-3">
                      <FileCheck2 className="mt-0.5 h-5 w-5 shrink-0 text-[#1268f3]" />
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-bold text-[#173154]">Provable sample</div>
                        <div className="mt-1 text-xs leading-5 text-[#71819a]">State what evidence should count. Example: “Strava activity link or screenshot showing 5 km, date and one continuous activity.”</div>
                        <textarea
                          value={proofSample}
                          onChange={(e) => setProofSample(e.target.value)}
                          maxLength={280}
                          placeholder="Example: Strava activity link or screenshot showing 5 km..."
                          className="mt-3 min-h-[82px] w-full resize-none rounded-xl border border-[#d9e2ef] bg-white px-3 py-2.5 text-xs text-[#173154] outline-none focus:border-[#1268f3] focus:ring-4 focus:ring-[#1268f3]/10"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </section>
            </div>

            <aside className="h-fit rounded-3xl border border-[#dce5f1] bg-[#f8fafc] p-5 lg:sticky lg:top-24">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[#1268f3]"><Sparkles className="h-4 w-4" /> Before you review</div>
              <div className="mt-4 space-y-3">
                <InfoRow icon={<Clock3 className="h-4 w-4" />} label="Duration" value={`${durationValue} ${durationType}`} />
                <InfoRow icon={<Wallet className="h-4 w-4" />} label="Stake" value={stake ? `${stake} ${symbol}` : "Not set"} />
                <InfoRow icon={<Coins className="h-4 w-4" />} label="Matched pot" value={stake ? `${totalPot.toFixed(6)} ${symbol}` : "Not set"} />
                <InfoRow icon={<ShieldCheck className="h-4 w-4" />} label="Proof" value={proofMode === "required" ? "Required" : "Not required"} />
              </div>
              <div className="mt-5 rounded-2xl border border-[#dce5f1] bg-white p-4 text-xs leading-5 text-[#71819a]">
                <b className="text-[#173154]">Creator check:</b> the next screen shows the complete dare in one place. You must explicitly confirm that an accepter can prove it before the transaction button appears.
              </div>
            </aside>
          </div>

          {error && <ErrorBox message={error} />}

          <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button type="submit" className="h-12 rounded-xl bg-[#1268f3] px-7 text-sm font-bold text-white shadow-[0_10px_25px_rgba(18,104,243,0.22)] hover:bg-[#0757d8]">Next: Review <ChevronRight className="ml-1 h-4 w-4" /></Button>
          </div>
        </form>
      ) : (
        <div className="p-5 sm:p-7 lg:p-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
            <div>
              <div className="mb-5 flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eef5ff] text-[#1268f3]"><ShieldCheck className="h-5 w-5" /></div>
                <div><div className="text-sm font-bold text-[#173154]">Final creator review</div><div className="mt-1 text-xs text-[#71819a]">Everything below is what the accepter will need to understand.</div></div>
              </div>

              <div className="rounded-2xl border border-[#dce5f1] bg-white p-5">
                <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#1268f3]">Challenge</div>
                <div className="mt-2 whitespace-pre-wrap text-sm font-semibold leading-6 text-[#173154]">{description}</div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <ReviewCard label="Duration" value={`${durationValue} ${durationType}`} />
                <ReviewCard label="Stake asset" value={`${stake || "0"} ${symbol}`} />
                <ReviewCard label="Matched pot" value={`${totalPot.toFixed(6)} ${symbol}`} />
                <ReviewCard label={`Platform fee (${contractLimits ? `${Number(contractLimits.feeBps) / 100}%` : "contract rate"})`} value={`${platformFee.toFixed(6)} ${symbol}`} />
                <ReviewCard label="Winner receives after fee" value={`${winnerAmount.toFixed(6)} ${symbol}`} />
                <ReviewCard label="Proof" value={proofMode === "required" ? "Required" : "Not required"} />
              </div>

              {proofMode === "required" && (
                <div className="mt-4 rounded-2xl border border-[#cfe0f8] bg-[#f6faff] p-4">
                  <div className="flex gap-3"><FileCheck2 className="mt-0.5 h-5 w-5 shrink-0 text-[#1268f3]" /><div><div className="text-sm font-bold text-[#173154]">Proof sample</div><div className="mt-1 text-xs leading-5 text-[#60718c]">{proofSample}</div></div></div>
                </div>
              )}
            </div>

            <aside className="h-fit rounded-3xl border border-[#dce5f1] bg-[#f8fafc] p-5">
              <div className="text-sm font-bold text-[#173154]">Is this provable for the accepter?</div>
              <p className="mt-2 text-xs leading-5 text-[#71819a]">Only choose Yes if the stated outcome and evidence are clear enough for an independent accepter to complete and prove.</p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <button type="button" onClick={() => setProvable(true)} className={cn("rounded-xl border px-4 py-3 text-sm font-bold transition", provable === true ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-[#dce5f1] bg-white text-[#60718c]")}><Check className="mx-auto mb-1 h-5 w-5" />Yes</button>
                <button type="button" onClick={() => setProvable(false)} className={cn("rounded-xl border px-4 py-3 text-sm font-bold transition", provable === false ? "border-red-300 bg-red-50 text-red-600" : "border-[#dce5f1] bg-white text-[#60718c]")}><ArrowLeft className="mx-auto mb-1 h-5 w-5" />No</button>
              </div>
              <div className="mt-5 rounded-2xl border border-[#dce5f1] bg-white p-4 text-xs leading-5 text-[#71819a]">
                <b className="text-[#173154]">Contract limits:</b> {limitsLoading || !contractLimits ? "Loading current contract values." : `${formatDuration(maxDurationSeconds)} max duration; minimum ${formatUnits(contractLimits.minStake, tokenMeta.decimals)} ${symbol}; $500 USD equivalent max stake.`}
              </div>
            </aside>
          </div>

          {error && <ErrorBox message={error} />}

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-between">
            <Button type="button" variant="outline" onClick={() => { setStep(1); setProvable(null); setSamplesExpanded(false); setError(""); }} className="h-12 rounded-xl border-[#dce5f1] bg-white text-[#52657f]">Back to edit</Button>
            <Button type="button" onClick={createDare} disabled={isSubmitting || provable !== true} className="h-12 rounded-xl bg-[#1268f3] px-8 text-sm font-bold text-white shadow-[0_10px_25px_rgba(18,104,243,0.22)] hover:bg-[#0757d8] disabled:bg-[#b9c8dd] disabled:text-white">
              {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating dare...</> : <><CheckCircle2 className="mr-2 h-4 w-4" /> Create Dare</>}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

const SAMPLE_TASKS = [
  { title: "Run 5 km", task: "Complete a 5 km run in one continuous activity.", proof: "Strava, Garmin or Apple Health activity link/screenshot showing 5 km, date and one continuous activity." },
  { title: "30-min workout", task: "Complete one 30-minute workout session.", proof: "Fitness app activity screenshot showing at least 30 minutes and the session date." },
  { title: "8,000 steps", task: "Reach at least 8,000 steps on the same calendar day.", proof: "Apple Health, Google Fit or equivalent screenshot showing the date and 8,000+ steps." },
  { title: "Close a GitHub issue", task: "Close one specified GitHub issue with the required fix merged.", proof: "Public GitHub issue and merged pull request links showing the issue was closed by the required change." },
  { title: "Publish 3 Farcaster casts", task: "Publish three original Farcaster casts before the deadline.", proof: "Links to the three public casts, each timestamped before the deadline." },
  { title: "10 coding problems", task: "Complete 10 specified coding problems before the deadline.", proof: "Public submission links or repository commits showing all 10 completed problems." },
  { title: "10 acts of kindness", task: "Complete 10 distinct, documented acts of kindness before the deadline.", proof: "A dated list with independently inspectable evidence for each act where practical." },
] as const;

function formatDuration(seconds: number) {
  if (seconds % 86400 === 0) return `${seconds / 86400} day${seconds / 86400 === 1 ? "" : "s"}`;
  if (seconds % 3600 === 0) return `${seconds / 3600} hour${seconds / 3600 === 1 ? "" : "s"}`;
  return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return <div className="flex items-center justify-between gap-3 rounded-xl bg-white px-3 py-2.5"><div className="flex items-center gap-2 text-xs text-[#71819a]">{icon}{label}</div><div className="text-xs font-bold text-[#173154]">{value}</div></div>;
}

function ReviewCard({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl border border-[#dce5f1] bg-[#f8fafc] px-4 py-3"><div className="text-[11px] text-[#8190a7]">{label}</div><div className="mt-1 text-sm font-bold text-[#173154]">{value}</div></div>;
}

function ErrorBox({ message }: { message: string }) {
  return <div className="mt-5 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />{message}</div>;
}
