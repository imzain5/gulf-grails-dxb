import Frame from "../Frame";
import Reveal from "../Reveal";
import SectionHeader from "../SectionHeader";
import { Button } from "../primitives";
import s from "./home.module.css";

/**
 * Location and delivery, merged.
 *
 * They were two sections making one point — that this is a real room in Dubai
 * you can be delivered from today — and splitting it across the page weakened
 * both halves.
 */
const PROMISES = [
  ["Same day in Dubai", "Ordered before 6pm, at your door the same evening. Next day to every other emirate."],
  ["Pay at the door", "Cash to the courier or bank transfer before dispatch. No card, no account, nothing taken up front."],
  ["Viewing by appointment", "Jumeirah 1. Come and see a pair in the hand before you commit to it."],
] as const;

export default function HeldInDubai({ photo }: { photo: string }) {
  return (
    <section className={s.act}>
      <div className={`${s.shell} ${s.actIn}`}>
        <div className={s.split}>
          <Reveal>
            <Frame
              src={photo}
              alt="The Jumeirah stockroom"
              variant="bleed"
              ratio="4:5"
              sizes="(max-width: 900px) 100vw, 44vw"
            />
          </Reveal>

          <Reveal variant="rise" delay={80}>
            <SectionHeader kicker="Held in Dubai" title="A room, not a marketplace" />
            <dl className={s.promises}>
              {PROMISES.map(([term, desc]) => (
                <div key={term} className={s.promise}>
                  <dt className={s.promiseTerm}>{term}</dt>
                  <dd className={s.promiseDesc}>{desc}</dd>
                </div>
              ))}
            </dl>
            <div className={s.heroActions}>
              <Button variant="ghost" href="/about">About the house</Button>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
