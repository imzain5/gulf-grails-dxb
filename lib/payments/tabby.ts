import type { PaymentProvider, PaymentState, SessionRequest, SessionResult } from "./types";

/**
 * Tabby — four instalments, no interest, popular in the UAE.
 *
 * ⚠️ UNVERIFIED WIRE FORMAT. The Stripe provider beside this one is written
 * against Stripe's own generated types, so the compiler checks it. Tabby has
 * no SDK and their documentation was not reachable from where this was
 * written, so the request and response shapes here come from their published
 * reference as quoted in secondary sources. The flow is right; a field name
 * may not be. Run a sandbox order end to end before turning this on for real
 * customers — `configured()` keeps it off the checkout page until the keys
 * exist, which is the safety catch.
 *
 * The part that is easy to get wrong and expensive to miss: Tabby answers
 * `status: "rejected"` for a customer it will not lend to, and that is a
 * normal answer rather than an error. Their merchant terms require the
 * customer be told to use another method, not shown a failure.
 */

const API = "https://api.tabby.ai/api/v2";

/** Session creation authenticates with the public key, reads with the secret. */
function publicKey(): string | null {
  return process.env.TABBY_PUBLIC_KEY || null;
}
function secretKey(): string | null {
  return process.env.TABBY_SECRET_KEY || null;
}
function merchantCode(): string {
  return process.env.TABBY_MERCHANT_CODE || "";
}

export class TabbyRejected extends Error {
  constructor() {
    super(
      "Tabby could not approve this order. It is not a reflection on you — try a card, or cash on delivery.",
    );
    this.name = "TabbyRejected";
  }
}

export const tabbyProvider: PaymentProvider = {
  method: "tabby",
  label: "Tabby",
  blurb: "Four payments, six weeks, no interest and no fees.",

  configured: () => Boolean(publicKey() && secretKey() && merchantCode()),

  async createSession({ order, returnUrl, cancelUrl }: SessionRequest): Promise<SessionResult> {
    const res = await fetch(`${API}/checkout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${publicKey()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        lang: "en",
        merchant_code: merchantCode(),
        merchant_urls: { success: returnUrl, cancel: cancelUrl, failure: cancelUrl },
        payment: {
          amount: order.total.toFixed(2),
          currency: "AED",
          buyer: {
            phone: order.customer.phone,
            name: order.customer.name,
            email: "",
          },
          shipping_address: {
            city: order.customer.emirate,
            address: `${order.customer.address}, ${order.customer.area}`.trim(),
            zip: "",
          },
          order: {
            reference_id: order.ref,
            items: order.lines.map((l) => ({
              title: l.name,
              quantity: l.qty,
              unit_price: (l.amount / l.qty).toFixed(2),
              category: "Sneakers",
            })),
          },
        },
      }),
    });

    if (!res.ok) {
      throw new Error(`Tabby refused the session (${res.status}): ${await res.text()}`);
    }

    const body = (await res.json()) as {
      status?: string;
      payment?: { id?: string };
      configuration?: { available_products?: { installments?: { web_url?: string }[] } };
    };

    // Not an error — a decision. The checkout page turns this into advice.
    if (body.status === "rejected") throw new TabbyRejected();

    const url = body.configuration?.available_products?.installments?.[0]?.web_url;
    // Never redirect without a URL: their integration rules say so, and a
    // redirect to undefined is a broken checkout either way.
    if (!url) throw new Error("Tabby approved the session but returned no redirect URL.");

    return { redirectUrl: url, sessionId: body.payment?.id ?? "" };
  },

  async readState(sessionId: string): Promise<PaymentState> {
    const res = await fetch(`${API}/payments/${encodeURIComponent(sessionId)}`, {
      headers: { Authorization: `Bearer ${secretKey()}` },
      cache: "no-store",
    });
    if (!res.ok) return { state: "pending" };

    const body = (await res.json()) as { status?: string; id?: string };
    switch (body.status) {
      case "AUTHORIZED":
      case "CLOSED":
        return { state: "paid", paymentId: body.id };
      case "REJECTED":
      case "EXPIRED":
        return { state: "failed", reason: `Tabby ${String(body.status).toLowerCase()} the payment.` };
      default:
        return { state: "pending" };
    }
  },
};

/**
 * Capture an authorised Tabby payment.
 *
 * Tabby authorises at checkout and expects the merchant to capture when the
 * goods go out — money does not actually move until this is called. The
 * stockroom calls it when an order is marked dispatched.
 */
export async function tabbyCapture(paymentId: string, amount: number): Promise<void> {
  const res = await fetch(`${API}/payments/${encodeURIComponent(paymentId)}/captures`, {
    method: "POST",
    headers: { Authorization: `Bearer ${secretKey()}`, "Content-Type": "application/json" },
    body: JSON.stringify({ amount: amount.toFixed(2) }),
  });
  if (!res.ok) throw new Error(`Tabby capture failed (${res.status}): ${await res.text()}`);
}
