"use client";

import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from "react";
import {
  createPublicClient,
  createWalletClient,
  custom,
  http,
  formatEther,
  parseEther,
  type PublicClient,
  type WalletClient,
  type Address,
} from "viem";
import { baseSepolia } from "viem/chains";
import { CONTRACT_ADDRESS, DARE_ABI, ERC20_ABI } from "./contract";

// ---- persistence helpers ----
const STORAGE_KEY = "dare-protocol-wallet";

function saveWalletState(address: string) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ address, ts: Date.now() }));
  } catch { /* SSR / incognito */ }
}

function loadWalletState(): string | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const { address, ts } = JSON.parse(raw);
    // expire after 7 days
    if (Date.now() - ts > 7 * 24 * 60 * 60 * 1000) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return address;
  } catch {
    return null;
  }
}

function clearWalletState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch { /* SSR / incognito */ }
}

// ---- types ----
interface Web3ContextType {
  address: Address | null;
  isConnected: boolean;
  isConnecting: boolean;
  chainId: number | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  publicClient: PublicClient;
  walletClient: WalletClient | null;
  readContract: (functionName: string, args?: unknown[]) => Promise<unknown>;
  writeContract: (functionName: string, args?: unknown[], value?: bigint) => Promise<`0x${string}`>;
  approveToken: (token: Address, amount: bigint) => Promise<`0x${string}`>;
  getAllowance: (token: Address, owner: Address) => Promise<bigint>;
}

const Web3Context = createContext<Web3ContextType | null>(null);

// ---- public client (singleton, never re-created) ----
const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http("https://sepolia.base.org", {
    timeout: 15000,
    retryCount: 3,
    retryDelay: 1000,
  }),
});

// ---- helpers ----
function getEthereum() {
  if (typeof window === "undefined") return null;
  return (window as unknown as { ethereum?: Parameters<typeof custom>[0] }).ethereum ?? null;
}

async function ensureBaseSepolia(ethereum: NonNullable<ReturnType<typeof getEthereum>>) {
  const provider = ethereum as unknown as {
    request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  };
  const chainHex = (await provider.request({ method: "eth_chainId" })) as string;
  const currentChain = parseInt(chainHex, 16);
  if (currentChain !== baseSepolia.id) {
    await provider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: `0x${baseSepolia.id.toString(16)}` }],
    });
  }
}

// ---- provider ----
export function Web3Provider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<Address | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [walletClient, setWalletClient] = useState<WalletClient | null>(null);
  const mountedRef = useRef(true);

  // Build a wallet client from an already-connected address
  const buildWalletClient = useCallback((ethereum: NonNullable<ReturnType<typeof getEthereum>>) => {
    return createWalletClient({
      chain: baseSepolia,
      transport: custom(ethereum),
    });
  }, []);

  // ---- auto-reconnect on mount ----
  useEffect(() => {
    mountedRef.current = true;
    const ethereum = getEthereum();
    if (!ethereum) return;

    const savedAddress = loadWalletState();
    if (!savedAddress) return;

    // Silently check if wallet is still connected (no popup)
    const provider = ethereum as unknown as {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
    };

    provider
      .request({ method: "eth_accounts" }) // does NOT prompt
      .then((accounts) => {
        const accs = accounts as string[];
        if (!mountedRef.current) return;
        const matchedAddr = accs.find(
          (a) => a.toLowerCase() === savedAddress.toLowerCase()
        );
        if (matchedAddr) {
          const addr = matchedAddr as Address;
          setAddress(addr);
          setChainId(baseSepolia.id);
          setWalletClient(buildWalletClient(ethereum));
          saveWalletState(addr);
          // Silently try to switch chain if needed
          ensureBaseSepolia(ethereum).catch(() => {});
        } else {
          clearWalletState();
        }
      })
      .catch(() => {
        clearWalletState();
      });

    return () => {
      mountedRef.current = false;
    };
  }, [buildWalletClient]);

  // ---- wallet event listeners (stable, never triggers full reload) ----
  useEffect(() => {
    const ethereum = getEthereum();
    if (!ethereum) return;

    const emitter = ethereum as unknown as {
      on?: (event: string, handler: (...args: unknown[]) => void) => void;
      removeListener?: (event: string, handler: (...args: unknown[]) => void) => void;
    };
    if (!emitter.on) return;

    const handleAccountsChanged = (accounts: unknown) => {
      const accs = accounts as string[];
      if (accs.length === 0) {
        setAddress(null);
        setChainId(null);
        setWalletClient(null);
        clearWalletState();
      } else {
        const addr = accs[0] as Address;
        setAddress(addr);
        setWalletClient(buildWalletClient(ethereum));
        saveWalletState(addr);
      }
    };

    const handleChainChanged = (chainIdHex: unknown) => {
      const newChainId = parseInt(chainIdHex as string, 16);
      setChainId(newChainId);
      // Do NOT reload. If wrong chain, try to switch back silently.
      if (newChainId !== baseSepolia.id) {
        ensureBaseSepolia(ethereum).catch(() => {});
      }
    };

    emitter.on("accountsChanged", handleAccountsChanged);
    emitter.on("chainChanged", handleChainChanged);

    return () => {
      emitter.removeListener?.("accountsChanged", handleAccountsChanged);
      emitter.removeListener?.("chainChanged", handleChainChanged);
    };
  }, [buildWalletClient]);

  // ---- connect (explicit user action) ----
  const connect = useCallback(async () => {
    const ethereum = getEthereum();
    if (!ethereum) throw new Error("Please install a Web3 wallet");
    setIsConnecting(true);
    try {
      await ensureBaseSepolia(ethereum);
      const client = buildWalletClient(ethereum);
      const [addr] = await client.requestAddresses();
      setAddress(addr);
      setChainId(baseSepolia.id);
      setWalletClient(client);
      saveWalletState(addr);
    } finally {
      setIsConnecting(false);
    }
  }, [buildWalletClient]);

  // ---- disconnect ----
  const disconnect = useCallback(() => {
    setAddress(null);
    setChainId(null);
    setWalletClient(null);
    clearWalletState();
  }, []);

  // ---- contract reads (uses singleton publicClient, no wallet needed) ----
  const readContract = useCallback(
    async (functionName: string, args: unknown[] = []) => {
      return publicClient.readContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: DARE_ABI,
        functionName: functionName as never,
        args: args as never,
      });
    },
    []
  );

  // ---- contract writes ----
  const writeContract = useCallback(
    async (functionName: string, args: unknown[] = [], value?: bigint) => {
      if (!walletClient || !address) throw new Error("Wallet not connected");
      const { request } = await publicClient.simulateContract({
        address: CONTRACT_ADDRESS,
        abi: DARE_ABI,
        functionName,
        args,
        account: address,
        value,
      });
      return walletClient.writeContract(request);
    },
    [walletClient, address]
  );

  // ---- ERC-20 approve ----
  const approveToken = useCallback(
    async (token: Address, amount: bigint) => {
      if (!walletClient || !address) throw new Error("Wallet not connected");
      const { request } = await publicClient.simulateContract({
        address: token,
        abi: ERC20_ABI,
        functionName: "approve",
        args: [CONTRACT_ADDRESS, amount],
        account: address,
      });
      return walletClient.writeContract(request);
    },
    [walletClient, address]
  );

  // ---- ERC-20 allowance ----
  const getAllowance = useCallback(
    async (token: Address, owner: Address) => {
      const result = await publicClient.readContract({
        address: token,
        abi: ERC20_ABI,
        functionName: "allowance",
        args: [owner, CONTRACT_ADDRESS],
      });
      return result as bigint;
    },
    []
  );

  return (
    <Web3Context.Provider
      value={{
        address,
        isConnected: !!address,
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
  if (!context) throw new Error("useWeb3 must be used within a Web3Provider");
  return context;
}

export { formatEther, parseEther, publicClient as basePublicClient };
