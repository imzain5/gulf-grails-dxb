"use client";

import { useEffect } from "react";
import type { Product } from "@/data/products";
import { euToUs } from "@/lib/sizes";

/** Fit notes keyed by what the pair actually does on foot. */
const FIT_NOTES: Record<string, string> = {
  "dior-b23": "Runs about a half size small — Dior's own last is narrower than a Nike one. Take a half up if you are between sizes.",
  "bal-triple-s": "Runs large. Take one full size down from your usual EU.",
  "bal-speed": "Knit upper, stretches in. True to size, or a half down for a snug fit.",
  "bal-runner": "Runs large. Take a half to a full size down.",
  "yz-foam": "Moulded EVA with no give. Go a half size up if your feet are wide.",
  "yz-slide": "Runs small — take a full size up from your sneaker size.",
};

const DEFAULT_NOTE =
  "True to size. If you are between sizes on a Jordan or Dunk, most people take the larger one — the toe box is shallow.";

/**
 * The EU→US→UK conversion and fit note for one pair.
 *
 * Sizing is the single biggest reason a sneaker gets sent back, and it is the
 * one question every WhatsApp conversation opens with. Answering it in place,
 * next to the size buttons, is worth more than any amount of copy elsewhere.
 */
export default function SizeGuide({ product, onClose }: { product: Product; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const note = FIT_NOTES[product.id] ?? DEFAULT_NOTE;

  return (
    <div
      className="gg-scrim"
      onClick={onClose}
      style={{ display: "grid", placeItems: "center", padding: "var(--gutter)" }}
    >
      <div
        className="gg-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Size guide"
        onClick={(e) => e.stopPropagation()}
        style={{ width: "min(560px, 100%)" }}
      >
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
          padding: "18px 22px", borderBottom: "2px solid var(--color-text)", position: "sticky", top: 0,
          background: "var(--color-bg)", zIndex: 2,
        }}>
          <div>
            <div className="gg-kicker gg-kicker-plain" style={{ marginBottom: 4 }}>Size guide</div>
            <div style={{ fontFamily: "var(--font-heading)", fontWeight: 900, fontSize: 19, letterSpacing: "-0.02em", textTransform: "uppercase" }}>
              How this pair fits
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close size guide"
            style={{ appearance: "none", width: 38, height: 38, flex: "none", border: "2px solid var(--color-text)", background: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "inherit" }}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round"><path d="m6 6 12 12" /><path d="m18 6-12 12" /></svg>
          </button>
        </div>

        <div style={{ padding: "20px 22px 26px" }}>
          <div style={{
            display: "flex", gap: 12, padding: "14px 16px", marginBottom: 22,
            background: "var(--color-accent-100)", border: "2px solid var(--color-accent-300)",
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-700)" strokeWidth="2.2" strokeLinecap="round" style={{ flex: "none", marginTop: 1 }}>
              <circle cx="12" cy="12" r="9" /><path d="M12 11v5" /><path d="M12 8h.01" />
            </svg>
            <p style={{ margin: 0, fontSize: 13, lineHeight: 1.55, color: "var(--color-accent-800)", textWrap: "pretty" }}>{note}</p>
          </div>

          <table className="table">
            <thead>
              <tr>
                <th style={{ paddingLeft: 0 }}>EU</th>
                <th>US men</th>
                <th>UK</th>
                <th style={{ textAlign: "right" }}>CM</th>
              </tr>
            </thead>
            <tbody>
              {product.sizes.map((eu) => {
                const us = Number(euToUs(eu));
                return (
                  <tr key={eu}>
                    <td style={{ paddingLeft: 0, fontWeight: 900, fontSize: 15 }}>{eu}</td>
                    <td>{euToUs(eu)}</td>
                    <td>{Number.isNaN(us) ? "—" : (us - 0.5).toFixed(1)}</td>
                    <td style={{ textAlign: "right" }} className="gg-figure">
                      {Number.isNaN(us) ? "—" : (us * 0.847 + 22.6).toFixed(1)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <p style={{ margin: "20px 0 0", fontSize: 12, lineHeight: 1.6, color: "var(--color-neutral-700)", textWrap: "pretty" }}>
            Measure at the end of the day, standing, heel against a wall. Still unsure? Send us your usual size in
            another model on WhatsApp — we have almost certainly sold that pair too and can tell you how this one
            compares. On cash on delivery you can try both shoes on at the door and hand them back if the fit is wrong.
          </p>
        </div>
      </div>
    </div>
  );
}
