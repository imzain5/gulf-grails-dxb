import type { Metadata } from "next";
import { MARKET } from "@/data/content";
import { getCatalogue } from "@/lib/catalogue";
import { money } from "@/lib/money";
import PageHead from "@/components/house/editorial/PageHead";
import Closing from "@/components/house/editorial/Closing";
import Reveal from "@/components/house/Reveal";
import s from "@/components/house/editorial/editorial.module.css";

export const metadata: Metadata = {
  title: "The Grail Index",
  description:
    "Our own reading of UAE sneaker resale, taken from what we are asked for and what we pay. Updated weekly from our own trading.",
  alternates: { canonical: "/index" },
};

/**
 * The Grail Index, as a page of its own.
 *
 * Nobody publishes UAE-specific resale pricing, which is exactly why this is
 * worth having: it is the thing that gets linked to and quoted rather than
 * scrolled past.
 *
 * It is also the page where inventing data would cost the most. `MARKET` holds
 * one figure and one weekly delta per model with no series behind it, so there
 * is no sparkline and no 7d/30d/90d toggle — a drawn curve on the one module
 * whose value is being believable about prices would be the whole point
 * thrown away. The gap is stated on the page instead, and the shape is ready
 * for the day a real series exists.
 */
export default async function GrailIndexPage() {
  const catalogue = await getCatalogue();

  return (
    <div className={s.page}>
      <PageHead
        kicker="The Grail Index"
        title={<>What the Gulf actually pays.</>}
        standfirst="Our own reading of UAE resale, taken from what we are asked for, what we pay to buy, and what leaves the room. Indicative, not an offer."
      />

      <div className={s.body}>
        <section className={s.section}>
          <h2 className={s.h2}>This week</h2>
          <Reveal variant="rise">
            <div>
              {MARKET.map((m) => {
                const held = catalogue.find((p) =>
                  p.name.toLowerCase().includes(m.name.split(" ")[0].toLowerCase()),
                );
                return (
                  <div key={m.name} className={s.indexRow}>
                    <span className={s.indexName}>
                      {m.name}
                      {held && held.stock > 0 && (
                        <small> · {held.stock} held at {money(held.price)}</small>
                      )}
                    </span>
                    <span className={s.indexFigure}>{m.price}</span>
                    <span className={`${s.indexDelta}${m.up ? "" : ` ${s.indexDown}`}`}>{m.delta}</span>
                  </div>
                );
              })}
            </div>
          </Reveal>

          <div className={s.gap}>
            <p>
              <strong>No chart yet, on purpose.</strong> These are this week&apos;s figures against
              last week&apos;s. We do not hold a price history deep enough to draw a curve from,
              and a curve drawn from four points would be decoration pretending to be data — on
              the one page whose entire value is being believable about prices.
            </p>
            <p>
              The series starts accumulating from here. Thirty and ninety-day views arrive when
              there are thirty and ninety days behind them.
            </p>
          </div>
        </section>

        <section className={s.section}>
          <div className={s.measure}>
            <h2 className={s.h2}>Where the numbers come from</h2>
            <p className={s.p}>
              Three places, all of them ours. What people ask us for and at what price. What we
              actually pay when we buy a pair in. And what a pair finally leaves at, which is not
              always what it was listed at.
            </p>
            <p className={s.p}>
              That makes this a Gulf number rather than a global one. A pair that moves at one
              price in London does not move at that price here, and an index built on overseas
              sales will tell you the wrong thing about what your pair is worth in Dubai.
            </p>
            <p className={s.p}>
              It is indicative. It is not a valuation, not an offer, and not advice — if you want
              a real number for a real pair, send it to us and we will quote it after looking at
              it.
            </p>
          </div>
        </section>
      </div>

      <Closing
        line="Holding something and want to know what it is worth here? Send the model, the size and a photo, and we will tell you what we would pay."
        message="Hello Gulf Grails, what is my pair worth?"
        action={{ label: "Sell to the house", href: "/sell" }}
      />
    </div>
  );
}
