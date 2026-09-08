import { Button, Label } from "./primitives";
import s from "./SectionHeader.module.css";

/**
 * Kicker, title, optional note, optional action — the shape every section on
 * the site opens with, so the page rhythm is defined once.
 *
 * The title is the display serif at weight 400 and mixed case. It is never
 * uppercased and never bolded; that restraint is most of the register.
 */
export default function SectionHeader({
  kicker,
  title,
  note,
  action,
  as: As = "h2",
  className,
}: {
  kicker?: string;
  title: React.ReactNode;
  note?: string;
  action?: { label: string; href: string };
  as?: "h1" | "h2" | "h3";
  className?: string;
}) {
  return (
    <div className={[s.head, className].filter(Boolean).join(" ")}>
      <div className={s.titles}>
        {kicker && <Label>{kicker}</Label>}
        <As className={s.title}>{title}</As>
        {note && <p className={s.note}>{note}</p>}
      </div>
      {action && (
        <Button variant="link" href={action.href} className={s.action}>
          {action.label}
        </Button>
      )}
    </div>
  );
}
