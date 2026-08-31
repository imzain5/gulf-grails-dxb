import type { Metadata } from "next";
import EditorialFrame from "@/components/EditorialFrame";
import { PAGE_SHOTS } from "@/lib/editorial";

export const metadata: Metadata = { title: "About Gulf Grails" };

const STATS: [string, string][] = [
  ["1,480+", "Pairs delivered"],
  ["4 hrs", "Average Dubai delivery"],
  ["100%", "Verified or refunded"],
];

export default function AboutPage() {
  return (
    <div data-screen-label="About">
      <div className="gg-split" style={{ borderBottom: "2px solid var(--color-text)", "--split": "1fr .8fr" } as React.CSSProperties}>
        <div style={{ padding: "clamp(34px,4vw,56px) clamp(18px,3vw,44px) clamp(34px,4vw,56px) var(--gutter)" }}>
          <div className="gg-kicker" style={{ marginBottom: 14 }}>About Gulf Grails</div>
          <h1 className="gg-display" style={{ fontSize: "clamp(32px,4.6vw,64px)", lineHeight: 0.94 }}>
            A stockroom<br />in Al Quoz,<br />not a<br />warehouse.
          </h1>
          <p style={{ margin: "26px 0 20px", fontSize: 16, lineHeight: 1.6, maxWidth: "52ch", color: "var(--color-neutral-800)", textWrap: "pretty" }}>
            Gulf Grails started with one pair sold out of a car park in Al Quoz and a rule we still hold to: never list a shoe we haven&apos;t held. Everything on this site is physically with us — photographed on our own table, checked against a reference pair, and logged before it goes up.
          </p>
          <p style={{ margin: 0, fontSize: 16, lineHeight: 1.6, maxWidth: "52ch", color: "var(--color-neutral-800)", textWrap: "pretty" }}>
            We don&apos;t take card payments and we don&apos;t ask you to trust us first. You see the pair, you try it on at your door, and then you pay. That order has never changed, and it&apos;s the reason most of our business now comes from people who bought once and sent a friend.
          </p>
        </div>
        <EditorialFrame
          shot={PAGE_SHOTS.about}
          className="gg-split-media"
          sizes="(max-width: 980px) 100vw, 45vw"
          style={{ borderLeft: "2px solid var(--color-text)", minHeight: 520 }}
        />
      </div>
      <div className="gg-wrap" style={{ padding: "clamp(30px,4vw,44px) var(--gutter) clamp(44px,5vw,64px)" }}>
        <div className="gg-grid" style={{ borderTop: "2px solid var(--color-text)", "--cols": 4, "--cols-sm": 2 } as React.CSSProperties}>
          {STATS.map(([big, small], i) => (
            <div key={big} style={{ padding: i === 0 ? "24px 24px 28px 0" : "24px", borderRight: i < 3 ? "2px solid var(--color-divider)" : undefined }}>
              <div style={{ fontFamily: "var(--font-heading)", fontWeight: 900, fontSize: 34, letterSpacing: "-0.03em" }}>{big}</div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--color-neutral-700)", marginTop: 6 }}>{small}</div>
            </div>
          ))}
          <div style={{ padding: "24px 0 28px 24px" }}>
            <div style={{ fontFamily: "var(--font-heading)", fontWeight: 900, fontSize: 34, letterSpacing: "-0.03em", color: "var(--color-accent)" }}>
              4.9<span style={{ fontSize: 19, color: "var(--color-neutral-600)" }}>/5</span>
            </div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--color-neutral-700)", marginTop: 6 }}>312 customer reviews</div>
          </div>
        </div>
      </div>
    </div>
  );
}
