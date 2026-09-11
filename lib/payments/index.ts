import type { PayMethod } from "../orders";
import { SITE_CONFIG } from "../config";
import type { PaymentProvider } from "./types";
import { stripeProvider } from "./stripe";
import { tabbyProvider } from "./tabby";
import { tamaraProvider } from "./tamara";

/**
 * Which ways of paying the shop can actually take today.
 *
 * Everything here is gated on credentials being present. That is not
 * defensive tidiness — it is the rule the rest of the site depends on: no
 * payment mark in the footer, no "4 × AED 780 with Tabby" on a product page
 * and no option at checkout unless the shop can genuinely put that payment
 * through. A payment method advertised before it works is a promise broken at
 * the worst possible moment.
 */

export const PROVIDERS: readonly PaymentProvider[] = [
  stripeProvider,
  tabbyProvider,
  tamaraProvider,
];

export function providerFor(method: PayMethod): PaymentProvider | null {
  return PROVIDERS.find((p) => p.method === method) ?? null;
}

/** The online providers that are wired up, in the order they should be shown. */
export function liveProviders(): PaymentProvider[] {
  return PROVIDERS.filter((p) => p.configured());
}

/** True when at least one instalment provider can take an order. */
export function instalmentsLive(): boolean {
  return liveProviders().some((p) => p.method === "tabby" || p.method === "tamara");
}

/**
 * How an instalment plan is described on a product page.
 *
 * Four payments is what both Tabby and Tamara lead with in the UAE. The figure
 * is arithmetic on the price, not a quote: what a customer is actually offered
 * depends on their own approval, which is why the copy that uses this says
 * "from" and names the approval step.
 */
export function instalmentOf(price: number): number {
  return Math.ceil(price / 4);
}

/** Absolute URLs for a provider to send the customer back to. */
export function returnUrls(ref: string): { returnUrl: string; cancelUrl: string } {
  const base = SITE_CONFIG.siteUrl;
  return {
    returnUrl: `${base}/order?ref=${encodeURIComponent(ref)}`,
    cancelUrl: `${base}/checkout?failed=${encodeURIComponent(ref)}`,
  };
}

export type { PaymentProvider, PaymentState, SessionResult } from "./types";
