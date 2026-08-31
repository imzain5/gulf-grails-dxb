"use client";

import React, { useEffect, useRef, useState } from "react";

/**
 * The homepage's scroll reveal.
 *
 * Separate from the shared `Reveal` so the homepage's motion can be tuned —
 * longer travel, a slower curve, and an image variant that uncovers from the
 * bottom edge — without touching the product page.
 *
 * The mask variant puts the `clip-path` on an inner layer rather than on the
 * observed element. A clipped element reports no visible area, so an
 * IntersectionObserver watching it never fires and the image stays hidden
 * forever; the wrapper stays unclipped so it can be seen to arrive.
 *
 * Like `Reveal`, this ships hidden and relies on the `<noscript>` rule in
 * app/layout.tsx, so nothing is ever stranded invisible.
 */
export default function Rise({
  children,
  delay = 0,
  variant = "rise",
  as: Tag = "div",
  className,
  style,
}: {
  children: React.ReactNode;
  /** Stagger in ms, for cascading a row. */
  delay?: number;
  /** "rise" fades copy up; "mask" uncovers imagery. */
  variant?: "rise" | "mask";
  as?: "div" | "section" | "figure" | "li";
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setShown(true);
            io.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.02 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const delayVar = delay ? ({ "--d": `${delay}ms` } as React.CSSProperties) : null;

  if (variant === "mask") {
    return React.createElement(
      Tag,
      {
        ref: ref as React.Ref<never>,
        className,
        // The clip layer covers the wrapper exactly, so `fill` images inside
        // size against it and get clipped with it.
        style: { position: "relative", ...style },
      },
      <span
        className={`hp-mask${shown ? " hp-in" : ""}`}
        style={{ position: "absolute", inset: 0, display: "block", ...delayVar }}
      >
        {children}
      </span>,
    );
  }

  return React.createElement(
    Tag,
    {
      ref: ref as React.Ref<never>,
      className: ["hp-rise", shown ? "hp-in" : "", className].filter(Boolean).join(" "),
      style: { ...style, ...delayVar },
    },
    children,
  );
}
