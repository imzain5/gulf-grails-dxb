import type { Product } from "@/data/products";
import { SITE_CONFIG } from "./config";

/**
 * The authentication record, as something a customer can look up.
 *
 * The rule the whole feature turns on: **a record exists only where one was
 * actually made.** A pair carries a certificate when someone entered the date
 * they ran the six checks and their initials at /admin, and not otherwise.
 * There is no generated record, no "verified" badge that every listing gets by
 * virtue of being listed, and no page to scan into for a pair nobody has
 * checked yet. A certificate that every pair has is a logo; one that only some
 * pairs have is evidence.
 *
 * That also makes the incentive point the right way. The pairs without a
 * record are visibly the ones nobody has filled in.
 */

/** Does this pair have a real authentication record behind it? */
export function hasRecord(p: Product): boolean {
  return Boolean(p.verifiedOn?.trim() && p.verifiedBy?.trim());
}

/**
 * The reference printed on the card, e.g. `GG-4F2A-91C7`.
 *
 * Derived from the listing id, so it is stable: the same pair keeps the same
 * reference across restocks, re-photographs and redeploys, and a card printed
 * a year ago still resolves. It is not a secret and is not meant to be — the
 * record is public, and the reference is there so a printed card and a screen
 * can be read as the same thing.
 *
 * Deliberately not the homepage's "Lot 001", which is a position in a list and
 * changes the moment inventory does.
 */
export function certificateRef(id: string): string {
  // FNV-1a over the id's bytes. Listing ids are ASCII slugs, so charCodeAt is
  // the byte.
  let h = 0x811c9dc5;
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }

  /*
   * Then murmur3's finalizer, which is the part that matters. FNV alone
   * leaves neighbouring inputs — and this catalogue is full of them,
   * aj1-unc beside aj1-royal — clustered in the low bits, and the first
   * version of this split one FNV walk into two halves and got 28 collisions
   * in 20,000 ids where 32 well-mixed bits should give 0.05. Two seeded
   * walks are not two independent hashes. One walk, avalanched, is.
   */
  h ^= h >>> 16;
  h = Math.imul(h, 0x85ebca6b) >>> 0;
  h ^= h >>> 13;
  h = Math.imul(h, 0xc2b2ae35) >>> 0;
  // `^` evaluates to a signed int32, so without this the top-bit cases render
  // as "-22AA49E5" rather than eight hex digits.
  h = (h ^ (h >>> 16)) >>> 0;

  const hex = h.toString(16).toUpperCase().padStart(8, "0");
  return `GG-${hex.slice(0, 4)}-${hex.slice(4)}`;
}

/** Where the QR on the card points. Absolute — it is scanned off paper. */
export function certificateUrl(id: string): string {
  return `${SITE_CONFIG.siteUrl}/verify/${id}`;
}

/**
 * What the record covers, stated exactly.
 *
 * A single holding is one physical pair and the record says so. Where the
 * house holds several of a model the record covers the listing — every pair of
 * it went across the same table — and the wording must not imply it identifies
 * one of them, because it does not. Sold out is its own case: the record still
 * stands for what was checked, which is the whole point of a customer being
 * able to look it up after they have bought the shoe.
 */
export function recordScope(p: Product): string {
  if (p.stock <= 0) {
    return "This record covers the pair as it was checked in our stockroom. The listing is no longer held.";
  }
  if (p.stock === 1) {
    return "A single pair, physically held in Jumeirah. This record is that pair.";
  }
  return `This record covers the ${p.stock} pairs of this listing we hold. Each went across the same table, on the date below.`;
}

/** Human date for a record, or null where the ISO string is unusable. */
export function recordDate(iso: string | undefined): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
}
