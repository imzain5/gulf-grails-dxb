import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CHECKS } from "@/data/content";
import { getCatalogue } from "@/lib/catalogue";
import {
  certificateRef,
  certificateUrl,
  hasRecord,
  recordDate,
  recordScope,
} from "@/lib/certificate";
import Frame from "@/components/house/Frame";
import QrCode from "@/components/house/QrCode";
import { Button, Label, Tag } from "@/components/house/primitives";
import s from "@/components/house/verify/verify.module.css";

/**
 * The authentication record for one listing, at a public URL.
 *
 * This is the page a QR code on the card in the box opens. Its whole value is
 * that it can be reached by someone who is holding the shoe and did not buy it
 * from us — a friend, a buyer two years later, someone in a shop deciding
 * whether the card means anything. So it renders for a sold-out listing as
 * readily as a held one, it needs no account, and it states plainly what was
 * checked, when, and by whom.
 *
 * It exists only where a record exists. See lib/certificate.ts: a pair with no
 * date and no initials has no page, because there is nothing to show. That is
 * deliberate and it is the feature — a certificate every listing gets
 * automatically is a graphic, not evidence.
 */

export const revalidate = 3600;

export async function generateStaticParams() {
  const catalogue = await getCatalogue();
  return catalogue.filter(hasRecord).map((p) => ({ id: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = (await getCatalogue()).find((p) => p.id === id);
  if (!product || !hasRecord(product)) return { title: "Record not found" };

  const ref = certificateRef(product.id);
  return {
    title: `${ref} · ${product.name}`,
    description: `Authentication record for ${product.name}${
      product.colorway ? ` (${product.colorway})` : ""
    }. Six checks run in Jumeirah on ${recordDate(product.verifiedOn)}.`,
    alternates: { canonical: `/verify/${product.id}` },
    // A record is looked up, not browsed. Keeping it out of the index stops
    // thirty near-identical pages competing with the listings that sell.
    robots: { index: false, follow: true },
  };
}

export default async function VerifyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = (await getCatalogue()).find((p) => p.id === id);
  if (!product || !hasRecord(product)) notFound();

  const ref = certificateRef(product.id);
  const checked = recordDate(product.verifiedOn);
  const photo = product.photos?.[0] ?? null;

  return (
    <div className={s.page}>
      <div className={s.sheet}>
        {/* ── the header of the record ──────────────────────────────── */}
        <header className={s.head}>
          <div className={s.headText}>
            <Label tone="brass">Authentication record</Label>
            <p className={s.ref}>{ref}</p>
            <h1 className={s.title}>{product.name}</h1>
            {product.colorway && <p className={s.colorway}>{product.colorway}</p>}
          </div>

          <div className={s.qr}>
            <QrCode text={certificateUrl(product.id)} size={112} />
            <span className={s.qrNote}>Scans back to this page</span>
          </div>
        </header>

        {/* ── what was checked, and by whom ─────────────────────────── */}
        <section className={s.stated}>
          <Tag tone="brass">Checked in Jumeirah</Tag>
          <p className={s.statedLine}>
            The six checks were run on this{" "}
            {product.stock === 1 ? "pair" : "listing"} on <strong>{checked}</strong> by{" "}
            <strong>{product.verifiedBy}</strong>.
          </p>
          <p className={s.scope}>{recordScope(product)}</p>
        </section>

        <div className={s.body}>
          {photo && (
            <div className={s.shot}>
              <Frame
                src={photo}
                alt={`${product.name}, photographed on our table`}
                ratio="4:3"
                sizes="(max-width: 860px) 100vw, 40vw"
                pad="8%"
                priority
              />
              <span className={s.shotNote}>Shot on our own table before listing.</span>
            </div>
          )}

          <div className={s.cols}>
            {/* ── the pair ───────────────────────────────────────── */}
            <section className={s.block}>
              <h2 className={s.h2}>The pair</h2>
              <dl className={s.facts}>
                <div className={s.fact}><dt>Brand</dt><dd>{product.brand || "—"}</dd></div>
                <div className={s.fact}><dt>Style code</dt><dd>{product.sku || "—"}</dd></div>
                <div className={s.fact}><dt>Released</dt><dd>{product.year || "—"}</dd></div>
                <div className={s.fact}>
                  <dt>Sizes</dt>
                  <dd>{product.sizes.length ? `EU ${product.sizes.join(", ")}` : "—"}</dd>
                </div>
                <div className={s.fact}><dt>Reference</dt><dd>{ref}</dd></div>
              </dl>
            </section>

            {/* ── condition ──────────────────────────────────────── */}
            <section className={s.block}>
              <h2 className={s.h2}>Condition</h2>
              <dl className={s.facts}>
                <div className={s.fact}>
                  <dt>Grade</dt>
                  <dd>{product.condition ?? <span className={s.none}>Not recorded</span>}</dd>
                </div>
                <div className={s.fact}>
                  <dt>Box</dt>
                  <dd>{product.boxNote ?? <span className={s.none}>Not recorded</span>}</dd>
                </div>
              </dl>

              {product.flaws === undefined ? (
                <p className={s.none}>
                  Flaws were not logged separately for this pair.
                </p>
              ) : product.flaws.length === 0 ? (
                <p className={s.clean}>Checked for flaws; none found.</p>
              ) : (
                <ul className={s.flaws}>
                  {product.flaws.map((f) => <li key={f}>{f}</li>)}
                </ul>
              )}
            </section>
          </div>

          {/* ── the checks themselves ────────────────────────────── */}
          <section className={s.block}>
            <h2 className={s.h2}>What was run</h2>
            <ol className={s.checks}>
              {CHECKS.map((c) => (
                <li key={c.n} className={s.check}>
                  <span className={s.checkNum}>{c.n}</span>
                  <span className={s.checkBody}>
                    <b>{c.t}.</b> {c.d}
                  </span>
                </li>
              ))}
            </ol>
          </section>

          {/* ── what this is not ─────────────────────────────────── */}
          <section className={s.caveat}>
            <h2 className={s.h3}>What this record is, and is not</h2>
            <p>
              It is our own record of the checks our own people ran, published so
              you can read it rather than take our word for it. It is not a
              third-party certificate, and we are not an accredited
              authentication service.
            </p>
            <p>
              If anything here does not match the pair in front of you — the
              style code, the size run, the flaws listed — that is worth a
              message. Quote {ref}.
            </p>
          </section>

          <div className={s.actions}>
            <Button href={`/product/${product.id}`}>
              {product.stock > 0 ? "See the listing" : "See what it was"}
            </Button>
            <Button variant="ghost" href="/authentication">How we authenticate</Button>
          </div>

          <p className={s.foot}>
            Record {ref} · Gulf Grails, Jumeirah 1, Dubai ·{" "}
            <Link href="/verify">about these records</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
