import type { Metadata } from "next";
import { liveProviders } from "@/lib/payments";
import CheckoutClient, { type PayOption } from "@/components/house/checkout/CheckoutClient";

export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

/**
 * Cash on delivery and bank transfer need nobody's API, so they are always
 * here. Everything else appears only once its credentials are set — which is
 * why this list is built on the server rather than hard-coded in the form.
 */
const ALWAYS: PayOption[] = [
  {
    method: "cod",
    label: "Cash on delivery",
    blurb: "Pay the courier once the pair is in your hands and you have checked it.",
    split: null,
  },
  {
    method: "bank",
    label: "Bank transfer",
    blurb: "We send the account details on WhatsApp with your order number.",
    split: null,
  },
];

export default function CheckoutPage() {
  const online: PayOption[] = liveProviders().map((p) => ({
    method: p.method,
    label: p.label,
    blurb: p.blurb,
    split: p.method === "tabby" || p.method === "tamara" ? 4 : null,
  }));

  return <CheckoutClient options={[...ALWAYS, ...online]} />;
}
