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

export default function FridayDropBanner() {
  const nowSec = useSyncExternalStore(subscribeClock, getClockSnapshot, getClockServerSnapshot);
  const now = nowSec > 0 ? new Date(nowSec * 1000) : null;
  const countdown = parts(now ?? new Date(0));

  return (
    <section style={{ borderBottom: "2px solid var(--color-text)", background: "var(--color-accent)", color: "#fff" }}>
      <div style={{ maxWidth: 1560, margin: "0 auto", padding: "20px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ width: 8, height: 8, background: "#fff", animation: "gg-pulse 1.5s ease-in-out infinite", display: "inline-block" }} />
          <span style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 17, letterSpacing: "-0.01em", textTransform: "uppercase" }}>
            Friday drop — Travis Scott Reverse Mocha restock
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ display: "flex", gap: 10, alignItems: "baseline" }} suppressHydrationWarning>
            {(now ? countdown : [{ key: "d", v: "--", u: "days" }, { key: "h", v: "--", u: "hrs" }, { key: "m", v: "--", u: "min" }, { key: "s", v: "--", u: "sec" }]).map((c) => (
              <div key={c.key} style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                <span style={{ fontFamily: "var(--font-heading)", fontWeight: 900, fontSize: 24, letterSpacing: "-0.02em" }}>{c.v}</span>
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", opacity: 0.8 }}>{c.u}</span>
              </div>
            ))}
          </div>
          <a
            href={waLink("Hello Gulf Grails, add me to the Friday drop list.")}
            target="_blank" rel="noopener"
            className="btn"
            style={{ background: "#fff", color: "var(--color-accent-700)", border: 0, height: 44, paddingInline: 18, fontSize: 11, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", justifyContent: "flex-start" }}
          >
            Get on the list
          </a>
        </div>
      </div>
    </section>
  );
}
