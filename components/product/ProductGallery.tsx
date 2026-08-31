"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Product } from "@/data/products";
import { VIEWS } from "@/lib/sizes";
import StudioPlate from "@/components/StudioPlate";

/**
 * The product gallery: one large frame, a thumbnail rail, and an opt-in zoom.
 *
 * The gallery walks only the angles that were actually shot, so a pair with two
 * photos shows two thumbnails rather than four empty slots.
 *
 * Zoom is off until you turn it on. Magnifying on plain hover meant you could
 * not look at a photo, or reach the next-image arrow, without the image jumping
 * under the cursor — the lens is useful when you're inspecting stitching and
 * in the way the rest of the time. With it on, moving onto any control drops
 * back to full frame so the arrows stay usable.
 */
export default function ProductGallery({ product }: { product: Product }) {
  const photos = product.photos ?? [];
  const count = Math.max(1, photos.length);
  const labels = product.views ?? VIEWS;

  const [i, setI] = useState(0);
  const [zoomOn, setZoomOn] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [overControl, setOverControl] = useState(false);
  const [origin, setOrigin] = useState("50% 50%");
  const frame = useRef<HTMLDivElement>(null);

  const step = useCallback((d: number) => setI((n) => (n + d + count) % count), [count]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = (e.target as HTMLElement)?.tagName;
      if (t === "INPUT" || t === "TEXTAREA" || t === "SELECT") return;
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
      if (e.key === "z" || e.key === "Z") setZoomOn((v) => !v);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step]);

  const src = photos[i];
  const zoomed = zoomOn && hovering && !overControl && Boolean(src);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!zoomOn) return;
    const el = frame.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setOrigin(`${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`);
  };

  /** Arrows and badges suspend the lens while the pointer is on them. */
  const control = {
    onMouseEnter: () => setOverControl(true),
    onMouseLeave: () => setOverControl(false),
  };

  const arrowStyle = (side: "left" | "right"): React.CSSProperties => ({
    position: "absolute", [side]: 14, top: "50%", transform: "translateY(-50%)",
    width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center",
    appearance: "none", border: "2px solid var(--color-text)", background: "var(--color-bg)",
    cursor: "pointer", color: "inherit", padding: 0, zIndex: 4,
  });

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div
        ref={frame}
        className="gg-plate"
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => { setHovering(false); setOverControl(false); }}
        onMouseMove={onMove}
        style={{
          position: "relative",
          aspectRatio: "4/3",
          borderBottom: "2px solid var(--color-divider)",
          cursor: src && zoomOn ? (zoomed ? "zoom-out" : "zoom-in") : "default",
        }}
      >
        {src ? (
          <div
            style={{
              position: "absolute", inset: 28,
              transform: zoomed ? "scale(2.4)" : "none",
              transformOrigin: origin,
              transition: "transform .28s var(--ease-out)",
            }}
          >
            <Image
              className="gg-photo"
              src={src}
              alt={`${product.name} — ${labels[i] ?? "view"}`}
              fill
              sizes="(max-width: 980px) 100vw, 60vw"
              priority={i === 0}
              style={{ objectFit: "contain" }}
            />
          </div>
        ) : (
          <StudioPlate product={product} />
        )}

        {count > 1 && (
          <>
            <button onClick={() => step(-1)} aria-label="Previous image" className="gg-hover-invert" style={arrowStyle("left")} {...control}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="m11 6-6 6 6 6" /><path d="M19 12H5" /></svg>
            </button>
            <button onClick={() => step(1)} aria-label="Next image" className="gg-hover-invert" style={arrowStyle("right")} {...control}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></svg>
            </button>
          </>
        )}

        <div style={{ position: "absolute", top: 0, left: 0, background: "var(--color-text)", color: "var(--color-bg)", padding: "9px 14px", fontSize: 10, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", pointerEvents: "none", zIndex: 4 }}>
          {product.sku}
        </div>

        <div style={{ position: "absolute", right: 14, bottom: 14, display: "flex", alignItems: "center", gap: 8, zIndex: 4 }}>
          {src && (
            <button
              className="gg-desktop"
              onClick={() => setZoomOn((v) => !v)}
              aria-pressed={zoomOn}
              title={zoomOn ? "Turn zoom off (Z)" : "Turn zoom on (Z)"}
              style={{
                appearance: "none", display: "inline-flex", alignItems: "center", gap: 7, cursor: "pointer",
                border: "2px solid var(--color-text)", padding: "6px 10px", font: "inherit",
                fontSize: 10, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase",
                background: zoomOn ? "var(--color-accent)" : "var(--color-bg)",
                color: zoomOn ? "#fff" : "var(--color-text)",
                borderColor: zoomOn ? "var(--color-accent)" : "var(--color-text)",
                transition: "background .16s var(--ease-out), color .16s var(--ease-out), border-color .16s var(--ease-out)",
              }}
              {...control}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
                <path d="M11 8v6" /><path d="M8 11h6" />
              </svg>
              Zoom {zoomOn ? "on" : "off"}
            </button>
          )}
          {count > 1 && (
            <span className="gg-figure" style={{ background: "var(--color-text)", color: "var(--color-bg)", padding: "7px 11px", fontSize: 10, fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", pointerEvents: "none" }}>
              {i + 1} / {count}
            </span>
          )}
        </div>
      </div>

      {count > 1 && (
        <div className="gg-grid" style={{ "--cols": Math.min(count, 6), "--cols-sm": Math.min(count, 6) } as React.CSSProperties}>
          {photos.map((p, n) => {
            const active = i === n;
            return (
              <button
                key={p}
                onClick={() => setI(n)}
                aria-label={`View ${labels[n] ?? `image ${n + 1}`}`}
                aria-current={active}
                className="gg-plate gg-plate-flat"
                style={{
                  position: "relative", appearance: "none", padding: 0, cursor: "pointer", aspectRatio: "1/1",
                  border: 0, borderRight: "2px solid var(--color-divider)",
                  borderBottom: `3px solid ${active ? "var(--color-accent)" : "var(--color-divider)"}`,
                  overflow: "hidden", transition: "border-color .16s var(--ease-out)",
                }}
              >
                <Image className="gg-photo" src={p} alt="" fill sizes="130px" style={{ objectFit: "contain", padding: 8 }} />
                <span style={{
                  position: "absolute", left: 6, bottom: 4, fontSize: 9, fontWeight: 800,
                  letterSpacing: "0.12em", textTransform: "uppercase",
                  color: active ? "var(--color-accent)" : "var(--color-neutral-500)",
                }}>
                  {labels[n] ?? n + 1}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
