import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/context/StoreContext";
import SiteChrome from "@/components/SiteChrome";
import { SITE_CONFIG } from "@/lib/config";
import { waDigits } from "@/lib/whatsapp";

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
 * Storefront identity for search engines.
 *
 * A shop that trades on being a real place in Al Quoz with a real WhatsApp
 * number should say so in a form Google can read — it is what puts the
 * opening hours, the contact number and the rating into the result.
 */
const ORGANISATION_LD = {
  "@context": "https://schema.org",
  "@type": "Store",
  name: "Gulf Grails",
  description: DESCRIPTION,
  url: SITE_CONFIG.siteUrl,
  telephone: "+" + waDigits(),
  priceRange: "AED 380 – AED 33,000",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Al Quoz 1",
    addressLocality: "Dubai",
    addressCountry: "AE",
  },
  areaServed: "United Arab Emirates",
  currenciesAccepted: "AED",
  paymentAccepted: "Cash on delivery, Bank transfer",
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "10:00",
      closes: "23:00",
    },
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "312",
  },
};

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
      <body>
        <script
          type="application/ld+json"
          // Serialised from a literal defined above — no user input reaches it.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANISATION_LD) }}
        />
        <StoreProvider>
          <SiteChrome>{children}</SiteChrome>
        </StoreProvider>
      </body>
    </html>
  );
}
