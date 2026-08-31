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
    <footer style={{ background: "var(--color-text)", color: "var(--color-bg)" }}>
      <div className="gg-wrap" style={{ paddingTop: "clamp(44px,5vw,76px)" }}>
        <div
          aria-hidden
          style={{
            fontFamily: "var(--font-heading)", fontWeight: 900,
            fontSize: "clamp(44px, 11.5vw, 190px)", lineHeight: 0.84,
            letterSpacing: "-0.05em", textTransform: "uppercase",
            color: "color-mix(in srgb, #f3f2f2 92%, transparent)",
          }}
        >
          Gulf Grails
        </div>
        <hr style={{ border: 0, height: 1, background: "var(--gg-hair-light)", margin: "clamp(30px,3.6vw,54px) 0 0" }} />
      </div>
      <div
        className="gg-wrap gg-cols"
        style={{ padding: "clamp(30px,3.6vw,44px) var(--gutter) clamp(34px,4vw,48px)", gap: "clamp(26px,3.4vw,44px)", "--cols": "1.1fr .7fr .7fr 1.3fr", "--cols-md": "1.2fr .8fr .8fr", "--cols-sm": "1fr 1fr", "--cols-xs": "minmax(0, 1fr)" } as React.CSSProperties}
      >
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--color-neutral-500)", marginBottom: 14 }}>
            The house
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
          <form onSubmit={subscribe} style={{ display: "flex", gap: 0, border: "1px solid var(--gg-hair-light)" }}>
            <input
              value={mail}
              onChange={(e) => setMail(e.target.value)}
              placeholder="you@email.com"
              style={{ appearance: "none", border: 0, background: "none", outline: "none", font: "inherit", fontSize: 13, padding: "0 12px", height: 44, flex: 1, color: "var(--color-bg)", minWidth: 0 }}
            />
            <button type="submit" style={{ appearance: "none", border: 0, background: "var(--color-bg)", color: "var(--color-text)", font: "inherit", fontSize: 10, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", padding: "0 20px", cursor: "pointer", height: 44, flex: "none" }}>
              Join
            </button>
          </form>
          <div style={{ fontSize: 11, color: "var(--color-neutral-500)", marginTop: 10, lineHeight: 1.5 }}>
            Refer a friend and they get AED 100 off their first pair.
          </div>
        </div>
      </div>
      <div className="gg-wrap" style={{ padding: "18px var(--gutter) 32px", borderTop: "1px solid var(--gg-hair-light)", display: "flex", justifyContent: "space-between", gap: 20, fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--color-neutral-500)", flexWrap: "wrap" }}>
        <span>© 2026 Gulf Grails · Dubai, UAE</span>
        <span>Not affiliated with Nike, adidas, Balenciaga or Dior. All pairs sourced on the secondary market.</span>
      </div>
    </footer>
  );
}
