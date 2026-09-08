import { qr } from "@/lib/qr";

/**
 * A QR code, rendered server-side as inline SVG.
 *
 * No client JavaScript and no image request: the code is part of the document,
 * so it is there in view-source, in a print preview, and on a phone that never
 * finished loading. `currentColor` means it inherits the surrounding text
 * colour and therefore survives both themes without a second copy.
 */
export default function QrCode({
  text,
  size = 132,
  className,
  title,
}: {
  text: string;
  /** Rendered edge length in px. */
  size?: number;
  className?: string;
  /** Accessible name. The code is decoration where the URL is also in text. */
  title?: string;
}) {
  const { d, modules } = qr(text);

  // Four modules of quiet zone. Below that, scanners start to miss the code
  // against a busy background — it is part of the spec, not padding.
  const quiet = 4;
  const extent = modules + quiet * 2;

  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox={`0 0 ${extent} ${extent}`}
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      // Modules must land on whole pixels or the code softens into grey mush
      // at small sizes.
      shapeRendering="crispEdges"
    >
      <rect width={extent} height={extent} fill="var(--qr-bg, #fff)" />
      <g transform={`translate(${quiet} ${quiet})`}>
        <path d={d} fill="var(--qr-fg, #0A0A0B)" />
      </g>
    </svg>
  );
}
