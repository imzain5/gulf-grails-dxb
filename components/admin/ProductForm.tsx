"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState, useRef, useState } from "react";
import { upload } from "@vercel/blob/client";
import type { Product } from "@/data/products";
import { MODEL_PRESETS, SIZE_PRESETS, searchModels, type ModelPreset } from "@/data/models";
import { saveProductAction, type ActionState } from "@/app/admin/actions";
import { photoPathname } from "@/lib/photos";

const EMPTY: ActionState = {};

/**
 * Add or edit one pair.
 *
 * Two things make this fast enough to do on a phone while holding the shoe.
 *
 * The first is the model picker: type "dunk" and the silhouette fills in the
 * brand, the model group, the size run, the collab flag and a description of
 * the shape, leaving the colourway, the style code, the price and the count —
 * the only four things that are actually specific to the box in your hand.
 *
 * The second is that photographs go straight from the camera to Blob storage
 * rather than through the form. A Server Action body is capped at 1MB and a
 * phone photo is several times that; uploading directly also means the file is
 * already stored by the time the form is submitted, so a save is instant.
 *
 * The file is sent exactly as it came off the camera. Nothing here resizes it,
 * re-encodes it or strips it — the shop sells the photograph as much as the
 * shoe, so the stored copy is the master and the site renders derivatives from
 * it at full quality.
 *
 * The first photo leads everywhere — card, search result, link preview — which
 * is why it is labelled rather than left to be discovered.
 */
export default function ProductForm({
  product,
  families,
  brands,
  colorways,
  storageReady,
  uploadsReady,
}: {
  product?: Product;
  families: string[];
  brands: string[];
  colorways: string[];
  /** Whether a save will land anywhere. */
  storageReady: boolean;
  /** Whether photographs can be uploaded — needs a real Blob store. */
  uploadsReady: boolean;
}) {
  const [state, action, pending] = useActionState(saveProductAction, EMPTY);
  const [photos, setPhotos] = useState<string[]>(product?.photos ?? []);
  const [busy, setBusy] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  // Fields the picker writes into. They stay controlled from that point on so
  // choosing a second model actually replaces the first one's values.
  const [q, setQ] = useState("");
  const [applied, setApplied] = useState<ModelPreset | null>(null);
  const [name, setName] = useState(product?.name ?? "");
  const [brand, setBrand] = useState(product?.brand ?? "");
  const [fam, setFam] = useState(product?.fam ?? "");
  const [sizes, setSizes] = useState(product?.sizes.join(", ") ?? "");
  const [desc, setDesc] = useState(product?.desc ?? "");
  const [premium, setPremium] = useState(product?.premium ?? false);

  const matches = searchModels(q);

  function applyPreset(m: ModelPreset) {
    setApplied(m);
    setQ("");
    setName(m.name);
    setBrand(m.brand);
    setFam(m.fam);
    setSizes(m.sizes.join(", "));
    setDesc(m.desc);
    setPremium(m.premium);
  }

  async function addFiles(files: FileList | File[]) {
    const picked = [...files].filter((f) => f.type.startsWith("image/") || /\.(heic|heif)$/i.test(f.name));
    if (picked.length === 0) return;

    /*
     * HEIC is what an iPhone shoots unless told otherwise. Safari can display
     * it and Chrome cannot, so one stored here would look broken to most
     * customers. iOS usually converts to JPEG when a photo is picked from the
     * camera roll — this catches the times it doesn't (the Files app, mostly)
     * and says what to change rather than failing at the server with a content
     * type nobody recognises.
     */
    const unusable = picked.filter(
      (f) => /heic|heif/i.test(f.type) || (!f.type && /\.(heic|heif)$/i.test(f.name)),
    );
    const chosen = picked.filter((f) => !unusable.includes(f));

    setUploadError(
      unusable.length
        ? "Those are HEIC files, which most browsers can't display. On iPhone: Settings → Camera → Formats → Most Compatible, then reshoot — or share the photo to yourself first, which converts it."
        : null,
    );
    if (chosen.length === 0) return;

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

      {/* ── start from a known shape ───────────────────────────────────── */}
      {!product && (
        <fieldset style={{ border: 0, padding: 0, margin: "0 0 24px" }}>
          <legend className="ad-h1" style={{ fontSize: 17, marginBottom: 10 }}>Which shoe is it?</legend>

          {applied ? (
            <div className="ad-applied">
              <span>
                Started from <strong>{applied.name}</strong>
                {applied.fit && <em style={{ display: "block", fontStyle: "normal", color: "var(--ad-mute)", fontSize: 13 }}>{applied.fit}</em>}
              </span>
              <button
                className="ad-btn is-small is-ghost"
                type="button"
                style={{ marginLeft: "auto" }}
                onClick={() => setApplied(null)}
              >
                Pick another
              </button>
            </div>
          ) : (
            <div className="ad-picker">
              <input
                className="ad-input"
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Type a model — dunk, jordan 1, samba, 350…"
                aria-label="Find the model"
                autoComplete="off"
              />
              {matches.length > 0 && (
                <div className="ad-results">
                  {matches.map((m) => (
                    <button key={m.key} type="button" className="ad-result" onClick={() => applyPreset(m)}>
                      <b>{m.name}</b>
                      <span>{m.brand} · {m.fam} · EU {m.sizes[0]}–{m.sizes[m.sizes.length - 1]}</span>
                    </button>
                  ))}
                </div>
              )}
              <p style={{ fontSize: 13, color: "var(--ad-mute)", margin: "8px 0 0" }}>
                Fills in the brand, model group, sizes and description for you. {MODEL_PRESETS.length} shapes
                on file — if it isn&apos;t there, just fill the form in by hand.
              </p>
            </div>
          )}
        </fieldset>
      )}

      {/* ── photos ─────────────────────────────────────────────────────── */}
      <fieldset style={{ border: 0, padding: 0, margin: "0 0 24px" }}>
        <legend className="ad-h1" style={{ fontSize: 17, marginBottom: 10 }}>Photos</legend>

        {photos.length > 0 && (
          <div className="ad-photos">
            {photos.map((url, i) => (
              <div key={url} className="ad-photo">
                <Image src={url} alt="" width={220} height={220} sizes="220px" />
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
            if (uploadsReady) void addFiles(e.dataTransfer.files);
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
          {uploadsReady ? (
            <>
              <button
                className="ad-btn is-ghost"
                type="button"
                onClick={() => fileInput.current?.click()}
                disabled={busy > 0}
              >
                {busy > 0 ? `Uploading ${busy}…` : "Take or choose photos"}
              </button>
              <div style={{ marginTop: 10, lineHeight: 1.5 }}>
                Lateral shot first — it becomes the card. Then detail, medial, sole.
                <br />
                Plain white background. JPEG, PNG or WebP, up to 50MB.
                <br />
                <strong style={{ color: "var(--ad-ink)" }}>Send the full-size file.</strong>{" "}
                It is stored exactly as shot and never compressed — don&apos;t shrink it or
                screenshot it. Shoot at least 2000px on the long edge: customers zoom into the
                stitching, and that is the only thing that limits how sharp it gets.
              </div>
            </>
          ) : (
            <div>Connect a Blob store in Vercel before uploading photos.</div>
          )}
        </div>

        {uploadError && (
          <p style={{ color: "var(--ad-accent)", fontSize: 14, margin: "10px 0 0" }}>{uploadError}</p>
        )}
      </fieldset>

      {/* ── identity ───────────────────────────────────────────────────── */}
      <fieldset style={{ border: 0, padding: 0, margin: "0 0 10px" }}>
        <legend className="ad-h1" style={{ fontSize: 17, marginBottom: 10 }}>The pair</legend>

        <label className="ad-field">
          <span>Name</span>
          <input
            className="ad-input"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Air Jordan 1 Retro High OG Chicago"
          />
          {applied && <em>Add the colourway to the end — e.g. “{applied.name} Chicago”.</em>}
        </label>

        <div className="ad-cols">
          <label className="ad-field">
            <span>Brand</span>
            <input className="ad-input" name="brand" list="ad-brands" value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="Nike" />
          </label>
          <label className="ad-field">
            <span>Model group</span>
            <input className="ad-input" name="fam" list="ad-families" value={fam} onChange={(e) => setFam(e.target.value)} placeholder="Jordan 1" />
            <em>Which filter chip it sits under in the shop.</em>
          </label>
        </div>

        <div className="ad-cols">
          <label className="ad-field">
            <span>Colourway</span>
            <input className="ad-input" name="colorway" list="ad-colorways" defaultValue={product?.colorway ?? ""} placeholder="White / Black / Red" />
          </label>
          <label className="ad-field">
            <span>Style code</span>
            <input className="ad-input" name="sku" defaultValue={product?.sku ?? ""} placeholder="DZ5485-612" autoCapitalize="characters" />
            <em>Printed on the box label.</em>
          </label>
          <label className="ad-field">
            <span>Year</span>
            <input className="ad-input" name="year" type="number" inputMode="numeric" min={1980} max={2100} defaultValue={product?.year ?? new Date().getFullYear()} />
          </label>
        </div>
      </fieldset>

      {/* ── money and count ────────────────────────────────────────────── */}
      <fieldset style={{ border: 0, padding: 0, margin: "16px 0 10px" }}>
        <legend className="ad-h1" style={{ fontSize: 17, marginBottom: 10 }}>Price and stock</legend>

        <div className="ad-cols">
          <label className="ad-field">
            <span>Your price, AED</span>
            <input className="ad-input" name="price" type="number" inputMode="numeric" min={0} step={10} defaultValue={product?.price ?? ""} required />
          </label>
          <label className="ad-field">
            <span>Market price, AED</span>
            <input className="ad-input" name="market" type="number" inputMode="numeric" min={0} step={10} defaultValue={product?.market ?? ""} />
            <em>Shown struck through. Blank means no saving is advertised.</em>
          </label>
          <label className="ad-field">
            <span>Pairs in stock</span>
            <input className="ad-input" name="stock" type="number" inputMode="numeric" min={0} step={1} defaultValue={product?.stock ?? 1} />
            <em>Zero lists it as sold out.</em>
          </label>
        </div>

        <label className="ad-field">
          <span>Sizes, EU</span>
          <input className="ad-input" name="sizes" value={sizes} onChange={(e) => setSizes(e.target.value)} placeholder="40, 41, 42, 43, 44" required inputMode="numeric" />
          <em>Separate with commas. These are the sizes a customer can pick.</em>
        </label>

        <div className="ad-chips" style={{ marginBottom: 18 }}>
          {SIZE_PRESETS.map((s) => (
            <button
              key={s.label}
              type="button"
              className="ad-chip"
              aria-pressed={sizes === s.sizes.join(", ")}
              onClick={() => setSizes(s.sizes.join(", "))}
            >
              {s.label}
            </button>
          ))}
        </div>

        <label className="ad-check">
          <input type="checkbox" name="premium" checked={premium} onChange={(e) => setPremium(e.target.checked)} />
          <span>
            Collab or luxury pair
            <em>Adds the 8% mid-size premium on EU 42–44, as the collabs already carry.</em>
          </span>
        </label>
      </fieldset>

      {/* ── words ──────────────────────────────────────────────────────── */}
      <fieldset style={{ border: 0, padding: 0, margin: "16px 0 10px" }}>
        <legend className="ad-h1" style={{ fontSize: 17, marginBottom: 10 }}>Words</legend>

        <label className="ad-field">
          <span>Badge</span>
          <input className="ad-input" name="drop" defaultValue={product?.drop ?? ""} placeholder="Bestseller" />
          <em>Two or three words on the card. Blank for none.</em>
        </label>

        <label className="ad-field">
          <span>One-line pitch</span>
          <input className="ad-input" name="blurb" defaultValue={product?.blurb ?? ""} placeholder="The Chicago rebuild — the one everybody regretted missing." />
        </label>

        <label className="ad-field">
          <span>Full description</span>
          <textarea className="ad-area" name="desc" value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="What it is made of, how it fits, what comes in the box." />
          {applied && <em>Written for the shape. Add what is specific to this colourway.</em>}
        </label>
      </fieldset>

      {state.error && (
        <p style={{ color: "var(--ad-accent)", fontSize: 14, margin: "0 0 14px" }}>{state.error}</p>
      )}

      <div className="ad-sticky" style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        <button className="ad-btn" type="submit" disabled={pending || busy > 0 || !storageReady}>
          {pending ? "Saving…" : product ? "Save changes" : "Add to the shop"}
        </button>
        <Link className="ad-btn is-ghost" href="/admin">Cancel</Link>
        {!storageReady && (
          <span style={{ fontSize: 13, color: "var(--ad-accent)" }}>
            Saving is off until a Blob store is connected in Vercel.
          </span>
        )}
      </div>

      <datalist id="ad-brands">
        {brands.map((b) => <option key={b} value={b} />)}
      </datalist>
      <datalist id="ad-families">
        {families.map((f) => <option key={f} value={f} />)}
      </datalist>
      <datalist id="ad-colorways">
        {colorways.map((c) => <option key={c} value={c} />)}
      </datalist>
    </form>
  );
}
