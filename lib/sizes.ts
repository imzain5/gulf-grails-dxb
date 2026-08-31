import type { Product } from "@/data/products";

/** The six angles a product gallery walks through, in order. */
export const VIEWS = ["Pair", "Lateral", "Medial", "Detail", "Heel", "Sole"] as const;

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
