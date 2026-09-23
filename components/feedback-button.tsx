// components/feedback-button.tsx
"use client";

import { MessageCircle } from "lucide-react";

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
      title="Give Feedback"
      className="fixed right-3 sm:right-6 bottom-[calc(5rem+env(safe-area-inset-bottom))] sm:bottom-6 z-[999] feedback-breathe glass-card-interactive group flex h-10 w-10 items-center justify-center rounded-full border border-blue-200/90 bg-white/95 text-[#0052FF] shadow-[0_6px_20px_rgba(0,82,255,0.14)] hover:border-[#0052FF]/50 hover:bg-blue-50/80 active:scale-90 transition-all duration-300 cursor-pointer touch-manipulation"
    >
      <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 border border-blue-200/80">
        <div className="absolute inset-0.5 rounded-full bg-blue-400/10 blur-xs" />
        <MessageCircle className="relative z-10 h-4 w-4 stroke-[2.5]" />
      </div>
    </button>
  );
}
