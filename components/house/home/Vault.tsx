import Link from "next/link";
import { coverPhoto, type Product } from "@/data/products";
import Frame from "../Frame";
import Reveal from "../Reveal";
import SectionHeader from "../SectionHeader";
import { Price, Tag } from "../primitives";
import s from "./home.module.css";

/**
 * The Vault, promoted to the second thing on the page.
 *
 * This is the differentiator — single-pair holdings, presented as lots rather
 * than products — so it comes before the grid of everything, not after it.
 * Three at most: a vault with a dozen things in it is a shelf.
 *
 * The section pins itself to the ink ground in both modes. Everywhere else
 * follows the visitor's theme; this room does not.
 */
export default function Vault({ lots }: { lots: Product[] }) {
  if (lots.length === 0) return null;

  return (
    <section className={`${s.act} ${s.vault}`}>
      <div className={`${s.shell} ${s.actIn}`}>
        <SectionHeader
          kicker="The Vault"
          title="Nothing here comes back."
          note="Single holdings, physically in Jumeirah. Each is the only one we will have — a vault lot is never restocked, and when it leaves the listing goes with it."
          action={{ label: "All vault lots", href: "/vault" }}
        />

        <div className={s.lots}>
          {lots.slice(0, 3).map((p, i) => (
            <Reveal key={p.id} delay={i * 60}>
              <article className={s.lot}>
                <Link href={`/product/${p.id}`} aria-label={p.name}>
                  <Frame
                    src={coverPhoto(p)}
                    alt={p.name}
                    ratio="4:5"
                    sizes="(max-width: 900px) 100vw, 30vw"
                    zoom
                  />
                </Link>

                <div className={s.lotHead}>
                  <Tag tone="brass">Lot {String(i + 1).padStart(3, "0")}</Tag>
                  <Price amount={p.price} />
                </div>

                <Link href={`/product/${p.id}`} className={s.lotName}>{p.name}</Link>

                {/* The pair's own line, written for it — not a generated one. */}
                <p className={s.provenance}>{p.blurb}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
