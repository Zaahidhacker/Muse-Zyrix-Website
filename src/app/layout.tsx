import type { Metadata, Viewport } from "next";
import { Archivo, Instrument_Serif, Schibsted_Grotesk } from "next/font/google";
import "./globals.css";

/*
 * Type: first dealt pairing Schibsted Grotesk (text + UI); display in
 * Archivo condensed (width axis) to keep the live site's monumental
 * condensed display type; italic Instrument Serif for emphasis words.
 * See PLAN.md.
 */
const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  weight: "variable",
  variable: "--font-display",
  display: "swap",
});

const schibsted = Schibsted_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-text",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-serif",
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
  themeColor: "#0a0a0a",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-type="service"
      data-radius="soft"
      data-buttons="tonal"
      className={`${archivo.variable} ${schibsted.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <head>
        <meta name="page-type" content="service" />
        <meta name="site-kind" content="other" />
      </head>
      <body className="min-h-full">
        {children}
      </body>
    </html>
  );
}
