"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useStore } from "@/context/StoreContext";
import { placeOrderAction } from "@/app/(house)/checkout/actions";
import { money } from "@/lib/money";
import { SITE_CONFIG } from "@/lib/config";
import type { PayMethod } from "@/lib/orders";
import { Button, Label, Price } from "../primitives";
import Steps from "./Steps";
import s from "./flow.module.css";

const EMIRATES = [
  "Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Ras Al Khaimah", "Fujairah", "Umm Al Quwain",
] as const;

const WINDOWS = [
  "As soon as possible", "Morning (9am – 12pm)", "Afternoon (12 – 5pm)", "Evening (5 – 9pm)",
] as const;

/** One payment option, as the server says it is available. */
export interface PayOption {
  method: PayMethod;
  label: string;
  blurb: string;
  /** Instalment providers show the split; everything else leaves this null. */
  split: number | null;
}

/**
 * Delivery and payment.
 *
 * The options come from the server, which lists only what the shop can
 * actually put through today — so a provider without credentials is not a
 * greyed-out button here, it simply is not a choice. Cash on delivery and
 * bank transfer are always available because they need nobody's API.
 */
export default function CheckoutClient({ options }: { options: PayOption[] }) {
  const router = useRouter();
  const {
    lines, subtotal, deliveryFee, discount, total,
    form, setForm, pay, setPay, confirmSize, setConfirmSize,
    ref, setRef, refOk, applyRef, cart, commitOrder, rememberOrder,
  } = useStore();

  const [pending, startTransition] = useTransition();
  const [failure, setFailure] = useState<string | null>(null);

  const resolved = lines();
  const canPlace =
    Boolean(form.name.trim() && form.phone.trim() && form.address.trim()) && resolved.length > 0;

  const t = total();
  const overCodLimit = t > SITE_CONFIG.codLimit;
  // Offered, but not while the bag is over what a courier can take in cash.
  const available = options.filter((o) => !(o.method === "cod" && overCodLimit));
  const chosen = available.find((o) => o.method === pay) ?? available[0];

  /**
   * The order is placed on the server, which prices it, checks the pairs are
   * still on the shelf and takes them off it. Only once that comes back does
   * the bag empty — so a sold-out pair or a dropped connection leaves the
   * customer here with their order intact.
   */
  const submit = () => {
    if (!canPlace || pending) return;
    setFailure(null);
    startTransition(async () => {
      const result = await placeOrderAction(
        cart.map((c) => ({ pid: c.pid, size: c.size, qty: c.qty })),
        form,
        chosen?.method ?? "cod",
        refOk,
      );
      if (!result.ok) {
        setFailure(result.error);
        return;
      }

      /*
       * An online method hands back somebody else's payment page. The order is
       * already written and holding its pairs, so leaving this tab is safe:
       * whether the customer pays, fails or vanishes, the webhook and the hold
       * expiry between them settle it.
       *
       * The bag deliberately survives the trip. Emptying it here would leave
       * someone whose card was declined with neither an order nor anything to
       * try again with; /order clears it once payment is confirmed.
       */
      if ("redirectTo" in result) {
        rememberOrder(result.order);
        window.location.assign(result.redirectTo);
        return;
      }

      commitOrder(result.order);
      router.push("/order");
    });
  };

  return (
    <div className={s.page}>
      <Steps at={2} />
      <h1 className={s.title}>Delivery &amp; payment</h1>

      <div className={s.split}>
        <div>
          <section className={s.section}>
            <h2 className={s.h2}>Where are we delivering?</h2>
            <div className={s.fields}>
              <div className={s.field}>
                <label className={s.label} htmlFor="co-name">Full name</label>
                <input id="co-name" className={s.input} value={form.name}
                  onChange={(e) => setForm({ name: e.target.value })}
                  placeholder="As it should appear on the order" autoComplete="name" />
              </div>
              <div className={s.field}>
                <label className={s.label} htmlFor="co-phone">WhatsApp number</label>
                <input id="co-phone" className={s.input} value={form.phone}
                  onChange={(e) => setForm({ phone: e.target.value })}
                  placeholder="+971 5X XXX XXXX" inputMode="tel" autoComplete="tel" />
              </div>
              <div className={s.field}>
                <label className={s.label} htmlFor="co-emirate">Emirate</label>
                <select id="co-emirate" className={s.select} value={form.emirate}
                  onChange={(e) => setForm({ emirate: e.target.value })}>
                  {EMIRATES.map((e) => <option key={e} value={e}>{e}</option>)}
                </select>
              </div>
              <div className={s.field}>
                <label className={s.label} htmlFor="co-area">Area</label>
                <input id="co-area" className={s.input} value={form.area}
                  onChange={(e) => setForm({ area: e.target.value })} placeholder="e.g. Business Bay" />
              </div>
              <div className={`${s.field} ${s.fieldWide}`}>
                <label className={s.label} htmlFor="co-address">Building, street, apartment</label>
                <textarea id="co-address" className={s.area} value={form.address}
                  onChange={(e) => setForm({ address: e.target.value })}
                  placeholder="Tower name, street, flat or villa number, any landmark" />
              </div>
              <div className={s.field}>
                <label className={s.label} htmlFor="co-window">Delivery window</label>
                <select id="co-window" className={s.select} value={form.window}
                  onChange={(e) => setForm({ window: e.target.value })}>
                  {WINDOWS.map((w) => <option key={w} value={w}>{w}</option>)}
                </select>
              </div>
              <div className={s.field}>
                <label className={s.label} htmlFor="co-notes">Note for the courier</label>
                <input id="co-notes" className={s.input} value={form.notes}
                  onChange={(e) => setForm({ notes: e.target.value })}
                  placeholder="Gate code, call on arrival…" />
              </div>
            </div>
          </section>

          <section className={s.section}>
            <h2 className={s.h2}>Confirm your sizes</h2>
            <div className={s.note}>
              {resolved.map((l) => `EU ${l.size} — ${l.p.name}`).join(" · ") || "Your bag is empty."}
            </div>
            <label className={s.check}>
              <input type="checkbox" checked={confirmSize}
                onChange={(e) => setConfirmSize(e.target.checked)} />
              <span>
                These sizes are correct. I understand collab and Balenciaga pairs can run large or
                small, and I have read the fit note on the product page.
              </span>
            </label>
          </section>

          <section className={s.section}>
            <h2 className={s.h2}>How would you like to pay?</h2>
            <div className={s.pays}>
              {available.map((o) => (
                <button
                  key={o.method}
                  type="button"
                  className={s.pay}
                  aria-pressed={chosen?.method === o.method}
                  onClick={() => setPay(o.method)}
                >
                  <span className={s.payHead}>
                    <span className={s.payName}>{o.label}</span>
                    <span className={s.payMark} aria-hidden />
                  </span>
                  <p className={s.payBlurb}>{o.blurb}</p>
                  {o.split !== null && (
                    <span className={s.paySplit}>4 × {money(Math.ceil(t / 4))}</span>
                  )}
                </button>
              ))}
            </div>

            {overCodLimit && (
              <p className={s.hint}>
                Cash on delivery is off for this order: over {money(SITE_CONFIG.codLimit)} a courier
                cannot carry the change.
              </p>
            )}

            {chosen?.method === "bank" && (
              <div className={s.note}>
                Place the order first — we send the account details on WhatsApp with your order
                number, never on the site. We dispatch on the screenshot.
              </div>
            )}

            {chosen && ["card", "tabby", "tamara"].includes(chosen.method) && (
              <div className={s.note}>
                You will finish on {chosen.label}&apos;s own page and come straight back. Your pairs
                are held for 30 minutes while you do — if the payment does not go through they go
                back on the shelf, and nothing is charged.
              </div>
            )}
          </section>
        </div>

        <aside className={s.aside}>
          <Label tone="brass">{resolved.length} {resolved.length === 1 ? "pair" : "pairs"}</Label>

          {resolved.map((l) => (
            <div key={l.key} className={s.tot}>
              <span>{l.p.name} · EU {l.size} × {l.qty}</span>
              <span>{money(l.amount)}</span>
            </div>
          ))}

          <div className={s.refRow}>
            <input className={s.input} value={ref} onChange={(e) => setRef(e.target.value)}
              placeholder="Referral name" aria-label="Referral name" />
            <Button variant="ghost" onClick={applyRef}>{refOk ? "Applied" : "Apply"}</Button>
          </div>

          <div className={s.tot}><span>Subtotal</span><span>{money(subtotal())}</span></div>
          {discount() > 0 && (
            <div className={`${s.tot} ${s.totCredit}`}>
              <span>Referral credit</span><span>−{money(discount())}</span>
            </div>
          )}
          <div className={s.tot}>
            <span>Delivery — {form.emirate}</span>
            <span>{deliveryFee() === 0 ? "Free" : money(deliveryFee())}</span>
          </div>

          <div className={s.grand}>
            <span className={s.grandLabel}>
              {chosen?.method === "cod" ? "Due on delivery" : "Total"}
            </span>
            <Price amount={t} size="lg" />
          </div>

          <Button block onClick={submit} disabled={!canPlace || pending}>
            {pending
              ? "One moment…"
              : chosen && ["card", "tabby", "tamara"].includes(chosen.method)
                ? `Pay with ${chosen.label}`
                : "Place the order"}
          </Button>

          {failure && <div className={s.failure}>{failure}</div>}

          <p className={s.hint}>
            {canPlace
              ? "We confirm on WhatsApp within 15 minutes, with a photograph of your exact pair."
              : "Name, WhatsApp number and address are needed before we can dispatch."}
          </p>
        </aside>
      </div>
    </div>
  );
}
