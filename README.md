# Gulf Grails — storefront

Production implementation of the `Gulf Grails.dc.html` Claude Design prototype
(see `../project/` and `../chats/chat1.md` for the original design source and
the conversation it came from). Next.js 16 (App Router) + TypeScript, no
external UI framework — the Modernist design system's tokens are ported
directly into `app/globals.css`.

## Running it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm run start   # production build
```

## What's real vs. what's a placeholder

- **Catalogue** (`data/products.ts`): 30 real pairs with real style codes, EU
  sizes and AED prices, ported from the design. 30 × 4 real product photos
  live in `public/assets/products/`.
- **Ordering** has no backend and no payment processor, by design — it
  matches the brief (cash on delivery / bank transfer, confirmed on
  WhatsApp). The cart, wishlist and last order live in the browser's
  `localStorage` only (see `context/StoreContext.tsx`); "placing an order"
  builds a pre-filled WhatsApp message via `lib/whatsapp.ts`. There is
  nowhere orders are recorded server-side — if that's needed later, this is
  the file to start from.
- **Editable photo slots** (`components/ImageSlot.tsx`): every spot that
  didn't have a real photo yet in the original design — the two non-flagship
  hero slides, both Stories tiles, the Trust/Sell/About page photos, the 6
  Instagram tiles, and each product's "Heel"/"Sole" gallery views — renders
  as a click-or-drag upload box instead of a static placeholder. Whoever
  runs the live site can drop a photo directly on the page and it's saved
  (downscaled client-side, stored as a data URL) to that visitor's browser
  only — **not** shared across visitors or devices. For photos everyone
  should see, add the file to `public/assets/` and reference it from
  `data/products.ts` (or the relevant component) like the rest of the real
  product photos.

## Editing site settings

`lib/config.ts` holds the WhatsApp number, the delivery fee for non-Dubai
emirates, the cash-on-delivery ceiling and the referral discount — change
values there rather than hunting through components.

## Deploying

Built for Vercel: `vercel --prod` from this directory, or connect the repo
in the Vercel dashboard with this folder (`site/`) as the project root.
No environment variables are required.
