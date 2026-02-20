"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  createPublicClient,
  createWalletClient,
  custom,
  http,
  type WalletClient,
  type Address,
} from "viem";
import { baseSepolia } from "viem/chains";
import {
  CONTRACT_ADDRESS,
  DARE_ABI,
  ERC20_ABI,
  BASE_CHAIN_ID,
} from "@/lib/contract"; // yahan apna exact path rakhna jahan contract.ts hai

// --------- window.ethereum typing ---------
declare global {
  interface EthereumProvider {
    request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
    on: (event: string, listener: (...args: any[]) => void) => void;
    removeListener: (
      event: string,
      listener: (...args: any[]) => void
    ) => void;
  }

  interface Window {
    ethereum?: EthereumProvider;
  }
}

// --------- context types ---------

interface Web3ContextType {
  address: Address | null;
  isConnected: boolean;
  isConnecting: boolean;
  chainId: number | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  publicClient: any;
  walletClient: WalletClient | null;
  readContract: (functionName: string, args?: any[]) => Promise<any>;
  writeContract: (
    functionName: string,
    args?: any[],
    value?: bigint
  ) => Promise<`0x${string}`>;
  approveToken: (token: Address, amount: bigint) => Promise<`0x${string}`>;
  getAllowance: (token: Address, owner: Address) => Promise<bigint>;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

// --------- public client ---------

const publicClient: any = createPublicClient({
  chain: baseSepolia,
  transport: http(
    process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC ?? "https://sepolia.base.org",
    {
      timeout: 15000,
      retryCount: 3,
      retryDelay: 1000,
    }
  ),
});

// --------- provider ---------

export function Web3Provider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<Address | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [chainId, setChainId] = useState<number | null>(null);
  const [walletClient, setWalletClient] = useState<WalletClient | null>(null);

  // ---- sync existing connection ----
  const syncConnection = useCallback(async () => {
    if (typeof window === "undefined" || !window.ethereum) return;

    try {
      const accounts = (await window.ethereum.request({
        method: "eth_accounts",
      })) as string[];

      const chainIdHex = (await window.ethereum.request({
        method: "eth_chainId",
      })) as string;

      const currentChainId = parseInt(chainIdHex, 16);
      setChainId(currentChainId);

      if (accounts.length > 0) {
        const addr = accounts[0] as Address;
        setAddress(addr);
        setIsConnected(true);

        const wc = createWalletClient({
          chain: baseSepolia,
          transport: custom(window.ethereum),
        });
        setWalletClient(wc);
      } else {
        setAddress(null);
        setIsConnected(false);
        setWalletClient(null);
      }
    } catch (error) {
      console.error("Failed to sync connection", error);
    }
  }, []);

  // ---- connect wallet ----
  const connect = useCallback(async () => {
    if (typeof window === "undefined" || !window.ethereum) {
      alert("Please install MetaMask or a compatible wallet.");
      return;
    }

    try {
      setIsConnecting(true);

      const accounts = (await window.ethereum.request({
        method: "eth_requestAccounts",
      })) as string[];

      const chainIdHex = (await window.ethereum.request({
        method: "eth_chainId",
      })) as string;

      let currentChainId = parseInt(chainIdHex, 16);

      if (currentChainId !== BASE_CHAIN_ID) {
        try {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: `0x${BASE_CHAIN_ID.toString(16)}` }],
          });
          currentChainId = BASE_CHAIN_ID;
        } catch (switchError: any) {
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: `0x${BASE_CHAIN_ID.toString(16)}`,
                  chainName: "Base Sepolia",
                  nativeCurrency: {
                    name: "Ethereum",
                    symbol: "ETH",
                    decimals: 18,
                  },
                  rpcUrls: [
                    process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC ??
                      "https://sepolia.base.org",
                  ],
                  blockExplorerUrls: ["https://sepolia.basescan.org"],
                },
              ],
            });
            currentChainId = BASE_CHAIN_ID;
          } else {
            throw switchError;
          }
        }
      }

      setChainId(currentChainId);

      const addr = accounts[0] as Address;
      setAddress(addr);
      setIsConnected(true);

      const wc = createWalletClient({
        chain: baseSepolia,
        transport: custom(window.ethereum),
      });
      setWalletClient(wc);
    } catch (error) {
      console.error("Failed to connect wallet", error);
      alert("Failed to connect wallet. Please try again.");
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setAddress(null);
    setIsConnected(false);
    setWalletClient(null);
  }, []);

  // ---- contract helpers (Dare contract) ----
  const readContract = useCallback(
    async (functionName: string, args: any[] = []) => {
      try {
        const data = await publicClient.readContract({
          address: CONTRACT_ADDRESS,
          abi: DARE_ABI as any,
          functionName,
          args,
        } as any);
        return data;
      } catch (error) {
        console.error("readContract error:", error);
        throw error;
      }
    },
    []
  );

  const writeContract = useCallback(
    async (
      functionName: string,
      args: any[] = [],
      value?: bigint
    ): Promise<`0x${string}`> => {
      if (!walletClient || !address) {
        throw new Error("Wallet not connected");
      }

      try {
        const hash = await (walletClient as any).writeContract({
          address: CONTRACT_ADDRESS,
          abi: DARE_ABI as any,
          functionName,
          args,
          value,
          account: address,
          chain: baseSepolia,
        } as any);

        return hash as `0x${string}`;
      } catch (error: any) {
        console.error("writeContract error:", error);
        if (error?.shortMessage) {
          throw new Error(error.shortMessage);
        }
        throw error;
      }
    },
    [walletClient, address]
  );

  // ---- ERC20 helpers ----
  const approveToken = useCallback(
    async (token: Address, amount: bigint): Promise<`0x${string}`> => {
      if (!walletClient || !address) {
        throw new Error("Wallet not connected");
      }

      try {
        const hash = await (walletClient as any).writeContract({
          address: token,
          abi: ERC20_ABI as any,
          functionName: "approve",
          args: [CONTRACT_ADDRESS, amount],
          account: address,
          chain: baseSepolia,
        } as any);

        return hash as `0x${string}`;
      } catch (error: any) {
        console.error("approveToken error:", error);
        if (error?.shortMessage) {
          throw new Error(error.shortMessage);
        }
        throw error;
      }
    },
    [walletClient, address]
  );

  const getAllowance = useCallback(
    async (token: Address, owner: Address): Promise<bigint> => {
      try {
        const result = await publicClient.readContract({
          address: token,
          abi: ERC20_ABI as any,
          functionName: "allowance",
          args: [owner, CONTRACT_ADDRESS],
        } as any);

        return result as bigint;
      } catch (error) {
        console.error("getAllowance error:", error);
        throw error;
      }
    },
    []
  );

  // ---- effects ----
  useEffect(() => {
    syncConnection();

    if (typeof window === "undefined" || !window.ethereum) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnect();
      } else {
        setAddress(accounts[0] as Address);
        setIsConnected(true);
      }
    };

    const handleChainChanged = (chainIdHex: string) => {
      const id = parseInt(chainIdHex, 16);
      setChainId(id);
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);

    return () => {
      if (!window.ethereum) return;
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum.removeListener("chainChanged", handleChainChanged);
    };
  }, [syncConnection, disconnect]);

  return (
    <Web3Context.Provider
      value={{
        address,
        isConnected,
        isConnecting,
        chainId,
        connect,
        disconnect,
        publicClient,
        walletClient,
        readContract,
        writeContract,
        approveToken,
        getAllowance,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
}

export function useWeb3() {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error("useWeb3 must be used within a Web3Provider");
  }
  return context;
}
