"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { SessionProvider } from "next-auth/react";
import { HeaderActionsProvider } from "./context/HeaderActionsContext";
import React, { ReactNode } from "react";

<<<<<<< Updated upstream
const Providers = ({ children }: { children: ReactNode }) => {
  const queryClient = new QueryClient({
=======
const Providers = ({ children }: { children: ReactNode}) => {
  const [queryClient] = React.useState(() => new QueryClient({
>>>>>>> Stashed changes
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 3, // 3 minutes
      },
    },
  }));
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
