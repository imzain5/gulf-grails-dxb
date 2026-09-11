import s from "./flow.module.css";

/** Bag, delivery, done — so the end of the process is visible from the start. */
const NAMES = ["Bag", "Delivery & payment", "Confirmed"] as const;

export default function Steps({ at }: { at: 1 | 2 | 3 }) {
  return (
    <div className={s.steps}>
      {NAMES.map((name, i) => (
        <span key={name}>
          <span className={i + 1 === at ? s.stepOn : undefined}>{name}</span>
          {i < NAMES.length - 1 && <span className={s.stepSep}> / </span>}
        </span>
      ))}
    </div>
  );
}
