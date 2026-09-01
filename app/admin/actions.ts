"use server";

import { redirect } from "next/navigation";
import { getCatalogue, pruneOrphanPhotos, saveCatalogue } from "@/lib/catalogue";
import { isAdmin, requireAdmin, signIn, signOut } from "@/lib/admin-auth";
import type { Product } from "@/data/products";

/**
 * Everything /admin can do.
 *
 * Each action authorises itself. A Server Action is a POST endpoint that
 * exists whether or not the page that calls it was ever rendered, so "the form
 * is only on a page behind a login" is not a check — `requireAdmin()` is.
 *
 * Writes replace the whole catalogue document. With thirty products that is a
 * few tens of kilobytes and buys atomicity: a save either lands completely or
 * not at all, and there is no partial state to reconcile.
 */

export type ActionState = { error?: string; ok?: string };

/* ── session ─────────────────────────────────────────────────────────────── */

export async function loginAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const submitted = String(formData.get("password") ?? "");
  if (!submitted) return { error: "Enter the password." };

  // A deliberate pause on every attempt. There is one password and one user,
  // so a second of latency is invisible to the owner and makes guessing at
  // any useful rate impractical.
  await new Promise((r) => setTimeout(r, 600));

  if (!(await signIn(submitted))) return { error: "That password is not right." };
  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  await signOut();
  redirect("/admin/login");
}

/* ── reading and writing ─────────────────────────────────────────────────── */

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

/** A product id that no other pair is using. */
function uniqueId(base: string, taken: Set<string>): string {
  const root = slugify(base) || "pair";
  if (!taken.has(root)) return root;
  for (let n = 2; n < 500; n++) {
    const candidate = `${root}-${n}`;
    if (!taken.has(candidate)) return candidate;
  }
  return `${root}-${Date.now()}`;
}

function num(formData: FormData, key: string): number {
  const raw = String(formData.get(key) ?? "").replace(/[^0-9.-]/g, "");
  const n = Number(raw);
  return Number.isFinite(n) ? n : 0;
}

function text(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

/** "40, 41,42  43" → [40, 41, 42, 43] */
function parseSizes(raw: string): number[] {
  return [
    ...new Set(
      raw
        .split(/[^0-9.]+/)
        .map((s) => Number(s))
        .filter((n) => Number.isFinite(n) && n > 0 && n < 100),
    ),
  ].sort((a, b) => a - b);
}

/** Photo URLs travel as a JSON array in one hidden field — see ProductForm. */
function parsePhotos(raw: string): string[] {
  try {
    const parsed: unknown = JSON.parse(raw || "[]");
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((p): p is string => typeof p === "string" && p.length > 0);
  } catch {
    return [];
  }
}

export async function saveProductAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const name = text(formData, "name");
  if (!name) return { error: "The pair needs a name." };

  const price = num(formData, "price");
  if (price <= 0) return { error: "Set a price above zero." };

  const sizes = parseSizes(text(formData, "sizes"));
  if (sizes.length === 0) return { error: "List at least one size, e.g. 41, 42, 43." };

  const catalogue = await getCatalogue();
  const existingId = text(formData, "id");
  const existing = existingId ? catalogue.find((p) => p.id === existingId) : undefined;
  if (existingId && !existing) return { error: "That pair is no longer in the catalogue." };

  const photos = parsePhotos(text(formData, "photos"));
  const market = num(formData, "market");

  const product: Product = {
    id: existing?.id ?? uniqueId(name, new Set(catalogue.map((p) => p.id))),
    name,
    brand: text(formData, "brand"),
    fam: text(formData, "fam"),
    colorway: text(formData, "colorway"),
    sku: text(formData, "sku"),
    year: num(formData, "year") || new Date().getFullYear(),
    price,
    // The saving badge reads off `market`; defaulting it to the price means a
    // pair saved without one advertises no discount rather than a negative.
    market: market > 0 ? market : price,
    sizes,
    stock: Math.max(0, Math.round(num(formData, "stock"))),
    drop: text(formData, "drop"),
    blurb: text(formData, "blurb"),
    desc: text(formData, "desc"),
    premium: formData.get("premium") === "on",
    photos: photos.length ? photos : null,
    // Gallery labels are only meaningful for the in-house six-angle sequence;
    // anything uploaded here falls back to the standard labels.
    views: undefined,
  };

  const next = existing
    ? catalogue.map((p) => (p.id === existing.id ? product : p))
    : [...catalogue, product];

  try {
    await saveCatalogue(next);
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Could not save." };
  }

  const dropped = (existing?.photos ?? []).filter((url) => !photos.includes(url));
  await pruneOrphanPhotos(dropped, next);

  redirect("/admin?saved=" + encodeURIComponent(product.id));
}

/**
 * Form actions have nowhere to put a thrown error, so a failed write comes
 * back as a message in the query string rather than an error page.
 */
function failed(err: unknown): never {
  const message = err instanceof Error ? err.message : "Could not save.";
  redirect("/admin?error=" + encodeURIComponent(message));
}

export async function deleteProductAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  const catalogue = await getCatalogue();
  const doomed = catalogue.find((p) => p.id === id);
  if (!doomed) redirect("/admin");

  const next = catalogue.filter((p) => p.id !== id);
  try {
    await saveCatalogue(next);
  } catch (err) {
    failed(err);
  }
  await pruneOrphanPhotos(doomed.photos ?? [], next);

  redirect("/admin?deleted=" + encodeURIComponent(doomed.name));
}

/**
 * The one-field edit the owner makes most often: how many are left.
 *
 * Zero is a real value — it takes the pair off sale without removing it from
 * the site, which is what the shop wants when a restock is coming.
 */
export async function setStockAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  const stock = Math.max(0, Math.round(Number(formData.get("stock")) || 0));

  const catalogue = await getCatalogue();
  if (!catalogue.some((p) => p.id === id)) redirect("/admin");

  try {
    await saveCatalogue(catalogue.map((p) => (p.id === id ? { ...p, stock } : p)));
  } catch (err) {
    failed(err);
  }
  redirect("/admin?stock=" + encodeURIComponent(id));
}

/** Used by the admin pages themselves; keeps the auth check on the server. */
export async function adminSignedIn(): Promise<boolean> {
  return isAdmin();
}
