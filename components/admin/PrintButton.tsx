"use client";

/** Opens the browser's print dialog. The card sheet is styled for it in admin.css. */
export default function PrintButton() {
  return (
    <button type="button" className="ad-btn" onClick={() => window.print()}>
      Print the sheet
    </button>
  );
}
