import type { Product } from "@/data/products";

/**
 * What a pair shows in place of a photograph it doesn't have yet.
 *
 * A dashed upload box reads as a broken page to a customer. This is a proper
 * contact-sheet plate instead — the style code set large, the brand and
 * colourway underneath, registration ticks in the corners — so an unshot pair
 * looks like a frame waiting on the studio rather than a missing image. Drop
 * the real file into `public/assets/products/` and name it in `data/products.ts`
 * and the plate disappears on its own.
 */
export default function StudioPlate({
  product,
  view,
  compact = false,
}: {
  product: Product;
  /** Gallery angle label, when this stands in for one specific view. */
  view?: string;
  /** Card-sized rendering: drops the secondary lines. */
  compact?: boolean;
}) {
  return (
    <div
      className="gg-ticks"
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: compact ? 6 : 10,
        padding: compact ? 14 : 26,
        textAlign: "center",
        background:
          "repeating-linear-gradient(135deg, #fbfafa 0px, #fbfafa 9px, #f4f2f1 9px, #f4f2f1 18px)",
        color: "var(--color-neutral-700)",
        overflow: "hidden",
      }}
    >
      <span
        style={{
          fontSize: 9,
          fontWeight: 800,
          letterSpacing: "0.24em",
          textTransform: "uppercase",
          color: "var(--color-accent)",
        }}
      >
        {view ? view : "In the studio"}
      </span>
      <span
        className="gg-mono"
        style={{
          fontFamily: "var(--font-heading)",
          fontWeight: 900,
          fontSize: compact ? 16 : 26,
          letterSpacing: "-0.02em",
          color: "var(--color-text)",
          lineHeight: 1,
          wordBreak: "break-all",
        }}
      >
        {product.sku}
      </span>
      {!compact && (
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            maxWidth: "26ch",
            lineHeight: 1.5,
          }}
        >
          {product.brand} · {product.colorway}
        </span>
      )}
      <span
        style={{
          marginTop: compact ? 2 : 8,
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "var(--color-neutral-500)",
        }}
      >
        Photographed on request
      </span>
    </div>
  );
}
