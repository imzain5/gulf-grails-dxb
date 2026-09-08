"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { coverPhoto, type Product } from "@/data/products";
import Frame from "./Frame";
import { Label, Price } from "./primitives";
import s from "./chrome.module.css";

/**
 * Full-screen search.
 *
 * Results are computed from the catalogue already in memory, so there is no
 * request and no spinner — the brief's 150ms budget is met by not going to the
 * network at all. Thirty-odd products is nothing to scan per keystroke; if the
 * catalogue ever reaches thousands this is where an index goes.
 *
 * Grouped by lot and by house, because "show me everything Travis Scott" is a
 * different intent from "show me the Mocha high", and a flat list answers only
 * the second.
 *
 * Keyboard is a first-class path: type to filter, arrows to move, Enter to
 * open, Escape to leave. Focus is trapped while it is open and returned to
 * whatever opened it.
 */

interface Group {
  label: string;
  items: { key: string; href: string; name: string; meta: string; product?: Product }[];
}

export default function SearchOverlay({
  products,
  onClose,
}: {
  products: Product[];
  onClose: () => void;
}) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const field = useRef<HTMLInputElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  const groups = useMemo<Group[]>(() => {
    const needle = q.trim().toLowerCase();
    if (needle.length < 2) return [];

    const lots = products
      .map((p) => {
        const name = p.name.toLowerCase();
        const hay = `${p.name} ${p.brand} ${p.fam} ${p.colorway} ${p.sku}`.toLowerCase();
        if (!hay.includes(needle)) return null;
        return { p, rank: name.startsWith(needle) ? 0 : name.includes(needle) ? 1 : 2 };
      })
      .filter((x): x is { p: Product; rank: number } => x !== null)
      .sort((a, b) => a.rank - b.rank)
      .slice(0, 7)
      .map(({ p }) => ({
        key: p.id,
        href: `/product/${p.id}`,
        name: p.name,
        meta: p.colorway,
        product: p,
      }));

    // Houses and model groups the term matches, as filtered shop links.
    const families = [...new Set(products.map((p) => p.fam).filter(Boolean))]
      .filter((f) => f.toLowerCase().includes(needle))
      .slice(0, 4)
      .map((f) => ({
        key: `fam-${f}`,
        href: `/shop?fam=${encodeURIComponent(f)}`,
        name: f,
        meta: `${products.filter((p) => p.fam === f).length} held`,
      }));

    const brands = [...new Set(products.map((p) => p.brand).filter(Boolean))]
      .filter((b) => b.toLowerCase().includes(needle) && !families.some((f) => f.name === b))
      .slice(0, 4)
      .map((b) => ({
        key: `brand-${b}`,
        href: `/shop?q=${encodeURIComponent(b)}`,
        name: b,
        meta: `${products.filter((p) => p.brand === b).length} held`,
      }));

    const out: Group[] = [];
    if (lots.length) out.push({ label: "Lots", items: lots });
    const houses = [...families, ...brands];
    if (houses.length) out.push({ label: "Houses", items: houses });
    return out;
  }, [products, q]);

  const flat = useMemo(() => groups.flatMap((g) => g.items), [groups]);

  // Focus the field, lock the page, and hand focus back on the way out.
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    field.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
      opener?.focus?.();
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { onClose(); return; }

      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        if (flat.length === 0) return;
        e.preventDefault();
        setActive((i) => (e.key === "ArrowDown" ? (i + 1) % flat.length : (i - 1 + flat.length) % flat.length));
        return;
      }

      if (e.key === "Enter" && flat[active]) {
        e.preventDefault();
        onClose();
        router.push(flat[active].href);
        return;
      }

      // Keep focus inside the overlay while it owns the viewport.
      if (e.key === "Tab" && panel.current) {
        const focusable = panel.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])',
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, flat, onClose, router]);

  let index = -1;

  return (
    <div className={s.overlay} ref={panel} role="dialog" aria-modal aria-label="Search the house">
      <div className={s.searchTop}>
        <input
          ref={field}
          className={s.searchField}
          type="search"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            // A new query means a new result list; the highlight goes home.
            setActive(0);
          }}
          placeholder="Search the house"
          aria-label="Search"
          autoComplete="off"
          spellCheck={false}
        />
        <button type="button" className={s.iconBtn} onClick={onClose} aria-label="Close search">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>

      <div className={s.results}>
        {q.trim().length < 2 ? (
          <p className={s.empty}>Model, house, colourway or style code.</p>
        ) : flat.length === 0 ? (
          <p className={s.empty}>Nothing under that name. We source to order — message us on WhatsApp.</p>
        ) : (
          groups.map((g) => (
            <section key={g.label} className={s.resultGroup}>
              <Label>{g.label}</Label>
              {g.items.map((item) => {
                index += 1;
                const isActive = index === active;
                return (
                  <Link
                    key={item.key}
                    href={item.href}
                    className={s.resultRow}
                    data-active={isActive ? "" : undefined}
                    onClick={onClose}
                  >
                    {item.product && (
                      <span className={s.resultThumb}>
                        <Frame
                          src={coverPhoto(item.product)}
                          alt=""
                          ratio="1:1"
                          sizes="56px"
                          pad="6%"
                        />
                      </span>
                    )}
                    <span className={s.resultName}>{item.name}</span>
                    {item.product ? (
                      <Price amount={item.product.price} size="sm" />
                    ) : (
                      <span className={s.resultMeta}>{item.meta}</span>
                    )}
                  </Link>
                );
              })}
            </section>
          ))
        )}
      </div>
    </div>
  );
}
