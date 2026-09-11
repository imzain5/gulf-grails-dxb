import type { Metadata } from "next";
import { instalmentsLive } from "@/lib/payments";
import CartClient from "@/components/house/checkout/CartClient";

export const metadata: Metadata = {
  title: "Your bag",
  robots: { index: false, follow: true },
};

export const dynamic = "force-dynamic";

export default function CartPage() {
  // Null unless an instalment provider is genuinely connected — the bag must
  // not offer a split the shop cannot put through.
  return <CartClient instalment={instalmentsLive() ? 4 : null} />;
}
