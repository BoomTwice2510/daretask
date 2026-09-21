"use client";

import { Header } from "@/components/header";
import { ChevronDown, HelpCircle } from "lucide-react";
import { useState } from "react";

const faqs = [
  ["What is Dare Protocol?", "A Base-native challenge system where a creator defines a task, stake, duration and proof requirements before another person accepts."],
  ["What can I stake?", "The app supports ETH and the configured ERC-20 tokens shown in the create flow."],
  ["How long can a dare run?", "The available duration is defined by the create flow and contract rules."],
  ["What happens when proof is required?", "The accepter submits a proof reference during the configured proof window for review."],
  ["Who resolves a dispute?", "The creator can resolve a valid proof or dispute it. Contract rules determine the judge path when a dispute remains."],
  ["Can I cancel after someone accepts?", "Once a matching stake is locked, cancellation is governed by the on-chain state and contract rules."],
] as const;

export default function FAQ() {
  const [open,setOpen]=useState(0);
  return <div className="dare-light-shell"><Header /><main className="dare-page"><div className="dare-eyebrow">HELP</div><h1 className="dare-title mt-2 max-w-xl">Frequently asked questions</h1><p className="dare-subtitle mt-3">The rules users should understand before locking funds.</p><section className="dare-faq-list">{faqs.map(([q,a],i)=><div key={q} className="dare-faq-item"><button onClick={()=>setOpen(open===i?-1:i)}><span><HelpCircle />{q}</span><ChevronDown className={open===i?'rotate-180':''}/></button>{open===i&&<p>{a}</p>}</div>)}</section><div className="dare-note">Proof is evidence for human review, not an automatic oracle. Keep claims specific, time-bounded and inspectable.</div></main></div>;
}
