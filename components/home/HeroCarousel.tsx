"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import ImageSlot from "@/components/ImageSlot";
import { findProduct } from "@/data/products";
import { money } from "@/lib/money";
import { waLink } from "@/lib/whatsapp";

const SLIDE_COUNT = 3;
const AUTOPLAY_MS = 7000;

export default function HeroCarousel() {
  const [slide, setSlide] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const flag = findProduct("air-dior");

  useEffect(() => {
    timer.current = setInterval(() => setSlide((s) => (s + 1) % SLIDE_COUNT), AUTOPLAY_MS);
    return () => { if (timer.current) clearInterval(timer.current); };
  }, []);

  const go = (i: number) => {
    setSlide(i);
    if (timer.current) clearInterval(timer.current);
    timer.current = setInterval(() => setSlide((s) => (s + 1) % SLIDE_COUNT), AUTOPLAY_MS);
  };

  return (
    <section style={{ borderBottom: "2px solid var(--color-text)", position: "relative" }}>
      {slide === 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "1.02fr .98fr", minHeight: 600, animation: "gg-fade .5s ease" }}>
          <div style={{ padding: "60px 56px 60px 28px", maxWidth: 820, marginLeft: "auto", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 22 }}>
              <span style={{ background: "var(--color-accent)", color: "#fff", padding: "6px 11px", fontSize: 10, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase" }}>Grail of the week</span>
              <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--color-neutral-700)" }}>2 pairs only · EU 40–45</span>
            </div>
            <h1 style={{ margin: 0, fontSize: "clamp(40px,5vw,80px)", lineHeight: 0.9, letterSpacing: "-0.04em", textTransform: "uppercase" }}>
              Air Dior.<br />The one<br />everybody<br />missed.
            </h1>
            <p style={{ margin: "24px 0 0", fontSize: 16, lineHeight: 1.55, maxWidth: "44ch", color: "var(--color-neutral-800)", textWrap: "pretty" }}>
              8,500 pairs made worldwide. Five million people entered the draw. Two of them are sitting in our Al Quoz stockroom with the numbered box and dust bags.
            </p>
            <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginTop: 26 }}>
              <span style={{ fontFamily: "var(--font-heading)", fontWeight: 900, fontSize: 40, letterSpacing: "-0.03em" }}>{money(flag.price)}</span>
              <span style={{ fontSize: 13, color: "var(--color-neutral-600)", textDecoration: "line-through" }}>{money(flag.market)}</span>
            </div>
            <div style={{ display: "flex", gap: 12, marginTop: 28, flexWrap: "wrap" }}>
              <Link href={`/product/${flag.id}`} className="btn btn-primary" style={{ height: 54, paddingInline: 22, fontSize: 12, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", justifyContent: "flex-start", gap: 10 }}>
                View the pair
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></svg>
              </Link>
              <a href={waLink("Hello Gulf Grails, I have a question about a pair.")} target="_blank" rel="noopener" className="btn btn-secondary" style={{ height: 54, paddingInline: 22, fontSize: 12, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", borderWidth: 2, borderColor: "var(--color-text)", color: "var(--color-text)", justifyContent: "flex-start" }}>
                Ask on WhatsApp
              </a>
            </div>
          </div>
          <div style={{ borderLeft: "2px solid var(--color-text)", background: "#fff", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
            <Image src="/assets/air-dior-lateral.webp" alt="Air Jordan 1 High OG Dior" fill style={{ objectFit: "contain", padding: 24 }} sizes="50vw" priority />
          </div>
        </div>
      )}

      {slide === 1 && (
        <div style={{ display: "grid", gridTemplateColumns: "1.02fr .98fr", minHeight: 600, animation: "gg-fade .5s ease" }}>
          <div style={{ padding: "60px 56px 60px 28px", maxWidth: 820, marginLeft: "auto", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 22 }}>
              <span style={{ background: "var(--color-text)", color: "var(--color-bg)", padding: "6px 11px", fontSize: 10, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase" }}>The collab vault</span>
            </div>
            <h1 style={{ margin: 0, fontSize: "clamp(40px,5vw,80px)", lineHeight: 0.9, letterSpacing: "-0.04em", textTransform: "uppercase" }}>
              Travis.<br />Off-White.<br />Louis V.<br />In stock.
            </h1>
            <p style={{ margin: "24px 0 0", fontSize: 16, lineHeight: 1.55, maxWidth: "44ch", color: "var(--color-neutral-800)", textWrap: "pretty" }}>
              Seven collab pairs on the shelf right now — Mocha highs, Reverse Mochas, The Ten Chicago, the Abloh Air Force 1. The stuff that never sits around.
            </p>
            <div style={{ display: "flex", gap: 12, marginTop: 32, flexWrap: "wrap" }}>
              <Link href="/shop?fam=Travis+Scott" className="btn btn-primary" style={{ height: 54, paddingInline: 22, fontSize: 12, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", justifyContent: "flex-start", gap: 10 }}>
                Open the vault
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></svg>
              </Link>
            </div>
          </div>
          <div className="grayscale" style={{ borderLeft: "2px solid var(--color-text)", background: "var(--color-neutral-200)", position: "relative" }}>
            <ImageSlot id="gg-hero-collab" placeholder="Drop a collab pair shot — Travis or Off-White" />
          </div>
        </div>
      )}

      {slide === 2 && (
        <div style={{ display: "grid", gridTemplateColumns: "1.02fr .98fr", minHeight: 600, animation: "gg-fade .5s ease" }}>
          <div style={{ padding: "60px 56px 60px 28px", maxWidth: 820, marginLeft: "auto", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 22 }}>
              <span style={{ background: "var(--color-accent)", color: "#fff", padding: "6px 11px", fontSize: 10, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase" }}>No card needed</span>
            </div>
            <h1 style={{ margin: 0, fontSize: "clamp(40px,5vw,80px)", lineHeight: 0.9, letterSpacing: "-0.04em", textTransform: "uppercase" }}>
              Pay when<br />the box is<br />in your<br />hands.
            </h1>
            <p style={{ margin: "24px 0 0", fontSize: 16, lineHeight: 1.55, maxWidth: "44ch", color: "var(--color-neutral-800)", textWrap: "pretty" }}>
              Cash on delivery anywhere in the UAE, or bank transfer if you prefer. Try the pair on at the door. If the fit is wrong, hand it straight back and pay nothing.
            </p>
            <div style={{ display: "flex", gap: 12, marginTop: 32, flexWrap: "wrap" }}>
              <Link href="/shop" className="btn btn-primary" style={{ height: 54, paddingInline: 22, fontSize: 12, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", justifyContent: "flex-start", gap: 10 }}>
                Shop all 30 pairs
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></svg>
              </Link>
              <Link href="/trust" className="btn btn-secondary" style={{ height: 54, paddingInline: 22, fontSize: 12, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", borderWidth: 2, borderColor: "var(--color-text)", color: "var(--color-text)", justifyContent: "flex-start" }}>
                How we verify
              </Link>
            </div>
          </div>
          <div className="grayscale" style={{ borderLeft: "2px solid var(--color-text)", background: "var(--color-neutral-200)", position: "relative" }}>
            <ImageSlot id="gg-hero-cod" placeholder="Drop a delivery / handover shot" />
          </div>
        </div>
      )}

      <div style={{ position: "absolute", left: 28, bottom: 24, display: "flex", gap: 8, zIndex: 5 }}>
        {[0, 1, 2].map((i) => (
          <button
            key={i}
            onClick={() => go(i)}
            aria-label={`Slide ${i + 1}`}
            style={{ appearance: "none", width: 44, height: 6, border: 0, padding: 0, cursor: "pointer", background: slide === i ? "var(--color-accent)" : "var(--color-neutral-400)" }}
          />
        ))}
      </div>
      <div style={{ position: "absolute", right: 28, bottom: 20, display: "flex", gap: 8, zIndex: 5 }}>
        <button onClick={() => go((slide + 2) % 3)} aria-label="Previous" className="gg-hover-invert" style={{ appearance: "none", width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid var(--color-text)", background: "var(--color-bg)", cursor: "pointer", color: "inherit", padding: 0 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="m11 6-6 6 6 6" /><path d="M19 12H5" /></svg>
        </button>
        <button onClick={() => go((slide + 1) % 3)} aria-label="Next" className="gg-hover-invert" style={{ appearance: "none", width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid var(--color-text)", background: "var(--color-bg)", cursor: "pointer", color: "inherit", padding: 0 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></svg>
        </button>
      </div>
    </section>
  );
}
