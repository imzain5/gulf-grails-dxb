import Link from "next/link";
import type { Product } from "@/data/products";
import { money } from "@/lib/money";
import ProductPhoto from "./ProductPhoto";
import ImageSlot from "./ImageSlot";

export default function FeaturedProductCard({ product }: { product: Product }) {
  const dropTag = product.drop || "In stock";
  const stockLabel = product.stock <= 2 ? "Only " + product.stock + " left" : product.stock + " in stock";
  return (
    <Link
      href={`/product/${product.id}`}
      className="gg-card-hover-elev"
      style={{
        borderRight: "2px solid var(--color-text)", borderTop: "2px solid var(--color-text)",
        borderBottom: "2px solid var(--color-text)", cursor: "pointer", minWidth: 0, display: "flex",
        flexDirection: "column", background: "var(--color-neutral-100)", color: "inherit",
        transition: "box-shadow .18s ease",
      }}
    >
      <div style={{ position: "relative", aspectRatio: "4/3", background: "#fff", borderBottom: "2px solid var(--color-text)" }}>
        {product.photos ? (
          <ProductPhoto src={product.photos[0]} alt={product.name} padding={12} />
        ) : (
          <ImageSlot id={"gg-" + product.id} placeholder={product.name} />
        )}
        <div style={{
          position: "absolute", top: 0, right: 0, background: "var(--color-accent)", color: "#fff",
          padding: "7px 12px", fontSize: 10, fontWeight: 800, letterSpacing: "0.16em",
          textTransform: "uppercase", pointerEvents: "none",
        }}>
          {dropTag}
        </div>
      </div>
      <div style={{ padding: "18px 20px 20px", display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
        <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--color-neutral-600)" }}>
          {product.brand.toUpperCase()} · {product.sku}
        </div>
        <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 19, lineHeight: 1.15, letterSpacing: "-0.01em", textWrap: "pretty" }}>
          {product.name}
        </div>
        <div style={{ fontSize: 13, lineHeight: 1.5, color: "var(--color-neutral-700)", textWrap: "pretty" }}>
          {product.blurb}
        </div>
        <div style={{
          marginTop: "auto", paddingTop: 14, borderTop: "2px solid var(--color-divider)",
          display: "flex", alignItems: "baseline", justifyContent: "space-between",
        }}>
          <span style={{ fontFamily: "var(--font-heading)", fontWeight: 900, fontSize: 21, letterSpacing: "-0.02em" }}>
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
