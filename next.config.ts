import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Product photography uploaded from /admin lives in the project's Vercel
      // Blob store; the subdomain is the store id, which differs per project.
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com", pathname: "/**" },
    ],

    /**
     * The photograph is the product, so nothing is re-encoded below maximum.
     *
     * Next 16 requires this allowlist and defaults it to `[75]` — meaning every
     * product shot on the site was being re-compressed to quality 75 before it
     * reached a customer. With a single entry, any `quality` prop coerces to
     * it, so this one line holds for every image on the site without a prop on
     * each one.
     *
     * The originals are untouched either way: uploads are stored byte-for-byte
     * and this only governs the derivative that gets served.
     */
    qualities: [100],

    // WebP only. AVIF would save bytes but costs encode time on first request,
    // and at quality 100 the difference a customer can see is nil.
    formats: ["image/webp"],

    // Uploaded photos carry a random suffix, so a URL's bytes never change and
    // a derivative never needs regenerating.
    minimumCacheTTL: 31536000,
  },
};

export default nextConfig;
