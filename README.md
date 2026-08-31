# Gulf Grails — storefront

Production implementation of the `Gulf Grails.dc.html` Claude Design prototype.
Next.js 16 (App Router) + TypeScript, no external UI framework — the Modernist
design system's tokens are ported directly into `app/globals.css`, with the
storefront's own layer built on top of them.

## Running it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm run start   # production build
npm run lint
```

## How the CSS is organised

`app/globals.css` is two halves, and the comment banner in the middle marks the
seam:

1. **The design system** — colour, type, spacing and radius tokens plus the
   `.btn` / `.card` / `.tag` / `.table` component classes, ported from the
   design bundle. Retune the look by editing the tokens; everything reads
   from them.
2. **The storefront layer** — the responsive primitives the pages compose
   with. The important ones:

   | Class | What it does |
   | --- | --- |
   | `.gg-wrap` | The 1560px page shell with the responsive gutter |
   | `.gg-grid` | Equal columns; set `--cols`, `--cols-md`, `--cols-sm`, `--cols-xs` to **numbers** |
   | `.gg-cols` | Asymmetric columns; the same variables take a **full track list** (`"1.5fr .8fr"`) |
   | `.gg-cardgrid` | Auto-filling product grid that never drops below two across until 380px |
   | `.gg-split` | Two-column editorial split that stacks below 980px |
   | `.gg-plate` | White photo plate with a contact shadow under the shoe |
   | `.gg-photo` | The multiply blend every product image needs (see below) |
   | `.gg-reveal` | Scroll-reveal, applied by `components/Reveal.tsx` |

   Unset breakpoint steps inherit the next size up, so you only declare what
   changes. `--cols` values are used verbatim by `.gg-cols`, so every step must
   be a valid `grid-template-columns` value — `"minmax(0, 1fr)"`, not `1`.

## Photography

**The catalogue photos are opaque JPEGs with a white studio background baked
in, not cut-outs with an alpha channel.** Everything about how images are
handled follows from that:

- Every product image carries `className="gg-photo"`, which sets
  `mix-blend-mode: multiply`. White then reads as transparent, so the shoe sits
  on whatever ground the frame sets and the plate's contact shadow shows
  through underneath it. Drop a photo onto a tinted panel without it and you
  get a white rectangle.
- Grounds must stay light for that to work. `EditorialFrame` handles a dark
  ground by insetting a white plate instead of blending.

### Adding or replacing a photo

1. Put the file in `public/assets/products/` as a **`.jpg`** — the catalogue
   photos are JPEGs and the extension has to match, or they get served with the
   wrong Content-Type to anything that fetches them directly (Open Graph
   scrapers especially). The naming convention is style code plus angle —
   `DD1391-100-1.jpg` through `-4` — but the filename is only a label: the
   `PHOTOS` map is what binds a file to a pair, and a few existing entries
   don't match their SKU.
2. Add the filename (without the extension) to that pair's entry in the
   `PHOTOS` map in `data/products.ts`. Order is gallery order, and the first
   entry is the card image.

That's the whole pipeline. The map only ever lists files that exist on disk, so
nothing renders a broken image; `PENDING_PHOTOS` is derived from the result
rather than maintained by hand.

A pair with no photo yet falls back to `components/StudioPlate.tsx` — a
contact-sheet plate with the style code set large — instead of a broken image
or an empty box. **Two pairs are currently on the plate and need shooting:**

| Pair | Style code |
| --- | --- |
| Air Jordan 1 Retro High OG Black Toe Reimagined | `DZ5485-106` |
| Yeezy Slide Slate Grey | `ID2350` |

Five more have fewer than four angles, so their galleries show fewer thumbnails
until the rest arrive:

| Pair | Angles on file |
| --- | --- |
| Louis Vuitton x Nike Air Force 1 Low | 1 |
| Air Jordan 1 Retro High OG Royal Reimagined | 1 |
| Air Jordan 4 Retro Bred Reimagined | 1 |
| Yeezy Foam Runner Onyx | 1 |
| Air Jordan 4 Retro White Thunder | 2 |

### Editorial slots

Everything that isn't a catalogue listing — hero slides, the house tiles, the
Stories tiles, the Instagram wall, the About/Trust/Sell page headers — is
assigned in `lib/editorial.ts` and rendered through
`components/EditorialFrame.tsx`. Re-point a slot at a different pair (or at a
real lifestyle shot once you have one) by changing one line there rather than
hunting through components.

## What's real vs. what's a placeholder

- **Catalogue** (`data/products.ts`): 30 real pairs with real style codes, EU
  sizes and AED prices. 94 real product photos live in `public/assets/`.
- **Ordering** has no backend and no payment processor, by design — it matches
  the brief (cash on delivery / bank transfer, confirmed on WhatsApp). The
  cart, wishlist, recently-viewed list and last order live in the browser's
  `localStorage` only (`context/StoreContext.tsx`, `lib/recentStore.ts`);
  "placing an order" builds a pre-filled WhatsApp message via
  `lib/whatsapp.ts`. Nothing is recorded server-side — if that's needed later,
  those are the files to start from.
- **The grail index, the review quotes and the "viewing now" counter** are
  content in `data/content.ts` and a timer, not live data. Replace them
  wholesale when there is a real feed behind them.

## Editing site settings

`lib/config.ts` holds the canonical site URL, the WhatsApp number, the delivery
fee for non-Dubai emirates, the cash-on-delivery ceiling and the referral
discount — change values there rather than hunting through components.

**Set `siteUrl` before launch.** It feeds the canonical URLs, the Open Graph
tags, `sitemap.xml`, `robots.txt` and the `Store` / `Product` structured data.

## Deploying

Built for Vercel: `vercel --prod` from this directory, or connect the repo in
the Vercel dashboard. No environment variables are required.
