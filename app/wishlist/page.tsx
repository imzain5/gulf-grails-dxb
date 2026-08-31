import type { Metadata } from "next";
import WishlistClient from "@/components/wishlist/WishlistClient";

export const metadata: Metadata = { title: "Your shortlist" };

export default function WishlistPage() {
  return <WishlistClient />;
}
