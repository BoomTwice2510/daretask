"use client";

import { Header } from "@/components/header";
import { CreateDareForm } from "@/components/create-dare-form";
import { ArrowLeft, CheckCircle2, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

export default function CreateDarePage() {
  return (
    <div className="min-h-screen bg-[#f7f9fc] text-[#10213f]">
      <Header />

      <main className="mx-auto w-full max-w-[1240px] px-4 pb-28 pt-6 sm:px-6 lg:px-8 lg:pb-16 lg:pt-10">
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#6d7d97] transition hover:text-[#1268f3]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to explore
          </Link>

          <div className="hidden items-center gap-2 rounded-full border border-[#d9e2f0] bg-white px-3 py-1.5 text-xs font-semibold text-[#49617f] shadow-sm sm:inline-flex">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Base Sepolia
          </div>
        </div>

        <section className="mb-7 grid gap-6 lg:grid-cols-[1fr_360px] lg:items-end">
          <div>
            <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#1268f3]">
              Create a dare
            </div>
            <h1 className="text-3xl font-extrabold tracking-[-0.035em] text-[#10213f] sm:text-4xl lg:text-[44px] lg:leading-[1.05]">
              Put a real stake behind a clear commitment.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#60718c] sm:text-base">
              Define exactly what must happen, set the time window and stake, then review the full dare before anything is signed on-chain.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-[#dce5f1] bg-white p-4 shadow-[0_8px_30px_rgba(35,65,110,0.06)]">
              <CheckCircle2 className="mb-2 h-5 w-5 text-[#1268f3]" />
              <div className="text-sm font-bold text-[#173154]">Clear rules</div>
              <div className="mt-1 text-xs leading-5 text-[#71819a]">Accepter sees the same requirements.</div>
            </div>
            <div className="rounded-2xl border border-[#dce5f1] bg-white p-4 shadow-[0_8px_30px_rgba(35,65,110,0.06)]">
              <ShieldCheck className="mb-2 h-5 w-5 text-[#1268f3]" />
              <div className="text-sm font-bold text-[#173154]">Proof first</div>
              <div className="mt-1 text-xs leading-5 text-[#71819a]">Confirm it is actually provable before creation.</div>
            </div>
          </div>
        </section>

        <Suspense fallback={<div className="rounded-3xl border border-[#dce5f1] bg-white p-8 text-sm text-[#71819a]">Loading create form...</div>}>
          <CreateDareForm />
        </Suspense>
      </main>
    </div>
  );
}
