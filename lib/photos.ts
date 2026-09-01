/**
 * Where uploaded product photography lives in the Blob store.
 *
 * Photos the site shipped with are static files under `public/assets`; photos
 * the owner uploads land under this prefix. Both are just URLs by the time a
 * product holds them, and only this prefix is ever deleted — a shipped asset
 * can't be removed by editing the catalogue.
 *
 * Deliberately free of server imports so the upload form can share it.
 */

export const PHOTO_PREFIX = "catalogue/photos/";

export function isUploadedPhoto(url: string): boolean {
  return url.includes(`/${PHOTO_PREFIX}`) || url.startsWith(PHOTO_PREFIX);
}

/** A safe, recognisable blob filename from whatever the browser handed us. */
export function photoPathname(fileName: string): string {
  const dot = fileName.lastIndexOf(".");
  const stem = (dot > 0 ? fileName.slice(0, dot) : fileName) || "photo";
  const ext = (dot > 0 ? fileName.slice(dot + 1) : "jpg").toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 5) || "jpg";
  const safe = stem.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40) || "photo";
  return `${PHOTO_PREFIX}${safe}.${ext}`;
}
