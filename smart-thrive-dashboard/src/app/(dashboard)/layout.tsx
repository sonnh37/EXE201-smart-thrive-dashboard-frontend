"use client";
import AdminPanelLayout from "@/components/common/admin-panel-layout";
import { RefreshProvider } from "@/components/common/refresh-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import React from "react";

const queryClient = new QueryClient();

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" enableSystem={true} defaultTheme="light">
        <RefreshProvider>
          <QueryClientProvider client={queryClient}>
            <AdminPanelLayout>{children}</AdminPanelLayout>
          </QueryClientProvider>
        </RefreshProvider>
      </ThemeProvider>
    </SessionProvider>
  );
};

export default AuthLayout;
