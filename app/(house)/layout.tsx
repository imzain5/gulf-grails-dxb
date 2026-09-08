import { StoreProvider } from "@/context/StoreContext";
import { CatalogueProvider } from "@/context/CatalogueContext";
import StoreHeader from "@/components/house/StoreHeader";
import Footer from "@/components/house/Footer";
import ToastHost from "@/components/ToastHost";
import { getCatalogue } from "@/lib/catalogue";
import { ORGANISATION_LD } from "@/lib/structured-data";

/**
 * The house.
 *
 * Its own route group so the homepage can carry the new system while /shop and
 * the product pages stay on the legacy one until Phase 3. That does mean the
 * header changes between here and there for one phase — the alternative was
 * putting light-only `gg-*` content on an ink ground, which is not a phase, it
 * is a broken site.
 *
 * `.house` is what switches the token layer on. Phase 3 promotes it to the
 * body and this group merges back into one storefront layout.
 */
export default async function HouseLayout({ children }: { children: React.ReactNode }) {
  const catalogue = await getCatalogue();

  return (
    <div className="house">
      <script
        type="application/ld+json"
        // Serialised from a literal in lib/structured-data.ts — no user input.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANISATION_LD) }}
      />
      <CatalogueProvider products={catalogue}>
        <StoreProvider>
          <StoreHeader />
          <main>{children}</main>
          <Footer />
          <ToastHost />
        </StoreProvider>
      </CatalogueProvider>
    </div>
  );
}
