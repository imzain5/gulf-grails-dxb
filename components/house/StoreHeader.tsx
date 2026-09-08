"use client";

import { useCatalogue } from "@/context/CatalogueContext";
import { useStore } from "@/context/StoreContext";
import Header from "./Header";

/**
 * Wires the header to the live catalogue and the bag.
 *
 * `Header` itself takes plain props so it can be rendered from the styleguide,
 * or anywhere without a store. This is the one place that reaches for context.
 */
export default function StoreHeader() {
  const products = useCatalogue();
  const { cartCount } = useStore();
  return <Header products={products} bagCount={cartCount()} />;
}
