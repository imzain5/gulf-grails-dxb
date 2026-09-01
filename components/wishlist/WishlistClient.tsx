"use client";

import Link from "next/link";
import { useCatalogue } from "@/context/CatalogueContext";
import { useStore } from "@/context/StoreContext";
import ProductCard from "@/components/ProductCard";

export default function WishlistClient() {
  const { wish } = useStore();
  const catalogue = useCatalogue();
  const list = catalogue.filter((p) => wish.includes(p.id));

  return (
    <div data-screen-label="Saved">
      <div className="gg-wrap" style={{ padding: "clamp(28px,4vw,44px) var(--gutter) clamp(48px,6vw,72px)" }}>
        <div className="gg-kicker" style={{ marginBottom: 14 }}>Saved pairs</div>
        <h1 className="gg-display gg-d1" style={{ marginBottom: 30, fontSize: "clamp(32px,4vw,56px)" }}>Your shortlist</h1>

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
          <div className="gg-cardgrid">
            {list.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
