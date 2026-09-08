import qrcode from "qrcode-generator";

/**
 * QR codes, as a single SVG path.
 *
 * These get printed on card and scanned off a table under shop lighting, so
 * the encoding is not somewhere to be clever. `qrcode-generator` is Kazuhiko
 * Arase's implementation — no dependencies, and the Reed–Solomon and masking
 * are the parts you do not want to have written yourself: a subtly wrong
 * error-correction pass still produces a code that looks right, scans on your
 * phone, and fails on someone else's.
 *
 * The output is one `<path>` rather than a rect per module. A 33×33 code is
 * over a thousand rects, which is a heavier DOM and a bigger file for exactly
 * the same ink, and separate rects hairline-crack against each other when a
 * printer scales them.
 */

/** Error correction. Q survives a scuffed or partly covered card. */
const LEVEL = "Q";

export interface Qr {
  /** SVG path data, drawn in a `modules`×`modules` unit grid. */
  d: string;
  /** Grid width, in modules. Use as the viewBox extent. */
  modules: number;
}

export function qr(text: string): Qr {
  // 0 = pick the smallest version that fits the payload.
  const code = qrcode(0, LEVEL);
  code.addData(text);
  code.make();

  const modules = code.getModuleCount();
  const parts: string[] = [];

  /*
   * Runs, not squares. Consecutive dark modules in a row become one rectangle,
   * which cuts the path data several-fold on a typical code and removes the
   * seams between neighbouring modules entirely.
   */
  for (let row = 0; row < modules; row++) {
    let start = -1;
    for (let col = 0; col <= modules; col++) {
      const dark = col < modules && code.isDark(row, col);
      if (dark && start === -1) start = col;
      if (!dark && start !== -1) {
        parts.push(`M${start} ${row}h${col - start}v1h-${col - start}z`);
        start = -1;
      }
    }
  }

  return { d: parts.join(""), modules };
}
