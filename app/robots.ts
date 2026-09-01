import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/lib/config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Per-visitor pages with nothing to index — they render from
      // localStorage and are empty for a crawler — plus the owner's
      // stockroom, which is behind a password and has no business in a
      // search index.
      disallow: ["/cart", "/checkout", "/order", "/wishlist", "/admin", "/api"],
    },
    sitemap: `${SITE_CONFIG.siteUrl}/sitemap.xml`,
  };
}
