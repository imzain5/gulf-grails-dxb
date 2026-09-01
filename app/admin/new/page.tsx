import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin-auth";
import { blobConfigured, storageWritable, getCatalogue } from "@/lib/catalogue";
import { getOrders } from "@/lib/orders";
import AdminBar from "@/components/admin/AdminBar";
import ProductForm from "@/components/admin/ProductForm";

export default async function NewProductPage() {
  if (!(await isAdmin())) redirect("/admin/login");

  const [catalogue, orders] = await Promise.all([getCatalogue(), getOrders()]);
  // Offer what the shop already uses, so a pair doesn't quietly end up in a
  // one-item "Jordan1" group because of a typo.
  const families = [...new Set(catalogue.map((p) => p.fam).filter(Boolean))].sort();
  const brands = [...new Set(catalogue.map((p) => p.brand).filter(Boolean))].sort();
  const colorways = [...new Set(catalogue.map((p) => p.colorway).filter(Boolean))].sort();

  return (
    <>
      <AdminBar active="add" newOrders={orders.filter((o) => o.status === "new").length} />
      <div className="ad-shell ad-main">
        <h1 className="ad-h1">Add a pair</h1>
        <p className="ad-sub">
Start by finding the model, then add the colourway, the price and the photos.
          It goes live in the shop the moment you save.
        </p>
        <ProductForm
          families={families}
          brands={brands}
          colorways={colorways}
          storageReady={storageWritable()}
          uploadsReady={blobConfigured()}
        />
      </div>
    </>
  );
}
