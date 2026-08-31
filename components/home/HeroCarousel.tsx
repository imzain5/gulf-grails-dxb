"use client";

import Link from "next/link";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import EditorialFrame from "@/components/EditorialFrame";
import { HERO_COD, HERO_COLLAB } from "@/lib/editorial";
import { findProduct } from "@/data/products";
import { money } from "@/lib/money";
import { waLink } from "@/lib/whatsapp";

const AUTOPLAY_MS = 7000;

const ARROW = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" /><path d="m13 6 6 6-6 6" />
  </svg>
);

/**
 * The collab-vault triptych: three pairs stacked in one frame.
 *
 * A single cut-out can't carry the claim that seven collabs are on the shelf.
 * Three of them in one frame, each on its own ground, can.
 */
function CollabStack() {
  return (
    <div style={{ position: "absolute", inset: 0, display: "grid", gridTemplateRows: "1.25fr 1fr", background: "var(--color-neutral-200)" }}>
      <EditorialFrame
        shot={HERO_COLLAB[0]}
        sizes="(max-width: 980px) 100vw, 50vw"
        style={{ borderBottom: "2px solid var(--color-text)", minHeight: 0 }}
      />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: 0 }}>
        <EditorialFrame shot={HERO_COLLAB[1]} sizes="(max-width: 980px) 50vw, 25vw" style={{ borderRight: "2px solid var(--color-text)", minHeight: 0 }} />
        <EditorialFrame shot={HERO_COLLAB[2]} sizes="(max-width: 980px) 50vw, 25vw" style={{ minHeight: 0 }} />
      </div>
    </div>
  );
}

/**
 * The cash-on-delivery frame: the pair, plus the docket that explains the
 * promise. The claim is the product here, so the typography shares the frame.
 */
function DeliveryFrame() {
  return (
    <div style={{ position: "absolute", inset: 0, background: "#fff" }}>
      <EditorialFrame shot={HERO_COD} sizes="(max-width: 980px) 100vw, 50vw" style={{ position: "absolute", inset: 0 }} />
      <div style={{
        position: "absolute", right: 0, bottom: 0, zIndex: 3, maxWidth: "min(300px, 78%)",
        background: "var(--color-text)", color: "var(--color-bg)", padding: "18px 20px 20px",
        borderTop: "2px solid var(--color-accent)",
      }}>
        <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--color-accent-400)", marginBottom: 12 }}>
          At your door
        </div>
        {[
          ["Courier arrives", "Same day, Dubai"],
          ["You open the box", "Try both shoes on"],
          ["Fit is wrong?", "Hand it back, pay nothing"],
          ["Happy?", "Cash or transfer"],
        ].map(([k, v], i, arr) => (
          <div
            key={k}
            style={{
              display: "flex", justifyContent: "space-between", gap: 14, padding: "7px 0",
              borderBottom: i < arr.length - 1 ? "1px solid var(--color-neutral-700)" : undefined,
              fontSize: 11, letterSpacing: "0.02em",
            }}
          >
            <span style={{ color: "var(--color-neutral-400)" }}>{k}</span>
            <span style={{ fontWeight: 800, textAlign: "right" }}>{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface Slide {
  key: string;
  badge: string;
  badgeTone: "accent" | "ink";
  note?: string;
  title: React.ReactNode;
  body: string;
  price?: { now: number; was: number };
  primary: { label: string; href: string };
  secondary?: { label: string; href: string; external?: boolean };
  media: React.ReactNode;
}

export default function HeroCarousel() {
  const flag = findProduct("air-dior");
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchX = useRef<number | null>(null);

  const slides: Slide[] = [
    {
      key: "air-dior",
      badge: "Grail of the week",
      badgeTone: "accent",
      note: "2 pairs only · EU 40–45",
      title: <>Air Dior.<br />The one<br />everybody<br />missed.</>,
      body: "8,500 pairs made worldwide. Five million people entered the draw. Two of them are sitting in our Al Quoz stockroom with the numbered box and dust bags.",
      price: { now: flag.price, was: flag.market },
      primary: { label: "View the pair", href: `/product/${flag.id}` },
      secondary: { label: "Ask on WhatsApp", href: waLink("Hello Gulf Grails, I have a question about a pair."), external: true },
      media: (
        <div className="gg-plate" style={{ position: "absolute", inset: 0 }}>
          {/* Pulled out past the frame: the source shot carries a wide white
              margin, and cropping it is what makes the pair fill the hero. */}
          <div className="gg-drift" style={{ position: "absolute", inset: "-9%" }}>
            <Image
              className="gg-photo"
              src="/assets/air-dior-lateral.webp"
              alt="Air Jordan 1 High OG Dior"
              fill
              sizes="(max-width: 980px) 100vw, 50vw"
              priority
              style={{ objectFit: "contain" }}
            />
          </div>
        </div>
      ),
    },
    {
      key: "collab",
      badge: "The collab vault",
      badgeTone: "ink",
      note: "7 pairs on the shelf",
      title: <>Travis.<br />Off-White.<br />Louis V.<br />In stock.</>,
      body: "Seven collab pairs on the shelf right now — Mocha highs, Reverse Mochas, The Ten Chicago, the Abloh Air Force 1. The stuff that never sits around.",
      primary: { label: "Open the vault", href: "/shop?fam=Travis+Scott" },
      secondary: { label: "See every collab", href: "/shop?fam=Off-White" },
      media: <CollabStack />,
    },
    {
      key: "cod",
      badge: "No card needed",
      badgeTone: "accent",
      note: "Cash on delivery, UAE-wide",
      title: <>Pay when<br />the box is<br />in your<br />hands.</>,
      body: "Cash on delivery anywhere in the UAE, or bank transfer if you prefer. Try the pair on at the door. If the fit is wrong, hand it straight back and pay nothing.",
      primary: { label: "Shop all 30 pairs", href: "/shop" },
      secondary: { label: "How we verify", href: "/trust" },
      media: <DeliveryFrame />,
    },
  ];

  const count = slides.length;
  const go = useCallback((i: number) => setSlide(((i % count) + count) % count), [count]);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setSlide((s) => (s + 1) % count), AUTOPLAY_MS);
    return () => clearInterval(t);
  }, [paused, count, slide]);

  const s = slides[slide];

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 48) go(slide + (dx < 0 ? 1 : -1));
        touchX.current = null;
      }}
      style={{ borderBottom: "2px solid var(--color-text)", position: "relative", overflow: "hidden" }}
    >
      <div
        key={s.key}
        className="gg-split gg-hero"
        style={{ "--split": "1.02fr .98fr", minHeight: "min(600px, 78vh)", animation: "gg-fade .5s ease" } as React.CSSProperties}
      >
        <div style={{
          padding: "clamp(34px,4vw,60px) clamp(18px,3vw,56px) clamp(34px,4vw,60px) var(--gutter)",
          maxWidth: 820, marginLeft: "auto", width: "100%",
          display: "flex", flexDirection: "column", justifyContent: "center",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 22, flexWrap: "wrap" }}>
            <span style={{
              background: s.badgeTone === "accent" ? "var(--color-accent)" : "var(--color-text)",
              color: s.badgeTone === "accent" ? "#fff" : "var(--color-bg)",
              padding: "6px 11px", fontSize: 10, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase",
            }}>
              {s.badge}
            </span>
            {s.note && (
              <span className="gg-eyebrow" style={{ color: "var(--color-neutral-700)" }}>{s.note}</span>
            )}
          </div>

          <h1 className="gg-display" style={{ fontSize: "clamp(38px,5vw,80px)" }}>{s.title}</h1>

          <p style={{ margin: "24px 0 0", fontSize: "clamp(14px,1.1vw,16px)", lineHeight: 1.55, maxWidth: "44ch", color: "var(--color-neutral-800)", textWrap: "pretty" }}>
            {s.body}
          </p>

          {s.price && (
            <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginTop: 26, flexWrap: "wrap" }}>
              <span className="gg-figure" style={{ fontFamily: "var(--font-heading)", fontWeight: 900, fontSize: "clamp(30px,3.4vw,40px)", letterSpacing: "-0.03em" }}>
                {money(s.price.now)}
              </span>
              <span style={{ fontSize: 13, color: "var(--color-neutral-600)", textDecoration: "line-through" }}>{money(s.price.was)}</span>
              <span className="tag tag-accent" style={{ fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                Under market by {money(s.price.was - s.price.now)}
              </span>
            </div>
          )}

          <div style={{ display: "flex", gap: 12, marginTop: 30, flexWrap: "wrap" }}>
            <Link href={s.primary.href} className="gg-btn">
              {s.primary.label}
              {ARROW}
            </Link>
            {s.secondary && (
              s.secondary.external ? (
                <a href={s.secondary.href} target="_blank" rel="noopener" className="gg-btn gg-btn-outline">
                  {s.secondary.label}
                  {ARROW}
                </a>
              ) : (
                <Link href={s.secondary.href} className="gg-btn gg-btn-outline">
                  {s.secondary.label}
                  {ARROW}
                </Link>
              )
            )}
          </div>
        </div>

        <div className="gg-split-media" style={{ borderLeft: "2px solid var(--color-text)", position: "relative", minHeight: 320 }}>
          {s.media}
        </div>
      </div>

      {/* — slide controls — */}
      <div style={{
        position: "absolute", left: "var(--gutter)", bottom: 20, zIndex: 5,
        display: "flex", alignItems: "center", gap: 14,
      }}>
        <div style={{ display: "flex", gap: 6 }}>
          {slides.map((sl, i) => (
            <button
              key={sl.key}
              onClick={() => go(i)}
              aria-label={`Slide ${i + 1} of ${count}`}
              aria-current={slide === i}
              style={{
                appearance: "none", width: 44, height: 6, border: 0, padding: 0, cursor: "pointer",
                background: "var(--color-neutral-400)", position: "relative", overflow: "hidden",
              }}
            >
              {/* The active pip doubles as the autoplay timer. */}
              {slide === i && (
                <span
                  key={`${sl.key}-${paused}`}
                  style={{
                    position: "absolute", inset: 0, background: "var(--color-accent)",
                    transformOrigin: "left", animation: paused ? "none" : `gg-timer ${AUTOPLAY_MS}ms linear forwards`,
                    transform: paused ? "none" : undefined,
                  }}
                />
              )}
            </button>
          ))}
        </div>
        <span className="gg-desktop gg-eyebrow gg-figure" style={{ color: "var(--color-neutral-700)", fontWeight: 800 }}>
          {String(slide + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
        </span>
      </div>

      <div className="gg-desktop" style={{ position: "absolute", right: "var(--gutter)", bottom: 20, display: "flex", gap: 8, zIndex: 5 }}>
        <button onClick={() => go(slide - 1)} aria-label="Previous slide" className="gg-hover-invert" style={{ appearance: "none", width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid var(--color-text)", background: "var(--color-bg)", cursor: "pointer", color: "inherit", padding: 0 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="m11 6-6 6 6 6" /><path d="M19 12H5" /></svg>
        </button>
        <button onClick={() => go(slide + 1)} aria-label="Next slide" className="gg-hover-invert" style={{ appearance: "none", width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid var(--color-text)", background: "var(--color-bg)", cursor: "pointer", color: "inherit", padding: 0 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></svg>
        </button>
      </div>
    </section>
  );
}
