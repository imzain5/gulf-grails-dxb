import { SITE_CONFIG } from "./config";
import { waDigits } from "./whatsapp";

/**
 * Storefront identity for search engines.
 *
 * A shop that trades on being a real place in Jumeirah with a real WhatsApp
 * number should say so in a form Google can read — it is what puts the opening
 * hours, the contact number and the address into the result.
 *
 * `aggregateRating` is deliberately absent. A rating of 4.9 from 312 reviews
 * was hard-coded here with nothing verifiable behind it, and a self-serving
 * aggregateRating is both penalised by Google and the exact kind of inflated
 * trust signal a house loses more by being caught at than it ever gained. Put
 * it back only alongside real, individually verifiable reviews — at which
 * point it should be generated from them rather than typed.
 */
export const ORGANISATION_LD = {
  "@context": "https://schema.org",
  "@type": "Store",
  name: "Gulf Grails",
  description:
    "Jordan, Yeezy, Balenciaga, Dior and collab sneakers, verified in-house and delivered across the UAE. Cash on delivery or bank transfer — order directly on WhatsApp.",
  url: SITE_CONFIG.siteUrl,
  telephone: "+" + waDigits(),
  email: SITE_CONFIG.email,
  priceRange: "AED 380 – AED 33,000",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Jumeirah 1",
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
};
