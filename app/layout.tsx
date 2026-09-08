import type { Metadata } from "next";
import { Archivo, Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import "../styles/tokens.css";
import { SITE_CONFIG } from "@/lib/config";
import { THEME_SCRIPT } from "@/components/house/ThemeToggle";

/*
 * Three faces, three jobs — the split that separates an auction house from a
 * sneaker store. A price set in a mono face reads as a valuation; the same
 * price in a heavy grotesk reads as a sale.
 *
 * Archivo stays only because the legacy `gg-*` storefront is still live and
 * still asks for six weights of it. It goes with that system in Phase 2, which
 * is also when the six-weight load stops being paid for.
 */

/** Display — house names, statements, lot titles. Regular weight, never bold. */
const display = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

/** Interface — nav, body, buttons, labels. */
const ui = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
});

/** Data — prices, sizes, lot numbers, the Grail Index. Tabular by default. */
const data = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  // Nothing on this site needs a monospace italic.
  style: "normal",
  // Not preloaded: data type appears below the fold on most routes.
  preload: false,
});

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
    <html
      lang="en"
      className={`${archivo.variable} ${display.variable} ${ui.variable} ${data.variable}`}
      /*
       * The theme script below stamps data-theme on this element before paint,
       * so for any visitor who has picked a theme the client's <html> differs
       * from the server's by exactly that attribute — and React logged a
       * hydration mismatch on every page for every returning visitor. The
       * divergence is the intended behaviour (the server cannot know the
       * theme), and this is the attribute that exists to say so. It suppresses
       * the warning for this element's own attributes only, not for its
       * subtree, so a real mismatch anywhere below still surfaces.
       */
      suppressHydrationWarning
    >
      <head>
        {/* Applies a saved theme before first paint so a dark-mode visitor
            never sees a white flash. Only sets an attribute; the legacy
            storefront doesn't read it yet. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />

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
