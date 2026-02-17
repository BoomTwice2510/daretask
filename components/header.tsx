"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useWeb3 } from "@/lib/web3-provider";
import { shortenAddress } from "@/lib/helpers";
import { Button } from "@/components/ui/button";
import {
  Wallet,
  LogOut,
  User,
  Trophy,
  Plus,
  Menu,
  X,
  AlertCircle,
  Home,
  HelpCircle,
  Info,
  BookOpenText,
  Network,
  Link2,
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

const BASE_SEPOLIA_PARAMS = {
  chainIdHex: "0x14a34", // 84532
  chainIdDec: 84532,
  chainName: "Base Sepolia",
  rpcUrl: "https://sepolia.base.org",
  nativeSymbol: "ETH",
  blockExplorerUrl: "https://sepolia.basescan.org",
};

export function Header() {
  const {
    address,
    isConnected,
    isConnecting,
    connect,
    disconnect,
    chain,
    switchChain,
  } = useWeb3();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { toast } = useToast();
  const pathname = usePathname();

  const getChainId = () => {
    if (!chain?.id) return null;
    if (typeof chain.id === "number") return chain.id;
    if (typeof chain.id === "string") {
      return parseInt(chain.id, 16); // "0x14a34" -> 84532
    }
    return null;
  };

  const chainId = getChainId();
  const isBaseSepolia = chainId === BASE_SEPOLIA_PARAMS.chainIdDec;

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const currentChainLabel = isBaseSepolia
    ? "Base Sepolia"
    : chain?.name
    ? chain.name
    : "No network";

  async function handleConnect() {
    try {
      await connect();
      toast({
        title: "Wallet connected",
        description: "You’re ready to create and accept dares.",
      });
    } catch {
      toast({
        variant: "destructive",
        title: "Connection failed",
        description: "User rejected or wallet error.",
      });
    }
  }

  async function handleDisconnect() {
    try {
      await disconnect();
      toast({
        title: "Wallet disconnected",
        description: "You can reconnect any time.",
      });
    } catch {
      toast({
        variant: "destructive",
        title: "Could not disconnect",
        description: "Please try again.",
      });
    }
  }

  // Try switch to Base Sepolia using wallet API (via web3-provider’s switchChain or raw window.ethereum)
  async function handleSwitchToBaseSepolia() {
    try {
      if (switchChain) {
        await switchChain(BASE_SEPOLIA_PARAMS.chainIdDec);
      } else if (typeof window !== "undefined" && (window as any).ethereum) {
        await (window as any).ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: BASE_SEPOLIA_PARAMS.chainIdHex }],
        });
      }
      toast({
        title: "Network switched",
        description: "Switched to Base Sepolia.",
      });
    } catch (err: any) {
      // 4902 = chain not added
      if (err?.code === 4902 || err?.message?.includes("not added")) {
        await handleAddBaseSepolia();
      } else {
        toast({
          variant: "destructive",
          title: "Switch failed",
          description: "Could not switch to Base Sepolia.",
        });
      }
    }
  }

  // Add Base Sepolia as custom chain
  async function handleAddBaseSepolia() {
    try {
      if (typeof window === "undefined" || !(window as any).ethereum) {
        throw new Error("No wallet found");
      }
      await (window as any).ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: BASE_SEPOLIA_PARAMS.chainIdHex,
            chainName: BASE_SEPOLIA_PARAMS.chainName,
            rpcUrls: [BASE_SEPOLIA_PARAMS.rpcUrl],
            nativeCurrency: {
              name: "Sepolia Ether",
              symbol: BASE_SEPOLIA_PARAMS.nativeSymbol,
              decimals: 18,
            },
            blockExplorerUrls: [BASE_SEPOLIA_PARAMS.blockExplorerUrl],
          },
        ],
      });
      toast({
        title: "Base Sepolia added",
        description: "Network added to your wallet. You can now switch to it.",
      });
    } catch {
      toast({
        variant: "destructive",
        title: "Add network failed",
        description: "Could not add Base Sepolia to your wallet.",
      });
    }
  }

  return (
    <>
      {/* Top header */}
      <header className="sticky top-0 z-50 border-b border-[rgba(212,175,55,0.25)] bg-black/85 backdrop-blur-2xl">
        <div className="h-16 md:h-14 flex items-center justify-between px-4 md:px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="rounded-full overflow-hidden w-9 h-9 md:w-9 md:h-9 flex-shrink-0 bg-black border border-[rgba(212,175,55,0.6)] shadow-[0_0_20px_rgba(212,175,55,0.45)]">
              <Image
                src="/images/logo-gold.png"
                alt="Dare Protocol"
                width={36}
                height={36}
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            </div>
            <span
              className="text-xs md:text-sm font-semibold hidden md:inline whitespace-nowrap"
              style={{
                background: "linear-gradient(to right,#f5d566,#e6c547,#d4af37)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Dare Protocol
            </span>
          </Link>

          {/* Desktop center nav */}
          <nav className="hidden lg:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className={cn(
                "h-9 px-3 text-xs md:text-sm rounded-full",
                isActive("/")
                  ? "text-black bg-[#f5d566] shadow-[0_0_18px_rgba(245,213,102,0.7)]"
                  : "text-white/65 hover:text-[#f5d566] hover:bg-white/5"
              )}
            >
              <Link href="/">Browse</Link>
            </Button>

            <Button
              asChild
              variant="ghost"
              size="sm"
              className={cn(
                "h-9 px-3 text-xs md:text-sm rounded-full",
                isActive("/create")
                  ? "text-black bg-[#f5d566] shadow-[0_0_18px_rgba(245,213,102,0.7)]"
                  : "text-white/65 hover:text-[#f5d566] hover:bg-white/5"
              )}
            >
              <Link href="/create">Create</Link>
            </Button>

            {isConnected && address && (
              <Button
                asChild
                variant="ghost"
                size="sm"
                className={cn(
                  "h-9 px-3 text-xs md:text-sm rounded-full",
                  isActive("/profile")
                    ? "text-black bg-[#f5d566] shadow-[0_0_18px_rgba(245,213,102,0.7)]"
                    : "text-white/65 hover:text-[#f5d566] hover:bg-white/5"
                )}
              >
                <Link href={`/profile/${address}`}>
                  <User className="mr-1 h-4 w-4" />
                  Profile
                </Link>
              </Button>
            )}

            <Button
              asChild
              variant="ghost"
              size="sm"
              className={cn(
                "h-9 px-3 text-xs md:text-sm rounded-full",
                isActive("/leaderboard")
                  ? "text-black bg-[#f5d566] shadow-[0_0_18px_rgba(245,213,102,0.7)]"
                  : "text-white/65 hover:text-[#f5d566] hover:bg-white/5"
              )}
            >
              <Link href="/leaderboard">
                <Trophy className="mr-1 h-4 w-4" />
                Leaderboard
              </Link>
            </Button>

            <Button
              asChild
              variant="ghost"
              size="sm"
              className={cn(
                "h-9 px-3 text-xs md:text-sm rounded-full",
                isActive("/how-it-works")
                  ? "text-black bg-[#f5d566] shadow-[0_0_18px_rgba(245,213,102,0.7)]"
                  : "text-white/65 hover:text-[#f5d566] hover:bg-white/5"
              )}
            >
              <Link href="/how-it-works">How It Works</Link>
            </Button>

            <Button
              asChild
              variant="ghost"
              size="sm"
              className={cn(
                "h-9 px-3 text-xs md:text-sm rounded-full",
                isActive("/faq")
                  ? "text-black bg-[#f5d566] shadow-[0_0_18px_rgba(245,213,102,0.7)]"
                  : "text-white/65 hover:text-[#f5d566] hover:bg-white/5"
              )}
            >
              <Link href="/faq">FAQ</Link>
            </Button>

            <Button
              asChild
              variant="ghost"
              size="sm"
              className={cn(
                "h-9 px-3 text-xs md:text-sm rounded-full",
                isActive("/legal")
                  ? "text-black bg-[#f5d566] shadow-[0_0_18px_rgba(245,213,102,0.7)]"
                  : "text-white/65 hover:text-[#f5d566] hover:bg-white/5"
              )}
            >
              <Link href="/legal">Legal</Link>
            </Button>

            {isConnected && address && (
              <Button
                asChild
                variant="ghost"
                size="sm"
                className={cn(
                  "h-9 px-3 text-xs md:text-sm rounded-full",
                  isActive("/debug")
                    ? "text-black bg-[#f97373] bg-red-500/20 shadow-[0_0_18px_rgba(249,115,115,0.7)]"
                    : "text-white/65 hover:text-[#f97373] hover:bg-red-500/10"
                )}
              >
                <Link href="/debug">Debug</Link>
              </Button>
            )}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2 ml-auto">
            {/* Chain pill (desktop & md+) */}
            <div className="hidden sm:flex items-center rounded-full border border-white/10 bg-black/70 px-2.5 py-1 text-[11px] text-white/65">
              <span
                className={cn(
                  "inline-flex h-1.5 w-1.5 rounded-full mr-1.5",
                  isBaseSepolia ? "bg-emerald-400" : "bg-yellow-400"
                )}
              />
              {currentChainLabel}
            </div>

            {isConnected && address ? (
              <div className="flex items-center gap-2">
                <Link href={`/profile/${address}`} className="hidden md:block">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 px-2.5 font-mono text-xs border-[rgba(212,175,55,0.5)] text-[#f5f5f5] bg-black/80 hover:bg-black/60"
                  >
                    {shortenAddress(address)}
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleDisconnect}
                  className="h-9 w-9 text-white/60 hover:text-[#f97373] hidden md:flex"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button
                onClick={handleConnect}
                disabled={isConnecting}
                size="sm"
                className="h-9 px-3 text-xs md:text-sm font-semibold shadow-[0_10px_30px_rgba(212,175,55,0.45)]"
                style={{
                  background: "linear-gradient(135deg,#d4af37,#e6c547)",
                  color: "#000",
                }}
              >
                <Wallet className="mr-1 h-4 w-4" />
                <span className="hidden sm:inline">
                  {isConnecting ? "Connecting..." : "Connect Wallet"}
                </span>
                <span className="sm:hidden">
                  {isConnecting ? "..." : "Connect"}
                </span>
              </Button>
            )}

            {/* Compact chain+wallet for xs */}
            {isConnected && address && (
              <div className="flex sm:hidden items-center gap-1">
                <div className="flex items-center rounded-full border border-white/10 bg-black/70 px-2 py-0.5 text-[10px] text-white/65">
                  <span
                    className={cn(
                      "inline-flex h-1.5 w-1.5 rounded-full mr-1",
                      isBaseSepolia ? "bg-emerald-400" : "bg-yellow-400"
                    )}
                  />
                  {isBaseSepolia
                    ? "Base Sepolia"
                    : chain?.name
                    ? chain.name.replace("Base ", "")
                    : "Net"}
                </div>
                <Button
                  asChild
                  variant="outline"
                  size="icon"
                  className="h-8 w-16 border-[rgba(212,175,55,0.5)] bg-black/80 text-[10px] font-mono text-[#f5f5f5]"
                >
                  <Link href={`/profile/${address}`}>
                    {shortenAddress(address).slice(0, 6)}…
                  </Link>
                </Button>
              </div>
            )}

            {/* Hamburger */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden h-9 w-9 text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile hamburger sheet: How/FAQ/Legal/Debug + wallet/network controls */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[rgba(212,175,55,0.25)] bg-black/95 px-4 py-3 backdrop-blur-xl space-y-3">
            {/* Wallet / network controls */}
            <div className="flex flex-col gap-2 rounded-xl border border-[rgba(212,175,55,0.35)] bg-[rgba(5,5,5,0.96)] p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-white/70">
                  <Network className="h-4 w-4 text-[#f5d566]" />
                  <span>{currentChainLabel}</span>
                </div>
                {isBaseSepolia ? (
                  <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                    <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    On Base Sepolia
                  </span>
                ) : (
                  <span className="text-[10px] text-yellow-300 flex items-center gap-1">
                    <span className="inline-flex h-1.5 w-1.5 rounded-full bg-yellow-300" />
                    Wrong Network
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-1.5 mt-1">
                {!isBaseSepolia && (
                  <Button
                    size="sm"
                    className="w-full h-8 text-xs bg-[#f5d566] text-black hover:bg-[#e6c547]"
                    onClick={handleSwitchToBaseSepolia}
                  >
                    Switch to Base Sepolia
                  </Button>
                )}
                {!isBaseSepolia && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full h-8 text-xs border-white/15 text-white/80 hover:border-[rgba(245,213,102,0.7)]"
                    onClick={handleAddBaseSepolia}
                  >
                    <Link2 className="h-3.5 w-3.5 mr-1" />
                    Add Base Sepolia to Wallet
                  </Button>
                )}

                {!isConnected ? (
                  <Button
                    size="sm"
                    className="w-full h-8 text-xs bg-[#f5d566] text-black hover:bg-[#e6c547]"
                    onClick={handleConnect}
                    disabled={isConnecting}
                  >
                    <Wallet className="h-3.5 w-3.5 mr-1" />
                    {isConnecting ? "Connecting..." : "Connect Wallet"}
                  </Button>
                ) : (
                  <div className="flex gap-2 mt-1">
                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                      className="flex-1 h-8 text-[11px] border-[rgba(212,175,55,0.5)] text-[#f5f5f5] bg-black/80"
                    >
                      <Link href={`/profile/${address}`}>
                        <User className="h-3.5 w-3.5 mr-1" />
                        {shortenAddress(address)}
                      </Link>
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 px-2 text-[11px] text-red-400 hover:bg-red-500/10"
                      onClick={handleDisconnect}
                    >
                      <LogOut className="h-3.5 w-3.5 mr-1" />
                      Logout
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Links: How / FAQ / Legal / Debug */}
            <nav className="flex flex-col gap-1">
              <Button
                asChild
                variant="ghost"
                className={cn(
                  "w-full justify-start text-sm h-9",
                  isActive("/how-it-works")
                    ? "text-[#f5d566] bg-white/5"
                    : "text-white/80 hover:text-[#f5d566]"
                )}
              >
                <Link href="/how-it-works" onClick={() => setMobileMenuOpen(false)}>
                  <HelpCircle className="mr-2 h-4 w-4" />
                  How It Works
                </Link>
              </Button>

              <Button
                asChild
                variant="ghost"
                className={cn(
                  "w-full justify-start text-sm h-9",
                  isActive("/faq")
                    ? "text-[#f5d566] bg-white/5"
                    : "text-white/80 hover:text-[#f5d566]"
                )}
              >
                <Link href="/faq" onClick={() => setMobileMenuOpen(false)}>
                  <BookOpenText className="mr-2 h-4 w-4" />
                  FAQ
                </Link>
              </Button>

              <Button
                asChild
                variant="ghost"
                className={cn(
                  "w-full justify-start text-sm h-9",
                  isActive("/legal")
                    ? "text-[#f5d566] bg-white/5"
                    : "text-white/80 hover:text-[#f5d566]"
                )}
              >
                <Link href="/legal" onClick={() => setMobileMenuOpen(false)}>
                  <Info className="mr-2 h-4 w-4" />
                  Legal Disclaimer
                </Link>
              </Button>

              {isConnected && address && (
                <Button
                  asChild
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-sm h-9",
                    isActive("/debug")
                      ? "text-[#f97373] bg-red-500/10"
                      : "text-white/60 hover:text-[#f97373]"
                  )}
                >
                  <Link href="/debug" onClick={() => setMobileMenuOpen(false)}>
                    <AlertCircle className="mr-2 h-4 w-4" />
                    Debug
                  </Link>
                </Button>
              )}
            </nav>
          </div>
        )}
      </header>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-[rgba(212,175,55,0.25)] bg-black/95 backdrop-blur-xl lg:hidden">
        <div className="flex items-stretch justify-around h-14 px-2">
          <Link
            href="/"
            className={cn(
              "flex flex-1 flex-col items-center justify-center text-[10px] gap-0.5",
              isActive("/") ? "text-[#f5d566]" : "text-white/60 hover:text-[#f5d566]"
            )}
          >
            <Home
              className={cn(
                "h-5 w-5",
                isActive("/") ? "text-[#f5d566]" : "text-white/60"
              )}
            />
            <span>Home</span>
          </Link>

          <Link
            href="/create"
            className={cn(
              "flex flex-1 flex-col items-center justify-center text-[10px] gap-0.5",
              isActive("/create")
                ? "text-[#f5d566]"
                : "text-white/60 hover:text-[#f5d566]"
            )}
          >
            <span className={cn(
              "h-5 w-5 rounded-full border border-[#f5d566] flex items-center justify-center text-lg leading-none",
              isActive("/create") ? "text-[#f5d566]" : "text-white/60"
            )}>
              +
            </span>
            <span>Create</span>
          </Link>

          <Link
            href={isConnected && address ? `/profile/${address}` : "/"}
            className={cn(
              "flex flex-1 flex-col items-center justify-center text-[10px] gap-0.5",
              isActive("/profile")
                ? "text-[#f5d566]"
                : "text-white/60 hover:text-[#f5d566]"
            )}
          >
            <User
              className={cn(
                "h-5 w-5",
                isActive("/profile") ? "text-[#f5d566]" : "text-white/60"
              )}
            />
            <span>Profile</span>
          </Link>

          <Link
            href="/leaderboard"
            className={cn(
              "flex flex-1 flex-col items-center justify-center text-[10px] gap-0.5",
              isActive("/leaderboard")
                ? "text-[#f5d566]"
                : "text-white/60 hover:text-[#f5d566]"
            )}
          >
            <Trophy
              className={cn(
                "h-5 w-5",
                isActive("/leaderboard") ? "text-[#f5d566]" : "text-white/60"
              )}
            />
            <span>Leaders</span>
          </Link>
        </div>
      </nav>
    </>
  );
}
