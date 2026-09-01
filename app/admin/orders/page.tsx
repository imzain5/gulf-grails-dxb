import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin-auth";
import { storageWritable } from "@/lib/catalogue";
import { getOrders } from "@/lib/orders";
import { money } from "@/lib/money";
import AdminBar from "@/components/admin/AdminBar";
import OrderCard from "@/components/admin/OrderCard";

/**
 * What has been ordered.
 *
 * Newest first, and never filtered by default — an order that has been sitting
 * unconfirmed is exactly the one that must not be hidden behind a tab.
 */
export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ done?: string; error?: string }>;
}) {
  if (!(await isAdmin())) redirect("/admin/login");

  const [orders, flags] = await Promise.all([getOrders(), searchParams]);
  const fresh = orders.filter((o) => o.status === "new");
  const owed = orders
    .filter((o) => o.status === "new" || o.status === "confirmed")
    .reduce((n, o) => n + o.total, 0);

  return (
    <>
      <AdminBar active="orders" newOrders={fresh.length} />

      <div className="ad-shell ad-main">
        <h1 className="ad-h1">Orders</h1>
        <p className="ad-sub">
          {orders.length === 0
            ? "Nothing yet."
            : `${orders.length} in total · ${fresh.length} waiting to be confirmed · ${money(owed)} out for delivery`}
        </p>

        {flags.error && (
          <div className="ad-note">
            <h3>That did not save</h3>
            <p>{flags.error}</p>
          </div>
        )}
        {flags.done && !flags.error && (
          <div className="ad-note is-ok"><p>{flags.done}</p></div>
        )}

        {!storageWritable() && (
          <div className="ad-note">
            <h3>Orders aren&apos;t being recorded yet</h3>
            <p>
              Connect a Blob store to this project in the Vercel dashboard. Until then checkout
              still works and still sends the WhatsApp message, but nothing is written down and
              stock does not move on its own.
            </p>
          </div>
        )}

        {orders.length === 0 ? (
          <div className="ad-empty">
            Orders placed on the site land here, and the pairs come off the shelf as they do.
          </div>
        ) : (
          <div className="ad-list">
            {orders.map((o) => <OrderCard key={o.ref} order={o} />)}
          </div>
        )}
      </div>
    </>
  );
}
