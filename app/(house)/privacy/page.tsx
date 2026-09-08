import type { Metadata } from "next";
import { SITE_CONFIG } from "@/lib/config";
import PageHead from "@/components/house/editorial/PageHead";
import Closing from "@/components/house/editorial/Closing";
import s from "@/components/house/editorial/editorial.module.css";

export const metadata: Metadata = {
  title: "Privacy",
  description: "What this site stores, where it goes, and what never leaves your browser.",
  alternates: { canonical: "/privacy" },
  robots: { index: true, follow: true },
};

/**
 * Privacy, written from what the site actually does rather than from a
 * template.
 *
 * Every claim below is checkable against the code: the bag and the wishlist
 * are localStorage (context/StoreContext.tsx), orders are written to Vercel
 * Blob (lib/orders.ts), the only cookie is the owner's admin session
 * (lib/admin-auth.ts), and the fonts are self-hosted at build time by
 * next/font so a visitor never makes a request to Google.
 */
export default function PrivacyPage() {
  return (
    <div className={s.page}>
      <PageHead
        kicker="Privacy"
        title={<>What we keep, and what never leaves your browser.</>}
        standfirst="Short, because we collect very little. There are no customer accounts on this site and nothing to log into."
        small
      />

      <div className={s.body}>
        <section className={s.section}>
          <div className={s.measure}>
            <h2 className={s.h2}>What stays on your device</h2>
            <p className={s.p}>
              Your bag, your saved pairs and the list of pairs you have looked at are stored in
              your own browser and are never sent to us. Clearing your browser data deletes them
              and we would not know. There is no account, no profile and nothing for us to look
              up about you until you actually place an order.
            </p>
          </div>
        </section>

        <section className={s.section}>
          <div className={s.measure}>
            <h2 className={s.h2}>What we keep when you order</h2>
            <p className={s.p}>
              Placing an order records your name, your WhatsApp number, the delivery address and
              window you gave us, any note for the courier, and what you ordered. That is the
              minimum needed to bring a pair to your door and to know what to do if something
              goes wrong afterwards.
            </p>
            <p className={s.p}>
              It is stored with our hosting provider, Vercel, and is readable only by the person
              who runs the shop. We do not sell it, we do not share it with anyone except the
              courier bringing your order, and we do not use it to market to you.
            </p>
          </div>
        </section>

        <section className={s.section}>
          <div className={s.measure}>
            <h2 className={s.h2}>WhatsApp</h2>
            <p className={s.p}>
              Most of our conversations happen on WhatsApp, which is owned and operated by Meta.
              Anything you send us there is subject to their terms and their privacy policy as
              well as ours. Messages you send us live in that thread until one of us deletes it.
            </p>
          </div>
        </section>

        <section className={s.section}>
          <div className={s.measure}>
            <h2 className={s.h2}>Cookies</h2>
            <p className={s.p}>
              This site sets one cookie, and it is not for you — it keeps the shop owner signed
              in to the private stockroom screens. There are no advertising cookies, no tracking
              pixels and no third-party analytics scripts. Typefaces are served from this site
              rather than from Google, so simply reading a page here does not tell anyone else
              that you did.
            </p>
          </div>
        </section>

        <section className={s.section}>
          <div className={s.measure}>
            <h2 className={s.h2}>Asking us to delete it</h2>
            <p className={s.p}>
              Message us on WhatsApp or email <a href={`mailto:${SITE_CONFIG.email}`}>{SITE_CONFIG.email}</a>{" "}
              and we will delete your order records, unless we are required to keep them for tax
              or accounting reasons. Tell us the order number if you have it, or the number you
              ordered from.
            </p>
          </div>
        </section>
      </div>

      <Closing
        line="Anything here you want explained, ask. We would rather answer than have you wonder."
        message="Hello Gulf Grails, I have a question about privacy."
        action={{ label: "Terms of sale", href: "/terms" }}
      />
    </div>
  );
}
