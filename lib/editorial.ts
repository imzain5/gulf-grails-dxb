/**
 * Editorial photography assignments.
 *
 * The page headers on About, Trust and Sell are filled from the studio photography
 * already in `public/assets`, composed on a coloured ground rather than shown
 * raw. That keeps the storefront fully photographed with no upload boxes on
 * the customer-facing path, and means a slot can be re-pointed at a lifestyle
 * shot later by changing one line here instead of hunting through components.
 *
 * `ImageSlot` (the click-or-drag upload box) is still available for whoever
 * runs the live site, but it is no longer what a first-time visitor sees.
 */

import { findIn, type Product } from "@/data/products";

export interface EditorialShot {
  /** Product whose studio photo fills the slot. */
  pid: string;
  /** Which of that product's photos, by index. */
  view?: number;
  /** Ground the cut-out sits on. */
  ground: "paper" | "ink" | "accent" | "white";
  /** Optional caption rendered over the frame. */
  caption?: string;
}

/**
 * Slots are pinned to a product id, and the catalogue is editable, so a slot
 * can name a pair the owner has since removed. `findIn` falls back to the
 * first pair rather than throwing: the page keeps its photograph and its link
 * keeps working, it is just a different shoe. Re-point the slot here if that
 * happens.
 */
export function shotSrc(catalogue: Product[], s: EditorialShot): string | null {
  const p = findIn(catalogue, s.pid);
  if (!p?.photos) return null;
  return p.photos[s.view ?? 0] ?? p.photos[0];
}

export function shotProduct(catalogue: Product[], s: EditorialShot): Product {
  return findIn(catalogue, s.pid);
}

export const GROUNDS: Record<EditorialShot["ground"], { bg: string; fg: string }> = {
  paper: { bg: "var(--color-neutral-200)", fg: "var(--color-text)" },
  ink: { bg: "var(--color-text)", fg: "var(--color-bg)" },
  accent: { bg: "var(--color-accent)", fg: "#fff" },
  white: { bg: "#fff", fg: "var(--color-text)" },
};

/** Page-header photography for the editorial pages. */
export const PAGE_SHOTS: Record<"about" | "trust" | "sell", EditorialShot> = {
  about: { pid: "aj1-lost", view: 0, ground: "paper" },
  trust: { pid: "ow-aj1", view: 0, ground: "white" },
  sell: { pid: "yz-700", view: 0, ground: "paper" },
};
