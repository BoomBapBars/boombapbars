// app/layout.tsx
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
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "https://boombapbars.com/",
    siteName: "BoomBapBars",
    title: "BoomBapBars — Golden Age Streetwear for DJs & Hip-Hop Heads",
    description:
      "Golden-age hip-hop, DJ, and turntablist inspired streetwear. New Drop Fridays. The Real Alternative Facts.",
    images: [{ url: "/house.jpg", width: 1200, height: 630, alt: "BoomBapBars product collage" }],
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

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        // Fallback colors so the site is dark even if Tailwind/PostCSS isn’t running yet
        style={{ backgroundColor: "#111827", color: "#e5e7eb" }} // gray-900 / gray-200
        suppressHydrationWarning
      >
        {/* JSON-LD (Brand) */}
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "BoomBapBars",
              url: "https://boombapbars.com",
              logo: "https://boombapbars.com/house.jpg",
              sameAs: ["https://instagram.com/boombapbars"],
            }),
          }}
        />
        {/* JSON-LD (Website) */}
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "BoomBapBars",
              url: "https://boombapbars.com",
              potentialAction: {
                "@type": "SearchAction",
                target: "https://boombapbars.com/?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
        {children}
      </body>
    </html>
  );
}
