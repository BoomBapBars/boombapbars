// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import { Inter, Bebas_Neue } from "next/font/google";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const bebas = Bebas_Neue({ weight: "400", subsets: ["latin"], variable: "--font-bebas" });

export const metadata: Metadata = {
  title: "BoomBapBars",
  description: "Truth in threads. New Drop Fridays. BoomBapBars.com",
  metadataBase: new URL("https://www.boombapbars.com"),
  openGraph: {
    title: "BoomBapBars",
    description: "Truth in threads. New Drop Fridays.",
    url: "https://www.boombapbars.com",
    siteName: "BoomBapBars",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "BoomBapBars" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BoomBapBars",
    description: "Truth in threads. New Drop Fridays.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${bebas.variable}`}>
      <body className="bg-bbb-950 text-bbb-50">
        {/* global ambient background */}
        <div className="bbb-bg fixed inset-0 -z-50" aria-hidden />
        <SiteHeader />

        <main className="mx-auto min-h-[calc(100dvh-160px)] w-full max-w-7xl px-4 pt-6 pb-16">
          {children}
        </main>

        <SiteFooter />
      </body>
    </html>
  );
}
