import type { Metadata } from "next";
import OrderClient from "@/components/order/OrderClient";

export const metadata: Metadata = { title: "Order received" };

export default function OrderPage() {
  return <OrderClient />;
}
