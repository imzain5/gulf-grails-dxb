import type { Metadata } from "next";
import { waLink } from "@/lib/whatsapp";
import ImageSlot from "@/components/ImageSlot";

export const metadata: Metadata = { title: "Sell or trade your pair" };

export default function SellPage() {
  return (
    <div data-screen-label="Sell to us">
      <div style={{ borderBottom: "2px solid var(--color-text)", display: "grid", gridTemplateColumns: "1fr .8fr" }}>
        <div style={{ padding: "56px 44px 56px 28px" }}>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--color-accent)", marginBottom: 14 }}>Sell or trade</div>
          <h1 style={{ margin: 0, fontSize: "clamp(34px,4.6vw,64px)", lineHeight: 0.94, letterSpacing: "-0.04em", textTransform: "uppercase" }}>
            Got a pair<br />sitting unworn?
          </h1>
          <p style={{ margin: "26px 0 30px", fontSize: 16, lineHeight: 1.6, maxWidth: "50ch", color: "var(--color-neutral-800)", textWrap: "pretty" }}>
            We buy Jordan, Yeezy, Balenciaga and luxury collabs outright — cash the same day, or trade against anything in the stockroom. Send four photos on WhatsApp: both shoes, the size tag, the box label, and the soles.
          </p>
          <a href={waLink("Hello Gulf Grails, I would like to sell a pair. Here are the photos:")} target="_blank" rel="noopener" className="btn btn-primary" style={{ height: 54, paddingInline: 22, fontSize: 12, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", justifyContent: "flex-start" }}>
            Send photos on WhatsApp
          </a>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", borderTop: "2px solid var(--color-text)", marginTop: 44 }}>
            <div style={{ padding: "20px 20px 20px 0", borderRight: "2px solid var(--color-divider)" }}>
              <div style={{ fontFamily: "var(--font-heading)", fontWeight: 900, fontSize: 26, letterSpacing: "-0.02em" }}>Same day</div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--color-neutral-700)", marginTop: 6 }}>Cash payout</div>
            </div>
            <div style={{ padding: 20, borderRight: "2px solid var(--color-divider)" }}>
              <div style={{ fontFamily: "var(--font-heading)", fontWeight: 900, fontSize: 26, letterSpacing: "-0.02em" }}>Free</div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--color-neutral-700)", marginTop: 6 }}>Pickup in Dubai</div>
            </div>
            <div style={{ padding: 20 }}>
              <div style={{ fontFamily: "var(--font-heading)", fontWeight: 900, fontSize: 26, letterSpacing: "-0.02em" }}>+10%</div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--color-neutral-700)", marginTop: 6 }}>If you trade, not sell</div>
            </div>
          </div>
        </div>
        <div className="grayscale" style={{ borderLeft: "2px solid var(--color-text)", background: "var(--color-neutral-200)", minHeight: 520, position: "relative" }}>
          <ImageSlot id="gg-sell" placeholder="Drop a shot of pairs being inspected" />
        </div>
      </div>
    </div>
  );
}
