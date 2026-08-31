import Link from "next/link";
import type { Product } from "@/data/products";
import { money } from "@/lib/money";
import { ProductCardPhoto } from "./ProductPhoto";

/**
 * The compact card used under "Also in the stockroom".
 *
 * Shorter than the shop card — no wishlist button, no quick sizes — because
 * this row is a nudge sideways, not the grid someone is shopping. It still
 * carries the photo: a text-only row of names reads as a footer and gets
 * ignored.
 */
export default function RelatedCard({ product }: { product: Product }) {
  return (
    <Link href={`/product/${product.id}`} className="gg-card">
      <div className="gg-plate" style={{ position: "relative", aspectRatio: "4/3", borderBottom: "2px solid var(--color-divider)" }}>
        <ProductCardPhoto product={product} padding={10} sizes="(max-width: 560px) 50vw, 260px" />
      </div>
      <div style={{ padding: "14px 16px 16px", display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
        <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--color-neutral-600)" }}>
          {product.brand.toUpperCase()}
        </div>
        <div className="gg-card-name" style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 14, lineHeight: 1.25, textWrap: "pretty" }}>
          {product.name}
        </div>
        <div className="gg-figure" style={{ fontWeight: 900, fontSize: 15, marginTop: "auto", paddingTop: 8 }}>{money(product.price)}</div>
      </div>
    </Link>
  );
}
