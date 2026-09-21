// app/explore/page.tsx
"use client";

import { Header } from "@/components/header";
import { DareFeed } from "@/components/dare-feed";

export default function ExplorePage() {
  return (
    <div className="dare-light-shell">
      <Header />
      <main className="dare-page-wide dare-explore-page">
        <DareFeed />
      </main>
    </div>
  );
}
