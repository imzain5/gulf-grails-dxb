import type { PaymentProvider, PaymentState, SessionRequest, SessionResult } from "./types";

/**
 * Tamara — split in instalments, the other one everyone in the Gulf has.
 *
 * ⚠️ UNVERIFIED WIRE FORMAT, for the same reason as tabby.ts: no SDK, no
 * reachable documentation from here, shapes taken from their published
 * reference as quoted in secondary sources. Prove it in sandbox before it
 * takes a real order. `TAMARA_API_BASE` exists so sandbox is a config change
 * rather than an edit.
 *
 * The step that is easy to miss: Tamara's webhook telling you an order is
 * approved is not the end of it. The merchant must call back and *authorise*
 * the order, or it never progresses and the customer is left holding an
 * approval that does nothing. That is `tamaraAuthorise`, and the webhook
 * route calls it before marking the order paid.
 */

function base(): string {
  // Sandbox is https://api-sandbox.tamara.co
  return process.env.TAMARA_API_BASE || "https://api.tamara.co";
}
function token(): string | null {
  return process.env.TAMARA_API_TOKEN || null;
}

async function tamara(path: string, init?: RequestInit): Promise<Response> {
  return fetch(`${base()}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token()}`,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });
}

export const tamaraProvider: PaymentProvider = {
  method: "tamara",
  label: "Tamara",
  blurb: "Split it in instalments. No interest if you pay on schedule.",

  configured: () => token() !== null,

  async createSession({ order, returnUrl, cancelUrl }: SessionRequest): Promise<SessionResult> {
    const [first = "", ...rest] = order.customer.name.split(" ");

    const res = await tamara("/checkout", {
      method: "POST",
      body: JSON.stringify({
        order_reference_id: order.ref,
        total_amount: { amount: order.total.toFixed(2), currency: "AED" },
        description: `Gulf Grails order ${order.ref}`,
        country_code: "AE",
        payment_type: "PAY_BY_INSTALMENTS",
        locale: "en_US",
        consumer: {
          first_name: first,
          last_name: rest.join(" ") || first,
          phone_number: order.customer.phone,
          email: "",
        },
        shipping_address: {
          first_name: first,
          last_name: rest.join(" ") || first,
          line1: order.customer.address,
          city: order.customer.emirate,
          country_code: "AE",
        },
        items: order.lines.map((l) => ({
          reference_id: l.pid,
          type: "Physical",
          name: `${l.name} — EU ${l.size}`,
          sku: l.pid,
          quantity: l.qty,
          unit_price: { amount: (l.amount / l.qty).toFixed(2), currency: "AED" },
          total_amount: { amount: l.amount.toFixed(2), currency: "AED" },
        })),
        shipping_amount: { amount: order.deliveryFee.toFixed(2), currency: "AED" },
        discount: order.discount > 0
          ? { name: "Referral credit", amount: { amount: order.discount.toFixed(2), currency: "AED" } }
          : undefined,
        merchant_url: { success: returnUrl, failure: cancelUrl, cancel: cancelUrl },
      }),
    });

    if (!res.ok) {
      throw new Error(`Tamara refused the session (${res.status}): ${await res.text()}`);
    }

    const body = (await res.json()) as {
      order_id?: string;
      checkout_url?: string;
      status?: string;
    };
    if (!body.checkout_url || !body.order_id) {
      throw new Error("Tamara returned a session with no checkout URL.");
    }
    // The order_id, not the checkout_id: every later call is keyed on it.
    return { redirectUrl: body.checkout_url, sessionId: body.order_id };
  },

  async readState(sessionId: string): Promise<PaymentState> {
    const res = await tamara(`/orders/${encodeURIComponent(sessionId)}`);
    if (!res.ok) return { state: "pending" };

    const body = (await res.json()) as { status?: string };
    switch (body.status) {
      case "approved":
      case "authorised":
      case "fully_captured":
      case "partially_captured":
        return { state: "paid" };
      case "declined":
      case "expired":
      case "canceled":
      case "cancelled":
        return { state: "failed", reason: `Tamara ${body.status} the order.` };
      default:
        return { state: "pending" };
    }
  },
};

/**
 * Confirm an approved Tamara order.
 *
 * Approval is Tamara telling us the customer is good for it. Until the
 * merchant authorises, nothing proceeds — so this is not optional and not a
 * formality.
 */
export async function tamaraAuthorise(orderId: string): Promise<void> {
  const res = await tamara(`/orders/${encodeURIComponent(orderId)}/authorise`, { method: "POST" });
  // Already authorised is a success from where we stand: the webhook can and
  // does arrive more than once.
  if (!res.ok && res.status !== 409) {
    throw new Error(`Tamara authorise failed (${res.status}): ${await res.text()}`);
  }
}
