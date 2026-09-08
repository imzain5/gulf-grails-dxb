import { waLink } from "@/lib/whatsapp";
import { Button } from "../primitives";
import s from "./editorial.module.css";

/**
 * How every editorial page ends: one line and the two things a reader can
 * actually do next. Consistent across the set so the pages read as one voice.
 */
export default function Closing({
  line,
  message,
  action,
}: {
  line: string;
  /** Prefills the WhatsApp thread, so the reader does not start from nothing. */
  message: string;
  action?: { label: string; href: string };
}) {
  return (
    <div className={s.close}>
      <p className={`${s.p} ${s.closeText}`}>{line}</p>
      <div className={s.closeActions}>
        <Button href={waLink(message)} target="_blank" rel="noopener">Message the house</Button>
        {action && <Button variant="ghost" href={action.href}>{action.label}</Button>}
      </div>
    </div>
  );
}
