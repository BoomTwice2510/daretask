"use client";

import { Header } from "@/components/header";
import { AlertTriangle, FileText, Scale, ShieldAlert } from "lucide-react";

const cards = [
  ["On-chain, immutable rules", "Dare Protocol is experimental smart-contract software deployed on Base Sepolia. Once a dare is created, funds are controlled by contract logic.", FileText],
  ["No custody, no legal advice", "The protocol and frontend do not custody assets on your behalf. Nothing here is legal, tax or investment advice.", Scale],
  ["Volatility and loss of funds", "Crypto assets are volatile and smart contracts can fail or be exploited. You may lose part or all of the assets you interact with.", AlertTriangle],
  ["Your responsibility", "Verify contract addresses, understand the contract rules and assess the risks before staking funds.", ShieldAlert],
] as const;

export default function Legal() {
  return <div className="dare-light-shell"><Header /><main className="dare-page"><div className="dare-eyebrow" style={{color:'#d84a4a'}}>RISK DISCLOSURE</div><h1 className="dare-title mt-2">Legal disclaimer</h1><p className="dare-subtitle mt-3">Read this before interacting with experimental on-chain contracts or staking crypto assets.</p><section className="dare-legal-grid">{cards.map(([title,body,Icon])=><article key={title}><div><Icon /></div><h2>{title}</h2><p>{body}</p></article>)}</section><div className="dare-soft-card mt-4 p-4 text-xs text-slate-500">By continuing to use Dare Protocol you acknowledge the experimental nature of the system and the risks of interacting with on-chain assets.</div></main></div>;
}
