"use client";

import { useStore } from "@/context/StoreContext";
import s from "./ToastHost.module.css";

/**
 * The one-line confirmation after something goes in the bag.
 *
 * Lives at the layout level so it survives navigation — the toast for a pair
 * added on a product page is still there a moment later on the shop grid.
 */
export default function ToastHost() {
  const { toast } = useStore();
  if (!toast) return null;

  return (
    <div className={s.host} role="status" aria-live="polite">
      <span className={s.text}>{toast}</span>
    </div>
  );
}
