import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin-auth";
import { blobConfigured, getCatalogue } from "@/lib/catalogue";
import AdminBar from "@/components/admin/AdminBar";
import InventoryRow from "@/components/admin/InventoryRow";
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

  const [catalogue, flags] = await Promise.all([getCatalogue(), searchParams]);
  const storageReady = blobConfigured();

  const sorted = [...catalogue].sort((a, b) => {
    const rank = (p: typeof a) => (p.stock === 0 ? 0 : p.stock <= 2 ? 1 : 2);
    return rank(a) - rank(b) || a.name.localeCompare(b.name);
  });

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
      <AdminBar />

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

        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 14 }}>
          <Link className="ad-btn" href="/admin/new">Add a pair</Link>
        </div>

        <div className="ad-list">
          {sorted.map((p) => (
            <InventoryRow key={p.id} product={p} />
          ))}
        </div>
      </div>
    </>
  );
}
