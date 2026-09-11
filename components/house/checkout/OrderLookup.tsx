"use client";

import { useState, useTransition } from "react";
import { lookupOrderAction, type OrderView } from "@/app/(house)/order/actions";
import { money } from "@/lib/money";
import { Button, Label, Tag } from "../primitives";
import s from "./flow.module.css";

const STATUS: Record<string, { label: string; line: string }> = {
  awaiting_payment: {
    label: "Payment pending",
    line: "Your pairs are held while the payment settles. Nothing is charged until it does.",
  },
  new: {
    label: "Received",
    line: "We have it. We confirm on WhatsApp with a photograph of your exact pair before it leaves.",
  },
  confirmed: {
    label: "Confirmed",
    line: "Checked, packed and booked for delivery.",
  },
  delivered: {
    label: "Delivered",
    line: "Signed for. If anything is wrong with the pair, message us — 48 hours for a size exchange.",
  },
  cancelled: {
    label: "Cancelled",
    line: "This order was cancelled and nothing is owed on it.",
  },
};

/**
 * Find an order you have lost the tab for.
 *
 * Asks for the order number and the WhatsApp number together, because what
 * comes back names a person and where they live — see the note in
 * order/actions.ts for why the whole number and not the last four digits.
 */
export default function OrderLookup() {
  const [ref, setRef] = useState("");
  const [phone, setPhone] = useState("");
  const [found, setFound] = useState<OrderView | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pending) return;
    setError(null);
    startTransition(async () => {
      const result = await lookupOrderAction(ref, phone);
      if (result.ok) { setFound(result.order); setError(null); }
      else { setFound(null); setError(result.error); }
    });
  };

  if (found) {
    const meta = STATUS[found.status] ?? STATUS.new;
    return (
      <div>
        <div className={s.badge}>
          <Tag tone={found.status === "cancelled" ? "signal" : "brass"}>{meta.label}</Tag>
        </div>
        <h2 className={`${s.title} ${s.titleSm}`}>Order {found.ref}</h2>
        <p className={s.lead}>{meta.line}</p>

        <div className={s.lines}>
          {found.lines.map((l) => (
            <div key={`${l.name}-${l.size}`} className={s.line}>
              <span className={s.lineMeta}>EU {l.size} × {l.qty}</span>
              <span className={s.lineName}>{l.name}</span>
              <span className={s.lineMoney}>{money(l.amount)}</span>
            </div>
          ))}
        </div>

        <dl className={s.facts}>
          <div className={s.fact}>
            <dt>Placed</dt>
            <dd>{new Date(found.placedAt).toLocaleDateString("en-GB", {
              day: "2-digit", month: "long", year: "numeric" })}</dd>
          </div>
          <div className={s.fact}><dt>Delivering to</dt><dd>{found.deliverTo || "—"}</dd></div>
          <div className={s.fact}><dt>Window</dt><dd>{found.window || "As soon as possible"}</dd></div>
          <div className={s.fact}><dt>Total</dt><dd>{money(found.total)}</dd></div>
        </dl>

        <div className={s.actions}>
          <Button variant="ghost" onClick={() => { setFound(null); setRef(""); setPhone(""); }}>
            Look up another
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form className={s.lookupForm} onSubmit={submit}>
      <Label tone="brass">Find an order</Label>
      <p className={s.hint}>
        Orders are remembered in the browser they were placed from. If that is not this
        one, look it up with the order number and the WhatsApp number you gave us.
      </p>

      <div className={s.fields}>
        <div className={s.field}>
          <label className={s.label} htmlFor="lk-ref">Order number</label>
          <input id="lk-ref" className={s.input} value={ref}
            onChange={(e) => setRef(e.target.value)} placeholder="GG-4821" autoComplete="off" />
        </div>
        <div className={s.field}>
          <label className={s.label} htmlFor="lk-phone">WhatsApp number</label>
          <input id="lk-phone" className={s.input} value={phone}
            onChange={(e) => setPhone(e.target.value)} placeholder="+971 5X XXX XXXX"
            inputMode="tel" autoComplete="tel" />
        </div>
      </div>

      <div className={s.actions}>
        <Button type="submit" disabled={pending}>{pending ? "Looking…" : "Find my order"}</Button>
      </div>

      {error && <div className={s.failure}>{error}</div>}
    </form>
  );
}
