"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWeb3 } from "@/lib/web3-provider";
import { CONTRACT_ADDRESS, DARE_ABI } from "@/lib/contract";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Loader2, ArrowLeft } from "lucide-react";

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
    <main className="min-h-screen bg-black text-white flex flex-col">
      {/* Top bar with back button */}
      <header className="sticky top-0 z-20 border-b border-white/10 bg-black/80 backdrop-blur px-4 py-3">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
          <button
            onClick={() => router.push("/")}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/80 hover:bg-white/10 transition"
          >
            <ArrowLeft className="h-3 w-3" />
            Back to feed
          </button>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
            Debug mode · Base Sepolia
          </span>
        </div>
      </header>

      {/* Content */}
      <div className="mx-auto flex w-full max-w-2xl flex-1 px-4 pb-20 pt-4">
        <div className="w-full space-y-6">
          <h1
            className="text-2xl font-bold"
            style={{
              background: "linear-gradient(to right,#f5d566,#e6c547,#d4af37)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Debug Dashboard
          </h1>

          <div className="space-y-4">
            {/* RPC Status */}
            <Card className="p-4 border border-[rgba(212,175,55,0.35)] bg-[rgba(5,5,5,0.96)]">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium text-white">RPC Connection</p>
                  <p className="text-sm text-white/70 mt-1">
                    Base Sepolia RPC (hidden)
                  </p>
                </div>
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin text-[#f5d566]" />
                ) : rpcWorking ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
              </div>
            </Card>

            {/* Contract Status */}
            <Card className="p-4 border border-[rgba(212,175,55,0.35)] bg-[rgba(5,5,5,0.96)]">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium text-white">Contract Deployment</p>
                  <p className="text-xs font-mono text-white/70 mt-1 break-all">
                    {CONTRACT_ADDRESS}
                  </p>
                </div>
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin text-[#f5d566]" />
                ) : contractExists ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
              </div>
            </Card>

            {/* Dare Count */}
            {contractExists && (
              <Card className="p-4 border border-[rgba(212,175,55,0.35)] bg-[rgba(5,5,5,0.96)]">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium text-white">Dare Count</p>
                    <p className="text-sm text-white/70 mt-1">
                      {dareCount !== null
                        ? dareCount.toString()
                        : "Unable to read"}
                    </p>
                  </div>
                  {dareCount !== null && (
                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                  )}
                </div>
              </Card>
            )}

            {/* Wallet Status */}
            <Card className="p-4 border border-[rgba(212,175,55,0.35)] bg-[rgba(5,5,5,0.96)]">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium text-white">Wallet Connection</p>
                  <p className="text-sm text-white/70 mt-1">
                    {isConnected
                      ? `Connected: ${address?.slice(0, 6)}...${address?.slice(
                          -4
                        )}`
                      : "Not connected"}
                  </p>
                </div>
                {isConnected ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                ) : (
                  <Button
                    size="sm"
                    onClick={connect}
                    className="bg-[#f5d566] text-black hover:bg-[#e6c547]"
                  >
                    Connect
                  </Button>
                )}
              </div>
            </Card>

            {/* Raw JSON */}
            <Card className="p-4 border border-[rgba(212,175,55,0.35)] bg-[rgba(5,5,5,0.96)]">
              <p className="font-medium text-white mb-2">Diagnostic Data</p>
              <pre className="text-xs bg-black/80 p-3 rounded border border-white/10 overflow-auto max-h-64 text-white/80">
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
            </Card>

            {/* Instructions */}
            <Card className="p-4 border border-[rgba(212,175,55,0.35)] bg-[rgba(5,5,5,0.96)]">
              <p className="font-medium text-white mb-2">Setup Checklist</p>
              <ol className="text-sm text-white/70 space-y-1 list-decimal list-inside">
                <li>Install a Web3 wallet (MetaMask, Coinbase Wallet, etc.).</li>
                <li>Switch wallet to Base Sepolia testnet (Chain ID: 84532).</li>
                <li>Get testnet ETH from a Base Sepolia faucet.</li>
                <li>
                  Confirm contract at {CONTRACT_ADDRESS} on Base Sepolia.
                </li>
                <li>
                  If all checks above are green, the main app should function
                  normally.
                </li>
              </ol>
            </Card>
          </div>
        </div>
      </div>

      {/* Bottom bar / footer */}
      <footer className="sticky bottom-0 z-20 border-t border-white/10 bg-black/90 backdrop-blur px-4 py-2">
        <div className="mx-auto flex max-w-5xl items-center justify-between text-xs text-white/60">
          <span>Debug tools for Dare Protocol · Base Sepolia</span>
          <button
            onClick={() => router.push("/")}
            className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-3 py-1 hover:bg-white/10 transition"
          >
            <ArrowLeft className="h-3 w-3" />
            Back to feed
          </button>
        </div>
      </footer>
    </main>
  );
}
