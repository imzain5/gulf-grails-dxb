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
 * One statement, full bleed.
 *
 * This replaced a three-slide carousel. A hero that rotates is a hero that
 * can't commit, and the two other messages it carried (the collab vault, cash
 * on delivery) now have their own sections further down, where they get more
 * room than a shared slot gave them.
 *
 * The composition is a single oversized cut-out with the wordmark set across
 * it: the type sits behind the shoe at desktop width so the two occupy the
 * same space rather than sitting in separate columns, which is what stops it
 * reading as a banner. Everything animates in once, on mount, over about a
 * second — the only choreographed moment on the page.
 */
export default function HomeHero() {
  const flag = findProduct("air-dior");
  const [ready, setReady] = useState(false);

  // A frame's delay so the entrance plays rather than being painted mid-way.
  useEffect(() => {
    const t = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(t);
  }, []);

  const step = (i: number): React.CSSProperties => ({
    opacity: ready ? 1 : 0,
    transform: ready ? "none" : "translateY(26px)",
    transition: `opacity .9s var(--hp-ease) ${i * 110}ms, transform .9s var(--hp-ease) ${i * 110}ms`,
  });

  return (
    <section
      aria-label="Grail of the week"
      style={{
        position: "relative",
        background: "var(--hp-paper)",
        color: "var(--hp-ink)",
        overflow: "hidden",
        borderBottom: "1px solid var(--hp-line)",
      }}
    >
      <div
        className="hp-shell hp-hero"
        style={{ paddingBlock: "clamp(44px, 6vw, 88px)" }}
      >
        <div className="hp-hero-stage">
          {/* The wordmark paints first so the pair can multiply over it. */}
          <h1
            className="hp-display hp-hero-type hp-hero-word"
            style={{
              opacity: ready ? 1 : 0,
              transform: ready ? "none" : "translateY(34px)",
              transition: "opacity 1.1s var(--hp-ease), transform 1.1s var(--hp-ease)",
            }}
          >
            Air Dior
          </h1>

          {/* The pair, oversized. The entrance rides on the image itself —
              a transform on any wrapper would create a stacking context and
              cut the blend off from the type underneath. */}
          <div className="hp-hero-media">
            <div className="hp-hero-shoe">
              <Image
                className={`gg-photo hp-hero-img${ready ? " hp-in" : ""}`}
                src="/assets/air-dior-lateral.webp"
                alt="Air Jordan 1 High OG Dior"
                fill
                priority
                sizes="(max-width: 900px) 100vw, 1180px"
                style={{ objectFit: "contain" }}
              />
            </div>
          </div>
        </div>

        {/* Metadata rail, sitting on the baseline of the composition. */}
        <div
          className="hp-hero-meta"
          style={{
            position: "relative",
            zIndex: 3,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: "clamp(20px, 4vw, 64px)",
            marginTop: "clamp(28px, 5vw, 72px)",
            flexWrap: "wrap",
          }}
        >
          <div style={{ maxWidth: "38ch", ...step(2) }}>
            <div className="hp-label hp-label-accent" style={{ marginBottom: 16 }}>
              Grail of the week — two pairs only
            </div>
            <p className="hp-body" style={{ margin: 0 }}>
              8,500 pairs made worldwide. Five million people entered the draw. Two of them are
              sitting in our Al Quoz stockroom with the numbered box and both dust bags.
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "flex-end", gap: "clamp(18px, 3vw, 44px)", flexWrap: "wrap", ...step(3) }}>
            <div>
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

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
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
        </div>
      </div>
    </section>
  );
}
