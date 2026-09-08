import Link from "next/link";
import { coverPhoto, hoverPhoto, type Product } from "@/data/products";
import Frame from "./Frame";
import { Price, Tag } from "./primitives";
import s from "./LotCard.module.css";

/**
 * One pair in a grid. The single card implementation for the whole site.
 *
 * Deliberately absent: a border, a discount percentage, and a coloured pill.
 * Present instead: the house, the model in the display serif, the price in the
 * data face, and the size run as mono chips — the shape of a catalogue entry
 * rather than a product tile.
 *
 * `lot` promotes it to a Vault holding: the number is brass, which is one of
 * the three brass marks a viewport is allowed.
 *
 * `action` takes a control that sits above the card's link — a wishlist toggle,
 * typically. It is a slot rather than a built-in so this stays a server
 * component: whatever needs client state lives in what gets passed in.
 */
export default function LotCard({
  product,
  lot,
  priority = false,
  sizes = "(max-width: 720px) 50vw, (max-width: 1200px) 33vw, 25vw",
  showSizes = true,
  action,
}: {
  product: Product;
  /** Vault lot number, e.g. 4 → "LOT 004". */
  lot?: number;
  priority?: boolean;
  sizes?: string;
  showSizes?: boolean;
  action?: React.ReactNode;
}) {
  const soldOut = product.stock <= 0;
  const single = product.stock === 1;

  return (
    <article className={`${s.lot}${soldOut ? ` ${s.soldOut}` : ""}`}>
      {action && <div className={s.action}>{action}</div>}

      <div className={s.media}>
        <Frame
          src={coverPhoto(product)}
          alt={product.name}
          alt2={hoverPhoto(product)}
          ratio="4:5"
          sizes={sizes}
          zoom
          priority={priority}
        />
        {(soldOut || single || lot !== undefined) && (
          <span className={s.status}>
            {lot !== undefined ? (
              <Tag tone="brass">Lot {String(lot).padStart(3, "0")}</Tag>
            ) : soldOut ? (
              <Tag tone="signal">Sold</Tag>
            ) : (
              <Tag>One pair only</Tag>
            )}
          </span>
        )}
      </div>

      <div className={s.meta}>
        <span className={s.house}>{product.brand}</span>
        <Link href={`/product/${product.id}`} className={`${s.name} ${s.link}`}>
          {product.name}
        </Link>
        <div className={s.row}>
          <Price amount={product.price} was={product.market} size="sm" />
        </div>
        {showSizes && product.sizes.length > 0 && (
          <div className={s.sizes} aria-label="Sizes held, EU">
            {product.sizes.map((z) => (
              <span key={z} className={soldOut ? s.sizeOut : undefined}>{z}</span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
