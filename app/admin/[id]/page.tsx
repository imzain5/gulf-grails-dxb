import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { isAdmin } from "@/lib/admin-auth";
import { blobConfigured, storageWritable, getCatalogue } from "@/lib/catalogue";
import { getOrders } from "@/lib/orders";
import AdminBar from "@/components/admin/AdminBar";
import ProductForm from "@/components/admin/ProductForm";

export default async function EditProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ copied?: string }>;
}) {
  if (!(await isAdmin())) redirect("/admin/login");

  const [{ id }, flags, catalogue, orders] = await Promise.all([
    params, searchParams, getCatalogue(), getOrders(),
  ]);
  const product = catalogue.find((p) => p.id === id);
  if (!product) notFound();

  const families = [...new Set(catalogue.map((p) => p.fam).filter(Boolean))].sort();
  const brands = [...new Set(catalogue.map((p) => p.brand).filter(Boolean))].sort();
  const colorways = [...new Set(catalogue.map((p) => p.colorway).filter(Boolean))].sort();

  return (
    <>
      <AdminBar newOrders={orders.filter((o) => o.status === "new").length} />
      <div className="ad-shell ad-main">
        <h1 className="ad-h1">{product.name}</h1>
        <p className="ad-sub">
          Changes are live as soon as you save.{" "}
          <Link href={`/product/${product.id}`} target="_blank" rel="noreferrer">
            Open the listing ↗
          </Link>
        </p>
        {flags.copied && (
          <div className="ad-note is-ok">
            <h3>Copied</h3>
            <p>
              A new listing, started from the old one and already live with no photos. Change the
              colourway, the style code and the price, add its own photographs, and save.
            </p>
          </div>
        )}

        <ProductForm
          product={product}
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
