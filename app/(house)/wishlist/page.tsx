import type { Metadata } from "next";
import WishlistClient from "@/components/house/checkout/WishlistClient";

export const metadata: Metadata = {
  title: "Saved",
  robots: { index: false, follow: true },
};

export default function WishlistPage() {
  return <WishlistClient />;
}
