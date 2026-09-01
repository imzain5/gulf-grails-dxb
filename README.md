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

`/admin` has three screens, reachable from the top bar on a desktop and from a
fixed bar at the bottom of the screen on a phone.

**Inventory.** Everything the shop sells, sold out and running low first.
Search matches the name, colourway, style code or badge; the four views answer
the questions actually asked at the shelf — what is out, what is nearly out,
what still has no photograph. The `−` / `+` stepper on each row is the control
staff touch most; Save appears only once the number has changed.

**Zero is the out-of-stock switch.** The pair stays on the site, marked sold
out, keeping its page, its inbound links and its search ranking, and nothing
about it can be bought. Delete is separate, confirmed, and permanent.

**Copy** starts a new listing from an existing one — everything except the
photographs, which must never be shared between two pairs. It is the fastest
way to list the next colourway of a shape already in stock.

**Orders.** Every order placed on the site, newest first, with the phone number
as a WhatsApp link and a dial link. Confirm it, mark it delivered, or cancel it
— see below for what cancelling does to stock.

**Add a pair.** Start by searching the model: type "dunk" or "samba" or "350"
and the silhouette fills in the brand, model group, size run, collab flag and a
description of the shape, leaving only the colourway, the style code, the price
and the count. Photographs go from the camera straight to Blob storage, so a
full-size phone photo is fine; the first one leads everywhere, and the arrows
reorder them.

### Stock moves on its own

Placing an order takes the pairs off the shelf as the order is written — the
number in the stockroom and the number on the site are the same number, and
nobody maintains it.

Under cash on delivery an order is a commitment rather than a payment, so stock
is held from the moment the order is placed. The alternative is selling the same
last pair twice while waiting for a WhatsApp reply. **Cancelling an order puts
its pairs straight back**, once — pressing cancel twice cannot return them
again.

Everything about the money is recomputed on the server from the catalogue when
the order arrives. A browser that can send `{ amount: 1 }` will, so nothing the
customer's browser says about price or availability is trusted; it is only
allowed to name the pairs and the delivery address. An order is refused
outright if a pair has sold out in the meantime, and one phone number may only
have three orders waiting to be confirmed at a time.

### Working on it locally

```bash
ADMIN_PASSWORD=whatever npm run dev
```

With no `BLOB_READ_WRITE_TOKEN` set, the catalogue and the orders are read from
and written to JSON files under `.gg-local/` (gitignored) instead of Blob
storage, so the whole admin — including placing an order and watching stock
come down — works offline. Photo uploads are the exception: they go from the
browser to Blob directly and have no local equivalent, so they stay off until a
real store is connected. Delete `.gg-local/` to go back to the seed.

### The model library

`data/models.ts` holds the silhouettes the shop sells — around forty shapes,
each with its brand, model group, usual size run, collab flag and a description
of the shoe. It is deliberately **silhouettes, not colourways**: "Air Jordan 1
Retro High OG" covers Chicago, Bred Toe and every colourway that will ever
exist on that shape, whereas a list of specific colourways would be stale
within a season.

To add a shape, add an entry. Nothing it fills in is binding — every field is
editable afterwards.

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
site crops in. Upload them in that order, or reorder them afterwards with the
arrows; the first one is the card.

**Shoot at least 2000px on the long edge, and upload the file untouched.** The
product page magnifies 2.4× on zoom, so the source resolution is the only thing
that limits how sharp a customer can get — see below.

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

### Photo quality

Nothing in the pipeline compresses a photograph.

- **Uploads are stored byte-for-byte.** The browser sends the file straight to
  Blob storage; nothing resizes, re-encodes or strips it. The stored file is
  the master, and up to 50MB is accepted so nobody has to shrink anything.
- **What a customer sees is a derivative generated at quality 100.**
  `images.qualities` in `next.config.ts` has a single entry, which is what
  forces it: Next 16 requires this allowlist and defaults it to `[75]`, so
  every product shot on the site was previously re-compressed to quality 75
  before it reached anyone. With one entry, any `quality` prop coerces to it,
  so the setting holds site-wide without a prop on each image.
- **The zoom asks for a bigger source.** The gallery magnifies 2.4×, so its
  `sizes` widens while zoom is on and the browser fetches a source matched to
  the magnified box rather than the frame.

Quality 100 costs roughly 3.5–4× the bytes of quality 75 (measured: a 1080px-wide
WebP goes from 56KB to 214KB). That is the deliberate trade — the photograph is
the product. To take the middle path instead, set `qualities: [90]`, which lands
around 117KB for the same image and is visually indistinguishable from the
original on a screen.

**The binding constraint is now the source files.** The thirty shipped pairs
were shot at 1250px wide, and the Air Dior's six in-house angles at 640px, so
they cannot get sharper than that under zoom no matter what the config says.
Re-uploading those at full resolution through `/admin` is the only fix, and
nothing else needs to change when you do.

### Where the catalogue is read

`lib/catalogue.ts` is the only thing that knows where inventory comes from. It
reads the Blob document, falls back to the seed, caches the result under the
`gg-catalogue` tag, and drops that cache on every admin write.

Orders live beside it in `lib/orders.ts`, same shape: one JSON document, whole
rewrites, its own cache tag. `app/(store)/checkout/actions.ts` is the only
thing that writes both at once.

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
- **Ordering** has no payment processor, by design — it matches the brief
  (cash on delivery / bank transfer, confirmed on WhatsApp), and placing an
  order still builds a pre-filled WhatsApp message via `lib/whatsapp.ts`. What
  *is* recorded server-side is the order itself: `lib/orders.ts` writes it next
  to the catalogue and draws the stock down. The cart, wishlist and
  recently-viewed list are still per-browser `localStorage`
  (`context/StoreContext.tsx`, `lib/recentStore.ts`).
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
