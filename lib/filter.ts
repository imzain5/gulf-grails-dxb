import { PRODUCTS, type Product, type SortKey } from "@/data/products";

export interface ShopFilters {
  fam: string;
  sizeF: number | "All";
  sort: SortKey;
  q: string;
}

export const DEFAULT_FILTERS: ShopFilters = { fam: "All", sizeF: "All", sort: "Featured", q: "" };

export function filterProducts(f: ShopFilters): Product[] {
  const needle = f.q.trim().toLowerCase();
  let list = PRODUCTS.filter((p) => {
    if (f.fam !== "All" && p.fam !== f.fam) return false;
    if (f.sizeF !== "All" && !p.sizes.includes(Number(f.sizeF))) return false;
    if (needle) {
      const hay = (p.name + " " + p.brand + " " + p.fam + " " + p.colorway + " " + p.sku).toLowerCase();
      if (!hay.includes(needle)) return false;
    }
    return true;
  });
  if (f.sort === "Price low") list = [...list].sort((a, b) => a.price - b.price);
  if (f.sort === "Price high") list = [...list].sort((a, b) => b.price - a.price);
  if (f.sort === "Newest") list = [...list].sort((a, b) => b.year - a.year);
  return list;
}
