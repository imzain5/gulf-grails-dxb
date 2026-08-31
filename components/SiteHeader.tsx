"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MENUS, TRUST_BAR, type MenuTarget } from "@/data/content";
import { findProduct } from "@/data/products";
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

export default function SiteHeader() {
  const router = useRouter();
  const { wish, cartCount } = useStore();
  const [menu, setMenu] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const flag = findProduct("air-dior");
  const activeMenu = MENUS.find((m) => m.key === menu) ?? null;

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const p = new URLSearchParams();
    if (q.trim()) p.set("q", q.trim());
    router.push(p.toString() ? `/shop?${p}` : "/shop");
  };

  return (
    <div onMouseLeave={() => setMenu(null)} style={{ position: "sticky", top: 0, zIndex: 70, background: "var(--color-bg)" }}>
      <header style={{ borderBottom: "2px solid var(--color-text)" }}>
        <div style={{ maxWidth: 1560, margin: "0 auto", padding: "0 28px", height: 76, display: "flex", alignItems: "center", gap: "clamp(10px,1.4vw,34px)" }}>
          <Link href="/" onClick={() => setMenu(null)} style={{ cursor: "pointer", display: "flex", alignItems: "baseline", gap: 9, flex: "none", color: "inherit" }}>
            <span style={{ fontFamily: "var(--font-heading)", fontWeight: 900, fontSize: 22, letterSpacing: "-0.035em", textTransform: "uppercase" }}>Gulf Grails</span>
            <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.22em", color: "var(--color-accent)" }}>DXB</span>
          </Link>

          <nav className="gg-nowrap-scroll" style={{ display: "flex", gap: 2, alignItems: "center", height: "100%", flex: "none", overflowX: "auto" }}>
            {MENUS.map((m) => (
              <button
                key={m.key}
                onMouseEnter={() => setMenu(m.key)}
                onClick={() => { setMenu(null); router.push("/shop"); }}
                style={{
                  appearance: "none", background: menu === m.key ? "var(--color-text)" : "transparent",
                  border: 0, padding: "0 clamp(6px,.9vw,14px)", height: 76, font: "inherit", fontSize: 12,
                  fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", whiteSpace: "nowrap",
                  cursor: "pointer", color: menu === m.key ? "var(--color-bg)" : "var(--color-text)",
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
                height: 76, display: "flex", alignItems: "center", font: "inherit", fontSize: 12, fontWeight: 700,
                letterSpacing: "0.12em", textTransform: "uppercase", whiteSpace: "nowrap", cursor: "pointer", color: "inherit",
              }}
            >
              Sell
            </Link>
          </nav>

          <div style={{ flex: "1 1 auto", minWidth: 0, display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 10 }}>
            <form onSubmit={submitSearch} style={{
              display: "flex", alignItems: "center", gap: 8, border: "2px solid var(--color-divider)",
              padding: "0 12px", height: 42, flex: "1 1 auto", minWidth: 0, maxWidth: 250,
            }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
              </svg>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search the stockroom"
                style={{ appearance: "none", border: 0, background: "none", outline: "none", font: "inherit", fontSize: 13, width: "100%", color: "inherit" }}
              />
            </form>
            <Link
              href="/wishlist"
              aria-label="Wishlist"
              style={{
                appearance: "none", flex: "none", width: 42, height: 42, display: "flex", alignItems: "center",
                justifyContent: "center", border: "2px solid var(--color-divider)", background: "none", cursor: "pointer",
                color: wish.length ? "var(--color-accent)" : "var(--color-text)", padding: 0, position: "relative",
              }}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill={wish.length ? "var(--color-accent)" : "none"} stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <path d="M12 20.5 4.6 13a4.7 4.7 0 0 1 6.6-6.7l.8.8.8-.8A4.7 4.7 0 0 1 19.4 13z" />
              </svg>
            </Link>
            <Link href="/cart" className="btn btn-primary" style={{ flex: "none", height: 42, justifyContent: "flex-start", gap: 9, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", fontSize: 11 }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2 4 6v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6l-2-4z" /><path d="M4 6h16" /><path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              Bag ({cartCount()})
            </Link>
          </div>
        </div>
      </header>

      {activeMenu && (
        <div style={{
          position: "absolute", left: 0, right: 0, top: 76, background: "var(--color-bg)",
          borderBottom: "2px solid var(--color-text)", boxShadow: "var(--shadow-lg)", animation: "gg-fade .14s ease",
        }}>
          <div style={{ maxWidth: 1560, margin: "0 auto", padding: "32px 28px 36px", display: "grid", gridTemplateColumns: "repeat(4,1fr) 1.1fr", gap: 34 }}>
            {activeMenu.cols.map((col, ci) => (
              <div key={col.title + ci}>
                <div style={{
                  fontSize: 10, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase",
                  color: "var(--color-accent)", paddingBottom: 12, borderBottom: "2px solid var(--color-text)", marginBottom: 14,
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
                style={{ background: "#fff", border: "2px solid var(--color-text)", aspectRatio: "4/3", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", cursor: "pointer", position: "relative" }}
              >
                <Image src="/assets/air-dior-pair.webp" alt={flag.name} fill style={{ objectFit: "contain" }} sizes="260px" />
              </Link>
              <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 16, marginTop: 12, lineHeight: 1.2 }}>{flag.name}</div>
              <div style={{ fontWeight: 900, fontSize: 15, marginTop: 6 }}>{money(flag.price)}</div>
            </div>
          </div>
        </div>
      )}

      <div style={{ borderBottom: "2px solid var(--color-text)", background: "var(--color-neutral-100)" }}>
        <div style={{ maxWidth: 1560, margin: "0 auto", padding: "9px 28px", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20 }}>
          {[[CHECK_ICON, TRUST_BAR[0]], [TRUCK_ICON, TRUST_BAR[1]], [CASH_ICON, TRUST_BAR[2]], [CHAT_ICON, TRUST_BAR[3]]].map(([icon, label], i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              {icon}{label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
