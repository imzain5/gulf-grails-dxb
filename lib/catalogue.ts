import { del, list, put } from "@vercel/blob";
import { unstable_cache, revalidatePath, revalidateTag } from "next/cache";
import { SEED_PRODUCTS } from "@/data/seed";
import type { Product } from "@/data/products";
import { isUploadedPhoto } from "./photos";
import { localStoreEnabled, readLocal, writeLocal } from "./local-store";

/**
 * The live catalogue.
 *
 * Inventory is owned by whoever runs the shop, not by this repository, so the
 * product list lives in Vercel Blob as a single JSON document rather than in a
 * source file. It is small — thirty-odd pairs, a few tens of kilobytes — so
 * there is no reason to reach for a database: every write replaces the whole
 * document, which makes the admin screens trivially consistent and gives us
 * atomic saves for free.
 *
 * Reads go through `unstable_cache` so a page render costs nothing after the
 * first, and every write calls `revalidateCatalogue()` so a save from /admin is
 * live on the storefront immediately rather than after a timer.
 *
 * If Blob is not configured (local development with no token) or the document
 * has never been written (a fresh deploy, before the owner saves anything),
 * reads fall back to `SEED_PRODUCTS`. The shop is therefore never empty and
 * never throws because of storage.
 */

export const CATALOGUE_TAG = "gg-catalogue";
export const CATALOGUE_PATH = "catalogue/products.json";

/**
 * True when a real Blob store is wired up.
 *
 * This is the one that gates photo uploads, which go from the browser straight
 * to Blob and have no local equivalent.
 */
export function blobConfigured(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

/** True when a save will land somewhere — Blob in production, a file in dev. */
export function storageWritable(): boolean {
  return blobConfigured() || localStoreEnabled();
}

/** Coerce whatever came back from storage into a Product, dropping nothing silently. */
function normalise(raw: unknown): Product | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const id = typeof r.id === "string" ? r.id.trim() : "";
  const name = typeof r.name === "string" ? r.name.trim() : "";
  if (!id || !name) return null;

  const num = (v: unknown, fallback = 0) =>
    typeof v === "number" && Number.isFinite(v) ? v : fallback;
  const str = (v: unknown) => (typeof v === "string" ? v : "");
  const photos = Array.isArray(r.photos)
    ? r.photos.filter((p): p is string => typeof p === "string" && p.length > 0)
    : null;
  const views = Array.isArray(r.views)
    ? r.views.filter((v): v is string => typeof v === "string")
    : undefined;

  return {
    id,
    name,
    brand: str(r.brand),
    fam: str(r.fam),
    colorway: str(r.colorway),
    sku: str(r.sku),
    year: num(r.year, new Date().getFullYear()),
    price: num(r.price),
    market: num(r.market),
    sizes: Array.isArray(r.sizes)
      ? [...new Set(r.sizes.filter((s): s is number => typeof s === "number"))].sort((a, b) => a - b)
      : [],
    stock: Math.max(0, Math.round(num(r.stock))),
    drop: str(r.drop),
    blurb: str(r.blurb),
    desc: str(r.desc),
    premium: r.premium === true,
    photos: photos && photos.length ? photos : null,
    views: views && views.length === (photos?.length ?? 0) ? views : undefined,
  };
}

async function readStored(): Promise<Product[] | null> {
  if (localStoreEnabled()) {
    const raw = await readLocal<unknown>("catalogue.json");
    if (!Array.isArray(raw)) return null;
    const products = raw.map(normalise).filter((p): p is Product => p !== null);
    return products.length ? products : null;
  }
  if (!blobConfigured()) return null;
  try {
    const { blobs } = await list({ prefix: CATALOGUE_PATH, limit: 1 });
    const doc = blobs.find((b) => b.pathname === CATALOGUE_PATH);
    if (!doc) return null;

    // `unstable_cache` already governs how long this result is held, so the
    // fetch itself must not be cached on top of it or a save would take two
    // revalidations to show up.
    const res = await fetch(doc.url, { cache: "no-store" });
    if (!res.ok) return null;

    const parsed: unknown = await res.json();
    if (!Array.isArray(parsed)) return null;
    const products = parsed.map(normalise).filter((p): p is Product => p !== null);
    return products.length ? products : null;
  } catch (err) {
    // A storage outage should degrade to the shipped catalogue, not a 500.
    console.error("[catalogue] read failed, falling back to seed:", err);
    return null;
  }
}

const cachedCatalogue = unstable_cache(
  async (): Promise<Product[]> => (await readStored()) ?? SEED_PRODUCTS,
  ["gg-catalogue-v1"],
  { tags: [CATALOGUE_TAG], revalidate: 3600 },
);

/** The catalogue as the storefront should render it. */
export async function getCatalogue(): Promise<Product[]> {
  return cachedCatalogue();
}

/** Replace the whole catalogue. Callers are responsible for authorising first. */
export async function saveCatalogue(products: Product[]): Promise<void> {
  if (localStoreEnabled()) {
    await writeLocal("catalogue.json", products);
    revalidateCatalogue();
    return;
  }
  if (!blobConfigured()) {
    throw new Error(
      "No Blob store is connected. Create one in the Vercel dashboard and set BLOB_READ_WRITE_TOKEN.",
    );
  }
  await put(CATALOGUE_PATH, JSON.stringify(products, null, 2), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
    // The document is the source of truth for every page; it must never be
    // served stale from the CDN after a save.
    cacheControlMaxAge: 0,
  });
  revalidateCatalogue();
}

/**
 * Drop every cached read of the catalogue.
 *
 * `{ expire: 0 }` rather than a stale-while-revalidate profile: the owner has
 * just pressed save and expects to see the change on the storefront, not on
 * whichever request happens to warm the cache next. The path call clears the
 * rendered pages as well as the data behind them.
 */
/**
 * Remove uploaded photos that no product references any more.
 *
 * Called after a delete, or an edit that drops a photo. Anything still in use
 * by another pair is left alone, and a failure here is logged rather than
 * thrown: an orphaned file costs a fraction of a cent, and failing the save
 * the owner actually asked for would cost them the edit.
 */
export async function pruneOrphanPhotos(
  removed: string[],
  remaining: Product[],
): Promise<void> {
  if (!blobConfigured()) return;

  const stillUsed = new Set(remaining.flatMap((p) => p.photos ?? []));
  const orphans = [...new Set(removed)].filter(
    (url) => isUploadedPhoto(url) && !stillUsed.has(url),
  );
  if (orphans.length === 0) return;

  try {
    await del(orphans);
  } catch (err) {
    console.error("[catalogue] could not delete orphaned uploads:", err);
  }
}

export function revalidateCatalogue(): void {
  revalidateTag(CATALOGUE_TAG, { expire: 0 });
  revalidatePath("/", "layout");
}
