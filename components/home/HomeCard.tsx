"use client";

import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/data/products";
import { coverPhoto, hoverPhoto } from "@/data/products";
import { money } from "@/lib/money";
import { useStore } from "@/context/StoreContext";
import StudioPlate from "@/components/StudioPlate";

/**
 * The homepage product card.
 *
 * Deliberately not the shop card — that one is a working tool with badges, a
 * stock flag and a quick-size rail, which is right for a filtered grid and
 * wrong for an editorial page. This is image, brand, name, price, and nothing
 * else until you hover: the wishlist and quick view fade up over the image
 * only on intent, and on touch they simply sit there.
 *
 * The shop's ProductCard is untouched, so /shop and /wishlist are unaffected.
 */
export default function HomeCard({
  product,
  priority = false,
  onQuickView,
  sizes = "(max-width: 460px) 100vw, (max-width: 760px) 50vw, 25vw",
}: {
  product: Product;
  priority?: boolean;
  onQuickView?: (p: Product) => void;
  sizes?: string;
}) {
  const { isWished, toggleWish } = useStore();
  const wished = isWished(product.id);
  const cover = coverPhoto(product);
  const alt = hoverPhoto(product);

  return (
    <div className="hp-card">
      <Link href={`/product/${product.id}`} className="hp-card-media" aria-label={product.name}>
        {cover ? (
          <>
            <span className="hp-base">
              <Image
                className="gg-photo"
                src={cover}
                alt={product.name}
                fill
                sizes={sizes}
                priority={priority}
                style={{ objectFit: "contain", padding: "7%" }}
              />
            </span>
            {alt && (
              <span className="hp-alt">
                <Image
                  className="gg-photo"
                  src={alt}
                  alt=""
                  aria-hidden
                  fill
                  sizes={sizes}
                  style={{ objectFit: "contain", padding: "7%" }}
                />
              </span>
            )}
          </>
        ) : (
          <StudioPlate product={product} compact />
        )}
      </Link>

      <div className="hp-card-tools">
        {onQuickView ? (
          <button
            type="button"
            onClick={() => onQuickView(product)}
            style={{
              appearance: "none", border: 0, cursor: "pointer", font: "inherit",
              background: "var(--hp-ink)", color: "var(--hp-paper)",
              fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase",
              padding: "9px 14px",
            }}
          >
            Quick view
          </button>
        ) : <span />}
        <button
          type="button"
          onClick={() => toggleWish(product.id)}
          aria-label={wished ? "Remove from saved" : "Save this pair"}
          aria-pressed={wished}
          style={{
            appearance: "none", border: 0, cursor: "pointer", padding: 0,
            width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center",
            background: "var(--hp-paper)",
            color: wished ? "var(--color-accent)" : "var(--hp-ink)",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill={wished ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M12 20.5 4.6 13a4.7 4.7 0 0 1 6.6-6.7l.8.8.8-.8A4.7 4.7 0 0 1 19.4 13z" />
          </svg>
        </button>
      </div>

      <Link href={`/product/${product.id}`} style={{ color: "inherit", display: "block", paddingTop: 18 }}>
        <div className="hp-label" style={{ marginBottom: 9 }}>{product.brand}</div>
        <div className="hp-card-name" style={{ marginBottom: 10, textWrap: "pretty" }}>{product.name}</div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
          <span className="gg-figure" style={{ fontSize: 14, fontWeight: 700, letterSpacing: "0.01em" }}>
            {money(product.price)}
          </span>
          <span className="hp-label" style={{ letterSpacing: "0.16em" }}>
            EU {product.sizes[0]}–{product.sizes[product.sizes.length - 1]}
          </span>
        </div>
      </Link>
    </div>
  );
}
