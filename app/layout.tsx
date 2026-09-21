// app/layout.tsx - Pure White Frosted Glass Architecture with Analytics & PWA optimization
import type { Metadata, Viewport } from "next";
// @ts-ignore -- Next.js handles global CSS imports at build time.
import "./globals.css";
import { Providers } from "./providers";
import { Inter } from "next/font/google";
import { FeedbackButton } from "@/components/feedback-button";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
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
      splashBackgroundColor: "#FFFFFF",
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFFFFF" },
    { media: "(prefers-color-scheme: dark)", color: "#FFFFFF" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: "Dare Protocol - Stake. Dare. Win.",
  description:
    "Dare Protocol turns measurable commitments into matched-stake challenges with clear proof paths on Base.",
  applicationName: "Dare Protocol",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Dare Protocol",
  },
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
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <meta name="base:app_id" content="697782ba88e3bac59cf3d9c8" />

        {/* Talent Protocol Verification */}
        <meta
          name="talentapp:project_verification"
          content="2ebf03996d850c884f6183eb2455c2e2f7f2bceb4a541675b8cdfc30d57764b607c5c6cc09ef50b4323e60b45cd654d9ceb67f7157069cdbfe7f5ce46d058db7"
        />
      </head>
      <body className="min-h-screen bg-white text-slate-900 font-sans antialiased selection:bg-blue-100 selection:text-[#0052FF] overflow-x-clip">
        <Providers>{children}</Providers>
        <FeedbackButton />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}