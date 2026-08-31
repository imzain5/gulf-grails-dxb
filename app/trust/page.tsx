import type { Metadata } from "next";
import { CHECKS } from "@/data/content";
import ImageSlot from "@/components/ImageSlot";
import FaqAccordion from "@/components/FaqAccordion";

export const metadata: Metadata = { title: "Authenticity & delivery" };

export default function TrustPage() {
  return (
    <div data-screen-label="Authenticity">
      <div style={{ borderBottom: "2px solid var(--color-text)", display: "grid", gridTemplateColumns: "1fr .8fr" }}>
        <div style={{ padding: "56px 44px 56px 28px" }}>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--color-accent)", marginBottom: 14 }}>Authenticity</div>
          <h1 style={{ margin: 0, fontSize: "clamp(34px,4.6vw,68px)", lineHeight: 0.94, letterSpacing: "-0.04em", textTransform: "uppercase" }}>
            We stake the<br />business on<br />every pair.
          </h1>
          <p style={{ margin: "26px 0 0", fontSize: 16, lineHeight: 1.6, maxWidth: "50ch", color: "var(--color-neutral-800)", textWrap: "pretty" }}>
            Nothing is drop-shipped. Every pair passes through our hands in Al Quoz, gets photographed, checked and logged before it is listed. If a pair you buy from us is ever proven fake, you get a full refund plus the delivery fee — no argument, no timeline.
          </p>
        </div>
        <div className="grayscale" style={{ borderLeft: "2px solid var(--color-text)", background: "var(--color-neutral-200)", minHeight: 460, position: "relative" }}>
          <ImageSlot id="gg-trust" placeholder="Drop a shot of your verification table" />
        </div>
      </div>

      <div style={{ maxWidth: 1560, margin: "0 auto", padding: "48px 28px 20px" }}>
        <h2 style={{ margin: "0 0 28px", fontSize: "clamp(24px,2.8vw,38px)", lineHeight: 1, letterSpacing: "-0.035em", textTransform: "uppercase" }}>The six checks</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", borderTop: "2px solid var(--color-text)", borderLeft: "2px solid var(--color-text)" }}>
          {CHECKS.map((c) => (
            <div key={c.n} style={{ borderRight: "2px solid var(--color-text)", borderBottom: "2px solid var(--color-text)", padding: "24px 22px 28px" }}>
              <div style={{ fontFamily: "var(--font-heading)", fontWeight: 900, fontSize: 14, letterSpacing: "0.12em", color: "var(--color-accent)", marginBottom: 14 }}>{c.n}</div>
              <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 18, lineHeight: 1.2, marginBottom: 8 }}>{c.t}</div>
              <div style={{ fontSize: 13, lineHeight: 1.55, color: "var(--color-neutral-700)", textWrap: "pretty" }}>{c.d}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1560, margin: "0 auto", padding: "36px 28px 56px" }}>
        <h2 style={{ margin: "0 0 22px", fontSize: "clamp(24px,2.8vw,38px)", lineHeight: 1, letterSpacing: "-0.035em", textTransform: "uppercase" }}>Delivery, returns &amp; questions</h2>
        <FaqAccordion />
      </div>
    </div>
  );
}
