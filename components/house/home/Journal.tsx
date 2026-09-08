import Link from "next/link";
import Frame from "../Frame";
import Reveal from "../Reveal";
import SectionHeader from "../SectionHeader";
import { Label } from "../primitives";
import s from "./home.module.css";

/**
 * Two written pieces.
 *
 * The copy is real and specific to this shop, but there are no articles behind
 * it yet — the cards point at the pages the writing is about. `/journal/[slug]`
 * is a Phase 5 route; until it exists, a card that opened a page of lorem would
 * be worse than a card that takes you somewhere useful.
 */
export interface Story {
  kicker: string;
  title: string;
  body: string;
  href: string;
  photo: string;
  variant?: "plate" | "bleed";
}

export default function Journal({ stories }: { stories: Story[] }) {
  if (stories.length === 0) return null;

  return (
    <section className={s.act}>
      <div className={`${s.shell} ${s.actIn}`}>
        <SectionHeader kicker="Journal" title="From the stockroom" />
        <div className={s.stories}>
          {stories.slice(0, 3).map((story, i) => (
            <Reveal key={story.title} delay={i * 80}>
              <Link href={story.href} className={s.story}>
                <Frame
                  src={story.photo}
                  alt=""
                  variant={story.variant ?? "bleed"}
                  ratio="16:9"
                  sizes="(max-width: 760px) 100vw, 46vw"
                  zoom
                />
                <Label>{story.kicker}</Label>
                <span className={s.storyTitle}>{story.title}</span>
                <p className={s.storyBody}>{story.body}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
