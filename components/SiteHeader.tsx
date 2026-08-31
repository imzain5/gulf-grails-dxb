"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { MENUS, TRUST_BAR, type MenuTarget } from "@/data/content";
import { PRODUCTS, findProduct, type Product } from "@/data/products";
import { money } from "@/lib/money";
import { useStore } from "@/context/StoreContext";

function targetToShopHref(target: MenuTarget): string {
  const p = new URLSearchParams();
  if (target.kind === "fam") { p.set("fam", target.fam); }
  else if (target.kind === "q") { p.set("q", target.q); p.set("fam", "All"); }
  else if (target.kind === "sort") { p.set("sort", target.sort); p.set("fam", "All"); }
  else if (target.kind === "size") { p.set("size", String(target.size)); }
  const qs = p.toString();
  return qs ? `/shop?${qs}` : "/shop";
}

/** Best six matches on name, brand, family, colourway or style code. */
function search(term: string): Product[] {
  const needle = term.trim().toLowerCase();
  if (needle.length < 2) return [];
  return PRODUCTS
    .map((p) => {
      const name = p.name.toLowerCase();
      const hay = `${p.name} ${p.brand} ${p.fam} ${p.colorway} ${p.sku}`.toLowerCase();
      if (!hay.includes(needle)) return null;
      // A hit at the start of the model name beats one buried in the colourway.
      const rank = name.startsWith(needle) ? 0 : name.includes(needle) ? 1 : 2;
      return { p, rank };
    })
    .filter((x): x is { p: Product; rank: number } => x !== null)
    .sort((a, b) => a.rank - b.rank)
    .slice(0, 6)
    .map((x) => x.p);
}

const CHECK_ICON = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2 4 5v6c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5z" /><path d="m9 12 2 2 4-4" />
  </svg>
);
const TRUCK_ICON = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 17h4V5H2v12h3" /><path d="M15 8h4l3 4v5h-3" /><circle cx="7.5" cy="17.5" r="2.5" /><circle cx="17.5" cy="17.5" r="2.5" />
  </svg>
);
const CASH_ICON = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="5" width="20" height="14" /><path d="M2 10h20" />
  </svg>
);
const CHAT_ICON = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const TRUST_ICONS = [CHECK_ICON, TRUCK_ICON, CASH_ICON, CHAT_ICON];

/** Count badge on the wishlist and bag controls. */
function Badge({ n, tone = "accent" }: { n: number; tone?: "accent" | "ink" }) {
  if (n <= 0) return null;
  return (
    <span
      aria-hidden
      style={{
        position: "absolute", top: -7, right: -7, minWidth: 18, height: 18, padding: "0 4px",
        display: "flex", alignItems: "center", justifyContent: "center",
        background: tone === "accent" ? "var(--color-accent)" : "var(--color-text)",
        color: "#fff", fontSize: 10, fontWeight: 900, letterSpacing: "0.02em",
        border: "2px solid var(--color-bg)",
      }}
    >
      {n > 9 ? "9+" : n}
    </span>
  );
}

export default function SiteHeader() {
  const router = useRouter();
  const { wish, cartCount } = useStore();
  const [menu, setMenu] = useState<string | null>(null);
  const [drawer, setDrawer] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [focused, setFocused] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const flag = findProduct("air-dior");
  const activeMenu = MENUS.find((m) => m.key === menu) ?? null;
  const bag = cartCount();

  const suggestions = useMemo(() => search(q), [q]);
  const showSuggestions = focused && suggestions.length > 0;

  useEffect(() => {
    const onScroll = () => setScrolled((window.scrollY || 0) > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // The drawer owns the viewport while it's open.
  useEffect(() => {
    if (!drawer) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [drawer]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setDrawer(false);
      setMenu(null);
      setFocused(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const go = useCallback((href: string) => {
    setDrawer(false);
    setMenu(null);
    setFocused(false);
    setQ("");
    router.push(href);
  }, [router]);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const p = new URLSearchParams();
    if (q.trim()) p.set("q", q.trim());
    go(p.toString() ? `/shop?${p}` : "/shop");
  };

  const iconBtn: React.CSSProperties = {
    appearance: "none", flex: "none", width: 40, height: 40, display: "flex", alignItems: "center",
    justifyContent: "center", border: "1px solid var(--gg-hair-strong)", background: "none",
    cursor: "pointer", padding: 0, position: "relative", color: "var(--color-text)",
  };

  return (
    <>
    <div
      onMouseLeave={() => setMenu(null)}
      style={{
        position: "sticky", top: 0, zIndex: 70, background: "var(--color-bg)",
        boxShadow: scrolled ? "0 6px 22px color-mix(in srgb, #2d2b2b 13%, transparent)" : "none",
        transition: "box-shadow .25s var(--ease-out)",
      }}
    >
      <header style={{ borderBottom: "1px solid var(--gg-hair)" }}>
        <div className="gg-wrap" style={{ height: 68, display: "flex", alignItems: "center", gap: "clamp(10px,1.4vw,34px)" }}>
          {/* Drawer trigger — phones and tablets only. */}
          <button
            className="gg-mobile"
            onClick={() => setDrawer(true)}
            aria-label="Open menu"
            aria-expanded={drawer}
            style={{ ...iconBtn, width: 40, height: 40, border: 0, marginLeft: -6 }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
              <path d="M3 6h18" /><path d="M3 12h18" /><path d="M3 18h18" />
            </svg>
          </button>

          <Link href="/" onClick={() => setMenu(null)} style={{ cursor: "pointer", display: "flex", alignItems: "baseline", gap: 9, flex: "none", color: "inherit" }}>
            <span style={{ fontFamily: "var(--font-heading)", fontWeight: 900, fontSize: "clamp(18px,2.2vw,22px)", letterSpacing: "-0.035em", textTransform: "uppercase" }}>Gulf Grails</span>
            <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.22em", color: "var(--color-accent)" }}>DXB</span>
          </Link>

          <nav className="gg-desktop gg-nowrap-scroll" style={{ display: "flex", gap: 2, alignItems: "center", height: "100%", flex: "none", overflowX: "auto" }}>
            {MENUS.map((m) => (
              <button
                key={m.key}
                onMouseEnter={() => setMenu(m.key)}
                onFocus={() => setMenu(m.key)}
                onClick={() => go(targetToShopHref(m.cols[0].items[0].target))}
                aria-expanded={menu === m.key}
                style={{
                  appearance: "none", background: menu === m.key ? "var(--color-text)" : "transparent",
                  border: 0, padding: "0 clamp(6px,.9vw,14px)", height: 68, font: "inherit", fontSize: 11,
                  fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", whiteSpace: "nowrap",
                  cursor: "pointer", color: menu === m.key ? "var(--color-bg)" : "var(--color-text)",
                  transition: "background .16s var(--ease-out), color .16s var(--ease-out)",
                }}
              >
                {m.label}
              </button>
            ))}
            <Link
              href="/sell"
              onMouseEnter={() => setMenu(null)}
              className="gg-hover-accent"
              style={{
                appearance: "none", background: "none", border: 0, padding: "0 clamp(6px,.9vw,14px)",
                height: 68, display: "flex", alignItems: "center", font: "inherit", fontSize: 11, fontWeight: 700,
                letterSpacing: "0.18em", textTransform: "uppercase", whiteSpace: "nowrap", cursor: "pointer", color: "inherit",
              }}
            >
              Sell
            </Link>
          </nav>

          <div style={{ flex: "1 1 auto", minWidth: 0, display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 10 }}>
            <div className="gg-desktop" style={{ position: "relative", flex: "1 1 auto", minWidth: 0, maxWidth: 280 }}>
              <form
                onSubmit={submitSearch}
                role="search"
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  border: `1px solid ${focused ? "var(--color-text)" : "var(--gg-hair-strong)"}`,
                  padding: "0 12px", height: 40, transition: "border-color .22s var(--ease-out)",
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                  <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
                </svg>
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => window.setTimeout(() => setFocused(false), 140)}
                  placeholder="Search the stockroom"
                  aria-label="Search the stockroom"
                  style={{ appearance: "none", border: 0, background: "none", outline: "none", font: "inherit", fontSize: 13, width: "100%", color: "inherit" }}
                />
                {q && (
                  <button type="button" onClick={() => setQ("")} aria-label="Clear search" style={{ appearance: "none", border: 0, background: "none", cursor: "pointer", padding: 0, color: "var(--color-neutral-600)", display: "flex" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round"><path d="m6 6 12 12" /><path d="m18 6-12 12" /></svg>
                  </button>
                )}
              </form>

              {showSuggestions && (
                <div style={{
                  position: "absolute", top: "calc(100% + 2px)", right: 0, width: "min(400px, 92vw)",
                  background: "var(--color-bg)",
                  border: "2px solid var(--color-text)", boxShadow: "var(--shadow-lg)", zIndex: 20,
                  animation: "gg-fade .12s ease", maxHeight: "70vh", overflowY: "auto",
                }}>
                  {suggestions.map((p) => (
                    <button
                      key={p.id}
                      onMouseDown={(e) => { e.preventDefault(); go(`/product/${p.id}`); }}
                      style={{
                        appearance: "none", width: "100%", border: 0, borderBottom: "1px solid var(--color-divider)",
                        background: "transparent", cursor: "pointer", font: "inherit", textAlign: "left",
                        display: "flex", alignItems: "center", gap: 12, padding: "9px 11px",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-neutral-100)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <span className="gg-plate gg-plate-flat" style={{ position: "relative", width: 44, height: 44, flex: "none", border: "1px solid var(--color-divider)" }}>
                        {p.photos && <Image src={p.photos[0]} alt="" fill sizes="44px" style={{ objectFit: "contain", padding: 3 }} />}
                      </span>
                      <span style={{ minWidth: 0, flex: 1 }}>
                        <span style={{ display: "block", fontSize: 9, fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--color-neutral-600)" }}>{p.brand}</span>
                        <span style={{ display: "block", fontSize: 13, fontWeight: 700, lineHeight: 1.25, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</span>
                      </span>
                      <span style={{ fontWeight: 900, fontSize: 12, flex: "none" }}>{money(p.price)}</span>
                    </button>
                  ))}
                  <button
                    onMouseDown={(e) => { e.preventDefault(); submitSearch(e as unknown as React.FormEvent); }}
                    style={{
                      appearance: "none", width: "100%", border: 0, background: "var(--color-text)", color: "var(--color-bg)",
                      cursor: "pointer", font: "inherit", fontSize: 11, fontWeight: 800, letterSpacing: "0.14em",
                      textTransform: "uppercase", padding: "11px 12px", textAlign: "left",
                    }}
                  >
                    See every match for “{q.trim()}” →
                  </button>
                </div>
              )}
            </div>

            {/* Search shortcut on small screens, where the field itself doesn't fit. */}
            <Link href="/shop" aria-label="Search" className="gg-mobile" style={iconBtn}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
              </svg>
            </Link>

            <Link
              href="/wishlist"
              aria-label={wish.length ? `Wishlist, ${wish.length} saved` : "Wishlist"}
              style={{ ...iconBtn, color: wish.length ? "var(--color-accent)" : "var(--color-text)" }}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill={wish.length ? "var(--color-accent)" : "none"} stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <path d="M12 20.5 4.6 13a4.7 4.7 0 0 1 6.6-6.7l.8.8.8-.8A4.7 4.7 0 0 1 19.4 13z" />
              </svg>
              <Badge n={wish.length} tone="ink" />
            </Link>

            <Link
              href="/cart"
              aria-label={`Bag, ${bag} item${bag === 1 ? "" : "s"}`}
              className="gg-bag"
              style={{ flex: "none", height: 40, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 9, paddingInline: 16, fontFamily: "var(--font-heading)", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", fontSize: 10, position: "relative" }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2 4 6v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6l-2-4z" /><path d="M4 6h16" /><path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              <span className="gg-desktop">Bag ({bag})</span>
              <span className="gg-mobile"><Badge n={bag} tone="ink" /></span>
            </Link>
          </div>
        </div>
      </header>

      {/* — desktop mega menu — */}
      {activeMenu && (
        <div className="gg-desktop" style={{
          position: "absolute", left: 0, right: 0, top: 68, background: "var(--color-bg)",
          borderBottom: "1px solid var(--gg-hair)", boxShadow: "var(--shadow-lg)", animation: "gg-fade .14s ease",
        }}>
          <div className="gg-wrap" style={{ padding: "32px var(--gutter) 36px", display: "grid", gridTemplateColumns: "repeat(4,1fr) 1.1fr", gap: 34 }}>
            {activeMenu.cols.map((col, ci) => (
              <div key={col.title + ci}>
                <div style={{
                  fontSize: 10, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase",
                  color: "var(--color-accent)", paddingBottom: 12, borderBottom: "1px solid var(--gg-hair-strong)", marginBottom: 14,
                }}>
                  {col.title}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-start" }}>
                  {col.items.map((it, ii) => (
                    <Link
                      key={it.label + ii}
                      href={targetToShopHref(it.target)}
                      onClick={() => setMenu(null)}
                      className="gg-hover-accent"
                      style={{ appearance: "none", background: "none", border: 0, padding: 0, font: "inherit", fontSize: 14, fontWeight: 600, cursor: "pointer", color: "inherit", textAlign: "left" }}
                    >
                      {it.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
            <div style={{ borderLeft: "2px solid var(--color-divider)", paddingLeft: 28 }}>
              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--color-accent)", marginBottom: 14 }}>
                Grail of the week
              </div>
              <Link
                href={`/product/${flag.id}`}
                onClick={() => setMenu(null)}
                className="gg-plate"
                style={{ border: "2px solid var(--color-text)", aspectRatio: "4/3", display: "block", cursor: "pointer", position: "relative" }}
              >
                <Image src="/assets/air-dior-pair.webp" alt={flag.name} fill style={{ objectFit: "contain", padding: 14 }} sizes="260px" />
              </Link>
              <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 16, marginTop: 12, lineHeight: 1.2 }}>{flag.name}</div>
              <div style={{ fontWeight: 900, fontSize: 15, marginTop: 6 }}>{money(flag.price)}</div>
            </div>
          </div>
        </div>
      )}
    </div>

    {/* — mobile drawer — */}
    {drawer && (
      <>
        <div className="gg-scrim" onClick={() => setDrawer(false)} aria-hidden />
        <nav className="gg-drawer" aria-label="Main menu">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px var(--gutter)", borderBottom: "2px solid var(--color-text)", flex: "none" }}>
            <span style={{ fontFamily: "var(--font-heading)", fontWeight: 900, fontSize: 20, letterSpacing: "-0.035em", textTransform: "uppercase" }}>Menu</span>
            <button onClick={() => setDrawer(false)} aria-label="Close menu" style={{ appearance: "none", width: 40, height: 40, border: "2px solid var(--color-text)", background: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "inherit" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round"><path d="m6 6 12 12" /><path d="m18 6-12 12" /></svg>
            </button>
          </div>

          <form
            onSubmit={submitSearch}
            role="search"
            style={{ display: "flex", alignItems: "center", gap: 8, border: "2px solid var(--color-text)", padding: "0 12px", height: 46, margin: "18px var(--gutter) 6px", flex: "none" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search the stockroom"
              aria-label="Search the stockroom"
              style={{ appearance: "none", border: 0, background: "none", outline: "none", font: "inherit", fontSize: 14, width: "100%", color: "inherit" }}
            />
          </form>

          {suggestions.length > 0 && (
            <div style={{ margin: "6px var(--gutter) 0", borderTop: "2px solid var(--color-divider)" }}>
              {suggestions.slice(0, 4).map((p) => (
                <button
                  key={p.id}
                  onClick={() => go(`/product/${p.id}`)}
                  style={{ appearance: "none", width: "100%", border: 0, borderBottom: "1px solid var(--color-divider)", background: "transparent", cursor: "pointer", font: "inherit", textAlign: "left", display: "flex", alignItems: "center", gap: 12, padding: "9px 0" }}
                >
                  <span className="gg-plate gg-plate-flat" style={{ position: "relative", width: 42, height: 42, flex: "none", border: "1px solid var(--color-divider)" }}>
                    {p.photos && <Image src={p.photos[0]} alt="" fill sizes="42px" style={{ objectFit: "contain", padding: 3 }} />}
                  </span>
                  <span style={{ minWidth: 0, flex: 1, fontSize: 13, fontWeight: 700, lineHeight: 1.25 }}>{p.name}</span>
                  <span style={{ fontWeight: 900, fontSize: 12 }}>{money(p.price)}</span>
                </button>
              ))}
            </div>
          )}

          <div style={{ padding: "12px 0 24px", flex: 1 }}>
            {MENUS.map((m) => {
              const open = openGroup === m.key;
              return (
                <div key={m.key} style={{ borderBottom: "2px solid var(--color-divider)", margin: "0 var(--gutter)" }}>
                  <button
                    onClick={() => setOpenGroup(open ? null : m.key)}
                    aria-expanded={open}
                    style={{
                      appearance: "none", width: "100%", border: 0, background: "none", cursor: "pointer",
                      font: "inherit", display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "16px 0", fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 19,
                      letterSpacing: "-0.02em", textTransform: "uppercase", color: open ? "var(--color-accent)" : "inherit",
                    }}
                  >
                    {m.label}
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" style={{ transform: open ? "rotate(45deg)" : "none", transition: "transform .2s var(--ease-out)" }}>
                      <path d="M12 5v14" /><path d="M5 12h14" />
                    </svg>
                  </button>
                  {open && (
                    <div style={{ paddingBottom: 18, display: "flex", flexDirection: "column", gap: 2, animation: "gg-fade .16s ease" }}>
                      {m.cols.flatMap((col) => col.items).map((it, ii) => (
                        <button
                          key={it.label + ii}
                          onClick={() => go(targetToShopHref(it.target))}
                          style={{ appearance: "none", border: 0, background: "none", cursor: "pointer", font: "inherit", fontSize: 15, fontWeight: 600, padding: "8px 0", textAlign: "left", color: "inherit" }}
                        >
                          {it.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            <div style={{ margin: "0 var(--gutter)", display: "flex", flexDirection: "column" }}>
              {[["Sell to us", "/sell"], ["Authenticity", "/trust"], ["About", "/about"], ["Saved pairs", "/wishlist"]].map(([label, href]) => (
                <button
                  key={href}
                  onClick={() => go(href)}
                  style={{
                    appearance: "none", border: 0, borderBottom: "2px solid var(--color-divider)", background: "none",
                    cursor: "pointer", font: "inherit", fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 19,
                    letterSpacing: "-0.02em", textTransform: "uppercase", padding: "16px 0", textAlign: "left", color: "inherit",
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            <div style={{ margin: "26px var(--gutter) 0", display: "flex", flexDirection: "column", gap: 10 }}>
              {TRUST_BAR.map((t, i) => (
                <span key={t} style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  {TRUST_ICONS[i]}{t}
                </span>
              ))}
            </div>
          </div>
        </nav>
      </>
    )}
    </>
  );
}
