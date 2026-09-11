"use server";

import { getCatalogue, saveCatalogue } from "@/lib/catalogue";
import {
  getOrders, newRef, saveOrders, HOLD_MINUTES, isOnline,
  type Order, type OrderLine, type PayMethod,
} from "@/lib/orders";
import { releaseExpiredHolds } from "@/lib/order-flow";
import { providerFor, returnUrls } from "@/lib/payments";
import { TabbyRejected } from "@/lib/payments/tabby";
import { sizePrice } from "@/lib/sizes";
import { SITE_CONFIG } from "@/lib/config";
import type { OrderForm, PlacedOrder } from "@/context/StoreContext";

/**
 * Placing an order.
 *
 * This is the only path that takes stock off the shelf, and it is a public
 * endpoint — anyone can POST to it, form or no form. So it trusts the customer
 * for exactly two things: which pairs, and where to deliver. Everything that
 * costs money is recomputed here from the catalogue, because a browser that
 * can send `{ amount: 1 }` will.
 *
 * Stock is drawn down as the order is written, whatever the payment method.
 * Under cash on delivery an order is a commitment, so the alternative — wait
 * for the shop to confirm on WhatsApp — sells the same last pair twice in the
 * meantime. Under card or instalments the customer is about to disappear onto
 * somebody else's domain, where they may pay, fail, or close the tab; the
 * pairs are held for HOLD_MINUTES and then go back automatically.
 */

/** What the browser is allowed to tell us. */
export interface OrderRequestLine {
  pid: string;
  size: number;
  qty: number;
}

export type PlaceOrderResult =
  | { ok: true; order: PlacedOrder }
  /** An online method: the order exists, unpaid, and the customer must go here. */
  | { ok: true; redirectTo: string; order: PlacedOrder }
  | { ok: false; error: string };

/** No single order may take more than this many of one pair, or this many lines. */
const MAX_QTY_PER_LINE = 5;
const MAX_LINES = 10;
/** How many un-actioned orders one phone number may have open at a time. */
const MAX_OPEN_PER_PHONE = 3;

function cleanForm(raw: OrderForm): OrderForm {
  const trim = (v: unknown, max: number) => String(v ?? "").trim().slice(0, max);
  return {
    name: trim(raw?.name, 120),
    phone: trim(raw?.phone, 40),
    emirate: trim(raw?.emirate, 60) || "Dubai",
    area: trim(raw?.area, 120),
    address: trim(raw?.address, 400),
    window: trim(raw?.window, 60),
    notes: trim(raw?.notes, 400),
  };
}

/** Digits only, so "+971 50 123" and "97150123" count as the same customer. */
function phoneKey(phone: string): string {
  return phone.replace(/\D/g, "").slice(-9);
}

function placed(order: Order): PlacedOrder {
  return {
    ref: order.ref,
    date: new Date(order.placedAt).toLocaleDateString("en-GB", {
      day: "2-digit", month: "short", year: "numeric",
    }),
    lines: order.lines.map(({ name, size, qty, amount }) => ({ name, size, qty, amount })),
    total: order.total,
    discount: order.discount,
    pay: order.pay,
    form: order.customer,
  };
}

export async function placeOrderAction(
  requested: OrderRequestLine[],
  rawForm: OrderForm,
  pay: PayMethod,
  referralApplied: boolean,
): Promise<PlaceOrderResult> {
  const form = cleanForm(rawForm);
  if (!form.name || !form.phone || !form.address) {
    return { ok: false, error: "Name, WhatsApp number and address are all needed." };
  }

  if (!Array.isArray(requested) || requested.length === 0) {
    return { ok: false, error: "Your bag is empty." };
  }
  if (requested.length > MAX_LINES) {
    return { ok: false, error: "That is more pairs than one order can take. Message us instead." };
  }

  const provider = isOnline(pay) ? providerFor(pay) : null;
  if (isOnline(pay) && !provider?.configured()) {
    return { ok: false, error: "That payment method is not available right now. Try another." };
  }

  /*
   * Before anything is priced: give back the pairs that abandoned checkouts
   * are still sitting on. Doing it here means the customer about to be told
   * "sold out" gets the truth rather than a stale hold's shadow.
   */
  await releaseExpiredHolds();

  const catalogue = await getCatalogue();
  const orders = await getOrders();

  const openForPhone = orders.filter(
    (o) =>
      (o.status === "new" || o.status === "awaiting_payment") &&
      phoneKey(o.customer.phone) === phoneKey(form.phone),
  ).length;
  if (openForPhone >= MAX_OPEN_PER_PHONE) {
    return {
      ok: false,
      error: "You already have orders waiting to be confirmed. Message us on WhatsApp and we'll sort them together.",
    };
  }

  // Re-price and re-check every line against the catalogue. Nothing the
  // browser sent about money or availability is carried through.
  const lines: OrderLine[] = [];
  const drawDown = new Map<string, number>();

  for (const line of requested) {
    const product = catalogue.find((p) => p.id === line?.pid);
    if (!product) return { ok: false, error: "One of those pairs is no longer listed." };

    const size = Number(line.size);
    if (!product.sizes.includes(size)) {
      return { ok: false, error: `${product.name} is not stocked in EU ${size}.` };
    }

    const qty = Math.max(1, Math.min(MAX_QTY_PER_LINE, Math.round(Number(line.qty) || 1)));
    const wanted = (drawDown.get(product.id) ?? 0) + qty;
    if (wanted > product.stock) {
      return {
        ok: false,
        error: product.stock === 0
          ? `${product.name} sold out while you were checking out.`
          : `We only have ${product.stock} of the ${product.name} left.`,
      };
    }
    drawDown.set(product.id, wanted);

    lines.push({
      pid: product.id,
      name: product.name,
      size,
      qty,
      amount: sizePrice(product, size) * qty,
    });
  }

  const subtotal = lines.reduce((n, l) => n + l.amount, 0);
  const deliveryFee = form.emirate === "Dubai" ? 0 : SITE_CONFIG.deliveryFeeOutside;
  const discount = referralApplied ? SITE_CONFIG.referralDiscount : 0;
  const total = Math.max(0, subtotal + deliveryFee - discount);

  const order: Order = {
    ref: newRef(new Set(orders.map((o) => o.ref))),
    placedAt: new Date().toISOString(),
    lines,
    subtotal,
    deliveryFee,
    discount,
    total,
    pay,
    customer: form,
    status: provider ? "awaiting_payment" : "new",
    holdsStock: true,
    holdExpiresAt: provider
      ? new Date(Date.now() + HOLD_MINUTES * 60_000).toISOString()
      : undefined,
  };

  try {
    // Stock first: if the order write fails the shop is short a pair it still
    // has, which the stockroom will notice. The other order — order recorded,
    // stock untouched — sells a pair twice.
    await saveCatalogue(
      catalogue.map((p) => {
        const taken = drawDown.get(p.id);
        return taken ? { ...p, stock: Math.max(0, p.stock - taken) } : p;
      }),
    );
    await saveOrders([order, ...orders]);
  } catch (err) {
    console.error("[checkout] could not record the order:", err);
    return {
      ok: false,
      error: "We couldn't record that order. Send it to us on WhatsApp and we'll take it from there.",
    };
  }

  if (!provider) return { ok: true, order: placed(order) };

  /*
   * The order exists and is holding its pairs, so from here every failure has
   * to hand them back rather than leave them held for half an hour on a
   * checkout that was never going to happen.
   */
  try {
    const { returnUrl, cancelUrl } = returnUrls(order.ref);
    const session = await provider.createSession({ order, returnUrl, cancelUrl });

    await saveOrders([
      { ...order, payment: { sessionId: session.sessionId } },
      ...orders,
    ]);

    return { ok: true, redirectTo: session.redirectUrl, order: placed(order) };
  } catch (err) {
    const { failPayment } = await import("@/lib/order-flow");
    await failPayment(order.ref, "The payment session could not be opened.");

    if (err instanceof TabbyRejected) {
      return { ok: false, error: err.message };
    }
    console.error("[checkout] payment session failed:", err);
    return {
      ok: false,
      error: "We couldn't open the payment page. Try another method, or send it to us on WhatsApp.",
    };
  }
}
