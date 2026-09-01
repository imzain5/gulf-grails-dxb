"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/data/products";
import { deleteProductAction, setStockAction } from "@/app/admin/actions";

/**
 * One pair in the stockroom list.
 *
 * The stock box is the point: it is the edit made every day, so it is a plain
 * number field that saves on its own rather than something reached through the
 * full edit form. Zero is the out-of-stock switch — the pair stays on the site
 * and shows as sold out, which is what the shop wants while a restock is on
 * the way. Removing it from the site entirely is Delete.
 */
export default function InventoryRow({ product }: { product: Product }) {
  const [stock, setStock] = useState(String(product.stock));
  const [confirming, setConfirming] = useState(false);
  const cover = product.photos?.[0] ?? null;
  const out = product.stock === 0;
  const dirty = String(product.stock) !== stock.trim();

  return (
    <div className={`ad-row${out ? " is-out" : ""}`}>
      <div className={`ad-thumb${cover ? "" : " is-empty"}`}>
        {cover && <Image src={cover} alt="" width={62} height={62} sizes="62px" unoptimized />}
      </div>

      <div style={{ minWidth: 0 }}>
        <div className="ad-name">
          <Link href={`/admin/${product.id}`}>{product.name}</Link>
        </div>
        <div className="ad-meta">
          <span>AED {product.price.toLocaleString("en-US")}</span>
          {product.fam && <span>{product.fam}</span>}
          <span>EU {product.sizes.join(", ") || "—"}</span>
          {out && <span className="ad-tag is-out">Sold out</span>}
          {product.drop && <span className="ad-tag">{product.drop}</span>}
        </div>
      </div>

      <div className="ad-actions">
        <form action={setStockAction} style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <input type="hidden" name="id" value={product.id} />
          <label style={{ display: "contents" }}>
            <span className="ad-tag" style={{ border: 0, color: "var(--ad-mute)" }}>Stock</span>
            <input
              className="ad-stock"
              name="stock"
              type="number"
              min={0}
              step={1}
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              aria-label={`Pairs of ${product.name} in stock`}
            />
          </label>
          <button className="ad-btn is-small is-ghost" type="submit" disabled={!dirty}>
            {dirty ? "Save" : "Saved"}
          </button>
        </form>

        <Link className="ad-btn is-small is-ghost" href={`/admin/${product.id}`}>Edit</Link>

        {confirming ? (
          <form action={deleteProductAction} style={{ display: "flex", gap: 6 }}>
            <input type="hidden" name="id" value={product.id} />
            <button className="ad-btn is-small is-danger" type="submit">Delete for good</button>
            <button
              className="ad-btn is-small is-ghost"
              type="button"
              onClick={() => setConfirming(false)}
            >
              Keep
            </button>
          </form>
        ) : (
          <button
            className="ad-btn is-small is-danger"
            type="button"
            onClick={() => setConfirming(true)}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
