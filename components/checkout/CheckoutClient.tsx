"use client";

import { useRouter } from "next/navigation";
import { useStore } from "@/context/StoreContext";
import { money } from "@/lib/money";
import { SITE_CONFIG } from "@/lib/config";

export default function CheckoutClient() {
  const router = useRouter();
  const {
    lines, subtotal, deliveryFee, discount, total, cartCount,
    form, setForm, pay, setPay, receipt, setReceipt, confirmSize, setConfirmSize,
    ref, setRef, refOk, applyRef, placeOrder,
  } = useStore();

  const resolved = lines();
  const canPlace = !!(form.name.trim() && form.phone.trim() && form.address.trim()) && resolved.length > 0;
  const sizeSummary = resolved.map((l) => "EU " + l.size + " — " + l.p.name).join(" · ");

  const submit = () => {
    if (!canPlace) return;
    const order = placeOrder();
    if (order) router.push("/order");
  };

  return (
    <div data-screen-label="Checkout">
      <div className="gg-wrap" style={{ maxWidth: 1180, padding: "clamp(28px,4vw,44px) var(--gutter) clamp(48px,6vw,72px)" }}>
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--color-accent)", marginBottom: 12 }}>Step 2 of 3</div>
        <h1 className="gg-display" style={{ marginBottom: 30, fontSize: "clamp(28px,4vw,56px)", lineHeight: 0.95 }}>Delivery &amp; payment</h1>

        <div className="gg-cols" style={{ gap: "clamp(24px,3vw,44px)", alignItems: "start", "--cols": "1.5fr .8fr", "--cols-sm": "minmax(0, 1fr)" } as React.CSSProperties}>
          <div>
            <div style={{ borderTop: "2px solid var(--color-text)", paddingTop: 24 }}>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 18 }}>Where are we delivering?</div>
              <div className="gg-grid" style={{ gap: 16, "--cols": 2, "--cols-xs": 1 } as React.CSSProperties}>
                <div className="field"><label>Full name</label><input className="input" style={{ borderWidth: 2, minHeight: 46 }} value={form.name} onChange={(e) => setForm({ name: e.target.value })} placeholder="As it should appear on the order" /></div>
                <div className="field"><label>WhatsApp number</label><input className="input" style={{ borderWidth: 2, minHeight: 46 }} value={form.phone} onChange={(e) => setForm({ phone: e.target.value })} placeholder="+971 5X XXX XXXX" /></div>
                <div className="field"><label>Emirate</label>
                  <select className="input" style={{ borderWidth: 2, minHeight: 46 }} value={form.emirate} onChange={(e) => setForm({ emirate: e.target.value })}>
                    {["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Ras Al Khaimah", "Fujairah", "Umm Al Quwain"].map((e) => <option key={e} value={e}>{e}</option>)}
                  </select>
                </div>
                <div className="field"><label>Area / neighbourhood</label><input className="input" style={{ borderWidth: 2, minHeight: 46 }} value={form.area} onChange={(e) => setForm({ area: e.target.value })} placeholder="e.g. Business Bay" /></div>
              </div>
              <div className="field" style={{ marginTop: 16 }}><label>Building, street, apartment</label><textarea className="input" style={{ borderWidth: 2, minHeight: 76 }} value={form.address} onChange={(e) => setForm({ address: e.target.value })} placeholder="Tower name, street, flat or villa number, any landmark" /></div>
              <div className="gg-grid" style={{ gap: 16, marginTop: 16, "--cols": 2, "--cols-xs": 1 } as React.CSSProperties}>
                <div className="field"><label>Preferred delivery window</label>
                  <select className="input" style={{ borderWidth: 2, minHeight: 46 }} value={form.window} onChange={(e) => setForm({ window: e.target.value })}>
                    {["Morning (9am – 12pm)", "Afternoon (12 – 5pm)", "Evening (5 – 9pm)", "As soon as possible"].map((w) => <option key={w} value={w}>{w}</option>)}
                  </select>
                </div>
                <div className="field"><label>Note for the courier (optional)</label><input className="input" style={{ borderWidth: 2, minHeight: 46 }} value={form.notes} onChange={(e) => setForm({ notes: e.target.value })} placeholder="Gate code, call on arrival…" /></div>
              </div>
            </div>

            <div style={{ borderTop: "2px solid var(--color-text)", marginTop: 36, paddingTop: 24 }}>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 14 }}>Confirm your sizes</div>
              <div style={{ border: "2px solid var(--color-divider)", padding: "16px 18px" }}>
                <div style={{ fontSize: 14, lineHeight: 1.5, fontWeight: 600, marginBottom: 12, textWrap: "pretty" }}>{sizeSummary || "Your bag is empty."}</div>
                <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer", fontSize: 13, lineHeight: 1.5 }}>
                  <input type="checkbox" checked={confirmSize} onChange={(e) => setConfirmSize(e.target.checked)} style={{ width: 18, height: 18, marginTop: 1, accentColor: "var(--color-accent)", flex: "none" }} />
                  <span>These sizes are correct. I understand collab and Balenciaga pairs can run large or small, and I&apos;ve read the fit note on the product page.</span>
                </label>
              </div>
            </div>

            <div style={{ borderTop: "2px solid var(--color-text)", marginTop: 36, paddingTop: 24 }}>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 18 }}>How would you like to pay?</div>
              <div className="gg-grid" style={{ gap: 16, "--cols": 2, "--cols-xs": 1 } as React.CSSProperties}>
                <div onClick={() => setPay("cod")} style={{ border: `2px solid ${pay === "cod" ? "var(--color-accent)" : "var(--color-divider)"}`, background: pay === "cod" ? "var(--color-accent-100)" : "transparent", padding: 20, cursor: "pointer", display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 17 }}>Cash on delivery</span>
                    <span style={{ width: 18, height: 18, border: `2px solid ${pay === "cod" ? "var(--color-accent)" : "var(--color-divider)"}`, background: pay === "cod" ? "var(--color-accent)" : "transparent", display: "inline-block" }} />
                  </div>
                  <div style={{ fontSize: 13, lineHeight: 1.5, color: "var(--color-neutral-700)", textWrap: "pretty" }}>
                    Pay the courier in cash once the pair is in your hands. Orders up to {money(SITE_CONFIG.codLimit)} — above that we ask for a transfer first.
                  </div>
                </div>
                <div onClick={() => setPay("bank")} style={{ border: `2px solid ${pay === "bank" ? "var(--color-accent)" : "var(--color-divider)"}`, background: pay === "bank" ? "var(--color-accent-100)" : "transparent", padding: 20, cursor: "pointer", display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 17 }}>Bank transfer</span>
                    <span style={{ width: 18, height: 18, border: `2px solid ${pay === "bank" ? "var(--color-accent)" : "var(--color-divider)"}`, background: pay === "bank" ? "var(--color-accent)" : "transparent", display: "inline-block" }} />
                  </div>
                  <div style={{ fontSize: 13, lineHeight: 1.5, color: "var(--color-neutral-700)", textWrap: "pretty" }}>
                    We send the account details on WhatsApp, never on the site. We dispatch on receipt of the screenshot.
                  </div>
                </div>
              </div>
              {pay === "bank" && (
                <div style={{ border: "2px solid var(--color-text)", marginTop: 16, padding: 20, background: "var(--color-neutral-100)" }}>
                  <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 12 }}>Transfer receipt (optional)</div>
                  <div style={{ fontSize: 13, lineHeight: 1.55, color: "var(--color-neutral-700)", marginBottom: 14, maxWidth: "60ch", textWrap: "pretty" }}>
                    Place the order first — we&apos;ll send the account details on WhatsApp with your order number. If you&apos;ve already transferred, attach the screenshot here.
                  </div>
                  <label style={{ display: "inline-flex", alignItems: "center", gap: 10, cursor: "pointer", border: "2px solid var(--color-text)", padding: "11px 16px", fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", position: "relative" }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 17V3" /><path d="m7 8 5-5 5 5" /><path d="M5 21h14" /></svg>
                    Attach screenshot
                    <input type="file" accept="image/*" onChange={(e) => setReceipt(e.target.files?.[0]?.name ?? "")} style={{ position: "absolute", width: 0, height: 0, opacity: 0, pointerEvents: "none" }} />
                  </label>
                  {receipt && <div style={{ marginTop: 12, fontSize: 13, fontWeight: 700, color: "var(--color-accent-700)" }}>Attached — {receipt}</div>}
                </div>
              )}
            </div>
          </div>

          <div style={{ border: "2px solid var(--color-text)", padding: "26px 24px", background: "var(--color-neutral-100)", position: "sticky", top: 180 }}>
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 18 }}>{cartCount()} item(s)</div>
            {resolved.map((l) => (
              <div key={l.key} style={{ display: "flex", justifyContent: "space-between", gap: 14, fontSize: 13, paddingBottom: 12, borderBottom: "1px solid var(--color-divider)", marginBottom: 12 }}>
                <span style={{ lineHeight: 1.4 }}>{l.p.name}<br /><span style={{ color: "var(--color-neutral-600)", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase" }}>EU {l.size} × {l.qty}</span></span>
                <span style={{ fontWeight: 800, whiteSpace: "nowrap" }}>{money(l.amount)}</span>
              </div>
            ))}
            <div style={{ display: "flex", gap: 0, border: "2px solid var(--color-divider)", marginBottom: 16 }}>
              <input value={ref} onChange={(e) => setRef(e.target.value)} placeholder="Referral name or code" style={{ appearance: "none", border: 0, background: "none", outline: "none", font: "inherit", fontSize: 13, padding: "0 12px", height: 42, flex: 1, color: "inherit", minWidth: 0 }} />
              <button onClick={applyRef} style={{ appearance: "none", border: 0, background: "var(--color-text)", color: "var(--color-bg)", font: "inherit", fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", padding: "0 14px", cursor: "pointer", height: 42, flex: "none" }}>
                {refOk ? "Applied" : "Apply"}
              </button>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, paddingBottom: 10 }}>
              <span style={{ color: "var(--color-neutral-700)" }}>Subtotal</span><span style={{ fontWeight: 700 }}>{money(subtotal())}</span>
            </div>
            {discount() > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, paddingBottom: 10, color: "var(--color-accent-700)" }}>
                <span style={{ fontWeight: 600 }}>Referral discount</span><span style={{ fontWeight: 800 }}>−{money(discount())}</span>
              </div>
            )}
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, paddingBottom: 14, borderBottom: "2px solid var(--color-divider)" }}>
              <span style={{ color: "var(--color-neutral-700)" }}>Delivery — {form.emirate}</span><span style={{ fontWeight: 700 }}>{deliveryFee() === 0 ? "Free — Dubai" : money(deliveryFee())}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "16px 0 20px" }}>
              <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase" }}>{pay === "cod" ? "Due on delivery" : "Due by transfer"}</span>
              <span style={{ fontFamily: "var(--font-heading)", fontWeight: 900, fontSize: 26, letterSpacing: "-0.03em" }}>{money(total())}</span>
            </div>
            <button onClick={submit} disabled={!canPlace} className="btn btn-primary btn-block" style={{ height: 52, paddingInline: 20, fontSize: 12, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", marginTop: 0 }}>
              Place order →
            </button>
            <div style={{ fontSize: 12, lineHeight: 1.5, color: "var(--color-neutral-700)", marginTop: 14, textWrap: "pretty" }}>
              {canPlace ? "We confirm on WhatsApp within 15 minutes, with a photo of your exact pair." : "Name, WhatsApp number and address are needed before we can dispatch."}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
