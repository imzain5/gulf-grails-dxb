import Link from "next/link";
import { logoutAction } from "@/app/admin/actions";

/** The one bar every admin screen carries. */
export default function AdminBar({ back }: { back?: boolean }) {
  return (
    <div className="ad-bar">
      <div className="ad-shell ad-bar-in">
        <div className="ad-mark">Gulf Grails <span>Stockroom</span></div>
        <nav className="ad-nav">
          {back && <Link href="/admin">← Inventory</Link>}
          <Link href="/" target="_blank" rel="noreferrer">View shop</Link>
          <form action={logoutAction}>
            <button className="ad-linkbtn" type="submit">Sign out</button>
          </form>
        </nav>
      </div>
    </div>
  );
}
