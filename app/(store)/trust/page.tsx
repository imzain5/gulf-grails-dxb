import type { Metadata } from "next";
import { CHECKS } from "@/data/content";
import EditorialFrame from "@/components/EditorialFrame";
import { getCatalogue } from "@/lib/catalogue";
import { PAGE_SHOTS } from "@/lib/editorial";
import FaqAccordion from "@/components/FaqAccordion";

export const metadata: Metadata = { title: "Authenticity & delivery" };

export default async function TrustPage() {
  const catalogue = await getCatalogue();
  return (
    <div data-screen-label="Authenticity">
      <div className="gg-split" style={{ borderBottom: "2px solid var(--color-text)", "--split": "1fr .8fr" } as React.CSSProperties}>
        <div style={{ padding: "clamp(34px,4vw,56px) clamp(18px,3vw,44px) clamp(34px,4vw,56px) var(--gutter)" }}>
          <div className="gg-kicker" style={{ marginBottom: 14 }}>Authenticity</div>
          <h1 className="gg-display" style={{ fontSize: "clamp(32px,4.6vw,68px)", lineHeight: 0.94 }}>
            We stake the<br />business on<br />every pair.
          </h1>
          <p style={{ margin: "26px 0 0", fontSize: 16, lineHeight: 1.6, maxWidth: "50ch", color: "var(--color-neutral-800)", textWrap: "pretty" }}>
            Nothing is drop-shipped. Every pair passes through our hands in Jumeirah, gets photographed, checked and logged before it is listed. If a pair you buy from us is ever proven fake, you get a full refund plus the delivery fee — no argument, no timeline.
          </p>
        </div>
        <EditorialFrame
          catalogue={catalogue}
          shot={PAGE_SHOTS.trust}
          className="gg-split-media"
          sizes="(max-width: 980px) 100vw, 45vw"
          style={{ borderLeft: "2px solid var(--color-text)", minHeight: 460 }}
        />
      </div>

      <div className="gg-wrap" style={{ padding: "clamp(34px,4vw,48px) var(--gutter) 20px" }}>
        <h2 className="gg-display gg-d3" style={{ marginBottom: 28 }}>The six checks</h2>
        <div className="gg-grid" style={{ borderTop: "2px solid var(--color-text)", borderLeft: "2px solid var(--color-text)", "--cols": 3, "--cols-sm": 2, "--cols-xs": 1 } as React.CSSProperties}>
          {CHECKS.map((c) => (
            <div key={c.n} style={{ borderRight: "2px solid var(--color-text)", borderBottom: "2px solid var(--color-text)", padding: "24px 22px 28px" }}>
              <div style={{ fontFamily: "var(--font-heading)", fontWeight: 900, fontSize: 14, letterSpacing: "0.12em", color: "var(--color-accent)", marginBottom: 14 }}>{c.n}</div>
              <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 18, lineHeight: 1.2, marginBottom: 8 }}>{c.t}</div>
              <div style={{ fontSize: 13, lineHeight: 1.55, color: "var(--color-neutral-700)", textWrap: "pretty" }}>{c.d}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="gg-wrap" style={{ padding: "clamp(28px,3vw,36px) var(--gutter) clamp(40px,5vw,56px)" }}>
        <h2 className="gg-display gg-d3" style={{ marginBottom: 22 }}>Delivery, returns &amp; questions</h2>
        <FaqAccordion />
      </div>
    </div>
  );
}
