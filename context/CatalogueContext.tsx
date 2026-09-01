"use client";

import { createContext, useContext, useMemo } from "react";
import { findIn, type Product } from "@/data/products";

/**
 * The catalogue, as client components see it.
 *
 * Inventory is fetched on the server (`lib/catalogue.ts`) and handed down once
 * from the storefront layout. Client components that used to import a static
 * `PRODUCTS` array read it from here instead, so the search box, the wishlist
 * and the cart all see whatever the owner last saved at /admin without any of
 * them fetching anything themselves.
 */

const CatalogueContext = createContext<Product[] | null>(null);

export function CatalogueProvider({
  products,
  children,
}: {
  products: Product[];
  children: React.ReactNode;
}) {
  return <CatalogueContext.Provider value={products}>{children}</CatalogueContext.Provider>;
}

export function useCatalogue(): Product[] {
  const list = useContext(CatalogueContext);
  if (!list) throw new Error("useCatalogue must be used inside <CatalogueProvider>");
  return list;
}

/** Look a pair up by id, memoised so cart lines don't rescan the list per render. */
export function useProduct(id: string): Product {
  const list = useCatalogue();
  return useMemo(() => findIn(list, id), [list, id]);
}
