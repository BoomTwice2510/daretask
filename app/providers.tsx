"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, createConfig, http } from "wagmi";
import { OnchainKitProvider } from "@coinbase/onchainkit";
import { baseSepolia } from "viem/chains";
import { ReactNode, useState } from "react";
import { Web3Provider } from "@/lib/web3-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { MotionLayout } from "@/components/motion-layout";

const config = createConfig({
  chains: [baseSepolia],
  transports: {
    [baseSepolia.id]: http(),
  },
});

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 10, // 10s fresh cache
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <ThemeProvider>
      <Web3Provider>
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <OnchainKitProvider
              apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
              chain={baseSepolia}
              config={{
                appearance: {
                  mode: "light",
                  theme: "default",
                },
              }}
            >
              <MotionLayout>{children}</MotionLayout>
            </OnchainKitProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </Web3Provider>
    </ThemeProvider>
  );
}