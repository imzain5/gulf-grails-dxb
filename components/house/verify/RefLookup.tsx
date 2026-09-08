"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Button } from "../primitives";
import s from "./verify.module.css";

/**
 * Look a record up by the reference printed on the card.
 *
 * The QR is the fast path; this is for the phone that will not scan, the
 * photocopied card, and the person reading a reference to us down the phone.
 *
 * The map arrives from the server already built — references are derived from
 * listing ids, so there is nothing to query and nothing about it is secret.
 * Matching is done on letters and digits only, which means GG-687B-5695,
 * gg687b5695 and "687B 5695" all resolve, because that is how people type
 * something they are reading off card.
 */
export default function RefLookup({ refs }: { refs: Record<string, string> }) {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [miss, setMiss] = useState(false);

  const index = useMemo(() => {
    const out: Record<string, string> = {};
    for (const [ref, id] of Object.entries(refs)) out[normalise(ref)] = id;
    return out;
  }, [refs]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const key = normalise(value);
    // A bare eight-character reference is what people type; tolerate the GG.
    const id = index[key] ?? index[`GG${key}`];
    if (id) router.push(`/verify/${id}`);
    else setMiss(true);
  };

  return (
    <form className={s.lookup} onSubmit={submit}>
      <div className={s.lookupRow}>
        <input
          className={s.input}
          value={value}
          onChange={(e) => { setValue(e.target.value); setMiss(false); }}
          placeholder="GG-0000-0000"
          aria-label="Record reference"
          autoComplete="off"
          spellCheck={false}
        />
        <Button type="submit">Look it up</Button>
      </div>
      {miss ? (
        <p className={`${s.result} ${s.miss}`}>
          No record under that reference. Check the characters — or send us a photo
          of the card on WhatsApp and we will find it.
        </p>
      ) : (
        <p className={s.result}>
          The reference is printed on the card that came in the box.
        </p>
      )}
    </form>
  );
}

/** Letters and digits, uppercased. Spaces, dashes and case are noise here. */
function normalise(v: string): string {
  return v.toUpperCase().replace(/[^0-9A-Z]/g, "");
}
