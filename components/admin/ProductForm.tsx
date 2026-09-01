"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState, useRef, useState } from "react";
import { upload } from "@vercel/blob/client";
import type { Product } from "@/data/products";
import { saveProductAction, type ActionState } from "@/app/admin/actions";
import { photoPathname } from "@/lib/photos";

const EMPTY: ActionState = {};

/**
 * Add or edit one pair.
 *
 * Photographs go straight from the browser to Blob storage rather than through
 * the form: a Server Action body is capped at 1MB and a photo off a phone is
 * several times that. What the form actually submits is the resulting list of
 * URLs, in gallery order, as one hidden field — so ordering and removal are
 * free, and nothing is written to the catalogue until the owner saves.
 *
 * The first photo is the one the shop leads with everywhere: the card, the
 * search result, the link preview. That is why it is labelled rather than left
 * to be discovered.
 */
export default function ProductForm({
  product,
  families,
  brands,
  storageReady,
}: {
  product?: Product;
  families: string[];
  brands: string[];
  storageReady: boolean;
}) {
  const [state, action, pending] = useActionState(saveProductAction, EMPTY);
  const [photos, setPhotos] = useState<string[]>(product?.photos ?? []);
  const [busy, setBusy] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  async function addFiles(files: FileList | File[]) {
    const chosen = [...files].filter((f) => f.type.startsWith("image/"));
    if (chosen.length === 0) return;

    setUploadError(null);
    setBusy((n) => n + chosen.length);

    for (const file of chosen) {
      try {
        // The store adds a random suffix, so two shots called IMG_0001 don't
        // collide — the readable stem is only there to make the store legible.
        const blob = await upload(photoPathname(file.name), file, {
          access: "public",
          handleUploadUrl: "/api/admin/upload",
          contentType: file.type,
        });
        setPhotos((current) => [...current, blob.url]);
      } catch (err) {
        setUploadError(
          err instanceof Error ? err.message : "That photo would not upload. Try again.",
        );
      } finally {
        setBusy((n) => n - 1);
      }
    }
  }

  function move(i: number, by: number) {
    setPhotos((current) => {
      const next = [...current];
      const j = i + by;
      if (j < 0 || j >= next.length) return current;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  }

  return (
    <form action={action} className="ad-card" style={{ maxWidth: 760 }}>
      <input type="hidden" name="id" value={product?.id ?? ""} />
      <input type="hidden" name="photos" value={JSON.stringify(photos)} />

      <fieldset style={{ border: 0, padding: 0, margin: "0 0 26px" }}>
        <legend className="ad-h1" style={{ fontSize: 17, marginBottom: 12 }}>Photos</legend>

        {photos.length > 0 && (
          <div className="ad-photos">
            {photos.map((url, i) => (
              <div key={url} className="ad-photo">
                <Image src={url} alt="" width={220} height={220} sizes="220px" unoptimized />
                <button
                  type="button"
                  className="ad-photo-x"
                  onClick={() => setPhotos((c) => c.filter((u) => u !== url))}
                  aria-label={`Remove photo ${i + 1}`}
                >
                  ×
                </button>
                <span className="ad-photo-i">{i === 0 ? "Main" : i + 1}</span>
                <div className="ad-move">
                  <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move earlier">←</button>
                  <button type="button" onClick={() => move(i, 1)} disabled={i === photos.length - 1} aria-label="Move later">→</button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div
          className={`ad-drop${dragging ? " is-on" : ""}`}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            if (storageReady) void addFiles(e.dataTransfer.files);
          }}
        >
          <input
            ref={fileInput}
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={(e) => {
              if (e.target.files) void addFiles(e.target.files);
              e.target.value = "";
            }}
          />
          {storageReady ? (
            <>
              <button
                className="ad-btn is-ghost is-small"
                type="button"
                onClick={() => fileInput.current?.click()}
                disabled={busy > 0}
              >
                {busy > 0 ? `Uploading ${busy}…` : "Choose photos"}
              </button>
              <div style={{ marginTop: 8 }}>
                or drop them here · the first one leads the listing · JPEG, PNG or WebP up to 12MB
              </div>
            </>
          ) : (
            <div>Connect a Blob store in Vercel before uploading photos.</div>
          )}
        </div>

        {uploadError && (
          <p style={{ color: "var(--ad-accent)", fontSize: 13, margin: "10px 0 0" }}>{uploadError}</p>
        )}
      </fieldset>

      <fieldset style={{ border: 0, padding: 0, margin: "0 0 10px" }}>
        <legend className="ad-h1" style={{ fontSize: 17, marginBottom: 12 }}>The pair</legend>

        <label className="ad-field">
          <span>Name</span>
          <input className="ad-input" name="name" defaultValue={product?.name ?? ""} required placeholder="Air Jordan 1 Retro High OG Chicago" />
        </label>

        <div className="ad-cols">
          <label className="ad-field">
            <span>Brand</span>
            <input className="ad-input" name="brand" list="ad-brands" defaultValue={product?.brand ?? ""} placeholder="Nike" />
          </label>
          <label className="ad-field">
            <span>Model group</span>
            <input className="ad-input" name="fam" list="ad-families" defaultValue={product?.fam ?? ""} placeholder="Jordan 1" />
            <em>What it filters under in the shop.</em>
          </label>
        </div>

        <div className="ad-cols">
          <label className="ad-field">
            <span>Colourway</span>
            <input className="ad-input" name="colorway" defaultValue={product?.colorway ?? ""} placeholder="White / Black / Red" />
          </label>
          <label className="ad-field">
            <span>Style code</span>
            <input className="ad-input" name="sku" defaultValue={product?.sku ?? ""} placeholder="DZ5485-612" />
          </label>
          <label className="ad-field">
            <span>Year</span>
            <input className="ad-input" name="year" type="number" min={1980} max={2100} defaultValue={product?.year ?? new Date().getFullYear()} />
          </label>
        </div>
      </fieldset>

      <fieldset style={{ border: 0, padding: 0, margin: "16px 0 10px" }}>
        <legend className="ad-h1" style={{ fontSize: 17, marginBottom: 12 }}>Price and stock</legend>

        <div className="ad-cols">
          <label className="ad-field">
            <span>Your price, AED</span>
            <input className="ad-input" name="price" type="number" min={0} step={10} defaultValue={product?.price ?? ""} required />
          </label>
          <label className="ad-field">
            <span>Market price, AED</span>
            <input className="ad-input" name="market" type="number" min={0} step={10} defaultValue={product?.market ?? ""} />
            <em>Shown struck through. Leave blank for no saving.</em>
          </label>
          <label className="ad-field">
            <span>Pairs in stock</span>
            <input className="ad-input" name="stock" type="number" min={0} step={1} defaultValue={product?.stock ?? 1} />
            <em>Zero lists it as sold out.</em>
          </label>
        </div>

        <label className="ad-field">
          <span>Sizes, EU</span>
          <input className="ad-input" name="sizes" defaultValue={product?.sizes.join(", ") ?? ""} placeholder="40, 41, 42, 43, 44" required />
          <em>Separate with commas. These are the sizes a customer can pick.</em>
        </label>

        <label className="ad-check">
          <input type="checkbox" name="premium" defaultChecked={product?.premium ?? false} />
          <span>
            Collab or luxury pair
            <em>Adds the 8% mid-size premium on EU 42–44, as the collabs already carry.</em>
          </span>
        </label>
      </fieldset>

      <fieldset style={{ border: 0, padding: 0, margin: "16px 0 10px" }}>
        <legend className="ad-h1" style={{ fontSize: 17, marginBottom: 12 }}>Words</legend>

        <label className="ad-field">
          <span>Badge</span>
          <input className="ad-input" name="drop" defaultValue={product?.drop ?? ""} placeholder="Bestseller" />
          <em>Two or three words on the card. Leave blank for none.</em>
        </label>

        <label className="ad-field">
          <span>One-line pitch</span>
          <input className="ad-input" name="blurb" defaultValue={product?.blurb ?? ""} placeholder="The Chicago rebuild — the one everybody regretted missing." />
        </label>

        <label className="ad-field">
          <span>Full description</span>
          <textarea className="ad-area" name="desc" defaultValue={product?.desc ?? ""} placeholder="What it is made of, how it fits, what comes in the box." />
        </label>
      </fieldset>

      {state.error && (
        <p style={{ color: "var(--ad-accent)", fontSize: 13, margin: "0 0 14px" }}>{state.error}</p>
      )}

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        <button className="ad-btn" type="submit" disabled={pending || busy > 0 || !storageReady}>
          {pending ? "Saving…" : product ? "Save changes" : "Add to the shop"}
        </button>
        <Link className="ad-btn is-ghost" href="/admin">Cancel</Link>
        {!storageReady && (
          <span style={{ fontSize: 12, color: "var(--ad-accent)" }}>
            Saving is off until a Blob store is connected in Vercel.
          </span>
        )}
        {product && (
          <Link className="ad-nav" href={`/product/${product.id}`} target="_blank" rel="noreferrer" style={{ marginLeft: "auto" }}>
            <span className="ad-linkbtn">See it on the site ↗</span>
          </Link>
        )}
      </div>

      <datalist id="ad-brands">
        {brands.map((b) => <option key={b} value={b} />)}
      </datalist>
      <datalist id="ad-families">
        {families.map((f) => <option key={f} value={f} />)}
      </datalist>
    </form>
  );
}
