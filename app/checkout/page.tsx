import type { Metadata } from "next";
import CheckoutClient from "@/components/checkout/CheckoutClient";

export const metadata: Metadata = { title: "Delivery & payment" };

export default function CheckoutPage() {
  return <CheckoutClient />;
}
