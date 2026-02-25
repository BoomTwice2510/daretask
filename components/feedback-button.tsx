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
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, rating }),
      });

      alert("Thanks for the feedback 🚀");
      e.currentTarget.reset();
      setOpen(false);
    } catch (err) {
      alert("not send, try again.");
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
            right-6 bottom-24   /* footer se upar */
            z-[999]
            flex items-center gap-2
            rounded-full
            px-4 py-2.5
            text-sm font-semibold
            text-black
            shadow-[0_0_30px_rgba(250,204,21,0.8)]
            bg-gradient-to-r from-[#facc15] via-[#f5d566] to-[#d4af37]
            border border-[#facc15]/70
            hover:brightness-110
            transition
          "
        >
          <MessageCircle className="h-4 w-4" />
          <span>Give Feedback</span>
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-md border border-[#facc15]/40 bg-[#050505] text-sm">
        <DialogTitle className="text-base font-semibold mb-2 text-[#f5d566]">
          Help us make Dare Protocol better
        </DialogTitle>
        <p className="text-xs text-white/60 mb-3">
          Bugs, UI issues, suggestions – No login, no
          email.
        </p>

        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label className="text-xs font-medium mb-1 block">Feedback</label>
            <Textarea
              name="message"
              required
              placeholder="Example: Mobile pe leaderboard cut ho raha hai..."
              className="min-h-[90px] resize-none border border-white/10 bg-black/60 text-xs"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-medium">Rating:</label>
            <select
              name="rating"
              className="flex-1 rounded-lg border border-white/15 bg-black/60 p-2 text-xs"
            >
              <option value="">Select...</option>
              <option value="5">⭐⭐⭐⭐⭐ Amazing</option>
              <option value="4">⭐⭐⭐⭐ Good</option>
              <option value="3">⭐⭐⭐ Okay</option>
              <option value="2">⭐⭐ Meh</option>
              <option value="1">⭐ Bad</option>
            </select>
          </div>

          <Button
            type="submit"
            className="w-full h-9 text-xs font-semibold bg-gradient-to-r from-[#facc15] via-[#f5d566] to-[#d4af37] text-black"
            disabled={loading}
          >
            {loading ? "Sending..." : "Submit feedback"}
          </Button>
        </form>

        <p className="mt-2 text-[10px] text-white/40 text-center">
          Purely anonymous – no EMAIL no WALLET , only Honest reviews. Thanks DEGEN
        </p>
      </DialogContent>
    </Dialog>
  );
}
