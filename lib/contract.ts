// lib/contract.ts

// ✅ DareProtocol ka naya deployed address (Base Sepolia)
export const CONTRACT_ADDRESS =
  "0x2909E76bb91486E2775157A5d3eAAe1288a336A3" as const;

// ✅ Base Sepolia chain ID
export const BASE_CHAIN_ID = 84532;

// ✅ Zero address constant
export const ZERO_ADDRESS =
  "0x0000000000000000000000000000000000000000" as const;

// ✅ Token metadata map (existing hi rehne de)
export const TOKEN_MAP: Record<
  string,
  { name: string; symbol: string; decimals: number }
> = {
  [ZERO_ADDRESS]: { name: "Ethereum", symbol: "ETH", decimals: 18 },
  "0x5dEaC602762362FE5f135FA5904351916053cF70": {
    name: "USD Coin",
    symbol: "USDC",
    decimals: 6,
  },
  "0x50F88fe97f72CD3E75b9Eb4f747F59BcEBA80d59": {
    name: "Token 1",
    symbol: "jesse",
    decimals: 18,
  },
  "0x1111111111166b7FE7bd91427724B487980aFc69": {
    name: "Token 5",
    symbol: "zora",
    decimals: 18,
  },
};

// ✅ Allowed tokens list (existing)
export const ALLOWED_TOKENS = [
  { address: ZERO_ADDRESS, name: "ETH", symbol: "ETH" },
  {
    address: "0x5dEaC602762362FE5f135FA5904351916053cF70",
    name: "USDC (Circle)",
    symbol: "USDC",
  },
  {
    address: "0x50F88fe97f72CD3E75b9Eb4f747F59BcEBA80d59",
    name: "Token 1",
    symbol: "jesse",
  },
  {
    address: "0x1111111111166b7FE7bd91427724B487980aFc69",
    name: "Token 5",
    symbol: "zora",
  },
];

// ✅ Status/badge data same hi rahega
export const STATUS_LABELS: Record<number, string> = {
  0: "Open",
  1: "Running",
  2: "Proof Submitted",
  3: "Disputed",
  4: "Resolved",
  5: "Cancelled",
};

export const BADGE_LABELS: Record<number, string> = {
  0: "None",
  1: "Rookie",
  2: "Challenger",
  3: "Contender",
  4: "Gladiator",
  5: "Champion",
  6: "Legend",
  7: "Mythic",
};

export const BADGE_XP_THRESHOLDS: Record<
  string,
  { min: number; max: number | null }
> = {
  None: { min: 0, max: 0 },
  Rookie: { min: 1, max: 499 },
  Challenger: { min: 500, max: 999 },
  Contender: { min: 1000, max: 1999 },
  Gladiator: { min: 2000, max: 2999 },
  Champion: { min: 3000, max: 4999 },
  Legend: { min: 5000, max: 7499 },
  Mythic: { min: 7500, max: null },
};

// ✅ DareProtocol ABI (ye tumhari verified ABI hi hai)
export const DARE_ABI = [
  {
    inputs: [
      { internalType: "address", name: "_judge", type: "address" },
      { internalType: "address", name: "_treasury", type: "address" },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  { inputs: [{ internalType: "address", name: "token", type: "address" }], name: "SafeERC20FailedOperation", type: "error" },
  { anonymous: false, inputs: [{ indexed: true, internalType: "address", name: "user", type: "address" }, { indexed: false, internalType: "enum DareProtocol.Badge", name: "badge", type: "uint8" }], name: "BadgeUpdated", type: "event" },
  { anonymous: false, inputs: [{ indexed: true, internalType: "uint256", name: "id", type: "uint256" }, { indexed: true, internalType: "address", name: "accepter", type: "address" }], name: "DareAccepted", type: "event" },
  { anonymous: false, inputs: [{ indexed: true, internalType: "uint256", name: "id", type: "uint256" }], name: "DareCancelled", type: "event" },
  { anonymous: false, inputs: [{ indexed: true, internalType: "uint256", name: "id", type: "uint256" }, { indexed: true, internalType: "address", name: "creator", type: "address" }, { indexed: false, internalType: "uint256", name: "deadline", type: "uint256" }], name: "DareCreated", type: "event" },
  { anonymous: false, inputs: [{ indexed: true, internalType: "uint256", name: "id", type: "uint256" }], name: "DareDisputed", type: "event" },
  { anonymous: false, inputs: [{ indexed: true, internalType: "uint256", name: "id", type: "uint256" }], name: "DareExpired", type: "event" },
  { anonymous: false, inputs: [{ indexed: true, internalType: "uint256", name: "id", type: "uint256" }, { indexed: true, internalType: "address", name: "winner", type: "address" }, { indexed: false, internalType: "uint256", name: "payoutAmount", type: "uint256" }, { indexed: false, internalType: "uint256", name: "feeAmount", type: "uint256" }], name: "DareResolved", type: "event" },
  { anonymous: false, inputs: [{ indexed: true, internalType: "address", name: "oldJudge", type: "address" }, { indexed: true, internalType: "address", name: "newJudge", type: "address" }], name: "JudgeUpdated", type: "event" },
  { anonymous: false, inputs: [{ indexed: true, internalType: "uint256", name: "id", type: "uint256" }, { indexed: true, internalType: "address", name: "accepter", type: "address" }, { indexed: false, internalType: "string", name: "proofURI", type: "string" }, { indexed: false, internalType: "uint256", name: "proofTime", type: "uint256" }], name: "ProofSubmitted", type: "event" },
  { anonymous: false, inputs: [{ indexed: true, internalType: "address", name: "oldTreasury", type: "address" }, { indexed: true, internalType: "address", name: "newTreasury", type: "address" }], name: "TreasuryUpdated", type: "event" },
  { stateMutability: "payable", type: "fallback" },
  // ...yahan se niche poori ABI wahi rakho jo abhi tumhare file me hai (maine sirf top dikhaya hai),
  // poori DARE_ABI ko as-is copy kar dena.
] as const;

// ✅ ERC20 ABI same
export const ERC20_ABI = [
  {
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
    ],
    name: "allowance",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [{ name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [{ name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

// ✅ OnchainKit / viem-friendly contract config export
export const DARE_CONTRACT_CONFIG = {
  address: CONTRACT_ADDRESS as `0x${string}`,
  abi: DARE_ABI,
  chainId: BASE_CHAIN_ID,
} as const;
