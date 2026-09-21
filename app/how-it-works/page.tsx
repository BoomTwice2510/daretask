"use client";

import { Header } from "@/components/header";
import { FileCheck2, Gavel, Handshake, Sparkles } from "lucide-react";

const steps = [
  ["01", "Create a Dare", "Define the task, deadline, stake and proof requirement.", Sparkles],
  ["02", "Accept & Stake", "Another user accepts and locks the matching stake.", Handshake],
  ["03", "Submit Proof", "The accepter submits the evidence reference during the proof window.", FileCheck2],
  ["04", "Resolve", "The creator confirms or disputes. Timeout and judge rules apply.", Gavel],
] as const;

export default function HowItWorks() {
  return <div className="dare-light-shell"><Header /><main className="dare-page">
    <div className="dare-eyebrow">PROTOCOL OVERVIEW</div><h1 className="dare-title mt-2">How Dare Protocol works</h1><p className="dare-subtitle mt-3 max-w-2xl">A dare moves through a small set of explicit on-chain states. Each state has a defined action and time window.</p>
    <section className="dare-info-steps">{steps.map(([number,title,body,Icon]) => <article key={number}><div className="dare-step-icon"><Icon /></div><div><small>STEP {number}</small><h2>{title}</h2><p>{body}</p></div></article>)}</section>
    <div className="dare-soft-card mt-4 p-4 text-xs text-slate-600">The contract defines state transitions, proof windows and payout rules. The frontend should make those rules understandable before a user signs a transaction.</div>
  </main></div>;
}
