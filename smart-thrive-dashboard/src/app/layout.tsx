"use client";
import { QueryClient } from "@tanstack/react-query";
import { usePathname } from "next/navigation"; // Import useRouter
import { Toaster } from "sonner";
import "./globals.css";

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const param = usePathname();
  const isAuthPage = param.startsWith('/auth'); 

  return (
    <html lang="en">
      <head>
        <title>Smart Thrive</title>
      </head>
      <body className={``}>
        {children}
      </body>
      <Toaster />
    </html>
  );
}
