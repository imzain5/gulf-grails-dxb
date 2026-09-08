import type { Metadata } from "next";
import { CHECKS, STEPS } from "@/data/content";
import PageHead from "@/components/house/editorial/PageHead";
import Closing from "@/components/house/editorial/Closing";
import Reveal from "@/components/house/Reveal";
import s from "@/components/house/editorial/editorial.module.css";

export const metadata: Metadata = {
  title: "Authentication",
  description:
    "The six checks run on every pair before it is listed: box label against the shoe, stitching density, midsole and paint, glue and smell, insole and print, then photographed and logged.",
  alternates: { canonical: "/authentication" },
};

/**
 * The strongest trust asset on the site, given a page of its own.
 *
 * It was a six-item list inside another page. Six checks described properly is
 * the difference between a claim and a method, and a method is the thing that
 * justifies the prices.
 *
 * There are no macro photographs here for the same reason there are none on
 * the homepage: a shot of stitching density or a glue bead does not exist in
 * this shop's library, and a stand-in product photo beside "we count stitches"
 * would undo the page.
 */
export default function AuthenticationPage() {
  return (
    <div className={s.page}>
      <PageHead
        kicker="Authentication"
        title={<>Six checks, before it is ever listed.</>}
        standfirst="Every pair in the stockroom is checked by hand against a known-good reference before it goes on the site. A pair that fails does not get relisted cheaper — it goes back."
        photo="/assets/campaign/air-dior-outsoles.jpg"
        photoAlt="Outsoles photographed on the table"
      />

      <div className={s.body}>
        <div className={s.measure}>
          <p className={s.p}>
            Authentication in resale is usually a sticker. Ours is a procedure with a name against
            it: the six checks below are run in order, on every pair, by the person whose initials
            end up on the listing. Where a pair has been checked, the product page shows the date
            and the initials. Where it has not been recorded yet, the page says so rather than
            implying it has.
          </p>
        </div>

        <div className={s.steps}>
          {CHECKS.map((c, i) => (
            <Reveal key={c.n} variant="rise" delay={(i % 3) * 60}>
              <div className={s.step}>
                <span className={s.stepNum}>{c.n}</span>
                <div className={s.stepBody}>
                  <h2 className={s.h3}>{c.t}</h2>
                  <p className={s.p}>{c.d}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <section className={s.section}>
          <div className={s.measure}>
            <h2 className={s.h2}>And then the part you can check yourself</h2>
            <p className={s.p}>
              The checks are ours. The last one is yours: under cash on delivery you open the box
              at the door, look at the pair, and try both shoes on before any money changes hands.
              If it is wrong, hand it back and pay nothing.
            </p>
          </div>

          <div className={s.steps}>
            {STEPS.map((step) => (
              <div key={step.n} className={s.step}>
                <span className={s.stepNum}>{step.n}</span>
                <div className={s.stepBody}>
                  <h3 className={s.h3}>{step.t}</h3>
                  <p className={s.p}>{step.d}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <Closing
        line="If you want a specific detail photographed before you commit — the tag, the heel, the box label — ask and we will send it."
        message="Hello Gulf Grails, can you send me more detail photos of a pair before I order?"
        action={{ label: "See what is held", href: "/shop" }}
      />
    </div>
  );
}
