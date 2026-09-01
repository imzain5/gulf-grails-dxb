import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin-auth";
import { blobConfigured, getCatalogue } from "@/lib/catalogue";
import AdminBar from "@/components/admin/AdminBar";
import ProductForm from "@/components/admin/ProductForm";

export default async function NewProductPage() {
  if (!(await isAdmin())) redirect("/admin/login");

  const catalogue = await getCatalogue();
  // Offer what the shop already uses, so a pair doesn't quietly end up in a
  // one-item "Jordan1" group because of a typo.
  const families = [...new Set(catalogue.map((p) => p.fam).filter(Boolean))].sort();
  const brands = [...new Set(catalogue.map((p) => p.brand).filter(Boolean))].sort();

  return (
    <>
      <AdminBar back />
      <div className="ad-shell ad-main">
        <h1 className="ad-h1">Add a pair</h1>
        <p className="ad-sub">
          It goes live the moment you save — in the shop grid, in search, and on its own page.
        </p>
        <ProductForm families={families} brands={brands} storageReady={blobConfigured()} />
      </div>
    </>
  );
}
