# Phase 0 — audit

Counted from the tree by script, restricted to real `className` usage — CSS custom
properties, cache tags and `<datalist>` ids share the prefixes and are excluded.

## The two systems shipping side by side

| system | distinct classes | usages | defined but unused |
| --- | --- | --- | --- |
| `gg-*` brutalist | 59 | 198 | 17 |
| `hp-*` editorial | 39 | 162 | 1 |

Finding #1 confirmed: the homepage is `hp-*`, every other route is `gg-*`, and both
ship to every visitor. Phase 2 deletes `gg-*`; `hp-*` generalises into the house system.

**Dead CSS today:** 18 classes defined and never used — `gg-arrow`, `gg-btn-invert`, `gg-card-hover`, `gg-card-hover-elev`, `gg-d2`, `gg-d4`, `gg-drop`, `gg-drop-right`, `gg-hero`, `gg-house-hover`, `gg-houses`, `gg-in`, `gg-line`, `gg-marquee`, `gg-marquee-track`, `gg-reveal`, `gg-story`, `hp-rise`.

**Used with no definition:** `hp-drop`, `hp-gallery`, `hp-sticky`.

## The brief, checked against the tree

| # | Claim | Verdict |
| --- | --- | --- |
| 1 | Two design systems shipped side by side | **Confirmed.** 59 `gg-*` + 39 `hp-*` classes, both in the bundle. |
| 2 | One typeface doing every job | **Confirmed.** `--font-heading` and `--font-body` both resolved to Archivo. |
| 3 | Loud accent used as the brand colour | **Confirmed.** `#ec3013` on `.btn-primary`, 60 `var(--color-accent)` reads in TSX. |
| 4 | Zero radius + 2px black rules | **Confirmed.** `--rule: 2px`, 103 literal `2px solid` in components. |
| 5 | Styling is inline in JSX | **Confirmed.** 720 `style={{` across 46 files. |
| 6 | Light-mode only | **Confirmed.** `color-scheme: light`, no dark token set. |
| 7 | Homepage 16 sections deep | **Confirmed.** 16 top-level blocks. |
| 8 | No search | **Wrong.** `components/SiteHeader.tsx` has live search across name, brand, family, colourway and style code, ranked, capped at six. The §4.2 upgrade to a full-screen overlay still stands — but this is an upgrade, not an absence. |
| 9 | No Arabic / RTL | **Confirmed.** `<html lang="en">`, no locale routing. |
| 10 | No accounts, no real checkout | **Partly out of date.** Still no accounts and no card payment, but orders are now recorded server-side and draw stock down (`lib/orders.ts`), so the bag no longer dead-ends. |
| 11 | Hardcoded `aggregateRating` in JSON-LD | **Confirmed and unresolved.** `4.9 / 312` ships in structured data, on `/about`, and on the homepage. Needs a decision from the owner — see below. |

### Open, needs the owner

`ratingValue: "4.9"` and `reviewCount: "312"` appear in three places. If those
reviews are not real and individually verifiable they have to come out of the
JSON-LD, `/about` and the homepage — Google penalises self-serving
`aggregateRating`, and a house caught inflating a trust signal loses more than
the signal was worth. Left in place pending an answer; it is a one-line removal
in each spot.

### Three classes with no CSS behind them

`hp-sticky`, `hp-gallery` and `hp-drop` are applied on the live homepage and
have no rule anywhere. They are no-ops today — the Instagram wall's grid spans,
in particular, are being set on children whose container never became a grid.
Not fixed here: all three sit in sections the brief deletes or rebuilds in
Phase 2.

## Inline-style pressure

**720** `style={{` attributes across **46** files — finding #5,
and the tax on everything else in the brief.

| file | count |
| --- | --- |
| `components/product/ProductClient.tsx` | 76 |
| `app/(store)/page.tsx` | 71 |
| `components/checkout/CheckoutClient.tsx` | 65 |
| `components/SiteHeader.tsx` | 59 |
| `components/order/OrderClient.tsx` | 40 |
| `components/cart/CartClient.tsx` | 39 |
| `components/shop/ShopClient.tsx` | 34 |
| `components/SiteFooter.tsx` | 29 |
| `components/admin/ProductForm.tsx` | 21 |
| `components/home/Vault.tsx` | 20 |
| `components/home/QuickView.tsx` | 20 |
| `app/(store)/sell/page.tsx` | 18 |
| `app/(store)/about/page.tsx` | 16 |
| `components/home/CampaignBand.tsx` | 16 |

## Full inventory

| class | usages | files | where used | in CSS |
| --- | --- | --- | --- | --- |
| `gg-arrow` | 0 | 0 | — | yes |
| `gg-bag` | 1 | 1 | components | yes |
| `gg-btn` | 11 | 4 | app/(store)/sell, components/cart, components/product, components/shop | yes |
| `gg-btn-invert` | 0 | 0 | — | yes |
| `gg-btn-outline` | 3 | 2 | components/product, components/shop | yes |
| `gg-btn-sm` | 2 | 1 | components/product | yes |
| `gg-card` | 3 | 3 | components | yes |
| `gg-card-hover` | 0 | 0 | — | yes |
| `gg-card-hover-elev` | 0 | 0 | — | yes |
| `gg-card-name` | 3 | 3 | components | yes |
| `gg-cardgrid` | 3 | 3 | components/product, components/shop, components/wishlist | yes |
| `gg-cols` | 3 | 3 | components, components/cart, components/checkout | yes |
| `gg-d1` | 1 | 1 | components/wishlist | yes |
| `gg-d2` | 0 | 0 | — | yes |
| `gg-d3` | 5 | 2 | app/(store)/trust, components/product | yes |
| `gg-d4` | 0 | 0 | — | yes |
| `gg-desktop` | 9 | 5 | components, components/product, components/shop | yes |
| `gg-display` | 13 | 8 | app/(store)/about, app/(store)/sell, app/(store)/trust, components/cart, components/checkout, components/product, components/shop, components/wishlist | yes |
| `gg-drawer` | 2 | 2 | components, components/shop | yes |
| `gg-drift` | 1 | 1 | components | yes |
| `gg-drop` | 0 | 0 | — | yes |
| `gg-drop-right` | 0 | 0 | — | yes |
| `gg-eyebrow` | 3 | 2 | components, components/shop | yes |
| `gg-fab` | 1 | 1 | components | yes |
| `gg-figure` | 16 | 13 | app/(store), components, components/cart, components/home, components/product | yes |
| `gg-footer-wide` | 1 | 1 | components | yes |
| `gg-grid` | 9 | 6 | app/(store)/about, app/(store)/sell, app/(store)/trust, components/checkout, components/product | yes |
| `gg-hero` | 0 | 0 | — | yes |
| `gg-house-hover` | 0 | 0 | — | yes |
| `gg-houses` | 0 | 0 | — | yes |
| `gg-hover-accent` | 2 | 1 | components | yes |
| `gg-hover-accent-2` | 10 | 1 | components | yes |
| `gg-hover-invert` | 2 | 1 | components/product | yes |
| `gg-in` | 0 | 0 | — | yes |
| `gg-kicker` | 11 | 8 | app/(store)/about, app/(store)/sell, app/(store)/trust, components, components/product, components/shop, components/wishlist | yes |
| `gg-kicker-plain` | 1 | 1 | components/product | yes |
| `gg-line` | 0 | 0 | — | yes |
| `gg-marquee` | 0 | 0 | — | yes |
| `gg-marquee-track` | 0 | 0 | — | yes |
| `gg-mobile` | 4 | 2 | components, components/shop | yes |
| `gg-modal` | 1 | 1 | components/product | yes |
| `gg-mono` | 1 | 1 | components | yes |
| `gg-nowrap-scroll` | 2 | 2 | components | yes |
| `gg-photo` | 15 | 9 | app/(store), components, components/home, components/product | yes |
| `gg-plate` | 11 | 8 | components, components/cart, components/product | yes |
| `gg-plate-flat` | 4 | 3 | components, components/product | yes |
| `gg-quick` | 1 | 1 | components | yes |
| `gg-rail` | 1 | 1 | components | yes |
| `gg-reveal` | 0 | 0 | — | yes |
| `gg-scrim` | 4 | 4 | components, components/home, components/product, components/shop | yes |
| `gg-split` | 4 | 4 | app/(store)/about, app/(store)/sell, app/(store)/trust, components/product | yes |
| `gg-split-media` | 3 | 3 | app/(store)/about, app/(store)/sell, app/(store)/trust | yes |
| `gg-story` | 0 | 0 | — | yes |
| `gg-swap-a` | 1 | 1 | components | yes |
| `gg-swap-b` | 1 | 1 | components | yes |
| `gg-ticks` | 1 | 1 | components | yes |
| `gg-underline` | 2 | 1 | components/product | yes |
| `gg-wa-hover` | 1 | 1 | components | yes |
| `gg-wrap` | 25 | 12 | app/(store)/about, app/(store)/trust, components, components/cart, components/checkout, components/order, components/product, components/shop, components/wishlist | yes |
| `hp-alt` | 1 | 1 | components/home | yes |
| `hp-asym` | 5 | 3 | app/(store), components/home | yes |
| `hp-base` | 1 | 1 | components/home | yes |
| `hp-body` | 11 | 6 | app/(store), components/home | yes |
| `hp-body-light` | 4 | 3 | app/(store), components/home | yes |
| `hp-btn` | 5 | 3 | app/(store), components/home | yes |
| `hp-btn-ghost` | 1 | 1 | components/home | yes |
| `hp-btn-light` | 1 | 1 | app/(store) | yes |
| `hp-card` | 1 | 1 | components/home | yes |
| `hp-card-media` | 1 | 1 | components/home | yes |
| `hp-card-name` | 5 | 3 | app/(store), components/home | yes |
| `hp-card-tools` | 1 | 1 | components/home | yes |
| `hp-dark` | 5 | 4 | app/(store), components/home | yes |
| `hp-display` | 13 | 7 | app/(store), components/home | yes |
| `hp-drop` | 1 | 1 | components/home | NO |
| `hp-film` | 1 | 1 | components/home | yes |
| `hp-film-bar` | 1 | 1 | components/home | yes |
| `hp-film-sound` | 1 | 1 | components/home | yes |
| `hp-floor` | 1 | 1 | components/home | yes |
| `hp-frame` | 10 | 5 | app/(store), components/home | yes |
| `hp-gallery` | 1 | 1 | components/home | NO |
| `hp-grid` | 5 | 4 | app/(store), components/home | yes |
| `hp-hair` | 3 | 3 | app/(store), components/home | yes |
| `hp-hero-copy` | 1 | 1 | components/home | yes |
| `hp-hero-photo` | 1 | 1 | components/home | yes |
| `hp-hero-type` | 1 | 1 | components/home | yes |
| `hp-hero-v2` | 1 | 1 | components/home | yes |
| `hp-in` | 1 | 1 | components/home | yes |
| `hp-label` | 25 | 9 | app/(store), components/home | yes |
| `hp-label-accent` | 11 | 6 | app/(store), components/home | yes |
| `hp-label-light` | 2 | 2 | components/home | yes |
| `hp-link` | 8 | 6 | app/(store), components/home | yes |
| `hp-mask` | 1 | 1 | components/home | yes |
| `hp-rise` | 0 | 0 | — | yes |
| `hp-section-head` | 7 | 4 | app/(store), components/home | yes |
| `hp-shell` | 13 | 6 | app/(store), components/home | yes |
| `hp-statement` | 3 | 2 | app/(store), components/home | yes |
| `hp-sticky` | 1 | 1 | app/(store) | NO |
| `hp-zoom` | 7 | 4 | app/(store), components/home | yes |
