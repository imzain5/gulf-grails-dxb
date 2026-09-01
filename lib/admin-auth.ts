import { cookies } from "next/headers";
import crypto from "node:crypto";

/**
 * Owner authentication for /admin.
 *
 * One person runs this shop, so there are no accounts, no roles and no user
 * table: there is a password in the environment and a signed cookie proving
 * you typed it. Anything more would be machinery with nobody to use it.
 *
 * The cookie carries an expiry and an HMAC of that expiry, keyed on the
 * password itself. Nothing about the password is recoverable from the cookie,
 * and changing the password in Vercel invalidates every session that was open
 * — which is the whole of the "log everyone out" feature.
 *
 * The password is never committed. It is set as an environment variable in the
 * Vercel dashboard, so this file has nothing sensitive in it.
 */

const COOKIE = "gg_admin";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 14; // Two weeks.

function password(): string | null {
  const p = process.env.ADMIN_PASSWORD;
  return p && p.length > 0 ? p : null;
}

/** True once an ADMIN_PASSWORD exists — i.e. once /admin can be signed into. */
export function adminConfigured(): boolean {
  return password() !== null;
}

/**
 * Sign an expiry with the password.
 *
 * Keyed on a hash of the password rather than the password itself, purely so
 * the raw secret is never the direct HMAC key.
 */
function sign(expiresAt: number, secret: string): string {
  const key = crypto.createHash("sha256").update(`gg-admin-session:${secret}`).digest();
  return crypto.createHmac("sha256", key).update(String(expiresAt)).digest("hex");
}

/** Constant-time compare that tolerates differing lengths. */
function sameSecret(a: string, b: string): boolean {
  const ha = crypto.createHash("sha256").update(a).digest();
  const hb = crypto.createHash("sha256").update(b).digest();
  return crypto.timingSafeEqual(ha, hb);
}

function tokenFor(expiresAt: number, secret: string): string {
  return `${expiresAt}.${sign(expiresAt, secret)}`;
}

function tokenValid(token: string | undefined, secret: string): boolean {
  if (!token) return false;
  const dot = token.indexOf(".");
  if (dot < 1) return false;
  const expiresAt = Number(token.slice(0, dot));
  if (!Number.isFinite(expiresAt) || expiresAt < Date.now()) return false;
  return sameSecret(token.slice(dot + 1), sign(expiresAt, secret));
}

/** Whether the current request carries a valid owner session. */
export async function isAdmin(): Promise<boolean> {
  const secret = password();
  if (!secret) return false;
  const jar = await cookies();
  return tokenValid(jar.get(COOKIE)?.value, secret);
}

/**
 * Guard for every server action that reads or writes inventory.
 *
 * Rendering an admin page behind a redirect is not a security boundary —
 * a Server Action is a POST endpoint anyone can call — so each action calls
 * this itself rather than trusting that the form was only rendered to us.
 */
export async function requireAdmin(): Promise<void> {
  if (!(await isAdmin())) throw new Error("Not signed in.");
}

/**
 * Check a submitted password and, if it matches, open a session.
 *
 * Only callable from a Server Action or Route Handler — setting a cookie needs
 * response headers.
 */
export async function signIn(submitted: string): Promise<boolean> {
  const secret = password();
  if (!secret) return false;
  if (!sameSecret(submitted, secret)) return false;

  const expiresAt = Date.now() + MAX_AGE_SECONDS * 1000;
  const jar = await cookies();
  jar.set(COOKIE, tokenFor(expiresAt, secret), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
  return true;
}

export async function signOut(): Promise<void> {
  const jar = await cookies();
  jar.delete(COOKIE);
}
