import Stripe from "stripe";
import type { PaymentProvider, PaymentState, SessionRequest, SessionResult } from "./types";
import { toFils } from "./types";

/**
 * Cards, Apple Pay and Google Pay, through Stripe Checkout.
 *
 * Hosted Checkout rather than the embedded Payment Element, deliberately. It
 * keeps card numbers off this domain entirely — the shop never sees a PAN, so
 * the PCI burden is the short SAQ A rather than the long one — and Apple Pay
 * and Google Pay appear on the devices that support them without any work
 * here. The cost is a redirect, which for a shop this size is not a cost.
 *
 * Nothing about price comes from the browser. The session is built from the
 * order the server already wrote and priced.
 */

const CURRENCY = "aed";

function key(): string | null {
  const k = process.env.STRIPE_SECRET_KEY;
  return k && k.length > 0 ? k : null;
}

function client(): Stripe {
  const k = key();
  if (!k) throw new Error("STRIPE_SECRET_KEY is not set.");
  /*
   * Pinned to the version this SDK was generated against, which is also the
   * only value its types accept — so a Stripe API change cannot alter
   * behaviour here until someone upgrades the package and the compiler makes
   * them look at it.
   */
  return new Stripe(k, { apiVersion: "2026-08-26.dahlia" });
}

export const stripeProvider: PaymentProvider = {
  method: "card",
  label: "Card",
  blurb: "Visa, Mastercard, Apple Pay and Google Pay. Paid in full, now.",

  configured: () => key() !== null,

  async createSession({ order, returnUrl, cancelUrl }: SessionRequest): Promise<SessionResult> {
    const stripe = client();

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      // Stripe re-adds the reference on the way back, so the return page can
      // find the order without trusting a query string the customer can edit.
      client_reference_id: order.ref,
      success_url: returnUrl,
      cancel_url: cancelUrl,
      customer_email: undefined,
      metadata: { ref: order.ref },
      /*
       * Expire the session with the stock hold rather than at Stripe's own
       * default. Leaving them out of step means a customer paying a session
       * whose pairs have already gone back on the shelf.
       */
      expires_at: order.holdExpiresAt
        ? Math.floor(new Date(order.holdExpiresAt).getTime() / 1000)
        : undefined,
      line_items: [
        ...order.lines.map((l) => ({
          quantity: l.qty,
          price_data: {
            currency: CURRENCY,
            // amount is the line total for qty pairs, so divide back out.
            unit_amount: toFils(l.amount / l.qty),
            product_data: { name: `${l.name} — EU ${l.size}` },
          },
        })),
        ...(order.deliveryFee > 0
          ? [{
              quantity: 1,
              price_data: {
                currency: CURRENCY,
                unit_amount: toFils(order.deliveryFee),
                product_data: { name: `Delivery — ${order.customer.emirate}` },
              },
            }]
          : []),
      ],
      /*
       * A referral credit is a discount on the whole order, and Checkout will
       * not take a negative line item. A one-off coupon is the shape Stripe
       * actually has for this, and it keeps the receipt honest: the customer
       * sees the pairs at full price and the credit named underneath.
       */
      discounts: order.discount > 0
        ? [{ coupon: (await stripe.coupons.create({
            amount_off: toFils(order.discount),
            currency: CURRENCY,
            duration: "once",
            name: "Referral credit",
            max_redemptions: 1,
          })).id }]
        : undefined,
    });

    if (!session.url) throw new Error("Stripe returned a session with no URL.");
    return { redirectUrl: session.url, sessionId: session.id };
  },

  async readState(sessionId: string): Promise<PaymentState> {
    const session = await client().checkout.sessions.retrieve(sessionId);

    // payment_status is the one to read: `status: "complete"` is also true for
    // a session completed without payment being collected.
    if (session.payment_status === "paid" || session.payment_status === "no_payment_required") {
      const pi = session.payment_intent;
      return { state: "paid", paymentId: typeof pi === "string" ? pi : pi?.id };
    }
    if (session.status === "expired") {
      return { state: "failed", reason: "The payment session expired before it was completed." };
    }
    return { state: "pending" };
  },
};

/** Verify and parse a webhook. Throws when the signature does not check out. */
export function stripeEvent(body: string, signature: string): Stripe.Event {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) throw new Error("STRIPE_WEBHOOK_SECRET is not set.");
  return client().webhooks.constructEvent(body, signature, secret);
}
