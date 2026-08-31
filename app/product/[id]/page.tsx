import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PRODUCTS, findProduct, type Product } from "@/data/products";
import { SITE_CONFIG } from "@/lib/config";
import ProductClient from "@/components/product/ProductClient";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const p = PRODUCTS.find((x) => x.id === id);
  if (!p) return {};

  const description = `${p.name} — ${p.colorway}, style ${p.sku}. AED ${p.price.toLocaleString("en-US")}, verified in-house, delivered across the UAE.`;
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
      // The real studio shot, so a shared link previews the actual pair.
      images: p.photos ? [{ url: p.photos[0], alt: p.name }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${p.name} — AED ${p.price.toLocaleString("en-US")}`,
      description,
      images: p.photos ? [p.photos[0]] : undefined,
    },
  };
}

/** Product structured data, so a listing can carry its price and stock. */
function productLd(p: Product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: p.desc,
    sku: p.sku,
    mpn: p.sku,
    brand: { "@type": "Brand", name: p.brand },
    color: p.colorway,
    releaseDate: String(p.year),
    image: (p.photos ?? []).map((src) => SITE_CONFIG.siteUrl + src),
    offers: {
      "@type": "Offer",
      url: `${SITE_CONFIG.siteUrl}/product/${p.id}`,
      priceCurrency: "AED",
      price: p.price,
      itemCondition: "https://schema.org/NewCondition",
      availability: p.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      seller: { "@type": "Organization", name: "Gulf Grails" },
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!PRODUCTS.some((p) => p.id === id)) notFound();
  const product = findProduct(id);

  return (
    <>
      <script
        type="application/ld+json"
        // Built from the catalogue in data/products.ts — no user input.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productLd(product)) }}
      />
      <ProductClient key={product.id} product={product} />
    </>
  );
}
