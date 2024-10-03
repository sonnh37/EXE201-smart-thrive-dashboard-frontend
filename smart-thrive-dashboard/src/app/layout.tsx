"use client";
import "./globals.css";
import { RefreshProvider } from "@/components/common/refresh-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AdminPanelLayout from "@/components/common/admin-panel-layout";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import AuthLayout from "@/app/auth/layout"; // Import AuthLayout
import { usePathname } from "next/navigation"; // Import useRouter

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const param = usePathname();
  const isAuthPage = param.startsWith('/auth'); // Determine if it's an auth page

  return (
    <html lang="en">
      <head>
        <title>Smart Thrive</title>
      </head>
      <body className={``}>
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            enableSystem={true}
            defaultTheme="light"
          >
            <RefreshProvider>
              <QueryClientProvider client={queryClient}>
                {isAuthPage ? (
                  <AuthLayout>{children}</AuthLayout> // Use AuthLayout for auth pages
                ) : (
                  <AdminPanelLayout>{children}</AdminPanelLayout> // Use AdminPanelLayout for other pages
                )}
              </QueryClientProvider>
            </RefreshProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
      <Toaster />
    </html>
  );
}
