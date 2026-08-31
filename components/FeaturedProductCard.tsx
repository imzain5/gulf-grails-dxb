import Link from "next/link";
import type { Product } from "@/data/products";
import { money } from "@/lib/money";
import { ProductCardPhoto } from "./ProductPhoto";

/** The larger, 4:3 card used for the three pinned grails on the homepage. */
export default function FeaturedProductCard({ product }: { product: Product }) {
  const dropTag = product.drop || "In stock";
  const stockLabel = product.stock <= 2 ? `Only ${product.stock} left` : `${product.stock} in stock`;

  return (
    <Link
      href={`/product/${product.id}`}
      className="gg-card gg-card-hover-elev"
      style={{
        borderTop: "2px solid var(--color-text)",
        background: "var(--color-neutral-100)",
        transition: "box-shadow .22s var(--ease-out), background .22s var(--ease-out)",
        flex: 1,
      }}
    >
      <div className="gg-plate" style={{ position: "relative", aspectRatio: "4/3", borderBottom: "2px solid var(--color-text)" }}>
        <ProductCardPhoto product={product} padding={14} sizes="(max-width: 820px) 100vw, 480px" />
        <div style={{
          position: "absolute", top: 0, right: 0, background: "var(--color-accent)", color: "#fff",
          padding: "7px 12px", fontSize: 10, fontWeight: 800, letterSpacing: "0.16em",
          textTransform: "uppercase", pointerEvents: "none", zIndex: 3,
        }}>
          {dropTag}
        </div>
      </div>
      <div style={{ padding: "18px 20px 20px", display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
        <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--color-neutral-600)" }}>
          {product.brand.toUpperCase()} · {product.sku}
        </div>
        <div className="gg-card-name" style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "clamp(17px,1.5vw,19px)", lineHeight: 1.15, letterSpacing: "-0.01em", textWrap: "pretty" }}>
          {product.name}
        </div>
        <div style={{ fontSize: 13, lineHeight: 1.5, color: "var(--color-neutral-700)", textWrap: "pretty" }}>
          {product.blurb}
        </div>
        <div style={{
          marginTop: "auto", paddingTop: 14, borderTop: "2px solid var(--color-divider)",
          display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 10, flexWrap: "wrap",
        }}>
          <span className="gg-figure" style={{ fontFamily: "var(--font-heading)", fontWeight: 900, fontSize: "clamp(19px,1.8vw,21px)", letterSpacing: "-0.02em" }}>
            {money(product.price)}
          </span>
          <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--color-accent)" }}>
            {stockLabel}
          </span>
        </div>
      </div>
    </Link>
  );
}
