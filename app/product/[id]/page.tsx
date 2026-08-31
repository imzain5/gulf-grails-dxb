import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PRODUCTS, findProduct } from "@/data/products";
import ProductClient from "@/components/product/ProductClient";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const p = PRODUCTS.find((x) => x.id === id);
  if (!p) return {};
  return {
    title: p.name,
    description: `${p.name} — ${p.colorway}, style ${p.sku}. AED ${p.price.toLocaleString("en-US")}, verified in-house, delivered across the UAE.`,
  };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!PRODUCTS.some((p) => p.id === id)) notFound();
  const product = findProduct(id);
  return <ProductClient key={product.id} product={product} />;
}
