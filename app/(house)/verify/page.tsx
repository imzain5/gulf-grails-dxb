import type { Metadata } from "next";
import { getCatalogue } from "@/lib/catalogue";
import { certificateRef, hasRecord } from "@/lib/certificate";
import PageHead from "@/components/house/editorial/PageHead";
import Closing from "@/components/house/editorial/Closing";
import RefLookup from "@/components/house/verify/RefLookup";
import e from "@/components/house/editorial/editorial.module.css";

export const metadata: Metadata = {
  title: "Check a record",
  description:
    "Every pair we authenticate gets a record you can read. Scan the QR on the card in the box, or type the reference here.",
  alternates: { canonical: "/verify" },
};

export const revalidate = 3600;

/**
 * The way in for someone holding a card and no scanner.
 *
 * This page is also where the honest limit gets stated once, properly: not
 * every listing has a record, because a record is something a person made
 * rather than something the site generates. The count is read from the live
 * catalogue, so the page cannot drift from the truth — if it says four of
 * thirty, four of thirty is what has been filled in.
 */
export default async function VerifyIndexPage() {
  const catalogue = await getCatalogue();
  const withRecord = catalogue.filter(hasRecord);

  // References are derived from listing ids and are not secret; the map is
  // what makes an offline lookup possible without a round trip.
  const refs = Object.fromEntries(withRecord.map((p) => [certificateRef(p.id), p.id]));

  return (
    <div className={e.page}>
      <PageHead
        kicker="Verification"
        title={<>Check a record.</>}
        standfirst="Pairs we have authenticated carry a card with a reference and a QR code. Both open the record of what was checked, when, and by whom."
        small
      />

      <div className={e.body}>
        {/*
         * A lookup box that cannot succeed is a trap: it invites someone to
         * type a reference and tells them it is wrong. So it only appears once
         * there is something to find.
         */}
        {withRecord.length > 0 && (
          <section className={e.section}>
            <div className={e.measure}>
              <RefLookup refs={refs} />
            </div>
          </section>
        )}

        <section className={e.section}>
          <h2 className={e.h2}>What a record contains</h2>
          <div className={e.measure}>
            <p className={e.p}>
              The date the six checks were run, the initials of whoever ran them,
              the condition grade, what came in the box, any flaws we found, and
              the photograph taken on our table before the pair was listed.
            </p>
            <p className={e.p}>
              It stays up after the pair sells. That is most of the point — a
              record that disappears when the listing does is no use to the person
              who ends up owning the shoe.
            </p>
          </div>
        </section>

        <section className={e.section}>
          <h2 className={e.h2}>
            {withRecord.length === 0 ? "We are writing these up now" : "Not every listing has one"}
          </h2>
          <div className={e.measure}>
            {withRecord.length === 0 ? (
              <p className={e.p}>
                Every pair in the stockroom goes through the six checks, and has
                done since we opened. Publishing the record of each one is new,
                and we are working back through the shelf — so there is nothing
                to look up on this page yet.
              </p>
            ) : (
              <p className={e.p}>
                Right now <strong>{withRecord.length} of {catalogue.length}</strong>{" "}
                listings carry a record. A record is written by the person who ran
                the checks; it is not produced automatically by listing a pair, and
                we would rather show you the gap than fill it with something
                generated.
              </p>
            )}
            <p className={e.p}>
              Every pair goes through the same six checks whether or not the record
              has been written up. If you want the record for a pair that has not
              got one yet, ask — we will write it up before it ships.
            </p>
          </div>
        </section>
      </div>

      <Closing
        line="Holding a card that will not scan? Send us a photograph of it with the reference visible and we will send the record back."
        message="Hello Gulf Grails — I have an authentication card and I would like the record. Reference: "
        action={{ label: "How we authenticate", href: "/authentication" }}
      />
    </div>
  );
}
