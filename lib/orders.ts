import { del, get, list, put } from "@vercel/blob";
import { unstable_cache, revalidatePath, revalidateTag } from "next/cache";
import { blobConfigured } from "./catalogue";
import { localStoreEnabled, readLocal, writeLocal } from "./local-store";

/**
 * Orders, and the stock they hold.
 *
 * Until now nothing about an order existed server-side: checkout built a
 * WhatsApp message and the cart lived in the customer's browser. That is fine
 * for taking the order and useless for knowing what is left, which is why the
 * stockroom count only ever moved when someone remembered to move it.
 *
 * An order is now written here, next to the catalogue, and placing one draws
 * the pairs down immediately. Cancelling puts them back. Those two facts are
 * the whole feature: the number on the shelf and the number on the site stay
 * the same without anyone maintaining them.
 *
 * Cash on delivery means an order is a commitment, not a payment — so orders
 * arrive as `new` and the shop moves them along by hand. Stock is held from
 * the moment the order is placed, because the alternative is selling the same
 * last pair twice while waiting for a WhatsApp reply.
 *
 * This document is PRIVATE and must stay that way. It holds every customer's
 * name, WhatsApp number and home address. It was originally written with
 * `access: "public"` and a fixed pathname, which put all of that at a URL
 * anyone could fetch — and the store's hostname is not a secret either, since
 * every product photograph on the site is served from it. `readStored` heals
 * that on the first read after deploy: it copies any public copy into a
 * private one and deletes the public original.
 */

export const ORDERS_TAG = "gg-orders";
export const ORDERS_PATH = "catalogue/orders.json";

/**
 * How many orders the document keeps. It is rewritten whole on every write,
 * so it cannot grow without bound; a few hundred is more history than the
 * shop looks at and still a small file.
 */
const MAX_ORDERS = 400;

/**
 * Where an order is.
 *
 * `awaiting_payment` is the one online payment adds, and it is the reason the
 * rest of this file grew a hold expiry. Cash on delivery lets an order be a
 * commitment the moment it is placed; a card payment does not, because the
 * customer is now on somebody else's domain and may simply close the tab. The
 * pairs are still held — otherwise two people pay for the same shoe — but only
 * for as long as a payment could plausibly still be completed.
 */
export type OrderStatus =
  | "awaiting_payment"
  | "new"
  | "confirmed"
  | "delivered"
  | "cancelled";

const ORDER_STATUSES: readonly OrderStatus[] = [
  "awaiting_payment", "new", "confirmed", "delivered", "cancelled",
];

/** How the customer is paying. */
export type PayMethod = "cod" | "bank" | "card" | "tabby" | "tamara";

const PAY_METHODS: readonly PayMethod[] = ["cod", "bank", "card", "tabby", "tamara"];

/** Everything that needs a redirect to somebody else's checkout. */
export function isOnline(pay: PayMethod): boolean {
  return pay === "card" || pay === "tabby" || pay === "tamara";
}

/**
 * How long an unpaid online order keeps its pairs.
 *
 * Long enough to find a card, re-send an OTP and argue with a bank app; short
 * enough that an abandoned checkout does not hold the last pair of something
 * overnight. Released by `releaseExpiredHolds`, not by a timer.
 */
export const HOLD_MINUTES = 30;

export interface OrderPayment {
  /** The provider's own id for the session or order, for reconciliation. */
  sessionId: string;
  /** Provider's payment/transaction id once captured, where it differs. */
  paymentId?: string;
  /** ISO timestamp payment was confirmed. Absent until it is. */
  paidAt?: string;
  /** What the provider last told us, verbatim, for the stockroom to read. */
  note?: string;
}

export interface OrderLine {
  pid: string;
  name: string;
  size: number;
  qty: number;
  /** Line total in AED, priced on the server at the time of the order. */
  amount: number;
}

export interface OrderCustomer {
  name: string;
  phone: string;
  emirate: string;
  area: string;
  address: string;
  window: string;
  notes: string;
}

export interface Order {
  /** Human reference, e.g. GG-4821. Shown to the customer and on WhatsApp. */
  ref: string;
  /** ISO timestamp. */
  placedAt: string;
  lines: OrderLine[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  pay: PayMethod;
  customer: OrderCustomer;
  status: OrderStatus;
  /**
   * Whether this order is currently holding stock. Set when placed, cleared
   * when cancelled — so a cancel can only ever return the pairs once, however
   * many times the button is pressed.
   */
  holdsStock: boolean;
  /**
   * When an unpaid online order stops holding its pairs. Only set while the
   * status is `awaiting_payment`; cleared the moment payment lands.
   */
  holdExpiresAt?: string;
  /** Provider bookkeeping for card and instalment orders. */
  payment?: OrderPayment;
}

/** An order still sitting on somebody's payment page, past its hold. */
export function holdExpired(o: Order, now = Date.now()): boolean {
  return (
    o.status === "awaiting_payment" &&
    o.holdsStock &&
    Boolean(o.holdExpiresAt) &&
    new Date(o.holdExpiresAt as string).getTime() <= now
  );
}

function asOrder(raw: unknown): Order | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  if (typeof r.ref !== "string" || !r.ref) return null;

  const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? v : 0);
  const str = (v: unknown) => (typeof v === "string" ? v : "");
  const status: OrderStatus = ORDER_STATUSES.includes(r.status as OrderStatus)
    ? (r.status as OrderStatus)
    : "new";

  const lines = Array.isArray(r.lines)
    ? r.lines.flatMap((l): OrderLine[] => {
        if (!l || typeof l !== "object") return [];
        const x = l as Record<string, unknown>;
        return [{
          pid: str(x.pid),
          name: str(x.name),
          size: num(x.size),
          qty: Math.max(1, Math.round(num(x.qty))),
          amount: num(x.amount),
        }];
      })
    : [];

  const c = (r.customer ?? {}) as Record<string, unknown>;

  return {
    ref: r.ref,
    placedAt: str(r.placedAt) || new Date(0).toISOString(),
    lines,
    subtotal: num(r.subtotal),
    deliveryFee: num(r.deliveryFee),
    discount: num(r.discount),
    total: num(r.total),
    pay: PAY_METHODS.includes(r.pay as PayMethod) ? (r.pay as PayMethod) : "cod",
    customer: {
      name: str(c.name), phone: str(c.phone), emirate: str(c.emirate),
      area: str(c.area), address: str(c.address), window: str(c.window),
      notes: str(c.notes),
    },
    status,
    holdsStock: r.holdsStock === true,
    holdExpiresAt: str(r.holdExpiresAt) || undefined,
    payment: asPayment(r.payment),
  };
}

function asPayment(raw: unknown): OrderPayment | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const p = raw as Record<string, unknown>;
  const str = (v: unknown) => (typeof v === "string" ? v : "");
  const sessionId = str(p.sessionId);
  if (!sessionId) return undefined;
  return {
    sessionId,
    paymentId: str(p.paymentId) || undefined,
    paidAt: str(p.paidAt) || undefined,
    note: str(p.note) || undefined,
  };
}

function parseOrders(raw: unknown): Order[] | null {
  if (!Array.isArray(raw)) return null;
  return raw.map(asOrder).filter((o): o is Order => o !== null);
}

/**
 * Move an existing public orders document to a private one and delete it.
 *
 * Runs at most once per store: after it has succeeded there is no public blob
 * left to find. It is deliberately best-effort — a shop that cannot reach
 * storage should still serve pages — but a failure here leaves customer
 * addresses readable, so it is loud in the log rather than silent.
 */
async function healPublicOrders(): Promise<Order[] | null> {
  const { blobs } = await list({ prefix: ORDERS_PATH, limit: 1 });
  const exposed = blobs.find((b) => b.pathname === ORDERS_PATH);
  if (!exposed) return null;

  console.warn(
    "[orders] found a PUBLIC orders document holding customer addresses; moving it to private storage",
  );

  const res = await fetch(exposed.url, { cache: "no-store" });
  const orders = res.ok ? parseOrders(await res.json()) : null;

  /*
   * Delete only what we have successfully copied.
   *
   * `list` reports the private document at this pathname too, so an
   * unreadable private blob would land here with `exposed` pointing at it —
   * and an unconditional delete would then destroy the orders rather than a
   * public duplicate of them. Fetching it without credentials fails, which is
   * exactly the signal that this is not the public copy.
   */
  if (!orders) {
    console.error(
      `[orders] could not read ${exposed.url} (${res.status}); leaving it in place`,
    );
    return null;
  }

  // Write the private copy first. Deleting before writing would lose the
  // orders outright if the write then failed.
  await put(ORDERS_PATH, JSON.stringify(orders, null, 2), {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
    cacheControlMaxAge: 0,
  });
  await del(exposed.url);
  console.warn("[orders] public orders document deleted");

  return orders;
}

async function readStored(): Promise<Order[] | null> {
  if (localStoreEnabled()) {
    return parseOrders(await readLocal<unknown>("orders.json"));
  }
  if (!blobConfigured()) return null;
  try {
    // useCache: false — an order placed a second ago must be visible to the
    // admin screen now, and to the stock arithmetic of the next order.
    const found = await get(ORDERS_PATH, { access: "private", useCache: false });
    if (found?.stream) {
      const parsed: unknown = await new Response(found.stream).json();
      const orders = parseOrders(parsed);
      if (orders) return orders;
    }
    return await healPublicOrders();
  } catch (err) {
    console.error("[orders] read failed:", err);
    return null;
  }
}

const cachedOrders = unstable_cache(
  async (): Promise<Order[]> => (await readStored()) ?? [],
  ["gg-orders-v1"],
  { tags: [ORDERS_TAG], revalidate: 3600 },
);

/** Every order, newest first. */
export async function getOrders(): Promise<Order[]> {
  const orders = await cachedOrders();
  return [...orders].sort((a, b) => b.placedAt.localeCompare(a.placedAt));
}

export async function saveOrders(orders: Order[]): Promise<void> {
  const trimmed = [...orders]
    .sort((a, b) => b.placedAt.localeCompare(a.placedAt))
    .slice(0, MAX_ORDERS);

  if (localStoreEnabled()) {
    await writeLocal("orders.json", trimmed);
    revalidateOrders();
    return;
  }
  if (!blobConfigured()) {
    throw new Error(
      "No Blob store is connected. Create one in the Vercel dashboard and set BLOB_READ_WRITE_TOKEN.",
    );
  }

  await put(ORDERS_PATH, JSON.stringify(trimmed, null, 2), {
    // Private, always. See the note at the top of this file.
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
    cacheControlMaxAge: 0,
  });
  revalidateOrders();
}

export function revalidateOrders(): void {
  revalidateTag(ORDERS_TAG, { expire: 0 });
  revalidatePath("/admin/orders");
}

/** A short reference that isn't already taken. */
export function newRef(taken: ReadonlySet<string>): string {
  for (let i = 0; i < 200; i++) {
    const ref = "GG-" + String(Math.floor(1000 + Math.random() * 9000));
    if (!taken.has(ref)) return ref;
  }
  return "GG-" + Date.now().toString().slice(-6);
}
