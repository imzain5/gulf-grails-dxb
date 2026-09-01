import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { isAdmin } from "@/lib/admin-auth";
import { blobConfigured, getCatalogue } from "@/lib/catalogue";
import AdminBar from "@/components/admin/AdminBar";
import ProductForm from "@/components/admin/ProductForm";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!(await isAdmin())) redirect("/admin/login");

  const { id } = await params;
  const catalogue = await getCatalogue();
  const product = catalogue.find((p) => p.id === id);
  if (!product) notFound();

  const families = [...new Set(catalogue.map((p) => p.fam).filter(Boolean))].sort();
  const brands = [...new Set(catalogue.map((p) => p.brand).filter(Boolean))].sort();

  return (
    <>
      <AdminBar back />
      <div className="ad-shell ad-main">
        <h1 className="ad-h1">{product.name}</h1>
        <p className="ad-sub">
          Changes are live as soon as you save.{" "}
          <Link href={`/product/${product.id}`} target="_blank" rel="noreferrer">
            Open the listing ↗
          </Link>
        </p>
        <ProductForm
          product={product}
          families={families}
          brands={brands}
          storageReady={blobConfigured()}
        />
      </div>
    </>
  );
}
