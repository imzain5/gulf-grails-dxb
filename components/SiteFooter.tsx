"use client";

import Link from "next/link";
import { useState } from "react";
import { waLink } from "@/lib/whatsapp";
import { SITE_CONFIG } from "@/lib/config";
import { useStore } from "@/context/StoreContext";

export default function SiteFooter() {
  const { showToast } = useStore();
  const [mail, setMail] = useState("");

  const subscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (mail.indexOf("@") > 0) {
      setMail("");
      showToast("You're on the list");
    } else {
      showToast("Enter a valid email");
    }
  };

  return (
    <footer style={{ borderTop: "2px solid var(--color-text)", background: "var(--color-text)", color: "var(--color-bg)" }}>
      <div
        className="gg-wrap gg-cols"
        style={{ padding: "clamp(34px,4vw,48px) var(--gutter) 32px", gap: "clamp(24px,3vw,36px)", "--cols": "1.1fr .7fr .7fr 1.3fr", "--cols-md": "1.2fr .8fr .8fr", "--cols-sm": "1fr 1fr", "--cols-xs": "minmax(0, 1fr)" } as React.CSSProperties}
      >
        <div>
          <div style={{ fontFamily: "var(--font-heading)", fontWeight: 900, fontSize: 23, letterSpacing: "-0.035em", textTransform: "uppercase", marginBottom: 14 }}>
            Gulf Grails
          </div>
          <div style={{ fontSize: 13, lineHeight: 1.6, color: "var(--color-neutral-400)", maxWidth: "34ch", textWrap: "pretty" }}>
            Luxury sneakers, verified in-house and delivered across the UAE. Al Quoz 1, Dubai. Viewing by appointment.
          </div>
          <a
            href={waLink("Hello Gulf Grails, I have a question about a pair.")}
            target="_blank" rel="noopener"
            className="gg-hover-accent-2"
            style={{ color: "var(--color-bg)", fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 18, letterSpacing: "-0.01em", display: "inline-block", marginTop: 16 }}
          >
            {SITE_CONFIG.whatsappNumber}
          </a>
        </div>
        <div>
          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--color-neutral-500)", marginBottom: 14 }}>Shop</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 9, alignItems: "flex-start" }}>
            <Link href="/shop" className="gg-hover-accent-2" style={{ appearance: "none", background: "none", border: 0, padding: 0, font: "inherit", fontSize: 13, cursor: "pointer", color: "var(--color-bg)" }}>All sneakers</Link>
            <Link href="/shop?fam=Travis+Scott" className="gg-hover-accent-2" style={{ appearance: "none", background: "none", border: 0, padding: 0, font: "inherit", fontSize: 13, cursor: "pointer", color: "var(--color-bg)" }}>Collab vault</Link>
            <Link href="/wishlist" className="gg-hover-accent-2" style={{ appearance: "none", background: "none", border: 0, padding: 0, font: "inherit", fontSize: 13, cursor: "pointer", color: "var(--color-bg)" }}>Saved pairs</Link>
            <Link href="/cart" className="gg-hover-accent-2" style={{ appearance: "none", background: "none", border: 0, padding: 0, font: "inherit", fontSize: 13, cursor: "pointer", color: "var(--color-bg)" }}>Your bag</Link>
          </div>
        </div>
        <div>
          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--color-neutral-500)", marginBottom: 14 }}>Gulf Grails</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 9, alignItems: "flex-start" }}>
            <Link href="/about" className="gg-hover-accent-2" style={{ appearance: "none", background: "none", border: 0, padding: 0, font: "inherit", fontSize: 13, cursor: "pointer", color: "var(--color-bg)" }}>About us</Link>
            <Link href="/trust" className="gg-hover-accent-2" style={{ appearance: "none", background: "none", border: 0, padding: 0, font: "inherit", fontSize: 13, cursor: "pointer", color: "var(--color-bg)" }}>Authenticity</Link>
            <Link href="/trust" className="gg-hover-accent-2" style={{ appearance: "none", background: "none", border: 0, padding: 0, font: "inherit", fontSize: 13, cursor: "pointer", color: "var(--color-bg)" }}>Delivery &amp; returns</Link>
            <Link href="/sell" className="gg-hover-accent-2" style={{ appearance: "none", background: "none", border: 0, padding: 0, font: "inherit", fontSize: 13, cursor: "pointer", color: "var(--color-bg)" }}>Sell to us</Link>
          </div>
        </div>
        <div className="gg-footer-wide">
          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--color-neutral-500)", marginBottom: 14 }}>Drop alerts</div>
          <div style={{ fontSize: 13, lineHeight: 1.55, color: "var(--color-neutral-400)", marginBottom: 14, textWrap: "pretty" }}>
            Restocks and new arrivals, once a week. No noise.
          </div>
          <form onSubmit={subscribe} style={{ display: "flex", gap: 0, border: "2px solid var(--color-bg)" }}>
            <input
              value={mail}
              onChange={(e) => setMail(e.target.value)}
              placeholder="you@email.com"
              style={{ appearance: "none", border: 0, background: "none", outline: "none", font: "inherit", fontSize: 13, padding: "0 12px", height: 44, flex: 1, color: "var(--color-bg)", minWidth: 0 }}
            />
            <button type="submit" style={{ appearance: "none", border: 0, background: "var(--color-accent)", color: "#fff", font: "inherit", fontSize: 11, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", padding: "0 18px", cursor: "pointer", height: 44, flex: "none" }}>
              Join
            </button>
          </form>
          <div style={{ fontSize: 11, color: "var(--color-neutral-500)", marginTop: 10, lineHeight: 1.5 }}>
            Refer a friend and they get AED 100 off their first pair.
          </div>
        </div>
      </div>
      <div className="gg-wrap" style={{ padding: "18px var(--gutter) 32px", borderTop: "1px solid var(--color-neutral-700)", display: "flex", justifyContent: "space-between", gap: 20, fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--color-neutral-500)", flexWrap: "wrap" }}>
        <span>© 2026 Gulf Grails · Dubai, UAE</span>
        <span>Not affiliated with Nike, adidas, Balenciaga or Dior. All pairs sourced on the secondary market.</span>
      </div>
    </footer>
  );
}
