import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

/**
 * A stand-in for Blob storage while developing.
 *
 * The catalogue and the orders both live in Vercel Blob, which needs a token
 * that only exists on the deployed site. Without one, `npm run dev` could show
 * the admin screens but nothing could be saved from them — so the whole
 * feature was untestable anywhere except production, which is the worst place
 * to find out something is wrong.
 *
 * When there is no Blob token and we are not in production, reads and writes
 * fall through to JSON files under `.gg-local/` instead. Same documents, same
 * shapes, no network. The guard is deliberately two-sided: a deployed site
 * always has `NODE_ENV=production`, and a developer who *has* set a token gets
 * the real thing.
 *
 * Photo uploads have no equivalent — they go from the browser to Blob directly
 * — so they stay off until a real store is connected.
 */

const DIR = path.join(process.cwd(), ".gg-local");

export function localStoreEnabled(): boolean {
  return process.env.NODE_ENV !== "production" && !process.env.BLOB_READ_WRITE_TOKEN;
}

export async function readLocal<T>(name: string): Promise<T | null> {
  try {
    const raw = await readFile(path.join(DIR, name), "utf8");
    return JSON.parse(raw) as T;
  } catch {
    // Missing file on a fresh checkout is the normal case, not an error.
    return null;
  }
}

export async function writeLocal(name: string, data: unknown): Promise<void> {
  await mkdir(DIR, { recursive: true });
  await writeFile(path.join(DIR, name), JSON.stringify(data, null, 2), "utf8");
}
