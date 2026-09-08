import type { Metadata } from "next";
import { SITE_CONFIG } from "@/lib/config";
import { money } from "@/lib/money";
import PageHead from "@/components/house/editorial/PageHead";
import Closing from "@/components/house/editorial/Closing";
import s from "@/components/house/editorial/editorial.module.css";

export const metadata: Metadata = {
  title: "Terms of sale",
  description: "What we commit to when you order, and what we ask of you.",
  alternates: { canonical: "/terms" },
};

/**
 * Terms of sale.
 *
 * Every clause here restates a commitment the site already makes somewhere
 * else — the delivery windows, the cash-on-delivery ceiling, the 48-hour
 * exchange, the authenticity guarantee — so that the page cannot contradict
 * the checkout or the returns page. The figures come from lib/config.ts for
 * the same reason.
 *
 * This is a plain-language statement of how the shop trades, not a lawyer's
 * document. Have it reviewed before launch.
 */
export default function TermsPage() {
  return (
    <div className={s.page}>
      <PageHead
        kicker="Terms of sale"
        title={<>What we commit to, and what we ask.</>}
        standfirst="Plain language, because terms nobody reads protect nobody."
        small
      />

      <div className={s.body}>
        <section className={s.section}>
          <div className={s.measure}>
            <h2 className={s.h2}>The pair</h2>
            <p className={s.p}>
              Everything listed is physically in our stockroom when you order it. The photographs
              on a listing are of that pair, taken by us. If a listing is wrong — the wrong size,
              the wrong colourway, a pair that has already gone — we will tell you before we take
              any money, and you owe nothing.
            </p>
            <p className={s.p}>
              <strong>Authenticity.</strong> If a pair we sold you is ever shown not to be
              genuine, we refund the full amount you paid. That commitment does not expire and is
              not conditional on when you noticed.
            </p>
          </div>
        </section>

        <section className={s.section}>
          <div className={s.measure}>
            <h2 className={s.h2}>Price and payment</h2>
            <p className={s.p}>
              Prices are in UAE dirhams and include VAT where it applies. The price you see when
              you order is the price you pay; we do not add a fee afterwards.
            </p>
            <p className={s.p}>
              Cash on delivery is available up to {money(SITE_CONFIG.codLimit)} per order. Above
              that we ask for a bank transfer or a deposit before dispatch. Delivery is free
              inside Dubai and {money(SITE_CONFIG.deliveryFeeOutside)} to other emirates.
            </p>
            <p className={s.p}>
              An order is not a contract until we confirm it on WhatsApp. If a pair sells in the
              minutes between your order and our confirmation, we will say so and nothing is
              charged.
            </p>
          </div>
        </section>

        <section className={s.section}>
          <div className={s.measure}>
            <h2 className={s.h2}>Returns and exchanges</h2>
            <p className={s.p}>
              Try both shoes on at the door before paying. If the fit is wrong, hand them back and
              pay nothing — we only ask that you keep them indoors while you try them.
            </p>
            <p className={s.p}>
              After payment you have 48 hours to ask for an exchange or a refund. The pair must
              come back unworn, in its original box, with everything that came with it. Once it is
              back with us and checked, we refund in full by the same method you paid.
            </p>
            <p className={s.p}>
              A pair that has been worn outside, laced differently, or returned without its box is
              not something we can resell as deadstock, and we cannot refund it in full. We will
              tell you what we can do rather than simply refuse.
            </p>
          </div>
        </section>

        <section className={s.section}>
          <div className={s.measure}>
            <h2 className={s.h2}>Selling to us</h2>
            <p className={s.p}>
              Any figure shown on the sell page is indicative and based on what we currently list
              the same model at. The real number is quoted after we have the pair in hand. Once
              quoted, it does not move — if we find something on inspection we tell you and you
              can take the pair back rather than accept less.
            </p>
          </div>
        </section>

        <section className={s.section}>
          <div className={s.measure}>
            <h2 className={s.h2}>Getting hold of us</h2>
            <p className={s.p}>
              WhatsApp between 10am and 11pm every day, or{" "}
              <a href={`mailto:${SITE_CONFIG.email}`}>{SITE_CONFIG.email}</a>. We are a physical
              business in Jumeirah 1, Dubai, and you are welcome to come and stand in the room.
            </p>
          </div>
        </section>
      </div>

      <Closing
        line="If something here does not match what you were told on WhatsApp, what you were told wins. Come back to us."
        message="Hello Gulf Grails, I have a question about the terms."
        action={{ label: "Privacy", href: "/privacy" }}
      />
    </div>
  );
}
