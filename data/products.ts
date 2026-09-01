/**
 * The shape of a pair, and the pure helpers that read one.
 *
 * There is deliberately no `PRODUCTS` constant here any more. The catalogue is
 * now editable from /admin and lives in Blob storage, so the live list is
 * fetched per request by `lib/catalogue.ts` on the server and handed to client
 * components through `context/CatalogueContext.tsx`. Everything in this file
 * is a type or a function of an explicit list, which keeps it importable from
 * both sides of the boundary. The pairs the site ships with are in `seed.ts`.
 */

export interface Product {
  id: string;
  brand: string;
  fam: string;
  name: string;
  colorway: string;
  sku: string;
  year: number;
  /** Our price, AED. */
  price: number;
  /** Comparable market/resale price, AED. */
  market: number;
  sizes: number[];
  /** Pairs on the shelf. Zero means sold out — the pair still lists, marked so. */
  stock: number;
  /** Small badge shown on the card, e.g. "Bestseller" — empty string for none. */
  drop: string;
  blurb: string;
  desc: string;
  /** Premium (collab/luxury) pairs get the hot-size price bump — see lib/sizes.ts. */
  premium: boolean;
  /** Real studio photos in gallery order, or null if none have been shot yet. */
  photos: string[] | null;
  /**
   * Labels for those photos, when the pair wasn't shot in the standard
   * four-angle sequence. Must be the same length as `photos`; falls back to
   * VIEWS in lib/sizes.ts.
   */
  views?: readonly string[];
}

/** The card/thumbnail shot, and the shot a card cross-fades to on hover. */
export function coverPhoto(p: Product): string | null {
  return p.photos?.[0] ?? null;
}
export function hoverPhoto(p: Product): string | null {
  if (!p.photos || p.photos.length < 2) return null;
  return p.photos[1];
}

/**
 * Look a pair up in a catalogue, falling back to the first pair.
 *
 * The fallback matters more now that inventory is editable: an editorial slot
 * or a saved cart line can name a pair the owner has since deleted, and a
 * photograph of the wrong shoe beats a crash.
 */
export function findIn(list: Product[], id: string): Product {
  return list.find((p) => p.id === id) ?? list[0];
}

/**
 * Families in the order the shop wants them offered, not alphabetical. Only
 * the ones with pairs behind them are shown, and anything the owner invents at
 * /admin is appended so a new family can never be unfilterable.
 */
const CURATED_FAMILIES = [
  "Jordan 1", "Jordan 4", "Dunk", "Air Force 1", "Travis Scott",
  "Off-White", "Yeezy", "Balenciaga", "Luxury",
];

export function familyFilters(list: Product[]): string[] {
  const present = new Set(list.map((p) => p.fam).filter(Boolean));
  const known = CURATED_FAMILIES.filter((f) => present.has(f));
  const extra = [...present].filter((f) => !CURATED_FAMILIES.includes(f)).sort();
  return ["All", ...known, ...extra];
}

export function sizeFilters(list: Product[]): (number | "All")[] {
  const sizes = [...new Set(list.flatMap((p) => p.sizes))].sort((a, b) => a - b);
  return ["All", ...sizes];
}

export const SORTS = ["Featured", "Price low", "Price high", "Newest"] as const;
export type SortKey = (typeof SORTS)[number];
