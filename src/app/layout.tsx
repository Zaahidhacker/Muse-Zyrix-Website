import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import { FAQ } from "@/lib/content";
import "./globals.css";

/*
 * Type: ONE typeface — Manrope (landing-page skill B1). The taste deal's
 * first pairing (Instrument Serif / Instrument Sans) conflicts with B1's
 * one-typeface/no-italics rule, which the parent brief made non-negotiable,
 * so Manrope replaces the printed Hanken Grotesk, keeping the dealt
 * weights/tracking. See PLAN.md (theme redesign, 2026-11-21).
 */
const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Zyrix® | Web Design Sri Lanka from LKR 15,000",
  description:
    "Premium websites at half the 2026 market rate. Built for Sri Lankan businesses.",
  metadataBase: new URL("https://www.zyrix-agency.online"),
  openGraph: {
    title: "Zyrix® | Web Design Sri Lanka from LKR 15,000",
    description:
      "Premium websites at half the 2026 market rate. Built for Sri Lankan businesses.",
    type: "website",
    url: "https://www.zyrix-agency.online",
    images: [{ url: "/share.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Zyrix® | Web Design Sri Lanka from LKR 15,000",
    description:
      "Premium websites at half the 2026 market rate. Built for Sri Lankan businesses.",
    images: ["/share.jpg"],
  },
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#101d49",
};

/** FAQPage JSON-LD (AEO) — the site's 5 Q&As, exact from CONTENT.md. */
function FaqJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-type="service"
      data-radius="soft"
      data-buttons="tonal"
      className={`${manrope.variable} h-full antialiased`}
    >
      <head>
        <meta name="page-type" content="service" />
        <meta name="site-kind" content="other" />
        <FaqJsonLd />
      </head>
      <body className="min-h-full">
        {children}
      </body>
    </html>
  );
}
