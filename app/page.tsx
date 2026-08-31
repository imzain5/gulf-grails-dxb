import Link from "next/link";
import Image from "next/image";
import { PRODUCTS, findProduct } from "@/data/products";
import { CHECKS, HOUSES, MARKET, REVIEWS } from "@/data/content";
import { STORY_SHOTS } from "@/lib/editorial";
import { money } from "@/lib/money";
import { waLink } from "@/lib/whatsapp";
import RecentlyViewed from "@/components/RecentlyViewed";
import HomeHero from "@/components/home/HomeHero";
import DropStrip from "@/components/home/DropStrip";
import CollectionGrid from "@/components/home/CollectionGrid";
import CampaignBand from "@/components/home/CampaignBand";
import Vault from "@/components/home/Vault";
import EditorialGallery from "@/components/home/EditorialGallery";
import Rise from "@/components/home/Rise";

const ARROW = (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" /><path d="m13 6 6 6-6 6" />
  </svg>
);

/**
 * A line of type doing the work a section header usually does.
 *
 * These are the page's punctuation: no card, no image, no button — a claim set
 * large enough to be the only thing on screen, with a hairline under it. They
 * are what turn a sequence of product rows into an editorial.
 */
function Statement({
  children, note, ground = "paper", photo,
}: {
  children: React.ReactNode;
  note?: string;
  ground?: "paper" | "ink";
  /** Optional campaign photograph set beside the claim. */
  photo?: { src: string; alt: string; position?: string };
}) {
  const dark = ground === "ink";
  const body = (
    <Rise>
      <h2 className="hp-display hp-statement" style={{ maxWidth: "16ch" }}>{children}</h2>
      {note && (
        <p className={`hp-body ${dark ? "hp-body-light" : ""}`} style={{ margin: "clamp(26px,3vw,44px) 0 0", maxWidth: "44ch" }}>
          {note}
        </p>
      )}
    </Rise>
  );

  return (
    <section
      className={dark ? "hp-dark" : undefined}
      style={{
        background: dark ? undefined : "var(--color-bg)",
        borderBottom: `1px solid ${dark ? "var(--hp-line-dark)" : "var(--hp-line)"}`,
      }}
    >
      {photo ? (
        <div
          className="hp-shell hp-asym"
          style={{ paddingBlock: "var(--hp-section)", alignItems: "center", "--hp-cols": "1.15fr 1fr", "--hp-gap": "clamp(34px, 5vw, 88px)" } as React.CSSProperties}
        >
          {body}
          <Rise variant="mask" className="hp-frame hp-zoom" style={{ aspectRatio: "4 / 5" }}>
            <Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 900px) 100vw, 42vw" style={{ objectFit: "cover", objectPosition: photo.position ?? "center" }} />
          </Rise>
        </div>
      ) : (
        <div className="hp-shell" style={{ paddingBlock: "var(--hp-section)" }}>{body}</div>
      )}
    </section>
  );
}

/** Kicker + headline + one link out, shared by the product sections. */
function SectionHead({
  kicker, title, action, note,
}: {
  kicker: string;
  title: React.ReactNode;
  action?: { label: string; href: string };
  note?: string;
}) {
  return (
    <Rise>
      <div
        style={{
          display: "flex", alignItems: "flex-end", justifyContent: "space-between",
          gap: "clamp(20px, 4vw, 60px)", flexWrap: "wrap", marginBottom: "clamp(34px, 4.4vw, 68px)",
        }}
      >
        <div style={{ minWidth: 0 }}>
          <div className="hp-label hp-label-accent" style={{ marginBottom: 20 }}>{kicker}</div>
          <h2 className="hp-display hp-section-head" style={{ maxWidth: "18ch" }}>{title}</h2>
          {note && <p className="hp-body" style={{ margin: "22px 0 0", maxWidth: "42ch" }}>{note}</p>}
        </div>
        {action && (
          <Link href={action.href} className="hp-link" style={{ flex: "none" }}>
            {action.label}
            {ARROW}
          </Link>
        )}
      </div>
    </Rise>
  );
}

export default function HomePage() {
  // The vault is defined by price rather than a hand-kept list, so a new grail
  // lands in it on its own.
  const vault = [...PRODUCTS].filter((p) => p.price >= 10000).sort((a, b) => b.price - a.price).slice(0, 4);
  const vaultIds = new Set(vault.map((p) => p.id));
  const travis = PRODUCTS.filter((p) => p.fam === "Travis Scott");
  const offWhite = PRODUCTS.filter((p) => p.fam === "Off-White");

  // The curated row leads with the pairs carrying a badge, then fills.
  const curated = [
    ...PRODUCTS.filter((p) => p.drop && !vaultIds.has(p.id)),
    ...PRODUCTS.filter((p) => !p.drop && !vaultIds.has(p.id)),
  ].slice(0, 8);

  const cheapest = Math.min(...PRODUCTS.map((p) => p.price));

  return (
    <div data-screen-label="Home">
      <HomeHero />
      <DropStrip />

      <Statement note="Thirty pairs, physically in the Al Quoz stockroom. Not a marketplace and not a dropship line — if a size shows on this site, it is in our hands and photographed on our own table.">
        The pairs you thought you missed.
      </Statement>

      {travis.length > 0 && (
        <CampaignBand
          kicker="The Travis drop"
          title={<>Cactus Jack,<br />on the shelf.</>}
          body="The reversed swoosh that changed the hobby, and the low that outsells everything else we carry. Four Travis pairs in the stockroom right now, from the AED 2,900 Air Force 1 to the 2019 Mocha high."
          href="/shop?fam=Travis+Scott"
          cta="Explore the collection"
          lead={findProduct("ts-aj1-high")}
          support={travis.filter((p) => p.id !== "ts-aj1-high").slice(0, 3)}
        />
      )}

      {vault.length > 0 && <Vault products={vault} />}

      <section style={{ borderBottom: "1px solid var(--hp-line)" }}>
        <div className="hp-shell" style={{ paddingBlock: "var(--hp-section)" }}>
          <SectionHead
            kicker="In the stockroom"
            title="Ready to wear this week"
            action={{ label: `All ${PRODUCTS.length} pairs`, href: "/shop" }}
          />
          <CollectionGrid products={curated} columns={4} />
        </div>
      </section>

      {offWhite.length > 0 && (
        <CampaignBand
          kicker="The archive"
          title={<>Virgil&apos;s ten,<br />and what followed.</>}
          body="The Ten Chicago that started deconstruction, Lot 01 of the fifty-pair Dunk series, and the Volt Air Force 1 from the 2018 run. Held with their zip ties, tags and both lace sets."
          href="/shop?fam=Off-White"
          cta="See the archive"
          lead={findProduct("ow-aj1")}
          support={offWhite.filter((p) => p.id !== "ow-aj1").slice(0, 3)}
          flip
        />
      )}

      <Statement
        ground="ink"
        note="Al Quoz 1, Dubai. Viewing by appointment. Same-day delivery across the city, next day to every other emirate, and you pay the courier once the box is open and the pair is on your feet."
        photo={{ src: "/assets/campaign/air-dior-onfoot.jpg", alt: "Air Dior on foot", position: "center 55%" }}
      >
        Physically stocked in Dubai.
      </Statement>

      {/* ── authenticity, told visually ─────────────────────────────────── */}
      <section style={{ borderBottom: "1px solid var(--hp-line)" }}>
        <div className="hp-shell" style={{ paddingBlock: "var(--hp-section)" }}>
          <div
            className="hp-asym"
            style={{ "--hp-cols": "1fr 1.1fr", "--hp-gap": "clamp(34px, 5vw, 96px)", alignItems: "start" } as React.CSSProperties}
          >
            <div className="hp-sticky">
              <Rise>
                <div className="hp-label hp-label-accent" style={{ marginBottom: 20 }}>Authentication</div>
                <h2 className="hp-display hp-section-head" style={{ marginBottom: 26 }}>
                  Six checks,<br />every pair.
                </h2>
                <p className="hp-body" style={{ margin: "0 0 34px", maxWidth: "38ch" }}>
                  Nothing is drop-shipped. Every pair passes through our hands, gets photographed and
                  logged, and is checked against a known-good reference from the same production run.
                  If a pair you buy from us is ever proven fake, you get a full refund plus the
                  delivery fee.
                </p>
                <Link href="/trust" className="hp-link">
                  How we verify
                  {ARROW}
                </Link>
              </Rise>

              <Rise delay={120} variant="mask" className="hp-frame" style={{ marginTop: "clamp(30px, 4vw, 52px)", aspectRatio: "4 / 5" }}>
                <Image
                  src="/assets/campaign/air-dior-outsoles.jpg"
                  alt="Translucent Dior outsoles held up to the light"
                  fill
                  sizes="(max-width: 900px) 100vw, 42vw"
                  style={{ objectFit: "cover", objectPosition: "center 45%" }}
                />
              </Rise>
            </div>

            <ol style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {CHECKS.map((c, i) => (
                <Rise as="li" key={c.n} delay={i * 60}>
                  <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "clamp(18px, 2.6vw, 44px)", paddingBlock: "clamp(22px, 2.6vw, 34px)", borderTop: i === 0 ? "1px solid var(--hp-line)" : undefined, borderBottom: "1px solid var(--hp-line)" }}>
                    <span className="gg-figure" style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 12, letterSpacing: "0.14em", color: "var(--color-accent)", paddingTop: 4 }}>
                      {c.n}
                    </span>
                    <div>
                      <h3 className="hp-card-name" style={{ fontSize: "clamp(16px,1.5vw,20px)", marginBottom: 10 }}>{c.t}</h3>
                      <p className="hp-body" style={{ margin: 0, fontSize: 14 }}>{c.d}</p>
                    </div>
                  </div>
                </Rise>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ── houses ──────────────────────────────────────────────────────── */}
      <section style={{ borderBottom: "1px solid var(--hp-line)" }}>
        <div className="hp-shell" style={{ paddingBlock: "var(--hp-section)" }}>
          <SectionHead kicker="By house" title="Where to start" />
          <div
            className="hp-grid"
            style={{ "--n": 5, "--n-md": 3, "--n-sm": 2, "--n-xs": 2, "--hp-gap": "clamp(16px, 2vw, 34px)" } as React.CSSProperties}
          >
            {HOUSES.map((h, i) => {
              const face = findProduct(h.pid);
              const count = PRODUCTS.filter((p) =>
                h.fam === "Dunk" ? p.brand === "Nike" : h.fam === "Jordan 1" ? p.brand === "Air Jordan" : p.fam === h.fam,
              ).length;
              return (
                <Rise key={h.key} delay={i * 60}>
                  <Link href={`/shop?fam=${encodeURIComponent(h.fam)}`} className="hp-frame hp-zoom" style={{ color: "inherit", display: "block" }}>
                    <span style={{ position: "relative", display: "block", aspectRatio: "1 / 1", background: "var(--hp-paper)" }}>
                      {face.photos && (
                        <Image
                          className="gg-photo"
                          src={face.photos[0]}
                          alt=""
                          aria-hidden
                          fill
                          sizes="(max-width: 760px) 50vw, 20vw"
                          style={{ objectFit: "contain", padding: "10%" }}
                        />
                      )}
                    </span>
                    <span style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 10, marginTop: 16 }}>
                      <span className="hp-card-name">{h.label}</span>
                      <span className="hp-label" style={{ letterSpacing: "0.16em" }}>{count}</span>
                    </span>
                  </Link>
                </Rise>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── journal ─────────────────────────────────────────────────────── */}
      <section style={{ borderBottom: "1px solid var(--hp-line)" }}>
        <div className="hp-shell" style={{ paddingBlock: "var(--hp-section)" }}>
          <SectionHead kicker="Journal" title="From the stockroom" />
          <div className="hp-grid" style={{ "--n": 2, "--n-sm": 1, "--n-xs": 1, "--hp-gap": "clamp(28px, 4vw, 72px)" } as React.CSSProperties}>
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
                kicker: "Care",
                title: "Keeping white leather white in 45°C",
                body: "Heat yellows midsoles faster than wear does. Never leave a pair in the car, never store them in direct sun, and keep the silica packs that come in the box.",
                href: "/trust",
                photo: "/assets/campaign/air-dior-white.jpg",
              },
            ].map((s, i) => {
              const p = findProduct(s.shot.pid);
              return (
                <Rise key={s.title} delay={i * 110}>
                  <Link href={s.href} style={{ color: "inherit", display: "block" }}>
                    <span className="hp-frame hp-zoom" style={{ display: "block", aspectRatio: "16 / 10", background: "transparent" }}>
                      {s.photo ? (
                        /* A campaign photograph fills the frame; a studio
                           cut-out is contained and blended. */
                        <Image src={s.photo} alt="" aria-hidden fill sizes="(max-width: 760px) 100vw, 46vw" style={{ objectFit: "cover" }} />
                      ) : p.photos && (
                        <Image
                          className="gg-photo"
                          src={p.photos[0]}
                          alt=""
                          aria-hidden
                          fill
                          sizes="(max-width: 760px) 100vw, 46vw"
                          style={{ objectFit: "contain", padding: "5%" }}
                        />
                      )}
                    </span>
                    <span className="hp-label hp-label-accent" style={{ display: "block", margin: "24px 0 14px" }}>{s.kicker}</span>
                    <span className="hp-display" style={{ display: "block", fontSize: "clamp(20px,2.1vw,30px)", lineHeight: 1.02, marginBottom: 14, letterSpacing: "-0.03em" }}>
                      {s.title}
                    </span>
                    <span className="hp-body" style={{ display: "block", maxWidth: "46ch" }}>{s.body}</span>
                  </Link>
                </Rise>
              );
            })}
          </div>
        </div>
      </section>

      <EditorialGallery />

      {/* ── the index and the voices ────────────────────────────────────── */}
      <section style={{ borderBottom: "1px solid var(--hp-line)" }}>
        <div className="hp-shell" style={{ paddingBlock: "var(--hp-section)" }}>
          <div className="hp-asym" style={{ "--hp-cols": "1fr 1.15fr", "--hp-gap": "clamp(40px, 5vw, 104px)" } as React.CSSProperties}>
            <div>
              <Rise>
                <div className="hp-label hp-label-accent" style={{ marginBottom: 20 }}>Grail index — last 7 days</div>
                <h2 className="hp-display hp-section-head" style={{ marginBottom: 34, maxWidth: "12ch" }}>
                  What the market did.
                </h2>
              </Rise>
              {MARKET.map((m, i) => (
                <Rise key={m.name} delay={i * 60}>
                  <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 18, paddingBlock: 18, borderTop: i === 0 ? "1px solid var(--hp-line)" : undefined, borderBottom: "1px solid var(--hp-line)" }}>
                    <span className="hp-label" style={{ letterSpacing: "0.14em", minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {m.name}
                    </span>
                    <span style={{ display: "flex", alignItems: "baseline", gap: 14, flex: "none" }}>
                      <span className="gg-figure" style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 15 }}>{m.price}</span>
                      <span className="gg-figure" style={{ fontSize: 12, fontWeight: 700, minWidth: 46, textAlign: "right", color: m.up ? "var(--color-accent)" : "color-mix(in srgb, #201e1d 45%, transparent)" }}>
                        {m.delta}
                      </span>
                    </span>
                  </div>
                </Rise>
              ))}
            </div>

            <div>
              <Rise>
                <div className="hp-label hp-label-accent" style={{ marginBottom: 20 }}>312 reviews · 4.9 average</div>
                <h2 className="hp-display hp-section-head" style={{ marginBottom: 34, maxWidth: "14ch" }}>
                  Bought once, then sent a friend.
                </h2>
              </Rise>
              {REVIEWS.map((r, i) => (
                <Rise key={r.name} delay={i * 80}>
                  <figure style={{ margin: 0, paddingBlock: "clamp(22px,2.4vw,30px)", borderTop: i === 0 ? "1px solid var(--hp-line)" : undefined, borderBottom: "1px solid var(--hp-line)" }}>
                    <blockquote style={{ margin: 0 }}>
                      <p style={{ margin: 0, fontSize: "clamp(15px,1.35vw,19px)", lineHeight: 1.5, letterSpacing: "-0.01em", textWrap: "pretty" }}>
                        &ldquo;{r.quote}&rdquo;
                      </p>
                    </blockquote>
                    <figcaption className="hp-label" style={{ marginTop: 16, letterSpacing: "0.18em" }}>
                      {r.name} — {r.place} · {r.pair}
                    </figcaption>
                  </figure>
                </Rise>
              ))}
            </div>
          </div>
        </div>
      </section>

      <RecentlyViewed />

      {/* ── closing statement ───────────────────────────────────────────── */}
      <section className="hp-dark">
        <div
          className="hp-shell"
          style={{ paddingTop: "var(--hp-section)", paddingBottom: "var(--hp-section-tight)" }}
        >
          <Rise>
            <div className="hp-label hp-label-accent" style={{ marginBottom: 26 }}>The Gulf Grails guarantee</div>
            <h2 className="hp-display hp-statement" style={{ maxWidth: "15ch", marginBottom: "clamp(34px, 4vw, 60px)" }}>
              Every pair verified, or your money back.
            </h2>
            <p className="hp-body hp-body-light" style={{ margin: "0 0 clamp(38px, 4.4vw, 62px)", maxWidth: "46ch" }}>
              Cash on delivery anywhere in the UAE, or bank transfer if you prefer. Open the box at
              the door, try both shoes on, and hand them straight back if the fit is wrong. No card,
              no account, nothing charged online.
            </p>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <Link href="/shop" className="hp-btn hp-btn-light">
                Shop the stockroom
                {ARROW}
              </Link>
              <a
                href={waLink("Hello Gulf Grails, I have a question about a pair.")}
                target="_blank"
                rel="noopener"
                className="hp-btn"
                style={{ background: "transparent", color: "var(--hp-paper)", borderColor: "color-mix(in srgb, #f3f2f2 34%, transparent)" }}
              >
                Message us
                {ARROW}
              </a>
            </div>

            <hr className="hp-hair" style={{ margin: "clamp(46px, 5vw, 78px) 0 30px" }} />
            <div style={{ display: "flex", gap: "clamp(20px, 4vw, 64px)", flexWrap: "wrap" }}>
              {[
                ["Al Quoz 1, Dubai", "Viewing by appointment"],
                ["Same day in Dubai", "Next day UAE-wide"],
                ["10am – 11pm", "On WhatsApp, every day"],
                [`From ${money(cheapest)}`, `${PRODUCTS.length} pairs in stock`],
              ].map(([a, b]) => (
                <div key={a}>
                  <div className="hp-card-name" style={{ fontSize: 14, marginBottom: 6 }}>{a}</div>
                  <div className="hp-label">{b}</div>
                </div>
              ))}
            </div>
          </Rise>
        </div>
      </section>
    </div>
  );
}
