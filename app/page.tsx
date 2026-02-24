import type { Metadata } from "next";
import HomePageClient from "./home-client";

const appUrl = "https://dareprotocol.com";

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
  },
};

export default function HomePage() {
  return <HomePageClient />;
}
