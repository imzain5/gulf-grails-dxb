"use client";

import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { money } from "@/lib/money";
import { waLink } from "@/lib/whatsapp";
import WhatsAppIcon from "@/components/WhatsAppIcon";

export default function OrderClient() {
  const { lastOrder: o, orderMessageText } = useStore();

  if (!o) {
    return (
      <div data-screen-label="Confirmed">
        <div className="gg-wrap" style={{ maxWidth: 1180, padding: "clamp(28px,4vw,44px) var(--gutter) clamp(48px,6vw,72px)" }}>
          <div style={{ border: "2px solid var(--color-text)", padding: "48px 32px" }}>
            <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 24, marginBottom: 10 }}>No recent order here.</div>
            <div style={{ fontSize: 14, color: "var(--color-neutral-700)", maxWidth: "48ch", marginBottom: 22, textWrap: "pretty" }}>
              Orders are remembered on this device only. Place one from the bag and it will show up here.
            </div>
            <Link href="/shop" className="btn btn-primary" style={{ height: 48, paddingInline: 20, fontSize: 12, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", justifyContent: "flex-start" }}>
              Shop the inventory
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div data-screen-label="Confirmed">
      <div className="gg-wrap" style={{ maxWidth: 1180, padding: "clamp(28px,4vw,44px) var(--gutter) clamp(48px,6vw,72px)" }}>
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--color-accent)", marginBottom: 12 }}>Step 3 of 3 — order received</div>
        <h1 style={{ margin: "0 0 10px", fontSize: "clamp(32px,4.2vw,60px)", lineHeight: 0.95, letterSpacing: "-0.04em", textTransform: "uppercase" }}>Order {o.ref} is in.</h1>
        <p style={{ margin: "0 0 32px", fontSize: 16, lineHeight: 1.55, maxWidth: "56ch", color: "var(--color-neutral-800)", textWrap: "pretty" }}>
          Send the order through on WhatsApp and we&apos;ll confirm your exact pair with a photo, then lock the delivery slot. It&apos;s the fastest way to reach us.
        </p>

        <a href={waLink(orderMessageText(o))} target="_blank" rel="noopener" className="btn btn-primary" style={{ height: 58, paddingInline: 24, fontSize: 13, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", justifyContent: "flex-start", gap: 12, marginBottom: 36 }}>
          <WhatsAppIcon size={18} />
          Send order {o.ref} on WhatsApp
        </a>

        <div style={{ display: "grid", gridTemplateColumns: "1.3fr .9fr", gap: 44, alignItems: "start" }}>
          <div style={{ border: "2px solid var(--color-text)" }}>
            <div style={{ borderBottom: "2px solid var(--color-text)", padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "baseline", background: "var(--color-text)", color: "var(--color-bg)" }}>
              <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase" }}>Order {o.ref}</span>
              <span style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase" }}>{o.date}</span>
            </div>
            <div style={{ padding: 20 }}>
              <table className="table">
                <thead><tr><th style={{ paddingLeft: 0 }}>Pair</th><th>Size</th><th>Qty</th><th style={{ textAlign: "right" }}>Amount</th></tr></thead>
                <tbody>
                  {o.lines.map((l) => (
                    <tr key={l.name + l.size}>
                      <td style={{ paddingLeft: 0, fontWeight: 600 }}>{l.name}</td>
                      <td>EU {l.size}</td>
                      <td>{l.qty}</td>
                      <td style={{ textAlign: "right", fontWeight: 700 }}>{money(l.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {o.discount > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, paddingTop: 12, color: "var(--color-accent-700)" }}>
                  <span style={{ fontWeight: 600 }}>Referral discount</span><span style={{ fontWeight: 800 }}>−{money(o.discount)}</span>
                </div>
              )}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", paddingTop: 18, marginTop: 6, borderTop: "2px solid var(--color-text)" }}>
                <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase" }}>{o.pay === "cod" ? "Due on delivery" : "Due by transfer"}</span>
                <span style={{ fontFamily: "var(--font-heading)", fontWeight: 900, fontSize: 26, letterSpacing: "-0.03em" }}>{money(o.total)}</span>
              </div>
            </div>
          </div>
          <div style={{ border: "2px solid var(--color-text)" }}>
            <div style={{ padding: 20, borderBottom: "2px solid var(--color-divider)" }}>
              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--color-neutral-600)", marginBottom: 8 }}>Delivering to</div>
              <div style={{ fontSize: 14, lineHeight: 1.55, fontWeight: 600 }}>{o.form.name}</div>
              <div style={{ fontSize: 14, lineHeight: 1.55, color: "var(--color-neutral-700)" }}>{[o.form.address, o.form.area, o.form.emirate].filter(Boolean).join(", ")}</div>
              <div style={{ fontSize: 14, lineHeight: 1.55, color: "var(--color-neutral-700)" }}>{o.form.phone}</div>
            </div>
            <div style={{ padding: 20, borderBottom: "2px solid var(--color-divider)" }}>
              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--color-neutral-600)", marginBottom: 8 }}>Window</div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{o.form.window}</div>
            </div>
            <div style={{ padding: 20 }}>
              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--color-neutral-600)", marginBottom: 8 }}>Payment</div>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>{o.pay === "cod" ? "Cash on delivery" : "Bank transfer"}</div>
              <div style={{ fontSize: 13, lineHeight: 1.5, color: "var(--color-neutral-700)", textWrap: "pretty" }}>
                {o.pay === "cod"
                  ? "Have the cash ready for the courier. Check the pair at the door before you pay."
                  : "Message us on WhatsApp and we send the account details there — we never publish them on the site."}
              </div>
            </div>
          </div>
        </div>

        <Link href="/shop" className="btn btn-secondary" style={{ marginTop: 32, height: 48, paddingInline: 20, borderWidth: 2, borderColor: "var(--color-text)", color: "var(--color-text)", fontSize: 12, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", justifyContent: "flex-start" }}>
          Keep shopping
        </Link>
      </div>
    </div>
  );
}
