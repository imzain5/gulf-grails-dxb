"use client";

import Link from "next/link";
import type { Product } from "@/data/products";
import { money } from "@/lib/money";
import ProductPhoto from "./ProductPhoto";
import ImageSlot from "./ImageSlot";
import { useStore } from "@/context/StoreContext";

function WishButton({ product }: { product: Product }) {
  const { isWished, toggleWish } = useStore();
  const w = isWished(product.id);
  return (
    <button
      type="button"
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWish(product.id); }}
      aria-label={w ? "Remove from saved" : "Save"}
      style={{
        position: "absolute", top: 8, right: 8, width: 34, height: 34, display: "flex",
        alignItems: "center", justifyContent: "center", appearance: "none",
        background: "var(--color-bg)", border: "2px solid var(--color-text)", cursor: "pointer",
        color: w ? "var(--color-accent)" : "var(--color-text)", padding: 0, zIndex: 2,
      }}
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill={w ? "var(--color-accent)" : "none"} stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
        <path d="M12 20.5 4.6 13a4.7 4.7 0 0 1 6.6-6.7l.8.8.8-.8A4.7 4.7 0 0 1 19.4 13z" />
      </svg>
    </button>
  );
}

export default function ProductCard({ product }: { product: Product }) {
  const stockLabel = product.stock <= 2 ? "Only " + product.stock + " left" : product.stock + " in stock";
  const sizeRange = product.sizes[0] + "–" + product.sizes[product.sizes.length - 1];
  return (
    <Link
      href={`/product/${product.id}`}
      style={{
        borderRight: "2px solid var(--color-text)", borderBottom: "2px solid var(--color-text)",
        cursor: "pointer", minWidth: 0, display: "flex", flexDirection: "column",
        background: "var(--color-neutral-100)", color: "inherit", transition: "background .16s ease",
      }}
      className="gg-card-hover"
    >
      <div style={{ position: "relative", aspectRatio: "1/1", background: "#fff", borderBottom: "2px solid var(--color-divider)" }}>
        {product.photos ? (
          <ProductPhoto src={product.photos[0]} alt={product.name} padding={12} />
        ) : (
          <ImageSlot id={"gg-" + product.id} placeholder={product.name} />
        )}
        <WishButton product={product} />
        {product.stock <= 3 && (
          <div style={{
            position: "absolute", left: 0, bottom: 0, background: "var(--color-accent)", color: "#fff",
            padding: "6px 10px", fontSize: 10, fontWeight: 800, letterSpacing: "0.14em",
            textTransform: "uppercase", pointerEvents: "none",
          }}>
            {stockLabel}
          </div>
        )}
      </div>
      <div style={{ padding: "14px 16px 16px", display: "flex", flexDirection: "column", gap: 7, flex: 1 }}>
        <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--color-neutral-600)" }}>
          {product.brand.toUpperCase()}
        </div>
        <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 15, lineHeight: 1.2, textWrap: "pretty" }}>
          {product.name}
        </div>
        <div style={{
          marginTop: "auto", paddingTop: 12, borderTop: "2px solid var(--color-divider)",
          display: "flex", alignItems: "baseline", justifyContent: "space-between",
        }}>
          <span style={{ fontWeight: 900, fontSize: 16, letterSpacing: "-0.01em" }}>{money(product.price)}</span>
          <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", color: "var(--color-neutral-600)" }}>
            EU {sizeRange}
          </span>
        </div>
      </div>
    </Link>
  );
}
