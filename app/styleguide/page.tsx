import ThemeToggle from "@/components/house/ThemeToggle";
import { Button, Hairline, Price, Tag } from "@/components/house/primitives";
import Frame from "@/components/house/Frame";
import Reveal from "@/components/house/Reveal";
import SectionHeader from "@/components/house/SectionHeader";
import LotCard from "@/components/house/LotCard";
import Header from "@/components/house/Header";
import Footer from "@/components/house/Footer";
import { SEED_PRODUCTS } from "@/data/seed";
import s from "./styleguide.module.css";

/**
 * The regression check for everything that follows.
 *
 * Every token, type step, primitive and card state renders here, in whichever
 * mode is selected. If a later phase breaks the system, it breaks visibly on
 * this page first — which is the only reason it is worth building before the
 * pages that use it.
 *
 * Contrast ratios are printed next to the text tokens because they were
 * computed rather than chosen: the brief's proposed `--text-lo` at 38% opacity
 * measured 3.25:1 and would have shipped failing WCAG AA.
 */

const SURFACES = [
  ["--surface", "page ground"],
  ["--surface-raised", "raised"],
  ["--surface-card", "card"],
  ["--surface-hover", "hover"],
  ["--surface-inverse", "inverse"],
] as const;

const TEXT = [
  ["--text-hi", "Primary — headlines, names, prices", "18.7 : 1"],
  ["--text-mid", "Secondary — body, descriptions", "8.24 : 1 dark · 7.18 : 1 light"],
  ["--text-lo", "Tertiary — labels, captions, meta", "5.16 : 1 dark · 5.05 : 1 light"],
] as const;

const TYPE = [
  ["--t-hero", "Display · 400", "One pair. One chance.", "display"],
  ["--t-section", "Display · 400", "Currently held", "display"],
  ["--t-lot", "Display · 400", "Air Jordan 1 High OG Dior", "display"],
  ["--t-body", "Interface · 400", "Six checks, every pair. Physically held in Dubai, photographed on our own table, and paid for at your door.", "ui"],
  ["--t-label", "Interface · 500 · uppercase", "Authenticated in house", "label"],
  ["--t-data", "Data · tabular", "AED 31,200 · LOT 004 · EU 42", "data"],
] as const;

const SPACE = ["--gutter", "--pad-sm", "--pad-md", "--pad-lg", "--pad-xl"] as const;

export default function StyleguidePage() {
  // Real catalogue rows, so the components are exercised against real data
  // rather than a shape invented to make them look good.
  const lots = SEED_PRODUCTS.filter((p) => p.photos?.length).slice(0, 4);
  const studio = lots[0]?.photos?.[0] ?? null;

  return (
    <>
      <Header products={SEED_PRODUCTS} bagCount={2} />

      <div className={s.page}>
      <header className={s.bar}>
        <span className={s.wordmark}>Gulf Grails — House system</span>
        <ThemeToggle className={s.toggle} />
      </header>

      <p className={s.note}>
        Phase 0 foundation. Three type roles, dual-surface monochrome, brass for status and
        signal demoted to status-only. Nothing here reads a legacy <code className={s.data}>gg-*</code>{" "}
        or <code className={s.data}>hp-*</code> token.
      </p>

      {/* ── surfaces ─────────────────────────────────────────────────── */}
      <section className={s.section}>
        <div className={s.sectionHead}>
          <h2 className={s.sectionTitle}>Surfaces</h2>
          <span className={s.label}>Both modes complete</span>
        </div>
        <div className={s.grid}>
          {SURFACES.map(([token, name]) => (
            <div key={token} className={s.swatch}>
              <div className={s.chip} style={{ background: `var(${token})` }} />
              <span className={s.label}>{name}</span>
              <span className={s.ratio}>{token}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── text ─────────────────────────────────────────────────────── */}
      <section className={s.section}>
        <div className={s.sectionHead}>
          <h2 className={s.sectionTitle}>Text</h2>
          <span className={s.label}>Measured, not eyeballed</span>
        </div>
        <div className={s.stack}>
          {TEXT.map(([token, use, ratio]) => (
            <div key={token} className={s.specimen}>
              <span style={{ color: `var(${token})` }}>{use}</span>
              <span className={s.ratio}>{token} — {ratio}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── brass and signal ─────────────────────────────────────────── */}
      <section className={s.section}>
        <div className={s.sectionHead}>
          <h2 className={s.sectionTitle}>Status colour</h2>
          <span className={s.label}>Three brass marks per viewport, at most</span>
        </div>
        <p className={s.note}>
          Brass marks authentication, lot numbers and provenance — nothing else. Signal is
          reserved for a live countdown, a sold state, a price drop or an error, and may never be
          a button background or a link colour.
        </p>
        <div className={s.row}>
          <Tag tone="brass">✓ Authenticated</Tag>
          <Tag tone="brass">Lot 004</Tag>
          <Tag tone="signal">Sold</Tag>
          <Tag tone="signal">Closes in 04:12:55</Tag>
          <Tag>Deadstock</Tag>
          <Tag>One pair only</Tag>
        </div>
      </section>

      {/* ── type scale ───────────────────────────────────────────────── */}
      <section className={s.section}>
        <div className={s.sectionHead}>
          <h2 className={s.sectionTitle}>Type</h2>
          <span className={s.label}>Instrument Serif · Geist · Geist Mono</span>
        </div>
        <div className={s.stack}>
          {TYPE.map(([token, role, sample, kind]) => (
            <div key={token} className={s.specimen}>
              <span className={s.ratio}>{token} — {role}</span>
              <span
                className={kind === "label" ? s.label : kind === "data" ? s.data : undefined}
                style={
                  kind === "display"
                    ? {
                        fontFamily: "var(--font-display)",
                        fontWeight: 400,
                        fontSize: `var(${token})`,
                        lineHeight: "var(--lh-display)",
                        letterSpacing: "var(--track-display)",
                      }
                    : kind === "ui"
                      ? { fontSize: `var(${token})`, color: "var(--text-mid)", maxWidth: "58ch" }
                      : undefined
                }
              >
                {sample}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── buttons ──────────────────────────────────────────────────── */}
      <section className={s.section}>
        <div className={s.sectionHead}>
          <h2 className={s.sectionTitle}>Buttons</h2>
          <span className={s.label}>Primary is never the signal colour</span>
        </div>
        <div className={s.row}>
          <Button>Add to bag</Button>
          <Button variant="ghost">Reserve on WhatsApp</Button>
          <Button variant="link">View the condition report</Button>
          <Button disabled>Sold</Button>
          <Button variant="ghost" href="/shop">As a link</Button>
        </div>

        <div className={s.row} style={{ marginTop: "var(--pad-sm)" }}>
          <Price amount={31200} was={34500} size="lg" />
          <Price amount={19100} was={21000} />
          <Price amount={620} size="sm" />
        </div>
      </section>

      {/* ── rules ────────────────────────────────────────────────────── */}
      <section className={s.section}>
        <div className={s.sectionHead}>
          <h2 className={s.sectionTitle}>Rules &amp; space</h2>
          <span className={s.label}>1px hairlines, never 2px black</span>
        </div>
        <div className={s.stack}>
          <div>
            <span className={s.ratio}>--line</span>
            <Hairline />
          </div>
          <div>
            <span className={s.ratio}>--line-strong</span>
            <Hairline tone="strong" />
          </div>
          <div>
            <span className={s.ratio}>--brass</span>
            <Hairline tone="brass" />
          </div>
          {SPACE.map((token) => (
            <div key={token} className={s.row}>
              <span className={s.ratio} style={{ width: 90 }}>{token}</span>
              <span style={{ height: 10, width: `var(${token})`, background: "var(--brass)" }} />
            </div>
          ))}
        </div>
      </section>

      {/* ── frame ────────────────────────────────────────────────────── */}
      <section className={s.section}>
        <SectionHeader
          kicker="Media"
          title="Frame"
          note="Studio cut-outs are white-background JPEGs made transparent by multiply, which only works over a light plate — on the page ground they would go black. Campaign photography carries no blend and bleeds."
        />
        <div className={s.grid} style={{ gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}>
          <div className={s.swatch}>
            <Frame src={studio} alt="" ratio="4:5" sizes="240px" zoom />
            <span className={s.label}>plate · studio cut-out</span>
          </div>
          <div className={s.swatch}>
            <Frame src="/assets/campaign/air-dior-onfoot.jpg" alt="" variant="bleed" ratio="4:5" sizes="240px" zoom />
            <span className={s.label}>bleed · campaign</span>
          </div>
          <div className={s.swatch}>
            <Frame src={null} alt="" ratio="4:5" />
            <span className={s.label}>not yet photographed</span>
          </div>
        </div>
      </section>

      {/* ── lot card ─────────────────────────────────────────────────── */}
      <section className={s.section}>
        <SectionHeader
          kicker="Currently held"
          title="Lot card"
          note="One implementation, replacing gg-card and hp-card. No border, no discount percentage — separation by space, and the size run as mono chips."
          action={{ label: "All inventory", href: "/shop" }}
        />
        <div className={s.grid} style={{ gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))" }}>
          {lots.map((p, i) => (
            <Reveal key={p.id} delay={i * 60}>
              <LotCard product={p} lot={p.price >= 10000 ? i + 1 : undefined} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── chrome ───────────────────────────────────────────────────── */}
      <section className={s.section}>
        <SectionHeader
          kicker="Chrome"
          title="Footer"
          note="Four columns and a brand column. Payment marks list only what the shop can take today; the trade licence renders when one is supplied."
        />
      </section>
      </div>

      <Footer />
    </>
  );
}
