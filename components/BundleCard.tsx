"use client";

import Link from "next/link";
import type { Product } from "@/data/products";
import { money } from "@/lib/money";
import ProductPhoto from "./ProductPhoto";
import ImageSlot from "./ImageSlot";
import { useStore } from "@/context/StoreContext";

export default function BundleCard({ product }: { product: Product }) {
  const { addToBag } = useStore();
  const midSize = product.sizes[Math.floor(product.sizes.length / 2)];
  return (
    <div style={{
      borderRight: "2px solid var(--color-text)", borderBottom: "2px solid var(--color-text)",
      display: "grid", gridTemplateColumns: "110px 1fr", background: "var(--color-bg)",
    }}>
      <Link href={`/product/${product.id}`} style={{ background: "#fff", borderRight: "2px solid var(--color-divider)", minWidth: 0, position: "relative" }}>
        {product.photos ? (
          <ProductPhoto src={product.photos[0]} alt={product.name} padding={6} />
        ) : (
          <ImageSlot id={"gg-b-" + product.id} placeholder={product.name} />
        )}
      </Link>
      <div style={{ padding: "16px 18px", display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--color-neutral-600)" }}>
          {product.brand.toUpperCase()}
        </div>
        <Link href={`/product/${product.id}`} style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 14, lineHeight: 1.2, color: "inherit", textWrap: "pretty" }}>
          {product.name}
        </Link>
        <div style={{ marginTop: "auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
          <span style={{ fontWeight: 900, fontSize: 15 }}>{money(product.price)}</span>
          <button
            type="button"
            onClick={() => addToBag(product.id, midSize)}
            className="btn btn-ghost"
            style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}
          >
            Add →
          </button>
        </div>
      </div>
    </div>
  );
}
