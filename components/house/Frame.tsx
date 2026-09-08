import Image from "next/image";
import s from "./Frame.module.css";

/**
 * Every photograph on the site goes through here.
 *
 * The reason is in Frame.module.css: the catalogue is white-background studio
 * cut-outs that only work over a light plate, and campaign photography that
 * must never be blended. Leaving that decision to each call site is how a white
 * rectangle or a black square ends up shipped.
 *
 * `ratio` reserves the box before the image loads, which is the CLS budget.
 */

type Ratio = "4:5" | "1:1" | "4:3" | "16:9" | "2:3" | "fill";

const RATIO: Record<Ratio, string> = {
  "4:5": s.r45,
  "1:1": s.r11,
  "4:3": s.r43,
  "16:9": s.r169,
  "2:3": s.r23,
  fill: s.fill,
};

export default function Frame({
  src,
  alt,
  /** `plate` for white-background studio shots, `bleed` for real photography. */
  variant = "plate",
  ratio = "4:5",
  sizes = "(max-width: 720px) 100vw, 33vw",
  /** A second angle that cross-fades in on hover. */
  alt2,
  /** Slow scale on hover. Reserve it for cards and heroes. */
  zoom = false,
  priority = false,
  caption,
  /** Inset of the shoe within its plate. Only meaningful for `plate`. */
  pad,
  className,
}: {
  src: string | null;
  alt: string;
  variant?: "plate" | "bleed";
  ratio?: Ratio;
  sizes?: string;
  alt2?: string | null;
  zoom?: boolean;
  priority?: boolean;
  caption?: string;
  pad?: string;
  className?: string;
}) {
  const cls = [s.frame, variant === "plate" ? s.plate : s.bleed, RATIO[ratio], zoom && s.zoom, className]
    .filter(Boolean)
    .join(" ");

  if (!src) {
    return (
      <div className={[s.frame, RATIO[ratio], s.empty, className].filter(Boolean).join(" ")}>
        Not yet photographed
      </div>
    );
  }

  return (
    <div
      className={cls}
      style={pad ? ({ "--frame-pad": pad } as React.CSSProperties) : undefined}
    >
      <Image src={src} alt={alt} fill sizes={sizes} priority={priority} />
      {alt2 && (
        <span className={s.alt} aria-hidden>
          <Image src={alt2} alt="" fill sizes={sizes} />
        </span>
      )}
      {caption && <span className={s.caption}>{caption}</span>}
    </div>
  );
}
