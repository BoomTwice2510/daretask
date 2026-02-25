// components/feedback-button.tsx
"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export function FeedbackButton() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const message = formData.get("message") as string;
    const rating = formData.get("rating") as string;

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, rating }),
      });

      if (!res.ok) {
        console.error("Feedback error", await res.text());
        alert("Feedback could not be sent. Please try again later.");
        return;
      }

      alert("Thank you for your feedback!");
      (e.currentTarget as HTMLFormElement).reset();
      setOpen(false);
    } catch (err) {
      console.error(err);
      alert("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
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
      </DialogTrigger>

      <DialogContent className="max-w-md border border-[#facc15]/40 bg-[#050505] text-sm text-white">
        <DialogTitle className="text-base font-semibold mb-2 text-[#f5d566]">
          Help us improve Dare Protocol
        </DialogTitle>
        <p className="text-xs text-white/70 mb-3">
          Share bugs, UX issues, or ideas. No login, no email required.
        </p>

        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label className="text-xs font-medium mb-1 block text-white/80">
              Feedback
            </label>
            <Textarea
              name="message"
              required
              placeholder="Example: On mobile the leaderboard is cut off near the bottom…"
              className="min-h-[90px] resize-none border border-white/10 bg-black/70 text-xs text-white placeholder:text-white/30"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-white/80">
              Rating
            </label>
            <select
              name="rating"
              className="flex-1 rounded-lg border border-white/20 bg-black/70 p-2 text-xs text-white"
            >
              <option value="">Select…</option>
              <option value="5">⭐⭐⭐⭐⭐ Amazing</option>
              <option value="4">⭐⭐⭐⭐ Great</option>
              <option value="3">⭐⭐⭐ Good</option>
              <option value="2">⭐⭐ Fair</option>
              <option value="1">⭐ Poor</option>
            </select>
          </div>

          <Button
            type="submit"
            className="w-full h-9 text-xs font-semibold bg-gradient-to-r from-[#facc15] via-[#f5d566] to-[#d4af37] text-black"
            disabled={loading}
          >
            {loading ? "Sending…" : "Submit feedback"}
          </Button>
        </form>

        <p className="mt-2 text-[10px] text-white/45 text-center">
          100% anonymous – only your feedback text is stored.
        </p>
      </DialogContent>
    </Dialog>
  );
}
