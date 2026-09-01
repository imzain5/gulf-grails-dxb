"use client";

import Link from "next/link";
import type { Product } from "@/data/products";
import { money } from "@/lib/money";
import { euToUs } from "@/lib/sizes";
import { ProductCardPhoto } from "./ProductPhoto";
import { useStore } from "@/context/StoreContext";

function WishButton({ product }: { product: Product }) {
  const { isWished, toggleWish } = useStore();
  const w = isWished(product.id);
  return (
    <button
      type="button"
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWish(product.id); }}
      aria-label={w ? "Remove from saved" : "Save"}
      aria-pressed={w}
      style={{
        position: "absolute", top: 8, right: 8, width: 34, height: 34, display: "flex",
        alignItems: "center", justifyContent: "center", appearance: "none",
        background: "var(--color-bg)", border: "2px solid var(--color-text)", cursor: "pointer",
        color: w ? "var(--color-accent)" : "var(--color-text)", padding: 0, zIndex: 4,
        transition: "color .18s var(--ease-out), transform .18s var(--ease-out)",
        transform: w ? "scale(1.06)" : undefined,
      }}
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill={w ? "var(--color-accent)" : "none"} stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
        <path d="M12 20.5 4.6 13a4.7 4.7 0 0 1 6.6-6.7l.8.8.8-.8A4.7 4.7 0 0 1 19.4 13z" />
      </svg>
    </button>
  );
}

/**
 * The quick-size rail that rises from the bottom edge of the frame on hover.
 *
 * A grail sells on size availability more than on anything else, so the sizes
 * belong on the card rather than one click away. Picking one drops it straight
 * into the bag. Hidden entirely on touch, where there is no hover to reveal it
 * and the product page is one tap away.
 */
function QuickSizes({ product }: { product: Product }) {
  const { addToBag } = useStore();
  const shown = product.sizes.slice(0, 6);
  const rest = product.sizes.length - shown.length;

  return (
    <div className="gg-quick">
      {shown.map((z) => (
        <button
          key={z}
          type="button"
          title={`Add EU ${z} — US ${euToUs(z)}`}
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); addToBag(product.id, z); }}
          style={{
            appearance: "none", flex: 1, minWidth: 0, height: 38, border: 0,
            borderRight: "1px solid color-mix(in srgb, #fff 22%, transparent)",
            background: "transparent", color: "var(--color-bg)", cursor: "pointer",
            font: "inherit", fontSize: 11, fontWeight: 800, letterSpacing: "0.06em",
            transition: "background .14s var(--ease-out)",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-accent)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
          {z}
        </button>
      ))}
      {rest > 0 && (
        <span style={{
          flex: "none", display: "flex", alignItems: "center", padding: "0 9px", height: 38,
          fontSize: 10, fontWeight: 800, letterSpacing: "0.08em", color: "var(--color-neutral-400)",
        }}>
          +{rest}
        </span>
      )}
    </div>
  );
}

export default function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const stockLabel = product.stock === 0
    ? "Sold out"
    : product.stock <= 2 ? `Only ${product.stock} left` : `${product.stock} in stock`;
  const sizeRange = product.sizes[0] + "–" + product.sizes[product.sizes.length - 1];
  const saving = product.market - product.price;
  const savingPct = Math.round((saving / product.market) * 100);

  return (
    <Link href={`/product/${product.id}`} className="gg-card" aria-label={product.name}>
      <div
        className="gg-plate"
        style={{ position: "relative", aspectRatio: "1/1", borderBottom: "2px solid var(--color-divider)" }}
      >
        <ProductCardPhoto product={product} priority={priority} />
        <WishButton product={product} />

        {product.drop && (
          <div style={{
            position: "absolute", top: 8, left: 8, background: "var(--color-text)", color: "var(--color-bg)",
            padding: "5px 9px", fontSize: 9, fontWeight: 800, letterSpacing: "0.14em",
            textTransform: "uppercase", pointerEvents: "none", zIndex: 3,
          }}>
            {product.drop}
          </div>
        )}

        {product.stock <= 3 && (
          <div style={{
            position: "absolute", left: 0, bottom: 0,
            background: product.stock === 0 ? "var(--color-text)" : "var(--color-accent)", color: "#fff",
            padding: "6px 10px", fontSize: 10, fontWeight: 800, letterSpacing: "0.14em",
            textTransform: "uppercase", pointerEvents: "none", zIndex: 2,
          }}>
            {stockLabel}
          </div>
        )}

        <QuickSizes product={product} />
      </div>

      <div style={{ padding: "14px 16px 16px", display: "flex", flexDirection: "column", gap: 7, flex: 1 }}>
        <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--color-neutral-600)" }}>
          {product.brand.toUpperCase()}
        </div>
        <div className="gg-card-name" style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 15, lineHeight: 1.2, textWrap: "pretty" }}>
          {product.name}
        </div>
        <div style={{
          marginTop: "auto", paddingTop: 12, borderTop: "2px solid var(--color-divider)",
          display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 8,
        }}>
          <span style={{ display: "flex", alignItems: "baseline", gap: 7, minWidth: 0 }}>
            <span className="gg-figure" style={{ fontWeight: 900, fontSize: 16, letterSpacing: "-0.01em" }}>{money(product.price)}</span>
            {savingPct >= 5 && (
              <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.08em", color: "var(--color-accent)", whiteSpace: "nowrap" }}>
                −{savingPct}%
              </span>
            )}
          </span>
          <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", color: "var(--color-neutral-600)", whiteSpace: "nowrap" }}>
            EU {sizeRange}
          </span>
        </div>
      </div>
    </Link>
  );
}
