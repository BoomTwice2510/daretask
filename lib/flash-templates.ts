// src/lib/flash-templates.ts

export interface FlashTaskTemplate {
  id: string;
  title: string;
  description: string;
  deadline: number; // seconds
  proofType: string;
  failureRate: string;
  oracleLink?: string; // reference URL for frontend-only oracle/result
}

export interface FlashTaskCategory {
  id: string;
  name: string;
  emoji: string;
  description: string;
  failureRating: number; // 1-4 flames
  templates: FlashTaskTemplate[];
}

export function secondsToDuration(
  deadline: number,
): { type: "hours" | "days"; value: number } {
  if (deadline % 86400 === 0) {
    return { type: "days", value: Math.max(1, deadline / 86400) };
  }
  return { type: "hours", value: Math.max(1, Math.round(deadline / 3600)) };
}

export const FLASH_TASK_CATEGORIES: FlashTaskCategory[] = [
  // 🚀 FEATURED: CRYPTO / MARKETS ON TOP
  {
    id: "crypto",
    name: "Crypto / Markets",
    emoji: "📈",
    description: "Featured: short‑term onchain bets for degens. Pure P2P jackpots.",
    failureRating: 4,
    templates: [
      {
        id: "eth-15m-updown",
        title: "Will ETH go UP or DOWN in 15 minutes?",
        description:
          "Create a dare on ETH 15-minute move. Choose direction in description like: 'ETH UP in 15m' or 'ETH DOWN in 15m'. Use this price feed as reference.",
        deadline: 15 * 60,
        proofType: "Price screenshot or oracle link at end time",
        failureRate: "🔥🔥🔥",
        oracleLink: "https://www.coinbase.com/price/ethereum",
      },
      {
        id: "btc-1h-range-break",
        title: "Will BTC break today's high in 1 hour?",
        description:
          "Dare that BTC will make a new intraday high within the next 1 hour. Both sides agree to use this chart as reference (e.g. BTC/USDT).",
        deadline: 60 * 60,
        proofType: "Exchange chart screenshot at end time",
        failureRate: "🔥🔥🔥",
        oracleLink: "https://www.tradingview.com/symbols/BTCUSD/",
      },
      {
        id: "sol-4h-pump",
        title: "Will SOL pump 3%+ in 4 hours?",
        description:
          "Create a dare that SOL will move +3% or more in the next 4 hours. Pick a single reference price now from this page and lock it in description.",
        deadline: 4 * 60 * 60,
        proofType: "Price change calculation from chosen reference",
        failureRate: "🔥🔥",
        oracleLink: "https://www.coingecko.com/en/coins/solana",
      },
      {
        id: "meme-24h-2x",
        title: "Can this meme coin 2x in 24 hours?",
        description:
          "Pick any meme coin and dare that its price will at least 2x within 24 hours. Clearly mention token contract + starting price in description using this site.",
        deadline: 24 * 60 * 60,
        proofType: "Dexscreener / CEX chart link",
        failureRate: "🔥🔥🔥🔥",
        oracleLink: "https://dexscreener.com",
      },
      {
        id: "gas-6h-spike",
        title: "Will Ethereum gas spike above 40 gwei in 6 hours?",
        description:
          "Bet that average gas price on Ethereum will cross 40 gwei at least once in the next 6 hours. Use this gas tracker as reference.",
        deadline: 6 * 60 * 60,
        proofType: "Etherscan gas tracker screenshot",
        failureRate: "🔥🔥",
        oracleLink: "https://etherscan.io/gastracker",
      },
      {
        id: "whale-tx-12h",
        title: "Will there be a $10M+ BTC or ETH onchain transfer in 12 hours?",
        description:
          "Dare that there will be at least one onchain transfer worth $10M+ in BTC or ETH in the next 12 hours. Track using this whale-alert style feed.",
        deadline: 12 * 60 * 60,
        proofType: "Whale tracker link or transaction hash",
        failureRate: "🔥🔥",
        oracleLink: "https://whale-alert.io/",
      },
      {
        id: "alt-24h-top-gainer",
        title: "Will your chosen altcoin be a top gainer in 24 hours?",
        description:
          "Pick any mid‑cap alt and bet it will be in the top gainers list (e.g. top 10 by % gain) within 24 hours on this page.",
        deadline: 24 * 60 * 60,
        proofType: "CoinGecko / CMC top gainers page",
        failureRate: "🔥🔥🔥",
        oracleLink: "https://www.coingecko.com/en/coins/trending",
      },
      {
        id: "eth-btc-ratio-move",
        title: "Will the BTC/ETH ratio move 1%+ today?",
        description:
          "Dare that BTC/ETH ratio will change by at least 1% (up or down) by end of day. Both sides reference the ratio chart on this link.",
        deadline: 24 * 60 * 60,
        proofType: "Ratio calculation from price history site",
        failureRate: "🔥🔥",
        oracleLink: "https://www.tradingview.com/symbols/ETHBTC/",
      },
      {
        id: "nft-floor-move",
        title: "Will this NFT collection floor move 5% in 24 hours?",
        description:
          "Pick any NFT collection and dare its floor price will move at least 5% (up or down) within 24 hours on the chosen marketplace.",
        deadline: 24 * 60 * 60,
        proofType: "Marketplace floor history screenshot",
        failureRate: "🔥🔥🔥",
        oracleLink: "https://blur.io",
      },
      {
        id: "no-hack-48h",
        title: "No major DeFi hack over $5M in 48 hours",
        description:
          "Bet that there will be no DeFi hack or exploit above $5M in the next 48 hours. Use this security/news feed as reference.",
        deadline: 48 * 60 * 60,
        proofType: "News / security feed links",
        failureRate: "🔥🔥",
        oracleLink: "https://rekt.news",
      },
      {
        id: "eth-weekend-gap",
        title: "Will ETH close this weekend above its Friday close?",
        description:
          "Dare that ETH weekend closing price will be above its Friday closing price on a chosen exchange. Use this chart for both prices.",
        deadline: 3 * 24 * 60 * 60,
        proofType: "Weekend vs Friday close chart",
        failureRate: "🔥🔥",
        oracleLink: "https://www.tradingview.com/symbols/ETHUSD/",
      },
      {
        id: "btc-event-react",
        title: "Will BTC move 2%+ after a big news/event?",
        description:
          "Use any scheduled event (FOMC, ETF, election speech) and bet BTC will move at least 2% within X hours after the event starts. Reference this chart.",
        deadline: 12 * 60 * 60,
        proofType: "Event timestamp + price move screenshot",
        failureRate: "🔥🔥🔥",
        oracleLink: "https://www.tradingview.com/symbols/BTCUSD/",
      },
      {
        id: "sol-vs-eth-perf",
        title: "Will SOL outperform ETH by 1% today?",
        description:
          "Dare that SOL daily % change will be at least 1% higher than ETH by end of day. Compare both via this chart layout.",
        deadline: 24 * 60 * 60,
        proofType: "Daily % change comparison screenshot",
        failureRate: "🔥🔥",
        oracleLink:
          "https://www.tradingview.com/chart/?symbol=SOLUSD,ETHUSD",
      },
      {
        id: "degen-meme-top10",
        title: "Will any new meme coin enter top 10 volume today?",
        description:
          "Bet that some new meme coin (launched in last 7 days) will hit top 10 by 24h volume on a chosen DEX or tracker like this.",
        deadline: 24 * 60 * 60,
        proofType: "Volume ranking page screenshot",
        failureRate: "🔥🔥🔥",
        oracleLink: "https://www.coingecko.com/en/categories/meme-token",
      },
      {
        id: "funding-flip",
        title: "Will perp funding turn negative/positive in 12 hours?",
        description:
          "Pick any major perp market (BTC/ETH) and dare that funding rate will flip sign (positive to negative or reverse) within 12 hours using this data.",
        deadline: 12 * 60 * 60,
        proofType: "Perp funding history screenshot",
        failureRate: "🔥🔥",
        oracleLink: "https://www.coinglass.com/funding/BTC",
      },
    ],
  },

  // BELOW: original categories as‑is
  {
    id: "build",
    name: "Build / Ship",
    emoji: "🔨",
    description: "High ego, high fail. Builders overestimate themselves.",
    failureRating: 3,
    templates: [
      {
        id: "ship-feature",
        title: "Ship any feature (UI or contract) in 24h",
        description: "Build and deploy a new feature to your project within 24 hours",
        deadline: 86400,
        proofType: "GitHub link / deployment tx",
        failureRate: "🔥🔥🔥",
      },
      {
        id: "deploy-contract",
        title: "Deploy any contract on testnet in 12h",
        description: "Deploy a smart contract to a testnet within 12 hours",
        deadline: 43200,
        proofType: "Deployment transaction hash",
        failureRate: "🔥🔥🔥",
      },
      {
        id: "github-commits",
        title: "Push 3 GitHub commits in 24h",
        description: "Make 3 meaningful commits to your repository within 24 hours",
        deadline: 86400,
        proofType: "GitHub commit links",
        failureRate: "🔥🔥🔥",
      },
      {
        id: "fix-issue",
        title: "Fix 1 open issue in your repo today",
        description: "Identify and fix one open issue in your repository by end of day",
        deadline: 86400,
        proofType: "GitHub issue link",
        failureRate: "🔥🔥🔥",
      },
      {
        id: "landing-page",
        title: "Launch a landing page (any stack) in 24h",
        description: "Build and launch a complete landing page within 24 hours",
        deadline: 86400,
        proofType: "Deployed URL",
        failureRate: "🔥🔥🔥",
      },
    ],
  },
  {
    id: "social",
    name: "Post / Social",
    emoji: "📢",
    description: "Low effort but consistency kills people.",
    failureRating: 2,
    templates: [
      {
        id: "farcaster-daily",
        title: "Post 1 Farcaster cast daily for 7 days",
        description: "Share a meaningful cast on Farcaster every day for 7 days",
        deadline: 604800,
        proofType: "Profile link with 7 casts",
        failureRate: "🔥🔥",
      },
      {
        id: "tweet-daily",
        title: "Tweet once daily for next 5 days",
        description: "Post a tweet every day for the next 5 days",
        deadline: 432000,
        proofType: "Twitter/X profile link",
        failureRate: "🔥🔥",
      },
      {
        id: "reply-casts",
        title: "Reply to 10 casts today",
        description: "Engage by replying to 10 different casts on Farcaster today",
        deadline: 86400,
        proofType: "Profile screenshot",
        failureRate: "🔥🔥",
      },
      {
        id: "build-update",
        title: "Post 1 build update in 24h",
        description: "Share progress on what you are currently building",
        deadline: 86400,
        proofType: "Profile link / tweet link",
        failureRate: "🔥🔥",
      },
      {
        id: "onchain-share",
        title: "Share 1 onchain tx publicly today",
        description: "Complete an onchain transaction and share it publicly today",
        deadline: 86400,
        proofType: "Profile link with tx share",
        failureRate: "🔥🔥",
      },
    ],
  },
  {
    id: "learn",
    name: "Learn / Study",
    emoji: "📚",
    description: "People think they will do it. They won't.",
    failureRating: 3,
    templates: [
      {
        id: "whitepaper",
        title: "Read 1 whitepaper + summary in 24h",
        description: "Read a blockchain/crypto whitepaper and write a summary",
        deadline: 86400,
        proofType: "Notion / doc / link",
        failureRate: "🔥🔥🔥",
      },
      {
        id: "dev-tutorial",
        title: "Watch 1 dev tutorial + notes today",
        description: "Complete a development tutorial and take detailed notes",
        deadline: 86400,
        proofType: "Notion / doc / link",
        failureRate: "🔥🔥🔥",
      },
      {
        id: "protocol-feature",
        title: "Learn 1 new protocol feature in 12h",
        description: "Deep dive into one feature of your favorite protocol",
        deadline: 43200,
        proofType: "Twitter/Farcaster thread",
        failureRate: "🔥🔥🔥",
      },
      {
        id: "write-summary",
        title: "Write 200 words about any crypto topic",
        description: "Write thoughtful content on a crypto topic of your choice",
        deadline: 86400,
        proofType: "Notion / Medium / blog",
        failureRate: "🔥🔥🔥",
      },
      {
        id: "study-docs",
        title: "Study documentation for 2 hours",
        description: "Dedicate 2 hours to learning from official protocol documentation",
        deadline: 86400,
        proofType: "Self-attestation + challenge window",
        failureRate: "🔥🔥🔥",
      },
    ],
  },
  {
    id: "onchain",
    name: "Onchain Actions",
    emoji: "⛓️",
    description: "Best for automation. Clean & verifiable.",
    failureRating: 1,
    templates: [
      {
        id: "any-tx",
        title: "Do 1 onchain tx today (any chain)",
        description: "Execute any transaction on any blockchain today",
        deadline: 86400,
        proofType: "Transaction hash",
        failureRate: "🔥",
      },
      {
        id: "bridge-funds",
        title: "Bridge funds to any L2 in 12h",
        description: "Bridge tokens to a Layer 2 network within 12 hours",
        deadline: 43200,
        proofType: "Bridge transaction hash",
        failureRate: "🔥",
      },
      {
        id: "swap-token",
        title: "Swap any token on DEX today",
        description: "Complete a token swap on any decentralized exchange today",
        deadline: 86400,
        proofType: "Swap transaction hash",
        failureRate: "🔥",
      },
      {
        id: "mint-nft",
        title: "Mint any NFT in 24h",
        description: "Mint an NFT from any collection within 24 hours",
        deadline: 86400,
        proofType: "NFT transaction hash",
        failureRate: "🔥",
      },
      {
        id: "dao-vote",
        title: "Vote on 1 DAO proposal",
        description: "Participate in DAO governance by voting on a proposal",
        deadline: 604800,
        proofType: "Vote transaction hash",
        failureRate: "🔥",
      },
    ],
  },
  {
    id: "money",
    name: "Money / Discipline",
    emoji: "💰",
    description: "Money rules behavior. Painful = good.",
    failureRating: 4,
    templates: [
      {
        id: "no-degen-trading",
        title: "No degen trading for 48h",
        description: "Abstain from high-risk trading for 48 hours",
        deadline: 172800,
        proofType: "Wallet history / self-attest",
        failureRate: "🔥🔥🔥🔥",
      },
      {
        id: "no-leverage",
        title: "No leverage trades for 72h",
        description: "Avoid all leverage trades for 72 hours",
        deadline: 259200,
        proofType: "Wallet history / self-attest",
        failureRate: "🔥🔥🔥🔥",
      },
      {
        id: "hold-eth",
        title: "Hold ETH without selling for 7 days",
        description: "Hold your ETH position without selling for 7 days",
        deadline: 604800,
        proofType: "Wallet history / self-attest",
        failureRate: "🔥🔥🔥🔥",
      },
      {
        id: "no-new-nfts",
        title: "No new NFTs minted for 5 days",
        description: "Avoid minting new NFTs for 5 days",
        deadline: 432000,
        proofType: "Wallet history / self-attest",
        failureRate: "🔥🔥🔥🔥",
      },
      {
        id: "track-expenses",
        title: "Track expenses today & share summary",
        description: "Track all your expenses today and share a summary",
        deadline: 86400,
        proofType: "Screenshot / spreadsheet",
        failureRate: "🔥🔥🔥🔥",
      },
    ],
  },
  {
    id: "health",
    name: "Health",
    emoji: "💪",
    description: "Crypto crowd secretly wants discipline.",
    failureRating: 3,
    templates: [
      {
        id: "no-junk-food",
        title: "No junk food for 24h",
        description: "Avoid all junk food and eat clean for 24 hours",
        deadline: 86400,
        proofType: "Photo / self-attestation",
        failureRate: "🔥🔥🔥",
      },
      {
        id: "wake-early",
        title: "Wake up before 7 AM tomorrow",
        description: "Wake up and be productive before 7 AM tomorrow",
        deadline: 86400,
        proofType: "Screenshot / photo",
        failureRate: "🔥🔥🔥",
      },
      {
        id: "walk-steps",
        title: "Walk 5,000 steps today",
        description: "Complete 5,000 steps today for your health",
        deadline: 86400,
        proofType: "Health app screenshot",
        failureRate: "🔥🔥🔥",
      },
      {
        id: "no-smoking",
        title: "No smoking for 24h",
        description: "Stay smoke-free for the next 24 hours",
        deadline: 86400,
        proofType: "Self-attestation",
        failureRate: "🔥🔥🔥",
      },
      {
        id: "pushups",
        title: "30 pushups in one session",
        description: "Complete 30 pushups in a single session today",
        deadline: 86400,
        proofType: "Photo / video",
        failureRate: "🔥🔥🔥",
      },
    ],
  },
];
