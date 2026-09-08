"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/data/products";
import { searchModels } from "@/data/models";
import { SITE_CONFIG } from "@/lib/config";
import { money } from "@/lib/money";
import { waLink } from "@/lib/whatsapp";
import { Button, Label } from "../primitives";
import s from "./editorial.module.css";

/**
 * Selling a pair to the house.
 *
 * The band is the point. "Send us a photo and we'll get back to you" loses the
 * person who wanted a number; a number they can see before they type their
 * name is what makes them finish.
 *
 * It is derived from what the house already sells the same model for, times the
 * spread in lib/config.ts — a commercial figure the owner sets, not one
 * invented here. Where the house does not hold the model there is no honest
 * number to show, so the form says that instead of guessing.
 *
 * There is no photo upload. Accepting files from the public means an
 * unauthenticated write endpoint, and photos are the one thing WhatsApp
 * already does better than any form — so the handoff carries everything typed
 * here and asks for pictures in the thread.
 */
export default function SellForm({ catalogue }: { catalogue: Product[] }) {
  const [model, setModel] = useState("");
  const [size, setSize] = useState("");
  const [condition, setCondition] = useState("Deadstock — never worn");
  const [box, setBox] = useState("Original box");
  const [notes, setNotes] = useState("");

  // Best match in the catalogue for whatever they typed.
  const held = useMemo(() => {
    const needle = model.trim().toLowerCase();
    if (needle.length < 3) return null;
    return (
      catalogue.find((p) => p.name.toLowerCase().includes(needle)) ??
      catalogue.find((p) => `${p.name} ${p.colorway} ${p.sku}`.toLowerCase().includes(needle)) ??
      null
    );
  }, [catalogue, model]);

  // A shape we know, even if we are not holding one right now.
  const shape = useMemo(() => (model.trim().length < 3 ? null : searchModels(model, 1)[0] ?? null), [model]);

  const band = useMemo(() => {
    if (!held) return null;
    const [lo, hi] = SITE_CONFIG.sellBand;
    // Deadstock sits at the top of the band, worn at the bottom.
    const worn = condition.startsWith("Used");
    const low = Math.round((held.price * lo * (worn ? 0.85 : 1)) / 50) * 50;
    const high = Math.round((held.price * hi * (worn ? 0.85 : 1)) / 50) * 50;
    return { low, high, sellsAt: held.price };
  }, [held, condition]);

  const message = [
    "Hello Gulf Grails — I have a pair to sell.",
    "",
    `Model: ${model || "—"}`,
    `Size: ${size ? `EU ${size}` : "—"}`,
    `Condition: ${condition}`,
    `Box: ${box}`,
    notes ? `Notes: ${notes}` : "",
    band ? `\nYour site indicates ${money(band.low)}–${money(band.high)} for this.` : "",
    "",
    "Sending photos now.",
  ]
    .filter((l) => l !== "")
    .join("\n");

  const ready = model.trim().length >= 3 && size.trim().length > 0;

  return (
    <div className={s.form}>
      <div className={s.field}>
        <label className={s.fieldLabel} htmlFor="sell-model">What is it?</label>
        <input
          id="sell-model"
          className={s.input}
          value={model}
          onChange={(e) => setModel(e.target.value)}
          placeholder="Travis Scott x Air Jordan 1 Low Reverse Mocha"
          autoComplete="off"
        />
        {shape && !held && (
          <p className={s.hint}>
            We know the {shape.name} — we are just not holding one this week.
          </p>
        )}
      </div>

      <div className={s.fieldRow}>
        <div className={s.field}>
          <label className={s.fieldLabel} htmlFor="sell-size">Size · EU</label>
          <input
            id="sell-size"
            className={s.input}
            value={size}
            onChange={(e) => setSize(e.target.value)}
            inputMode="numeric"
            placeholder="42"
          />
        </div>

        <div className={s.field}>
          <label className={s.fieldLabel} htmlFor="sell-condition">Condition</label>
          <select id="sell-condition" className={s.select} value={condition} onChange={(e) => setCondition(e.target.value)}>
            <option>Deadstock — never worn</option>
            <option>VNDS — tried on, worn once or twice</option>
            <option>Used — worn, no major flaws</option>
            <option>Used — worn, with flaws</option>
          </select>
        </div>

        <div className={s.field}>
          <label className={s.fieldLabel} htmlFor="sell-box">Box</label>
          <select id="sell-box" className={s.select} value={box} onChange={(e) => setBox(e.target.value)}>
            <option>Original box</option>
            <option>Original box, damaged</option>
            <option>Replacement box</option>
            <option>No box</option>
          </select>
        </div>
      </div>

      <div className={s.field}>
        <label className={s.fieldLabel} htmlFor="sell-notes">Anything we should know</label>
        <textarea
          id="sell-notes"
          className={s.area}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Where you bought it, whether you still have the receipt, any marks."
        />
      </div>

      {band ? (
        <div className={s.band}>
          <Label tone="brass">Indicative — before we see it</Label>
          <span className={s.bandFigure}>{money(band.low)} – {money(band.high)}</span>
          <p className={s.bandNote}>
            Based on the {money(band.sellsAt)} we currently list the same model at. The real
            number depends on condition, box and what we already hold — we confirm it after
            looking at the pair, and we do not move on it afterwards.
          </p>
        </div>
      ) : (
        model.trim().length >= 3 && (
          <div className={s.band}>
            <Label tone="brass">No indicative figure for this one</Label>
            <p className={s.bandNote}>
              We are not holding this model, so there is nothing honest for us to quote against.
              Send it over and we will price it properly rather than guess at it here.
            </p>
          </div>
        )
      )}

      <div>
        <Button href={ready ? waLink(message) : "#"} target="_blank" rel="noopener" aria-disabled={!ready}>
          {ready ? "Send it on WhatsApp" : "Add the model and size"}
        </Button>
        <p className={s.hint}>
          Everything above goes with the message. Attach photos in the thread — the lateral side,
          the sole, the box label and the size tag.
        </p>
      </div>
    </div>
  );
}
