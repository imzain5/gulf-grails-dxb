import Link from "next/link";
import Image from "next/image";
import { INSTAGRAM_SHOTS, shotProduct, shotSrc } from "@/lib/editorial";
import type { Product } from "@/data/products";
import Rise from "./Rise";

const ARROW = (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" /><path d="m13 6 6 6-6 6" />
  </svg>
);

/**
 * The @gulfgrails wall as a campaign feed rather than a contact sheet.
 *
 * Six equal squares read as a grid of thumbnails; giving the first shot four
 * cells and letting the rest tile unevenly around it turns the same six photos
 * into a spread. The spans below fill a 6 × 2 grid exactly — change one and
 * the row leaves a hole.
 */
const SPANS: [number, number][] = [[2, 2], [2, 1], [1, 1], [1, 1], [2, 1], [2, 1]];

export default function EditorialGallery({ catalogue }: { catalogue: Product[] }) {
  return (
    <section style={{ borderBottom: "1px solid var(--hp-line)" }}>
      <div className="hp-shell" style={{ paddingBlock: "var(--hp-section)" }}>
        <Rise>
          <div
            style={{
              display: "flex", alignItems: "flex-end", justifyContent: "space-between",
              gap: 28, flexWrap: "wrap", marginBottom: "clamp(32px, 4vw, 60px)",
            }}
          >
            <div>
              <div className="hp-label hp-label-accent" style={{ marginBottom: 20 }}>@gulfgrails</div>
              <h2 className="hp-display hp-section-head">Every pair we ship</h2>
            </div>
            <a
              href="https://instagram.com/gulfgrails"
              target="_blank"
              rel="noopener"
              className="hp-link"
            >
              Follow on Instagram
              {ARROW}
            </a>
          </div>
        </Rise>

        <div className="hp-gallery">
          {INSTAGRAM_SHOTS.map((shot, i) => {
            const src = shotSrc(catalogue, shot);
            const product = shotProduct(catalogue, shot);
            const [c, r] = SPANS[i] ?? [1, 1];
            return (
              <Rise
                key={`${shot.pid}-${i}`}
                variant="mask"
                delay={i * 60}
                style={{ gridColumn: `span ${c}`, gridRow: `span ${r}` }}
              >
                <Link
                  href={`/product/${product.id}`}
                  className="hp-frame hp-zoom"
                  aria-label={product.name}
                  style={{ display: "block", height: "100%", minHeight: 0, background: "var(--hp-paper)" }}
                >
                  {src && (
                    <Image
                      className="gg-photo"
                      src={src}
                      alt={product.name}
                      fill
                      sizes={c > 1 ? "(max-width: 760px) 100vw, 46vw" : "(max-width: 760px) 50vw, 23vw"}
                      style={{ objectFit: "contain", padding: "7%" }}
                    />
                  )}
                  {shot.caption && (
                    <span
                      className="hp-label"
                      style={{
                        position: "absolute", left: 16, bottom: 14, zIndex: 2,
                        color: "color-mix(in srgb, #201e1d 60%, transparent)", letterSpacing: "0.18em",
                        maxWidth: "calc(100% - 32px)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                      }}
                    >
                      {shot.caption}
                    </span>
                  )}
                </Link>
              </Rise>
            );
          })}
        </div>
      </div>
    </section>
  );
}
