import type { Metadata } from "next";
import { SITE_CONFIG } from "@/lib/config";
import { money } from "@/lib/money";
import PageHead from "@/components/house/editorial/PageHead";
import Closing from "@/components/house/editorial/Closing";
import s from "@/components/house/editorial/editorial.module.css";

export const metadata: Metadata = {
  title: "Delivery & returns",
  description:
    "Same-day Dubai delivery, next day UAE-wide, cash on delivery, and a 48-hour window to exchange or return an unworn pair.",
  alternates: { canonical: "/shipping-returns" },
};

/**
 * Delivery and returns, stated once.
 *
 * Every figure here is one the site already commits to elsewhere — the
 * delivery fee and the cash-on-delivery ceiling come from lib/config.ts, so
 * this page and the checkout cannot drift apart.
 */
export default function ShippingReturnsPage() {
  return (
    <div className={s.page}>
      <PageHead
        kicker="Delivery &amp; returns"
        title={<>How it gets to you, and what happens if it is wrong.</>}
        small
      />

      <div className={s.body}>
        <section className={s.section}>
          <h2 className={s.h2}>Delivery</h2>
          <dl className={s.facts}>
            <div className={s.fact}>
              <dt>Dubai</dt>
              <dd>Same day<small>Ordered before 6pm, usually with you within four hours. Free.</small></dd>
            </div>
            <div className={s.fact}>
              <dt>Other emirates</dt>
              <dd>Next day<small>{money(SITE_CONFIG.deliveryFeeOutside)} delivery.</small></dd>
            </div>
            <div className={s.fact}>
              <dt>Confirmation</dt>
              <dd>On WhatsApp within 15 minutes<small>With a photograph of your exact pair before it leaves the room.</small></dd>
            </div>
            <div className={s.fact}>
              <dt>Collection</dt>
              <dd>Jumeirah 1, by appointment<small>10am – 11pm, every day.</small></dd>
            </div>
          </dl>
        </section>

        <section className={s.section}>
          <h2 className={s.h2}>Paying</h2>
          <div className={s.measure}>
            <p className={s.p}>
              <strong>Cash on delivery.</strong> You pay the courier once the box is open and the
              pair is on your feet. Nothing is charged online and we never ask for card details.
              Available up to {money(SITE_CONFIG.codLimit)}; above that we take a bank transfer or
              a deposit first, because that much cash in a courier bag is not fair to anyone.
            </p>
            <p className={s.p}>
              <strong>Bank transfer.</strong> Choose it at checkout and we send the account details
              on WhatsApp with your order number. We never publish our bank details on the site —
              if a message claiming to be us does, it is not us.
            </p>
          </div>
        </section>

        <section className={s.section}>
          <h2 className={s.h2}>If it is wrong</h2>
          <div className={s.measure}>
            <p className={s.p}>
              <strong>At the door.</strong> Try both shoes on before you pay. If the fit is wrong,
              hand them straight back and pay nothing. We only ask that you keep them indoors.
            </p>
            <p className={s.p}>
              <strong>Within 48 hours.</strong> Message us and we will exchange for another size if
              we have it, or refund you in full once the pair is back with us unworn and in its
              box.
            </p>
            <p className={s.p}>
              <strong>Authenticity, at any point.</strong> If a pair we sold you is ever shown not
              to be genuine, you get every dirham back. That is not a 48-hour window — it does not
              expire.
            </p>
          </div>
        </section>
      </div>

      <Closing
        line="Something not arrived, or arrived wrong? Message us with your order number and we will sort it out today."
        message="Hello Gulf Grails, I need help with an order."
        action={{ label: "Questions", href: "/faq" }}
      />
    </div>
  );
}
