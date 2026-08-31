"use client";

import Link from "next/link";
import { useStore } from "@/context/StoreContext";

export default function ToastHost() {
  const { toast } = useStore();
  if (!toast) return null;
  return (
    <div style={{
      position: "fixed", left: 22, bottom: 22, zIndex: 100, background: "var(--color-text)",
      color: "var(--color-bg)", border: "2px solid var(--color-text)", padding: "16px 20px",
      display: "flex", alignItems: "center", gap: 16, boxShadow: "var(--shadow-lg)", animation: "gg-rise .2s ease",
    }}>
      <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>{toast}</span>
      <Link href="/cart" style={{ appearance: "none", background: "var(--color-accent)", color: "#fff", border: 0, padding: "9px 14px", font: "inherit", fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", cursor: "pointer" }}>
        View bag
      </Link>
    </div>
  );
}
