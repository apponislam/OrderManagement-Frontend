import type { Metadata } from "next";
import { Geist, Geist_Mono, Figtree } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ReduxProviders } from "@/providers/ReduxProvider";

const figtree = Figtree({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: {
        default: "SmartInv | Order & Inventory Management",
        template: "%s | SmartInv",
    },
    description: "Streamline your business with SmartInv - Advanced Order and Inventory Management System",
    icons: {
        icon: [
            { url: "/order-management-11.png", sizes: "32x32" },
            { url: "/favicon.ico", sizes: "any" },
        ],
        shortcut: "/favicon.ico",
        apple: "/order-management-11.png",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", figtree.variable)}>
            <body className="min-h-full flex flex-col">
                <ReduxProviders>{children}</ReduxProviders>
            </body>
        </html>
    );
}
