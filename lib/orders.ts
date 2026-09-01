import { list, put } from "@vercel/blob";
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
 */

export const ORDERS_TAG = "gg-orders";
export const ORDERS_PATH = "catalogue/orders.json";

/**
 * How many orders the document keeps. It is rewritten whole on every write,
 * so it cannot grow without bound; a few hundred is more history than the
 * shop looks at and still a small file.
 */
const MAX_ORDERS = 400;

export type OrderStatus = "new" | "confirmed" | "delivered" | "cancelled";

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
  pay: "cod" | "bank";
  customer: OrderCustomer;
  status: OrderStatus;
  /**
   * Whether this order is currently holding stock. Set when placed, cleared
   * when cancelled — so a cancel can only ever return the pairs once, however
   * many times the button is pressed.
   */
  holdsStock: boolean;
}

function asOrder(raw: unknown): Order | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  if (typeof r.ref !== "string" || !r.ref) return null;

  const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? v : 0);
  const str = (v: unknown) => (typeof v === "string" ? v : "");
  const status: OrderStatus = ["new", "confirmed", "delivered", "cancelled"].includes(
    String(r.status),
  )
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
    pay: r.pay === "bank" ? "bank" : "cod",
    customer: {
      name: str(c.name), phone: str(c.phone), emirate: str(c.emirate),
      area: str(c.area), address: str(c.address), window: str(c.window),
      notes: str(c.notes),
    },
    status,
    holdsStock: r.holdsStock === true,
  };
}

async function readStored(): Promise<Order[] | null> {
  if (localStoreEnabled()) {
    const raw = await readLocal<unknown>("orders.json");
    return Array.isArray(raw) ? raw.map(asOrder).filter((o): o is Order => o !== null) : null;
  }
  if (!blobConfigured()) return null;
  try {
    const { blobs } = await list({ prefix: ORDERS_PATH, limit: 1 });
    const doc = blobs.find((b) => b.pathname === ORDERS_PATH);
    if (!doc) return null;

    const res = await fetch(doc.url, { cache: "no-store" });
    if (!res.ok) return null;

    const parsed: unknown = await res.json();
    if (!Array.isArray(parsed)) return null;
    return parsed.map(asOrder).filter((o): o is Order => o !== null);
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
    access: "public",
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
