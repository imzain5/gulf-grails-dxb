import Frame from "../Frame";
import Reveal from "../Reveal";
import { Button, Label } from "../primitives";
import s from "./home.module.css";

/**
 * One statement, one line, one link.
 *
 * The countdown that used to live here has gone. A hero is where a house says
 * what it is; a ticking clock says the opposite, and the drop it counted to is
 * a merchandising detail that belongs further down the page or nowhere.
 *
 * The type is the display serif at weight 400 in mixed case — the single
 * biggest change from Archivo 900 uppercase, and most of the register.
 */
export default function Hero({
  campaign,
  headline,
  line,
}: {
  campaign: string;
  headline: React.ReactNode;
  line: string;
}) {
  return (
    <section className={s.hero}>
      <div className={s.heroType}>
        <Reveal variant="rise">
          <Label tone="brass">A private house for grails · Dubai</Label>
        </Reveal>
        <Reveal variant="rise" delay={80}>
          <h1 className={s.heroStatement}>{headline}</h1>
        </Reveal>
        <Reveal variant="rise" delay={160}>
          <p className={s.heroLine}>{line}</p>
        </Reveal>
        <Reveal variant="rise" delay={240}>
          <div className={s.heroActions}>
            <Button href="/vault">Enter the Vault</Button>
            <Button variant="ghost" href="/shop">Currently held</Button>
          </div>
        </Reveal>
      </div>

      <div className={s.heroMedia}>
        {/*
          Real photography with its own background, so it bleeds and carries no
          blend. `priority` because this is the LCP element.
        */}
        <Frame
          src={campaign}
          alt="Air Dior, photographed for the house"
          variant="bleed"
          ratio="fill"
          sizes="(max-width: 900px) 100vw, 46vw"
          priority
        />
      </div>
    </section>
  );
}
