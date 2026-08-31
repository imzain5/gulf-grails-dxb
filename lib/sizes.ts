import type { Product } from "@/data/products";

/**
 * Labels for the four shots every catalogue pair was photographed with, in the
 * order they appear in `PHOTOS`: the shoe from its outer side, a close-up, the
 * inner side, then the outsole. A pair shot differently — the Air Dior, which
 * has six in-house angles — overrides this with its own `views` list.
 */
export const VIEWS = ["Lateral", "Detail", "Medial", "Sole"] as const;

const EU_US: Record<number, string> = {
  39: "6.5",
  40: "7",
  41: "8",
  42: "8.5",
  43: "9.5",
  44: "10",
  45: "11",
  46: "12",
};

export function euToUs(eu: number): string {
  return EU_US[eu] ?? String(Math.round((eu - 33) * 10) / 10);
}

/** Sizes 42–44 run AED-a-bit-more on premium (collab/luxury) pairs — the hot middle of the curve. */
export function sizePrice(p: Product, eu: number): number {
  if (!p.premium) return p.price;
  const hot = eu === 42 || eu === 43 || eu === 44;
  return hot ? Math.round((p.price * 1.08) / 10) * 10 : p.price;
}

/** Deterministic per-size stock split so the size chart doesn't reshuffle on every render. */
export function sizeStock(p: Product, i: number): number {
  return Math.max(1, Math.round(p.stock / p.sizes.length) + (i % 2));
}
