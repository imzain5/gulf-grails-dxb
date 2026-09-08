import type { Metadata } from "next";
import { MODEL_PRESETS } from "@/data/models";
import { euToUk, euToUs } from "@/lib/sizes";
import { getCatalogue } from "@/lib/catalogue";
import PageHead from "@/components/house/editorial/PageHead";
import Closing from "@/components/house/editorial/Closing";
import s from "@/components/house/editorial/editorial.module.css";

export const metadata: Metadata = {
  title: "Size & fit",
  description:
    "EU, US and UK conversions, and how each model actually fits — Jordan 1 runs true, Yeezy 350 runs half small, Balenciaga runs a full size large.",
  alternates: { canonical: "/size-guide" },
};

/**
 * Sizing, per model rather than per brand.
 *
 * A single conversion table is table stakes and answers almost nothing: the
 * question is never "what is EU 43 in US", it is "do I take my normal size in
 * this shoe". The fit notes come from `data/models.ts`, which already carries
 * one for every silhouette the shop sells — the same notes that show while
 * listing a pair, so what staff read and what a customer reads cannot drift.
 */
export default async function SizeGuidePage() {
  const catalogue = await getCatalogue();

  // Every size the shop actually holds, so the table matches the stockroom.
  const sizes = [...new Set(catalogue.flatMap((p) => p.sizes))].sort((a, b) => a - b);

  // Fit notes, most relevant first: shapes currently in stock lead.
  const held = new Set(catalogue.map((p) => p.fam));
  const fits = MODEL_PRESETS.filter((m) => m.fit)
    .sort((a, b) => Number(held.has(b.fam)) - Number(held.has(a.fam)) || a.name.localeCompare(b.name));

  return (
    <div className={s.page}>
      <PageHead
        kicker="Size &amp; fit"
        title={<>Take your normal size. Except when you shouldn&apos;t.</>}
        standfirst="Conversions are the easy half. The half that matters is whether a given shape runs long, short or narrow — so that is written out per model below."
      />

      <div className={s.body}>
        <section className={s.section}>
          <h2 className={s.h2}>Conversions</h2>
          <div className={s.measure}>
            <p className={s.p}>
              We list in EU, because that is what is printed inside almost everything we hold. US
              and UK below are the men&apos;s equivalents.
            </p>
          </div>
          <div className={s.tableWrap}>
            <table className={s.table}>
              <thead>
                <tr><th>EU</th><th>US</th><th>UK</th><th>Held in</th></tr>
              </thead>
              <tbody>
                {sizes.map((eu) => {
                  const n = catalogue.filter((p) => p.sizes.includes(eu) && p.stock > 0).length;
                  return (
                    <tr key={eu}>
                      <td>{eu}</td>
                      <td>{euToUs(eu)}</td>
                      <td>{euToUk(eu)}</td>
                      <td>{n === 0 ? "—" : `${n} pairs`}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <section className={s.section}>
          <h2 className={s.h2}>How each shape fits</h2>
          <div className={s.measure}>
            <p className={s.p}>
              Written from what comes back and what does not. If a model is not here, ask — we
              have almost certainly had a pair through the room.
            </p>
          </div>
          <div className={s.fits}>
            {fits.map((m) => (
              <div key={m.key} className={s.fit}>
                <span className={s.fitName}>{m.name}</span>
                <p className={s.fitNote}>{m.fit}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <Closing
        line="Between two sizes and not sure? Tell us the model and what you normally take, and we will tell you which one to order — we would rather advise than process an exchange."
        message="Hello Gulf Grails, I need help picking a size."
        action={{ label: "See what is held", href: "/shop" }}
      />
    </div>
  );
}
