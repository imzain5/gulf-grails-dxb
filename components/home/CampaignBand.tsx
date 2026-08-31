import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/data/products";
import Rise from "./Rise";

const ARROW = (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" /><path d="m13 6 6 6-6 6" />
  </svg>
);

/**
 * A full-width campaign for one collection.
 *
 * The hero pattern at a smaller scale: a large image, a title, one short
 * paragraph and a single link out. `flip` mirrors the composition so two bands
 * on the same page don't read as a template — the copy sits left on one and
 * right on the next.
 */
export default function CampaignBand({
  kicker,
  title,
  body,
  href,
  cta,
  lead,
  support,
  flip = false,
  ground = "paper",
}: {
  kicker: string;
  title: React.ReactNode;
  body: string;
  href: string;
  cta: string;
  /** The pair carrying the campaign. */
  lead: Product;
  /** Two more from the collection, shown small beneath the copy. */
  support?: Product[];
  flip?: boolean;
  ground?: "paper" | "ink";
}) {
  const dark = ground === "ink";

  return (
    <section
      className={dark ? "hp-dark" : undefined}
      style={{
        background: dark ? undefined : "var(--hp-paper)",
        borderBottom: `1px solid ${dark ? "var(--hp-line-dark)" : "var(--hp-line)"}`,
        overflow: "hidden",
      }}
    >
      <div
        className="hp-shell hp-asym"
        style={{
          paddingBlock: "var(--hp-section)",
          alignItems: "center",
          "--hp-cols": flip ? "1fr 1.25fr" : "1.25fr 1fr",
          "--hp-gap": "clamp(32px, 5vw, 96px)",
        } as React.CSSProperties}
      >
        <Rise
          variant="mask"
          className="hp-frame hp-zoom"
          style={{
            order: flip ? 2 : 1,
            aspectRatio: "3 / 2",
            background: "transparent",
          }}
        >
          {lead.photos && (
            <Link
              href={href}
              aria-label={lead.name}
              style={{
                position: "absolute", inset: 0, display: "block",
                // Inside the reveal's clip layer, so the photo has a ground to
                // multiply against. Same colour as the section — no visible plate.
                background: dark ? "#fff" : "var(--hp-paper)",
              }}
            >
              <Image
                className="gg-photo"
                src={lead.photos[0]}
                alt={lead.name}
                fill
                sizes="(max-width: 900px) 100vw, 58vw"
                style={{ objectFit: "contain", padding: "5%" }}
              />
            </Link>
          )}
        </Rise>

        <div style={{ order: flip ? 1 : 2, minWidth: 0 }}>
          <Rise>
            <div className="hp-label hp-label-accent" style={{ marginBottom: 22 }}>{kicker}</div>
            <h2 className="hp-display hp-section-head" style={{ marginBottom: 24 }}>{title}</h2>
            <p className={`hp-body ${dark ? "hp-body-light" : ""}`} style={{ margin: "0 0 34px", maxWidth: "42ch" }}>
              {body}
            </p>
            <Link href={href} className="hp-link">
              {cta}
              {ARROW}
            </Link>
          </Rise>

          {support && support.length > 0 && (
            <Rise delay={140} style={{ marginTop: "clamp(34px, 4vw, 56px)" }}>
              <hr className="hp-hair" style={{ marginBottom: 26 }} />
              <div className="hp-grid" style={{ "--n": support.length, "--n-sm": support.length, "--hp-gap": "clamp(14px,1.6vw,26px)" } as React.CSSProperties}>
                {support.map((p) => (
                  <Link key={p.id} href={`/product/${p.id}`} className="hp-frame hp-zoom" style={{ color: "inherit" }}>
                    <span style={{ position: "relative", display: "block", aspectRatio: "1 / 1", background: dark ? "var(--hp-paper)" : "transparent" }}>
                      {p.photos && (
                        <Image
                          className={dark ? undefined : "gg-photo"}
                          src={p.photos[0]}
                          alt={p.name}
                          fill
                          sizes="180px"
                          style={{ objectFit: "contain", padding: "9%" }}
                        />
                      )}
                    </span>
                    <span className="hp-label" style={{ display: "block", marginTop: 12, letterSpacing: "0.14em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {p.colorway}
                    </span>
                  </Link>
                ))}
              </div>
            </Rise>
          )}
        </div>
      </div>
    </section>
  );
}
