"use client";

import { useId, useState } from "react";
import s from "./product.module.css";

/**
 * One accordion section.
 *
 * A `<details>` element would be less code, but its open state cannot be
 * animated or styled consistently across browsers, and the marker is drawn by
 * the platform in a colour the palette has no say over. This is a button and a
 * region, wired the way a disclosure is meant to be.
 */
export default function Fold({
  title,
  open = false,
  children,
}: {
  title: string;
  open?: boolean;
  children: React.ReactNode;
}) {
  const [on, setOn] = useState(open);
  const id = useId();

  return (
    <div className={s.fold}>
      <button
        type="button"
        className={s.foldHead}
        aria-expanded={on}
        aria-controls={id}
        onClick={() => setOn((v) => !v)}
      >
        {title}
        <span className={s.foldMark} aria-hidden>{on ? "−" : "+"}</span>
      </button>
      <div id={id} className={s.foldBody} hidden={!on}>
        {children}
      </div>
    </div>
  );
}
