export const CONTRACT_ADDRESS = "0xee485229e284E1dbECe1995256602C376A958586" as const;

// Base Sepolia testnet chain ID
export const BASE_CHAIN_ID = 84532;

export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000" as const;

export const TOKEN_MAP: Record<string, { name: string; symbol: string; decimals: number }> = {
  [ZERO_ADDRESS]: { name: "Ethereum", symbol: "ETH", decimals: 18 },
  "0x833589fCD6eDb6E08f4c7C32D4f71b1566dA1c78": { name: "USD Coin", symbol: "USDC", decimals: 6 },
  "0x50F88fe97f72CD3E75b9Eb4f747F59BcEBA80d59": { name: "Token 1", symbol: "TKN1", decimals: 18 },
  "0x44ff8620b8cA30902395A7bD3F2407e1A091BF73": { name: "Token 2", symbol: "TKN2", decimals: 18 },
  "0x58D97B57BB95320F9a05dC918Aef65434969c2B2": { name: "Token 3", symbol: "TKN3", decimals: 18 },
  "0x940181a94A35A4569E4529A3CDfB74e38FD98631": { name: "Token 4", symbol: "TKN4", decimals: 18 },
  "0x1111111111166b7FE7bd91427724B487980aFc69": { name: "Token 5", symbol: "TKN5", decimals: 18 },
};

export const ALLOWED_TOKENS = [
  { address: ZERO_ADDRESS, name: "ETH", symbol: "ETH" },
  { address: "0x833589fCD6eDb6E08f4c7C32D4f71b1566dA1c78", name: "USDC (Circle)", symbol: "USDC" },
  { address: "0x50F88fe97f72CD3E75b9Eb4f747F59BcEBA80d59", name: "Token 1", symbol: "TKN1" },
  { address: "0x44ff8620b8cA30902395A7bD3F2407e1A091BF73", name: "Token 2", symbol: "TKN2" },
  { address: "0x58D97B57BB95320F9a05dC918Aef65434969c2B2", name: "Token 3", symbol: "TKN3" },
  { address: "0x940181a94A35A4569E4529A3CDfB74e38FD98631", name: "Token 4", symbol: "TKN4" },
  { address: "0x1111111111166b7FE7bd91427724B487980aFc69", name: "Token 5", symbol: "TKN5" },
];

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

export const BADGE_XP_THRESHOLDS: Record<string, { min: number; max: number | null }> = {
  None: { min: 0, max: 0 },
  Rookie: { min: 1, max: 499 },
  Challenger: { min: 500, max: 999 },
  Contender: { min: 1000, max: 1999 },
  Gladiator: { min: 2000, max: 2999 },
  Champion: { min: 3000, max: 4999 },
  Legend: { min: 5000, max: 7499 },
  Mythic: { min: 7500, max: null },
};

export const DARE_ABI = [
  {
    inputs: [{ internalType: "address", name: "_judge", type: "address" }, { internalType: "address", name: "_treasury", type: "address" }],
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
  { inputs: [], name: "CONFIRM_WINDOW", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "FEE_DISCOUNT_CHAMPION", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "FEE_DISCOUNT_LEGEND", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "FEE_DISCOUNT_MYTHIC", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "JUDGE_WINDOW", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "MAX_DARES_CHAMPION", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "MAX_DARES_LEGEND", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "MAX_DARES_LOWER_TIERS", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "MAX_DARES_MYTHIC", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "MAX_DURATION", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "MIN_STAKE", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "PROOF_WINDOW", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "TOKEN_1", outputs: [{ internalType: "address", name: "", type: "address" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "TOKEN_2", outputs: [{ internalType: "address", name: "", type: "address" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "TOKEN_3", outputs: [{ internalType: "address", name: "", type: "address" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "TOKEN_4", outputs: [{ internalType: "address", name: "", type: "address" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "TOKEN_5", outputs: [{ internalType: "address", name: "", type: "address" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "WIN_FEE_BPS", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "XP_FALSE_DISPUTE", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "XP_LOSS", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "XP_WIN", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [{ internalType: "uint256", name: "_id", type: "uint256" }], name: "acceptDare", outputs: [], stateMutability: "payable", type: "function" },
  { inputs: [{ internalType: "address", name: "", type: "address" }, { internalType: "address", name: "", type: "address" }], name: "acceptedFromCreator", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [{ internalType: "address", name: "", type: "address" }], name: "activeDaresCount", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [{ internalType: "address", name: "", type: "address" }], name: "activeDaresCountAccepter", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [{ internalType: "address", name: "", type: "address" }], name: "badge", outputs: [{ internalType: "enum DareProtocol.Badge", name: "", type: "uint8" }], stateMutability: "view", type: "function" },
  { inputs: [{ internalType: "uint256", name: "_id", type: "uint256" }], name: "cancelOpenDare", outputs: [], stateMutability: "nonpayable", type: "function" },
  { inputs: [{ internalType: "uint256", name: "_id", type: "uint256" }], name: "confirmSuccess", outputs: [], stateMutability: "nonpayable", type: "function" },
  { inputs: [{ internalType: "string", name: "_description", type: "string" }, { internalType: "uint256", name: "_duration", type: "uint256" }, { internalType: "address", name: "_token", type: "address" }, { internalType: "uint256", name: "_stake", type: "uint256" }], name: "createDare", outputs: [], stateMutability: "payable", type: "function" },
  { inputs: [], name: "dareCount", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [{ internalType: "uint256", name: "", type: "uint256" }], name: "dares", outputs: [{ internalType: "address", name: "creator", type: "address" }, { internalType: "address", name: "accepter", type: "address" }, { internalType: "string", name: "description", type: "string" }, { internalType: "address", name: "token", type: "address" }, { internalType: "uint256", name: "stake", type: "uint256" }, { internalType: "uint256", name: "createdAt", type: "uint256" }, { internalType: "uint256", name: "deadline", type: "uint256" }, { internalType: "bool", name: "proofSubmitted", type: "bool" }, { internalType: "string", name: "proofURI", type: "string" }, { internalType: "uint256", name: "proofTime", type: "uint256" }, { internalType: "uint256", name: "disputeTime", type: "uint256" }, { internalType: "enum DareProtocol.Status", name: "status", type: "uint8" }], stateMutability: "view", type: "function" },
  { inputs: [{ internalType: "uint256", name: "_id", type: "uint256" }], name: "disputeDare", outputs: [], stateMutability: "nonpayable", type: "function" },
  { inputs: [{ internalType: "address", name: "", type: "address" }], name: "disputeWins", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [{ internalType: "uint256", name: "_id", type: "uint256" }], name: "expireUnacceptedDare", outputs: [], stateMutability: "nonpayable", type: "function" },
  { inputs: [{ internalType: "address", name: "user", type: "address" }], name: "getCreateCooldown", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [{ internalType: "uint256", name: "_id", type: "uint256" }], name: "getDare", outputs: [{ internalType: "address", name: "creator", type: "address" }, { internalType: "address", name: "accepter", type: "address" }, { internalType: "string", name: "description", type: "string" }, { internalType: "address", name: "token", type: "address" }, { internalType: "uint256", name: "stake", type: "uint256" }, { internalType: "uint256", name: "createdAt", type: "uint256" }, { internalType: "uint256", name: "deadline", type: "uint256" }, { internalType: "bool", name: "proofSubmitted", type: "bool" }, { internalType: "string", name: "proofURI", type: "string" }, { internalType: "uint256", name: "proofTime", type: "uint256" }, { internalType: "uint256", name: "disputeTime", type: "uint256" }, { internalType: "enum DareProtocol.Status", name: "status", type: "uint8" }], stateMutability: "view", type: "function" },
  { inputs: [{ internalType: "address", name: "user", type: "address" }], name: "getUserBadge", outputs: [{ internalType: "enum DareProtocol.Badge", name: "", type: "uint8" }], stateMutability: "view", type: "function" },
  { inputs: [{ internalType: "address", name: "user", type: "address" }], name: "getUserFeeDiscountBps", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [{ internalType: "address", name: "user", type: "address" }], name: "getUserMaxDares", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [{ internalType: "address", name: "user", type: "address" }], name: "getUserStats", outputs: [{ internalType: "uint256", name: "activeCountCreator", type: "uint256" }, { internalType: "uint256", name: "activeCountAccepter", type: "uint256" }, { internalType: "int256", name: "xpPoints", type: "int256" }, { internalType: "uint256", name: "totalWins", type: "uint256" }, { internalType: "uint256", name: "totalLosses", type: "uint256" }, { internalType: "uint256", name: "totalVolume", type: "uint256" }, { internalType: "uint256", name: "totalDisputeWins", type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "judge", outputs: [{ internalType: "address", name: "", type: "address" }], stateMutability: "view", type: "function" },
  { inputs: [{ internalType: "uint256", name: "_id", type: "uint256" }, { internalType: "bool", name: "creatorWins", type: "bool" }], name: "judgeResolve", outputs: [], stateMutability: "nonpayable", type: "function" },
  { inputs: [{ internalType: "address", name: "", type: "address" }], name: "lastDareCreation", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [{ internalType: "address", name: "", type: "address" }], name: "losses", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [{ internalType: "address", name: "user", type: "address" }], name: "penalizeFalseDispute", outputs: [], stateMutability: "nonpayable", type: "function" },
  { inputs: [{ internalType: "uint256", name: "_id", type: "uint256" }], name: "resolveAfterConfirmTimeout", outputs: [], stateMutability: "nonpayable", type: "function" },
  { inputs: [{ internalType: "uint256", name: "_id", type: "uint256" }], name: "resolveAfterProofTimeout", outputs: [], stateMutability: "nonpayable", type: "function" },
  { inputs: [{ internalType: "address", name: "_judge", type: "address" }], name: "setJudge", outputs: [], stateMutability: "nonpayable", type: "function" },
  { inputs: [{ internalType: "address", name: "_treasury", type: "address" }], name: "setTreasury", outputs: [], stateMutability: "nonpayable", type: "function" },
  { inputs: [{ internalType: "uint256", name: "_id", type: "uint256" }, { internalType: "string", name: "_proofURI", type: "string" }], name: "submitProof", outputs: [], stateMutability: "nonpayable", type: "function" },
  { inputs: [], name: "treasury", outputs: [{ internalType: "address", name: "", type: "address" }], stateMutability: "view", type: "function" },
  { inputs: [{ internalType: "address", name: "", type: "address" }], name: "volume", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [{ internalType: "uint256", name: "", type: "uint256" }], name: "winnerOf", outputs: [{ internalType: "address", name: "", type: "address" }], stateMutability: "view", type: "function" },
  { inputs: [{ internalType: "address", name: "", type: "address" }], name: "wins", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [{ internalType: "address", name: "", type: "address" }], name: "xp", outputs: [{ internalType: "int256", name: "", type: "int256" }], stateMutability: "view", type: "function" },
  { stateMutability: "payable", type: "receive" },
] as const;

export const ERC20_ABI = [
  { inputs: [{ name: "spender", type: "address" }, { name: "amount", type: "uint256" }], name: "approve", outputs: [{ name: "", type: "bool" }], stateMutability: "nonpayable", type: "function" },
  { inputs: [{ name: "owner", type: "address" }, { name: "spender", type: "address" }], name: "allowance", outputs: [{ name: "", type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [{ name: "account", type: "address" }], name: "balanceOf", outputs: [{ name: "", type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "decimals", outputs: [{ name: "", type: "uint8" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "symbol", outputs: [{ name: "", type: "string" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "name", outputs: [{ name: "", type: "string" }], stateMutability: "view", type: "function" },
] as const;
