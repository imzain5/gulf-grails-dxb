import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import "./globals.css";
import { SITE_CONFIG } from "@/lib/config";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const DESCRIPTION =
  "Jordan, Yeezy, Balenciaga, Dior and collab sneakers, verified in-house and delivered across the UAE. Cash on delivery or bank transfer — order directly on WhatsApp.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.siteUrl),
  title: {
    default: "Gulf Grails — Luxury sneakers, verified. Dubai, UAE.",
    template: "%s · Gulf Grails",
  },
  description: DESCRIPTION,
  applicationName: "Gulf Grails",
  keywords: [
    "sneakers Dubai", "Jordan 1 Dubai", "Yeezy UAE", "Travis Scott sneakers Dubai",
    "Balenciaga sneakers UAE", "Air Dior", "cash on delivery sneakers",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Gulf Grails",
    locale: "en_AE",
    url: SITE_CONFIG.siteUrl,
    title: "Gulf Grails — Luxury sneakers, verified. Dubai, UAE.",
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: "Gulf Grails — Luxury sneakers, verified. Dubai, UAE.",
    description: DESCRIPTION,
  },
  robots: { index: true, follow: true },
};

/**
 * Document shell only.
 *
 * The storefront chrome (header, footer, cart, catalogue) lives in the
 * `(store)` route group so that /admin, which shares none of it, can sit
 * beside it with its own layout.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={archivo.variable}>
      <head>
        {/* Scroll-reveal ships hidden so it can't flicker on load (see
            components/Reveal.tsx). Without scripts nothing would ever reveal
            it, so turn the effect off entirely in that case. */}
        <noscript>
          <style>{".gg-reveal{opacity:1!important;transform:none!important}"}</style>
        </noscript>
      </head>
      <body>{children}</body>
    </html>
  );
}
