"use client";

import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { money } from "@/lib/money";
import { euToUs } from "@/lib/sizes";
import ProductPhoto from "@/components/ProductPhoto";
import ImageSlot from "@/components/ImageSlot";

export default function CartClient() {
  const { lines, subtotal, deliveryFee, total, setQty, removeLine } = useStore();
  const resolved = lines();

  return (
    <div data-screen-label="Bag">
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "44px 28px 72px" }}>
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--color-accent)", marginBottom: 12 }}>Step 1 of 3</div>
        <h1 style={{ margin: "0 0 30px", fontSize: "clamp(32px,4vw,56px)", lineHeight: 0.95, letterSpacing: "-0.04em", textTransform: "uppercase" }}>Your bag</h1>

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
          <div style={{ display: "grid", gridTemplateColumns: "1.5fr .8fr", gap: 44, alignItems: "start" }}>
            <div style={{ borderTop: "2px solid var(--color-text)" }}>
              {resolved.map((l) => (
                <div key={l.key} style={{ display: "grid", gridTemplateColumns: "96px 1fr auto", gap: 18, padding: "18px 0", borderBottom: "2px solid var(--color-divider)", alignItems: "center" }}>
                  <div style={{ position: "relative", width: 96, height: 96, background: "#fff", border: "2px solid var(--color-divider)" }}>
                    {l.p.photos ? (
                      <ProductPhoto src={l.p.photos[0]} alt={l.p.name} padding={6} sizes="96px" />
                    ) : (
                      <ImageSlot id={"gg-" + l.p.id} placeholder={l.p.name} />
                    )}
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
              <Link href="/checkout" className="btn btn-primary btn-block" style={{ height: 52, paddingInline: 20, fontSize: 12, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", marginTop: 0 }}>
                Continue to delivery →
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
