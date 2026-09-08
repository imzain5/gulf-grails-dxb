import type { Metadata } from "next";
import Link from "next/link";
import { getCatalogue } from "@/lib/catalogue";
import { isVaultLot, VAULT_FLOOR } from "@/lib/filter";
import { coverPhoto } from "@/data/products";
import { money } from "@/lib/money";
import Frame from "@/components/house/Frame";
import Reveal from "@/components/house/Reveal";
import SectionHeader from "@/components/house/SectionHeader";
import { Button, Price, Tag } from "@/components/house/primitives";
import s from "@/components/house/shop/vault.module.css";

export const metadata: Metadata = {
  title: "The Vault",
  description:
    "Single holdings, physically in Jumeirah. Each lot is the only one we will have — never restocked.",
  alternates: { canonical: "/vault" },
};

/**
 * The Vault as its own room.
 *
 * A lot per row rather than a grid: three across turns single holdings into a
 * product listing, which is the opposite of what the page is for. Each lot gets
 * its number, its photograph at size, its own written line and the four facts
 * a buyer at this price actually asks — year, style code, sizes held, and who
 * checked it.
 */
export default async function VaultPage() {
  const catalogue = await getCatalogue();
  const lots = catalogue.filter(isVaultLot).sort((a, b) => b.price - a.price);
  const total = lots.reduce((n, p) => n + p.price, 0);

  return (
    <div className={s.page}>
      <div className={s.head}>
        <SectionHeader
          kicker="The Vault"
          title="Nothing here comes back."
          note={`Everything we hold above ${money(VAULT_FLOOR)}. One of each, in the room in Jumeirah — a vault lot is never restocked, and when it leaves the listing goes with it.`}
          as="h1"
        />
        <span className={s.meta}>
          {lots.length} {lots.length === 1 ? "lot" : "lots"} · {money(total)} held
        </span>
      </div>

      {lots.length === 0 ? (
        <p className={s.empty}>
          The vault is empty right now. Tell us what you are hunting on WhatsApp and we will go
          and find it.
        </p>
      ) : (
        <ol className={s.lots}>
          {lots.map((p, i) => (
            <li key={p.id}>
              <Reveal delay={(i % 2) * 80}>
                <article className={s.lot}>
                  <Link href={`/product/${p.id}`} className={s.lotMedia} aria-label={p.name}>
                    <Frame
                      src={coverPhoto(p)}
                      alt={p.name}
                      ratio="4:3"
                      sizes="(max-width: 900px) 100vw, 52vw"
                      zoom
                      priority={i === 0}
                    />
                  </Link>

                  <div className={s.lotBody}>
                    <div className={s.lotTop}>
                      <Tag tone="brass">Lot {String(i + 1).padStart(3, "0")}</Tag>
                      {p.stock === 0 && <Tag tone="signal">Sold</Tag>}
                    </div>

                    <Link href={`/product/${p.id}`} className={s.lotName}>{p.name}</Link>
                    <Price amount={p.price} was={p.market} size="lg" />
                    <p className={s.lotLine}>{p.blurb}</p>

                    <dl className={s.facts}>
                      <div><dt>Released</dt><dd>{p.year}</dd></div>
                      <div><dt>Style</dt><dd>{p.sku || "—"}</dd></div>
                      <div><dt>Sizes held</dt><dd>EU {p.sizes.join(", ") || "—"}</dd></div>
                      <div>
                        <dt>Checked</dt>
                        <dd>
                          {p.verifiedOn
                            ? `${new Date(p.verifiedOn).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}${p.verifiedBy ? ` · ${p.verifiedBy}` : ""}`
                            : "Not yet recorded"}
                        </dd>
                      </div>
                    </dl>

                    <div className={s.lotActions}>
                      <Button href={`/product/${p.id}`}>View the lot</Button>
                    </div>
                  </div>
                </article>
              </Reveal>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
