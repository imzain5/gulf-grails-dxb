import Frame from "../Frame";
import Reveal from "../Reveal";
import { Label } from "../primitives";
import s from "./editorial.module.css";

/**
 * The opening of every long-form page.
 *
 * Kicker, title, standfirst — and a photograph only where one earns its place.
 * A page about sizing does not need a hero; a page about how the house
 * authenticates does.
 */
export default function PageHead({
  kicker,
  title,
  standfirst,
  photo,
  photoAlt = "",
  small = false,
}: {
  kicker: string;
  title: React.ReactNode;
  standfirst?: string;
  photo?: string;
  photoAlt?: string;
  /** For the policy pages, where a hero-scale title is pomp. */
  small?: boolean;
}) {
  return (
    <header className={`${s.head}${photo ? "" : ` ${s.headPlain}`}`}>
      <div>
        <Reveal variant="rise">
          <Label tone="brass">{kicker}</Label>
          <h1 className={`${s.title}${small ? ` ${s.titleSm}` : ""}`}>{title}</h1>
          {standfirst && <p className={s.standfirst}>{standfirst}</p>}
        </Reveal>
      </div>
      {photo && (
        <Reveal delay={80}>
          <Frame src={photo} alt={photoAlt} variant="bleed" ratio="4:3" sizes="(max-width: 900px) 100vw, 42vw" />
        </Reveal>
      )}
    </header>
  );
}
