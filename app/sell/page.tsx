import type { Metadata } from "next";
import { waLink } from "@/lib/whatsapp";
import { SITE_CONFIG } from "@/lib/config";
import EditorialFrame from "@/components/EditorialFrame";
import { PAGE_SHOTS } from "@/lib/editorial";

export const metadata: Metadata = { title: "Sell or trade your pair" };

export default function SellPage() {
  return (
    <div data-screen-label="Sell to us">
      <div className="gg-split" style={{ borderBottom: "2px solid var(--color-text)", "--split": "1fr .8fr" } as React.CSSProperties}>
        <div style={{ padding: "clamp(34px,4vw,56px) clamp(18px,3vw,44px) clamp(34px,4vw,56px) var(--gutter)" }}>
          <div className="gg-kicker" style={{ marginBottom: 14 }}>Sell or trade</div>
          <h1 className="gg-display" style={{ fontSize: "clamp(32px,4.6vw,64px)", lineHeight: 0.94 }}>
            Got a pair<br />sitting unworn?
          </h1>
          <p style={{ margin: "26px 0 30px", fontSize: 16, lineHeight: 1.6, maxWidth: "50ch", color: "var(--color-neutral-800)", textWrap: "pretty" }}>
            We buy Jordan, Yeezy, Balenciaga and luxury collabs outright — cash the same day, or trade against anything in the stockroom. Send four photos on WhatsApp: both shoes, the size tag, the box label, and the soles.
          </p>
          <a href={waLink("Hello Gulf Grails, I would like to sell a pair. Here are the photos:")} target="_blank" rel="noopener" className="gg-btn">
            Send photos on WhatsApp
          </a>
          <div style={{ fontSize: 13, lineHeight: 1.6, color: "var(--color-neutral-700)", marginTop: 16 }}>
            Prefer email? Send the same four photos to{" "}
            <a href={`mailto:${SITE_CONFIG.email}?subject=Selling a pair`} style={{ fontWeight: 600 }}>
              {SITE_CONFIG.email}
            </a>{" "}
            and we&apos;ll come back to you the same day.
          </div>
          <div className="gg-grid" style={{ borderTop: "2px solid var(--color-text)", marginTop: 44, "--cols": 3, "--cols-xs": 1 } as React.CSSProperties}>
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
        <EditorialFrame
          shot={PAGE_SHOTS.sell}
          className="gg-split-media"
          sizes="(max-width: 980px) 100vw, 45vw"
          style={{ borderLeft: "2px solid var(--color-text)", minHeight: 520 }}
        />
      </div>
    </div>
  );
}
