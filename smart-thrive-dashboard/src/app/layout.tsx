"use client"
import localFont from "next/font/local";
import "./globals.css";
import {RefreshProvider} from "@/components/common/refresh-context";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import AdminPanelLayout from "@/components/common/admin-panel-layout";
import {SessionProvider} from "next-auth/react";
import {ThemeProvider} from "next-themes";

const queryClient = new QueryClient();

const geistSans = localFont({
    src: "./fonts/GeistVF.woff",
    variable: "--font-geist-sans",
    weight: "100 900",
});
const geistMono = localFont({
    src: "./fonts/GeistMonoVF.woff",
    variable: "--font-geist-mono",
    weight: "100 900",
});


export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <head>
            <title>Smart Thrive</title>
        </head>
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
        <SessionProvider>
            <ThemeProvider
                attribute="class"
                enableSystem={true}
                defaultTheme="light"
            >
                <RefreshProvider>
                    <QueryClientProvider client={queryClient}>
                        <AdminPanelLayout>{children}</AdminPanelLayout>
                    </QueryClientProvider>
                </RefreshProvider>
            </ThemeProvider>
        </SessionProvider>
        </body>
        </html>
    );
}
