// src/app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import AuthWrapper from "@/components/AuthWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// metadata без themeColor
export const metadata: Metadata = {
  title: "Talk to aliens",
  description: "Funny language exchange app",
  manifest: "/manifest.json",
  icons: [
    { rel: "icon", url: "/icons/icon-192x192.png" },
    { rel: "apple-touch-icon", url: "/icons/icon-192x192.png" },
  ],
};

// viewport с themeColor
export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FFDF20",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Можно оставить для гарантии */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#FFDF20" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthWrapper>
          {children}
          <BottomNav />
        </AuthWrapper>
      </body>
    </html>
  );
}
