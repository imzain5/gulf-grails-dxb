"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { findProduct } from "@/data/products";
import { money } from "@/lib/money";

const ARROW = (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" /><path d="m13 6 6 6-6 6" />
  </svg>
);

/**
 * One statement, built around the campaign photograph.
 *
 * The photograph is portrait, so it takes a full-height column bleeding off
 * the right edge rather than being cropped into a letterbox — a 2:3 frame
 * cover-cropped to 16:9 loses either the figure or the shoes, and the shoes
 * are the point. The type holds the left, set large enough that "Air" and
 * "Dior" stack.
 *
 * This is real photography, not a studio cut-out, so it must NOT carry
 * `.gg-photo`. That class multiplies, which is what makes a white studio
 * background disappear; on a photograph with its own background it would only
 * dirty the image.
 */
export default function HomeHero() {
  const flag = findProduct("air-dior");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(t);
  }, []);

  const step = (i: number): React.CSSProperties => ({
    opacity: ready ? 1 : 0,
    transform: ready ? "none" : "translateY(24px)",
    transition: `opacity .9s var(--hp-ease) ${160 + i * 110}ms, transform .9s var(--hp-ease) ${160 + i * 110}ms`,
  });

  return (
    <section className="hp-hero-v2" aria-label="Grail of the week">
      <div className="hp-hero-copy">
        <h1 className="hp-display hp-hero-type" style={step(0)}>
          Air<br />Dior
        </h1>

        <div style={{ marginTop: "clamp(20px, 2.4vw, 34px)", maxWidth: "40ch", ...step(1) }}>
          <div className="hp-label hp-label-accent" style={{ marginBottom: 16 }}>
            Grail of the week — two pairs only
          </div>
          <p className="hp-body" style={{ margin: 0 }}>
            8,500 pairs made worldwide. Five million people entered the draw. Two of them are
            sitting in our Al Quoz stockroom with the numbered box and both dust bags.
          </p>
        </div>

        <div style={{ marginTop: "clamp(20px, 2.6vw, 34px)", ...step(2) }}>
          <div className="hp-label" style={{ marginBottom: 10 }}>Ours / Market</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
            <span className="gg-figure" style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "clamp(24px,2.6vw,34px)", letterSpacing: "-0.03em" }}>
              {money(flag.price)}
            </span>
            <span style={{ fontSize: 13, textDecoration: "line-through", color: "color-mix(in srgb, #201e1d 40%, transparent)" }}>
              {money(flag.market)}
            </span>
          </div>
        </div>

        <div style={{ marginTop: "clamp(20px, 2.4vw, 32px)", display: "flex", gap: 12, flexWrap: "wrap", ...step(3) }}>
          <Link href={`/product/${flag.id}`} className="hp-btn">
            View the pair
            {ARROW}
          </Link>
          <Link href="/shop" className="hp-btn hp-btn-ghost">
            The stockroom
            {ARROW}
          </Link>
        </div>
      </div>

      <div
        className="hp-hero-photo"
        style={{
          opacity: ready ? 1 : 0,
          transform: ready ? "none" : "scale(1.04)",
          transition: "opacity 1.2s var(--hp-ease), transform 1.6s var(--hp-ease)",
        }}
      >
        <Image
          src="/assets/campaign/air-dior-campaign.webp"
          alt="Air Jordan 1 High OG Dior, worn"
          fill
          priority
          sizes="(max-width: 900px) 100vw, 50vw"
          style={{ objectFit: "cover", objectPosition: "center 58%" }}
        />
      </div>
    </section>
  );
}
