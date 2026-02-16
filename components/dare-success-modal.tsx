"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, X, Zap } from "lucide-react";
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Card */}
          <motion.div
            className="relative w-full max-w-sm rounded-3xl border border-pink-500/40 bg-gradient-to-b from-neutral-950 via-neutral-950 to-black shadow-[0_0_80px_rgba(236,72,153,0.45)] px-5 py-6"
            initial={{ scale: 0.85, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 10 }}
            transition={{ type: "spring", stiffness: 210, damping: 20 }}
          >
            {/* close button */}
            <button
              onClick={onClose}
              className="absolute right-3 top-3 rounded-full bg-black/60 p-1 text-gray-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>

            {/* glow ring + icon */}
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-pink-500/15 relative">
              <div className="absolute inset-0 rounded-full bg-pink-500/40 blur-xl opacity-60" />
              <motion.div
                className="relative flex h-12 w-12 items-center justify-center rounded-full bg-black"
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.05 }}
              >
                <CheckCircle2 className="h-7 w-7 text-pink-400" />
              </motion.div>
            </div>

            <div className="text-center space-y-2">
              <p className="text-xs uppercase tracking-[0.2em] text-pink-400 flex items-center justify-center gap-1">
                <Zap className="h-3 w-3" />
                Dare created
              </p>
              <h2 className="text-xl font-semibold text-white">
                You’re officially live
              </h2>
              <p className="text-sm text-gray-300">
                Your dare is on‑chain on Base Sepolia. Share it or wait for someone
                to match your stake.
              </p>
            </div>

            {txHash && (
              <a
                href={`https://sepolia.basescan.org/tx/${txHash}`}
                target="_blank"
                rel="noreferrer"
                className="mt-4 block rounded-xl border border-neutral-800 bg-neutral-900/80 px-3 py-2 text-xs text-gray-400 hover:border-pink-500/60 hover:text-pink-100 transition-colors"
              >
                View transaction on BaseScan
              </a>
            )}

            <div className="mt-5 flex items-center gap-2">
              <Button
                className="flex-1 h-10 bg-pink-500 text-white hover:bg-pink-500/90 text-sm"
                onClick={onClose}
              >
                Back to feed
              </Button>
              <Button
                variant="outline"
                className="h-10 border-neutral-700 bg-neutral-950 text-xs text-gray-200 hover:border-pink-500/60"
                onClick={onClose}
              >
                Stay here
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
