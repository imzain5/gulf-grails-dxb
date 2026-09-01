"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Product } from "@/data/products";
import { useCatalogue } from "@/context/CatalogueContext";
import { euToUs, sizePrice, sizeStock } from "@/lib/sizes";
import { money } from "@/lib/money";
import { waLink } from "@/lib/whatsapp";
import { recordView } from "@/lib/recentStore";
import { useStore } from "@/context/StoreContext";
import { ProductCardPhoto } from "@/components/ProductPhoto";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import BundleCard from "@/components/BundleCard";
import RelatedCard from "@/components/RelatedCard";
import RecentlyViewed from "@/components/RecentlyViewed";
import Reveal from "@/components/Reveal";
import ProductGallery from "./ProductGallery";
import SizeGuide from "./SizeGuide";

const ARROW = (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" /><path d="m13 6 6 6-6 6" />
  </svg>
);

/** The three promises that sit under the buy buttons. */
const ASSURANCES: [React.ReactNode, string, string][] = [
  [
    <><path d="M12 2 4 5v6c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5z" /><path d="m9 12 2 2 4-4" /></>,
    "Verified before dispatch.",
    "Photographed on our table, tag and stitching checked, box included.",
  ],
  [
    <><path d="M10 17h4V5H2v12h3" /><path d="M15 8h4l3 4v5h-3" /><circle cx="7.5" cy="17.5" r="2.5" /><circle cx="17.5" cy="17.5" r="2.5" /></>,
    "Same-day Dubai, next day UAE-wide.",
    "Try it on at the door before you pay.",
  ],
  [
    <><rect x="2" y="5" width="20" height="14" /><path d="M2 10h20" /></>,
    "Cash on delivery or bank transfer.",
    "No card, no online payment, no account.",
  ],
];

export default function ProductClient({ product: prod }: { product: Product }) {
  const { addToBag, isWished, toggleWish, setStickyBar } = useStore();
  const catalogue = useCatalogue();
  const [sel, setSel] = useState<number | null>(null);
  const [needSize, setNeedSize] = useState(false);
  const [showMatrix, setShowMatrix] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [viewers, setViewers] = useState(14);
  const [stuck, setStuck] = useState(false);

  useEffect(() => { recordView(prod.id); }, [prod.id]);

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

  const selPrice = sel ? sizePrice(prod, sel) : prod.price;
  const selPriceLabel = money(selPrice);
  // Zero stock is a state the owner sets from /admin when a pair is between
  // restocks: the listing stays up so the page keeps its search ranking and
  // its inbound links, but nothing about it can be bought.
  const soldOut = prod.stock <= 0;
  const stockLabel = soldOut
    ? "Sold out — message us for the next pair"
    : prod.stock <= 2
      ? `Only ${prod.stock} in the stockroom`
      : `${prod.stock} pairs in the stockroom`;
  const saving = prod.market - prod.price;
  const savingPct = Math.round((saving / prod.market) * 100);
  const selLabel = sel ? `EU ${sel} · US ${euToUs(sel)}` : "Select a size";
  const wished = isWished(prod.id);

  const bundle = catalogue.filter((p) => p.price < 800 && p.id !== prod.id).slice(0, 3);
  const related = catalogue.filter((p) => p.fam === prod.fam && p.id !== prod.id)
    .concat(catalogue.filter((p) => p.fam !== prod.fam && p.id !== prod.id))
    .slice(0, 4);

  const handleAddToBag = () => {
    if (!sel) { setNeedSize(true); return; }
    addToBag(prod.id, sel);
  };

  const waProductText = `Hello Gulf Grails, I want the ${prod.name}${sel ? ` in EU ${sel}` : ""} (${money(selPrice)}). Is it available?`;

  return (
    <div data-screen-label="Product">
      <div className="gg-wrap" style={{ borderBottom: "2px solid var(--color-divider)", padding: "14px var(--gutter)", fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--color-neutral-600)", display: "flex", gap: 8, flexWrap: "wrap" }}>
        <Link href="/shop" style={{ color: "var(--color-accent)" }}>Shop</Link>
        <span>/</span>
        <Link href={`/shop?fam=${encodeURIComponent(prod.fam)}`} style={{ color: "inherit" }}>{prod.brand}</Link>
        <span>/</span>
        <span style={{ color: "var(--color-text)" }}>{prod.name}</span>
      </div>

      <div className="gg-split" style={{ "--split": "1.15fr .85fr", borderBottom: "2px solid var(--color-text)" } as React.CSSProperties}>
        <div style={{ borderRight: "2px solid var(--color-text)", display: "flex", flexDirection: "column", minWidth: 0 }}>
          <ProductGallery product={prod} />
        </div>

        <div style={{ padding: "clamp(24px,3vw,36px) clamp(18px,3vw,36px) clamp(32px,4vw,44px)", display: "flex", flexDirection: "column", minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, marginBottom: 14, flexWrap: "wrap" }}>
            <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--color-accent)" }}>{prod.brand} · {prod.year}</span>
            <span style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-neutral-700)" }} suppressHydrationWarning>
              <span style={{ width: 7, height: 7, background: "var(--color-accent)", animation: "gg-pulse 1.5s ease-in-out infinite", display: "inline-block" }} />
              {viewers} viewing now
            </span>
          </div>

          <h1 className="gg-display" style={{ fontSize: "clamp(24px,2.9vw,38px)", lineHeight: 1.02, letterSpacing: "-0.03em" }}>{prod.name}</h1>
          <div style={{ fontSize: 14, color: "var(--color-neutral-700)", marginTop: 10 }}>{prod.colorway}</div>

          <div style={{ display: "flex", alignItems: "baseline", gap: 14, margin: "24px 0 8px", flexWrap: "wrap" }}>
            <span className="gg-figure" style={{ fontFamily: "var(--font-heading)", fontWeight: 900, fontSize: "clamp(28px,3.2vw,36px)", letterSpacing: "-0.03em" }}>{selPriceLabel}</span>
            <span style={{ fontSize: 13, color: "var(--color-neutral-600)", textDecoration: "line-through" }}>{money(prod.market)}</span>
            <span className="tag tag-accent" style={{ fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Under market by {money(saving)} · {savingPct}%
            </span>
          </div>
          <div style={{ fontSize: 12, letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 800, color: "var(--color-accent)", marginBottom: 22 }}>{stockLabel}</div>

          <div style={{ borderTop: "2px solid var(--color-divider)", paddingTop: 18 }}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 12, gap: 12, flexWrap: "wrap" }}>
              <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase" }}>Select size — EU</span>
              <button onClick={() => setShowGuide(true)} className="gg-underline" style={{ appearance: "none", background: "none", border: 0, padding: 0, cursor: "pointer", font: "inherit", fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--color-accent)" }}>
                Size &amp; fit guide
              </button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(66px,1fr))", gap: 8 }}>
              {prod.sizes.map((z) => {
                const on = sel === z;
                return (
                  <button
                    key={z}
                    onClick={() => { setSel(z); setNeedSize(false); }}
                    aria-pressed={on}
                    disabled={soldOut}
                    style={{
                      appearance: "none", cursor: soldOut ? "default" : "pointer", font: "inherit", fontSize: 14, fontWeight: 800, height: 52,
                      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 1,
                      border: "2px solid var(--color-text)", background: on ? "var(--color-text)" : "transparent",
                      color: on ? "var(--color-bg)" : "var(--color-text)",
                      opacity: soldOut ? 0.35 : 1,
                      transition: "background .14s var(--ease-out), color .14s var(--ease-out)",
                    }}
                  >
                    {z}
                    <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.06em", opacity: 0.7 }}>US {euToUs(z)}</span>
                  </button>
                );
              })}
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginTop: 12, flexWrap: "wrap" }}>
              {needSize ? (
                <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-accent)" }}>
                  Pick a size to continue
                </span>
              ) : <span />}
              <button onClick={() => setShowMatrix((v) => !v)} className="gg-underline" style={{ appearance: "none", background: "none", border: 0, padding: 0, cursor: "pointer", font: "inherit", fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--color-neutral-700)" }}>
                {showMatrix ? "Hide stock chart" : "Stock & price by size"}
              </button>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 24 }}>
            {soldOut ? (
              <div className="gg-btn" style={{ justifyContent: "space-between", cursor: "default", opacity: 0.55 }} aria-disabled>
                Sold out — {selPriceLabel}
              </div>
            ) : (
              <button onClick={handleAddToBag} className="gg-btn" style={{ justifyContent: "space-between" }}>
                Add to bag — {selPriceLabel}
                {ARROW}
              </button>
            )}
            <div style={{ display: "flex", gap: 10 }}>
              <a href={waLink(waProductText)} target="_blank" rel="noopener" className="gg-btn gg-btn-outline" style={{ flex: 1, justifyContent: "flex-start", gap: 10 }}>
                <WhatsAppIcon />
                {soldOut ? "Ask when it's back" : "Order on WhatsApp"}
              </a>
              <button
                onClick={() => toggleWish(prod.id)}
                aria-label={wished ? "Remove from saved" : "Save this pair"}
                aria-pressed={wished}
                style={{
                  appearance: "none", width: 54, height: 54, flex: "none", border: "2px solid var(--color-text)",
                  background: wished ? "var(--color-accent)" : "transparent", cursor: "pointer",
                  color: wished ? "#fff" : "var(--color-text)", display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "background .16s var(--ease-out), color .16s var(--ease-out)",
                }}
              >
                <svg width="19" height="19" viewBox="0 0 24 24" fill={wished ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                  <path d="M12 20.5 4.6 13a4.7 4.7 0 0 1 6.6-6.7l.8.8.8-.8A4.7 4.7 0 0 1 19.4 13z" />
                </svg>
              </button>
            </div>
          </div>

          <div style={{ marginTop: 26, borderTop: "2px solid var(--color-text)", paddingTop: 18, display: "flex", flexDirection: "column", gap: 13 }}>
            {ASSURANCES.map(([path, bold, rest]) => (
              <div key={bold} style={{ display: "flex", gap: 12 }}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flex: "none", marginTop: 2 }}>
                  {path}
                </svg>
                <div>
                  <span style={{ fontWeight: 800, fontSize: 13 }}>{bold}</span>{" "}
                  <span style={{ fontSize: 13, color: "var(--color-neutral-700)" }}>{rest}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showMatrix && (
        <div style={{ borderBottom: "2px solid var(--color-text)", background: "var(--color-neutral-100)" }}>
          <div className="gg-wrap" style={{ padding: "clamp(26px,3vw,36px) var(--gutter) clamp(30px,3vw,40px)" }}>
            <div className="gg-kicker" style={{ marginBottom: 14 }}>Size, stock &amp; price</div>
            <h2 className="gg-display gg-d3" style={{ marginBottom: 20 }}>What we hold, size by size</h2>
            <div style={{ overflowX: "auto" }}>
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
                        <td><span className={`tag ${st <= 1 ? "tag-accent" : "tag-neutral"}`} style={{ fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", whiteSpace: "nowrap" }}>{st === 0 ? "Sold out" : st === 1 ? "Last pair" : `${st} pairs`}</span></td>
                        <td style={{ fontWeight: 800, whiteSpace: "nowrap" }}>{money(sizePrice(prod, z))}</td>
                        <td style={{ textAlign: "right" }}>
                          <button onClick={() => { setSel(z); setNeedSize(false); }} disabled={soldOut} className="btn btn-ghost" style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", opacity: soldOut ? 0.4 : 1, cursor: soldOut ? "default" : "pointer" }}>Select</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      <div
        className="gg-wrap gg-grid"
        style={{ padding: "clamp(34px,4vw,48px) var(--gutter) clamp(38px,4vw,56px)", gap: "clamp(28px,4vw,56px)", "--cols": 2, "--cols-sm": 1 } as React.CSSProperties}
      >
        <div>
          <div className="gg-kicker" style={{ marginBottom: 14 }}>The pair</div>
          <p style={{ margin: "0 0 18px", fontSize: 15, lineHeight: 1.6, color: "var(--color-neutral-800)", textWrap: "pretty" }}>{prod.desc}</p>
          <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, color: "var(--color-neutral-800)", textWrap: "pretty" }}>{prod.blurb}</p>
        </div>
        <div style={{ minWidth: 0 }}>
          <div className="gg-kicker" style={{ marginBottom: 14 }}>Details</div>
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
          <div className="gg-wrap" style={{ padding: "clamp(30px,3.4vw,40px) var(--gutter) clamp(34px,4vw,48px)" }}>
            <div className="gg-kicker" style={{ marginBottom: 14 }}>Complete the look</div>
            <h2 className="gg-display gg-d3" style={{ marginBottom: 22 }}>Add one of these and delivery is on us</h2>
            <div
              className="gg-grid"
              style={{ borderTop: "2px solid var(--color-text)", borderLeft: "2px solid var(--color-text)", "--cols": 3, "--cols-sm": 1 } as React.CSSProperties}
            >
              {bundle.map((p) => <BundleCard key={p.id} product={p} />)}
            </div>
          </div>
        </div>
      )}

      <div className="gg-wrap" style={{ borderTop: "2px solid var(--color-text)", padding: "clamp(30px,3.4vw,40px) var(--gutter) clamp(44px,5vw,72px)" }}>
        <h2 className="gg-display gg-d3" style={{ marginBottom: 22 }}>Also in the stockroom</h2>
        <Reveal className="gg-cardgrid" style={{ "--card": "236px" } as React.CSSProperties}>
          {related.map((p) => <RelatedCard key={p.id} product={p} />)}
        </Reveal>
      </div>

      <RecentlyViewed excludeId={prod.id} />

      {showGuide && <SizeGuide product={prod} onClose={() => setShowGuide(false)} />}

      {stuck && (
        <div style={{ position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 55, background: "var(--color-bg)", borderTop: "2px solid var(--color-text)", boxShadow: "0 -6px 24px color-mix(in srgb, #2d2b2b 16%, transparent)", animation: "gg-rise .2s ease" }}>
          <div className="gg-wrap" style={{ padding: "12px var(--gutter)", display: "flex", alignItems: "center", gap: "clamp(10px,2vw,20px)" }}>
            <div className="gg-plate gg-plate-flat gg-desktop" style={{ width: 56, height: 56, border: "2px solid var(--color-divider)", flex: "none", position: "relative" }}>
              <ProductCardPhoto product={prod} padding={4} sizes="56px" />
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "clamp(13px,1.3vw,15px)", lineHeight: 1.2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{prod.name}</div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: sel ? "var(--color-neutral-600)" : "var(--color-accent)", marginTop: 3 }}>{selLabel}</div>
            </div>
            <span className="gg-figure gg-desktop" style={{ fontFamily: "var(--font-heading)", fontWeight: 900, fontSize: 22, letterSpacing: "-0.02em", flex: "none" }}>{selPriceLabel}</span>
            {soldOut ? (
              <span className="gg-btn gg-btn-sm" style={{ flex: "none", opacity: 0.55, cursor: "default" }}>Sold out</span>
            ) : (
              <button onClick={handleAddToBag} className="gg-btn gg-btn-sm" style={{ flex: "none" }}>
                Add to bag
                {ARROW}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
