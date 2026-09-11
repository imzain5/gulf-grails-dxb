"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { coverPhoto, type Product } from "@/data/products";
import Frame from "./Frame";
import SearchOverlay from "./SearchOverlay";
import ThemeToggle from "./ThemeToggle";
import { Label, Price } from "./primitives";
import s from "./chrome.module.css";

/**
 * The house header.
 *
 * Translucent over the page rather than a bar above it, and it grows a hairline
 * only once the page has moved — so a hero opens with nothing drawn across it.
 *
 * The mega-menu is the piece that does real work: three columns and one
 * photograph turn a thirty-pair catalogue into something that reads as deep.
 * It opens on hover on a pointer device and on click everywhere else, because
 * hover does not exist on the phone most of this shop's traffic arrives on.
 *
 * Takes the catalogue as a prop rather than reading a context, so it can be
 * rendered from the styleguide and from a layout that has no store provider.
 */

const ICON = {
  search: (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
    </svg>
  ),
  account: (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <circle cx="12" cy="8.5" r="3.75" /><path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
    </svg>
  ),
  bag: (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 7h12l1 13H5z" /><path d="M9 10V7a3 3 0 0 1 6 0v3" />
    </svg>
  ),
  menu: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M4 8h16M4 16h16" />
    </svg>
  ),
  close: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  ),
};

const CATEGORIES = [
  { label: "The Vault", href: "/vault" },
  { label: "New arrivals", href: "/shop?sort=Newest" },
  { label: "Under AED 2,000", href: "/shop?sort=Price+low" },
  { label: "Restocking", href: "/shop?q=restock" },
];

export default function Header({
  products,
  bagCount = 0,
}: {
  products: Product[];
  bagCount?: number;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [mega, setMega] = useState<null | "houses" | "vault">(null);
  const [search, setSearch] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const houses = useMemo(() => {
    const counted = new Map<string, number>();
    for (const p of products) if (p.fam) counted.set(p.fam, (counted.get(p.fam) ?? 0) + 1);
    return [...counted.entries()].sort((a, b) => b[1] - a[1]).slice(0, 7);
  }, [products]);

  // The most expensive pair we hold, as the menu's one photograph.
  const feature = useMemo(
    () => [...products].sort((a, b) => b.price - a.price)[0],
    [products],
  );

  useEffect(() => {
    const onScroll = () => setScrolled((window.scrollY || 0) > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!drawer) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setDrawer(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [drawer]);

  // A small grace period on leaving, so crossing the gap to the panel doesn't
  // close it out from under the pointer.
  const openMega = (which: "houses" | "vault") => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setMega(which);
  };
  const closeMega = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setMega(null), 120);
  };

  return (
    <>
      <header
        className={s.header}
        data-scrolled={scrolled ? "" : undefined}
        onMouseLeave={closeMega}
      >
        <div className={s.utility}>
          {/* No locale or currency buttons: see the note in Footer.tsx. */}
          <span className={s.utilityBtn}>AED</span>
          <ThemeToggle className={s.utilityBtn} compact />
        </div>

        <div className={s.bar}>
          <div className={s.left}>
            <button
              type="button"
              className={`${s.iconBtn} ${s.mobileOnly}`}
              onClick={() => setDrawer(true)}
              aria-label="Open menu"
              aria-expanded={drawer}
            >
              {ICON.menu}
            </button>

            <button
              type="button"
              className={`${s.navLink} ${s.deskOnly}`}
              data-open={mega === "houses" ? "" : undefined}
              onMouseEnter={() => openMega("houses")}
              onFocus={() => openMega("houses")}
              onClick={() => setMega((m) => (m === "houses" ? null : "houses"))}
              aria-expanded={mega === "houses"}
            >
              Houses
            </button>
            <Link href="/vault" className={`${s.navLink} ${s.deskOnly}`}>The Vault</Link>
            <Link href="/shop" className={`${s.navLink} ${s.deskOnly}`}>Inventory</Link>
          </div>

          <Link href="/" className={s.wordmark}>Gulf Grails</Link>

          <div className={s.right}>
            <Link href="/sell" className={`${s.navLink} ${s.deskOnly}`}>Sell</Link>
            <button type="button" className={s.iconBtn} onClick={() => setSearch(true)} aria-label="Search">
              {ICON.search}
            </button>
            <Link href="/wishlist" className={`${s.iconBtn} ${s.deskOnly}`} aria-label="Saved">
              {ICON.account}
            </Link>
            <Link href="/cart" className={s.iconBtn} aria-label={`Bag, ${bagCount} items`}>
              {ICON.bag}
              {bagCount > 0 && <span className={s.bagCount}>{bagCount}</span>}
            </Link>
          </div>
        </div>

        {mega === "houses" && (
          <div className={s.mega} onMouseEnter={() => openMega("houses")}>
            <div className={s.megaIn}>
              <div className={s.megaCol}>
                <Label>By house</Label>
                {houses.map(([fam, n]) => (
                  <Link key={fam} href={`/shop?fam=${encodeURIComponent(fam)}`} className={s.megaLink} onClick={() => setMega(null)}>
                    {fam}<span className={s.megaCount}>{n}</span>
                  </Link>
                ))}
              </div>

              <div className={s.megaCol}>
                <Label>By category</Label>
                {CATEGORIES.map((c) => (
                  <Link key={c.href} href={c.href} className={s.megaLink} onClick={() => setMega(null)}>
                    {c.label}
                  </Link>
                ))}
              </div>

              {feature && (
                <Link href={`/product/${feature.id}`} className={s.megaFeature} onClick={() => setMega(null)}>
                  <Frame
                    src={coverPhoto(feature)}
                    alt={feature.name}
                    ratio="4:3"
                    sizes="(max-width: 900px) 0px, 34vw"
                    zoom
                  />
                  <Label tone="brass">Currently the highest held</Label>
                  <span className={s.megaLink} style={{ color: "var(--text-hi)" }}>{feature.name}</span>
                  <Price amount={feature.price} size="sm" />
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      {search && <SearchOverlay products={products} onClose={() => setSearch(false)} />}

      {drawer && (
        <>
          <div className={s.scrim} onClick={() => setDrawer(false)} aria-hidden />
          <div className={s.drawer} role="dialog" aria-modal aria-label="Menu">
            <div className={s.drawerTop}>
              <span className={s.wordmark}>Gulf Grails</span>
              <button type="button" className={s.iconBtn} onClick={() => setDrawer(false)} aria-label="Close menu">
                {ICON.close}
              </button>
            </div>

            <div className={s.drawerBody}>
              <div className={s.drawerGroup}>
                <Label>By house</Label>
                {houses.map(([fam, n]) => (
                  <Link key={fam} href={`/shop?fam=${encodeURIComponent(fam)}`} className={s.drawerLink} onClick={() => setDrawer(false)}>
                    {fam}<span className={s.megaCount}>{n}</span>
                  </Link>
                ))}
              </div>
              <div className={s.drawerGroup}>
                <Label>The house</Label>
                {[...CATEGORIES, { label: "Sell to us", href: "/sell" }, { label: "Authentication", href: "/trust" }].map((c) => (
                  <Link key={c.href} href={c.href} className={s.drawerLink} onClick={() => setDrawer(false)}>
                    {c.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className={s.drawerFoot}>
              <span className={s.utilityBtn}>AED</span>
              <ThemeToggle className={s.utilityBtn} compact />
            </div>
          </div>
        </>
      )}
    </>
  );
}
