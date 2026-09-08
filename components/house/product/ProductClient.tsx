"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Product } from "@/data/products";
import { useCatalogue } from "@/context/CatalogueContext";
import { useStore } from "@/context/StoreContext";
import { certificateRef, hasRecord } from "@/lib/certificate";
import { euToUk, euToUs, sizePrice, VIEWS } from "@/lib/sizes";
import { money } from "@/lib/money";
import { waLink } from "@/lib/whatsapp";
import { recordView } from "@/lib/recentStore";
import Frame from "../Frame";
import LotCard from "../LotCard";
import Reveal from "../Reveal";
import SectionHeader from "../SectionHeader";
import { Button, Label, Price, Tag } from "../primitives";
import Fold from "./Fold";
import s from "./product.module.css";

/**
 * One pair, as a lot.
 *
 * The media rail scrolls and the detail panel sticks, so the evidence can be
 * read without losing the price and the size selector. Everything below the
 * fold is the auction-house half: a condition report, an authentication record
 * with the date and the initials of whoever ran it, and where the pair came
 * from. None of that is generated — it is recorded per pair at /admin, and
 * where it has not been, the page says so rather than implying a clean report.
 */

const ASSURANCES: [string, string][] = [
  ["Verified before dispatch", "Six checks in-house, photographed on our own table."],
  ["Same day in Dubai", "Next day to every other emirate."],
  ["Pay at the door", "Cash to the courier or bank transfer. No card, no account."],
];

export default function ProductClient({ product }: { product: Product }) {
  const catalogue = useCatalogue();
  const { addToBag, isWished, toggleWish } = useStore();

  const [size, setSize] = useState<number | null>(null);
  const [needSize, setNeedSize] = useState(false);
  const [unit, setUnit] = useState<"EU" | "US" | "UK">("EU");

  useEffect(() => { recordView(product.id); }, [product.id]);

  const soldOut = product.stock <= 0;
  const photos = product.photos ?? [];
  const labels = product.views ?? VIEWS;
  const selected = size ?? null;
  const price = selected ? sizePrice(product, selected) : product.price;
  const wished = isWished(product.id);
  const record = hasRecord(product);

  const related = catalogue
    .filter((p) => p.id !== product.id && p.fam === product.fam)
    .concat(catalogue.filter((p) => p.id !== product.id && p.fam !== product.fam))
    .slice(0, 4);

  const convert = (eu: number) => (unit === "EU" ? String(eu) : unit === "US" ? euToUs(eu) : euToUk(eu));

  const add = () => {
    if (soldOut) return;
    if (!selected) { setNeedSize(true); return; }
    addToBag(product.id, selected);
  };

  const wa = waLink(
    `Hello Gulf Grails, I want the ${product.name}${selected ? ` in EU ${selected}` : ""} (${money(price)}). Is it available?`,
  );

  return (
    <>
      <div className={s.page}>
        <nav className={s.crumbs} aria-label="Breadcrumb">
          <Link href="/shop">Stockroom</Link>
          <span aria-hidden>/</span>
          <Link href={`/shop?fam=${encodeURIComponent(product.fam)}`}>{product.fam}</Link>
          <span aria-hidden>/</span>
          <span>{product.name}</span>
        </nav>

        <div className={s.split}>
          {/* ── evidence ──────────────────────────────────────────────── */}
          <div className={s.rail}>
            {photos.length === 0 ? (
              <Frame src={null} alt="" ratio="4:3" />
            ) : (
              photos.map((src, i) => (
                <div key={src} className={s.railShot}>
                  <Frame
                    src={src}
                    alt={`${product.name} — ${labels[i] ?? "view"}`}
                    ratio="4:3"
                    sizes="(max-width: 980px) 100vw, 56vw"
                    priority={i === 0}
                    pad="9%"
                  />
                  <span className={s.shotLabel}>{labels[i] ?? `View ${i + 1}`}</span>
                </div>
              ))
            )}
          </div>

          {/* ── the decision ──────────────────────────────────────────── */}
          <div className={s.panel}>
            <div className={s.house}>
              <Label>{product.brand} · {product.year}</Label>
              {soldOut && <Tag tone="signal">Sold</Tag>}
              {!soldOut && product.stock === 1 && <Tag tone="brass">One pair only</Tag>}
            </div>

            <h1 className={s.name}>{product.name}</h1>
            <p className={s.colorway}>{product.colorway}</p>

            <div className={s.priceRow}>
              <Price amount={price} was={product.market} size="lg" />
            </div>
            <span className={`${s.stockLine}${soldOut ? ` ${s.stockOut}` : ""}`}>
              {soldOut
                ? "Sold — message us and we will source it"
                : product.stock <= 2
                  ? `Only ${product.stock} in the stockroom`
                  : `${product.stock} in the stockroom`}
            </span>

            <div className={s.sizeHead}>
              <Label tone="hi">Select size</Label>
              <div className={s.unitToggle} role="group" aria-label="Size unit">
                {(["EU", "US", "UK"] as const).map((u) => (
                  <button key={u} type="button" className={s.unit} aria-pressed={unit === u} onClick={() => setUnit(u)}>
                    {u}
                  </button>
                ))}
              </div>
            </div>

            <div className={s.sizeGrid}>
              {product.sizes.map((eu) => (
                <button
                  key={eu}
                  type="button"
                  className={`${s.size}${soldOut ? ` ${s.sizeGone}` : ""}`}
                  aria-pressed={selected === eu}
                  disabled={soldOut}
                  onClick={() => { setSize(eu); setNeedSize(false); }}
                >
                  {convert(eu)}
                  <small>{unit === "EU" ? `US ${euToUs(eu)}` : `EU ${eu}`}</small>
                </button>
              ))}
            </div>

            {needSize && <span className={s.needSize}>Pick a size to continue.</span>}

            <div className={s.actions}>
              <Button block onClick={add} disabled={soldOut}>
                {soldOut ? "Sold" : `Add to bag — ${money(price)}`}
              </Button>
              <div className={s.actionsRow}>
                <Button variant="ghost" href={wa} target="_blank" rel="noopener">
                  {soldOut ? "Ask when it's back" : "Reserve on WhatsApp"}
                </Button>
                <button
                  type="button"
                  className={s.wish}
                  aria-pressed={wished}
                  aria-label={wished ? "Remove from saved" : "Save this pair"}
                  onClick={() => toggleWish(product.id)}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill={wished ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <path d="M12 20.5 4.6 13a4.7 4.7 0 0 1 6.6-6.7l.8.8.8-.8A4.7 4.7 0 0 1 19.4 13z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* ── the auction-house half ─────────────────────────────── */}
            <div className={s.details}>
              <Fold title="Condition report" open>
                <dl className={s.rows}>
                  <div className={s.row}>
                    <dt>Grade</dt>
                    <dd>{product.condition ?? <span className={s.notRecorded}>Not recorded</span>}</dd>
                  </div>
                  <div className={s.row}>
                    <dt>Box</dt>
                    <dd>{product.boxNote ?? <span className={s.notRecorded}>Not recorded</span>}</dd>
                  </div>
                </dl>

                {product.flaws === undefined ? (
                  <p className={s.notRecorded}>
                    Flaws have not been logged for this pair yet. Ask us on WhatsApp and we will
                    photograph anything you want to see before you commit.
                  </p>
                ) : product.flaws.length === 0 ? (
                  <p className={s.clean}>
                    <span aria-hidden>—</span> Checked and no flaws found.
                  </p>
                ) : (
                  <ul className={s.flaws}>
                    {product.flaws.map((f) => <li key={f}>{f}</li>)}
                  </ul>
                )}
              </Fold>

              <Fold title="Authentication">
                <dl className={s.rows}>
                  <div className={s.row}>
                    <dt>Checked on</dt>
                    <dd>
                      {product.verifiedOn
                        ? new Date(product.verifiedOn).toLocaleDateString("en-GB", {
                            day: "2-digit", month: "long", year: "numeric",
                          })
                        : <span className={s.notRecorded}>Not recorded</span>}
                    </dd>
                  </div>
                  <div className={s.row}>
                    <dt>Checked by</dt>
                    <dd>{product.verifiedBy ?? <span className={s.notRecorded}>Not recorded</span>}</dd>
                  </div>
                </dl>
                <p>
                  Six checks are run on every pair before it is listed: box label against the shoe,
                  stitching density, midsole and paint, glue and smell, insole and print, then
                  photographed and logged.
                </p>
                {/*
                 * The public record, but only where one was actually written.
                 * A "view certificate" link on a pair nobody has checked would
                 * be the exact claim this whole section exists to avoid.
                 */}
                {record && (
                  <p className={s.recordLine}>
                    This pair has a record you can read, under{" "}
                    <b>{certificateRef(product.id)}</b> — the same reference as the card
                    in the box.
                  </p>
                )}
                <div className={s.foldActions}>
                  {record && (
                    <Button variant="link" href={`/verify/${product.id}`}>
                      Read the record
                    </Button>
                  )}
                  <Button variant="link" href="/authentication">How we authenticate</Button>
                </div>
              </Fold>

              <Fold title="Provenance">
                <p>{product.blurb}</p>
                <p>{product.desc}</p>
              </Fold>

              <Fold title="The pair">
                <dl className={s.rows}>
                  <div className={s.row}><dt>Style code</dt><dd>{product.sku || "—"}</dd></div>
                  <div className={s.row}><dt>Colourway</dt><dd>{product.colorway || "—"}</dd></div>
                  <div className={s.row}><dt>Released</dt><dd>{product.year}</dd></div>
                  <div className={s.row}><dt>Sizes held</dt><dd>EU {product.sizes.join(", ") || "—"}</dd></div>
                </dl>
                <Button variant="link" href="/size-guide">Size &amp; fit guide</Button>
              </Fold>

              <Fold title="Delivery and payment">
                <div className={s.assurances}>
                  {ASSURANCES.map(([term, desc]) => (
                    <p key={term} className={s.assurance}>
                      <b>{term}.</b> <span>{desc}</span>
                    </p>
                  ))}
                </div>
              </Fold>
            </div>
          </div>
        </div>

        {/* Thumb-reachable on a phone, where the panel has scrolled away. */}
        <div className={s.bar}>
          <Price amount={price} size="sm" className={s.barPrice} />
          <Button onClick={add} disabled={soldOut}>{soldOut ? "Sold" : "Add to bag"}</Button>
        </div>
      </div>

      {related.length > 0 && (
        <section className={s.related}>
          <div className={`${s.page} ${s.relatedIn}`}>
            <SectionHeader
              kicker="From the same house"
              title="Also held"
              action={{ label: "All inventory", href: "/shop" }}
            />
            <div className={s.relatedGrid}>
              {related.map((p, i) => (
                <Reveal key={p.id} delay={(i % 4) * 60}>
                  <LotCard product={p} sizes="(max-width: 900px) 50vw, 22vw" />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
