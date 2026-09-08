import { CHECKS } from "@/data/content";
import Reveal from "../Reveal";
import SectionHeader from "../SectionHeader";
import s from "./home.module.css";

/**
 * The six checks, as a procedure you move through rather than a list you skim.
 *
 * The brief asks for a macro photograph per check. There aren't any — a close
 * shot of stitching density or a glue bead does not exist in this shop's
 * library, and standing in a product shot that shows none of those things
 * would make the strongest trust asset on the site look decorative. So the
 * numeral carries the card until the macros are shot, which is a §3.4 job.
 */
export default function SixChecks() {
  return (
    <section className={s.act}>
      <div className={`${s.shell} ${s.actIn}`}>
        <SectionHeader
          kicker="Authentication"
          title="Six checks, every pair"
          note="Run in-house on every pair before it is listed, by the person whose initials go on the record."
          action={{ label: "How we authenticate", href: "/trust" }}
        />
        <div className={s.rail}>
          {CHECKS.map((c, i) => (
            <Reveal key={c.n} variant="rise" delay={(i % 3) * 60}>
              <article className={s.check}>
                <span className={s.checkNum}>{c.n}</span>
                <span className={s.checkTitle}>{c.t}</span>
                <p className={s.checkBody}>{c.d}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
