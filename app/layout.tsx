// app/layout.tsx - Complete with Analytics + Speed Insights (named import fix)
import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { Inter } from "next/font/google";
import { FeedbackButton } from "@/components/feedback-button";
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';  // Named import (braces ke saath)

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

const appUrl = "https://www.dareprotocol.com";

const dareMiniAppEmbed = {
  version: "next",
  imageUrl: `${appUrl}/images/hero.png`,
  button: {
    title: "Open Dare Protocol",
    action: {
      type: "launch_miniapp",
      name: "Dare Protocol",
      url: appUrl,
      splashImageUrl: `${appUrl}/images/splash.png`,
      splashBackgroundColor: "#0d1117",
    },
  },
};

export const metadata: Metadata = {
  title: "Dare Protocol - Stake. Dare. Win.",
  description:
    "Dare platform on Base. Stake. Dare. Win. Create and accept dares, stake crypto, and earn XP badges.",
  other: {
    "fc:miniapp": JSON.stringify(dareMiniAppEmbed),
    "fc:frame": JSON.stringify(dareMiniAppEmbed),
    "base:app_id": "697782ba88e3bac59cf3d9c8",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="base:app_id" content="697782ba88e3bac59cf3d9c8" />
      </head>
      <body className={inter.className}>
        <Providers>{children}</Providers>
        <FeedbackButton />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
