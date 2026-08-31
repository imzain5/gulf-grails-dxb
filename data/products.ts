export interface Product {
  id: string;
  brand: string;
  fam: string;
  name: string;
  colorway: string;
  sku: string;
  year: number;
  /** Our price, AED. */
  price: number;
  /** Comparable market/resale price, AED. */
  market: number;
  sizes: number[];
  stock: number;
  /** Small badge shown on the card, e.g. "Bestseller" — empty string for none. */
  drop: string;
  blurb: string;
  desc: string;
  /** Premium (collab/luxury) pairs get the hot-size price bump — see lib/sizes.ts. */
  premium: boolean;
  /** Four real product photos, or null if none have been supplied yet. */
  photos: string[] | null;
}

type RawRow = [
  string, string, string, string, string, string, number,
  number, number, number[], number, string, string, string, boolean,
];

const RAW: RawRow[] = [
  ["air-dior", "Luxury", "Luxury", "Air Jordan 1 High OG Dior", "Wolf Grey / Sail / Photon Dust", "CN8607-002", 2020, 31200, 34500, [40, 41, 42, 43, 44, 45], 2, "Grail of the week", "8,500 pairs made worldwide. Five million entries. Two of them are here.", "Grey and sail Italian calfskin with the Dior Oblique swoosh, AIR DIOR wings on the collar and the icy DIOR-printed outsole. Comes with the numbered box, both dust bags and the card. This is the ceiling of the hobby — nothing else in the room competes with it.", true],
  ["lv-af1", "Luxury", "Luxury", "Louis Vuitton x Nike Air Force 1 Low", "Triple White", "LV-AF1-WHT", 2022, 33000, 36500, [41, 42, 43, 44], 1, "One pair only", "Virgil’s final Nike release, and the hardest pair in the UAE to find in a wearable size.", "Monogram-embossed white leather on the Air Force 1 low, built in LV’s own workshop rather than a Nike factory. Ships in the orange LV trunk box with the dust bags and the authenticity card.", true],
  ["dior-b23", "Luxury", "Luxury", "Dior B23 High-Top Oblique", "Navy / White Oblique", "B23-HT-OBL", 2023, 4600, 5200, [40, 41, 42, 43, 44, 45], 3, "", "Transparent Oblique canvas over white leather. The quiet Dior for people who missed the loud one.", "A high-top built on Dior’s own last, with the Oblique jacquard sealed under a clear technical fabric so the monogram never rubs off. Runs about a half size small.", false],
  ["ts-aj1-high", "Air Jordan", "Travis Scott", "Travis Scott x Air Jordan 1 High OG Mocha", "Sail / Black / Dark Mocha", "CD4487-100", 2019, 19100, 21000, [41, 42, 43, 44, 45], 1, "Vault pair", "The reversed swoosh that changed sneaker culture. Still the benchmark.", "Sail leather with brown nubuck panels, the backwards swoosh, hidden stash pocket in the collar and Cactus Jack branding throughout. The single most requested pair in the region six years on.", true],
  ["ts-aj1-low-rev", "Air Jordan", "Travis Scott", "Travis Scott x Air Jordan 1 Low OG Reverse Mocha", "Sail / Ridgerock / Black", "DM7866-162", 2022, 4800, 5400, [40, 41, 42, 43, 44, 45], 4, "Restocking Friday", "Our best seller three months running. Goes with literally everything.", "The Mocha palette flipped onto the low top — sail leather base, brown suede overlays, reversed swoosh. Easier to wear daily than the high and half the price.", true],
  ["ts-af1", "Nike", "Travis Scott", "Travis Scott x Nike Air Force 1 Low Cactus Jack", "Sail / Light Brown", "CN2405-900", 2019, 2900, 3300, [41, 42, 43, 44], 2, "", "Velcro swooshes you can swap. The most underrated Travis pair.", "Sail canvas and leather with interchangeable velcro swooshes, frayed edges and Cactus Jack embroidery on the heel. Comes with the extra swoosh set in the box.", false],
  ["ts-aj4", "Air Jordan", "Travis Scott", "Travis Scott x Air Jordan 4 Cactus Jack", "University Blue / Black", "308497-406", 2018, 12500, 14000, [42, 43, 44], 1, "Vault pair", "Blue suede, glow soles, 2018. They do not come up often.", "University Blue suede over a black cage with reflective Cactus Jack detailing and a glow-in-the-dark outsole. One of the shortest-run Jordan 4 collabs ever made.", true],
  ["ow-aj1", "Air Jordan", "Off-White", "Off-White x Air Jordan 1 High Chicago", "White / Varsity Red / Black", "AA3834-101", 2017, 29500, 32000, [42, 43, 44], 1, "Vault pair", "The Ten. The pair that started deconstruction. Museum piece.", "Virgil’s deconstructed Chicago — exposed foam, zip-tie, hand-scrawled AIR text and the helvetica quotation marks that ended up on everything. Original zip tie and both lace sets included.", true],
  ["ow-dunk", "Nike", "Off-White", "Off-White x Nike Dunk Low Lot 01 of 50", "White / Neutral Grey", "DM1602-127", 2021, 4200, 4700, [40, 41, 42, 43, 44, 45], 3, "", "From The 50. Numbered, tagged, and still climbing.", "Lot 01 of the fifty-pair Dunk series, with the numbered woven tag, dual-tone laces and the Off-White zip tie. The cleanest of the run and the one that resells hardest.", false],
  ["ow-af1-volt", "Nike", "Off-White", "Off-White x Nike Air Force 1 Low Volt", "Volt / White", "AO4606-700", 2018, 3300, 3800, [41, 42, 43, 44], 2, "", "Volt suede. Loud in the best way.", "Volt suede on the classic Air Force 1 low with the exposed stitching, zip tie and Off-White text hits. The rarest colourway of the three-pair 2018 run.", false],
  ["aj1-lost", "Air Jordan", "Jordan 1", "Air Jordan 1 Retro High OG Lost & Found", "Varsity Red / Black / Sail", "DZ5485-612", 2022, 1650, 1850, [40, 41, 42, 43, 44, 45, 46], 5, "Bestseller", "The Chicago rebuild — aged midsole, torn-poster box, the one everybody regretted missing.", "A faithful return of the 1985 Chicago, finished to look like a pair pulled out of a stockroom forty years later. Cracked Wings logo, yellowed midsole, and the collector’s box with the tape and sticker sheet intact.", false],
  ["aj1-bredtoe", "Air Jordan", "Jordan 1", "Air Jordan 1 Retro High OG Bred Toe", "Gym Red / Summit White / Black", "555088-610", 2018, 1900, 2100, [41, 42, 43, 44, 45], 3, "", "Three panels, three colours. Still the best-balanced Jordan 1 block.", "Black, red and white split cleanly across the panels with a red toe box that gave the pair its name. 2018 leather, which most people agree was the best year for it.", false],
  ["aj1-royal", "Air Jordan", "Jordan 1", "Air Jordan 1 Retro High OG Royal Reimagined", "Black / Game Royal", "DZ5485-042", 2025, 1250, 1400, [40, 41, 42, 43, 44, 45, 46], 6, "", "Black and royal blue, aged. The easiest 1 to wear.", "The 1985 Royal with a warmed midsole and softened leather. Blue is the colour that dates the least — this pair will look right in ten years.", false],
  ["aj1-blacktoe", "Air Jordan", "Jordan 1", "Air Jordan 1 Retro High OG Black Toe Reimagined", "White / Black / Varsity Red", "DZ5485-106", 2025, 1150, 1300, [40, 41, 42, 43, 44, 45, 46], 7, "", "The other original colourway, back with aged detailing.", "White leather with the black toe and red quarter panel, on a cream midsole. The most available OG colourway right now, which makes it the best value 1 on the shelf.", false],
  ["aj1-unc", "Air Jordan", "Jordan 1", "Air Jordan 1 Retro High OG UNC Toe", "University Blue / White / Black", "DZ5485-400", 2023, 1100, 1250, [41, 42, 43, 44, 45], 4, "", "Carolina blue on the toe. Underrated and cheap.", "White and black leather with a University Blue toe box, referencing the UNC colours Jordan wore before the Bulls. Quietly one of the best-fitting 1s of the last few years.", false],
  ["aj4-bred", "Air Jordan", "Jordan 4", "Air Jordan 4 Retro Bred Reimagined", "Black / Fire Red / Cement Grey", "FV5029-006", 2024, 1450, 1650, [40, 41, 42, 43, 44, 45, 46], 5, "Bestseller", "Nubuck, not leather. The best-feeling 4 in years.", "Black nubuck over a cement-speckled midsole with Fire Red on the tongue tab and heel. Softer out of the box than the 2019 pair and noticeably lighter on foot.", false],
  ["aj4-military", "Air Jordan", "Jordan 4", "Air Jordan 4 Retro Military Black", "White / Black / Neutral Grey", "DH6927-111", 2022, 1300, 1450, [41, 42, 43, 44, 45], 4, "", "Clean white leather 4. Goes with everything you own.", "White leather with black cage and grey accents on a white midsole. The most wearable 4 colourway and the one we restock most often.", false],
  ["aj4-thunder", "Air Jordan", "Jordan 4", "Air Jordan 4 Retro White Thunder", "Black / White / Black", "FQ8138-001", 2024, 1200, 1350, [40, 41, 42, 43, 44, 45], 5, "", "The Thunder palette inverted. Yellow where it counts.", "White nubuck with black cage and Tour Yellow on the eyelets, tongue and heel tab. Sharper in person than photos suggest.", false],
  ["dunk-panda", "Nike", "Dunk", "Nike Dunk Low Retro Panda", "White / Black", "DD1391-100", 2023, 620, 720, [39, 40, 41, 42, 43, 44, 45, 46], 9, "", "The pair that goes with everything, in every size we could get.", "Black and white leather Dunk Low on a white midsole. The most worn sneaker in the country three years running, and the one we restock most often.", false],
  ["dunk-greyfog", "Nike", "Dunk", "Nike Dunk Low Grey Fog", "Grey Fog / White", "DD1391-103", 2022, 700, 790, [40, 41, 42, 43, 44, 45], 5, "", "Softer than the Panda. Better with beige.", "Grey Fog leather overlays on white with a matching midsole. The quiet Dunk — reads closer to a tailored shoe than a skate one.", false],
  ["dunk-purple", "Nike", "Dunk", "Nike Dunk Low Court Purple", "Court Purple / White", "DD1391-104", 2022, 680, 760, [40, 41, 42, 43, 44, 45], 4, "", "Purple leather, white base. Nothing else needed.", "Court Purple overlays on white leather with a white midsole and purple heel tab. One of the last great single-colour Dunk drops.", false],
  ["af1-white", "Nike", "Air Force 1", "Nike Air Force 1 '07 Triple White", "White / White", "CW2288-111", 2024, 420, 480, [39, 40, 41, 42, 43, 44, 45, 46], 12, "Always in stock", "The default. Every size, every week, no waiting.", "All-white leather Air Force 1 low with the Air cushioning unit and pivot circle outsole. The single best-selling sneaker of all time and the safest gift in the store.", false],
  ["yz-zebra", "Yeezy", "Yeezy", "Yeezy Boost 350 V2 Zebra", "White / Core Black / Red", "CP9654", 2022, 1250, 1400, [39, 40, 41, 42, 43, 44, 45, 46], 6, "Bestseller", "The one Yeezy that never stops selling. Full Boost, striped Primeknit.", "Zebra-striped Primeknit upper with the SPLY-350 band and a full-length Boost midsole. The most requested Yeezy in the UAE and the safest resale pair we stock.", false],
  ["yz-bred", "Yeezy", "Yeezy", "Yeezy Boost 350 V2 Bred", "Core Black / Red", "CP9652", 2020, 1600, 1800, [41, 42, 43, 44, 45], 3, "", "All black with the red SPLY. The cleanest 350 made.", "Triple black Primeknit with the red SPLY-350 stripe and no side stripe window. Discontinued and climbing every quarter since.", false],
  ["yz-700", "Yeezy", "Yeezy", "Yeezy Boost 700 Wave Runner", "Solid Grey / Chalk White / Core Black", "B75571", 2020, 1500, 1700, [40, 41, 42, 43, 44, 45], 4, "", "The original chunky Yeezy. Heavier, softer, better with denim.", "Layered mesh and suede in grey, chalk and black over a segmented Boost midsole. The pair that turned the dad-shoe silhouette into a luxury category.", false],
  ["yz-foam", "Yeezy", "Yeezy", "Yeezy Foam Runner Onyx", "Onyx", "HP8739", 2022, 480, 560, [39, 40, 41, 42, 43, 44, 45, 46], 10, "", "One piece of algae foam. The easiest 480 dirhams in the store.", "Moulded EVA and algae foam with the perforated shell that made it recognisable from across a room. Wear a half size up if your feet are wide.", false],
  ["yz-slide", "Yeezy", "Yeezy", "Yeezy Slide Slate Grey", "Slate Grey", "ID2350", 2023, 380, 440, [40, 41, 42, 43, 44, 45], 8, "", "Dubai summer footwear, settled.", "One-piece moulded EVA slide with a grooved footbed. Runs small — go a full size up from your sneaker size.", false],
  ["bal-triple-s", "Balenciaga", "Balenciaga", "Balenciaga Triple S Clear Sole", "White / Grey / Red", "541624W2FA1", 2024, 3750, 4200, [40, 41, 42, 43, 44, 45], 3, "", "The chunky silhouette that started it all, on the transparent sole.", "Triple-stacked sole in mesh, leather and nubuck, hand-finished with the distressed overlay Balenciaga is known for. Runs large — take one full size down from your usual EU.", false],
  ["bal-speed", "Balenciaga", "Balenciaga", "Balenciaga Speed 2.0 Recycled Knit", "Black / White sole", "654034W2DB1", 2024, 2850, 3200, [40, 41, 42, 43, 44, 45, 46], 4, "", "Sock-knit upper, no laces, nothing else looks like it.", "A stretch-knit sock upper on a light rubber sole with the Balenciaga wordmark up the heel. Pulls on in a second and stays the easiest thing in the wardrobe to wear.", false],
  ["bal-runner", "Balenciaga", "Balenciaga", "Balenciaga Runner", "Grey / Black / Silver", "677403W3RB1", 2024, 4150, 4600, [41, 42, 43, 44, 45], 2, "", "The 90s trail runner rebuilt as luxury. Our loudest pair.", "Distressed mesh and suede on an exaggerated multi-layer sole, deliberately finished to look worn from the day it ships. Heaviest pair we carry and the one people notice first.", false],
];

const PHOTOS: Record<string, string[]> = {
  "air-dior": ["CN8607-002-1", "CN8607-002-2", "CN8607-002-3", "CN8607-002-4"],
  "lv-af1": ["LV-AF1-WHT-1", "LV-AF1-WHT-2", "LV-AF1-WHT-3", "LV-AF1-WHT-4"],
  "dior-b23": ["B23-HT-OBL-1", "B23-HT-OBL-2", "B23-HT-OBL-3", "B23-HT-OBL-4"],
  "ts-aj1-high": ["CD4487-100-1", "CD4487-100-2", "CD4487-100-3", "CD4487-100-4"],
  "ts-aj1-low-rev": ["DM7866-162-1", "DM7866-162-2", "DM7866-162-3", "DM7866-162-4"],
  "ts-af1": ["CN2405-900-1", "CN2405-900-2", "CN2405-900-3", "CN2405-900-4"],
  "ts-aj4": ["308497-406-1", "308497-406-2", "308497-406-3", "308497-406-4"],
  "ow-aj1": ["AA3834-101-1", "AA3834-101-2", "AA3834-101-3", "AA3834-101-4"],
  "ow-dunk": ["DM1602-100-1", "DM1602-100-2", "DM1602-100-3", "DM1602-100-4"],
  "ow-af1-volt": ["AO4606-700-1", "AO4606-700-2", "AO4606-700-3", "AO4606-700-4"],
  "aj1-lost": ["DZ5485-612-1", "DZ5485-612-2", "DZ5485-612-3", "DZ5485-612-4"],
  "aj1-bredtoe": ["555088-610-1", "555088-610-2", "555088-610-3", "555088-610-4"],
  "aj1-royal": ["FB9891-041-1", "FB9891-041-2", "FB9891-041-3", "FB9891-041-4"],
  "aj1-blacktoe": ["FZ5808-106-1", "FZ5808-106-2", "FZ5808-106-3", "FZ5808-106-4"],
  "aj1-unc": ["DX6773-100-1", "DX6773-100-2", "DX6773-100-3", "DX6773-100-4"],
  "aj4-bred": ["FV5029-006-1", "FV5029-006-2", "FV5029-006-3", "FV5029-006-4"],
  "aj4-military": ["DH6927-111-1", "DH6927-111-2", "DH6927-111-3", "DH6927-111-4"],
  "aj4-thunder": ["FV5029-700-1", "FV5029-700-2", "FV5029-700-3", "FV5029-700-4"],
  "dunk-panda": ["DD1391-100-1", "DD1391-100-2", "DD1391-100-3", "DD1391-100-4"],
  "dunk-greyfog": ["DD1391-103-1", "DD1391-103-2", "DD1391-103-3", "DD1391-103-4"],
  "dunk-purple": ["DD1391-104-1", "DD1391-104-2", "DD1391-104-3", "DD1391-104-4"],
  "af1-white": ["CW2288-111-1", "CW2288-111-2", "CW2288-111-3", "CW2288-111-4"],
  "yz-zebra": ["CP9654-1", "CP9654-2", "CP9654-3", "CP9654-4"],
  "yz-bred": ["CP9652-1", "CP9652-2", "CP9652-3", "CP9652-4"],
  "yz-700": ["B75571-1", "B75571-2", "B75571-3", "B75571-4"],
  "yz-foam": ["HP8739-1", "HP8739-2", "HP8739-3", "HP8739-4"],
  "yz-slide": ["ID2350-1", "ID2350-2", "ID2350-3", "ID2350-4"],
  "bal-triple-s": ["541624W2FA1-1", "541624W2FA1-2", "541624W2FA1-3", "541624W2FA1-4"],
  "bal-speed": ["654034W2DB1-1", "654034W2DB1-2", "654034W2DB1-3", "654034W2DB1-4"],
  "bal-runner": ["677403W3RB1-1", "677403W3RB1-2", "677403W3RB1-3", "677403W3RB1-4"],
};

// The Air Dior is the flagship: it gets the six dedicated in-house angles the
// shop actually photographed (matching VIEWS — Pair, Lateral, Medial, Detail,
// Heel, Sole) instead of the four generic listing shots every other pair
// uses, so its gallery has no empty upload slots.
const PHOTO_OVERRIDES: Record<string, string[]> = {
  "air-dior": [
    "/assets/air-dior-pair.webp",
    "/assets/air-dior-lateral.webp",
    "/assets/air-dior-medial.webp",
    "/assets/air-dior-swoosh.webp",
    "/assets/air-dior-heel.webp",
    "/assets/air-dior-outsole.webp",
  ],
};

export const PRODUCTS: Product[] = RAW.map((r) => {
  const [id, brand, fam, name, colorway, sku, year, price, market, sizes, stock, drop, blurb, desc, premium] = r;
  const files = PHOTOS[id];
  return {
    id, brand, fam, name, colorway, sku, year, price, market, sizes, stock, drop, blurb, desc, premium,
    photos: PHOTO_OVERRIDES[id] ?? (files ? files.map((f) => `/assets/products/${f}.webp`) : null),
  };
});

export function findProduct(id: string): Product {
  return PRODUCTS.find((p) => p.id === id) ?? PRODUCTS[0];
}

export const FAMILY_FILTERS = [
  "All", "Jordan 1", "Jordan 4", "Dunk", "Air Force 1", "Travis Scott",
  "Off-White", "Yeezy", "Balenciaga", "Luxury",
];

export const SIZE_FILTERS: (number | "All")[] = ["All", 39, 40, 41, 42, 43, 44, 45, 46];

export const SORTS = ["Featured", "Price low", "Price high", "Newest"] as const;
export type SortKey = (typeof SORTS)[number];

/** The three cards pinned to "This week's grails" on the homepage. */
export const FEATURED_IDS = ["air-dior", "ts-aj1-low-rev", "ow-dunk"];
