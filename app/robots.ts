import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/lib/config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Per-visitor pages with nothing to index — they render from
      // localStorage and are empty for a crawler.
      disallow: ["/cart", "/checkout", "/order", "/wishlist"],
    },
    sitemap: `${SITE_CONFIG.siteUrl}/sitemap.xml`,
  };
}
