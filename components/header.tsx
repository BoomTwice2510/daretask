"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useWeb3 } from "@/lib/web3-provider";
import { shortenAddress } from "@/lib/helpers";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import {
  Compass,
  Home,
  LogOut,
  Menu,
  Plus,
  Trophy,
  User,
  Wallet,
  X,
} from "lucide-react";
import { useState } from "react";

const BASE_SEPOLIA_PARAMS = {
  chainIdHex: "0x14a34",
  chainIdDec: 84532,
  chainName: "Base Sepolia",
  rpcUrl: "https://sepolia.base.org",
  nativeSymbol: "ETH",
  blockExplorerUrl: "https://sepolia.basescan.org",
};

const desktopLinks = [
  { href: "/", label: "Home" },
  { href: "/explore", label: "Explore" },
  { href: "/create", label: "Create" },
  { href: "/leaderboard", label: "Leaderboard" },
];

export function Header() {
  const { address, isConnected, isConnecting, connect, disconnect, chainId } =
    useWeb3();
  const { toast } = useToast();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const isBaseSepolia = chainId === BASE_SEPOLIA_PARAMS.chainIdDec;
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const currentChain = !isConnected
    ? "Connect wallet"
    : isBaseSepolia
      ? "Base Sepolia"
      : "Wrong network";

  async function handleConnect() {
    try {
      await connect();
    } catch {
      toast({
        variant: "destructive",
        title: "Connection failed",
        description: "The wallet connection was cancelled or failed.",
      });
    }
  }

  async function handleDisconnect() {
    try {
      await disconnect();
    } catch {
      toast({
        variant: "destructive",
        title: "Could not disconnect",
        description: "Please try again.",
      });
    }
  }

  return (
    <>
      <header className="dare-header sticky top-0 z-50">
        <div className="dare-header-inner">
          <Link href="/" className="dare-brand" aria-label="Dare home">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl">
              <Image
                src="/images/logo-gold.png"
                alt="Dare"
                width={44}
                height={44}
                priority
                className="h-11 w-11 object-contain"
              />
            </span>
            <span className="dare-brand-copy">
              <strong>Dare</strong>
              <small>ON-CHAIN DARES</small>
            </span>
          </Link>

          <nav className="dare-desktop-nav" aria-label="Primary navigation">
            {desktopLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn("dare-nav-link", isActive(item.href) && "is-active")}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href={`/profile/${address || ""}`}
              className={cn(
                "dare-nav-link",
                isActive("/profile") && "is-active",
                !address && "pointer-events-none opacity-50",
              )}
            >
              Profile
            </Link>
            <Link
              href="/how-it-works"
              className={cn("dare-nav-link", isActive("/how-it-works") && "is-active")}
            >
              How It Works
            </Link>
            <Link href="/faq" className={cn("dare-nav-link", isActive("/faq") && "is-active")}>
              FAQ
            </Link>
            <Link href="/legal" className={cn("dare-nav-link", isActive("/legal") && "is-active")}>
              Legal
            </Link>
          </nav>

          <div className="dare-header-actions">
            <span className={cn("dare-network-pill", !isBaseSepolia && isConnected && "is-warning")}>
              <span className="dare-network-dot" />
              {currentChain}
            </span>
            {isConnected && address ? (
              <>
                <Link href={`/profile/${address}`} className="dare-address-pill">
                  {shortenAddress(address)}
                </Link>
                <button
                  type="button"
                  className="dare-icon-button desktop-only"
                  onClick={handleDisconnect}
                  aria-label="Disconnect wallet"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </>
            ) : (
              <Button
                onClick={handleConnect}
                disabled={isConnecting}
                className="dare-connect-button"
              >
                <Wallet className="mr-1.5 h-4 w-4" />
                {isConnecting ? "Connecting" : "Connect"}
              </Button>
            )}
            <button
              type="button"
              className="dare-menu-button"
              onClick={() => setMenuOpen((value) => !value)}
              aria-label="Open menu"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="dare-mobile-menu">
            <div className="dare-mobile-menu-grid">
              {[...desktopLinks, { href: "/profile", label: "Profile" }, { href: "/how-it-works", label: "How It Works" }, { href: "/faq", label: "FAQ" }, { href: "/legal", label: "Legal" }].map(
                (item) => (
                  <Link
                    key={item.href}
                    href={item.href === "/profile" && address ? `/profile/${address}` : item.href}
                    onClick={() => setMenuOpen(false)}
                    className={cn("dare-mobile-menu-link", isActive(item.href) && "is-active")}
                  >
                    {item.label}
                  </Link>
                ),
              )}
            </div>
            {isConnected && address && (
              <button type="button" className="dare-mobile-logout" onClick={handleDisconnect}>
                <LogOut className="h-4 w-4" /> Disconnect wallet
              </button>
            )}
          </div>
        )}
      </header>

      <nav className="dare-mobile-bottom-nav" aria-label="Mobile navigation">
        <Link href="/" className={cn("dare-bottom-item", isActive("/") && "is-active")}>
          <Home />
          <span>Home</span>
        </Link>
        <Link href="/explore" className={cn("dare-bottom-item", isActive("/explore") && "is-active")}>
          <Compass />
          <span>Explore</span>
        </Link>
        <Link href="/create" className="dare-bottom-create" aria-label="Create a dare">
          <Plus />
        </Link>
        <Link href="/leaderboard" className={cn("dare-bottom-item", isActive("/leaderboard") && "is-active")}>
          <Trophy />
          <span>Leaders</span>
        </Link>
        <Link
          href={address ? `/profile/${address}` : "/"}
          className={cn("dare-bottom-item", isActive("/profile") && "is-active")}
        >
          <User />
          <span>Profile</span>
        </Link>
      </nav>
    </>
  );
}
