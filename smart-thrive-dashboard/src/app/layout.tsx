"use client";
import {RefreshProvider} from "@/components/common/refresh-context";
import {Const} from "@/lib/const";
import {GoogleOAuthProvider} from "@react-oauth/google";
import {SessionProvider} from "next-auth/react";
import {ThemeProvider} from "next-themes";
import {Toaster} from "sonner";
import "./globals.css";
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';
import { Provider } from 'react-redux';
import store from "@/lib/store";
export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
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
                    <RefreshProvider>
                        <Provider store={store}>
                            {children}
                        </Provider>
                    </RefreshProvider>
                </ThemeProvider>
            </SessionProvider>
        </GoogleOAuthProvider>
        </body>
        <Toaster position="top-center"/>
        </html>
    );
}
