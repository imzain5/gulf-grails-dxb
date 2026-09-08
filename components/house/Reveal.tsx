"use client";

import { useEffect, useRef, useState } from "react";
import s from "./Reveal.module.css";

/**
 * The signature move, applied consistently: a slow clip wipe as a section
 * enters, staggered per item.
 *
 * The clip is on an inner layer, not on the element being observed — see
 * Reveal.module.css for why that is not a style preference but a correctness
 * requirement.
 *
 * Reveals once and then disconnects. Content that re-hides on scroll-back
 * reads as a screensaver.
 */
export default function Reveal({
  children,
  /** `wipe` for imagery, `rise` for type. */
  variant = "wipe",
  /** Milliseconds, usually `index * 60`. */
  delay = 0,
  className,
  style,
}: {
  children: React.ReactNode;
  variant?: "wipe" | "rise";
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  // Always a div. A polymorphic `as` here bought nothing but ref-typing pain —
  // wrap the Reveal in the semantic element rather than the other way round.
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    /*
     * A reduced-motion preference needs nothing here — Reveal.module.css
     * already neutralises the clip and the transform under that query, so the
     * content is visible whether or not this ever runs.
     *
     * Without an observer there is no way to know when the element arrives, so
     * reveal on the next frame and be done.
     */
    if (typeof IntersectionObserver === "undefined") {
      const raf = requestAnimationFrame(() => setOn(true));
      return () => cancelAnimationFrame(raf);
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setOn(true);
          io.disconnect();
        }
      },
      // Start a little before the edge so the wipe finishes as it arrives.
      { rootMargin: "0px 0px -8% 0px", threshold: 0.01 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const cls = [s.outer, variant === "rise" && s.rise, on && s.on, className]
    .filter(Boolean)
    .join(" ");

  return (
    <div ref={ref} className={cls} style={style}>
      <span className={s.inner} style={delay ? { transitionDelay: `${delay}ms` } : undefined}>
        {children}
      </span>
    </div>
  );
}
