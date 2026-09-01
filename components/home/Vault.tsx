import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/data/products";
import { money } from "@/lib/money";
import { waLink } from "@/lib/whatsapp";
import Rise from "./Rise";

const ARROW = (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" /><path d="m13 6 6 6-6 6" />
  </svg>
);

/**
 * The Vault: the pairs that don't behave like inventory.
 *
 * Dark ground, wide spacing, and no "add to bag" — a AED 33,000 pair is sold
 * in a conversation, not a checkout, so each one offers a private viewing on
 * WhatsApp instead. The cut-outs sit on their own light plates because the
 * photos are opaque and can't blend onto a dark ground; the plate reads as a
 * deliberate frame, which suits the section.
 */
export default function Vault({ products }: { products: Product[] }) {
  return (
    <section className="hp-dark" style={{ borderBottom: "1px solid var(--hp-line-dark)" }}>
      <div className="hp-shell" style={{ paddingBlock: "var(--hp-section)" }}>
        <Rise>
          <div
            style={{
              display: "flex", alignItems: "flex-end", justifyContent: "space-between",
              gap: "clamp(20px, 4vw, 60px)", flexWrap: "wrap", marginBottom: "clamp(38px, 5vw, 76px)",
            }}
          >
            <div style={{ maxWidth: "20ch" }}>
              <div className="hp-label hp-label-accent" style={{ marginBottom: 22 }}>The Vault</div>
              <h2 className="hp-display hp-section-head">One pair. One chance.</h2>
            </div>
            <p className="hp-body hp-body-light" style={{ margin: 0, maxWidth: "38ch" }}>
              Single-pair holdings we don&apos;t restock. Held in Jumeirah, viewable by appointment,
              and gone the week they land. Message us and we&apos;ll send the pair&apos;s own photographs
              before you decide.
            </p>
          </div>
        </Rise>

        <Rise variant="mask" className="hp-frame" style={{ aspectRatio: "21 / 9", marginBottom: "clamp(30px, 4vw, 64px)" }}>
          <Image
            src="/assets/campaign/air-dior-flatlay.jpg"
            alt="Air Dior pairs laid out"
            fill
            sizes="100vw"
            style={{ objectFit: "cover", objectPosition: "center 46%" }}
          />
        </Rise>

        <div
          className="hp-grid"
          style={{ "--n": products.length >= 4 ? 4 : products.length, "--n-md": 2, "--n-sm": 2, "--n-xs": 1, "--hp-gap": "clamp(20px, 2.6vw, 44px)" } as React.CSSProperties}
        >
          {products.map((p, i) => (
            <Rise key={p.id} delay={i * 90}>
              <article style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                <Link
                  href={`/product/${p.id}`}
                  className="hp-frame hp-zoom"
                  aria-label={p.name}
                  style={{ display: "block", aspectRatio: "1 / 1", background: "var(--hp-paper)" }}
                >
                  {p.photos && (
                    <Image
                      className="gg-photo"
                      src={p.photos[0]}
                      alt={p.name}
                      fill
                      sizes="(max-width: 760px) 50vw, 24vw"
                      style={{ objectFit: "contain", padding: "8%" }}
                    />
                  )}
                  <span
                    className="hp-label"
                    style={{
                      position: "absolute", top: 14, left: 14, zIndex: 2,
                      color: "var(--color-accent)", letterSpacing: "0.2em",
                    }}
                  >
                    {p.stock === 1 ? "One pair" : `${p.stock} pairs`}
                  </span>
                </Link>

                <div style={{ paddingTop: 20, display: "flex", flexDirection: "column", flex: 1 }}>
                  <div className="hp-label" style={{ marginBottom: 10 }}>{p.brand} · {p.year}</div>
                  <Link href={`/product/${p.id}`} className="hp-card-name" style={{ color: "inherit", marginBottom: 14, textWrap: "pretty" }}>
                    {p.name}
                  </Link>
                  <div className="gg-figure" style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 17, letterSpacing: "-0.01em", marginBottom: 18 }}>
                    {money(p.price)}
                  </div>
                  <a
                    href={waLink(`Hello Gulf Grails, I would like a private viewing of the ${p.name}.`)}
                    target="_blank"
                    rel="noopener"
                    className="hp-link"
                    style={{ marginTop: "auto", alignSelf: "flex-start", fontSize: 10 }}
                  >
                    Private viewing
                  </a>
                </div>
              </article>
            </Rise>
          ))}
        </div>

        <Rise delay={160} style={{ marginTop: "clamp(40px, 5vw, 72px)" }}>
          <hr className="hp-hair" style={{ marginBottom: 30 }} />
          <Link href="/shop?fam=Luxury" className="hp-link">
            Everything in the vault
            {ARROW}
          </Link>
        </Rise>
      </div>
    </section>
  );
}
