import type { MetadataRoute } from "next";
import { PRODUCTS } from "@/data/products";
import { SITE_CONFIG } from "@/lib/config";

/** Every page a crawler should know about: the fixed routes plus one per pair. */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE_CONFIG.siteUrl;
  const now = new Date();

  const pages: [string, MetadataRoute.Sitemap[number]["changeFrequency"], number][] = [
    ["", "daily", 1],
    ["/shop", "daily", 0.9],
    ["/trust", "monthly", 0.7],
    ["/about", "monthly", 0.5],
    ["/sell", "monthly", 0.6],
  ];

  return [
    ...pages.map(([path, changeFrequency, priority]) => ({
      url: base + path,
      lastModified: now,
      changeFrequency,
      priority,
    })),
    ...PRODUCTS.map((p) => ({
      url: `${base}/product/${p.id}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
