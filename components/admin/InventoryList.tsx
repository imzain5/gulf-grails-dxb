"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/data/products";
import InventoryRow from "./InventoryRow";

/**
 * The stockroom list, with a way through it.
 *
 * Thirty pairs fit on a laptop screen and do not fit on a phone, and the list
 * only grows. So: a search box that matches on anything printed on the shoe or
 * the box, and four views that answer the questions actually asked at the
 * shelf — what is out, what is nearly out, what still has no photograph.
 *
 * Filtering happens here rather than on the server because the whole list is
 * already in the page: nothing to fetch, nothing to wait for, and it keeps
 * working while a save is in flight.
 */

type View = "all" | "low" | "out" | "nophoto";

const VIEWS: { key: View; label: string }[] = [
  { key: "all", label: "All" },
  { key: "low", label: "Running low" },
  { key: "out", label: "Sold out" },
  { key: "nophoto", label: "No photo" },
];

export default function InventoryList({ products }: { products: Product[] }) {
  const [q, setQ] = useState("");
  const [view, setView] = useState<View>("all");

  const counts = useMemo(() => ({
    all: products.length,
    low: products.filter((p) => p.stock > 0 && p.stock <= 2).length,
    out: products.filter((p) => p.stock === 0).length,
    nophoto: products.filter((p) => !p.photos?.length).length,
  }), [products]);

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();

    const matches = products.filter((p) => {
      if (view === "low" && !(p.stock > 0 && p.stock <= 2)) return false;
      if (view === "out" && p.stock !== 0) return false;
      if (view === "nophoto" && p.photos?.length) return false;
      if (!needle) return true;
      const hay = `${p.name} ${p.brand} ${p.fam} ${p.colorway} ${p.sku} ${p.drop}`.toLowerCase();
      return hay.includes(needle);
    });

    // What needs attention first: sold out, then low, then the rest by name.
    return matches.sort((a, b) => {
      const rank = (p: Product) => (p.stock === 0 ? 0 : p.stock <= 2 ? 1 : 2);
      return rank(a) - rank(b) || a.name.localeCompare(b.name);
    });
  }, [products, q, view]);

  return (
    <>
      <div className="ad-toolbar">
        <div className="ad-search">
          <input
            className="ad-input"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name, colourway, style code…"
            aria-label="Search the stockroom"
          />
        </div>
      </div>

      <div className="ad-chips" style={{ marginBottom: 16 }}>
        {VIEWS.map((v) => (
          <button
            key={v.key}
            type="button"
            className="ad-chip"
            aria-pressed={view === v.key}
            onClick={() => setView(v.key)}
          >
            {v.label}
            <span style={{ opacity: 0.65, marginLeft: 6 }}>{counts[v.key]}</span>
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <div className="ad-empty">
          {q ? `Nothing matches “${q}”.` : "Nothing in this view."}
        </div>
      ) : (
        <div className="ad-list">
          {shown.map((p) => (
            <InventoryRow key={p.id} product={p} />
          ))}
        </div>
      )}
    </>
  );
}
