import Link from "next/link";
import type { Product } from "@/data/products";
import { money } from "@/lib/money";

export default function RelatedCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/product/${product.id}`}
      className="gg-card-hover"
      style={{
        borderRight: "2px solid var(--color-text)", borderBottom: "2px solid var(--color-text)",
        cursor: "pointer", padding: 18, background: "var(--color-neutral-100)",
        display: "flex", flexDirection: "column", gap: 8, color: "inherit",
      }}
    >
      <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--color-neutral-600)" }}>
        {product.brand.toUpperCase()}
      </div>
      <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 15, lineHeight: 1.2, textWrap: "pretty" }}>
        {product.name}
      </div>
      <div style={{ fontWeight: 900, fontSize: 15, marginTop: 6 }}>{money(product.price)}</div>
    </Link>
  );
}
