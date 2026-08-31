import Image from "next/image";
import Link from "next/link";
import { GROUNDS, shotProduct, shotSrc, type EditorialShot } from "@/lib/editorial";
import StudioPlate from "./StudioPlate";

/**
 * A studio cut-out composed as editorial photography.
 *
 * The catalogue shots are all shoes on white. Dropping one straight into a
 * full-bleed hero looks like a listing; setting it on a coloured ground with a
 * contact shadow and a corner caption makes it read as a shot styled for the
 * page. Every non-catalogue image on the site goes through here so the
 * treatment stays consistent.
 *
 * Light grounds blend the photo (see `.gg-photo` in globals.css — the photos
 * are opaque, so multiplying is what removes the white). Dark grounds can't
 * blend, so the photo is set inside an inset white plate instead, which reads
 * as a deliberate frame rather than a compositing failure.
 */
export default function EditorialFrame({
  shot,
  priority = false,
  drift = false,
  sizes = "50vw",
  link = true,
  label,
  className,
  style,
}: {
  shot: EditorialShot;
  priority?: boolean;
  /** Slow ken-burns. Reserve it for heroes — a wall of drifting tiles is noise. */
  drift?: boolean;
  sizes?: string;
  /** Whether the frame links through to the pair it shows. */
  link?: boolean;
  /** Overrides the shot's own caption. */
  label?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const src = shotSrc(shot);
  const product = shotProduct(shot);
  const ground = GROUNDS[shot.ground];
  const dark = shot.ground === "ink" || shot.ground === "accent";
  const caption = label ?? shot.caption;

  const photo = src && (
    <div
      className={drift ? "gg-drift" : undefined}
      style={
        dark
          ? { position: "absolute", inset: "12%", background: "#fff", border: "2px solid var(--color-text)" }
          : { position: "absolute", inset: 0 }
      }
    >
      <Image
        className="gg-photo"
        src={src}
        alt={product.name}
        fill
        sizes={sizes}
        priority={priority}
        style={{ objectFit: "contain", padding: dark ? "8%" : "7%" }}
      />
    </div>
  );

  const inner = (
    <>
      {/* Contact shadow, painted under the photo so the blend lets it through. */}
      {src && !dark && (
        <span
          aria-hidden
          style={{
            position: "absolute",
            left: "50%",
            bottom: "16%",
            width: "54%",
            height: "6%",
            transform: "translateX(-50%)",
            background: "radial-gradient(ellipse at center, color-mix(in srgb, #201e1d 30%, transparent) 0%, transparent 70%)",
            filter: "blur(9px)",
            pointerEvents: "none",
          }}
        />
      )}

      {src ? photo : <StudioPlate product={product} />}

      {caption && (
        <span
          style={{
            position: "absolute",
            left: 0,
            bottom: 0,
            padding: "8px 12px",
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            background: "var(--color-text)",
            color: "var(--color-bg)",
            pointerEvents: "none",
            zIndex: 3,
            maxWidth: "100%",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {caption}
        </span>
      )}
    </>
  );

  const frameStyle: React.CSSProperties = {
    position: "relative",
    overflow: "hidden",
    isolation: "isolate",
    background: ground.bg,
    color: ground.fg,
    display: "block",
    ...style,
  };

  if (link && src) {
    return (
      <Link href={`/product/${product.id}`} aria-label={product.name} className={className} style={frameStyle}>
        {inner}
      </Link>
    );
  }
  return (
    <div className={className} style={frameStyle}>
      {inner}
    </div>
  );
}
