import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { findIn, type Product } from "@/data/products";
import { getCatalogue } from "@/lib/catalogue";
import { instalmentsLive } from "@/lib/payments";
import ProductClient from "@/components/house/product/ProductClient";

export async function generateStaticParams() {
  const products = await getCatalogue();
  return products.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const p = (await getCatalogue()).find((x) => x.id === id);
  if (!p) return {};

  const description = `${p.name} — ${p.colorway}, style ${p.sku}. AED ${p.price.toLocaleString("en-US")}, authenticated in-house and delivered across the UAE.`;
  const url = `/product/${p.id}`;

  return {
    title: p.name,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      title: `${p.name} — AED ${p.price.toLocaleString("en-US")}`,
      description,
      url,
      images: p.photos ? [{ url: p.photos[0], alt: p.name }] : undefined,
    },
  };
}

/**
 * Structured data for one lot.
 *
 * `itemCondition` is stated only when the shop has actually recorded a grade —
 * asserting NewCondition on every pair by default would be the same class of
 * unverifiable claim as the review count that came out of the site markup.
 */
function productLd(p: Product) {
  const condition = p.condition?.toLowerCase();
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: p.desc,
    sku: p.sku || undefined,
    brand: { "@type": "Brand", name: p.brand },
    color: p.colorway || undefined,
    image: p.photos ?? undefined,
    ...(condition
      ? {
          itemCondition: condition.includes("used")
            ? "https://schema.org/UsedCondition"
            : "https://schema.org/NewCondition",
        }
      : {}),
    offers: {
      "@type": "Offer",
      priceCurrency: "AED",
      price: p.price,
      availability: p.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      seller: { "@type": "Organization", name: "Gulf Grails" },
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const catalogue = await getCatalogue();
  if (!catalogue.some((p) => p.id === id)) notFound();
  const product = findIn(catalogue, id);

  return (
    <>
      <script
        type="application/ld+json"
        // Built from the catalogue — shop-authored copy, not visitor input.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productLd(product)) }}
      />
      <ProductClient key={product.id} product={product} instalments={instalmentsLive()} />
    </>
  );
}
