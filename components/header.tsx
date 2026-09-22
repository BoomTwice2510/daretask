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
  Sparkles,
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
      <header className="mobile-safe-header sticky top-0 z-50 w-full border-b border-white/80 bg-white/80 backdrop-blur-2xl shadow-[0_4px_20px_-2px_rgba(15,23,42,0.03)] transition-all">
        <div className="mx-auto flex h-14 md:h-16 w-full max-w-[1440px] min-w-0 items-center justify-between gap-2 px-2.5 sm:px-6 md:px-8">
          
          {/* Brand Logo with Gentle Float */}
          <Link
            href="/"
            className="group flex min-w-0 shrink items-center gap-2 transition-transform active:scale-95 cursor-pointer"
            aria-label="Dare Protocol Home"
          >
            <div className="relative flex h-9 w-9 md:h-10 md:w-10 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-white via-blue-50/60 to-blue-100/50 p-1 shadow-[0_4px_14px_rgba(0,82,255,0.08)] ring-1 ring-black/5 group-hover:scale-105 group-hover:shadow-[0_6px_18px_rgba(0,82,255,0.16)] transition-all duration-300">
              <Image
                src="/images/logo-gold.png"
                alt="Dare"
                width={36}
                height={36}
                priority
                className="h-7 w-7 md:h-8 md:w-8 object-contain transition-transform group-hover:rotate-6 duration-300"
              />
            </div>
            <div className="flex min-w-0 flex-col leading-none">
              <div className="flex items-center gap-1.5">
                <strong className="truncate text-sm sm:text-base md:text-lg font-black tracking-tight text-slate-900">
                  Dare
                </strong>
                <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-md bg-blue-50/90 text-[#0052FF] border border-blue-100/60 shadow-xs">
                  <span className="h-1 w-1 rounded-full bg-[#0052FF]" /> Base
                </span>
              </div>
              <small className="hidden md:block text-[8.5px] font-bold tracking-[0.16em] text-slate-400 uppercase mt-0.5">
                ON-CHAIN DARES
              </small>
            </div>
          </Link>

          {/* Desktop Floating Pill Navigation */}
          <nav
            className="hidden md:flex items-center gap-1 rounded-full bg-slate-50/70 p-1 border border-slate-200/60 backdrop-blur-md shadow-[inset_0_1px_3px_rgba(15,23,42,0.03)]"
            aria-label="Primary navigation"
          >
            {desktopLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer",
                  isActive(item.href)
                    ? "bg-white text-[#0052FF] shadow-[0_2px_10px_rgba(0,82,255,0.12)] font-bold ring-1 ring-blue-100/70 scale-[1.02]"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/60 hover:scale-[1.01]"
                )}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href={`/profile/${address || ""}`}
              className={cn(
                "px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer",
                isActive("/profile")
                  ? "bg-white text-[#0052FF] shadow-[0_2px_10px_rgba(0,82,255,0.12)] font-bold ring-1 ring-blue-100/70 scale-[1.02]"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/60",
                !address && "pointer-events-none opacity-40"
              )}
            >
              Profile
            </Link>
            <Link
              href="/how-it-works"
              className={cn(
                "px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer",
                isActive("/how-it-works")
                  ? "bg-white text-[#0052FF] shadow-[0_2px_10px_rgba(0,82,255,0.12)] font-bold ring-1 ring-blue-100/70 scale-[1.02]"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
              )}
            >
              How It Works
            </Link>
            <Link
              href="/faq"
              className={cn(
                "px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer",
                isActive("/faq")
                  ? "bg-white text-[#0052FF] shadow-[0_2px_10px_rgba(0,82,255,0.12)] font-bold ring-1 ring-blue-100/70 scale-[1.02]"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
              )}
            >
              FAQ
            </Link>
          </nav>

          {/* Action Header Pills */}
          <div className="flex min-w-0 shrink-0 items-center gap-1 md:gap-2">
            {/* Live On-Chain Radar Status Pill */}
            <span
              className={cn(
                "mobile-chain-status inline-flex h-8 md:h-9 max-w-[86px] sm:max-w-none items-center gap-1.5 rounded-full px-2 md:px-3 text-[10px] md:text-xs font-semibold border backdrop-blur-md transition-all shadow-xs",
                !isConnected
                  ? "border-slate-200/70 bg-white/80 text-slate-500"
                  : isBaseSepolia
                  ? "border-emerald-200/80 bg-emerald-50/70 text-emerald-800 shadow-[0_2px_8px_rgba(16,185,129,0.08)]"
                  : "border-amber-200 bg-amber-50 text-amber-800"
              )}
            >
              <span className="relative flex h-2 w-2">
                {isConnected && (
                  <span
                    className={cn(
                      "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
                      isBaseSepolia ? "bg-emerald-400" : "bg-amber-400"
                    )}
                  />
                )}
                <span
                  className={cn(
                    "relative inline-flex h-2 w-2 rounded-full",
                    !isConnected
                      ? "bg-slate-300"
                      : isBaseSepolia
                      ? "bg-emerald-500"
                      : "bg-amber-500"
                  )}
                />
              </span>
              <span className="mobile-chain-label truncate max-w-[58px] sm:max-w-[85px]">
                {currentChain}
              </span>
            </span>

            {/* Wallet Address & Disconnect */}
            {isConnected && address ? (
              <div className="flex items-center gap-1.5">
                <Link
                  href={`/profile/${address}`}
                  className="mobile-wallet-link inline-flex h-8 md:h-9 items-center rounded-full bg-white/90 border border-slate-200/80 px-3 font-mono text-[11px] md:text-xs font-bold text-slate-800 shadow-xs hover:border-[#0052FF]/40 hover:text-[#0052FF] hover:scale-[1.02] active:scale-95 transition-all"
                >
                  {shortenAddress(address)}
                </Link>
                <button
                  type="button"
                  onClick={handleDisconnect}
                  className="hidden md:flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/80 bg-white/90 text-slate-400 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50/60 active:scale-90 hover:scale-105 transition-all cursor-pointer shadow-xs"
                  aria-label="Disconnect wallet"
                  title="Disconnect wallet"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <Button
                onClick={handleConnect}
                disabled={isConnecting}
                className="mobile-connect-button relative min-w-0 overflow-hidden h-8 md:h-9 rounded-full bg-gradient-to-b from-[#0052FF] to-[#0045d8] hover:to-[#003bb8] text-white px-2.5 sm:px-3.5 md:px-4.5 text-[11px] sm:text-xs font-bold shadow-[0_4px_16px_rgba(0,82,255,0.25)] transition-all hover:shadow-[0_6px_20px_rgba(0,82,255,0.35)] active:scale-95 cursor-pointer"
              >
                <div className="mr-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-white/20">
                  <Wallet className="h-2.5 w-2.5 stroke-[2.5]" />
                </div>
                {isConnecting ? "Connecting..." : "Connect"}
              </Button>
            )}

            {/* Mobile Menu Trigger */}
            <button
              type="button"
              className="mobile-menu-trigger grid md:hidden h-11 w-11 shrink-0 place-items-center rounded-xl border border-slate-200/80 bg-white/95 text-slate-700 shadow-xs active:scale-95 transition-all cursor-pointer"
              onClick={() => setMenuOpen((value) => !value)}
              aria-label="Open menu"
            >
              {menuOpen ? <X className="h-4 w-4 transition-transform rotate-90" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu with Slide & Fade Animation */}
        {menuOpen && (
          <div className="animate-menu-slide md:hidden border-t border-slate-100 bg-white/95 px-3.5 py-3 backdrop-blur-2xl shadow-xl">
            <div className="grid grid-cols-2 gap-2">
              {[
                ...desktopLinks,
                { href: "/profile", label: "Profile" },
                { href: "/how-it-works", label: "How It Works" },
                { href: "/faq", label: "FAQ" },
                { href: "/legal", label: "Legal" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={
                    item.href === "/profile" && address
                      ? `/profile/${address}`
                      : item.href
                  }
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    "mobile-menu-link flex min-h-11 items-center justify-center rounded-xl border border-slate-100 bg-slate-50/70 py-2.5 px-3 text-xs font-bold text-slate-700 transition-all active:scale-95",
                    isActive(item.href) &&
                      "bg-blue-50/90 text-[#0052FF] border-blue-200/80 font-black shadow-xs"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {isConnected && address && (
              <button
                type="button"
                className="mobile-menu-link mt-2.5 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-rose-50/80 border border-rose-200/70 py-2.5 text-xs font-bold text-rose-600 transition-all active:scale-95 cursor-pointer"
                onClick={() => {
                  setMenuOpen(false);
                  handleDisconnect();
                }}
              >
                <LogOut className="h-3.5 w-3.5" /> Disconnect wallet
              </button>
            )}
          </div>
        )}
      </header>

      {/* Mobile PWA Floating Bottom Navigation Bar with Breathing Pulse Glow on Center FAB */}
      <nav
        className="mobile-bottom-nav fixed inset-x-0 bottom-0 z-50 grid md:hidden grid-cols-5 items-center bg-white/95 backdrop-blur-xl border-t border-slate-200/80 px-2 pt-1 pb-[calc(0.5rem+env(safe-area-inset-bottom))] shadow-[0_-6px_24px_rgba(15,23,42,0.06)]"
        aria-label="Mobile navigation"
      >
        <Link
          href="/"
          className={cn(
            "mobile-nav-item group flex min-w-0 min-h-11 flex-col items-center justify-center gap-0.5 py-1 transition-transform active:scale-95",
            isActive("/") ? "text-[#0052FF]" : "text-slate-400 hover:text-slate-600"
          )}
        >
          <div
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-xl transition-all duration-200",
              isActive("/")
                ? "bg-blue-50/90 border border-blue-200/80 shadow-[0_2px_8px_rgba(0,82,255,0.15)] text-[#0052FF] scale-105"
                : "bg-transparent text-slate-400 group-hover:text-slate-600"
            )}
          >
            <Home className="h-4 w-4 stroke-[2.2]" />
          </div>
          <span className="text-[9.5px] font-bold tracking-tight">Home</span>
        </Link>

        <Link
          href="/explore"
          className={cn(
            "mobile-nav-item group flex min-w-0 min-h-11 flex-col items-center justify-center gap-0.5 py-1 transition-transform active:scale-95",
            isActive("/explore") ? "text-[#0052FF]" : "text-slate-400 hover:text-slate-600"
          )}
        >
          <div
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-xl transition-all duration-200",
              isActive("/explore")
                ? "bg-blue-50/90 border border-blue-200/80 shadow-[0_2px_8px_rgba(0,82,255,0.15)] text-[#0052FF] scale-105"
                : "bg-transparent text-slate-400 group-hover:text-slate-600"
            )}
          >
            <Compass className="h-4 w-4 stroke-[2.2]" />
          </div>
          <span className="text-[9.5px] font-bold tracking-tight">Explore</span>
        </Link>

        {/* Center Elevating Action Button: Create with Animated Pulse Glow */}
        <div className="flex items-center justify-center">
          <Link
            href="/create"
            className="mobile-nav-create animate-pulse-glow flex h-11 w-11 -translate-y-3 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0052FF] via-[#0048e6] to-[#0038b8] text-white ring-4 ring-white active:scale-90 transition-all duration-200 cursor-pointer"
            aria-label="Create a dare"
          >
            <Plus className="h-5 w-5 stroke-[2.8]" />
          </Link>
        </div>

        <Link
          href="/leaderboard"
          className={cn(
            "mobile-nav-item group flex min-w-0 min-h-11 flex-col items-center justify-center gap-0.5 py-1 transition-transform active:scale-95",
            isActive("/leaderboard") ? "text-[#0052FF]" : "text-slate-400 hover:text-slate-600"
          )}
        >
          <div
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-xl transition-all duration-200",
              isActive("/leaderboard")
                ? "bg-violet-50/90 border border-violet-200/80 shadow-[0_2px_8px_rgba(139,92,246,0.15)] text-violet-600 scale-105"
                : "bg-transparent text-slate-400 group-hover:text-slate-600"
            )}
          >
            <Trophy className="h-4 w-4 stroke-[2.2]" />
          </div>
          <span className="text-[9.5px] font-bold tracking-tight">Leaders</span>
        </Link>

        <Link
          href={address ? `/profile/${address}` : "/profile"}
          className={cn(
            "mobile-nav-item group flex min-w-0 min-h-11 flex-col items-center justify-center gap-0.5 py-1 transition-transform active:scale-95",
            isActive("/profile") ? "text-[#0052FF]" : "text-slate-400 hover:text-slate-600"
          )}
        >
          <div
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-xl transition-all duration-200",
              isActive("/profile")
                ? "bg-blue-50/90 border border-blue-200/80 shadow-[0_2px_8px_rgba(0,82,255,0.15)] text-[#0052FF] scale-105"
                : "bg-transparent text-slate-400 group-hover:text-slate-600"
            )}
          >
            <User className="h-4 w-4 stroke-[2.2]" />
          </div>
          <span className="text-[9.5px] font-bold tracking-tight">Profile</span>
        </Link>
      </nav>
    </>
  );
}