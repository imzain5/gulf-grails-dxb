import Link from "next/link";
import { PRODUCTS, FEATURED_IDS, findProduct } from "@/data/products";
import { HOUSES, MARKET, STEPS } from "@/data/content";
import { waLink } from "@/lib/whatsapp";
import HeroCarousel from "@/components/home/HeroCarousel";
import FridayDropBanner from "@/components/home/FridayDropBanner";
import FeaturedProductCard from "@/components/FeaturedProductCard";
import ProductCard from "@/components/ProductCard";
import ImageSlot from "@/components/ImageSlot";

function houseCount(fam: string): number {
  return PRODUCTS.filter((p) => {
    if (fam === "Dunk") return p.brand === "Nike";
    if (fam === "Jordan 1") return p.brand === "Air Jordan";
    return p.fam === fam;
  }).length;
}

export default function HomePage() {
  const featured = FEATURED_IDS.map(findProduct);
  const homeGrid = PRODUCTS.filter((p) => !FEATURED_IDS.includes(p.id)).slice(0, 10);

  return (
    <div data-screen-label="Home">
      <HeroCarousel />
      <FridayDropBanner />

      <section style={{ borderBottom: "2px solid var(--color-text)" }}>
        <div style={{ maxWidth: 1560, margin: "0 auto", padding: "40px 28px 0" }}>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--color-accent)", marginBottom: 20 }}>
            Shop by house
          </div>
        </div>
        <div style={{ maxWidth: 1560, margin: "0 auto", padding: "0 28px 44px", display: "grid", gridTemplateColumns: "repeat(5,1fr)", borderTop: "2px solid var(--color-text)", borderLeft: "2px solid var(--color-text)" }}>
          {HOUSES.map((h) => (
            <Link
              key={h.key}
              href={`/shop?fam=${encodeURIComponent(h.fam === "Dunk" ? "Dunk" : h.fam)}`}
              className="gg-house-hover"
              style={{
                border: 0, borderRight: "2px solid var(--color-text)", borderBottom: "2px solid var(--color-text)",
                background: "var(--color-neutral-100)", cursor: "pointer", padding: "26px 22px 24px", textAlign: "left",
                font: "inherit", color: "inherit", display: "flex", flexDirection: "column", gap: 8, minHeight: 130,
              }}
            >
              <span style={{ fontFamily: "var(--font-heading)", fontWeight: 900, fontSize: 20, letterSpacing: "-0.02em", textTransform: "uppercase" }}>{h.label}</span>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", opacity: 0.6 }}>{houseCount(h.fam)} pairs</span>
              <span style={{ marginTop: "auto", fontSize: 12, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--color-accent)" }}>Shop →</span>
            </Link>
          ))}
        </div>
      </section>

      <section style={{ borderBottom: "2px solid var(--color-text)" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24, padding: "44px 28px 22px", maxWidth: 1560, margin: "0 auto" }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--color-accent)", marginBottom: 12 }}>This week&apos;s grails</div>
            <h2 style={{ margin: 0, fontSize: "clamp(30px,3.4vw,50px)", lineHeight: 0.98, letterSpacing: "-0.035em", textTransform: "uppercase" }}>
              Three pairs that<br />won&apos;t be here Monday
            </h2>
          </div>
          <Link href="/shop" className="btn btn-ghost" style={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", flex: "none" }}>
            See all {PRODUCTS.length} pairs →
          </Link>
        </div>
        <div style={{ maxWidth: 1560, margin: "0 auto", padding: "0 28px 48px", display: "grid", gridTemplateColumns: "repeat(3,1fr)", borderLeft: "2px solid var(--color-text)" }}>
          {featured.map((p) => <FeaturedProductCard key={p.id} product={p} />)}
        </div>
      </section>

      <section style={{ borderBottom: "2px solid var(--color-text)", background: "var(--color-text)", color: "var(--color-bg)" }}>
        <div style={{ maxWidth: 1560, margin: "0 auto", padding: "34px 28px 38px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18, flexWrap: "wrap" }}>
            <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase" }}>Grail index — last 7 days</span>
            <span style={{ width: 7, height: 7, background: "var(--color-accent)", animation: "gg-pulse 1.6s ease-in-out infinite", display: "inline-block" }} />
            <span style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--color-neutral-400)" }}>Resale movement we track before we price</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", borderTop: "1px solid var(--color-neutral-700)" }}>
            {MARKET.map((m) => (
              <div key={m.name} style={{ padding: "18px 20px", borderRight: "1px solid var(--color-neutral-700)", borderBottom: "1px solid var(--color-neutral-700)" }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--color-neutral-400)" }}>{m.name}</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginTop: 8 }}>
                  <span style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 22, letterSpacing: "-0.02em" }}>{m.price}</span>
                  <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.06em", color: m.up ? "var(--color-accent-400)" : "var(--color-neutral-400)" }}>{m.delta}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ borderBottom: "2px solid var(--color-text)" }}>
        <div style={{ maxWidth: 1560, margin: "0 auto", padding: "44px 28px 20px", display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24 }}>
          <h2 style={{ margin: 0, fontSize: "clamp(26px,3vw,42px)", lineHeight: 1, letterSpacing: "-0.035em", textTransform: "uppercase" }}>In stock now</h2>
          <Link href="/shop" className="btn btn-ghost" style={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", flex: "none" }}>Filter by size →</Link>
        </div>
        <div style={{ maxWidth: 1560, margin: "0 auto", padding: "22px 28px 56px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(248px,1fr))", borderTop: "2px solid var(--color-text)", borderLeft: "2px solid var(--color-text)" }}>
            {homeGrid.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
          <div style={{ display: "flex", justifyContent: "flex-start", marginTop: 28 }}>
            <Link href="/shop" className="btn btn-secondary" style={{ height: 50, paddingInline: 22, borderWidth: 2, borderColor: "var(--color-text)", color: "var(--color-text)", fontSize: 12, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", justifyContent: "flex-start" }}>
              Load the full inventory ({PRODUCTS.length})
            </Link>
          </div>
        </div>
      </section>

      <section style={{ borderBottom: "2px solid var(--color-text)" }}>
        <div style={{ maxWidth: 1560, margin: "0 auto", padding: "44px 28px 48px" }}>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--color-accent)", marginBottom: 20 }}>Stories</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0, borderTop: "2px solid var(--color-text)", borderLeft: "2px solid var(--color-text)" }}>
            <div style={{ borderRight: "2px solid var(--color-text)", borderBottom: "2px solid var(--color-text)", display: "grid", gridTemplateColumns: ".9fr 1.1fr" }}>
              <div className="grayscale" style={{ background: "var(--color-neutral-200)", minHeight: 260, minWidth: 0, position: "relative" }}>
                <ImageSlot id="gg-story-1" placeholder="Drop a shot of the month's most-wanted pair" />
              </div>
              <div style={{ padding: "26px 24px", display: "flex", flexDirection: "column" }}>
                <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--color-accent)", marginBottom: 12 }}>Most wanted</div>
                <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 22, lineHeight: 1.15, letterSpacing: "-0.02em", marginBottom: 10, textWrap: "pretty" }}>
                  What Dubai asked us for most this month
                </div>
                <div style={{ fontSize: 13, lineHeight: 1.55, color: "var(--color-neutral-700)", textWrap: "pretty" }}>
                  Reverse Mocha lows took the top spot for the third month running, Panda Dunks refuse to die, and Air Dior enquiries tripled after the Mall of the Emirates pop-up.
                </div>
                <Link href="/shop" className="btn btn-ghost" style={{ marginTop: "auto", alignSelf: "flex-start", paddingLeft: 0, fontSize: 11, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase" }}>Read →</Link>
              </div>
            </div>
            <div style={{ borderRight: "2px solid var(--color-text)", borderBottom: "2px solid var(--color-text)", display: "grid", gridTemplateColumns: ".9fr 1.1fr" }}>
              <div className="grayscale" style={{ background: "var(--color-neutral-200)", minHeight: 260, minWidth: 0, position: "relative" }}>
                <ImageSlot id="gg-story-2" placeholder="Drop a cleaning / care shot" />
              </div>
              <div style={{ padding: "26px 24px", display: "flex", flexDirection: "column" }}>
                <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--color-accent)", marginBottom: 12 }}>Care guide</div>
                <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 22, lineHeight: 1.15, letterSpacing: "-0.02em", marginBottom: 10, textWrap: "pretty" }}>
                  Keeping white leather white in 45°C
                </div>
                <div style={{ fontSize: 13, lineHeight: 1.55, color: "var(--color-neutral-700)", textWrap: "pretty" }}>
                  Heat yellows midsoles faster than wear does. Never leave a pair in the car, never store them in direct sun, and keep the silica packs that come in the box.
                </div>
                <Link href="/trust" className="btn btn-ghost" style={{ marginTop: "auto", alignSelf: "flex-start", paddingLeft: 0, fontSize: 11, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase" }}>Read →</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ borderBottom: "2px solid var(--color-text)" }}>
        <div style={{ maxWidth: 1560, margin: "0 auto", padding: "48px 28px" }}>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--color-accent)", marginBottom: 14 }}>How ordering works</div>
          <h2 style={{ margin: "0 0 32px", fontSize: "clamp(26px,3vw,44px)", lineHeight: 1, letterSpacing: "-0.035em", textTransform: "uppercase" }}>
            No card. No account.<br />Four steps.
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", borderTop: "2px solid var(--color-text)" }}>
            {STEPS.map((s) => (
              <div key={s.n} style={{ padding: "24px 24px 28px 0", borderRight: "2px solid var(--color-divider)" }}>
                <div style={{ fontFamily: "var(--font-heading)", fontWeight: 900, fontSize: 15, letterSpacing: "0.1em", color: "var(--color-accent)", marginBottom: 14 }}>{s.n}</div>
                <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 18, lineHeight: 1.2, marginBottom: 8 }}>{s.t}</div>
                <div style={{ fontSize: 13, lineHeight: 1.55, color: "var(--color-neutral-700)", textWrap: "pretty" }}>{s.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ borderBottom: "2px solid var(--color-text)" }}>
        <div style={{ maxWidth: 1560, margin: "0 auto", padding: "40px 28px 20px", display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 20, flexWrap: "wrap" }}>
          <h2 style={{ margin: 0, fontSize: "clamp(22px,2.4vw,32px)", lineHeight: 1, letterSpacing: "-0.03em", textTransform: "uppercase" }}>@gulfgrails</h2>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--color-neutral-600)" }}>Every pair we ship gets posted</span>
        </div>
        <div style={{ maxWidth: 1560, margin: "0 auto", padding: "16px 28px 48px", display: "grid", gridTemplateColumns: "repeat(6,1fr)", borderTop: "2px solid var(--color-text)", borderLeft: "2px solid var(--color-text)" }}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="grayscale" style={{ borderRight: "2px solid var(--color-text)", borderBottom: "2px solid var(--color-text)", aspectRatio: "1/1", minWidth: 0, background: "var(--color-neutral-200)", position: "relative" }}>
              <ImageSlot id={`gg-ig-${i}`} placeholder="Instagram post" />
            </div>
          ))}
        </div>
      </section>

      <section style={{ background: "var(--color-accent)", color: "#fff", borderBottom: "2px solid var(--color-text)" }}>
        <div style={{ maxWidth: 1560, margin: "0 auto", padding: "64px 28px" }}>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", opacity: 0.85, marginBottom: 22 }}>Gulf Grails guarantee</div>
          <h2 style={{ margin: 0, fontSize: "clamp(38px,6vw,96px)", lineHeight: 0.92, letterSpacing: "-0.045em", textTransform: "uppercase", maxWidth: "22ch" }}>
            Every pair verified. Or your money back.
          </h2>
          <div style={{ display: "flex", gap: 12, marginTop: 38, flexWrap: "wrap" }}>
            <Link href="/trust" className="btn" style={{ background: "#fff", color: "var(--color-accent-700)", height: 50, paddingInline: 20, fontSize: 12, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", justifyContent: "flex-start", border: 0 }}>
              How we verify →
            </Link>
            <a href={waLink("Hello Gulf Grails, I have a question about a pair.")} target="_blank" rel="noopener" className="btn" style={{ background: "transparent", color: "#fff", border: "2px solid #fff", height: 50, paddingInline: 20, fontSize: 12, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", justifyContent: "flex-start" }}>
              Message us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
