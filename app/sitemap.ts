import type { MetadataRoute } from "next";
import { getCatalogue } from "@/lib/catalogue";
import { SITE_CONFIG } from "@/lib/config";

/** Every page a crawler should know about: the fixed routes plus one per pair. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getCatalogue();
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
    ...products.map((p) => ({
      url: `${base}/product/${p.id}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
