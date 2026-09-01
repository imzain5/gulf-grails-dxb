# Gulf Grails — storefront

Production implementation of the `Gulf Grails.dc.html` Claude Design prototype.
Next.js 16 (App Router) + TypeScript, no external UI framework — the Modernist
design system's tokens are ported directly into `app/globals.css`, with the
storefront's own layer built on top of them.

## Running it

```bash
npm install
npm run dev      # http://localhost:3000

# to try /admin locally
ADMIN_PASSWORD=whatever npm run dev
npm run build && npm run start   # production build
npm run lint
```

## Running the shop (`/admin`)

Inventory is not in this repository. It lives in the project's Vercel Blob
store as a single JSON document, and the owner edits it at **`/admin`** — add a
pair, upload its photos, change the price, set how many are left, mark it sold
out, delete it. Saving is live: the storefront, the search, the sitemap and the
structured data all update on the next request.

### One-time setup

Two environment variables, both set in the Vercel dashboard (Project →
Settings → Environment Variables), never in the repository:

| Variable | Where it comes from |
| --- | --- |
| `BLOB_READ_WRITE_TOKEN` | Created for you. Project → **Storage** → create a Blob store → connect it to this project. |
| `ADMIN_PASSWORD` | You choose it. Long and random — it is the only thing between the internet and your inventory. |

Redeploy after setting them. Until `BLOB_READ_WRITE_TOKEN` exists, `/admin`
tells you so and refuses to save; until `ADMIN_PASSWORD` exists, nobody can
sign in at all.

Changing `ADMIN_PASSWORD` later signs every open session out, because the
session cookie is signed with it.

### Day to day

- **Stock** — the number box on each row of the inventory list saves on its
  own. **Zero is the out-of-stock switch**: the pair stays on the site, marked
  sold out, keeping its page, its links and its search ranking, and nothing
  about it can be bought. Delete only removes a pair for good.
- **Adding a pair** — *Add a pair*, fill the form, upload photos. Photos go
  from the browser straight to Blob storage, so a full-size phone photo is
  fine. The first photo leads everywhere: the card, the search result, the link
  preview. Reorder with the arrows.
- **Model group** decides which shop filter chip the pair sits under. Pick one
  that already exists unless you mean to start a new one — a typo makes a new,
  nearly-empty filter.

### If nothing has been saved yet

Before the first save, and in local development without a Blob token, the site
serves `data/seed.ts` — the thirty pairs it shipped with, and the studio
photography in `public/assets/products`. That is a fallback, not the
catalogue: once the owner saves once, the Blob document takes over completely
and editing `seed.ts` changes nothing on the live site.

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

### Shooting a pair

The upload box will take anything, but the grid only looks like one shop if
every pair is shot the same way. Four angles, in this order:

| # | Angle | What it shows |
| --- | --- | --- |
| 1 | **Lateral** | The whole shoe from its outer side, **toe pointing right**. This is the card image — get this one right and the grid stays consistent. |
| 2 | **Detail** | Close-up of the logo, swoosh or toe box |
| 3 | **Medial** | The whole shoe from its inner side, toe pointing left |
| 4 | **Sole** | The outsole, flat on |

Shoot on plain white, one shoe, roughly square, and leave a little margin — the
site crops in. 1200px on the long edge is plenty. Upload them in that order, or
reorder them afterwards with the arrows; the first one is the card.

Fewer than four is fine — the gallery just shows fewer thumbnails. A pair with
no photos at all falls back to a designed studio plate rather than a broken
image.

### The shipped photography

The thirty pairs in `data/seed.ts` are wired to files in
`public/assets/products/`, named style code plus angle number
(`DD1391-100-1.jpg` … `-4.jpg`), and mapped to pairs by the `PHOTOS` table in
that file. To swap one of those, overwrite the file and keep the name.

The extension has to match the actual file format, or the photo is served with
the wrong Content-Type to anything that fetches it directly — social share
cards especially. Don't rename a PNG to `.jpg`; re-export it.

A pair shot differently can carry its own gallery labels. The Air Dior has six
in-house angles, so it overrides both the files and the labels in
`PHOTO_OVERRIDES`:

```ts
"air-dior": {
  photos: ["/assets/air-dior-lateral.webp", ...],
  views:  ["Lateral", "Pair", "Medial", "Detail", "Heel", "Sole"],
},
```

`views` must be the same length as `photos`. Without it the labels come from
`VIEWS` in `lib/sizes.ts`. Pairs uploaded at `/admin` always use `VIEWS`.

### Where the catalogue is read

`lib/catalogue.ts` is the only thing that knows where inventory comes from. It
reads the Blob document, falls back to the seed, caches the result under the
`gg-catalogue` tag, and drops that cache on every admin write.

Server components `await getCatalogue()`. Client components read it from
`context/CatalogueContext.tsx`, which the storefront layout fills once — the
header search, the wishlist and the cart all price from the same list the
server rendered. Nothing in `components/` imports a product array directly any
more; `data/products.ts` holds only the type and pure helpers.

One optional touch when adding a pair: **a fit note in the size guide**. Add
its id to `FIT_NOTES` in `components/product/SizeGuide.tsx`, e.g.
`"bal-triple-s": "Runs large..."`. Without one it shows the generic note.

### What puts a pair on the homepage

Nothing is pinned by hand — every section derives from the catalogue, so a new
pair lands in the right place on its own:

| Section | What qualifies a pair |
| --- | --- |
| **The Vault** | `price` of AED 10,000 or more. The four most expensive show. |
| **Ready to wear this week** | Anything not in the Vault, badged pairs first (`drop` non-empty), capped at eight. |
| **The Travis drop** | `fam` is `"Travis Scott"`. The lead is hard-coded as `ts-aj1-high`. |
| **The archive** | `fam` is `"Off-White"`. The lead is `ow-aj1`. |
| **By house** | The `HOUSES` list in `data/content.ts` — each entry names the family and a `pid` for the tile photo. |

So to get a new pair into the Vault, price it above 10,000 at `/admin`. To get
it into the "ready to wear" row ahead of the others, give it a badge.

The shop's filter chips are derived the same way: a model group only appears
once a pair uses it, and the size chips are the union of every pair's sizes.

### Editorial slots

Everything that isn't a catalogue listing — hero slides, the house tiles, the
Stories tiles, the Instagram wall, the About/Trust/Sell page headers — is
assigned in `lib/editorial.ts` and rendered through
`components/EditorialFrame.tsx`. Re-point a slot at a different pair (or at a
real lifestyle shot once you have one) by changing one line there rather than
hunting through components.

## What's real vs. what's a placeholder

- **Catalogue**: 30 real pairs with real style codes, EU sizes and AED prices,
  and 94 real product photos in `public/assets/`. These ship as the seed; the
  live catalogue is whatever the owner has saved at `/admin`.
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
the Vercel dashboard.

Two environment variables, both set in the dashboard and neither in the
repository — see [Running the shop](#running-the-shop-admin) for what they are
and where they come from:

```
BLOB_READ_WRITE_TOKEN=…   # created by connecting a Blob store
ADMIN_PASSWORD=…          # your own, long and random
```

The site builds and runs without them: it serves the seed catalogue and
`/admin` explains what is missing.
