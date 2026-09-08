import type { Metadata } from "next";
import { FAQ } from "@/data/content";
import PageHead from "@/components/house/editorial/PageHead";
import Closing from "@/components/house/editorial/Closing";
import s from "@/components/house/editorial/editorial.module.css";

export const metadata: Metadata = {
  title: "Questions",
  description: "Cash on delivery, bank transfer, delivery windows, exchanges and referrals — answered.",
  alternates: { canonical: "/faq" },
};

/**
 * The questions, with FAQPage markup.
 *
 * These are real answers to real questions the shop is asked, so they are
 * worth handing to Google in a form it can surface — unlike a rating, an
 * answered question is a claim the shop can actually stand behind.
 */
const FAQ_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function FaqPage() {
  return (
    <div className={s.page}>
      <script
        type="application/ld+json"
        // Serialised from data/content.ts — shop-authored, no visitor input.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_LD) }}
      />

      <PageHead
        kicker="Questions"
        title={<>The things people ask before they order.</>}
        standfirst="If it is not here, message us — we answer on WhatsApp between 10am and 11pm, every day."
        small
      />

      <div className={s.bodyTight}>
        {FAQ.map((f) => (
          <div key={f.q} className={s.qa}>
            <h2 className={s.qaQ}>{f.q}</h2>
            <p className={s.qaA}>{f.a}</p>
          </div>
        ))}
      </div>

      <Closing
        line="Anything else, ask. There is a person on the other end of that number, not a bot."
        message="Hello Gulf Grails, I have a question."
        action={{ label: "Delivery & returns", href: "/shipping-returns" }}
      />
    </div>
  );
}
