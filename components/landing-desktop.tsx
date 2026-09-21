"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Globe2, LockKeyhole, Plus, ShieldCheck, Trophy, Zap } from "lucide-react";


export function LandingDesktop() {
  return (
    <main className="dare-wide dare-home-desktop">
      <section className="dare-home-hero">
        <div className="dare-home-hero-copy">
          <div className="dare-eyebrow">BASE · REAL STAKES · CLEAR PROOF</div>
          <h1>Dare someone.<br /><span>Prove it.</span></h1>
          <p>Turn real commitments into matched-stake challenges. The rules are visible, the money is escrowed, and the proof is defined before anyone accepts.</p>
          <div className="dare-home-actions">
            <Link href="/create"><Button className="dare-primary-button"><Plus className="h-4 w-4" />Create a Dare</Button></Link>
            <Link href="/explore" className="dare-secondary-button">Explore Dares <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>
        <div className="dare-home-points">
          <div><span>♙</span><strong>Real People</strong></div>
          <div><span>ϟ</span><strong>Real Stakes</strong></div>
          <div><span>✓</span><strong>Clear Proof</strong></div>
          <div><span>◉</span><strong>Built on Base</strong></div>
        </div>
      </section>

      <section className="dare-stats-grid">
        {[["1,284","Dares Created"],["342","Active"],["$24.8k","Total Staked"],["98%","Completed"]].map(([value,label]) => (
          <div key={label} className="dare-stat"><strong>{value}</strong><span>{label}</span></div>
        ))}
      </section>

      <section className="dare-home-info-grid">
        <div className="dare-info-card"><Zap /><h3>How it works</h3><ol><li>Create a dare with description, duration and stake.</li><li>Someone accepts and locks the matching stake.</li><li>They submit proof on time or you win by default.</li><li>Creator or judge resolves the outcome.</li></ol></div>
        <div className="dare-info-card"><ShieldCheck /><h3>Protocol details</h3><ul><li>Deployed on Base Sepolia.</li><li>ETH and supported ERC-20 tokens.</li><li>XP, badges and limits reduce spam.</li><li>Outcomes are enforced on-chain.</li></ul></div>
        <div className="dare-info-card"><Globe2 /><h3>Quick guide</h3><ol><li>Connect your wallet on Base Sepolia.</li><li>Use Explore to browse live dares.</li><li>Create a clear, verifiable challenge.</li><li>Share the dare with friends or Farcaster.</li></ol></div>
      </section>
    </main>
  );
}
