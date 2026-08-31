import Image from "next/image";
import type { Product } from "@/data/products";
import { coverPhoto, hoverPhoto } from "@/data/products";
import StudioPlate from "./StudioPlate";

/** A single studio shot, inset from its frame. */
export default function ProductPhoto({
  src, alt, fit = "contain", padding = 0, sizes = "(max-width: 700px) 50vw, 300px", priority = false,
}: {
  src: string;
  alt: string;
  fit?: "contain" | "cover";
  padding?: number;
  sizes?: string;
  priority?: boolean;
}) {
  return (
    <div style={{ position: "absolute", inset: padding }}>
      <Image className="gg-photo" src={src} alt={alt} fill sizes={sizes} priority={priority} style={{ objectFit: fit }} />
    </div>
  );
}

/**
 * The card image: the cover shot, cross-fading to a second angle on hover.
 *
 * Almost every pair in the catalogue was shot from more than one side, and the
 * fastest way to make a grid feel like a real store rather than a spreadsheet
 * is to use the second frame. Pairs with only one shot simply don't animate,
 * and pairs with none fall back to the studio plate.
 */
export function ProductCardPhoto({
  product, padding = 12, sizes = "(max-width: 560px) 50vw, 300px", priority = false,
}: {
  product: Product;
  padding?: number;
  sizes?: string;
  priority?: boolean;
}) {
  const cover = coverPhoto(product);
  const hover = hoverPhoto(product);

  if (!cover) return <StudioPlate product={product} compact />;

  return (
    <>
      <div className={hover ? "gg-swap-a" : undefined} style={{ position: "absolute", inset: padding }}>
        <Image className="gg-photo" src={cover} alt={product.name} fill sizes={sizes} priority={priority} style={{ objectFit: "contain" }} />
      </div>
      {hover && (
        <div className="gg-swap-b" style={{ position: "absolute", inset: padding }}>
          <Image className="gg-photo" src={hover} alt="" aria-hidden fill sizes={sizes} style={{ objectFit: "contain" }} />
        </div>
      )}
    </>
  );
}
