"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createConfig, http } from "wagmi";
import { baseSepolia } from "viem/chains";
import { ReactNode, useState } from "react";
import { WagmiProvider } from "wagmi";
import { coinbaseWallet, walletConnect } from "wagmi/connectors";
import { Web3Provider } from "@/lib/web3-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { MotionLayout } from "@/components/motion-layout";
import { OnchainKitProvider } from "@coinbase/onchainkit";

const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

const connectors = [
  coinbaseWallet({ appName: "Dare Protocol" }),
  ...(walletConnectProjectId
    ? [
        walletConnect({
          projectId: walletConnectProjectId,
          showQrModal: true,
        }),
      ]
    : []),
];

const config = createConfig({
  chains: [baseSepolia],
  connectors,
  transports: {
    [baseSepolia.id]: http(),
  },
  multiInjectedProviderDiscovery: true,
});

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 10,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <ThemeProvider>
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
            <Web3Provider>
              <MotionLayout>{children}</MotionLayout>
            </Web3Provider>
          </OnchainKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </ThemeProvider>
  );
}
