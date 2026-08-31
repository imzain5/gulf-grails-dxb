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
          <div key={f.q} onClick={() => setOpen(isOpen ? -1 : i)} style={{ borderBottom: "2px solid var(--color-divider)", padding: "20px 0", cursor: "pointer" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 20, alignItems: "baseline" }}>
              <span style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 17, lineHeight: 1.3, textWrap: "pretty" }}>{f.q}</span>
              <span style={{ fontWeight: 900, fontSize: 20, color: "var(--color-accent)", flex: "none", lineHeight: 1 }}>{isOpen ? "−" : "+"}</span>
            </div>
            {isOpen && (
              <div style={{ fontSize: 14, lineHeight: 1.6, color: "var(--color-neutral-800)", marginTop: 12, maxWidth: "76ch", textWrap: "pretty", animation: "gg-rise .18s ease" }}>
                {f.a}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
