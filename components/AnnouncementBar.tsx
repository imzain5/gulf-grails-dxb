import { SITE_CONFIG } from "@/lib/config";
import { TRUST_BAR } from "@/data/content";

/**
 * One quiet line above the navigation.
 *
 * This replaces two separate bars — a scrolling marquee and a trust strip
 * whose contents largely repeated each other — with a single thin rule. The
 * old arrangement put three stacked bands of chrome, around 150px of it,
 * above every page; a shop that trades on restraint can't open by shouting.
 *
 * It deliberately sits outside the sticky header so it scrolls away and only
 * the navigation follows you down the page.
 */
export default function AnnouncementBar() {
  const items = [
    ...TRUST_BAR,
    `Refer a friend — they get AED ${SITE_CONFIG.referralDiscount} off`,
  ];

  return (
    <div style={{ background: "var(--color-text)", color: "var(--color-bg)" }}>
      <div
        className="gg-wrap gg-nowrap-scroll"
        style={{
          height: 36,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "clamp(18px, 3vw, 44px)",
          overflowX: "auto",
        }}
      >
        {items.map((label, i) => (
          <span
            key={label}
            style={{
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
              flex: "0 0 auto",
              // The referral is the one line worth colouring.
              color: i === items.length - 1
                ? "var(--color-accent-400)"
                : "color-mix(in srgb, #f3f2f2 72%, transparent)",
            }}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
