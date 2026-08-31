"use client";

import { waLink } from "@/lib/whatsapp";
import { useStore } from "@/context/StoreContext";
import WhatsAppIcon from "./WhatsAppIcon";

export default function WhatsAppFloat() {
  const { stickyBar } = useStore();
  return (
    <a
      href={waLink("Hello Gulf Grails, I have a question about a pair.")}
      target="_blank"
      rel="noopener"
      aria-label="Message Gulf Grails on WhatsApp"
      className="gg-wa-hover"
      style={{
        position: "fixed", right: 22, bottom: stickyBar ? 104 : 22, zIndex: 80, height: 56,
        display: "flex", alignItems: "center", gap: 11, padding: "0 20px", background: "var(--color-accent)",
        color: "#fff", border: "2px solid var(--color-text)", boxShadow: "var(--shadow-lg)", fontSize: 12,
        fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", transition: "bottom .16s ease",
      }}
    >
      <WhatsAppIcon size={20} />
      Chat
    </a>
  );
}
