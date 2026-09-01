import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin-auth";
import { storageWritable, getCatalogue } from "@/lib/catalogue";
import AdminBar from "@/components/admin/AdminBar";
import InventoryList from "@/components/admin/InventoryList";
import { getOrders } from "@/lib/orders";
import { money } from "@/lib/money";

/**
 * The stockroom.
 *
 * Everything the shop sells, in one list, with the number of pairs left
 * editable in place. Ordered by what needs attention — sold out first, then
 * running low — because a list ordered by anything else is a list you have to
 * read rather than scan.
 */
export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string; stock?: string; error?: string }>;
}) {
  if (!(await isAdmin())) redirect("/admin/login");

  const [catalogue, orders, flags] = await Promise.all([
    getCatalogue(), getOrders(), searchParams,
  ]);
  const storageReady = storageWritable();

  const newOrders = orders.filter((o) => o.status === "new").length;
  const out = catalogue.filter((p) => p.stock === 0).length;
  const low = catalogue.filter((p) => p.stock > 0 && p.stock <= 2).length;
  const pairs = catalogue.reduce((n, p) => n + p.stock, 0);
  const value = catalogue.reduce((n, p) => n + p.stock * p.price, 0);

  const flash =
    flags.deleted ? `Removed “${flags.deleted}” from the site.`
    : flags.saved ? "Saved. It is live on the site now."
    : flags.stock ? "Stock updated."
    : null;

  return (
    <>
      <AdminBar active="inventory" newOrders={newOrders} />

      <div className="ad-shell ad-main">
        <h1 className="ad-h1">Inventory</h1>
        <p className="ad-sub">
          {catalogue.length} {catalogue.length === 1 ? "pair" : "pairs"} listed · {pairs} in the
          stockroom · {money(value)} at retail
          {out > 0 && ` · ${out} sold out`}
          {low > 0 && ` · ${low} running low`}
        </p>

        {!storageReady && (
          <div className="ad-note">
            <h3>Nothing you change here will save yet</h3>
            <p>
              This project has no Blob store connected, so the site is serving the thirty pairs it
              shipped with. In the Vercel dashboard open <strong>Storage</strong>, create a Blob
              store, connect it to this project, then redeploy. That sets{" "}
              <code>BLOB_READ_WRITE_TOKEN</code> for you and everything on this page starts working.
            </p>
          </div>
        )}

        {flags.error && (
          <div className="ad-note">
            <h3>That did not save</h3>
            <p>{flags.error}</p>
          </div>
        )}

        {flash && !flags.error && (
          <div className="ad-note is-ok">
            <p>{flash}</p>
          </div>
        )}

        <div className="ad-hide-phone" style={{ display: "flex", justifyContent: "flex-end", marginBottom: 14 }}>
          <Link className="ad-btn" href="/admin/new">Add a pair</Link>
        </div>

        <InventoryList products={catalogue} />
      </div>
    </>
  );
}
