"use client";

import { useState, useEffect } from "react";
import { useWeb3, basePublicClient } from "@/lib/web3-provider";
import { CONTRACT_ADDRESS, DARE_ABI } from "@/lib/contract";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

export default function DebugPage() {
  const { address, isConnected, connect } = useWeb3();
  const [contractExists, setContractExists] = useState<boolean | null>(null);
  const [dareCount, setDareCount] = useState<bigint | null>(null);
  const [rpcWorking, setRpcWorking] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        // Test RPC connection
        console.log("[v0] Testing RPC connection...");
        const blockNumber = await basePublicClient.getBlockNumber();
        console.log("[v0] Block number:", blockNumber.toString());
        setRpcWorking(true);

        // Check if contract code exists
        console.log("[v0] Checking contract at:", CONTRACT_ADDRESS);
        const code = await basePublicClient.getCode({ address: CONTRACT_ADDRESS });
        const contractExistsCheck = code !== "0x";
        setContractExists(contractExistsCheck);
        console.log("[v0] Contract exists:", contractExistsCheck);

        if (contractExistsCheck) {
          try {
            const count = (await basePublicClient.readContract({
              address: CONTRACT_ADDRESS,
              abi: DARE_ABI,
              functionName: "dareCount" as never,
              args: [] as never,
            })) as bigint;
            setDareCount(count);
            console.log("[v0] Dare count:", count.toString());
          } catch (e) {
            console.log("[v0] Failed to read dareCount:", e);
          }
        }
      } catch (err) {
        console.error("[v0] Diagnostic error:", err);
        setRpcWorking(false);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <main className="min-h-screen bg-black text-white px-4 pb-8 pt-4">
      <div className="mx-auto max-w-2xl">
        <h1
          className="text-2xl font-bold mb-6"
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
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-white">RPC Connection</p>
                <p className="text-sm text-white/70 mt-1">
                  https://sepolia.base.org (Base Sepolia)
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
            <div className="flex items-center justify-between">
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
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-white">Dare Count</p>
                  <p className="text-sm text-white/70 mt-1">
                    {dareCount !== null ? dareCount.toString() : "Unable to read"}
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
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-white">Wallet Connection</p>
                <p className="text-sm text-white/70 mt-1">
                  {isConnected
                    ? `Connected: ${address?.slice(0, 6)}...${address?.slice(-4)}`
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
            <pre className="text-xs bg-black/80 p-3 rounded border border-white/10 overflow-auto max-h-48 text-white/80">
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
            <p className="font-medium text-white mb-2">Setup Instructions</p>
            <ol className="text-sm text-white/70 space-y-1 list-decimal list-inside">
              <li>Install a Web3 wallet (MetaMask, Coinbase Wallet, etc.).</li>
              <li>Switch wallet to Base Sepolia testnet (Chain ID: 84532).</li>
              <li>Get testnet ETH from a Base Sepolia faucet.</li>
              <li>The contract is deployed at {CONTRACT_ADDRESS} on Base Sepolia.</li>
              <li>If all checks pass above, the app should work normally.</li>
            </ol>
          </Card>
        </div>
      </div>
    </main>
  );
}
