"use client";
import { RefreshProvider } from "@/components/common/refresh-context";
import { QueryClient } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { usePathname } from "next/navigation";
import { Toaster } from "sonner";
import "./globals.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Const } from "@/lib/const";
const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const param = usePathname();
  const isAuthPage = param.startsWith("/auth");
  const clientId = Const.CLIENT_ID;
  return (
    <html lang="en">
      <head>
        <title>Smart Thrive</title>
      </head>
      <body className={``}>
        <GoogleOAuthProvider clientId={clientId ?? ""}>
          <SessionProvider>
            <ThemeProvider
              attribute="class"
              enableSystem={true}
              defaultTheme="light"
            >
              <RefreshProvider>{children}</RefreshProvider>
            </ThemeProvider>
          </SessionProvider>
        </GoogleOAuthProvider>
      </body>
      <Toaster />
    </html>
  );
}
