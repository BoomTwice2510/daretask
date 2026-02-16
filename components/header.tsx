"use client";

import Image from "next/image";
import Link from "next/link";
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
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

export function Header() {
  const { address, isConnected, isConnecting, connect, disconnect } = useWeb3();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { toast } = useToast();

  async function handleConnect() {
    try {
      await connect();
      toast({
        title: "Wallet connected",
        description: "You’re ready to create and accept dares.",
      });
    } catch (error) {
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
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Could not disconnect",
        description: "Please try again.",
      });
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-800 bg-black/80 backdrop-blur-xl">
      <div className="h-16 md:h-14 flex items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
          <div className="rounded-md overflow-hidden w-9 h-9 md:w-8 md:h-8 flex-shrink-0 bg-neutral-900">
            <Image
              src="/images/logo.png"
              alt="Dare Protocol"
              width={36}
              height={36}
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          </div>
          <span className="text-xs md:text-base font-bold text-white hidden md:inline whitespace-nowrap">
            Dare Protocol
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="h-9 px-3 text-xs md:text-sm text-gray-400 hover:text-white"
          >
            <Link href="/">Browse</Link>
          </Button>

          <Button
            asChild
            variant="ghost"
            size="sm"
            className="h-9 px-3 text-xs md:text-sm text-gray-400 hover:text-white"
          >
            <Link href="/create">
              <Plus className="mr-1 h-4 w-4" />
              Create
            </Link>
          </Button>

          {/* Profile right after Create */}
          {isConnected && address && (
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="h-9 px-3 text-xs md:text-sm text-gray-400 hover:text-white"
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
            className="h-9 px-3 text-xs md:text-sm text-gray-400 hover:text-white"
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
            className="h-9 px-3 text-xs md:text-sm text-gray-400 hover:text-white"
          >
            <Link href="/how-it-works">How It Works</Link>
          </Button>

          <Button
            asChild
            variant="ghost"
            size="sm"
            className="h-9 px-3 text-xs md:text-sm text-gray-400 hover:text-white"
          >
            <Link href="/faq">FAQ</Link>
          </Button>

          <Button
            asChild
            variant="ghost"
            size="sm"
            className="h-9 px-3 text-xs md:text-sm text-gray-400 hover:text-white"
          >
            <Link href="/legal">Legal</Link>
          </Button>

          {isConnected && address && (
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="h-9 px-3 text-xs md:text-sm text-gray-400 hover:text-white"
            >
              <Link href="/debug">
                <AlertCircle className="h-4 w-4" />
              </Link>
            </Button>
          )}
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-2 ml-auto">
          {isConnected && address ? (
            <div className="flex items-center gap-2">
              <Link href={`/profile/${address}`} className="hidden md:block">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 px-2.5 font-mono text-xs border-neutral-700 text-white bg-neutral-900 hover:bg-neutral-800"
                >
                  {shortenAddress(address)}
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDisconnect}
                className="h-9 w-9 text-gray-400 hover:text-red-500 hidden md:flex"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button
              onClick={handleConnect}
              disabled={isConnecting}
              size="sm"
              className="h-9 px-3 bg-primary text-primary-foreground hover:bg-primary/90 text-xs md:text-sm"
            >
              <Wallet className="mr-1 h-4 w-4" />
              <span className="hidden sm:inline">
                {isConnecting ? "Connecting..." : "Connect"}
              </span>
              <span className="sm:hidden">
                {isConnecting ? "..." : "Connect"}
              </span>
            </Button>
          )}

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

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-neutral-800 bg-black/95 px-4 py-3">
          <nav className="flex flex-col gap-1">
            <Button
              asChild
              variant="ghost"
              className="w-full justify-start text-sm h-9 text-gray-200"
            >
              <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                Browse Dares
              </Link>
            </Button>

            <Button
              asChild
              variant="ghost"
              className="w-full justify-start text-sm h-9 text-gray-200"
            >
              <Link href="/create" onClick={() => setMobileMenuOpen(false)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Dare
              </Link>
            </Button>

            {/* Profile right after Create (mobile) */}
            {isConnected && address && (
              <Button
                asChild
                variant="ghost"
                className="w-full justify-start text-sm h-9 text-gray-200"
              >
                <Link
                  href={`/profile/${address}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </Button>
            )}

            <Button
              asChild
              variant="ghost"
              className="w-full justify-start text-sm h-9 text-gray-200"
            >
              <Link href="/leaderboard" onClick={() => setMobileMenuOpen(false)}>
                <Trophy className="mr-2 h-4 w-4" />
                Leaderboard
              </Link>
            </Button>

            <Button
              asChild
              variant="ghost"
              className="w-full justify-start text-sm h-9 text-gray-200"
            >
              <Link href="/how-it-works" onClick={() => setMobileMenuOpen(false)}>
                How It Works
              </Link>
            </Button>

            <Button
              asChild
              variant="ghost"
              className="w-full justify-start text-sm h-9 text-gray-200"
            >
              <Link href="/faq" onClick={() => setMobileMenuOpen(false)}>
                FAQ
              </Link>
            </Button>

            <Button
              asChild
              variant="ghost"
              className="w-full justify-start text-sm h-9 text-gray-200"
            >
              <Link href="/legal" onClick={() => setMobileMenuOpen(false)}>
                Legal Disclaimer
              </Link>
            </Button>

            <Button
              asChild
              variant="ghost"
              className="w-full justify-start text-sm h-9 text-gray-400"
            >
              <Link href="/debug" onClick={() => setMobileMenuOpen(false)}>
                <AlertCircle className="mr-2 h-4 w-4" />
                Debug
              </Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
