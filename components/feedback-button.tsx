// components/feedback-button.tsx
"use client";

import { MessageCircle, Sparkles } from "lucide-react";

export function FeedbackButton() {
  const handleClick = () => {
    // Google Form direct new tab me khulega
    window.open(
      "https://forms.gle/qZwanj9ahozZ2yhb7",
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Give Feedback"
      className="
        fixed
        right-4 sm:right-6
        bottom-[calc(5.2rem+env(safe-area-inset-bottom))] sm:bottom-6
        z-[999]
        glass-card-interactive
        group
        flex min-h-11 items-center gap-2.5
        rounded-full
        p-1.5 pr-4
        text-xs font-black
        text-slate-800
        border border-white/90
        bg-white/85
        backdrop-blur-sm md:backdrop-blur-2xl
        shadow-[0_8px_30px_rgba(15,23,42,0.12)]
        hover:border-[#0052FF]/40
        hover:text-[#0052FF]
        hover:shadow-[0_12px_36px_rgba(0,82,255,0.18)]
        active:scale-95
        transition-all duration-300
        cursor-pointer
        touch-manipulation
      "
    >
      {/* 3D Layered Micro-Glass Icon Container */}
      <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-50 via-white to-blue-100/70 border border-blue-200/80 text-[#0052FF] shadow-xs group-hover:scale-105 group-hover:rotate-6 transition-all duration-300">
        <div className="absolute inset-0.5 rounded-full bg-blue-400/10 blur-xs" />
        <MessageCircle className="relative z-10 h-4 w-4 stroke-[2.4]" />
      </div>

      {/* Button Label & Live Pulsing Indicator */}
      <div className="flex min-w-0 items-center gap-1.5">
        <span className="tracking-tight font-black text-slate-900 group-hover:text-[#0052FF] transition-colors">
          Feedback
        </span>
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#0052FF] opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-[#0052FF]" />
        </span>
      </div>
    </button>
  );
}