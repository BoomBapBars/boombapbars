import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://boombapbars.com"),
  title: {
    default: "BoomBapBars — Golden Age Streetwear for DJs & Hip-Hop Heads",
    template: "%s · BoomBapBars",
  },
  description:
    "Golden-age hip-hop, DJ, and turntablist inspired streetwear. New Drop Fridays. The Real Alternative Facts.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "https://boombapbars.com/",
    siteName: "BoomBapBars",
    title: "BoomBapBars — Golden Age Streetwear for DJs & Hip-Hop Heads",
    description:
      "Golden-age hip-hop, DJ, and turntablist inspired streetwear. New Drop Fridays. The Real Alternative Facts.",
    images: [
      {
        url: "/house.jpg",
        width: 1200,
        height: 630,
        alt: "BoomBapBars product collage",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@BoomBapBars",
    creator: "@BoomBapBars",
    title: "BoomBapBars — Golden Age Streetwear for DJs & Hip-Hop Heads",
    description:
      "Golden-age hip-hop, DJ, and turntablist inspired streetwear. New Drop Fridays.",
    images: ["/house.jpg"],
  },
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
