import type { Metadata } from "next";
import "./admin.css";

/**
 * The admin shell.
 *
 * Sits outside the `(store)` route group, so it inherits the document and the
 * font from the root layout and nothing else — no announcement bar, no header,
 * no cart provider, no storefront CSS beyond what globals.css sets on the
 * document itself.
 *
 * The auth check is not here. A layout renders for both the login page and the
 * pages behind it, so each page guards itself; the actions guard themselves
 * again, because that is where the actual boundary is.
 */
/**
 * Never prerendered. Every screen here depends on the session cookie, so a
 * cached copy would be either the login page shown to a signed-in owner or,
 * far worse, an inventory list shown to nobody in particular.
 */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Stockroom",
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="ad">{children}</div>;
}
