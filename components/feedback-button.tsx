// components/feedback-button.tsx
"use client";

import { MessageCircle } from "lucide-react";

export function FeedbackButton() {
  const handleClick = () => {
    // Google Form direct new tab me khulega
    window.open("https://forms.gle/qZwanj9ahozZ2yhb7", "_blank", "noopener,noreferrer");
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="
        fixed
        right-5 bottom-20
        z-[999]
        flex items-center gap-1.5
        rounded-full
        px-3.5 py-2
        text-xs font-semibold
        text-black
        shadow-[0_0_22px_rgba(250,204,21,0.8)]
        bg-gradient-to-r from-[#facc15] via-[#f5d566] to-[#d4af37]
        border border-[#facc15]/70
        hover:brightness-110
        transition
      "
    >
      <MessageCircle className="h-3.5 w-3.5" />
      <span>Feedback</span>
    </button>
  );
}
