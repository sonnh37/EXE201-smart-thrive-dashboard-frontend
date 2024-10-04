"use client";
import { RefreshProvider } from "@/components/common/refresh-context";
import { QueryClient } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { usePathname } from "next/navigation"; 
import { Toaster } from "sonner";
import "./globals.css";
const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const param = usePathname();
  const isAuthPage = param.startsWith("/auth");

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
            <RefreshProvider>{children}</RefreshProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
      <Toaster />
    </html>
  );
}
