"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { FAMILY_FILTERS, SIZE_FILTERS, SORTS, PRODUCTS, type SortKey } from "@/data/products";
import { filterProducts, DEFAULT_FILTERS, type ShopFilters } from "@/lib/filter";
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

/** How many filters are narrowing the list right now — drives the mobile badge. */
function activeCount(f: ShopFilters): number {
  return [f.fam !== "All", f.sizeF !== "All", Boolean(f.q)].filter(Boolean).length;
}

function chipStyle(on: boolean, square = false): React.CSSProperties {
  return {
    appearance: "none", cursor: "pointer", font: "inherit",
    fontSize: square ? 13 : 12, fontWeight: 700, letterSpacing: square ? undefined : "0.1em",
    textTransform: "uppercase", padding: square ? undefined : "10px 15px",
    minWidth: square ? 48 : undefined, height: square ? 44 : undefined,
    display: square ? "flex" : undefined, alignItems: square ? "center" : undefined,
    justifyContent: square ? "center" : undefined,
    border: "2px solid var(--color-text)",
    background: on ? "var(--color-accent)" : "transparent",
    color: on ? "#fff" : "var(--color-text)",
    borderColor: on ? "var(--color-accent)" : "var(--color-text)",
    transition: "background .14s var(--ease-out), color .14s var(--ease-out), border-color .14s var(--ease-out)",
    whiteSpace: "nowrap",
  };
}

/** The three filter groups, shared by the desktop bar and the mobile drawer. */
function FilterGroups({
  filters, update, layout,
}: {
  filters: ShopFilters;
  update: (patch: Partial<ShopFilters>) => void;
  layout: "bar" | "stack";
}) {
  const stack = layout === "stack";
  const row: React.CSSProperties = stack
    ? { display: "flex", flexDirection: "column", gap: 12, alignItems: "stretch" }
    : { display: "flex", alignItems: "flex-start", gap: 14, flexWrap: "wrap" };
  const label: React.CSSProperties = stack
    ? { fontSize: 11, fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--color-neutral-700)" }
    : { fontSize: 11, fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--color-neutral-700)", width: 60, flex: "none", paddingTop: 12 };

  return (
    <>
      <div style={row}>
        <span style={label}>Model</span>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", flex: 1 }}>
          {FAMILY_FILTERS.map((b) => (
            <button key={b} onClick={() => update({ fam: b })} aria-pressed={filters.fam === b} style={chipStyle(filters.fam === b)}>{b}</button>
          ))}
        </div>
      </div>
      <div style={row}>
        <span style={label}>Size EU</span>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", flex: 1 }}>
          {SIZE_FILTERS.map((z) => (
            <button key={String(z)} onClick={() => update({ sizeF: z })} aria-pressed={String(filters.sizeF) === String(z)} style={chipStyle(String(filters.sizeF) === String(z), true)}>{z}</button>
          ))}
        </div>
      </div>
      <div style={{ ...row, ...(stack ? {} : { alignItems: "center", paddingTop: 12, borderTop: "2px solid var(--color-divider)" }) }}>
        <span style={{ ...label, paddingTop: stack ? undefined : 0 }}>Sort</span>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {SORTS.map((z) => (
            <button
              key={z}
              onClick={() => update({ sort: z as SortKey })}
              aria-pressed={filters.sort === z}
              style={{ ...chipStyle(filters.sort === z), borderColor: filters.sort === z ? "var(--color-accent)" : "var(--color-divider)", padding: "9px 15px" }}
            >
              {z}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

export default function ShopClient({ initialFilters }: { initialFilters: ShopFilters }) {
  const router = useRouter();
  const [filters, setFilters] = useState<ShopFilters>(initialFilters);
  const [sheet, setSheet] = useState(false);

  const update = (patch: Partial<ShopFilters>) => {
    const next = { ...filters, ...patch };
    setFilters(next);
    router.replace(toHref(next), { scroll: false });
  };

  const clear = () => update({ ...DEFAULT_FILTERS });

  useEffect(() => {
    if (!sheet) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setSheet(false); };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [sheet]);

  const list = useMemo(() => filterProducts(filters), [filters]);
  const active = activeCount(filters);
  const shopKicker = filters.fam === "All" ? "Inventory · Jumeirah stockroom" : filters.fam;
  const resultLabel = list.length === 0
    ? "No match"
    : list.length === PRODUCTS.length
      ? "Everything in stock"
      : list.length === 1 ? "1 pair matches" : `${list.length} pairs match`;

  return (
    <div data-screen-label="Shop">
      <div className="gg-wrap" style={{ borderBottom: "2px solid var(--color-text)", padding: "clamp(26px,3.4vw,38px) var(--gutter) 26px" }}>
        <div className="gg-kicker" style={{ marginBottom: 14 }}>{shopKicker}</div>
        <h1 className="gg-display" style={{ fontSize: "clamp(30px,4vw,60px)" }}>{resultLabel}</h1>
        {filters.q && (
          <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <span className="gg-eyebrow" style={{ color: "var(--color-neutral-700)" }}>Searching for</span>
            <button
              onClick={() => update({ q: "" })}
              style={{ appearance: "none", display: "inline-flex", alignItems: "center", gap: 8, border: "2px solid var(--color-text)", background: "var(--color-text)", color: "var(--color-bg)", cursor: "pointer", font: "inherit", fontSize: 12, fontWeight: 800, letterSpacing: "0.08em", padding: "7px 12px" }}
            >
              “{filters.q}”
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="m6 6 12 12" /><path d="m18 6-12 12" /></svg>
            </button>
          </div>
        )}
      </div>

      {/* — desktop filter bar — */}
      <div className="gg-desktop" style={{ borderBottom: "2px solid var(--color-text)", background: "var(--color-neutral-100)" }}>
        <div className="gg-wrap" style={{ padding: "20px var(--gutter)", display: "flex", flexDirection: "column", gap: 14 }}>
          <FilterGroups filters={filters} update={update} layout="bar" />
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: -8 }}>
            <button onClick={clear} className="btn btn-ghost" style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase" }}>
              Clear all
            </button>
          </div>
        </div>
      </div>

      {/* — mobile filter bar: a summary that opens the drawer — */}
      <div className="gg-mobile" style={{ position: "sticky", top: 76, zIndex: 40, borderBottom: "2px solid var(--color-text)", background: "var(--color-neutral-100)" }}>
        <div className="gg-wrap" style={{ padding: "10px var(--gutter)", display: "flex", alignItems: "center", gap: 10 }}>
          <button
            onClick={() => setSheet(true)}
            style={{ appearance: "none", flex: 1, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, border: "2px solid var(--color-text)", background: "transparent", cursor: "pointer", font: "inherit", fontSize: 12, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", padding: "0 14px", height: 44, color: "inherit" }}
          >
            <span style={{ display: "inline-flex", alignItems: "center", gap: 9 }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                <path d="M3 6h18" /><path d="M7 12h10" /><path d="M11 18h2" />
              </svg>
              Filter &amp; sort
            </span>
            {active > 0 && (
              <span style={{ background: "var(--color-accent)", color: "#fff", minWidth: 20, height: 20, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 900, padding: "0 5px" }}>
                {active}
              </span>
            )}
          </button>
          <span className="gg-eyebrow" style={{ flex: "none", color: "var(--color-neutral-700)" }}>{list.length} pairs</span>
        </div>
      </div>

      {sheet && (
        <>
          <div className="gg-scrim" onClick={() => setSheet(false)} aria-hidden />
          <div className="gg-drawer" role="dialog" aria-modal="true" aria-label="Filter and sort">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px var(--gutter)", borderBottom: "2px solid var(--color-text)", flex: "none" }}>
              <span style={{ fontFamily: "var(--font-heading)", fontWeight: 900, fontSize: 20, letterSpacing: "-0.03em", textTransform: "uppercase" }}>Filter &amp; sort</span>
              <button onClick={() => setSheet(false)} aria-label="Close filters" style={{ appearance: "none", width: 40, height: 40, border: "2px solid var(--color-text)", background: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "inherit" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round"><path d="m6 6 12 12" /><path d="m18 6-12 12" /></svg>
              </button>
            </div>
            <div style={{ padding: "22px var(--gutter)", display: "flex", flexDirection: "column", gap: 26, flex: 1 }}>
              <FilterGroups filters={filters} update={update} layout="stack" />
            </div>
            <div style={{ padding: "14px var(--gutter) 22px", borderTop: "2px solid var(--color-text)", display: "flex", gap: 10, flex: "none", position: "sticky", bottom: 0, background: "var(--color-bg)" }}>
              <button onClick={clear} className="gg-btn gg-btn-outline" style={{ flex: "0 0 auto" }}>Clear</button>
              <button onClick={() => setSheet(false)} className="gg-btn" style={{ flex: 1, justifyContent: "center" }}>
                Show {list.length} {list.length === 1 ? "pair" : "pairs"}
              </button>
            </div>
          </div>
        </>
      )}

      <div className="gg-wrap" style={{ padding: "28px var(--gutter) clamp(44px,5vw,64px)" }}>
        {list.length > 0 && (
          <div className="gg-cardgrid">
            {list.map((p, i) => <ProductCard key={p.id} product={p} priority={i < 4} />)}
          </div>
        )}
        {list.length === 0 && (
          <div style={{ border: "2px solid var(--color-text)", padding: "clamp(30px,4vw,44px) clamp(20px,3vw,28px)" }}>
            <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "clamp(20px,2.4vw,24px)", marginBottom: 10 }}>Nothing matches that yet.</div>
            <div style={{ fontSize: 14, color: "var(--color-neutral-700)", marginBottom: 20, maxWidth: "52ch", textWrap: "pretty" }}>
              We source to order. Tell us the model and size on WhatsApp and we&apos;ll quote you within the hour.
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <a href={waLink("Hello Gulf Grails, I am looking for a pair you do not have listed: ")} target="_blank" rel="noopener" className="gg-btn">
                Request this pair
              </a>
              <button onClick={clear} className="gg-btn gg-btn-outline">Clear the filters</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
