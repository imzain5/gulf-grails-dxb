"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { PRODUCTS } from "@/data/products";
import { money } from "@/lib/money";
import { getRecentServerSnapshot, getRecentSnapshot, subscribeRecent } from "@/lib/recentStore";
import { ProductCardPhoto } from "./ProductPhoto";

/**
 * The pairs this visitor already opened, as a horizontal rail.
 *
 * Renders nothing until there are at least two — a rail of one is just a
 * card, and on a first visit the section shouldn't exist at all. Because the
 * server snapshot is always empty, it is absent from the prerendered HTML and
 * appears after hydration, which is the correct behaviour for per-visitor
 * state on a statically generated page.
 */
export default function RecentlyViewed({ excludeId }: { excludeId?: string }) {
  const ids = useSyncExternalStore(subscribeRecent, getRecentSnapshot, getRecentServerSnapshot);

  const items = ids
    .filter((id) => id !== excludeId)
    .map((id) => PRODUCTS.find((p) => p.id === id))
    .filter((p): p is (typeof PRODUCTS)[number] => Boolean(p))
    .slice(0, 6);

  if (items.length < 2) return null;

  return (
    <section style={{ borderBottom: "2px solid var(--color-text)", background: "var(--color-neutral-100)" }}>
      <div className="gg-wrap" style={{ padding: "clamp(28px,3vw,38px) var(--gutter) clamp(28px,3vw,40px)" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 20, flexWrap: "wrap", marginBottom: 18 }}>
          <div className="gg-kicker">Recently viewed</div>
          <span className="gg-eyebrow" style={{ color: "var(--color-neutral-600)" }}>Saved to this device only</span>
        </div>
        <div className="gg-rail" style={{ borderTop: "2px solid var(--color-text)", borderLeft: "2px solid var(--color-text)" }}>
          {items.map((p) => (
            <Link
              key={p.id}
              href={`/product/${p.id}`}
              className="gg-card"
              style={{ width: "clamp(168px, 21vw, 220px)" }}
            >
              <div className="gg-plate" style={{ position: "relative", aspectRatio: "1/1", borderBottom: "2px solid var(--color-divider)" }}>
                <ProductCardPhoto product={p} padding={10} sizes="220px" />
              </div>
              <div style={{ padding: "12px 14px 14px", display: "flex", flexDirection: "column", gap: 5, flex: 1 }}>
                <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--color-neutral-600)" }}>
                  {p.brand.toUpperCase()}
                </div>
                <div className="gg-card-name" style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 13, lineHeight: 1.25, textWrap: "pretty" }}>
                  {p.name}
                </div>
                <div className="gg-figure" style={{ marginTop: "auto", paddingTop: 8, fontWeight: 900, fontSize: 14 }}>{money(p.price)}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
