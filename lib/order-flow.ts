import { getCatalogue, saveCatalogue } from "./catalogue";
import { getOrders, holdExpired, saveOrders, type Order } from "./orders";

/**
 * Giving back the pairs an abandoned checkout is still holding.
 *
 * Stock is a number stored on the product, not something derived from the
 * order list, so an expired hold cannot be ignored at read time — the pairs
 * have to be physically added back or they are gone until someone notices.
 *
 * There is no cron job. This runs on the paths where a stale hold actually
 * matters: the moment before the next order is priced, and whenever the
 * stockroom is opened. A shop with no traffic holds stock it is not selling
 * anyway, and a shop with traffic sweeps itself.
 */
export async function releaseExpiredHolds(): Promise<number> {
  const orders = await getOrders();
  const stale = orders.filter((o) => holdExpired(o));
  if (stale.length === 0) return 0;

  const give = new Map<string, number>();
  for (const o of stale) {
    for (const l of o.lines) give.set(l.pid, (give.get(l.pid) ?? 0) + l.qty);
  }

  const catalogue = await getCatalogue();
  const staleRefs = new Set(stale.map((o) => o.ref));

  const restored: Order[] = orders.map((o) =>
    staleRefs.has(o.ref)
      ? {
          ...o,
          status: "cancelled" as const,
          holdsStock: false,
          holdExpiresAt: undefined,
          payment: o.payment
            ? { ...o.payment, note: "Payment was not completed in time; the pairs went back on the shelf." }
            : undefined,
        }
      : o,
  );

  /*
   * Orders first, the mirror of placing one.
   *
   * Releasing a hold means writing stock up, so the failure to avoid is
   * crediting the shelf and then failing to clear the hold — run twice, that
   * invents pairs the shop does not have. Clearing the hold first can only
   * ever lose a pair on the shelf, which someone counting stock will find.
   */
  await saveOrders(restored);
  await saveCatalogue(
    catalogue.map((p) => {
      const back = give.get(p.id);
      return back ? { ...p, stock: p.stock + back } : p;
    }),
  );

  console.warn(`[holds] released ${stale.length} expired hold(s): ${[...staleRefs].join(", ")}`);
  return stale.length;
}

/**
 * Mark an order paid.
 *
 * Called from two places that race each other by design: the webhook, which is
 * the authority, and the page the customer lands on, which is often faster.
 * Whichever arrives first does the work; the second finds the order already
 * paid and changes nothing. That is why this is keyed on the order reference
 * and checks the current status rather than blindly writing.
 */
export async function markPaid(ref: string, paymentId?: string): Promise<Order | null> {
  const orders = await getOrders();
  const order = orders.find((o) => o.ref === ref);
  if (!order) return null;

  // Already done, by the other one of the two callers.
  if (order.status !== "awaiting_payment") return order;

  const paid: Order = {
    ...order,
    status: "new",
    holdExpiresAt: undefined,
    payment: {
      sessionId: order.payment?.sessionId ?? "",
      paymentId: paymentId ?? order.payment?.paymentId,
      paidAt: new Date().toISOString(),
      note: undefined,
    },
  };

  await saveOrders(orders.map((o) => (o.ref === ref ? paid : o)));
  return paid;
}

/**
 * Give up on an order whose payment failed outright.
 *
 * Distinct from an expired hold only in that we were told rather than left
 * waiting, so the pairs go back now instead of in half an hour.
 */
export async function failPayment(ref: string, reason: string): Promise<void> {
  const orders = await getOrders();
  const order = orders.find((o) => o.ref === ref);
  if (!order || order.status !== "awaiting_payment") return;

  await saveOrders(
    orders.map((o) =>
      o.ref === ref
        ? {
            ...o,
            status: "cancelled" as const,
            holdsStock: false,
            holdExpiresAt: undefined,
            payment: { sessionId: o.payment?.sessionId ?? "", note: reason },
          }
        : o,
    ),
  );

  if (order.holdsStock) {
    const catalogue = await getCatalogue();
    const give = new Map<string, number>();
    for (const l of order.lines) give.set(l.pid, (give.get(l.pid) ?? 0) + l.qty);
    await saveCatalogue(
      catalogue.map((p) => {
        const back = give.get(p.id);
        return back ? { ...p, stock: p.stock + back } : p;
      }),
    );
  }
}
