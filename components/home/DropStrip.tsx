"use client";

import { useSyncExternalStore } from "react";
import { waLink } from "@/lib/whatsapp";
import { getClockServerSnapshot, getClockSnapshot, subscribeClock } from "@/lib/clock";

function nextFridayEightPm(now: Date): Date {
  const t = new Date(now);
  t.setHours(20, 0, 0, 0);
  const days = (5 - now.getDay() + 7) % 7;
  t.setDate(now.getDate() + days);
  if (t.getTime() <= now.getTime()) t.setDate(t.getDate() + 7);
  return t;
}

function parts(now: Date) {
  const target = nextFridayEightPm(now);
  let s = Math.max(0, Math.floor((target.getTime() - now.getTime()) / 1000));
  const d = Math.floor(s / 86400); s -= d * 86400;
  const h = Math.floor(s / 3600); s -= h * 3600;
  const m = Math.floor(s / 60); s -= m * 60;
  const pad = (x: number) => String(x).padStart(2, "0");
  return [
    { key: "d", v: pad(d), u: "days" },
    { key: "h", v: pad(h), u: "hrs" },
    { key: "m", v: pad(m), u: "min" },
    { key: "s", v: pad(s), u: "sec" },
  ];
}

const PLACEHOLDER = [
  { key: "d", v: "--", u: "days" }, { key: "h", v: "--", u: "hrs" },
  { key: "m", v: "--", u: "min" }, { key: "s", v: "--", u: "sec" },
];

/**
 * The Friday drop, as a line rather than a banner.
 *
 * Same countdown and the same WhatsApp list link as before — this is purely a
 * change of voice. A full-bleed red block shouting under the hero undercuts
 * everything above it; a thin charcoal rule with the clock set small does the
 * same job and keeps the accent for the one dot that needs it.
 */
export default function DropStrip() {
  const nowSec = useSyncExternalStore(subscribeClock, getClockSnapshot, getClockServerSnapshot);
  const now = nowSec > 0 ? new Date(nowSec * 1000) : null;
  const countdown = now ? parts(now) : PLACEHOLDER;

  return (
    <section className="hp-dark" style={{ borderBottom: "1px solid var(--hp-line-dark)" }}>
      <div
        className="hp-shell hp-drop"
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          gap: "clamp(16px, 3vw, 48px)", paddingBlock: "clamp(16px, 1.8vw, 24px)", flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, minWidth: 0 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--color-accent)", animation: "gg-pulse 2.2s ease-in-out infinite", flex: "none" }} />
          <span className="hp-label hp-label-light" style={{ letterSpacing: "0.2em" }}>
            Friday drop — Travis Scott Reverse Mocha restock
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "clamp(18px, 3vw, 40px)", flexWrap: "wrap" }}>
          <div style={{ display: "flex", gap: 18 }} suppressHydrationWarning>
            {countdown.map((c) => (
              <div key={c.key} style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
                <span className="gg-figure" style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 16, letterSpacing: "0.01em" }}>
                  {c.v}
                </span>
                <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "color-mix(in srgb, #f3f2f2 44%, transparent)" }}>
                  {c.u}
                </span>
              </div>
            ))}
          </div>
          <a href={waLink("Hello Gulf Grails, add me to the Friday drop list.")} target="_blank" rel="noopener" className="hp-link">
            Join the list
          </a>
        </div>
      </div>
    </section>
  );
}
