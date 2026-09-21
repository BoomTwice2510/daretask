"use client";

import type { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";

export function MotionLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="relative min-h-screen w-full overflow-x-clip bg-white">
      {/* Global Subtle Ambient Glow Drift for Living Glass Canvas */}
      <div className="pointer-events-none fixed -top-32 -left-32 h-[450px] w-[450px] rounded-full bg-gradient-to-br from-blue-200/20 via-indigo-100/15 to-transparent blur-3xl animate-drift" />
      <div
        className="pointer-events-none fixed top-1/3 -right-32 h-[500px] w-[500px] rounded-full bg-gradient-to-bl from-rose-100/15 via-amber-100/15 to-blue-100/15 blur-3xl animate-drift"
        style={{ animationDelay: "-7s" }}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 8, scale: 0.995 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -6, scale: 0.998 }}
          transition={{
            duration: 0.22,
            ease: [0.16, 1, 0.3, 1], // iOS style smooth fluid ease
          }}
          className="relative z-10 flex min-h-screen w-full flex-col"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}