"use client";

import React, { useCallback, useRef, useState, useSyncExternalStore } from "react";
import { getSlotServerSnapshot, getSlotSnapshot, subscribeSlot, writeSlot } from "@/lib/imageSlotStore";

/** Downscale to keep localStorage light — plenty for a card or hero background. */
function fileToDataUrl(file: File, maxSide = 1600, quality = 0.86): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
        const w = Math.max(1, Math.round(img.width * scale));
        const h = Math.max(1, Math.round(img.height * scale));
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(reader.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL(file.type === "image/png" ? "image/png" : "image/jpeg", quality));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export interface ImageSlotProps {
  /** Unique key this photo is stored under — reuse it and the photo persists. */
  id: string;
  /** Shown when nothing has been uploaded yet. */
  placeholder: string;
  alt?: string;
  className?: string;
  style?: React.CSSProperties;
  /** "cover" fills the frame (heroes, tiles); "contain" keeps the whole product in frame. */
  fit?: "cover" | "contain";
}

export default function ImageSlot({ id, placeholder, alt, className, style, fit = "cover" }: ImageSlotProps) {
  const subscribe = useCallback((listener: () => void) => subscribeSlot(id, listener), [id]);
  const getSnapshot = useCallback(() => getSlotSnapshot(id), [id]);
  const src = useSyncExternalStore(subscribe, getSnapshot, getSlotServerSnapshot);
  const [over, setOver] = useState(false);
  const [busy, setBusy] = useState(false);
  const dragDepth = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const accept = useCallback(async (file: File | undefined) => {
    if (!file || !file.type.startsWith("image/")) return;
    setBusy(true);
    try {
      const dataUrl = await fileToDataUrl(file);
      writeSlot(id, dataUrl);
    } finally {
      setBusy(false);
    }
  }, [id]);

  const remove = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    writeSlot(id, null);
  }, [id]);

  return (
    <div
      className={className}
      style={{
        position: "absolute", inset: 0, cursor: "pointer", overflow: "hidden",
        display: "flex", alignItems: "center", justifyContent: "center",
        ...style,
      }}
      onClick={() => inputRef.current?.click()}
      onDragEnter={(e) => { e.preventDefault(); dragDepth.current++; setOver(true); }}
      onDragOver={(e) => e.preventDefault()}
      onDragLeave={(e) => { e.preventDefault(); dragDepth.current--; if (dragDepth.current <= 0) { dragDepth.current = 0; setOver(false); } }}
      onDrop={(e) => {
        e.preventDefault();
        dragDepth.current = 0;
        setOver(false);
        accept(e.dataTransfer.files?.[0]);
      }}
      role="button"
      tabIndex={0}
      aria-label={src ? "Replace photo" : "Add a photo — " + placeholder}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ position: "absolute", width: 0, height: 0, opacity: 0, pointerEvents: "none" }}
        onChange={(e) => accept(e.target.files?.[0])}
      />
      {src ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element -- a locally-stored data: URL, not a URL next/image's optimizer can fetch */}
          <img
            src={src}
            alt={alt ?? ""}
            style={{ width: "100%", height: "100%", objectFit: fit, background: "#fff" }}
          />
          <button
            type="button"
            onClick={remove}
            aria-label="Remove photo"
            style={{
              position: "absolute", top: 8, left: 8, appearance: "none", cursor: "pointer",
              background: "var(--color-text)", color: "var(--color-bg)", border: "0",
              fontSize: 10, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase",
              padding: "6px 10px", opacity: over ? 1 : 0, transition: "opacity .12s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
          >
            Remove
          </button>
        </>
      ) : (
        <div
          style={{
            position: "absolute", inset: "6px", display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", gap: 8, textAlign: "center",
            border: `2px dashed ${over ? "var(--color-accent)" : "var(--color-neutral-400)"}`,
            background: over ? "var(--color-accent-100)" : "transparent", padding: 14,
            color: over ? "var(--color-accent-700)" : "var(--color-neutral-600)",
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 17V3" /><path d="m7 8 5-5 5 5" /><path d="M5 21h14" />
          </svg>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.04em", lineHeight: 1.4 }}>
            {busy ? "Uploading…" : placeholder}
          </span>
        </div>
      )}
    </div>
  );
}
