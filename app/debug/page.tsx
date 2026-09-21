"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWeb3 } from "@/lib/web3-provider";
import { CONTRACT_ADDRESS, DARE_ABI } from "@/lib/contract";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  XCircle,
  Loader2,
  ArrowLeft,
  Activity,
  FileCode2,
  Database,
  Wallet,
  Terminal,
  ShieldCheck,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function DebugPage() {
  const router = useRouter();
  const { address, isConnected, connect, publicClient } = useWeb3();
  const [contractExists, setContractExists] = useState<boolean | null>(null);
  const [dareCount, setDareCount] = useState<bigint | null>(null);
  const [rpcWorking, setRpcWorking] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!publicClient) return;

    (async () => {
      setLoading(true);
      try {
        console.log("[debug] Testing RPC connection...");
        const blockNumber = await publicClient.getBlockNumber();
        console.log("[debug] Block number:", blockNumber.toString());
        setRpcWorking(true);

        console.log("[debug] Checking contract at:", CONTRACT_ADDRESS);
        const code = await publicClient.getCode({ address: CONTRACT_ADDRESS });
        const contractExistsCheck = code !== "0x";
        setContractExists(contractExistsCheck);
        console.log("[debug] Contract exists:", contractExistsCheck);

        if (contractExistsCheck) {
          try {
            const count = (await publicClient.readContract({
              address: CONTRACT_ADDRESS,
              abi: DARE_ABI as any,
              functionName: "dareCount",
              args: [],
            } as any)) as bigint;

            setDareCount(count);
            console.log("[debug] Dare count:", count.toString());
          } catch (e) {
            console.log("[debug] Failed to read dareCount:", e);
          }
        }
      } catch (err) {
        console.error("[debug] Diagnostic error:", err);
        setRpcWorking(false);
      } finally {
        setLoading(false);
      }
    })();
  }, [publicClient]);

  return (
    <main className="relative min-h-screen w-full overflow-x-clip bg-white text-slate-900 flex flex-col">
      {/* Background Ambient Moving Light Spheres */}
      <div className="pointer-events-none fixed -top-24 -left-20 h-96 w-96 rounded-full bg-gradient-to-br from-blue-200/20 via-indigo-100/15 to-transparent blur-3xl animate-drift" />
      <div
        className="pointer-events-none fixed top-1/3 -right-24 h-[420px] w-[420px] rounded-full bg-gradient-to-bl from-rose-100/15 via-amber-100/15 to-blue-100/15 blur-3xl animate-drift"
        style={{ animationDelay: "-6s" }}
      />

      {/* Top Bar with Frosted Glass Shell */}
      <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/85 backdrop-blur-2xl px-4 py-3 shadow-xs">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
          <button
            onClick={() => router.push("/")}
            className="glass-card-interactive group inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-black text-slate-700 hover:text-[#0052FF] transition-all cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-x-1" />
            <span>Back to Feed</span>
          </button>
          
          <div className="glass-panel inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-black text-slate-700 shadow-xs">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#0052FF] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#0052FF]" />
            </span>
            <span>Debug Console · Base Sepolia</span>
          </div>
        </div>
      </header>

      {/* Content Container */}
      <div className="relative mx-auto flex w-full max-w-3xl flex-1 px-4 pb-[calc(6rem+env(safe-area-inset-bottom))] pt-6 sm:pt-8">
        <div className="w-full space-y-6">
          {/* Header Block */}
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50/90 border border-blue-200/70 px-3 py-0.5 text-[10px] font-black uppercase tracking-[0.16em] text-[#0052FF] shadow-xs">
              <Sparkles className="h-3 w-3" />
              System Diagnostics
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 leading-tight">
              Protocol <span className="text-gradient-soothing">Health Monitor</span>
            </h1>
            
            <p className="text-xs sm:text-sm leading-relaxed text-slate-500 font-medium">
              Inspect on-chain contract bytecode, RPC responsiveness, escrow state counters, and connected wallet parameters.
            </p>
          </div>

          <div className="space-y-3.5">
            {/* 1. RPC Status Card */}
            <div className="glass-card-interactive flex items-center justify-between gap-4 rounded-[26px] p-5 shadow-xs">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 via-white to-blue-100/70 border border-blue-200/80 text-[#0052FF] shadow-xs">
                  <div className="absolute inset-1 rounded-xl bg-blue-400/10 blur-xs" />
                  <Activity className="relative z-10 h-5 w-5 stroke-[2.2]" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm sm:text-base font-black text-slate-900">RPC Node Gateway</p>
                  <p className="text-xs font-semibold text-slate-400 mt-0.5">
                    Base Sepolia Testnet RPC (Chain ID: 84532)
                  </p>
                </div>
              </div>

              <div>
                {loading ? (
                  <Loader2 className="h-6 w-6 animate-spin text-[#0052FF]" />
                ) : rpcWorking ? (
                  <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 px-3 py-1 text-xs font-black text-emerald-700 shadow-xs">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span>Connected</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 rounded-full bg-rose-50 border border-rose-200/80 px-3 py-1 text-xs font-black text-rose-700 shadow-xs">
                    <XCircle className="h-4 w-4 text-rose-500" />
                    <span>Failed</span>
                  </div>
                )}
              </div>
            </div>

            {/* 2. Contract Status Card */}
            <div className="glass-card-interactive flex items-center justify-between gap-4 rounded-[26px] p-5 shadow-xs">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-50 via-white to-indigo-100/70 border border-indigo-200/80 text-indigo-600 shadow-xs">
                  <div className="absolute inset-1 rounded-xl bg-indigo-400/10 blur-xs" />
                  <FileCode2 className="relative z-10 h-5 w-5 stroke-[2.2]" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm sm:text-base font-black text-slate-900">Contract Bytecode</p>
                  <a
                    href={`https://sepolia.basescan.org/address/${CONTRACT_ADDRESS}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-mono text-[11px] sm:text-xs font-bold text-slate-500 hover:text-[#0052FF] transition-colors mt-0.5 truncate"
                  >
                    <span className="truncate">{CONTRACT_ADDRESS}</span>
                    <ExternalLink className="h-3 w-3 shrink-0" />
                  </a>
                </div>
              </div>

              <div>
                {loading ? (
                  <Loader2 className="h-6 w-6 animate-spin text-[#0052FF]" />
                ) : contractExists ? (
                  <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 px-3 py-1 text-xs font-black text-emerald-700 shadow-xs">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span>Verified</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 rounded-full bg-rose-50 border border-rose-200/80 px-3 py-1 text-xs font-black text-rose-700 shadow-xs">
                    <XCircle className="h-4 w-4 text-rose-500" />
                    <span>Not Found</span>
                  </div>
                )}
              </div>
            </div>

            {/* 3. Dare Count Card */}
            {contractExists && (
              <div className="glass-card-interactive flex items-center justify-between gap-4 rounded-[26px] p-5 shadow-xs">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-50 via-white to-emerald-100/70 border border-emerald-200/80 text-emerald-600 shadow-xs">
                    <div className="absolute inset-1 rounded-xl bg-emerald-400/10 blur-xs" />
                    <Database className="relative z-10 h-5 w-5 stroke-[2.2]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm sm:text-base font-black text-slate-900">Total Escrowed Dares</p>
                    <p className="font-mono text-xs font-bold text-slate-400 mt-0.5">
                      dareCount() global contract counter
                    </p>
                  </div>
                </div>

                <div className="font-mono text-xl sm:text-2xl font-black text-slate-900">
                  {dareCount !== null ? (
                    <span className="text-emerald-600">{dareCount.toString()}</span>
                  ) : (
                    <span className="text-slate-400 text-sm">Unavailable</span>
                  )}
                </div>
              </div>
            )}

            {/* 4. Wallet Status Card */}
            <div className="glass-card-interactive flex items-center justify-between gap-4 rounded-[26px] p-5 shadow-xs">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-50 via-white to-amber-100/70 border border-amber-200/80 text-amber-600 shadow-xs">
                  <div className="absolute inset-1 rounded-xl bg-amber-400/10 blur-xs" />
                  <Wallet className="relative z-10 h-5 w-5 stroke-[2.2]" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm sm:text-base font-black text-slate-900">Wallet Connection</p>
                  <p className="font-mono text-xs font-bold text-slate-500 mt-0.5 truncate">
                    {isConnected && address
                      ? `${address.slice(0, 6)}...${address.slice(-4)}`
                      : "No wallet currently connected"}
                  </p>
                </div>
              </div>

              <div>
                {isConnected ? (
                  <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 px-3 py-1 text-xs font-black text-emerald-700 shadow-xs">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span>Connected</span>
                  </div>
                ) : (
                  <Button
                    size="sm"
                    onClick={connect}
                    className="rounded-xl bg-gradient-to-b from-[#0052FF] to-[#0045d8] text-white text-xs font-black shadow-xs active:scale-95 transition cursor-pointer"
                  >
                    Connect Wallet
                  </Button>
                )}
              </div>
            </div>

            {/* 5. Raw JSON Diagnostics Block */}
            <div className="glass-panel overflow-hidden rounded-[28px] p-5 sm:p-6 shadow-xs">
              <div className="flex items-center gap-2 mb-3">
                <Terminal className="h-4 w-4 text-[#0052FF]" />
                <span className="text-xs font-black uppercase tracking-wider text-slate-900">
                  Diagnostic Snapshot (JSON)
                </span>
              </div>
              <pre className="text-xs font-mono bg-slate-900 text-emerald-400 p-4 rounded-2xl border border-slate-800 overflow-auto max-h-64 shadow-inner leading-relaxed">
                {JSON.stringify(
                  {
                    rpcWorking,
                    contractExists,
                    dareCount: dareCount?.toString(),
                    contractAddress: CONTRACT_ADDRESS,
                    walletConnected: isConnected,
                    walletAddress: address,
                  },
                  null,
                  2
                )}
              </pre>
            </div>

            {/* 6. Setup Checklist Card */}
            <div className="glass-panel rounded-[28px] p-5 sm:p-6 shadow-xs">
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span className="text-xs font-black uppercase tracking-wider text-slate-900">
                  Setup & Verification Checklist
                </span>
              </div>
              <ol className="text-xs sm:text-sm text-slate-600 space-y-2 list-decimal list-inside font-medium leading-relaxed">
                <li>Install a Web3 EVM wallet (Coinbase Wallet, MetaMask, Rainbow, etc.).</li>
                <li>Ensure wallet network is set to <b>Base Sepolia Testnet</b> (Chain ID: 84532).</li>
                <li>Obtain testnet ETH via the official Base Sepolia Faucet.</li>
                <li>Confirm contract deployment at <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-[11px] text-slate-900">{CONTRACT_ADDRESS}</code>.</li>
                <li>When all status badges show green, the protocol operates normally.</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Sticky Footer Dock */}
      <footer className="sticky bottom-0 z-30 border-t border-slate-200/70 bg-white/85 backdrop-blur-2xl px-4 py-2.5 shadow-xs">
        <div className="mx-auto flex max-w-5xl items-center justify-between text-xs font-semibold text-slate-500">
          <span>Diagnostic console · Dare Protocol Base Sepolia</span>
          <button
            onClick={() => router.push("/")}
            className="glass-card-interactive group inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-black text-slate-700 hover:text-[#0052FF] transition cursor-pointer"
          >
            <ArrowLeft className="h-3 w-3 transition-transform duration-200 group-hover:-translate-x-0.5" />
            <span>Back to Feed</span>
          </button>
        </div>
      </footer>
    </main>
  );
}