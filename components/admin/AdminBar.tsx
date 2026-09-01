import Link from "next/link";
import { logoutAction } from "@/app/admin/actions";

/**
 * Navigation, twice.
 *
 * On a desktop the links sit in the top bar where they are expected. On a
 * phone they move to a fixed bar at the bottom of the screen, because staff
 * are listing pairs one-handed and the top of a phone is the part a thumb
 * cannot reach. Both render from the same list; CSS decides which is visible.
 */

const ICONS = {
  inventory: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 7h18v13H3z" /><path d="M3 7l2-3h14l2 3" /><path d="M10 11h4" />
    </svg>
  ),
  orders: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M6 3h12l1 18H5z" /><path d="M9 7a3 3 0 0 0 6 0" />
    </svg>
  ),
  add: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 5v14" /><path d="M5 12h14" />
    </svg>
  ),
  shop: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M14 4h6v6" /><path d="M20 4 10 14" /><path d="M18 14v6H4V6h6" />
    </svg>
  ),
};

export type AdminTab = "inventory" | "orders" | "add" | null;

export default function AdminBar({
  active = null,
  newOrders = 0,
}: {
  active?: AdminTab;
  /** Orders nobody has looked at yet — worth a badge on both bars. */
  newOrders?: number;
}) {
  const links: { key: Exclude<AdminTab, null>; href: string; label: string }[] = [
    { key: "inventory", href: "/admin", label: "Inventory" },
    { key: "orders", href: "/admin/orders", label: "Orders" },
    { key: "add", href: "/admin/new", label: "Add pair" },
  ];

  const badge = newOrders > 0 ? <span className="ad-count">{newOrders > 99 ? "99+" : newOrders}</span> : null;

  return (
    <>
      <div className="ad-bar">
        <div className="ad-shell ad-bar-in">
          <div className="ad-mark">Gulf Grails <span>Stockroom</span></div>
          <nav className="ad-nav">
            {links.map((l) => (
              <Link key={l.key} href={l.href} aria-current={active === l.key ? "page" : undefined}>
                {l.label}
                {l.key === "orders" && badge}
              </Link>
            ))}
            <Link href="/" target="_blank" rel="noreferrer">View shop</Link>
            <form action={logoutAction}>
              <button className="ad-linkbtn" type="submit">Sign out</button>
            </form>
          </nav>
        </div>
      </div>

      <nav className="ad-tabs" aria-label="Stockroom">
        {links.map((l) => (
          <Link key={l.key} className="ad-tab" href={l.href} aria-current={active === l.key ? "page" : undefined}>
            {ICONS[l.key]}
            {l.label}
            {l.key === "orders" && badge}
          </Link>
        ))}
        <Link className="ad-tab" href="/" target="_blank" rel="noreferrer">
          {ICONS.shop}
          Shop
        </Link>
      </nav>
    </>
  );
}
