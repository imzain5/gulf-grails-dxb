"use client";

import { useState } from "react";
import type { Product } from "@/data/products";
import HomeCard from "./HomeCard";
import QuickView from "./QuickView";
import Rise from "./Rise";

/**
 * A row of homepage cards that share one quick-view dialog.
 *
 * The state lives here rather than in the page so app/page.tsx can stay a
 * server component and the homepage keeps prerendering.
 */
export default function CollectionGrid({
  products,
  columns = 4,
  priorityCount = 0,
  stagger = 70,
}: {
  products: Product[];
  columns?: number;
  /** How many images to mark priority — only worth it above the fold. */
  priorityCount?: number;
  stagger?: number;
}) {
  const [quick, setQuick] = useState<Product | null>(null);

  return (
    <>
      <div
        className="hp-grid"
        style={{ "--n": columns, "--n-md": Math.min(columns, 3), "--n-sm": 2, "--n-xs": 1 } as React.CSSProperties}
      >
        {products.map((p, i) => (
          <Rise key={p.id} delay={i * stagger}>
            <HomeCard product={p} priority={i < priorityCount} onQuickView={setQuick} />
          </Rise>
        ))}
      </div>
      {quick && <QuickView product={quick} onClose={() => setQuick(null)} />}
    </>
  );
}
