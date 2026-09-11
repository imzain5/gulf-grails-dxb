"use server";

import { getOrders, type OrderStatus } from "@/lib/orders";
import { releaseExpiredHolds } from "@/lib/order-flow";

/**
 * Looking up your own order.
 *
 * Orders are remembered in the browser they were placed from, which fails the
 * moment someone clears their history, pays on a phone and checks on a laptop,
 * or simply closes the tab mid-payment. This is the way back in.
 *
 * The proof of ownership is the order reference *and* the full WhatsApp number
 * the order was placed with. The reference alone would not do: it is four
 * digits, so a few thousand guesses would walk the whole order book, and what
 * comes back contains a name and a home address. Requiring the number as well
 * puts the search space out of reach, which is why this asks for the whole
 * number rather than the last four digits.
 *
 * Nothing here reveals whether a reference exists on its own — a wrong
 * reference and a wrong number give the same answer, so this cannot be used to
 * enumerate order numbers either.
 */

export interface OrderView {
  ref: string;
  placedAt: string;
  status: OrderStatus;
  pay: string;
  lines: { name: string; size: number; qty: number; amount: number }[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  deliverTo: string;
  window: string;
  paidAt?: string;
}

export type LookupResult =
  | { ok: true; order: OrderView }
  | { ok: false; error: string };

/** Digits only, last nine — the same key the checkout dedupes customers on. */
function phoneKey(phone: string): string {
  return phone.replace(/\D/g, "").slice(-9);
}

export async function lookupOrderAction(rawRef: string, rawPhone: string): Promise<LookupResult> {
  const ref = String(rawRef ?? "").trim().toUpperCase().replace(/\s+/g, "");
  const phone = phoneKey(String(rawPhone ?? ""));

  if (!ref || phone.length < 7) {
    return {
      ok: false,
      error: "We need the order number and the WhatsApp number it was placed with.",
    };
  }

  // A stale hold would otherwise show as "held" long after the pairs went back.
  await releaseExpiredHolds();

  const orders = await getOrders();
  const found = orders.find(
    // Tolerate "4821" for "GG-4821": people read the digits, not the prefix.
    (o) =>
      (o.ref.toUpperCase() === ref || o.ref.toUpperCase().replace(/^GG-/, "") === ref) &&
      phoneKey(o.customer.phone) === phone,
  );

  if (!found) {
    return {
      ok: false,
      error:
        "No order matches that combination. Check the number is the one you gave us — or message us on WhatsApp and we will find it.",
    };
  }

  return {
    ok: true,
    order: {
      ref: found.ref,
      placedAt: found.placedAt,
      status: found.status,
      pay: found.pay,
      lines: found.lines.map(({ name, size, qty, amount }) => ({ name, size, qty, amount })),
      subtotal: found.subtotal,
      deliveryFee: found.deliveryFee,
      discount: found.discount,
      total: found.total,
      // Enough to check we have it right, without echoing the full record.
      deliverTo: [found.customer.area, found.customer.emirate].filter(Boolean).join(", "),
      window: found.customer.window,
      paidAt: found.payment?.paidAt,
    },
  };
}
