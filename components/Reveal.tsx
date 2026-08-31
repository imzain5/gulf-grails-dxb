"use client";

import React, { useEffect, useRef, useState } from "react";

/**
 * Fades a block up as it scrolls into view.
 *
 * Starts visible and only hides itself once the observer is confirmed to be
 * running, so the content is never stranded invisible — with JavaScript off,
 * an old browser, or a crawler, the page renders exactly as it would without
 * the effect. `prefers-reduced-motion` is handled in CSS.
 */
export default function Reveal({
  children,
  delay = 0,
  as: Tag = "div",
  className,
  style,
}: {
  children: React.ReactNode;
  /** Stagger, in ms — use it to cascade a row of cards. */
  delay?: number;
  as?: "div" | "section" | "li";
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [armed, setArmed] = useState(false);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    setArmed(true);

    // Anything already on screen at mount reveals immediately rather than
    // waiting for a scroll that may never come.
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setShown(true);
            io.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.04 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return React.createElement(
    Tag,
    {
      ref: ref as React.Ref<never>,
      className: [armed ? "gg-reveal" : "", armed && shown ? "gg-in" : "", className]
        .filter(Boolean)
        .join(" "),
      style: { ...style, ...(delay ? ({ "--delay": `${delay}ms` } as React.CSSProperties) : null) },
    },
    children,
  );
}
