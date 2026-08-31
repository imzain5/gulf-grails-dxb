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

Photos are files in `public/assets/products/` plus one line in `data/products.ts`.
There is no upload screen and no CMS — this is the whole pipeline.

1. **Shoot four angles**, in this order. Every pair in the catalogue follows it,
   which is what makes the grid look like one shop rather than a marketplace:

   | # | Angle | What it shows |
   | --- | --- | --- |
   | 1 | **Lateral** | The whole shoe from its outer side, **toe pointing right**. This is the card image — get this one right and the grid stays consistent. |
   | 2 | **Detail** | Close-up of the logo, swoosh or toe box |
   | 3 | **Medial** | The whole shoe from its inner side, toe pointing left |
   | 4 | **Sole** | The outsole, flat on |

   Shoot on plain white, one shoe, roughly square, and leave a little margin —
   the site crops in. 1200px on the long edge is plenty.

2. **Save them as `.jpg`** into `public/assets/products/`, named style code plus
   angle number: `DD1391-100-1.jpg` through `-4.jpg`.

   The extension has to match the actual file format, or the photo gets served
   with the wrong Content-Type to anything that fetches it directly — social
   share cards especially. Don't rename a PNG to `.jpg`; re-export it.

3. **Name the files** in that pair's row of the `PHOTOS` map in
   `data/products.ts`, without the extension:

   ```ts
   "dunk-panda": ["DD1391-100-1", "DD1391-100-2", "DD1391-100-3", "DD1391-100-4"],
   ```

   Array order is gallery order, and the **first entry is the card image**. The
   filename is only a label — this map is what binds a file to a pair, so a
   filename that doesn't match the SKU still works (a few existing ones don't).

**To replace one photo**, overwrite the file and keep the name — nothing else to
change. **To reorder a gallery**, reorder the array. **Fewer than four** is fine;
the gallery just shows fewer thumbnails.

A pair shot differently can carry its own labels. The Air Dior has six in-house
angles, so it overrides both the files and the labels in `PHOTO_OVERRIDES`:

```ts
"air-dior": {
  photos: ["/assets/air-dior-lateral.webp", ...],
  views:  ["Lateral", "Pair", "Medial", "Detail", "Heel", "Sole"],
},
```

`views` must be the same length as `photos`. Without it, the labels come from
`VIEWS` in `lib/sizes.ts`.

### Adding a new pair to the inventory

Add one row to the `RAW` array in `data/products.ts`. The columns are, in order:

```ts
["dunk-panda",            // id — the URL slug, /product/dunk-panda
 "Nike",                  // brand, shown on the card
 "Dunk",                  // fam — must match a FAMILY_FILTERS entry to be filterable
 "Nike Dunk Low Retro Panda",   // name
 "White / Black",         // colourway
 "DD1391-100",            // style code
 2023,                    // release year — drives the "Newest" sort
 620,                     // your price, AED
 720,                     // market price, AED — the struck-through figure
 [39,40,41,42,43,44,45,46],     // EU sizes in stock
 9,                       // total pairs in stock; 3 or fewer shows the red badge
 "",                      // badge text, e.g. "Bestseller" — "" for none
 "Short line for the card.",    // blurb
 "Full paragraph for the product page.",   // desc
 false],                  // premium — true adds the 8% bump on EU 42–44
```

Then add its photos per the steps above. That's it — the pair appears in the
shop, the search, the sitemap and the structured data automatically.

Two optional touches:

- **Feature it on the homepage**: add its id to `FEATURED_IDS` at the bottom of
  `data/products.ts` (keep that list at three).
- **A fit note in the size guide**: add the id to `FIT_NOTES` in
  `components/product/SizeGuide.tsx`, e.g. `"bal-triple-s": "Runs large..."`.
  Without one it shows the generic note.

If you add a whole new family, add it to `FAMILY_FILTERS` too, or the filter
chip won't exist.

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
