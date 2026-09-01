import type { Metadata } from "next";
import ShopClient from "@/components/shop/ShopClient";
import { DEFAULT_FILTERS, type ShopFilters } from "@/lib/filter";
import { SORTS, type SortKey } from "@/data/products";

export const metadata: Metadata = { title: "Shop the stockroom" };

type SearchParams = { [key: string]: string | string[] | undefined };

function first(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

function parseFilters(sp: SearchParams): ShopFilters {
  const fam = first(sp.fam) ?? DEFAULT_FILTERS.fam;
  const q = first(sp.q) ?? DEFAULT_FILTERS.q;
  const sortRaw = first(sp.sort);
  const sort: SortKey = (SORTS as readonly string[]).includes(sortRaw ?? "") ? (sortRaw as SortKey) : DEFAULT_FILTERS.sort;
  const sizeRaw = first(sp.size);
  const sizeF: number | "All" = sizeRaw && !Number.isNaN(Number(sizeRaw)) ? Number(sizeRaw) : "All";
  return { fam, q, sort, sizeF };
}

export default async function ShopPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const filters = parseFilters(await searchParams);
  return <ShopClient key={JSON.stringify(filters)} initialFilters={filters} />;
}
