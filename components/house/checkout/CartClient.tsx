"use client";

import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { money } from "@/lib/money";
import { SITE_CONFIG } from "@/lib/config";
import { euToUs } from "@/lib/sizes";
import { coverPhoto } from "@/data/products";
import Frame from "../Frame";
import { Button, Label, Price } from "../primitives";
import Steps from "./Steps";
import s from "./flow.module.css";

/**
 * The bag.
 *
 * Quantities change here and nowhere else, and every figure is the server's
 * arithmetic repeated — checkout re-prices from the catalogue regardless, so
 * what is shown here is a preview of the bill rather than the bill.
 */
export default function CartClient({ instalment }: { instalment: number | null }) {
  const { lines, subtotal, deliveryFee, total, setQty, removeLine } = useStore();
  const resolved = lines();

  if (resolved.length === 0) {
    return (
      <div className={s.page}>
        <Steps at={1} />
        <h1 className={s.title}>Your bag</h1>
        <div className={s.empty}>
          <span className={s.emptyTitle}>Nothing in it yet.</span>
          <p className={s.emptyBody}>
            Everything listed is physically in the stockroom in Jumeirah — one pair,
            one chance, and when it leaves the listing goes with it.
          </p>
          <Button href="/shop">See what we are holding</Button>
        </div>
      </div>
    );
  }

  const t = total();
  const overCodLimit = t > SITE_CONFIG.codLimit;

  return (
    <div className={s.page}>
      <Steps at={1} />
      <h1 className={s.title}>Your bag</h1>

      <div className={s.split}>
        <div className={s.lines}>
          {resolved.map((l) => (
            <div key={l.key} className={s.line}>
              <div className={s.shot}>
                <Frame src={coverPhoto(l.p)} alt="" ratio="1:1" sizes="92px" pad="8%" />
              </div>

              <div>
                <span className={s.lineMeta}>
                  {l.p.brand} · EU {l.size} · US {euToUs(l.size)}
                </span>
                <Link href={`/product/${l.p.id}`} className={s.lineName}>{l.p.name}</Link>

                <div className={s.qty}>
                  <button type="button" className={s.qtyBtn} onClick={() => setQty(l.i, -1)} aria-label="One fewer">−</button>
                  <span className={s.qtyNum}>{l.qty}</span>
                  <button type="button" className={s.qtyBtn} onClick={() => setQty(l.i, 1)} aria-label="One more">+</button>
                  <button type="button" className={s.remove} onClick={() => removeLine(l.i)}>Remove</button>
                </div>
              </div>

              <span className={s.lineMoney}>{money(l.amount)}</span>
            </div>
          ))}
        </div>

        <aside className={s.aside}>
          <Label tone="brass">Summary</Label>

          <div className={s.tot}><span>Subtotal</span><span>{money(subtotal())}</span></div>
          <div className={s.tot}>
            <span>Delivery</span>
            <span>{deliveryFee() === 0 ? "Free — Dubai" : money(deliveryFee())}</span>
          </div>

          <div className={s.grand}>
            <span className={s.grandLabel}>Total</span>
            <Price amount={t} size="lg" />
          </div>

          {/* Only claimed where an instalment provider is actually connected. */}
          {instalment !== null && (
            <p className={s.hint}>
              Or from <b>{money(Math.ceil(t / 4))}</b> a month over four payments, subject to
              approval at checkout.
            </p>
          )}

          <Button href="/checkout" block>Checkout</Button>

          {overCodLimit && (
            <p className={s.hint}>
              Over {money(SITE_CONFIG.codLimit)} we ask for a transfer or a card rather than cash
              at the door — couriers do not carry that much change.
            </p>
          )}
        </aside>
      </div>
    </div>
  );
}
