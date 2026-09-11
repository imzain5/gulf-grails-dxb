import type { Order, PayMethod } from "../orders";

/**
 * One way to take money, behind one interface.
 *
 * Stripe, Tabby and Tamara are all the same shape from the shop's side: hand
 * them an order, get back a URL to send the customer to, and later be told
 * whether it worked — once by the customer coming back, once by a webhook.
 * Keeping that shape in one place is what stops the checkout page from
 * growing a branch per provider.
 */

/** What a provider needs to build a session. Nothing here is customer input. */
export interface SessionRequest {
  order: Order;
  /** Absolute, e.g. https://gulfgrails.ae/order?ref=GG-4821 */
  returnUrl: string;
  /** Absolute, where an abandoned or failed payment lands. */
  cancelUrl: string;
}

export interface SessionResult {
  /** Send the customer here. */
  redirectUrl: string;
  /** The provider's id for this session, stored on the order. */
  sessionId: string;
}

/** What a provider says about a session when asked directly. */
export type PaymentState =
  | { state: "paid"; paymentId?: string }
  | { state: "pending" }
  | { state: "failed"; reason: string };

export interface PaymentProvider {
  readonly method: PayMethod;
  /** Shown on the checkout page. */
  readonly label: string;
  /** One line under the label. Must describe what actually happens. */
  readonly blurb: string;
  /** True once this provider's credentials are present in the environment. */
  configured(): boolean;
  createSession(req: SessionRequest): Promise<SessionResult>;
  /**
   * Ask the provider directly what happened.
   *
   * Used on the return URL, because a customer who has just paid is looking at
   * the page now and the webhook may be seconds behind. The webhook remains
   * the authority for orders nobody comes back to.
   */
  readState(sessionId: string): Promise<PaymentState>;
}

/** AED has two minor units; every provider here wants the smallest unit. */
export function toFils(aed: number): number {
  return Math.round(aed * 100);
}
