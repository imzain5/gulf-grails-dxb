import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { isAdmin } from "@/lib/admin-auth";
import { getCatalogue } from "@/lib/catalogue";
import {
  certificateRef,
  certificateUrl,
  hasRecord,
  recordDate,
} from "@/lib/certificate";
import QrCode from "@/components/house/QrCode";
import PrintButton from "@/components/admin/PrintButton";

/**
 * The card that goes in the box, ready to print.
 *
 * This is the physical half of the record — without it the /verify pages are a
 * feature nobody ever finds. Four cards to an A4 sheet, cut and drop one in
 * with the shoe.
 *
 * It prints from the browser rather than generating a PDF: no dependency, no
 * server render step, and the owner can put plain A4 or a sheet of pre-cut
 * card into any printer in the room. The print rules live in admin.css.
 */
export default async function CardPage({ params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) redirect("/admin/login");

  const { id } = await params;
  const product = (await getCatalogue()).find((p) => p.id === id);
  if (!product) notFound();

  const ref = certificateRef(product.id);
  const url = certificateUrl(product.id);
  const checked = recordDate(product.verifiedOn);
  const ready = hasRecord(product);

  return (
    <div className="ad-shell ad-main">
      <div className="ad-noprint">
        <h1 className="ad-h1">Authentication card</h1>
        <p className="ad-sub">
          <Link href={`/admin/${product.id}`}>← Back to {product.name}</Link>
        </p>

        {ready ? (
          <div className="ad-note is-ok">
            <h3>Ready to print</h3>
            <p>
              Four to a sheet. Print, cut, and put one in the box. The QR opens{" "}
              <code>{url}</code>, which is live now.
            </p>
            <p>
              Print at 100% — &ldquo;fit to page&rdquo; shrinks the code and some
              phones stop reading it.
            </p>
          </div>
        ) : (
          /*
           * No date and no initials means no record, so the QR would print a
           * code that leads to a 404 in a customer's hands. Blocked rather than
           * warned about.
           */
          <div className="ad-note">
            <h3>Not yet — this pair has no record</h3>
            <p>
              A card is only worth printing once the checks are logged. Add the{" "}
              <b>date checked</b> and the <b>initials</b> on the listing and this page
              will print.
            </p>
            <p>
              <Link href={`/admin/${product.id}`}>Add them now →</Link>
            </p>
          </div>
        )}
      </div>

      {ready && (
        <>
          <div className="ad-noprint ad-cardbar">
            <PrintButton />
          </div>

          <div className="ad-cardsheet">
            {[0, 1, 2, 3].map((i) => (
              <article key={i} className="ad-card-cert">
                <div className="ad-cert-top">
                  <span className="ad-cert-house">GULF GRAILS</span>
                  <span className="ad-cert-kicker">Authentication record</span>
                </div>

                <div className="ad-cert-mid">
                  <QrCode text={url} size={104} />
                  <div className="ad-cert-facts">
                    <span className="ad-cert-ref">{ref}</span>
                    <span className="ad-cert-name">{product.name}</span>
                    {product.sku && <span className="ad-cert-sku">{product.sku}</span>}
                    <span className="ad-cert-date">
                      Checked {checked} · {product.verifiedBy}
                    </span>
                  </div>
                </div>

                <p className="ad-cert-foot">
                  Scan, or type the reference at gulfgrails.ae/verify
                </p>
              </article>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
