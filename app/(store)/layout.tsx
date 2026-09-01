import { StoreProvider } from "@/context/StoreContext";
import { CatalogueProvider } from "@/context/CatalogueContext";
import SiteChrome from "@/components/SiteChrome";
import { getCatalogue } from "@/lib/catalogue";
import { SITE_CONFIG } from "@/lib/config";
import { waDigits } from "@/lib/whatsapp";

/**
 * The storefront.
 *
 * Everything a customer sees hangs off this layout: the announcement bar, the
 * header, the footer, the cart, and the shop identity Google reads. The admin
 * screens live outside the group so they inherit none of it.
 *
 * The catalogue is read once here and handed to the client tree. That is what
 * lets the search box, the wishlist and the cart price lines from the same
 * inventory the server rendered, without any of them fetching it themselves.
 */

/**
 * Storefront identity for search engines.
 *
 * A shop that trades on being a real place in Jumeirah with a real WhatsApp
 * number should say so in a form Google can read — it is what puts the
 * opening hours, the contact number and the rating into the result.
 */
const ORGANISATION_LD = {
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
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "312",
  },
};

export default async function StoreLayout({ children }: { children: React.ReactNode }) {
  const catalogue = await getCatalogue();

  return (
    <>
      <script
        type="application/ld+json"
        // Serialised from a literal defined above — no user input reaches it.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANISATION_LD) }}
      />
      <CatalogueProvider products={catalogue}>
        <StoreProvider>
          <SiteChrome>{children}</SiteChrome>
        </StoreProvider>
      </CatalogueProvider>
    </>
  );
}
