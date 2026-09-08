import type { Metadata } from "next";
import ShopClient from "@/components/house/shop/ShopClient";
import { filtersFromParams, filtersToQuery } from "@/lib/filter";

type SearchParams = { [key: string]: string | string[] | undefined };

/**
 * The shop.
 *
 * Filters are parsed here rather than in the client, so the server renders the
 * filtered grid on the first paint — a shared link opens on its results, not
 * on everything followed by a flicker.
 *
 * The canonical URL drops every default, so `/shop`, `/shop?fam=All` and
 * `/shop?sort=Featured` are one page to a crawler rather than three.
 */
export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}): Promise<Metadata> {
  const sp = await searchParams;
  const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
  const f = filtersFromParams((k) => first(sp[k]));
  const qs = filtersToQuery(f);

  const named = f.fam !== "All" ? f.fam : f.house !== "All" ? f.house : null;

  return {
    title: named ? `${named} — the stockroom` : "The stockroom",
    alternates: { canonical: qs ? `/shop?${qs}` : "/shop" },
  };
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
  return <ShopClient filters={filtersFromParams((k) => first(sp[k]))} />;
}
