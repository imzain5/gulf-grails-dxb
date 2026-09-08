import { MARKET } from "@/data/content";
import Reveal from "../Reveal";
import SectionHeader from "../SectionHeader";
import s from "./home.module.css";

/**
 * The Grail Index — the smartest asset on the site, set as data.
 *
 * Mono, tabular, hairline-ruled: the point is that a figure here reads as a
 * valuation rather than a price tag.
 *
 * What is deliberately **not** here yet: sparklines, and the 7d/30d/90d
 * toggle the brief asks for. `MARKET` in data/content.ts holds one price and
 * one 7-day delta per model — there is no history behind it. Drawing a curve
 * or offering a 90-day view would mean inventing a price series on the one
 * module whose whole value is being believable about prices. The layout is
 * ready for both the moment a real series exists; see the note in the README.
 *
 * Signal earns its place on a fall, which is the thing a holder needs to
 * notice. A rise is not an alert and gets no colour.
 */
export default function GrailIndex() {
  return (
    <section className={s.act}>
      <div className={`${s.shell} ${s.actIn}`}>
        <SectionHeader
          kicker="The Grail Index"
          title="What the market did this week"
          note="Our own reading of UAE resale, taken from what we are asked for and what we pay. Seven-day movement."
        />
        <Reveal variant="rise">
          <div className={s.index}>
            {MARKET.map((m) => (
              <div key={m.name} className={s.indexRow}>
                <span className={s.indexName}>{m.name}</span>
                <span className={s.indexFigure}>{m.price}</span>
                <span className={`${s.indexDelta}${m.up ? "" : ` ${s.indexDown}`}`}>{m.delta}</span>
              </div>
            ))}
          </div>
          <p className={s.indexNote}>
            Indicative, not an offer. Updated weekly from our own trading.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
