import type { Metadata } from "next";
import { getCatalogue } from "@/lib/catalogue";
import PageHead from "@/components/house/editorial/PageHead";
import SellForm from "@/components/house/editorial/SellForm";
import s from "@/components/house/editorial/editorial.module.css";

export const metadata: Metadata = {
  title: "Sell to the house",
  description:
    "We buy grails in Dubai. Tell us the model, size and condition, see an indicative band before you send anything, and get paid the same day we collect.",
  alternates: { canonical: "/sell" },
};

const TERMS = [
  ["What we buy", "Deadstock and lightly worn grails — Jordan, Nike collabs, Yeezy, Balenciaga, and anything luxury. If it is not something we would list, we will tell you straight away rather than lowball you."],
  ["How we pay", "Bank transfer the same day we collect, or cash at the Jumeirah room if you would rather. No consignment, no waiting for it to sell, no fee taken off the back."],
  ["Collection", "We come to you anywhere in Dubai, usually within a day. Other emirates by courier at our cost."],
  ["The number", "Quoted after we look at the pair, and it does not move afterwards. If we say a figure and then find something on inspection, we tell you and you can walk away with the pair."],
] as const;

/**
 * Selling to the house.
 *
 * This was a nav link to a page of copy. It is now a real flow: say what you
 * have, see a number before you commit to anything, and hand off to WhatsApp
 * with all of it already typed.
 */
export default async function SellPage() {
  const catalogue = await getCatalogue();

  return (
    <div className={s.page}>
      <PageHead
        kicker="Sell to the house"
        title={<>We buy grails. In Dubai, in cash, today.</>}
        standfirst="Tell us what you are holding and you will see an indicative band before you send a single photograph. Nothing here commits you to anything."
        photo="/assets/campaign/air-dior-flatlay.jpg"
        photoAlt="A pair photographed on the table"
      />

      <div className={s.body}>
        <section className={s.section}>
          <h2 className={s.h2}>What have you got?</h2>
          <SellForm catalogue={catalogue} />
        </section>

        <section className={s.section}>
          <h2 className={s.h2}>How it works</h2>
          <dl className={s.facts}>
            {TERMS.map(([term, desc]) => (
              <div key={term} className={s.fact}>
                <dt>{term}</dt>
                <dd>{desc}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </div>
  );
}
