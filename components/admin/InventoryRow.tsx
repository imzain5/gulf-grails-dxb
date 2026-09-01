"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/data/products";
import { deleteProductAction, duplicateProductAction, setStockAction } from "@/app/admin/actions";

/**
 * One pair in the stockroom list.
 *
 * The stepper is the point. Counting stock is the job done every day, usually
 * standing up holding a shoe, so it is a pair of thumb-sized buttons rather
 * than a text field you have to select and retype — though the field is still
 * there for when twelve arrive at once. Save appears only once the number has
 * actually changed, so the row is quiet until it has something to say.
 *
 * Zero is not deletion. It takes the pair off sale and leaves the listing
 * standing, which is what a restock needs; Delete is separate, confirmed, and
 * permanent.
 */
export default function InventoryRow({ product }: { product: Product }) {
  const [stock, setStock] = useState(String(product.stock));
  const [confirming, setConfirming] = useState(false);
  const cover = product.photos?.[0] ?? null;

  const out = product.stock === 0;
  const low = product.stock > 0 && product.stock <= 2;
  const parsed = Math.max(0, Math.round(Number(stock) || 0));
  const dirty = parsed !== product.stock;

  return (
    <div className={`ad-row${out ? " is-out" : low ? " is-low" : ""}`}>
      <div className={`ad-thumb${cover ? "" : " is-empty"}`}>
        {cover && <Image src={cover} alt="" width={64} height={64} sizes="64px" />}
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
          {low && <span className="ad-tag is-low">Low</span>}
          {!cover && <span className="ad-tag">No photo</span>}
          {product.drop && <span className="ad-tag">{product.drop}</span>}
        </div>
      </div>

      <div className="ad-actions">
        <form action={setStockAction} style={{ display: "flex", gap: 8, alignItems: "center", flex: 1 }}>
          <input type="hidden" name="id" value={product.id} />
          <div className="ad-stepper">
            <button
              type="button"
              onClick={() => setStock(String(Math.max(0, parsed - 1)))}
              disabled={parsed === 0}
              aria-label={`One fewer ${product.name}`}
            >
              −
            </button>
            <input
              name="stock"
              type="number"
              inputMode="numeric"
              min={0}
              step={1}
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              aria-label={`Pairs of ${product.name} in stock`}
            />
            <button
              type="button"
              onClick={() => setStock(String(parsed + 1))}
              aria-label={`One more ${product.name}`}
            >
              +
            </button>
          </div>
          {dirty && (
            <button className="ad-btn is-small" type="submit">Save</button>
          )}
        </form>

        {confirming ? (
          <form action={deleteProductAction} style={{ display: "flex", gap: 8 }}>
            <input type="hidden" name="id" value={product.id} />
            <button className="ad-btn is-small is-danger" type="submit">Delete for good</button>
            <button className="ad-btn is-small is-ghost" type="button" onClick={() => setConfirming(false)}>
              Keep
            </button>
          </form>
        ) : (
          <>
            <Link className="ad-btn is-small is-ghost" href={`/admin/${product.id}`}>Edit</Link>
            <form action={duplicateProductAction}>
              <input type="hidden" name="id" value={product.id} />
              <button className="ad-btn is-small is-ghost" type="submit" title="Start a new listing from this one">
                Copy
              </button>
            </form>
            <button className="ad-btn is-small is-danger" type="button" onClick={() => setConfirming(true)}>
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
}
