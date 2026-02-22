"use client";

import { ReactNode } from "react";
import { Web3Provider } from "@/lib/web3-provider";
import { MotionLayout } from "@/components/motion-layout";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export function Providers({ children }: { children: ReactNode }) {
  return (
      <QueryClientProvider client={queryClient}>
        <Web3Provider>
          <MotionLayout>{children}</MotionLayout>
          <Toaster />
        </Web3Provider>
      </QueryClientProvider>
  );
}
