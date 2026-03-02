"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { SessionProvider } from "next-auth/react";
import { HeaderActionsProvider } from "./context/HeaderActionsContext";
import React, { ReactNode } from "react";

const Providers = ({ children }: { children: ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 3, // 3 minutes
      },
    },
  });
  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <HeaderActionsProvider>
          {children}
        </HeaderActionsProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </SessionProvider>
  );
};

export default Providers;
