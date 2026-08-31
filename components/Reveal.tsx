"use client";

import React, { useEffect, useRef, useState } from "react";

/**
 * Fades a block up as it scrolls into view.
 *
 * The hidden state is applied on the very first render rather than switched on
 * from an effect — arming it later paints the content, hides it, then fades it
 * back in, which reads as a flicker on load. The cost of that is that the
 * markup ships with `opacity: 0`, so `app/layout.tsx` carries a `<noscript>`
 * rule that turns the whole effect off when scripts don't run. Crawlers read
 * the DOM rather than the paint, so the text is never hidden from them.
 *
 * `prefers-reduced-motion` is handled in globals.css, as is printing.
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
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;

    // No observer (an old browser, a test environment): show it and stop.
    if (!el || typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }

    // Anything already on screen at mount reveals on the observer's first
    // callback rather than waiting for a scroll that may never come.
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
      className: ["gg-reveal", shown ? "gg-in" : "", className].filter(Boolean).join(" "),
      style: { ...style, ...(delay ? ({ "--delay": `${delay}ms` } as React.CSSProperties) : null) },
    },
    children,
  );
}
