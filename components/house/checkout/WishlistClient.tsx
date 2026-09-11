"use client";

import { useCatalogue } from "@/context/CatalogueContext";
import { useStore } from "@/context/StoreContext";
import LotCard from "../LotCard";
import { Button } from "../primitives";
import s from "./flow.module.css";

/**
 * Saved pairs.
 *
 * Held in this browser and nowhere else, which the empty state says plainly
 * rather than letting someone assume a list follows them between devices.
 */
export default function WishlistClient() {
  const catalogue = useCatalogue();
  const { wish } = useStore();
  const saved = catalogue.filter((p) => wish.includes(p.id));

  return (
    <div className={s.page}>
      <h1 className={`${s.title} ${s.titleSm}`}>Saved</h1>

      {saved.length === 0 ? (
        <div className={s.empty}>
          <span className={s.emptyTitle}>Nothing saved yet.</span>
          <p className={s.emptyBody}>
            Tap the heart on any pair and it will wait here. Saved pairs live in this
            browser, so they will not follow you to another device — and a vault lot
            that sells is gone whether it is saved or not.
          </p>
          <Button href="/shop">See what we are holding</Button>
        </div>
      ) : (
        <div className={s.grid}>
          {saved.map((p) => (
            <LotCard key={p.id} product={p} sizes="(max-width: 760px) 50vw, 22vw" />
          ))}
        </div>
      )}
    </div>
  );
}
