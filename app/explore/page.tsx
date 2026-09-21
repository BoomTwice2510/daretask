"use client";

import { Header } from "@/components/header";
import { DareFeed } from "@/components/dare-feed";

export default function ExplorePage() {
  return (
    <div className="dare-light-shell min-h-screen bg-[#f7f9fc]">
      <Header />
      <main className="mx-auto w-full max-w-[1240px] px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <DareFeed />
      </main>
    </div>
  );
}
