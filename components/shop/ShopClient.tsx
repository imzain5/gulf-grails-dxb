"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { FAMILY_FILTERS, SIZE_FILTERS, SORTS, PRODUCTS, type SortKey } from "@/data/products";
import { filterProducts, type ShopFilters } from "@/lib/filter";
import ProductCard from "@/components/ProductCard";
import { waLink } from "@/lib/whatsapp";

function toHref(f: ShopFilters): string {
  const p = new URLSearchParams();
  if (f.fam !== "All") p.set("fam", f.fam);
  if (f.sizeF !== "All") p.set("size", String(f.sizeF));
  if (f.sort !== "Featured") p.set("sort", f.sort);
  if (f.q) p.set("q", f.q);
  const qs = p.toString();
  return qs ? `/shop?${qs}` : "/shop";
}

function chipStyle(on: boolean, size = false): React.CSSProperties {
  return {
    appearance: "none", cursor: "pointer", font: "inherit",
    fontSize: size ? 13 : 12, fontWeight: 700, letterSpacing: size ? undefined : "0.1em",
    textTransform: "uppercase", padding: size ? undefined : "10px 15px",
    minWidth: size ? 48 : undefined, height: size ? 44 : undefined,
    display: size ? "flex" : undefined, alignItems: size ? "center" : undefined, justifyContent: size ? "center" : undefined,
    border: "2px solid var(--color-text)",
    background: on ? "var(--color-accent)" : "transparent",
    color: on ? "#fff" : "var(--color-text)",
  };
}

export default function ShopClient({ initialFilters }: { initialFilters: ShopFilters }) {
  const router = useRouter();
  const [filters, setFilters] = useState<ShopFilters>(initialFilters);

  const update = (patch: Partial<ShopFilters>) => {
    const next = { ...filters, ...patch };
    setFilters(next);
    router.replace(toHref(next), { scroll: false });
  };

  const list = useMemo(() => filterProducts(filters), [filters]);
  const shopKicker = filters.fam === "All" ? "Inventory · Al Quoz stockroom" : filters.fam;
  const resultLabel = list.length === 0
    ? "No match"
    : list.length === PRODUCTS.length
      ? "Everything in stock"
      : list.length === 1 ? "1 pair matches" : `${list.length} pairs match`;

  return (
    <div data-screen-label="Shop">
      <div style={{ borderBottom: "2px solid var(--color-text)", padding: "38px 28px 26px", maxWidth: 1560, margin: "0 auto", width: "100%", boxSizing: "border-box" }}>
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--color-accent)", marginBottom: 12 }}>{shopKicker}</div>
        <h1 style={{ margin: 0, fontSize: "clamp(32px,4vw,60px)", lineHeight: 0.95, letterSpacing: "-0.04em", textTransform: "uppercase" }}>{resultLabel}</h1>
      </div>

      <div style={{ borderBottom: "2px solid var(--color-text)", background: "var(--color-neutral-100)" }}>
        <div style={{ maxWidth: 1560, margin: "0 auto", padding: "20px 28px", display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 14, flexWrap: "wrap" }}>
            <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--color-neutral-700)", width: 60, flex: "none", paddingTop: 12 }}>Model</span>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", flex: 1 }}>
              {FAMILY_FILTERS.map((b) => (
                <button key={b} onClick={() => update({ fam: b })} style={chipStyle(filters.fam === b)}>{b}</button>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 14, flexWrap: "wrap" }}>
            <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--color-neutral-700)", width: 60, flex: "none", paddingTop: 12 }}>Size EU</span>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", flex: 1 }}>
              {SIZE_FILTERS.map((z) => (
                <button key={String(z)} onClick={() => update({ sizeF: z })} style={chipStyle(String(filters.sizeF) === String(z), true)}>{z}</button>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap", paddingTop: 12, borderTop: "2px solid var(--color-divider)" }}>
            <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--color-neutral-700)", width: 60, flex: "none" }}>Sort</span>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {SORTS.map((z) => (
                <button
                  key={z}
                  onClick={() => update({ sort: z as SortKey })}
                  style={{
                    appearance: "none", cursor: "pointer", font: "inherit", fontSize: 12, fontWeight: 700,
                    letterSpacing: "0.1em", textTransform: "uppercase", padding: "9px 15px",
                    border: "2px solid var(--color-divider)",
                    background: filters.sort === z ? "var(--color-accent)" : "transparent",
                    color: filters.sort === z ? "#fff" : "var(--color-text)",
                  }}
                >
                  {z}
                </button>
              ))}
            </div>
            <button onClick={() => update({ fam: "All", sizeF: "All", sort: "Featured", q: "" })} className="btn btn-ghost" style={{ marginLeft: "auto", fontSize: 11, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase" }}>
              Clear all
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1560, margin: "0 auto", padding: "28px 28px 64px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(248px,1fr))", borderTop: "2px solid var(--color-text)", borderLeft: "2px solid var(--color-text)" }}>
          {list.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
        {list.length === 0 && (
          <div style={{ border: "2px solid var(--color-text)", padding: "44px 28px" }}>
            <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 24, marginBottom: 10 }}>Nothing matches that yet.</div>
            <div style={{ fontSize: 14, color: "var(--color-neutral-700)", marginBottom: 20, maxWidth: "52ch", textWrap: "pretty" }}>
              We source to order. Tell us the model and size on WhatsApp and we&apos;ll quote you within the hour.
            </div>
            <a href={waLink("Hello Gulf Grails, I am looking for a pair you do not have listed: ")} target="_blank" rel="noopener" className="btn btn-primary" style={{ height: 46, paddingInline: 20, fontSize: 12, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", justifyContent: "flex-start" }}>
              Request this pair
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
