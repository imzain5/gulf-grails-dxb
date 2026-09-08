"use client";

import { useSyncExternalStore } from "react";

/**
 * Dark and light are both first-class, so the choice has to be a real one:
 * remembered across navigation, and applied before the first paint rather than
 * corrected after it.
 *
 * The `<html>` attribute is the source of truth and `localStorage` is its
 * backing store; the inline script in the root layout reads that store before
 * anything renders. This component never decides the initial value — by the
 * time React runs, the page is already painted — so it *reads* the attribute
 * through `useSyncExternalStore` rather than syncing it into state in an
 * effect, which would render once with the wrong answer.
 *
 * Clearing the choice hands control back to the operating system.
 */

export type Theme = "dark" | "light" | "system";

const KEY = "gg-theme";

/** Our own writes are the only thing that changes the attribute. */
const listeners = new Set<() => void>();

function subscribe(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function getSnapshot(): Theme {
  const attr = document.documentElement.getAttribute("data-theme");
  return attr === "light" || attr === "system" ? attr : "dark";
}

/** Prerendering has no document; dark is the house default. */
function getServerSnapshot(): Theme {
  return "dark";
}

function apply(theme: Theme) {
  const root = document.documentElement;
  // "system" is a stored choice like any other, not the absence of one.
  if (theme === "dark") root.removeAttribute("data-theme");
  else root.setAttribute("data-theme", theme);

  try {
    if (theme === "dark") localStorage.removeItem(KEY);
    else localStorage.setItem(KEY, theme);
  } catch {
    // Private mode, or storage disabled. The toggle still works for this page.
  }

  for (const fn of listeners) fn();
}

export default function ThemeToggle({ className }: { className?: string }) {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <div className={className} role="group" aria-label="Colour theme">
      {(["dark", "light", "system"] as const).map((t) => (
        <button
          key={t}
          type="button"
          onClick={() => apply(t)}
          aria-pressed={theme === t}
          data-on={theme === t ? "" : undefined}
        >
          {t}
        </button>
      ))}
    </div>
  );
}

/**
 * Runs before first paint, from the root layout, so a dark-mode visitor never
 * sees a white flash. Kept as a string because it must be inline — a module
 * would load too late to matter.
 */
export const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem("${KEY}");if(t==="light"||t==="system")document.documentElement.setAttribute("data-theme",t);}catch(e){}})();`;
