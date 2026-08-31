"use client";

import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { money } from "@/lib/money";
import { SITE_CONFIG } from "@/lib/config";
import { euToUs } from "@/lib/sizes";
import { ProductCardPhoto } from "@/components/ProductPhoto";

export default function CartClient() {
  const { lines, subtotal, deliveryFee, total, setQty, removeLine } = useStore();
  const resolved = lines();

  // Orders over the ceiling are asked to pay by transfer rather than cash at
  // the door — worth saying here, not as a surprise two steps later.
  const overCodLimit = total() > SITE_CONFIG.codLimit;
  const codProgress = Math.min(1, total() / SITE_CONFIG.codLimit);

  return (
    <div data-screen-label="Bag">
      <div className="gg-wrap" style={{ maxWidth: 1180, padding: "clamp(28px,4vw,44px) var(--gutter) clamp(48px,6vw,72px)" }}>
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--color-accent)", marginBottom: 12 }}>Step 1 of 3</div>
        <h1 className="gg-display" style={{ marginBottom: 30, fontSize: "clamp(28px,4vw,56px)", lineHeight: 0.95 }}>Your bag</h1>

        {resolved.length === 0 ? (
          <div style={{ border: "2px solid var(--color-text)", padding: "48px 32px" }}>
            <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 24, marginBottom: 10 }}>Nothing in the bag yet.</div>
            <div style={{ fontSize: 14, color: "var(--color-neutral-700)", maxWidth: "48ch", marginBottom: 22, textWrap: "pretty" }}>
              Thirty pairs are sitting in the stockroom right now, from AED 380 slides to the Air Dior. Have a look.
            </div>
            <Link href="/shop" className="btn btn-primary" style={{ height: 48, paddingInline: 20, fontSize: 12, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", justifyContent: "flex-start" }}>
              Shop the inventory
            </Link>
          </div>
        ) : (
          <div className="gg-cols" style={{ gap: "clamp(24px,3vw,44px)", alignItems: "start", "--cols": "1.5fr .8fr", "--cols-sm": "minmax(0, 1fr)" } as React.CSSProperties}>
            <div style={{ borderTop: "2px solid var(--color-text)" }}>
              {resolved.map((l) => (
                <div key={l.key} style={{ display: "grid", gridTemplateColumns: "96px 1fr auto", gap: 18, padding: "18px 0", borderBottom: "2px solid var(--color-divider)", alignItems: "center" }}>
                  <div className="gg-plate" style={{ position: "relative", width: 96, height: 96, border: "2px solid var(--color-divider)" }}>
                    <ProductCardPhoto product={l.p} padding={6} sizes="96px" />
                  </div>
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--color-neutral-600)", marginBottom: 5 }}>
                      {l.p.brand.toUpperCase()} · EU {l.size} · US {euToUs(l.size)}
                    </div>
                    <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 17, lineHeight: 1.2, marginBottom: 8, textWrap: "pretty" }}>{l.p.name}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <button onClick={() => setQty(l.i, -1)} aria-label="Fewer" style={{ appearance: "none", width: 36, height: 36, border: "2px solid var(--color-text)", background: "var(--color-bg)", cursor: "pointer", font: "inherit", fontWeight: 800, fontSize: 16, color: "inherit" }}>−</button>
                      <span style={{ fontWeight: 800, fontSize: 14, minWidth: 18, textAlign: "center" }}>{l.qty}</span>
                      <button onClick={() => setQty(l.i, 1)} aria-label="More" style={{ appearance: "none", width: 36, height: 36, border: "2px solid var(--color-text)", background: "var(--color-bg)", cursor: "pointer", font: "inherit", fontWeight: 800, fontSize: 16, color: "inherit" }}>+</button>
                      <button onClick={() => removeLine(l.i)} className="btn btn-ghost" style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginLeft: 6 }}>Remove</button>
                    </div>
                  </div>
                  <div style={{ fontFamily: "var(--font-heading)", fontWeight: 900, fontSize: 18, letterSpacing: "-0.02em" }}>{money(l.amount)}</div>
                </div>
              ))}
            </div>
            <div style={{ border: "2px solid var(--color-text)", padding: "26px 24px", background: "var(--color-neutral-100)" }}>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 20 }}>Order summary</div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, paddingBottom: 10 }}>
                <span style={{ color: "var(--color-neutral-700)" }}>Subtotal</span><span style={{ fontWeight: 700 }}>{money(subtotal())}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, paddingBottom: 14, borderBottom: "2px solid var(--color-divider)" }}>
                <span style={{ color: "var(--color-neutral-700)" }}>Delivery</span><span style={{ fontWeight: 700 }}>{deliveryFee() === 0 ? "Free — Dubai" : money(deliveryFee())}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "16px 0 22px" }}>
                <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase" }}>Total due</span>
                <span style={{ fontFamily: "var(--font-heading)", fontWeight: 900, fontSize: 26, letterSpacing: "-0.03em" }}>{money(total())}</span>
              </div>
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10, fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 7 }}>
                  <span style={{ color: overCodLimit ? "var(--color-accent)" : "var(--color-neutral-700)" }}>
                    {overCodLimit ? "Bank transfer for this one" : "Cash on delivery available"}
                  </span>
                  <span className="gg-figure" style={{ color: "var(--color-neutral-600)" }}>
                    {money(SITE_CONFIG.codLimit)} cap
                  </span>
                </div>
                <div style={{ height: 6, background: "var(--color-neutral-300)", position: "relative", overflow: "hidden" }}>
                  <span style={{
                    position: "absolute", inset: 0, transformOrigin: "left",
                    transform: `scaleX(${codProgress})`,
                    background: overCodLimit ? "var(--color-accent)" : "var(--color-text)",
                    transition: "transform .4s var(--ease-out), background .2s var(--ease-out)",
                  }} />
                </div>
                <div style={{ fontSize: 11, lineHeight: 1.5, color: "var(--color-neutral-700)", marginTop: 8, textWrap: "pretty" }}>
                  {overCodLimit
                    ? "Above " + money(SITE_CONFIG.codLimit) + " we ask for a bank transfer before the courier leaves. Details come on WhatsApp with your order number."
                    : "Pay the courier in cash once the pair is in your hands."}
                </div>
              </div>

              <Link href="/checkout" className="gg-btn" style={{ width: "100%" }}>
                Continue to delivery
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></svg>
              </Link>
              <div style={{ fontSize: 12, lineHeight: 1.5, color: "var(--color-neutral-700)", marginTop: 16, textWrap: "pretty" }}>
                You pay nothing now. Cash on delivery or bank transfer, your choice at the next step.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
