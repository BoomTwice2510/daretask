import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

const siteUrl = "https://daretask.vercel.app";
const ogImage = `${siteUrl}/images/hero.png`;

export const metadata: Metadata = {
  title: "Dare Protocol - Stake. Dare. Win.",
  description:
    "Dare platform on Base. Stake. Dare. Win. Create and accept dares, stake crypto, and earn XP badges.",
  manifest: "/manifest.json",
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: "Dare Protocol",
    description:
      "Create high-stakes dares with friends, stake on outcomes, and win on Base.",
    url: siteUrl,
    siteName: "Dare Protocol",
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: "Dare Protocol preview",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dare Protocol",
    description:
      "Create high-stakes dares with friends, stake on outcomes, and win on Base.",
    images: [ogImage],
  },
  other: {
    "base:app_id": "699b5910eb8da8c3b3d7b15c",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen bg-black text-white antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
