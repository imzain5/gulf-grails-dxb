import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getOrders, isOnline } from "@/lib/orders";
import { markPaid, failPayment } from "@/lib/order-flow";
import { providerFor } from "@/lib/payments";
import { tamaraAuthorise } from "@/lib/payments/tamara";
import { money } from "@/lib/money";
import OrderSendButton from "@/components/house/checkout/OrderClient";
import ClearBag from "@/components/house/checkout/ClearBag";
import LocalOrderBody from "@/components/house/checkout/LocalOrderBody";
import Steps from "@/components/house/checkout/Steps";
import { Button, Label, Tag } from "@/components/house/primitives";
import s from "@/components/house/checkout/flow.module.css";

export const metadata: Metadata = {
  title: "Order confirmed",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

/**
 * Where an order lands, and where a payment comes back to.
 *
 * Two arrivals share this page. A cash or transfer order simply gets here, and
 * the browser already knows everything. A card or instalment order returns
 * from the provider, and the only honest way to tell the customer whether it
 * worked is to ask the provider — not to read the query string they came back
 * on, which anyone can type.
 *
 * The webhook is the authority for orders nobody returns from. This is the
 * same check run early, so that somebody standing on the page ten seconds
 * after paying is told the truth rather than "pending".
 */
export default async function OrderPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const { ref } = await searchParams;

  /*
   * No reference: the cash or transfer path. Nothing to verify with anyone, and
   * the order is not looked up server-side — it is rendered from what this
   * browser remembers, so one person's confirmation page cannot be opened by
   * typing somebody else's order number.
   */
  if (!ref) {
    return (
      <div className={s.page}>
        <Steps at={3} />
        <LocalOrderBody />
      </div>
    );
  }

  const order = (await getOrders()).find((o) => o.ref === ref);
  if (!order) notFound();

  let paid = order.status !== "awaiting_payment" && order.status !== "cancelled";
  let failedReason: string | null = order.status === "cancelled"
    ? order.payment?.note ?? "This order was cancelled."
    : null;

  if (order.status === "awaiting_payment" && isOnline(order.pay) && order.payment?.sessionId) {
    const provider = providerFor(order.pay);
    if (provider?.configured()) {
      try {
        const state = await provider.readState(order.payment.sessionId);
        if (state.state === "paid") {
          if (order.pay === "tamara") await tamaraAuthorise(order.payment.sessionId);
          await markPaid(order.ref, state.paymentId);
          paid = true;
        } else if (state.state === "failed") {
          await failPayment(order.ref, state.reason);
          failedReason = state.reason;
        }
      } catch (err) {
        // Leave it pending rather than guess. The webhook will settle it, and
        // the copy below says exactly that.
        console.error("[order] could not read payment state:", err);
      }
    }
  }

  return (
    <div className={s.page}>
      <ClearBag when={paid} />
      <Steps at={3} />

      {failedReason ? (
        <>
          <h1 className={s.title}>That payment did not go through.</h1>
          <p className={s.lead}>
            {failedReason} Nothing has been charged, and the pairs are back on the shelf —
            so if you want them, go again now rather than later.
          </p>
          <div className={s.actions}>
            <Button href="/checkout">Try another way to pay</Button>
            <Button variant="ghost" href="/shop">Back to the stockroom</Button>
          </div>
        </>
      ) : paid ? (
        <>
          <div className={s.badge}><Tag tone="brass">Paid</Tag></div>
          <h1 className={s.title}>Order {order.ref} is in.</h1>
          <p className={s.lead}>
            Paid in full and recorded. We confirm on WhatsApp within fifteen minutes with a
            photograph of your exact pair, then lock the delivery slot.
          </p>
          <OrderDetail order={order} />
        </>
      ) : (
        <>
          <div className={s.badge}><Tag>Waiting on the payment</Tag></div>
          <h1 className={s.title}>Order {order.ref} is held.</h1>
          <p className={s.lead}>
            Your pairs are reserved while the payment settles — this can take a minute. Nothing
            more is needed from you; we will confirm on WhatsApp either way. If it does not
            complete, the pairs go back on the shelf and nothing is charged.
          </p>
          <OrderDetail order={order} />
        </>
      )}
    </div>
  );
}

function OrderDetail({ order }: { order: Awaited<ReturnType<typeof getOrders>>[number] }) {
  return (
    <div className={s.split}>
      <div>
        <section className={s.section}>
          <h2 className={s.h2}>What is coming</h2>
          <div className={s.lines}>
            {order.lines.map((l) => (
              <div key={`${l.pid}-${l.size}`} className={s.line}>
                <span className={s.lineMeta}>EU {l.size} × {l.qty}</span>
                <span className={s.lineName}>{l.name}</span>
                <span className={s.lineMoney}>{money(l.amount)}</span>
              </div>
            ))}
          </div>
        </section>

        <section className={s.section}>
          <h2 className={s.h2}>Where</h2>
          <dl className={s.facts}>
            <div className={s.fact}><dt>Name</dt><dd>{order.customer.name}</dd></div>
            <div className={s.fact}><dt>WhatsApp</dt><dd>{order.customer.phone}</dd></div>
            <div className={s.fact}>
              <dt>Address</dt>
              <dd>{[order.customer.address, order.customer.area, order.customer.emirate].filter(Boolean).join(", ")}</dd>
            </div>
            <div className={s.fact}><dt>Window</dt><dd>{order.customer.window || "As soon as possible"}</dd></div>
          </dl>
        </section>
      </div>

      <aside className={s.aside}>
        <Label tone="brass">Order {order.ref}</Label>
        <div className={s.tot}><span>Subtotal</span><span>{money(order.subtotal)}</span></div>
        {order.discount > 0 && (
          <div className={`${s.tot} ${s.totCredit}`}>
            <span>Referral credit</span><span>−{money(order.discount)}</span>
          </div>
        )}
        <div className={s.tot}>
          <span>Delivery</span>
          <span>{order.deliveryFee === 0 ? "Free" : money(order.deliveryFee)}</span>
        </div>
        <div className={s.grand}>
          <span className={s.grandLabel}>{order.pay === "cod" ? "Due on delivery" : "Paid"}</span>
          <span className={s.lineMoney}>{money(order.total)}</span>
        </div>
        <OrderSendButton />
      </aside>
    </div>
  );
}
