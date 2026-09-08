import type { Product } from "@/data/products";
import LotCard from "../LotCard";
import Reveal from "../Reveal";
import SectionHeader from "../SectionHeader";
import s from "./home.module.css";

/**
 * Eight pairs, not thirty-two.
 *
 * This one section replaces three — "The Pairs", "In the Stockroom" and the
 * Travis Scott band. They were the same grid of the same catalogue introduced
 * three times, which reads as a shop proving it has stock rather than a house
 * showing what it holds.
 */
export default function CurrentlyHeld({
  products,
  total,
}: {
  products: Product[];
  total: number;
}) {
  return (
    <section className={s.act}>
      <div className={`${s.shell} ${s.actIn}`}>
        <SectionHeader
          kicker="Currently held"
          title="In the Jumeirah stockroom"
          note="Every pair on this site is physically in our hands, photographed on our own table. If a size shows, it exists."
          action={{ label: `All ${total} pairs`, href: "/shop" }}
        />
        <div className={s.grid}>
          {products.map((p, i) => (
            <Reveal key={p.id} delay={(i % 4) * 60}>
              <LotCard product={p} sizes="(max-width: 760px) 50vw, (max-width: 1100px) 33vw, 22vw" />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
