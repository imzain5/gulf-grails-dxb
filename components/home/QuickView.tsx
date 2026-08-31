"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import type { Product } from "@/data/products";
import { money } from "@/lib/money";
import { euToUs, sizePrice } from "@/lib/sizes";
import { useStore } from "@/context/StoreContext";
import StudioPlate from "@/components/StudioPlate";

/**
 * Size-and-add without leaving the homepage.
 *
 * Reuses the existing cart exactly — `addToBag(id, size)` and the same
 * per-size pricing the product page uses — so nothing about the ordering flow
 * changes. It is a shortcut into the existing behaviour, not a second one.
 */
export default function QuickView({ product, onClose }: { product: Product; onClose: () => void }) {
  const { addToBag } = useStore();
  const [sel, setSel] = useState<number | null>(null);
  const [needSize, setNeedSize] = useState(false);

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

  const cover = product.photos?.[0] ?? null;
  const price = sel ? sizePrice(product, sel) : product.price;

  const add = () => {
    if (!sel) { setNeedSize(true); return; }
    addToBag(product.id, sel);
    onClose();
  };

  return (
    <div
      className="gg-scrim"
      onClick={onClose}
      style={{ display: "grid", placeItems: "center", padding: "var(--hp-gutter)" }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Quick view — ${product.name}`}
        onClick={(e) => e.stopPropagation()}
        className="hp-asym"
        style={{
          position: "relative", zIndex: 95, width: "min(860px, 100%)",
          background: "var(--hp-paper)", color: "var(--hp-ink)",
          "--hp-cols": "1fr 1fr", "--hp-gap": "0px",
          maxHeight: "min(88vh, 620px)", animation: "gg-pop .3s var(--hp-ease)",
        } as React.CSSProperties}
      >
        <div className="hp-frame hp-floor" style={{ background: "#fff", minHeight: 260 }}>
          {cover ? (
            <Image className="gg-photo" src={cover} alt={product.name} fill sizes="430px" style={{ objectFit: "contain", padding: "10%" }} />
          ) : (
            <StudioPlate product={product} />
          )}
        </div>

        <div style={{ padding: "clamp(22px,3vw,38px)", display: "flex", flexDirection: "column", overflowY: "auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 16, marginBottom: 18 }}>
            <span className="hp-label hp-label-accent">{product.brand}</span>
            <button
              onClick={onClose}
              aria-label="Close quick view"
              style={{ appearance: "none", border: 0, background: "none", cursor: "pointer", padding: 0, color: "inherit", lineHeight: 0 }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="m6 6 12 12" /><path d="m18 6-12 12" /></svg>
            </button>
          </div>

          <h2 className="hp-display" style={{ fontSize: "clamp(21px,2.2vw,30px)", lineHeight: 1, marginBottom: 12 }}>
            {product.name}
          </h2>
          <div className="hp-body" style={{ fontSize: 13, marginBottom: 20 }}>{product.colorway}</div>

          <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 24 }}>
            <span className="gg-figure" style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 24, letterSpacing: "-0.02em" }}>
              {money(price)}
            </span>
            <span style={{ fontSize: 12, textDecoration: "line-through", color: "color-mix(in srgb, #201e1d 45%, transparent)" }}>
              {money(product.market)}
            </span>
          </div>

          <div className="hp-label" style={{ marginBottom: 12 }}>Select size — EU</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(58px,1fr))", gap: 6, marginBottom: 8 }}>
            {product.sizes.map((z) => {
              const on = sel === z;
              return (
                <button
                  key={z}
                  onClick={() => { setSel(z); setNeedSize(false); }}
                  aria-pressed={on}
                  style={{
                    appearance: "none", cursor: "pointer", font: "inherit", height: 46,
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                    border: `1px solid ${on ? "var(--hp-ink)" : "var(--hp-line-strong)"}`,
                    background: on ? "var(--hp-ink)" : "transparent",
                    color: on ? "var(--hp-paper)" : "var(--hp-ink)",
                    fontSize: 13, fontWeight: 700,
                    transition: "background .28s var(--hp-ease), color .28s var(--hp-ease), border-color .28s var(--hp-ease)",
                  }}
                >
                  {z}
                  <span style={{ fontSize: 8, fontWeight: 600, letterSpacing: "0.08em", opacity: 0.7 }}>US {euToUs(z)}</span>
                </button>
              );
            })}
          </div>
          {needSize && (
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--color-accent)", marginBottom: 4 }}>
              Pick a size to continue
            </div>
          )}

          <div style={{ marginTop: "auto", paddingTop: 22, display: "flex", flexDirection: "column", gap: 12 }}>
            <button onClick={add} className="hp-btn" style={{ width: "100%", justifyContent: "space-between" }}>
              Add to bag
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></svg>
            </button>
            <Link href={`/product/${product.id}`} className="hp-link" style={{ alignSelf: "flex-start" }}>
              Full details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
