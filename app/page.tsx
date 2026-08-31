import Link from "next/link";
import Image from "next/image";
import { PRODUCTS, FEATURED_IDS, findProduct } from "@/data/products";
import { HOUSES, MARKET, REVIEWS, STEPS } from "@/data/content";
import { STORY_SHOTS, INSTAGRAM_SHOTS } from "@/lib/editorial";
import { waLink } from "@/lib/whatsapp";
import HeroCarousel from "@/components/home/HeroCarousel";
import FridayDropBanner from "@/components/home/FridayDropBanner";
import FeaturedProductCard from "@/components/FeaturedProductCard";
import ProductCard from "@/components/ProductCard";
import EditorialFrame from "@/components/EditorialFrame";
import RecentlyViewed from "@/components/RecentlyViewed";
import Reveal from "@/components/Reveal";

function houseCount(fam: string): number {
  return PRODUCTS.filter((p) => {
    if (fam === "Dunk") return p.brand === "Nike";
    if (fam === "Jordan 1") return p.brand === "Air Jordan";
    return p.fam === fam;
  }).length;
}

const ARROW = (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" /><path d="m13 6 6 6-6 6" />
  </svg>
);

/** Section head: kicker on the left, a "see everything" link on the right. */
function SectionHead({
  kicker, title, action,
}: {
  kicker: string;
  title: React.ReactNode;
  action?: { label: string; href: string };
}) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}>
      <div style={{ minWidth: 0 }}>
        <div className="gg-kicker" style={{ marginBottom: 14 }}>{kicker}</div>
        <h2 className="gg-display gg-d2">{title}</h2>
      </div>
      {action && (
        <Link href={action.href} className="gg-arrow" style={{
          display: "inline-flex", alignItems: "center", gap: 9, flex: "none",
          fontSize: 12, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase",
          color: "var(--color-accent)", paddingBottom: 4,
        }}>
          {action.label}
          {ARROW}
        </Link>
      )}
    </div>
  );
}

export default function HomePage() {
  const featured = FEATURED_IDS.map(findProduct);
  const homeGrid = PRODUCTS.filter((p) => !FEATURED_IDS.includes(p.id)).slice(0, 10);

  return (
    <div data-screen-label="Home">
      <HeroCarousel />
      <FridayDropBanner />

      {/* ── shop by house ─────────────────────────────────────────────────── */}
      <section style={{ borderBottom: "2px solid var(--color-text)" }}>
        <div className="gg-wrap" style={{ padding: "clamp(30px,4vw,44px) var(--gutter) 0" }}>
          <div className="gg-kicker" style={{ marginBottom: 20 }}>Shop by house</div>
        </div>
        <Reveal
          className="gg-wrap gg-grid"
          style={{
            padding: "0 var(--gutter) clamp(30px,4vw,44px)",
            borderTop: "2px solid var(--color-text)",
            borderLeft: "2px solid var(--color-text)",
            "--cols": 5, "--cols-md": 3, "--cols-sm": 2, "--cols-xs": 2,
          } as React.CSSProperties}
        >
          {HOUSES.map((h) => {
            const face = findProduct(h.pid);
            return (
              <Link
                key={h.key}
                href={`/shop?fam=${encodeURIComponent(h.fam)}`}
                className="gg-house-hover"
                style={{
                  border: 0, borderRight: "2px solid var(--color-text)", borderBottom: "2px solid var(--color-text)",
                  background: "var(--color-neutral-100)", cursor: "pointer", padding: "22px 20px 18px", textAlign: "left",
                  font: "inherit", color: "inherit", display: "flex", flexDirection: "column", gap: 6, minHeight: 236,
                  position: "relative", overflow: "hidden", isolation: "isolate",
                  transition: "background .18s var(--ease-out), color .18s var(--ease-out)",
                }}
              >
                <span style={{ fontFamily: "var(--font-heading)", fontWeight: 900, fontSize: "clamp(18px,1.6vw,22px)", letterSpacing: "-0.02em", textTransform: "uppercase" }}>
                  {h.label}
                </span>
                <span className="gg-eyebrow" style={{ opacity: 0.6 }}>{houseCount(h.fam)} pairs</span>

                {/* The house's signature pair, blended so the white studio
                    background disappears into the tile rather than sitting on
                    it as a box. */}
                <span style={{ position: "relative", flex: 1, margin: "10px -6px 8px", minHeight: 88 }}>
                  {face.photos && (
                    <Image
                      className="gg-photo"
                      src={face.photos[0]}
                      alt=""
                      aria-hidden
                      fill
                      sizes="(max-width: 520px) 90vw, (max-width: 1180px) 30vw, 260px"
                      style={{ objectFit: "contain" }}
                    />
                  )}
                </span>

                <span className="gg-arrow" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--color-accent)" }}>
                  Shop {ARROW}
                </span>
              </Link>
            );
          })}
        </Reveal>
      </section>

      {/* ── this week's grails ────────────────────────────────────────────── */}
      <section style={{ borderBottom: "2px solid var(--color-text)" }}>
        <div className="gg-wrap" style={{ padding: "clamp(34px,4vw,44px) var(--gutter) 22px" }}>
          <SectionHead
            kicker="This week's grails"
            title={<>Three pairs that<br />won&apos;t be here Monday</>}
            action={{ label: `See all ${PRODUCTS.length} pairs`, href: "/shop" }}
          />
        </div>
        <div
          className="gg-wrap gg-grid"
          style={{
            padding: "0 var(--gutter) clamp(32px,4vw,48px)",
            borderLeft: "2px solid var(--color-text)",
            "--cols": 3, "--cols-md": 3, "--cols-sm": 1,
          } as React.CSSProperties}
        >
          {featured.map((p, i) => (
            <Reveal key={p.id} delay={i * 90} style={{ display: "flex", minWidth: 0 }}>
              <FeaturedProductCard product={p} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── grail index ───────────────────────────────────────────────────── */}
      <section style={{ borderBottom: "2px solid var(--color-text)", background: "var(--color-text)", color: "var(--color-bg)" }}>
        <div className="gg-wrap" style={{ padding: "clamp(26px,3vw,34px) var(--gutter) clamp(28px,3vw,38px)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18, flexWrap: "wrap" }}>
            <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase" }}>Grail index — last 7 days</span>
            <span style={{ width: 7, height: 7, background: "var(--color-accent)", animation: "gg-pulse 1.6s ease-in-out infinite", display: "inline-block" }} />
            <span className="gg-eyebrow" style={{ color: "var(--color-neutral-400)" }}>Resale movement we track before we price</span>
          </div>
          <div
            className="gg-grid"
            style={{ borderTop: "1px solid var(--color-neutral-700)", "--cols": 4, "--cols-md": 2, "--cols-xs": 2 } as React.CSSProperties}
          >
            {MARKET.map((m) => (
              <div key={m.name} style={{ padding: "18px 20px", borderRight: "1px solid var(--color-neutral-700)", borderBottom: "1px solid var(--color-neutral-700)" }}>
                <div className="gg-eyebrow" style={{ color: "var(--color-neutral-400)", fontWeight: 700 }}>{m.name}</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginTop: 8, flexWrap: "wrap" }}>
                  <span className="gg-figure" style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "clamp(18px,1.8vw,22px)", letterSpacing: "-0.02em" }}>{m.price}</span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 800, letterSpacing: "0.06em", color: m.up ? "var(--color-accent-400)" : "var(--color-neutral-400)" }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: m.up ? "none" : "rotate(180deg)" }}>
                      <path d="M12 19V5" /><path d="m5 12 7-7 7 7" />
                    </svg>
                    {m.delta}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── in stock now ──────────────────────────────────────────────────── */}
      <section style={{ borderBottom: "2px solid var(--color-text)" }}>
        <div className="gg-wrap" style={{ padding: "clamp(34px,4vw,44px) var(--gutter) 20px" }}>
          <SectionHead kicker="The stockroom" title="In stock now" action={{ label: "Filter by size", href: "/shop" }} />
        </div>
        <div className="gg-wrap" style={{ padding: "22px var(--gutter) clamp(38px,4vw,56px)" }}>
          <Reveal className="gg-cardgrid">
            {homeGrid.map((p, i) => <ProductCard key={p.id} product={p} priority={i < 4} />)}
          </Reveal>
          <div style={{ display: "flex", marginTop: 28 }}>
            <Link href="/shop" className="gg-btn gg-btn-outline">
              Load the full inventory ({PRODUCTS.length})
              {ARROW}
            </Link>
          </div>
        </div>
      </section>

      {/* ── what customers say ────────────────────────────────────────────── */}
      <section style={{ borderBottom: "2px solid var(--color-text)", background: "var(--color-neutral-100)" }}>
        <div className="gg-wrap" style={{ padding: "clamp(34px,4vw,48px) var(--gutter)" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 20, flexWrap: "wrap", marginBottom: 26 }}>
            <div>
              <div className="gg-kicker" style={{ marginBottom: 14 }}>312 reviews · 4.9 average</div>
              <h2 className="gg-display gg-d2">Bought once,<br />then sent a friend</h2>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flex: "none" }} aria-label="4.9 out of 5">
              {[0, 1, 2, 3, 4].map((i) => (
                <svg key={i} width="17" height="17" viewBox="0 0 24 24" fill="var(--color-accent)" aria-hidden>
                  <path d="m12 2 3 6.9 7.5.7-5.6 5 1.6 7.4L12 18.2 5.5 22l1.6-7.4-5.6-5 7.5-.7z" />
                </svg>
              ))}
            </div>
          </div>
          <div
            className="gg-grid"
            style={{ borderTop: "2px solid var(--color-text)", borderLeft: "2px solid var(--color-text)", "--cols": 3, "--cols-sm": 1 } as React.CSSProperties}
          >
            {REVIEWS.map((r, i) => (
              <Reveal
                key={r.name}
                delay={i * 90}
                style={{
                  borderRight: "2px solid var(--color-text)", borderBottom: "2px solid var(--color-text)",
                  padding: "26px 24px 24px", display: "flex", flexDirection: "column", gap: 14, background: "var(--color-bg)",
                }}
              >
                <svg width="26" height="26" viewBox="0 0 24 24" fill="var(--color-accent)" aria-hidden style={{ flex: "none" }}>
                  <path d="M9.5 6C6.5 7.6 5 10 5 13v5h6v-6H8.4c.2-1.7 1.1-2.9 2.7-3.7zm9 0C15.5 7.6 14 10 14 13v5h6v-6h-2.6c.2-1.7 1.1-2.9 2.7-3.7z" />
                </svg>
                <p style={{ margin: 0, fontSize: 15, lineHeight: 1.55, flex: 1, textWrap: "pretty" }}>{r.quote}</p>
                <div style={{ paddingTop: 14, borderTop: "2px solid var(--color-divider)" }}>
                  <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 14 }}>{r.name} · {r.place}</div>
                  <div className="gg-eyebrow" style={{ color: "var(--color-neutral-600)", marginTop: 4 }}>{r.pair}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── stories ───────────────────────────────────────────────────────── */}
      <section style={{ borderBottom: "2px solid var(--color-text)" }}>
        <div className="gg-wrap" style={{ padding: "clamp(34px,4vw,44px) var(--gutter) clamp(34px,4vw,48px)" }}>
          <div className="gg-kicker" style={{ marginBottom: 20 }}>Stories</div>
          <div
            className="gg-grid"
            style={{ borderTop: "2px solid var(--color-text)", borderLeft: "2px solid var(--color-text)", "--cols": 2, "--cols-sm": 1 } as React.CSSProperties}
          >
            {[
              {
                shot: STORY_SHOTS[0],
                kicker: "Most wanted",
                title: "What Dubai asked us for most this month",
                body: "Reverse Mocha lows took the top spot for the third month running, Panda Dunks refuse to die, and Air Dior enquiries tripled after the Mall of the Emirates pop-up.",
                href: "/shop",
              },
              {
                shot: STORY_SHOTS[1],
                kicker: "Care guide",
                title: "Keeping white leather white in 45°C",
                body: "Heat yellows midsoles faster than wear does. Never leave a pair in the car, never store them in direct sun, and keep the silica packs that come in the box.",
                href: "/trust",
              },
            ].map((s, i) => (
              <Reveal
                key={s.title}
                delay={i * 100}
                className="gg-story"
                style={{
                  borderRight: "2px solid var(--color-text)", borderBottom: "2px solid var(--color-text)",
                  display: "grid", gridTemplateColumns: ".9fr 1.1fr", minWidth: 0,
                }}
              >
                <EditorialFrame shot={s.shot} sizes="(max-width: 820px) 40vw, 280px" style={{ minHeight: 260, minWidth: 0 }} />
                <div style={{ padding: "clamp(20px,2vw,26px) clamp(18px,2vw,24px)", display: "flex", flexDirection: "column" }}>
                  <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--color-accent)", marginBottom: 12 }}>{s.kicker}</div>
                  <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "clamp(18px,1.7vw,22px)", lineHeight: 1.15, letterSpacing: "-0.02em", marginBottom: 10, textWrap: "pretty" }}>
                    {s.title}
                  </div>
                  <div style={{ fontSize: 13, lineHeight: 1.55, color: "var(--color-neutral-700)", textWrap: "pretty" }}>{s.body}</div>
                  <Link href={s.href} className="gg-arrow" style={{ marginTop: "auto", paddingTop: 16, alignSelf: "flex-start", display: "inline-flex", alignItems: "center", gap: 8, fontSize: 11, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--color-accent)" }}>
                    Read {ARROW}
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── how ordering works ────────────────────────────────────────────── */}
      <section style={{ borderBottom: "2px solid var(--color-text)" }}>
        <div className="gg-wrap" style={{ padding: "clamp(36px,4vw,48px) var(--gutter)" }}>
          <div className="gg-kicker" style={{ marginBottom: 16 }}>How ordering works</div>
          <h2 className="gg-display gg-d2" style={{ marginBottom: 32 }}>
            No card. No account.<br />Four steps.
          </h2>
          <div
            className="gg-grid"
            style={{ borderTop: "2px solid var(--color-text)", "--cols": 4, "--cols-md": 2, "--cols-xs": 1 } as React.CSSProperties}
          >
            {STEPS.map((s, i) => (
              <Reveal
                key={s.n}
                delay={i * 80}
                style={{ padding: "24px 24px 28px 0", borderRight: "2px solid var(--color-divider)", minWidth: 0 }}
              >
                <div style={{ fontFamily: "var(--font-heading)", fontWeight: 900, fontSize: 15, letterSpacing: "0.1em", color: "var(--color-accent)", marginBottom: 14 }}>{s.n}</div>
                <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 18, lineHeight: 1.2, marginBottom: 8 }}>{s.t}</div>
                <div style={{ fontSize: 13, lineHeight: 1.55, color: "var(--color-neutral-700)", textWrap: "pretty" }}>{s.d}</div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <RecentlyViewed />

      {/* ── the instagram wall ────────────────────────────────────────────── */}
      <section style={{ borderBottom: "2px solid var(--color-text)" }}>
        <div className="gg-wrap" style={{ padding: "clamp(30px,3.4vw,40px) var(--gutter) 20px", display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 20, flexWrap: "wrap" }}>
          <h2 className="gg-display gg-d3">@gulfgrails</h2>
          <span className="gg-eyebrow" style={{ color: "var(--color-neutral-600)" }}>Every pair we ship gets posted</span>
        </div>
        <div
          className="gg-wrap gg-grid"
          style={{
            padding: "16px var(--gutter) clamp(34px,4vw,48px)",
            borderTop: "2px solid var(--color-text)", borderLeft: "2px solid var(--color-text)",
            "--cols": 6, "--cols-md": 3, "--cols-sm": 3, "--cols-xs": 2,
          } as React.CSSProperties}
        >
          {INSTAGRAM_SHOTS.map((shot, i) => (
            <EditorialFrame
              key={i}
              shot={shot}
              sizes="(max-width: 520px) 50vw, (max-width: 1180px) 33vw, 260px"
              style={{ borderRight: "2px solid var(--color-text)", borderBottom: "2px solid var(--color-text)", aspectRatio: "1/1", minWidth: 0 }}
            />
          ))}
        </div>
      </section>

      {/* ── the guarantee ─────────────────────────────────────────────────── */}
      <section style={{ background: "var(--color-accent)", color: "#fff", borderBottom: "2px solid var(--color-text)" }}>
        <div className="gg-wrap" style={{ padding: "clamp(44px,6vw,64px) var(--gutter)" }}>
          <div className="gg-kicker gg-kicker-plain" style={{ color: "#fff", opacity: 0.85, marginBottom: 22 }}>Gulf Grails guarantee</div>
          <h2 className="gg-display" style={{ fontSize: "clamp(34px,6vw,96px)", lineHeight: 0.92, letterSpacing: "-0.045em", maxWidth: "22ch" }}>
            Every pair verified. Or your money back.
          </h2>
          <div style={{ display: "flex", gap: 12, marginTop: 38, flexWrap: "wrap" }}>
            <Link href="/trust" className="gg-btn gg-btn-invert">
              How we verify
              {ARROW}
            </Link>
            <a href={waLink("Hello Gulf Grails, I have a question about a pair.")} target="_blank" rel="noopener" className="gg-btn" style={{ background: "transparent", borderColor: "#fff", color: "#fff" }}>
              Message us
              {ARROW}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
