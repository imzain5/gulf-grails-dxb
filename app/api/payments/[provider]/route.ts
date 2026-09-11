import { NextResponse } from "next/server";
import { getOrders, type PayMethod } from "@/lib/orders";
import { failPayment, markPaid } from "@/lib/order-flow";
import { providerFor } from "@/lib/payments";
import { stripeEvent } from "@/lib/payments/stripe";
import { tamaraAuthorise } from "@/lib/payments/tamara";

/**
 * Where the payment providers tell us what happened.
 *
 * The customer coming back to /order is the fast path and the happy one. This
 * is the path that matters when they do not come back — they paid and the
 * phone died, or the redirect got eaten. Without it those orders sit unpaid
 * until the hold expires and the pairs go back, having been paid for.
 *
 * The rule here: **a webhook body never decides that an order is paid.** It
 * says which order to go and ask about; the answer comes from a direct call to
 * the provider's API with our own credentials. That holds even where the
 * signature checks out, and it is what makes the two weaker verifications
 * below acceptable — a forged notification for a real order reference gets us
 * to ask Stripe or Tabby about it, and they say no.
 */

// Stripe signature verification needs the raw body and node crypto.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Constant-time-ish comparison for the shared secrets. */
function sameSecret(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/**
 * Which order this notification is about, and whether the sender is plausible.
 *
 * Returns the order reference, or null to reject. Deliberately does not decide
 * anything about payment.
 */
async function identify(
  method: PayMethod,
  req: Request,
  body: string,
): Promise<string | null> {
  if (method === "card") {
    const signature = req.headers.get("stripe-signature");
    if (!signature) return null;
    // Throws on a bad signature; the caller turns that into a 400.
    const event = stripeEvent(body, signature);
    const object = event.data.object as {
      client_reference_id?: string | null;
      metadata?: Record<string, string> | null;
    };
    return object.client_reference_id || object.metadata?.ref || null;
  }

  if (method === "tabby") {
    const expected = process.env.TABBY_WEBHOOK_SECRET;
    const got = req.headers.get("x-tabby-signature") ?? req.headers.get("authorization") ?? "";
    if (!expected || !sameSecret(got.replace(/^Bearer\s+/i, ""), expected)) return null;
    const parsed = JSON.parse(body) as { order?: { reference_id?: string } };
    return parsed.order?.reference_id ?? null;
  }

  if (method === "tamara") {
    /*
     * Tamara sends its notification token both as ?tamaraToken= and as a
     * bearer header. It is a JWT, but we hold the expected value, so an equality
     * check is a stronger statement than verifying the signature of a token
     * whose issuer key we would have to fetch and trust anyway.
     */
    const expected = process.env.TAMARA_NOTIFICATION_TOKEN;
    const url = new URL(req.url);
    const got =
      url.searchParams.get("tamaraToken") ??
      (req.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "");
    if (!expected || !sameSecret(got, expected)) return null;
    const parsed = JSON.parse(body) as { order_reference_id?: string };
    return parsed.order_reference_id ?? null;
  }

  return null;
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ provider: string }> },
) {
  const { provider: name } = await params;
  const method = name as PayMethod;
  const provider = providerFor(method);

  if (!provider || !provider.configured()) {
    return NextResponse.json({ error: "Unknown provider." }, { status: 404 });
  }

  const body = await req.text();

  let ref: string | null;
  try {
    ref = await identify(method, req, body);
  } catch (err) {
    console.error(`[webhook:${name}] rejected:`, err);
    return NextResponse.json({ error: "Bad signature." }, { status: 400 });
  }
  if (!ref) return NextResponse.json({ error: "Unattributable." }, { status: 400 });

  const order = (await getOrders()).find((o) => o.ref === ref);
  if (!order) {
    // 200: the notification is well-formed and there is nothing to do. A 404
    // here just makes the provider retry something that will never succeed.
    return NextResponse.json({ ok: true, note: "No such order." });
  }
  if (order.status !== "awaiting_payment") {
    return NextResponse.json({ ok: true, note: "Already settled." });
  }
  if (!order.payment?.sessionId) {
    return NextResponse.json({ ok: true, note: "No session recorded." });
  }

  // The provider's own API, with our credentials — not the request body.
  const state = await provider.readState(order.payment.sessionId);

  if (state.state === "paid") {
    /*
     * Tamara approves and then waits to be told we accept. Skipping this
     * leaves the customer with an approval that never becomes an order, so it
     * happens before we call the order paid — if it throws, the webhook fails
     * and Tamara retries.
     */
    if (method === "tamara") await tamaraAuthorise(order.payment.sessionId);
    await markPaid(ref, state.paymentId);
    return NextResponse.json({ ok: true, status: "paid" });
  }

  if (state.state === "failed") {
    await failPayment(ref, state.reason);
    return NextResponse.json({ ok: true, status: "failed" });
  }

  // Still pending: leave the hold alone and let it expire on its own if this
  // is as far as the payment ever gets.
  return NextResponse.json({ ok: true, status: "pending" });
}
