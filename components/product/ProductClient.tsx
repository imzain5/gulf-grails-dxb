"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Product } from "@/data/products";
import { PRODUCTS } from "@/data/products";
import { VIEWS, euToUs, sizePrice, sizeStock } from "@/lib/sizes";
import { money } from "@/lib/money";
import { waLink } from "@/lib/whatsapp";
import { useStore } from "@/context/StoreContext";
import ProductPhoto from "@/components/ProductPhoto";
import ImageSlot from "@/components/ImageSlot";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import BundleCard from "@/components/BundleCard";
import RelatedCard from "@/components/RelatedCard";

export default function ProductClient({ product: prod }: { product: Product }) {
  const { addToBag, setStickyBar } = useStore();
  const [gal, setGal] = useState(0);
  const [sel, setSel] = useState<number | null>(null);
  const [needSize, setNeedSize] = useState(false);
  const [showMatrix, setShowMatrix] = useState(false);
  const [viewers, setViewers] = useState(14);
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setViewers(8 + Math.floor(Math.random() * 19)), 5000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const onScroll = () => setStuck((window.scrollY || 0) > 620);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setStickyBar(stuck);
    return () => setStickyBar(false);
  }, [stuck, setStickyBar]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = (e.target as HTMLElement)?.tagName;
      if (t === "INPUT" || t === "TEXTAREA" || t === "SELECT") return;
      if (e.key === "ArrowRight") setGal((g) => (g + 1) % VIEWS.length);
      if (e.key === "ArrowLeft") setGal((g) => (g + VIEWS.length - 1) % VIEWS.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const galSrc = prod.photos ? (prod.photos[gal] || "") : "";
  const selPrice = sel ? sizePrice(prod, sel) : prod.price;
  const selPriceLabel = money(selPrice);
  const stockLabel = prod.stock <= 2 ? `Only ${prod.stock} in the stockroom` : `${prod.stock} pairs in the stockroom`;
  const saveLabel = "Under market by " + money(prod.market - prod.price);
  const selLabel = sel ? `EU ${sel} · US ${euToUs(sel)}` : "Select a size";

  const bundle = PRODUCTS.filter((p) => p.price < 800 && p.id !== prod.id).slice(0, 3);
  const related = PRODUCTS.filter((p) => p.fam === prod.fam && p.id !== prod.id)
    .concat(PRODUCTS.filter((p) => p.fam !== prod.fam))
    .slice(0, 4);

  const handleAddToBag = () => {
    if (!sel) { setNeedSize(true); return; }
    addToBag(prod.id, sel);
  };

  const waProductText = "Hello Gulf Grails, I want the " + prod.name + (sel ? " in EU " + sel : "") + " (" + money(selPrice) + "). Is it available?";

  return (
    <div data-screen-label="Product">
      <div style={{ borderBottom: "2px solid var(--color-divider)", padding: "14px 28px", maxWidth: 1560, margin: "0 auto", width: "100%", boxSizing: "border-box", fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--color-neutral-600)" }}>
        <Link href="/shop" style={{ appearance: "none", background: "none", border: 0, padding: 0, font: "inherit", cursor: "pointer", color: "var(--color-accent)" }}>Shop</Link>
        <span style={{ padding: "0 8px" }}>/</span>
        <span>{prod.brand}</span>
        <span style={{ padding: "0 8px" }}>/</span>
        <span style={{ color: "var(--color-text)" }}>{prod.name}</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.15fr .85fr", borderBottom: "2px solid var(--color-text)" }}>
        <div style={{ borderRight: "2px solid var(--color-text)", display: "flex", flexDirection: "column" }}>
          <div style={{ position: "relative", background: "#fff", aspectRatio: "4/3", borderBottom: "2px solid var(--color-divider)" }}>
            {galSrc ? (
              <ProductPhoto src={galSrc} alt={prod.name} padding={28} sizes="(max-width: 900px) 100vw, 60vw" />
            ) : (
              <ImageSlot id={`gg-${prod.id}-v${gal}`} placeholder={`Drop the ${VIEWS[gal].toLowerCase()} shot of the ${prod.name} here`} fit="contain" />
            )}
            <button
              onClick={() => setGal((g) => (g + VIEWS.length - 1) % VIEWS.length)}
              aria-label="Previous image"
              className="gg-hover-invert"
              style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", appearance: "none", border: "2px solid var(--color-text)", background: "var(--color-bg)", cursor: "pointer", color: "inherit", padding: 0, zIndex: 3 }}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="m11 6-6 6 6 6" /><path d="M19 12H5" /></svg>
            </button>
            <button
              onClick={() => setGal((g) => (g + 1) % VIEWS.length)}
              aria-label="Next image"
              className="gg-hover-invert"
              style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", appearance: "none", border: "2px solid var(--color-text)", background: "var(--color-bg)", cursor: "pointer", color: "inherit", padding: 0, zIndex: 3 }}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></svg>
            </button>
            <div style={{ position: "absolute", right: 14, bottom: 14, background: "var(--color-text)", color: "var(--color-bg)", padding: "7px 11px", fontSize: 10, fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", pointerEvents: "none", zIndex: 3 }}>
              {gal + 1} / {VIEWS.length}
            </div>
            <div style={{ position: "absolute", top: 0, left: 0, background: "var(--color-text)", color: "var(--color-bg)", padding: "9px 14px", fontSize: 10, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", pointerEvents: "none" }}>
              {prod.sku}
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)" }}>
            {VIEWS.map((label, i) => {
              const isPhoto = !!(prod.photos && prod.photos[i]);
              const active = gal === i;
              return (
                <button
                  key={label}
                  onClick={() => setGal(i)}
                  style={{
                    position: "relative", appearance: "none", padding: 0, cursor: "pointer", aspectRatio: "1/1",
                    background: "#fff", border: 0, borderRight: "2px solid var(--color-divider)",
                    borderBottom: `2px solid ${active ? "var(--color-accent)" : "var(--color-divider)"}`, overflow: "hidden",
                  }}
                >
                  {isPhoto ? (
                    <ProductPhoto src={prod.photos![i]} alt={label} padding={8} sizes="120px" />
                  ) : (
                    <span style={{
                      position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "flex-start",
                      justifyContent: "flex-end", gap: 2, padding: 10,
                      background: active ? "var(--color-accent-100)" : "var(--color-neutral-100)",
                    }}>
                      <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: active ? "var(--color-accent-700)" : "var(--color-neutral-600)" }}>0{i + 1}</span>
                      <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textAlign: "left", color: active ? "var(--color-accent-700)" : "var(--color-neutral-700)" }}>{label}</span>
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ padding: "36px 36px 44px", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, marginBottom: 14 }}>
            <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--color-accent)" }}>{prod.brand} · {prod.year}</span>
            <span style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-neutral-700)" }}>
              <span style={{ width: 7, height: 7, background: "var(--color-accent)", animation: "gg-pulse 1.5s ease-in-out infinite", display: "inline-block" }} />
              {viewers} viewing now
            </span>
          </div>
          <h1 style={{ margin: 0, fontSize: "clamp(26px,2.9vw,38px)", lineHeight: 1.02, letterSpacing: "-0.03em", textTransform: "uppercase", textWrap: "pretty" }}>{prod.name}</h1>
          <div style={{ fontSize: 14, color: "var(--color-neutral-700)", marginTop: 10 }}>{prod.colorway}</div>

          <div style={{ display: "flex", alignItems: "baseline", gap: 14, margin: "24px 0 8px", flexWrap: "wrap" }}>
            <span style={{ fontFamily: "var(--font-heading)", fontWeight: 900, fontSize: 36, letterSpacing: "-0.03em" }}>{selPriceLabel}</span>
            <span style={{ fontSize: 13, color: "var(--color-neutral-600)", textDecoration: "line-through" }}>{money(prod.market)}</span>
            <span className="tag tag-accent" style={{ fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase" }}>{saveLabel}</span>
          </div>
          <div style={{ fontSize: 12, letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 800, color: "var(--color-accent)", marginBottom: 22 }}>{stockLabel}</div>

          <div style={{ borderTop: "2px solid var(--color-divider)", paddingTop: 18 }}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 12 }}>
              <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase" }}>Select size — EU</span>
              <button onClick={() => setShowMatrix((v) => !v)} className="btn btn-ghost" style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", padding: 0 }}>
                {showMatrix ? "Hide size chart" : "Size, stock & price chart"}
              </button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(70px,1fr))", gap: 8 }}>
              {prod.sizes.map((z) => {
                const on = sel === z;
                return (
                  <button
                    key={z}
                    onClick={() => { setSel(z); setNeedSize(false); }}
                    style={{
                      appearance: "none", cursor: "pointer", font: "inherit", fontSize: 14, fontWeight: 800, height: 52,
                      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 1,
                      border: "2px solid var(--color-text)", background: on ? "var(--color-text)" : "transparent", color: on ? "var(--color-bg)" : "var(--color-text)",
                    }}
                  >
                    {z}
                    <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.06em", opacity: 0.7 }}>US {euToUs(z)}</span>
                  </button>
                );
              })}
            </div>
            {needSize && (
              <div style={{ marginTop: 12, fontSize: 12, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-accent)" }}>
                Pick a size to continue
              </div>
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 24 }}>
            <button onClick={handleAddToBag} className="btn btn-primary" style={{ height: 54, paddingInline: 22, fontSize: 12, fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", justifyContent: "flex-start" }}>
              Add to bag — {selPriceLabel}
            </button>
            <a href={waLink(waProductText)} target="_blank" rel="noopener" className="btn btn-secondary" style={{ height: 54, paddingInline: 22, borderWidth: 2, borderColor: "var(--color-text)", color: "var(--color-text)", fontSize: 12, fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", justifyContent: "flex-start", gap: 10 }}>
              <WhatsAppIcon />
              Order this on WhatsApp
            </a>
          </div>

          <div style={{ marginTop: 26, borderTop: "2px solid var(--color-text)", paddingTop: 18, display: "flex", flexDirection: "column", gap: 13 }}>
            <div style={{ display: "flex", gap: 12 }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flex: "none", marginTop: 2 }}><path d="M12 2 4 5v6c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5z" /><path d="m9 12 2 2 4-4" /></svg>
              <div><span style={{ fontWeight: 800, fontSize: 13 }}>Verified before dispatch.</span> <span style={{ fontSize: 13, color: "var(--color-neutral-700)" }}>Photographed on our table, tag and stitching checked, box included.</span></div>
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flex: "none", marginTop: 2 }}><path d="M10 17h4V5H2v12h3" /><path d="M15 8h4l3 4v5h-3" /><circle cx="7.5" cy="17.5" r="2.5" /><circle cx="17.5" cy="17.5" r="2.5" /></svg>
              <div><span style={{ fontWeight: 800, fontSize: 13 }}>Same-day Dubai, next day UAE-wide.</span> <span style={{ fontSize: 13, color: "var(--color-neutral-700)" }}>Try it on at the door before you pay.</span></div>
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flex: "none", marginTop: 2 }}><rect x="2" y="5" width="20" height="14" /><path d="M2 10h20" /></svg>
              <div><span style={{ fontWeight: 800, fontSize: 13 }}>Cash on delivery or bank transfer.</span> <span style={{ fontSize: 13, color: "var(--color-neutral-700)" }}>No card, no online payment, no account.</span></div>
            </div>
          </div>
        </div>
      </div>

      {showMatrix && (
        <div style={{ borderBottom: "2px solid var(--color-text)", background: "var(--color-neutral-100)" }}>
          <div style={{ maxWidth: 1560, margin: "0 auto", padding: "36px 28px 40px" }}>
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--color-accent)", marginBottom: 14 }}>Size, stock &amp; price</div>
            <h2 style={{ margin: "0 0 20px", fontSize: "clamp(22px,2.4vw,32px)", lineHeight: 1, letterSpacing: "-0.03em", textTransform: "uppercase" }}>What we hold, size by size</h2>
            <table className="table">
              <thead>
                <tr><th style={{ paddingLeft: 0 }}>Size EU</th><th>US</th><th>In stock</th><th>Price</th><th style={{ textAlign: "right" }}>Action</th></tr>
              </thead>
              <tbody>
                {prod.sizes.map((z, i) => {
                  const st = sizeStock(prod, i);
                  return (
                    <tr key={z}>
                      <td style={{ paddingLeft: 0, fontWeight: 800, fontSize: 15 }}>{z}</td>
                      <td>{euToUs(z)}</td>
                      <td><span className={`tag ${st <= 1 ? "tag-accent" : "tag-neutral"}`} style={{ fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>{st <= 1 ? "Last pair" : `${st} pairs`}</span></td>
                      <td style={{ fontWeight: 800 }}>{money(sizePrice(prod, z))}</td>
                      <td style={{ textAlign: "right" }}>
                        <button onClick={() => { setSel(z); setNeedSize(false); }} className="btn btn-ghost" style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>Select</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div style={{ maxWidth: 1560, margin: "0 auto", padding: "48px 28px 56px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--color-accent)", marginBottom: 14 }}>The pair</div>
          <p style={{ margin: "0 0 18px", fontSize: 15, lineHeight: 1.6, color: "var(--color-neutral-800)", textWrap: "pretty" }}>{prod.desc}</p>
          <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, color: "var(--color-neutral-800)", textWrap: "pretty" }}>{prod.blurb}</p>
        </div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--color-accent)", marginBottom: 14 }}>Details</div>
          <table className="table">
            <tbody>
              {[
                ["Style code", prod.sku],
                ["Colourway", prod.colorway],
                ["Released", String(prod.year)],
                ["Condition", "Brand new, deadstock"],
                ["Included", "Original box and accessories"],
                ["Sizes in stock", "EU " + prod.sizes.join(", ")],
              ].map(([k, v]) => (
                <tr key={k}><th style={{ width: "40%", paddingLeft: 0 }}>{k}</th><td style={{ fontWeight: 600 }}>{v}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {bundle.length > 0 && (
        <div style={{ borderTop: "2px solid var(--color-text)", background: "var(--color-neutral-100)" }}>
          <div style={{ maxWidth: 1560, margin: "0 auto", padding: "40px 28px 48px" }}>
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--color-accent)", marginBottom: 14 }}>Complete the look</div>
            <h2 style={{ margin: "0 0 22px", fontSize: "clamp(22px,2.4vw,32px)", lineHeight: 1, letterSpacing: "-0.03em", textTransform: "uppercase" }}>Add one of these and delivery is on us</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", borderTop: "2px solid var(--color-text)", borderLeft: "2px solid var(--color-text)" }}>
              {bundle.map((p) => <BundleCard key={p.id} product={p} />)}
            </div>
          </div>
        </div>
      )}

      <div style={{ borderTop: "2px solid var(--color-text)", maxWidth: 1560, margin: "0 auto", padding: "40px 28px 72px", width: "100%", boxSizing: "border-box" }}>
        <h2 style={{ margin: "0 0 22px", fontSize: "clamp(22px,2.4vw,32px)", lineHeight: 1, letterSpacing: "-0.03em", textTransform: "uppercase" }}>Also in the stockroom</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(236px,1fr))", borderTop: "2px solid var(--color-text)", borderLeft: "2px solid var(--color-text)" }}>
          {related.map((p) => <RelatedCard key={p.id} product={p} />)}
        </div>
      </div>

      {stuck && (
        <div style={{ position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 65, background: "var(--color-bg)", borderTop: "2px solid var(--color-text)", boxShadow: "0 -6px 24px color-mix(in srgb, #2d2b2b 16%, transparent)", animation: "gg-rise .2s ease" }}>
          <div style={{ maxWidth: 1560, margin: "0 auto", padding: "12px 28px", display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ width: 56, height: 56, background: "#fff", border: "2px solid var(--color-divider)", flex: "none", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", position: "relative" }}>
              {galSrc ? (
                <ProductPhoto src={galSrc} alt={prod.name} padding={4} sizes="56px" />
              ) : (
                <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-neutral-500)" }}>{prod.brand.slice(0, 3).toUpperCase()}</span>
              )}
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 15, lineHeight: 1.2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{prod.name}</div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-neutral-600)", marginTop: 3 }}>{selLabel}</div>
            </div>
            <span style={{ fontFamily: "var(--font-heading)", fontWeight: 900, fontSize: 22, letterSpacing: "-0.02em", flex: "none" }}>{selPriceLabel}</span>
            <button onClick={handleAddToBag} className="btn btn-primary" style={{ height: 48, paddingInline: 20, fontSize: 12, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", justifyContent: "flex-start", flex: "none" }}>
              Add to bag
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
