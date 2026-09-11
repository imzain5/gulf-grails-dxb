"use client";

import { useStore } from "@/context/StoreContext";
import { money } from "@/lib/money";
import { waLink } from "@/lib/whatsapp";
import { Button, Label, Price, Tag } from "../primitives";
import s from "./flow.module.css";

/**
 * A cash-on-delivery or transfer confirmation, rendered from this browser.
 *
 * Deliberately not fetched by order number. The reference is short and
 * guessable, so a server-rendered lookup would let anyone read a stranger's
 * name, phone and address by typing GG-4821 — the same mistake as publishing
 * the orders file. What the customer's own browser already holds is theirs by
 * definition.
 */
export default function LocalOrderBody() {
  const { lastOrder: o, orderMessageText } = useStore();

  if (!o) {
    return (
      <>
        <h1 className={`${s.title} ${s.titleSm}`}>No recent order on this device.</h1>
        <div className={s.empty}>
          <span className={s.emptyTitle}>Nothing to show here.</span>
          <p className={s.emptyBody}>
            Orders are remembered in the browser they were placed from. If you have an
            order with us, message us on WhatsApp with your name and we will find it.
          </p>
          <Button href="/shop">See what we are holding</Button>
        </div>
      </>
    );
  }

  return (
    <>
      <div className={s.badge}>
        <Tag tone="brass">{o.pay === "cod" ? "Pay on delivery" : "Bank transfer"}</Tag>
      </div>
      <h1 className={s.title}>Order {o.ref} is in.</h1>
      <p className={s.lead}>
        Send it through on WhatsApp and we will confirm your exact pair with a photograph,
        then lock the delivery slot. It is the fastest way to reach us.
      </p>

      <div className={s.actions}>
        <Button href={waLink(orderMessageText(o))} target="_blank" rel="noopener">
          Send order {o.ref} on WhatsApp
        </Button>
        <Button variant="ghost" href="/shop">Keep looking</Button>
      </div>

      <div className={s.split} style={{ marginTop: "var(--pad-lg)" }}>
        <div>
          <h2 className={s.h2}>What is coming</h2>
          <div className={s.lines}>
            {o.lines.map((l) => (
              <div key={`${l.name}-${l.size}`} className={s.line}>
                <span className={s.lineMeta}>EU {l.size} × {l.qty}</span>
                <span className={s.lineName}>{l.name}</span>
                <span className={s.lineMoney}>{money(l.amount)}</span>
              </div>
            ))}
          </div>
        </div>

        <aside className={s.aside}>
          <Label tone="brass">Order {o.ref}</Label>
          <dl className={s.facts}>
            <div className={s.fact}><dt>Placed</dt><dd>{o.date}</dd></div>
            <div className={s.fact}><dt>Name</dt><dd>{o.form.name}</dd></div>
            <div className={s.fact}>
              <dt>Address</dt>
              <dd>{[o.form.address, o.form.area, o.form.emirate].filter(Boolean).join(", ")}</dd>
            </div>
          </dl>
          <div className={s.grand}>
            <span className={s.grandLabel}>
              {o.pay === "cod" ? "Due on delivery" : "Due by transfer"}
            </span>
            <Price amount={o.total} size="lg" />
          </div>
        </aside>
      </div>
    </>
  );
}
