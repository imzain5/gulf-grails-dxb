import Link from "next/link";
import s from "./primitives.module.css";

/**
 * The house vocabulary.
 *
 * Everything else is assembled from these five. They are plain server
 * components with no state, so they can be used from either side of the
 * boundary, and every value they set comes from styles/tokens.css.
 */

/* ── Button ─────────────────────────────────────────────────────────────── */

type ButtonVariant = "primary" | "ghost" | "link";

type ButtonProps = {
  variant?: ButtonVariant;
  block?: boolean;
  children: React.ReactNode;
  className?: string;
} & (
  | ({ href: string } & Omit<React.ComponentProps<typeof Link>, "href" | "className">)
  | ({ href?: undefined } & Omit<React.ComponentProps<"button">, "className">)
);

const VARIANT: Record<ButtonVariant, string> = {
  primary: s.primary,
  ghost: s.ghost,
  link: s.link,
};

/**
 * Renders an `<a>` when given an href and a `<button>` otherwise, so a link
 * that looks like an action is still a link — right-clickable, openable in a
 * new tab, and announced correctly.
 */
export function Button({ variant = "primary", block, children, className, ...rest }: ButtonProps) {
  const cls = [s.btn, VARIANT[variant], block && s.block, className].filter(Boolean).join(" ");

  if (rest.href !== undefined) {
    const { href, ...link } = rest as { href: string };
    return <Link href={href} className={cls} {...link}>{children}</Link>;
  }
  return <button className={cls} {...(rest as React.ComponentProps<"button">)}>{children}</button>;
}

/* ── Tag ────────────────────────────────────────────────────────────────── */

/**
 * `brass` marks provenance and authentication; `signal` marks a state the
 * customer needs to notice — sold, a live countdown, a price drop. Neither is
 * decoration, and the brief's budget is three brass marks per viewport.
 */
export function Tag({
  tone = "default",
  children,
  className,
}: {
  tone?: "default" | "brass" | "signal";
  children: React.ReactNode;
  className?: string;
}) {
  const cls = [s.tag, tone === "brass" && s.tagBrass, tone === "signal" && s.tagSignal, className]
    .filter(Boolean)
    .join(" ");
  return <span className={cls}>{children}</span>;
}

/* ── Label ──────────────────────────────────────────────────────────────── */

export function Label({
  tone = "default",
  as: As = "span",
  children,
  className,
}: {
  tone?: "default" | "hi" | "brass";
  as?: "span" | "div" | "h2" | "h3";
  children: React.ReactNode;
  className?: string;
}) {
  const cls = [s.label, tone === "hi" && s.labelHi, tone === "brass" && s.labelBrass, className]
    .filter(Boolean)
    .join(" ");
  return <As className={cls}>{children}</As>;
}

/* ── Price ──────────────────────────────────────────────────────────────── */

/**
 * A price set in a mono face with tabular figures reads as a valuation; the
 * same number in a heavy grotesk reads as a sale. That is the whole reason the
 * data face exists, so nothing else is allowed to render a figure.
 *
 * `was` renders struck through and deliberately carries no percentage.
 *
 * `instalment` is wired but unused: the copy would be a claim about a payment
 * method that isn't integrated yet, so nothing passes it until Tabby is live
 * in Phase 4.
 */
export function Price({
  amount,
  was,
  size = "md",
  instalment,
  className,
}: {
  amount: number;
  was?: number;
  size?: "sm" | "md" | "lg";
  instalment?: string;
  className?: string;
}) {
  const fmt = (n: number) => `AED ${n.toLocaleString("en-US")}`;
  const cls = [s.price, size === "sm" && s.priceSm, size === "lg" && s.priceLg, className]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={cls}>
      <span className={s.priceNow}>{fmt(amount)}</span>
      {was !== undefined && was > amount && (
        <span className={s.priceWas}>{fmt(was)}</span>
      )}
      {instalment && <span className={s.priceInstalment}>{instalment}</span>}
    </span>
  );
}

/* ── Hairline ───────────────────────────────────────────────────────────── */

export function Hairline({
  tone = "default",
  className,
}: {
  tone?: "default" | "strong" | "brass";
  className?: string;
}) {
  const cls = [tone === "strong" ? s.hairStrong : tone === "brass" ? s.hairBrass : s.hair, className]
    .filter(Boolean)
    .join(" ");
  return <hr className={cls} />;
}
