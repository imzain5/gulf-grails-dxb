"use client";

import { useEffect } from "react";
import { useStore } from "@/context/StoreContext";

/**
 * Empty the bag once an order is confirmed paid.
 *
 * On the offline path the bag is cleared as the order is committed. On the
 * online path the customer leaves for a payment page before anything is
 * certain, so the bag survives the trip — if they come back unpaid, it is
 * still there to try again with. This clears it only on the way past a
 * confirmed payment.
 */
export default function ClearBag({ when }: { when: boolean }) {
  const { clearBag } = useStore();
  useEffect(() => {
    if (when) clearBag();
  }, [when, clearBag]);
  return null;
}
