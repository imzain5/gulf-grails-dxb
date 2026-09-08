import { StoreProvider } from "@/context/StoreContext";
import { CatalogueProvider } from "@/context/CatalogueContext";
import SiteChrome from "@/components/SiteChrome";
import { getCatalogue } from "@/lib/catalogue";
import { ORGANISATION_LD } from "@/lib/structured-data";

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
