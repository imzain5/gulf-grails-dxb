import type { Metadata } from "next";
import { getCatalogue } from "@/lib/catalogue";
import { money } from "@/lib/money";
import PageHead from "@/components/house/editorial/PageHead";
import Closing from "@/components/house/editorial/Closing";
import s from "@/components/house/editorial/editorial.module.css";

export const metadata: Metadata = {
  title: "The house",
  description:
    "A private house for grails, physically held in Jumeirah. Six checks, one pair, one chance — and you pay at your door.",
  alternates: { canonical: "/about" },
};

export default async function AboutPage() {
  const catalogue = await getCatalogue();
  const pairs = catalogue.reduce((n, p) => n + p.stock, 0);
  const cheapest = catalogue.length ? Math.min(...catalogue.map((p) => p.price)) : 0;
  const dearest = catalogue.length ? Math.max(...catalogue.map((p) => p.price)) : 0;

  return (
    <div className={s.page}>
      <PageHead
        kicker="The house"
        title={<>A room in Jumeirah, not a marketplace.</>}
        standfirst="Everything on this site is in our hands. Not a dropship line, not a listing from someone else's stockroom — a room you can come and stand in."
        photo="/assets/campaign/air-dior-onfoot.jpg"
        photoAlt="A pair on foot in Dubai"
      />

      <div className={s.body}>
        <section className={s.section}>
          <div className={s.measure}>
            <p className={s.p}>
              Most sneaker resale in this region is a phone and a WhatsApp group. Someone posts a
              photograph they did not take, of a pair they have not seen, and by the time it
              reaches you it has been sold twice. If it turns out wrong, the number stops
              answering.
            </p>
            <p className={s.p}>
              We built the opposite of that. Every pair is bought in, checked against a reference,
              photographed on our own table, and kept in one room until someone buys it. That is
              slower and it costs more, and it is the only way to say &ldquo;this is the exact pair
              that will arrive&rdquo; and mean it.
            </p>
            <p className={s.p}>
              <strong>You pay at your door.</strong> Cash to the courier once the box is open and
              the pair is on your feet, or a transfer before dispatch if you would rather. No card,
              no account, nothing taken up front. In a market where being asked to pay a stranger
              first is normal, that is the whole trust argument.
            </p>
          </div>
        </section>

        <section className={s.section}>
          <h2 className={s.h2}>Where it stands today</h2>
          <dl className={s.facts}>
            <div className={s.fact}>
              <dt>Held right now</dt>
              <dd>{catalogue.length} pairs listed · {pairs} in the room</dd>
            </div>
            <div className={s.fact}>
              <dt>Range</dt>
              <dd>{money(cheapest)} to {money(dearest)}</dd>
            </div>
            <div className={s.fact}>
              <dt>The room</dt>
              <dd>Jumeirah 1, Dubai<small>Viewing by appointment, 10am – 11pm every day</small></dd>
            </div>
            <div className={s.fact}>
              <dt>Delivery</dt>
              <dd>Same day across Dubai<small>Next day to every other emirate</small></dd>
            </div>
          </dl>
        </section>

        <section className={s.section}>
          <div className={s.measure}>
            <h2 className={s.h2}>What we will not do</h2>
            <p className={s.p}>
              We do not list a pair we have not physically checked. We do not relist a pair that
              failed authentication at a lower price — it goes back to whoever sent it. We do not
              publish review counts we cannot stand behind, and we do not quote a number and then
              move on it once you have travelled to us.
            </p>
          </div>
        </section>
      </div>

      <Closing
        line="Come and see a pair before you buy it, or ask us to find something we are not holding. Both are normal here."
        message="Hello Gulf Grails, I would like to arrange a viewing."
        action={{ label: "How we authenticate", href: "/authentication" }}
      />
    </div>
  );
}
