"use client";

import React, { createContext, useCallback, useContext, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { findIn, type Product } from "@/data/products";
import { useCatalogue } from "./CatalogueContext";
import { sizePrice } from "@/lib/sizes";
import { money } from "@/lib/money";
import { SITE_CONFIG } from "@/lib/config";
import { createPersistedStore } from "@/lib/persistedStore";

export interface CartLine {
  pid: string;
  size: number;
  qty: number;
}

export interface OrderForm {
  name: string;
  phone: string;
  emirate: string;
  area: string;
  address: string;
  window: string;
  notes: string;
}

export interface PlacedOrderLine {
  name: string;
  size: number;
  qty: number;
  amount: number;
}

export interface PlacedOrder {
  ref: string;
  date: string;
  lines: PlacedOrderLine[];
  total: number;
  discount: number;
  pay: "cod" | "bank";
  form: OrderForm;
}

const EMPTY_FORM: OrderForm = {
  name: "", phone: "", emirate: "Dubai", area: "", address: "",
  window: "Evening (5 – 9pm)", notes: "",
};

const STORAGE_KEY = "gulf-grails:store:v1";

interface Persisted {
  cart: CartLine[];
  wish: string[];
  form: OrderForm;
  ref: string;
  refOk: boolean;
  pay: "cod" | "bank";
  receipt: string;
  confirmSize: boolean;
  lastOrder: PlacedOrder | null;
}

const DEFAULT_STATE: Persisted = {
  cart: [], wish: [], form: EMPTY_FORM, ref: "", refOk: false, pay: "cod",
  receipt: "", confirmSize: false, lastOrder: null,
};

const store = createPersistedStore<Persisted>(STORAGE_KEY, DEFAULT_STATE, (base, saved) => ({
  ...base, ...saved, form: { ...EMPTY_FORM, ...saved.form },
}));

export interface ResolvedLine {
  key: string;
  i: number;
  p: Product;
  size: number;
  qty: number;
  amount: number;
}

interface StoreContextValue {
  cart: CartLine[];
  wish: string[];
  form: OrderForm;
  ref: string;
  refOk: boolean;
  pay: "cod" | "bank";
  receipt: string;
  confirmSize: boolean;
  lastOrder: PlacedOrder | null;
  toast: string;
  showToast: (t: string) => void;
  /** True while a product page's sticky add-to-bag bar is showing, so the floating WhatsApp button can hop above it. */
  stickyBar: boolean;
  setStickyBar: (v: boolean) => void;
  lines: () => ResolvedLine[];
  subtotal: () => number;
  deliveryFee: () => number;
  discount: () => number;
  total: () => number;
  cartCount: () => number;
  addToBag: (pid: string, size: number) => void;
  setQty: (i: number, delta: number) => void;
  removeLine: (i: number) => void;
  toggleWish: (pid: string) => void;
  isWished: (pid: string) => boolean;
  setForm: (patch: Partial<OrderForm>) => void;
  setRef: (v: string) => void;
  applyRef: () => void;
  setPay: (p: "cod" | "bank") => void;
  setReceipt: (name: string) => void;
  setConfirmSize: (v: boolean) => void;
  placeOrder: () => PlacedOrder | null;
  orderMessageText: (o: PlacedOrder) => string;
}

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const state = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);
  // Cart lines are stored as ids, so pricing and naming them needs the live
  // catalogue rather than a compiled-in copy.
  const catalogue = useCatalogue();
  const [toast, setToast] = useState("");
  const [stickyBar, setStickyBar] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((t: string) => {
    setToast(t);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 3600);
  }, []);

  const lines = useCallback((): ResolvedLine[] => {
    return state.cart.map((c, i) => {
      const p = findIn(catalogue, c.pid);
      const unit = sizePrice(p, c.size);
      return { key: c.pid + "-" + c.size, i, p, size: c.size, qty: c.qty, amount: unit * c.qty };
    });
  }, [state.cart, catalogue]);

  const subtotal = useCallback(() => lines().reduce((s, l) => s + l.amount, 0), [lines]);
  const deliveryFee = useCallback(
    () => (state.form.emirate === "Dubai" ? 0 : SITE_CONFIG.deliveryFeeOutside),
    [state.form.emirate],
  );
  const discount = useCallback(
    () => (state.refOk ? SITE_CONFIG.referralDiscount : 0),
    [state.refOk],
  );
  const total = useCallback(
    () => Math.max(0, subtotal() + deliveryFee() - discount()),
    [subtotal, deliveryFee, discount],
  );
  const cartCount = useCallback(
    () => lines().reduce((n, l) => n + l.qty, 0),
    [lines],
  );

  const addToBag = useCallback((pid: string, size: number) => {
    store.set((s) => {
      const k = s.cart.findIndex((c) => c.pid === pid && c.size === size);
      const cart = k >= 0
        ? s.cart.map((c, j) => (j === k ? { ...c, qty: c.qty + 1 } : c))
        : [...s.cart, { pid, size, qty: 1 }];
      return { ...s, cart };
    });
    showToast("Added — EU " + size);
  }, [showToast]);

  const setQty = useCallback((i: number, delta: number) => {
    store.set((s) => ({
      ...s,
      cart: s.cart.map((c, k) => (k === i ? { ...c, qty: Math.max(1, c.qty + delta) } : c)),
    }));
  }, []);

  const removeLine = useCallback((i: number) => {
    store.set((s) => ({ ...s, cart: s.cart.filter((_, k) => k !== i) }));
  }, []);

  const toggleWish = useCallback((pid: string) => {
    store.set((s) => ({
      ...s,
      wish: s.wish.includes(pid) ? s.wish.filter((x) => x !== pid) : [...s.wish, pid],
    }));
  }, []);

  const isWished = useCallback((pid: string) => state.wish.includes(pid), [state.wish]);

  const setForm = useCallback((patch: Partial<OrderForm>) => {
    store.set((s) => ({ ...s, form: { ...s.form, ...patch } }));
  }, []);

  const setRef = useCallback((v: string) => store.set((s) => ({ ...s, ref: v })), []);

  const applyRef = useCallback(() => {
    store.set((s) => {
      const ok = s.ref.trim().length >= 3;
      if (ok) showToast("Referral applied — " + money(SITE_CONFIG.referralDiscount) + " off");
      else showToast("Enter your friend's name or code");
      return { ...s, refOk: ok };
    });
  }, [showToast]);

  const setPay = useCallback((p: "cod" | "bank") => store.set((s) => ({ ...s, pay: p })), []);
  const setReceipt = useCallback((name: string) => store.set((s) => ({ ...s, receipt: name })), []);
  const setConfirmSize = useCallback((v: boolean) => store.set((s) => ({ ...s, confirmSize: v })), []);

  const placeOrder = useCallback((): PlacedOrder | null => {
    let placed: PlacedOrder | null = null;
    store.set((s) => {
      const resolved = s.cart.map((c) => {
        const p = findIn(catalogue, c.pid);
        const unit = sizePrice(p, c.size);
        return { name: p.name, size: c.size, qty: c.qty, amount: unit * c.qty };
      });
      if (resolved.length === 0) return s;
      const disc = s.refOk ? SITE_CONFIG.referralDiscount : 0;
      const sub = resolved.reduce((sum, l) => sum + l.amount, 0);
      const fee = s.form.emirate === "Dubai" ? 0 : SITE_CONFIG.deliveryFeeOutside;
      const orderTotal = Math.max(0, sub + fee - disc);
      const ref = "GG-" + String(Math.floor(1000 + Math.random() * 9000));
      const order: PlacedOrder = {
        ref, lines: resolved, total: orderTotal, discount: disc, pay: s.pay, form: { ...s.form },
        date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      };
      placed = order;
      return { ...s, cart: [], lastOrder: order, receipt: "", confirmSize: false, ref: "", refOk: false };
    });
    return placed;
  }, [catalogue]);

  const orderMessageText = useCallback((o: PlacedOrder) => {
    const items = o.lines
      .map((l) => "• " + l.name + " — EU " + l.size + " × " + l.qty + " — " + money(l.amount))
      .join("\n");
    return [
      "Hello Gulf Grails — order " + o.ref, "", items, "",
      "Total: " + money(o.total) + " (" + (o.pay === "cod" ? "cash on delivery" : "bank transfer") + ")",
      o.discount ? "Referral discount applied: −" + money(o.discount) : "",
      "Name: " + o.form.name,
      "Phone: " + o.form.phone,
      "Address: " + [o.form.address, o.form.area, o.form.emirate].filter(Boolean).join(", "),
      "Window: " + o.form.window,
      o.form.notes ? "Note: " + o.form.notes : "",
      o.pay === "bank" ? "Please send me the bank details." : "",
    ].filter((x) => x !== "").join("\n");
  }, []);

  const value = useMemo<StoreContextValue>(() => ({
    cart: state.cart,
    wish: state.wish,
    form: state.form,
    ref: state.ref,
    refOk: state.refOk,
    pay: state.pay,
    receipt: state.receipt,
    confirmSize: state.confirmSize,
    lastOrder: state.lastOrder,
    toast,
    showToast,
    stickyBar,
    setStickyBar,
    lines,
    subtotal,
    deliveryFee,
    discount,
    total,
    cartCount,
    addToBag,
    setQty,
    removeLine,
    toggleWish,
    isWished,
    setForm,
    setRef,
    applyRef,
    setPay,
    setReceipt,
    setConfirmSize,
    placeOrder,
    orderMessageText,
  }), [state, toast, showToast, stickyBar, lines, subtotal, deliveryFee, discount, total, cartCount,
    addToBag, setQty, removeLine, toggleWish, isWished, setForm, setRef, applyRef, setPay, setReceipt,
    setConfirmSize, placeOrder, orderMessageText]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
