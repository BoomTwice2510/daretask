"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
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
  BaseError,
  ContractFunctionRevertedError,
  Hash,
} from "viem";
import { baseSepolia } from "viem/chains";
import { CONTRACT_ADDRESS, DARE_ABI, ERC20_ABI } from "./contract";

// ---- persistence helpers ----
const STORAGE_KEY = "dare-protocol-wallet";

function saveWalletState(address: string) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ address, ts: Date.now() }));
  } catch {}
}

function loadWalletState(): string | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const { address, ts } = JSON.parse(raw);
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
  } catch {}
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
  writeContract: (functionName: string, args?: unknown[], value?: bigint) => Promise<Hash>;
  approveToken: (token: Address, amount: bigint) => Promise<Hash>;
  getAllowance: (token: Address, owner: Address) => Promise<bigint>;
}

const Web3Context = createContext<Web3ContextType | null>(null);

// ---- public client ----
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

  const buildWalletClient = useCallback((ethereum: NonNullable<ReturnType<typeof getEthereum>>) => {
    return createWalletClient({
      chain: baseSepolia,
      transport: custom(ethereum),
    });
  }, []);

  // auto-reconnect
  useEffect(() => {
    mountedRef.current = true;
    const ethereum = getEthereum();
    if (!ethereum) return;

    const savedAddress = loadWalletState();
    if (!savedAddress) return;

    const provider = ethereum as unknown as {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
    };

    provider
      .request({ method: "eth_accounts" })
      .then((accounts) => {
        const accs = accounts as string[];
        if (!mountedRef.current) return;
        const matchedAddr = accs.find((a) => a.toLowerCase() === savedAddress.toLowerCase());
        if (matchedAddr) {
          const addr = matchedAddr as Address;
          setAddress(addr);
          setChainId(baseSepolia.id);
          setWalletClient(buildWalletClient(ethereum));
          saveWalletState(addr);
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

  // wallet listeners
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

  // connect
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

  // disconnect
  const disconnect = useCallback(() => {
    setAddress(null);
    setChainId(null);
    setWalletClient(null);
    clearWalletState();
  }, []);

  // reads
  const readContract = useCallback(async (functionName: string, args: unknown[] = []) => {
    return publicClient.readContract({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: DARE_ABI,
      functionName: functionName as never,
      args: args as never,
    });
  }, []);

  // writes with error unwrap
  const writeContract = useCallback(
    async (functionName: string, args: unknown[] = [], value?: bigint): Promise<Hash> => {
      if (!walletClient || !address) throw new Error("Wallet not connected");

      try {
        const { request } = await publicClient.simulateContract({
          address: CONTRACT_ADDRESS,
          abi: DARE_ABI,
          functionName,
          args,
          account: address,
          value,
        });

        const hash = await walletClient.writeContract(request);
        return hash as Hash;
      } catch (error) {
        if (error instanceof BaseError) {
          const revertError = error.walk(
            (e) => e instanceof ContractFunctionRevertedError
          );
          if (revertError instanceof ContractFunctionRevertedError) {
            const reason =
              revertError.shortMessage ||
              revertError.data?.errorName ||
              revertError.message;
            throw new Error(reason);
          }
        }
        throw error;
      }
    },
    [walletClient, address]
  );

  // approve with error unwrap
  const approveToken = useCallback(
    async (token: Address, amount: bigint): Promise<Hash> => {
      if (!walletClient || !address) throw new Error("Wallet not connected");

      try {
        const { request } = await publicClient.simulateContract({
          address: token,
          abi: ERC20_ABI,
          functionName: "approve",
          args: [CONTRACT_ADDRESS, amount],
          account: address,
        });

        const hash = await walletClient.writeContract(request);
        return hash as Hash;
      } catch (error) {
        if (error instanceof BaseError) {
          const revertError = error.walk(
            (e) => e instanceof ContractFunctionRevertedError
          );
          if (revertError instanceof ContractFunctionRevertedError) {
            const reason =
              revertError.shortMessage ||
              revertError.data?.errorName ||
              revertError.message;
            throw new Error(reason);
          }
        }
        throw error;
      }
    },
    [walletClient, address]
  );

  // allowance
  const getAllowance = useCallback(async (token: Address, owner: Address) => {
    const result = await publicClient.readContract({
      address: token,
      abi: ERC20_ABI,
      functionName: "allowance",
      args: [owner, CONTRACT_ADDRESS],
    });
    return result as bigint;
  }, []);

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
