"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, Plus, ShieldCheck, Trophy, Zap } from "lucide-react";


export function LandingMobile() {
  return (
    <main className="dare-mobile-home">
      <section className="dare-mobile-hero">
        <div className="dare-eyebrow">BASE · REAL STAKES · CLEAR PROOF</div>
        <h1>Dare someone.<br /><span>Prove it.</span></h1>
        <p>Turn real commitments into matched-stake challenges.</p>
        <div className="dare-mobile-actions">
          <Link href="/create"><button><Plus /> Create</button></Link>
          <Link href="/explore"><button className="secondary">Explore <ArrowRight /></button></Link>
        </div>
      </section>

      <section className="dare-mobile-stats">
        <div><strong>1,284</strong><span>Dares</span></div><div><strong>342</strong><span>Active</span></div><div><strong>$24.8k</strong><span>Staked</span></div>
      </section>

      <section className="dare-mobile-info"><div><Zap /><b>How it works</b><p>Create a dare, match the stake, submit proof, resolve the outcome.</p></div><div><ShieldCheck /><b>Trustless rules</b><p>The contract controls the stake and payout after creation.</p></div><div><Trophy /><b>Earn XP</b><p>Win dares to build your on-chain reputation.</p></div></section>
    </main>
  );
}
