"use client";
import AdminPanelLayout from "@/components/common/admin-panel-layout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

const queryClient = new QueryClient();

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AdminPanelLayout>{children}</AdminPanelLayout>
    </QueryClientProvider>
  );
};

export default AuthLayout;
