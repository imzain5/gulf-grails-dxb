"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useCatalogue } from "@/context/CatalogueContext";
import { SORTS, type SortKey } from "@/data/products";
import { euToUk, euToUs } from "@/lib/sizes";
import {
  activeCount,
  filterProducts,
  filtersToHref,
  type Availability,
  type ShopFilters,
} from "@/lib/filter";
import LotCard from "../LotCard";
import Reveal from "../Reveal";
import { Button, Label } from "../primitives";
import s from "./shop.module.css";

/**
 * The shop.
 *
 * Every filter change is a navigation, not a setState. That is the whole
 * design: the URL is the state, so a filtered view is shareable, survives a
 * refresh and the back button, and is something Google can index. The router
 * push is shallow — the page is already rendered from the same URL on the
 * server, so there is no fetch and no spinner.
 *
 * The rail is sticky on desktop and becomes a bottom sheet on a phone, because
 * six filter groups across the top of a phone is a screen of chrome before any
 * product appears.
 */

/** How many options a facet shows before it needs asking. */
const FACET_CAP = 6;

function Facet({
  head,
  options,
  selected,
  onPick,
  count,
}: {
  head: string;
  options: { value: string; label: string }[];
  selected: string;
  onPick: (value: string) => void;
  count: (value: string) => number;
}) {
  const [all, setAll] = useState(false);
  const shown = all ? options : options.slice(0, FACET_CAP);
  const hidden = options.length - shown.length;

  return (
    <div className={s.group}>
      <span className={s.groupHead}>{head}</span>
      {shown.map((o) => (
        <button
          key={o.value}
          className={s.opt}
          aria-pressed={selected === o.value}
          onClick={() => onPick(o.value)}
        >
          {o.label}<span className={s.optCount}>{count(o.value)}</span>
        </button>
      ))}
      {hidden > 0 && (
        <button className={s.more} onClick={() => setAll(true)}>+ {hidden} more</button>
      )}
    </div>
  );
}

const AVAILABILITY: { key: Availability; label: string }[] = [
  { key: "all", label: "Everything" },
  { key: "in", label: "In stock" },
  { key: "vault", label: "Vault lots" },
  { key: "sold", label: "Sold out" },
];

export default function ShopClient({ filters }: { filters: ShopFilters }) {
  const router = useRouter();
  const catalogue = useCatalogue();
  const [sheet, setSheet] = useState(false);

  const go = useCallback(
    (patch: Partial<ShopFilters>) => {
      router.push(filtersToHref({ ...filters, ...patch }), { scroll: false });
    },
    [filters, router],
  );

  const list = useMemo(() => filterProducts(catalogue, filters), [catalogue, filters]);

  // Counts come from the catalogue narrowed by *everything except* the facet
  // being counted, so a number never says zero for something you can click.
  const countFor = useCallback(
    (patch: Partial<ShopFilters>) => filterProducts(catalogue, { ...filters, ...patch }).length,
    [catalogue, filters],
  );

  const families = useMemo(
    () => [...new Set(catalogue.map((p) => p.fam).filter(Boolean))].sort(),
    [catalogue],
  );
  const houses = useMemo(
    () => [...new Set(catalogue.map((p) => p.brand).filter(Boolean))].sort(),
    [catalogue],
  );
  const sizes = useMemo(
    () => [...new Set(catalogue.flatMap((p) => p.sizes))].sort((a, b) => a - b),
    [catalogue],
  );

  const active = activeCount(filters);

  const applied: { label: string; clear: Partial<ShopFilters> }[] = [
    filters.house !== "All" && { label: filters.house, clear: { house: "All" } },
    filters.fam !== "All" && { label: filters.fam, clear: { fam: "All" } },
    filters.sizeF !== "All" && { label: `EU ${filters.sizeF}`, clear: { sizeF: "All" as const } },
    filters.avail !== "all" && {
      label: AVAILABILITY.find((a) => a.key === filters.avail)?.label ?? "",
      clear: { avail: "all" as const },
    },
    (filters.min !== null || filters.max !== null) && {
      label: `AED ${filters.min ?? 0}–${filters.max ?? "∞"}`,
      clear: { min: null, max: null },
    },
    filters.q && { label: `“${filters.q}”`, clear: { q: "" } },
  ].filter(Boolean) as { label: string; clear: Partial<ShopFilters> }[];

  const rail = (
    <>
      <div className={s.group}>
        <span className={s.groupHead}>Size · EU</span>
        <div className={s.sizes}>
          <button className={s.size} aria-pressed={filters.sizeF === "All"} onClick={() => go({ sizeF: "All" })}>
            All
          </button>
          {sizes.map((z) => (
            <button
              key={z}
              className={s.size}
              aria-pressed={filters.sizeF === z}
              onClick={() => go({ sizeF: z })}
              title={`EU ${z} · US ${euToUs(z)} · UK ${euToUk(z)}`}
            >
              {z}
            </button>
          ))}
        </div>
        {filters.sizeF !== "All" && (
          <Label>US {euToUs(Number(filters.sizeF))} · UK {euToUk(Number(filters.sizeF))}</Label>
        )}
      </div>

      <Facet
        head="House"
        selected={filters.house}
        onPick={(house) => go({ house })}
        count={(house) => countFor({ house })}
        options={[{ value: "All", label: "All houses" }, ...houses.map((h) => ({ value: h, label: h }))]}
      />

      <Facet
        head="Model"
        selected={filters.fam}
        onPick={(fam) => go({ fam })}
        count={(fam) => countFor({ fam })}
        options={[{ value: "All", label: "All models" }, ...families.map((f) => ({ value: f, label: f }))]}
      />

      <div className={s.group}>
        <span className={s.groupHead}>Price · AED</span>
        <div className={s.price}>
          <input
            className={s.priceField}
            type="number"
            inputMode="numeric"
            min={0}
            placeholder="Min"
            defaultValue={filters.min ?? ""}
            onBlur={(e) => go({ min: e.target.value === "" ? null : Number(e.target.value) })}
            aria-label="Minimum price"
          />
          <span className={s.priceDash}>—</span>
          <input
            className={s.priceField}
            type="number"
            inputMode="numeric"
            min={0}
            placeholder="Max"
            defaultValue={filters.max ?? ""}
            onBlur={(e) => go({ max: e.target.value === "" ? null : Number(e.target.value) })}
            aria-label="Maximum price"
          />
        </div>
      </div>

      <div className={s.group}>
        <span className={s.groupHead}>Availability</span>
        {AVAILABILITY.map((a) => (
          <button key={a.key} className={s.opt} aria-pressed={filters.avail === a.key} onClick={() => go({ avail: a.key })}>
            {a.label}<span className={s.optCount}>{countFor({ avail: a.key })}</span>
          </button>
        ))}
      </div>
    </>
  );

  return (
    <div className={s.page}>
      <div className={s.head}>
        <Label>{filters.avail === "vault" ? "The Vault" : "Currently held"}</Label>
        <h1 className={s.title}>
          {filters.q ? `“${filters.q}”` : filters.fam !== "All" ? filters.fam : "The stockroom"}
        </h1>
        <span className={s.count}>
          {list.length === catalogue.length
            ? `${list.length} pairs, all physically held`
            : `${list.length} of ${catalogue.length} pairs`}
        </span>
      </div>

      <div className={s.body}>
        <aside className={s.rail} aria-label="Filters">{rail}</aside>

        <div>
          <div className={s.bar}>
            <div className={s.applied}>
              {applied.map((a) => (
                <button key={a.label} className={s.chip} onClick={() => go(a.clear)}>
                  {a.label}
                  <span aria-hidden>×</span>
                </button>
              ))}
              {active > 1 && (
                <button
                  className={s.chip}
                  onClick={() => go({ fam: "All", house: "All", sizeF: "All", q: "", min: null, max: null, avail: "all" })}
                >
                  Clear all
                </button>
              )}
            </div>

            <Button variant="ghost" className={s.sheetBtn} onClick={() => setSheet(true)}>
              Filters{active > 0 ? ` · ${active}` : ""}
            </Button>

            <label>
              <span className={s.srOnly}>Sort</span>
              <select
                className={s.select}
                value={filters.sort}
                onChange={(e) => go({ sort: e.target.value as SortKey })}
                aria-label="Sort"
              >
                {SORTS.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </label>
          </div>

          {list.length === 0 ? (
            <p className={s.empty}>
              Nothing held under those terms. We source to order — tell us what you are after on
              WhatsApp and we will find it.
            </p>
          ) : (
            <div className={s.grid}>
              {list.map((p, i) => (
                <Reveal key={p.id} delay={(i % 3) * 60}>
                  <LotCard
                    product={p}
                    priority={i < 3}
                    sizes="(max-width: 760px) 50vw, (max-width: 1200px) 30vw, 24vw"
                  />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </div>

      {sheet && (
        <>
          <div className={s.scrim} onClick={() => setSheet(false)} aria-hidden />
          <div className={s.sheet} role="dialog" aria-modal aria-label="Filters">
            <div className={s.sheetTop}>
              <Label tone="hi">Filters</Label>
              <Button variant="link" onClick={() => setSheet(false)}>Close</Button>
            </div>
            <div className={s.sheetBody}>{rail}</div>
            <div className={s.sheetFoot}>
              <Button
                variant="ghost"
                onClick={() => go({ fam: "All", house: "All", sizeF: "All", q: "", min: null, max: null, avail: "all" })}
              >
                Clear
              </Button>
              <Button onClick={() => setSheet(false)}>Show {list.length}</Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
