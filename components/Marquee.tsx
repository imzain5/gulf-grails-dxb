import { MARQUEE_ITEMS } from "@/data/content";

function Row({ keyPrefix }: { keyPrefix: string }) {
  return (
    <div style={{ display: "flex", gap: 54, padding: "8px 27px", fontSize: 11, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
      {MARQUEE_ITEMS.map((item, i) => (
        <span key={keyPrefix + i} style={item.accent ? { color: "var(--color-accent-400)" } : undefined}>
          {item.text}
        </span>
      ))}
    </div>
  );
}

export default function Marquee() {
  return (
    <div style={{ background: "var(--color-text)", color: "var(--color-bg)", overflow: "hidden" }}>
      <div style={{ display: "flex", width: "max-content", animation: "gg-marquee 34s linear infinite" }}>
        <Row keyPrefix="a" />
        <Row keyPrefix="b" />
      </div>
    </div>
  );
}
