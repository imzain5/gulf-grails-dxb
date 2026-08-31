"use client";

import { useState } from "react";
import { FAQ } from "@/data/content";

export default function FaqAccordion() {
  const [open, setOpen] = useState(0);

  return (
    <div style={{ borderTop: "2px solid var(--color-text)" }}>
      {FAQ.map((f, i) => {
        const isOpen = open === i;
        return (
          <div key={f.q} style={{ borderBottom: "2px solid var(--color-divider)" }}>
            <button
              onClick={() => setOpen(isOpen ? -1 : i)}
              aria-expanded={isOpen}
              aria-controls={`faq-panel-${i}`}
              style={{
                appearance: "none", width: "100%", border: 0, background: "none", cursor: "pointer",
                font: "inherit", textAlign: "left", padding: "20px 0", display: "flex",
                justifyContent: "space-between", gap: 20, alignItems: "baseline", color: "inherit",
              }}
            >
              <span style={{
                fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "clamp(15px,1.4vw,17px)",
                lineHeight: 1.3, textWrap: "pretty",
                color: isOpen ? "var(--color-accent)" : "inherit", transition: "color .16s var(--ease-out)",
              }}>
                {f.q}
              </span>
              <svg
                width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)"
                strokeWidth="2.6" strokeLinecap="round" aria-hidden
                style={{ flex: "none", transform: isOpen ? "rotate(45deg)" : "none", transition: "transform .22s var(--ease-out)" }}
              >
                <path d="M12 5v14" /><path d="M5 12h14" />
              </svg>
            </button>
            {/* Grid-rows 0fr → 1fr animates to the content's own height, which
                a max-height guess can't do without clipping a long answer. */}
            <div
              id={`faq-panel-${i}`}
              style={{
                display: "grid",
                gridTemplateRows: isOpen ? "1fr" : "0fr",
                transition: "grid-template-rows .28s var(--ease-out)",
              }}
            >
              <div style={{ overflow: "hidden" }}>
                <p style={{
                  margin: 0, paddingBottom: 20, fontSize: 14, lineHeight: 1.6,
                  color: "var(--color-neutral-800)", maxWidth: "76ch", textWrap: "pretty",
                }}>
                  {f.a}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
