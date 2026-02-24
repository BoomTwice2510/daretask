// app/explore/page.tsx
"use client";

import { Header } from "@/components/header";
import { DareFeed } from "@/components/dare-feed";

export default function ExplorePage() {
  return (
    <div className="min-h-screen bg-black text-foreground">
      <Header />
      <main className="mx-auto max-w-4xl px-4 pb-24 pt-6">
        <DareFeed />
      </main>
    </div>
  );
}
