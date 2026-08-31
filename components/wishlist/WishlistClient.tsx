"use client";

import Link from "next/link";
import { PRODUCTS } from "@/data/products";
import { useStore } from "@/context/StoreContext";
import ProductCard from "@/components/ProductCard";

export default function WishlistClient() {
  const { wish } = useStore();
  const list = PRODUCTS.filter((p) => wish.includes(p.id));

  return (
    <div data-screen-label="Saved">
      <div style={{ maxWidth: 1560, margin: "0 auto", padding: "44px 28px 72px" }}>
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--color-accent)", marginBottom: 12 }}>Saved pairs</div>
        <h1 style={{ margin: "0 0 30px", fontSize: "clamp(32px,4vw,56px)", lineHeight: 0.95, letterSpacing: "-0.04em", textTransform: "uppercase" }}>Your shortlist</h1>

        {list.length === 0 ? (
          <div style={{ border: "2px solid var(--color-text)", padding: "48px 32px" }}>
            <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 24, marginBottom: 10 }}>Nothing saved yet.</div>
            <div style={{ fontSize: 14, color: "var(--color-neutral-700)", maxWidth: "48ch", marginBottom: 22, textWrap: "pretty" }}>
              Tap the heart on any pair and it lands here. Handy when you&apos;re deciding between two colourways.
            </div>
            <Link href="/shop" className="btn btn-primary" style={{ height: 48, paddingInline: 20, fontSize: 12, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", justifyContent: "flex-start" }}>
              Shop the inventory
            </Link>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(248px,1fr))", borderTop: "2px solid var(--color-text)", borderLeft: "2px solid var(--color-text)" }}>
            {list.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
