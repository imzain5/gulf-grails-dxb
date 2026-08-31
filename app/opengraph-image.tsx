import { ImageResponse } from "next/og";

export const alt = "Gulf Grails — luxury sneakers, verified. Dubai, UAE.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * The share card.
 *
 * Most of this shop's traffic arrives through a WhatsApp or Instagram link,
 * where the preview card is the whole first impression. Drawn rather than
 * photographed so it stays on-brand for any page that doesn't set its own.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f3f2f2",
          color: "#201e1d",
          padding: 72,
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ fontSize: 40, fontWeight: 900, letterSpacing: -2, textTransform: "uppercase" }}>
            Gulf Grails
          </div>
          <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: 6, color: "#ec3013" }}>DXB</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ display: "flex", background: "#ec3013", color: "#fff", padding: "10px 18px", fontSize: 20, fontWeight: 800, letterSpacing: 4, textTransform: "uppercase", alignSelf: "flex-start" }}>
            Verified or your money back
          </div>
          <div style={{ fontSize: 92, fontWeight: 900, lineHeight: 0.92, letterSpacing: -4, textTransform: "uppercase", maxWidth: 900 }}>
            Luxury sneakers, verified. Dubai.
          </div>
        </div>

        <div style={{ display: "flex", gap: 40, fontSize: 22, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "#605d5d", borderTop: "4px solid #201e1d", paddingTop: 26 }}>
          <div style={{ display: "flex" }}>Jordan</div>
          <div style={{ display: "flex" }}>Yeezy</div>
          <div style={{ display: "flex" }}>Balenciaga</div>
          <div style={{ display: "flex" }}>Dior</div>
          <div style={{ display: "flex", marginLeft: "auto", color: "#ec3013" }}>Cash on delivery</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
