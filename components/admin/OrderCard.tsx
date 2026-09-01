"use client";

import { useState } from "react";
import type { Order, OrderStatus } from "@/lib/orders";
import { setOrderStatusAction } from "@/app/admin/actions";
import { money } from "@/lib/money";

/**
 * One order, as the person handling it needs to see it.
 *
 * Everything required to act on the order is on the card: what was bought,
 * what it comes to, who to call and where to take it. The phone number is a
 * WhatsApp link and a dial link, because on a phone that is the next thing
 * that happens after reading the order.
 *
 * Cancel is the only destructive control, and it is the one that gives stock
 * back — so it is confirmed, and the card says out loud what returning the
 * pairs will do.
 */

const STATUS_LABEL: Record<OrderStatus, string> = {
  new: "New",
  confirmed: "Confirmed",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

function waHref(phone: string, ref: string): string {
  const digits = phone.replace(/\D/g, "");
  const text = encodeURIComponent(`Hello, about your Gulf Grails order ${ref} —`);
  return `https://wa.me/${digits}?text=${text}`;
}

export default function OrderCard({ order }: { order: Order }) {
  const [confirmingCancel, setConfirmingCancel] = useState(false);

  const when = new Date(order.placedAt).toLocaleString("en-GB", {
    day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
  });
  const pairs = order.lines.reduce((n, l) => n + l.qty, 0);
  const address = [order.customer.address, order.customer.area, order.customer.emirate]
    .filter(Boolean)
    .join(", ");

  return (
    <div className={`ad-order is-${order.status}`}>
      <div className="ad-order-top">
        <span className="ad-ref">{order.ref}</span>
        <span className={`ad-status is-${order.status}`}>{STATUS_LABEL[order.status]}</span>
        <span className="ad-when">{when}</span>
        <span className="ad-total">{money(order.total)}</span>
      </div>

      <div className="ad-order-lines">
        {order.lines.map((l, i) => (
          <div className="ad-order-line" key={`${l.pid}-${l.size}-${i}`}>
            <span>{l.qty > 1 ? `${l.qty} × ` : ""}{l.name}</span>
            <span>EU {l.size} · {money(l.amount)}</span>
          </div>
        ))}
      </div>

      <div className="ad-who">
        <strong>{order.customer.name}</strong>
        {" · "}
        <a href={waHref(order.customer.phone, order.ref)} target="_blank" rel="noreferrer">
          {order.customer.phone}
        </a>
        {" · "}
        <a href={`tel:${order.customer.phone.replace(/\s/g, "")}`}>Call</a>
        <div>{address}</div>
        <div>
          {order.customer.window}
          {" · "}
          {order.pay === "cod" ? `Cash on delivery — collect ${money(order.total)}` : "Bank transfer"}
          {order.discount > 0 && ` · referral −${money(order.discount)}`}
          {order.deliveryFee > 0 && ` · delivery ${money(order.deliveryFee)}`}
        </div>
        {order.customer.notes && <div>Note: {order.customer.notes}</div>}
      </div>

      <div className="ad-actions" style={{ justifyContent: "flex-start" }}>
        {order.status === "new" && (
          <form action={setOrderStatusAction}>
            <input type="hidden" name="ref" value={order.ref} />
            <input type="hidden" name="status" value="confirmed" />
            <button className="ad-btn is-small" type="submit">Confirmed</button>
          </form>
        )}

        {(order.status === "new" || order.status === "confirmed") && (
          <form action={setOrderStatusAction}>
            <input type="hidden" name="ref" value={order.ref} />
            <input type="hidden" name="status" value="delivered" />
            <button className="ad-btn is-small is-ghost" type="submit">Delivered</button>
          </form>
        )}

        {order.status === "cancelled" || order.status === "delivered" ? null : confirmingCancel ? (
          <form action={setOrderStatusAction} style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <input type="hidden" name="ref" value={order.ref} />
            <input type="hidden" name="status" value="cancelled" />
            <button className="ad-btn is-small is-danger" type="submit">
              Cancel and put {pairs === 1 ? "the pair" : `${pairs} pairs`} back
            </button>
            <button className="ad-btn is-small is-ghost" type="button" onClick={() => setConfirmingCancel(false)}>
              Keep it
            </button>
          </form>
        ) : (
          <button className="ad-btn is-small is-danger" type="button" onClick={() => setConfirmingCancel(true)}>
            Cancel
          </button>
        )}

        {order.status === "cancelled" && !order.holdsStock && (
          <span style={{ fontSize: 13, color: "var(--ad-mute)" }}>Stock was returned.</span>
        )}
      </div>
    </div>
  );
}
