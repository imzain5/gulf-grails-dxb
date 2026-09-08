import ThemeToggle from "@/components/house/ThemeToggle";
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
  return (
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
          <span className={`${s.tag} ${s.tagBrass}`}>✓ Authenticated</span>
          <span className={`${s.tag} ${s.tagBrass}`}>Lot 004</span>
          <span className={`${s.tag} ${s.tagSignal}`}>Sold</span>
          <span className={`${s.tag} ${s.tagSignal}`}>Closes in 04:12:55</span>
          <span className={s.tag}>Deadstock</span>
          <span className={s.tag}>One pair only</span>
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
          <button className={`${s.btn} ${s.btnPrimary}`}>Add to bag</button>
          <button className={`${s.btn} ${s.btnGhost}`}>Reserve on WhatsApp</button>
          <button className={`${s.btn} ${s.btnLink}`}>View the condition report</button>
          <button className={`${s.btn} ${s.btnPrimary}`} disabled>Sold</button>
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
            <hr className={s.hairline} />
          </div>
          <div>
            <span className={s.ratio}>--line-strong</span>
            <hr className={s.hairlineStrong} />
          </div>
          {SPACE.map((token) => (
            <div key={token} className={s.row}>
              <span className={s.ratio} style={{ width: 90 }}>{token}</span>
              <span style={{ height: 10, width: `var(${token})`, background: "var(--brass)" }} />
            </div>
          ))}
        </div>
      </section>

      {/* ── lot card ─────────────────────────────────────────────────── */}
      <section className={s.section}>
        <div className={s.sectionHead}>
          <h2 className={s.sectionTitle}>Lot card</h2>
          <span className={s.label}>Separation by space, no borders</span>
        </div>
        <div className={`${s.grid} ${s.wipe}`} style={{ gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))" }}>
          {[
            { name: "Air Jordan 1 High OG Dior", price: "AED 31,200", tag: "Lot 004", brass: true },
            { name: "Travis Scott x Air Jordan 1 High OG", price: "AED 19,100", tag: "One pair only", brass: false },
            { name: "Off-White x Air Jordan 1 Chicago", price: "AED 29,500", tag: "Sold", brass: false, sold: true },
            { name: "Nike Dunk Low Retro Panda", price: "AED 620", tag: "Deadstock", brass: false },
          ].map((lot) => (
            <article key={lot.name} className={s.lot}>
              <div className={s.lotFrame} />
              <div className={s.lotMeta}>
                <span className={s.label}>Air Jordan</span>
                <span className={s.lotName}>{lot.name}</span>
                <div className={s.lotRow}>
                  <span className={s.price}>{lot.price}</span>
                  <span
                    className={`${s.tag} ${lot.brass ? s.tagBrass : lot.sold ? s.tagSignal : ""}`}
                  >
                    {lot.tag}
                  </span>
                </div>
                <span className={s.data} style={{ color: "var(--text-lo)" }}>EU 40 41 42 43 44 45</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
