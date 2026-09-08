import Link from "next/link";
import { SITE_CONFIG } from "@/lib/config";
import { waLink } from "@/lib/whatsapp";
import ThemeToggle from "./ThemeToggle";
import { Label } from "./primitives";
import s from "./Footer.module.css";

/**
 * The footer as a directory rather than a sign-off.
 *
 * Four columns and a brand column, then the legal strip. The payment marks
 * list only what the shop can actually take today — a Tabby or Visa mark shown
 * before either is integrated is a claim, not decoration, and it is the kind of
 * claim that costs more than it earns.
 */

const SHOP = [
  ["The Vault", "/vault"],
  ["Air Jordan", "/shop?fam=Jordan+1"],
  ["Nike", "/shop?q=Nike"],
  ["Yeezy", "/shop?fam=Yeezy"],
  ["Balenciaga", "/shop?fam=Balenciaga"],
  ["Luxury", "/shop?fam=Luxury"],
] as const;

const SERVICES = [
  ["Authentication", "/authentication"],
  ["Check a record", "/verify"],
  ["Sell to us", "/sell"],
  ["Size & fit", "/size-guide"],
  ["Delivery & returns", "/shipping-returns"],
  ["Questions", "/faq"],
] as const;

const HOUSE = [
  ["About", "/about"],
  ["The Grail Index", "/grail-index"],
  ["Privacy", "/privacy"],
  ["Terms of sale", "/terms"],
] as const;

export default function Footer({
  /**
   * The UAE trade licence or free-zone registration number. Rendered only when
   * supplied — an invented one would be worse than none.
   */
  licence,
}: {
  licence?: string;
}) {
  const year = new Date().getFullYear();

  return (
    <footer className={s.footer}>
      <div className={s.in}>
        <div className={s.brand}>
          <span className={s.wordmark}>Gulf Grails</span>
          <p className={s.line}>
            A private house for grails. Physically held in Dubai. Six checks, one pair,
            one chance.
          </p>
          <p className={s.line}>
            Jumeirah 1, Dubai · viewing by appointment
            <br />
            10am – 11pm, every day
          </p>
        </div>

        <nav className={s.col} aria-label="Shop">
          <Label>Shop</Label>
          {SHOP.map(([label, href]) => (
            <Link key={label} href={href} className={s.colLink}>{label}</Link>
          ))}
        </nav>

        <nav className={s.col} aria-label="Services">
          <Label>Services</Label>
          {SERVICES.map(([label, href]) => (
            <Link key={label} href={href} className={s.colLink}>{label}</Link>
          ))}
        </nav>

        <nav className={s.col} aria-label="The house">
          <Label>The house</Label>
          {HOUSE.map(([label, href]) => (
            <Link key={label} href={href} className={s.colLink}>{label}</Link>
          ))}
        </nav>

        <nav className={s.col} aria-label="Connect">
          <Label>Connect</Label>
          <a className={s.colLink} href={waLink("Hello Gulf Grails —")} target="_blank" rel="noopener">
            WhatsApp
          </a>
          <a className={s.colLink} href="https://instagram.com/gulfgrails" target="_blank" rel="noreferrer">
            Instagram
          </a>
          <a className={s.colLink} href={`mailto:${SITE_CONFIG.email}`}>{SITE_CONFIG.email}</a>
        </nav>
      </div>

      <div className={s.legal}>
        <span className={s.legalItem}>© {year} Gulf Grails</span>
        {licence && <span className={s.legalItem}>Trade licence {licence}</span>}
        <span className={s.legalItem}>Jumeirah 1, Dubai, UAE</span>

        <span className={`${s.pays} ${s.legalSpacer}`}>
          {/* Only what the shop can actually take today. */}
          <span className={s.pay}>Cash on delivery</span>
          <span className={s.pay}>Bank transfer</span>
        </span>

        <button type="button" className={s.utilityBtn} lang="ar" dir="rtl">العربية</button>
        <button type="button" className={s.utilityBtn}>AED</button>
        <ThemeToggle className={s.utilityBtn} compact />
      </div>
    </footer>
  );
}
