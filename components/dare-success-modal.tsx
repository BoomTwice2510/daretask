"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, X, Zap, ExternalLink, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type DareSuccessModalProps = {
  open: boolean;
  onClose: () => void;
  txHash?: string;
};

export function DareSuccessModal({ open, onClose, txHash }: DareSuccessModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 backdrop-blur-xl p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Card Shell with Pure White Frosted Glass */}
          <motion.div
            className="glass-panel relative w-full max-w-sm rounded-[32px] p-6 sm:p-7 shadow-[0_24px_80px_rgba(15,23,42,0.18)]"
            initial={{ scale: 0.88, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 12 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full border border-slate-200/70 bg-white/90 text-slate-400 hover:text-slate-900 hover:bg-slate-50 active:scale-90 transition-all shadow-xs cursor-pointer"
              aria-label="Close modal"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Bigger 3D Glass Celebration Node with Micro-Glow */}
            <div className="relative mx-auto mb-5 flex h-20 w-20 items-center justify-center">
              {/* Outer Ambient Aura */}
              <div className="absolute inset-0 rounded-full bg-emerald-400/25 blur-xl animate-pulse" />

              {/* Multi-layer Frosted Container */}
              <motion.div
                className="relative flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-50 via-white to-emerald-100/80 border border-emerald-200/90 text-emerald-600 shadow-[0_6px_24px_rgba(16,185,129,0.22)]"
                initial={{ scale: 0, rotate: -15 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 280, damping: 18, delay: 0.08 }}
              >
                <div className="absolute inset-1 rounded-2xl bg-emerald-400/10 blur-xs" />
                <CheckCircle2 className="relative z-10 h-8 w-8 stroke-[2.4]" />
              </motion.div>
            </div>

            {/* Typography & Details */}
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50/90 border border-emerald-200/80 px-3 py-0.5 text-[10.5px] font-black uppercase tracking-[0.16em] text-emerald-700 shadow-xs">
                <Zap className="h-3 w-3 fill-emerald-500" />
                Dare Created
              </div>
              
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 leading-tight">
                You’re Officially Live
              </h2>
              
              <p className="text-xs sm:text-sm leading-relaxed text-slate-500 font-medium">
                Your challenge is locked into escrow on Base Sepolia. Share the dare or wait for a challenger to match your stake.
              </p>
            </div>

            {/* BaseScan Explorer Pill */}
            {txHash && (
              <a
                href={`https://sepolia.basescan.org/tx/${txHash}`}
                target="_blank"
                rel="noreferrer"
                className="mt-4 flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white/90 p-3 text-xs font-bold text-[#0052FF] hover:bg-slate-50 hover:border-[#0052FF]/30 shadow-xs transition-all cursor-pointer"
              >
                <span>View on BaseScan</span>
                <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
              </a>
            )}

            {/* Action Buttons */}
            <div className="mt-6 flex items-center gap-2.5">
              <Button
                className="animate-pulse-glow flex-1 h-11 rounded-2xl bg-gradient-to-b from-[#0052FF] to-[#0045d8] hover:to-[#003bb8] text-white text-xs sm:text-sm font-black shadow-[0_6px_20px_rgba(0,82,255,0.28)] active:scale-[0.98] transition-all cursor-pointer"
                onClick={onClose}
              >
                <span>Back to Feed</span>
                <ArrowRight className="ml-1 h-4 w-4 stroke-[2.5]" />
              </Button>
              
              <Button
                variant="outline"
                className="h-11 rounded-2xl border-slate-200 bg-white/90 px-4 text-xs font-bold text-slate-600 hover:bg-slate-50 active:scale-[0.98] cursor-pointer"
                onClick={onClose}
              >
                Stay Here
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}