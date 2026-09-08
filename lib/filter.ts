import type { Product, SortKey } from "@/data/products";

/**
 * The shop's filter state.
 *
 * Every field round-trips through the URL, so a filtered view is shareable,
 * survives the back button and a refresh, and can be linked to from the
 * mega-menu or a search result. That is the whole reason this lives in one
 * place rather than in component state.
 */

export type Availability = "all" | "in" | "vault" | "sold";

export interface ShopFilters {
  /** Model group, e.g. "Jordan 1". "All" for no narrowing. */
  fam: string;
  /** House / brand, e.g. "Nike". "All" for no narrowing. */
  house: string;
  sizeF: number | "All";
  sort: SortKey;
  q: string;
  /** AED. `null` means "no bound set", which is not the same as zero. */
  min: number | null;
  max: number | null;
  avail: Availability;
}

export const DEFAULT_FILTERS: ShopFilters = {
  fam: "All",
  house: "All",
  sizeF: "All",
  sort: "Featured",
  q: "",
  min: null,
  max: null,
  avail: "all",
};

/** A pair is a vault lot on price alone — same rule the homepage uses. */
export const VAULT_FLOOR = 10000;

export function isVaultLot(p: Product): boolean {
  return p.price >= VAULT_FLOOR;
}

/** How many filters are actually narrowing the list — drives the mobile badge. */
export function activeCount(f: ShopFilters): number {
  return (
    (f.fam !== "All" ? 1 : 0) +
    (f.house !== "All" ? 1 : 0) +
    (f.sizeF !== "All" ? 1 : 0) +
    (f.q ? 1 : 0) +
    (f.min !== null || f.max !== null ? 1 : 0) +
    (f.avail !== "all" ? 1 : 0)
  );
}

/** Narrow and order a catalogue for the shop grid. */
export function filterProducts(catalogue: Product[], f: ShopFilters): Product[] {
  const needle = f.q.trim().toLowerCase();

  let list = catalogue.filter((p) => {
    if (f.fam !== "All" && p.fam !== f.fam) return false;
    if (f.house !== "All" && p.brand !== f.house) return false;
    if (f.sizeF !== "All" && !p.sizes.includes(Number(f.sizeF))) return false;
    if (f.min !== null && p.price < f.min) return false;
    if (f.max !== null && p.price > f.max) return false;

    if (f.avail === "in" && p.stock <= 0) return false;
    if (f.avail === "sold" && p.stock > 0) return false;
    if (f.avail === "vault" && !isVaultLot(p)) return false;

    if (needle) {
      const hay = `${p.name} ${p.brand} ${p.fam} ${p.colorway} ${p.sku}`.toLowerCase();
      if (!hay.includes(needle)) return false;
    }
    return true;
  });

  if (f.sort === "Price low") list = [...list].sort((a, b) => a.price - b.price);
  if (f.sort === "Price high") list = [...list].sort((a, b) => b.price - a.price);
  if (f.sort === "Newest") list = [...list].sort((a, b) => b.year - a.year);
  return list;
}

/* ── URL ↔ state ────────────────────────────────────────────────────────── */

/**
 * Only non-default values are written, so `/shop` stays `/shop` rather than
 * becoming a query string of things nobody chose — and the canonical URL for
 * the unfiltered grid has exactly one form.
 */
export function filtersToQuery(f: ShopFilters): string {
  const p = new URLSearchParams();
  if (f.fam !== "All") p.set("fam", f.fam);
  if (f.house !== "All") p.set("house", f.house);
  if (f.sizeF !== "All") p.set("size", String(f.sizeF));
  if (f.sort !== "Featured") p.set("sort", f.sort);
  if (f.q) p.set("q", f.q);
  if (f.min !== null) p.set("min", String(f.min));
  if (f.max !== null) p.set("max", String(f.max));
  if (f.avail !== "all") p.set("avail", f.avail);
  return p.toString();
}

export function filtersToHref(f: ShopFilters): string {
  const qs = filtersToQuery(f);
  return qs ? `/shop?${qs}` : "/shop";
}

const SORTS_SAFE = ["Featured", "Price low", "Price high", "Newest"];
const AVAIL_SAFE: Availability[] = ["all", "in", "vault", "sold"];

/** Anything unrecognised falls back to the default rather than throwing. */
export function filtersFromParams(
  get: (key: string) => string | undefined,
): ShopFilters {
  const num = (v: string | undefined) => {
    if (v === undefined || v === "") return null;
    const n = Number(v);
    return Number.isFinite(n) && n >= 0 ? n : null;
  };
  const size = get("size");
  const sort = get("sort");
  const avail = get("avail");

  return {
    fam: get("fam") || "All",
    house: get("house") || "All",
    sizeF: size && Number.isFinite(Number(size)) ? Number(size) : "All",
    sort: (SORTS_SAFE.includes(sort ?? "") ? sort : "Featured") as SortKey,
    q: get("q") ?? "",
    min: num(get("min")),
    max: num(get("max")),
    avail: (AVAIL_SAFE.includes((avail ?? "") as Availability) ? avail : "all") as Availability,
  };
}
