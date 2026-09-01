/**
 * The silhouette library.
 *
 * Listing a pair from a phone in a stockroom means typing a brand, a model
 * group, a size run and a paragraph of description into a small screen — for a
 * shoe that is one of maybe forty silhouettes the shop ever sells. So the
 * shapes are kept here and picked from a list instead.
 *
 * These are deliberately **silhouettes, not colourways**. "Air Jordan 1 Retro
 * High OG" covers Chicago, Bred Toe, Royal and every colourway that will ever
 * exist on that shape; a list of specific colourways would be stale within a
 * season and wrong the first time someone lists a pair that isn't on it. So a
 * preset fills in everything that is true of the shape — brand, model group,
 * usual size run, whether it takes the collab price bump, and a description of
 * the shoe itself — and the person listing adds the colourway, the style code
 * and the price, which are the only things they actually have to know.
 *
 * Nothing here is authoritative. Every field a preset sets is editable
 * afterwards; it is a head start, not a constraint.
 */

export interface ModelPreset {
  key: string;
  /** The silhouette name. The lister appends the colourway to it. */
  name: string;
  brand: string;
  /** Which shop filter the pair sits under. */
  fam: string;
  /** The size run this shape usually comes in. */
  sizes: number[];
  /** Collabs and luxury take the mid-size price bump — see lib/sizes.ts. */
  premium: boolean;
  /** Extra words to match on when searching, beyond the name itself. */
  keywords: string;
  /** Description of the shape, ready to have colourway detail added. */
  desc: string;
  /** Fit note, shown as a hint while listing. */
  fit?: string;
}

/** The size runs worth one tap. */
export const SIZE_PRESETS: { label: string; sizes: number[] }[] = [
  { label: "Full run 39–46", sizes: [39, 40, 41, 42, 43, 44, 45, 46] },
  { label: "40–45", sizes: [40, 41, 42, 43, 44, 45] },
  { label: "41–45", sizes: [41, 42, 43, 44, 45] },
  { label: "42–44 only", sizes: [42, 43, 44] },
];

const FULL = [39, 40, 41, 42, 43, 44, 45, 46];
const MID = [40, 41, 42, 43, 44, 45];
const NARROW = [41, 42, 43, 44, 45];

export const MODEL_PRESETS: ModelPreset[] = [
  // ── Jordan ────────────────────────────────────────────────────────────────
  {
    key: "aj1-high",
    name: "Air Jordan 1 Retro High OG",
    brand: "Air Jordan", fam: "Jordan 1", sizes: FULL, premium: false,
    keywords: "aj1 jordan one high chicago bred royal",
    desc: "The 1985 original, rebuilt on the OG last with full-grain leather, the Wings logo on the collar and Nike Air on the tongue. The shape the entire hobby is measured against.",
    fit: "True to size. Break the leather in — they soften after a week.",
  },
  {
    key: "aj1-mid",
    name: "Air Jordan 1 Mid",
    brand: "Air Jordan", fam: "Jordan 1", sizes: FULL, premium: false,
    keywords: "aj1 jordan one mid",
    desc: "The 1 on a lower collar and a simpler build. The everyday version of the shape — easier to wear, easier on the wallet.",
    fit: "True to size.",
  },
  {
    key: "aj1-low",
    name: "Air Jordan 1 Retro Low OG",
    brand: "Air Jordan", fam: "Jordan 1", sizes: FULL, premium: false,
    keywords: "aj1 jordan one low",
    desc: "The low-top cut of the 1 on the OG last, in the same leather as the high. The one that goes with shorts in a Dubai summer.",
    fit: "True to size.",
  },
  {
    key: "aj3",
    name: "Air Jordan 3 Retro",
    brand: "Air Jordan", fam: "Jordan 3", sizes: NARROW, premium: false,
    keywords: "aj3 jordan three elephant cement",
    desc: "Elephant print, the visible Air unit and the Jumpman's first appearance on a Jordan. Tinker Hatfield's first, and the pair most collectors name as the best-looking of the run.",
    fit: "True to size, slightly roomy in the toe.",
  },
  {
    key: "aj4",
    name: "Air Jordan 4 Retro",
    brand: "Air Jordan", fam: "Jordan 4", sizes: FULL, premium: false,
    keywords: "aj4 jordan four cement bred military",
    desc: "The netted cage, the plastic wings and the visible heel Air. Lighter on foot than it looks and the most wearable of the early Jordans.",
    fit: "True to size. Nubuck versions loosen more than leather ones.",
  },
  {
    key: "aj5",
    name: "Air Jordan 5 Retro",
    brand: "Air Jordan", fam: "Jordan 5", sizes: NARROW, premium: false,
    keywords: "aj5 jordan five shark tooth",
    desc: "Shark-tooth midsole, reflective tongue and a translucent outsole. The loudest of the Hatfield run and the one that photographs best.",
    fit: "True to size.",
  },
  {
    key: "aj11",
    name: "Air Jordan 11 Retro",
    brand: "Air Jordan", fam: "Jordan 11", sizes: NARROW, premium: false,
    keywords: "aj11 jordan eleven patent concord bred",
    desc: "Patent leather over ballistic mesh with a carbon fibre plate underneath. The Christmas release every year, and the only Jordan people wear with a suit.",
    fit: "Runs slightly narrow. Go up a half size if your feet are wide.",
  },

  // ── Nike ──────────────────────────────────────────────────────────────────
  {
    key: "dunk-low",
    name: "Nike Dunk Low Retro",
    brand: "Nike", fam: "Dunk", sizes: FULL, premium: false,
    keywords: "dunk low panda sb",
    desc: "The 1985 college basketball shoe, now the most-worn silhouette in the country. Leather overlays on a flat foam midsole — simple, and it goes with everything.",
    fit: "True to size.",
  },
  {
    key: "dunk-high",
    name: "Nike Dunk High Retro",
    brand: "Nike", fam: "Dunk", sizes: MID, premium: false,
    keywords: "dunk high",
    desc: "The Dunk on a padded high collar. Rarer than the low and the better-looking of the two on foot.",
    fit: "True to size.",
  },
  {
    key: "af1-low",
    name: "Nike Air Force 1 '07",
    brand: "Nike", fam: "Air Force 1", sizes: FULL, premium: false,
    keywords: "af1 air force one low triple white",
    desc: "Leather upper, encapsulated Air, pivot-circle outsole. The best-selling sneaker ever made and the safest pair in the store.",
    fit: "Runs about a half size large.",
  },
  {
    key: "af1-mid",
    name: "Nike Air Force 1 Mid '07",
    brand: "Nike", fam: "Air Force 1", sizes: MID, premium: false,
    keywords: "af1 mid strap",
    desc: "The Air Force 1 with the padded ankle collar and the velcro strap. Same build, more shoe.",
    fit: "Runs about a half size large.",
  },
  {
    key: "airmax-90",
    name: "Nike Air Max 90",
    brand: "Nike", fam: "Air Max", sizes: MID, premium: false,
    keywords: "am90 air max ninety infrared",
    desc: "The 1990 runner with the visible Air window and the layered mesh-and-suede upper. The most comfortable thing in the shop to walk in all day.",
    fit: "True to size.",
  },
  {
    key: "airmax-1",
    name: "Nike Air Max 1",
    brand: "Nike", fam: "Air Max", sizes: MID, premium: false,
    keywords: "am1 air max one",
    desc: "The first shoe with Air you could see. Slimmer and more tailored than the 90 — the one that reads as a proper sneaker rather than a trainer.",
    fit: "Runs about a half size small.",
  },
  {
    key: "vomero-5",
    name: "Nike Zoom Vomero 5",
    brand: "Nike", fam: "Nike Running", sizes: MID, premium: false,
    keywords: "vomero five dad shoe",
    desc: "The 2000s running shoe that came back as a fashion pair. Layered mesh, plastic cages and a chunky foam sole.",
    fit: "True to size.",
  },
  {
    key: "p6000",
    name: "Nike P-6000",
    brand: "Nike", fam: "Nike Running", sizes: MID, premium: false,
    keywords: "p6000 pegasus metallic",
    desc: "A mash-up of the Pegasus and the Zoom Spiridon, in mesh and metallic overlays. Light, cheap and everywhere right now.",
    fit: "True to size.",
  },

  // ── Adidas / Yeezy ────────────────────────────────────────────────────────
  {
    key: "yz-350",
    name: "Yeezy Boost 350 V2",
    brand: "Yeezy", fam: "Yeezy", sizes: FULL, premium: false,
    keywords: "350 v2 zebra bred primeknit sply",
    desc: "Primeknit upper over a full-length Boost midsole, with the SPLY-350 band across the side. The pair that made the whole line, and still the one most people ask for.",
    fit: "Runs small. Go a half size up.",
  },
  {
    key: "yz-700",
    name: "Yeezy Boost 700",
    brand: "Yeezy", fam: "Yeezy", sizes: MID, premium: false,
    keywords: "700 wave runner chunky",
    desc: "Layered mesh, suede and leather over a segmented Boost sole. The pair that turned the dad shoe into a luxury category.",
    fit: "True to size, but heavy — try before you commit.",
  },
  {
    key: "yz-slide",
    name: "Yeezy Slide",
    brand: "Yeezy", fam: "Yeezy", sizes: MID, premium: false,
    keywords: "slide foam eva pool",
    desc: "One piece of moulded EVA with a grooved footbed. Dubai summer footwear, settled.",
    fit: "Runs small — go a full size up from your sneaker size.",
  },
  {
    key: "yz-foam",
    name: "Yeezy Foam Runner",
    brand: "Yeezy", fam: "Yeezy", sizes: FULL, premium: false,
    keywords: "foam runner onyx algae clog",
    desc: "Moulded EVA and algae foam with the perforated shell that made it recognisable from across a room.",
    fit: "Wear a half size up if your feet are wide.",
  },
  {
    key: "samba",
    name: "Adidas Samba OG",
    brand: "Adidas", fam: "Adidas", sizes: FULL, premium: false,
    keywords: "samba og terrace gum sole",
    desc: "The 1950 indoor football shoe: leather upper, suede T-toe, gum sole. Flat, low and the single most-worn silhouette in Europe right now.",
    fit: "Runs narrow and about a half size large.",
  },
  {
    key: "gazelle",
    name: "Adidas Gazelle",
    brand: "Adidas", fam: "Adidas", sizes: MID, premium: false,
    keywords: "gazelle suede terrace",
    desc: "All-suede upper, contrast three stripes, gum sole. Softer and rounder than the Samba, and it comes in every colour there is.",
    fit: "Runs about a half size large.",
  },
  {
    key: "campus",
    name: "Adidas Campus 00s",
    brand: "Adidas", fam: "Adidas", sizes: MID, premium: false,
    keywords: "campus 00s suede chunky",
    desc: "The Campus rebuilt on a fatter 2000s sole. Suede upper, oversized tongue, the loudest of the three terrace shapes.",
    fit: "Runs large. Take a full size down.",
  },

  // ── New Balance / Asics / Salomon ─────────────────────────────────────────
  {
    key: "nb-550",
    name: "New Balance 550",
    brand: "New Balance", fam: "New Balance", sizes: MID, premium: false,
    keywords: "550 basketball white green",
    desc: "A 1989 basketball shoe brought back untouched. Leather panels, a flat sole and the cleanest white shoe that isn't an Air Force 1.",
    fit: "True to size.",
  },
  {
    key: "nb-2002r",
    name: "New Balance 2002R",
    brand: "New Balance", fam: "New Balance", sizes: MID, premium: false,
    keywords: "2002r protection pack grey",
    desc: "Suede and mesh over ABZORB and N-ergy cushioning. The most comfortable pair in the shop and the one people buy a second of.",
    fit: "True to size.",
  },
  {
    key: "nb-9060",
    name: "New Balance 9060",
    brand: "New Balance", fam: "New Balance", sizes: MID, premium: false,
    keywords: "9060 chunky wavy",
    desc: "The 99X series exaggerated — wavy overlays, a stacked sole and oversized N. Chunky without being a costume.",
    fit: "True to size.",
  },
  {
    key: "asics-gel1130",
    name: "Asics Gel-1130",
    brand: "Asics", fam: "Asics", sizes: MID, premium: false,
    keywords: "gel 1130 silver kiko",
    desc: "A 2008 runner with visible Gel in the heel and metallic mesh overlays. The pair that took the 2020s runner trend mainstream.",
    fit: "True to size.",
  },
  {
    key: "asics-kayano14",
    name: "Asics Gel-Kayano 14",
    brand: "Asics", fam: "Asics", sizes: MID, premium: false,
    keywords: "kayano 14 silver cream",
    desc: "Layered mesh, silver panels and a lot of Gel. Softer underfoot than anything else at the price.",
    fit: "True to size.",
  },
  {
    key: "salomon-xt6",
    name: "Salomon XT-6",
    brand: "Salomon", fam: "Salomon", sizes: MID, premium: false,
    keywords: "xt6 trail quicklace technical",
    desc: "A trail running shoe adopted by everyone who never runs. Quicklace, welded overlays and a grippy Contagrip sole.",
    fit: "Runs about a half size small.",
  },

  // ── Collabs and luxury ────────────────────────────────────────────────────
  {
    key: "ts-aj1-high",
    name: "Travis Scott x Air Jordan 1 High OG",
    brand: "Air Jordan", fam: "Travis Scott", sizes: NARROW, premium: true,
    keywords: "travis cactus jack reverse swoosh mocha",
    desc: "The backwards swoosh, the hidden stash pocket in the collar and Cactus Jack branding throughout. The most requested collab in the region.",
    fit: "True to size.",
  },
  {
    key: "ts-aj1-low",
    name: "Travis Scott x Air Jordan 1 Low OG",
    brand: "Air Jordan", fam: "Travis Scott", sizes: MID, premium: true,
    keywords: "travis cactus jack low reverse mocha olive",
    desc: "The Travis palette on the low top — leather base, suede overlays, reversed swoosh. Easier to wear daily than the high.",
    fit: "True to size.",
  },
  {
    key: "ts-aj4",
    name: "Travis Scott x Air Jordan 4",
    brand: "Air Jordan", fam: "Travis Scott", sizes: NARROW, premium: true,
    keywords: "travis cactus jack four blue suede",
    desc: "Suede over a contrast cage with reflective Cactus Jack detailing and a glow-in-the-dark outsole.",
    fit: "True to size.",
  },
  {
    key: "ts-af1",
    name: "Travis Scott x Nike Air Force 1 Low",
    brand: "Nike", fam: "Travis Scott", sizes: NARROW, premium: true,
    keywords: "travis cactus jack air force velcro swoosh",
    desc: "Canvas and leather with interchangeable velcro swooshes, frayed edges and Cactus Jack embroidery on the heel. Extra swoosh set in the box.",
    fit: "Runs about a half size large.",
  },
  {
    key: "ow-aj1",
    name: "Off-White x Air Jordan 1",
    brand: "Air Jordan", fam: "Off-White", sizes: NARROW, premium: true,
    keywords: "off white virgil the ten chicago zip tie deconstructed",
    desc: "Virgil's deconstruction: exposed foam, the zip tie, hand-scrawled AIR text and the helvetica quotation marks that ended up on everything.",
    fit: "True to size.",
  },
  {
    key: "ow-dunk",
    name: "Off-White x Nike Dunk Low",
    brand: "Nike", fam: "Off-White", sizes: MID, premium: true,
    keywords: "off white the 50 lot numbered dunk",
    desc: "From The 50, with the numbered woven tag, dual-tone laces and the Off-White zip tie.",
    fit: "True to size.",
  },
  {
    key: "ow-af1",
    name: "Off-White x Nike Air Force 1 Low",
    brand: "Nike", fam: "Off-White", sizes: NARROW, premium: true,
    keywords: "off white virgil air force volt mca",
    desc: "The Air Force 1 with exposed stitching, the zip tie and Off-White text hits.",
    fit: "Runs about a half size large.",
  },
  {
    key: "sacai-ldw",
    name: "Sacai x Nike LDWaffle",
    brand: "Nike", fam: "Sacai", sizes: NARROW, premium: true,
    keywords: "sacai double swoosh layered waffle",
    desc: "Two shoes cut in half and stitched together — doubled swooshes, doubled tongues, doubled laces, on a stacked Waffle sole.",
    fit: "Runs about a half size large.",
  },
  {
    key: "dior-b23",
    name: "Dior B23",
    brand: "Dior", fam: "Luxury", sizes: MID, premium: true,
    keywords: "dior b23 oblique high low canvas",
    desc: "Built on Dior's own last, with the Oblique jacquard sealed under a clear technical fabric so the monogram never rubs off.",
    fit: "Runs about a half size small.",
  },
  {
    key: "aj1-dior",
    name: "Air Jordan 1 High OG Dior",
    brand: "Dior", fam: "Luxury", sizes: MID, premium: true,
    keywords: "air dior grail italian calfskin",
    desc: "Italian calfskin with the Dior Oblique swoosh, AIR DIOR wings on the collar and the icy DIOR-printed outsole. Numbered box, both dust bags and the card.",
    fit: "True to size.",
  },
  {
    key: "lv-trainer",
    name: "Louis Vuitton Trainer",
    brand: "Louis Vuitton", fam: "Luxury", sizes: NARROW, premium: true,
    keywords: "lv virgil monogram trainer",
    desc: "Virgil's basketball-shaped trainer in monogram-embossed leather, made in LV's own workshop. Ships in the orange trunk box.",
    fit: "Runs large. Take a full size down.",
  },
  {
    key: "bal-triple-s",
    name: "Balenciaga Triple S",
    brand: "Balenciaga", fam: "Balenciaga", sizes: MID, premium: false,
    keywords: "balenciaga triple s chunky clear sole",
    desc: "Triple-stacked sole in mesh, leather and nubuck, hand-finished with the distressed overlay Balenciaga is known for.",
    fit: "Runs large. Take a full size down.",
  },
  {
    key: "bal-speed",
    name: "Balenciaga Speed",
    brand: "Balenciaga", fam: "Balenciaga", sizes: FULL, premium: false,
    keywords: "balenciaga speed sock knit laceless",
    desc: "A stretch-knit sock upper on a light rubber sole with the wordmark up the heel. Pulls on in a second.",
    fit: "True to size.",
  },
  {
    key: "bal-runner",
    name: "Balenciaga Runner",
    brand: "Balenciaga", fam: "Balenciaga", sizes: NARROW, premium: false,
    keywords: "balenciaga runner distressed trail",
    desc: "Distressed mesh and suede on an exaggerated multi-layer sole, finished to look worn from the day it ships.",
    fit: "Runs large. Take a full size down.",
  },
  {
    key: "amiri-skel",
    name: "Amiri Skel-Top",
    brand: "Amiri", fam: "Luxury", sizes: NARROW, premium: true,
    keywords: "amiri skeleton bone leather high",
    desc: "Leather high-top with the bone appliqué down the side, on a chunky vulcanised sole.",
    fit: "True to size.",
  },
  {
    key: "gg-screener",
    name: "Gucci Screener",
    brand: "Gucci", fam: "Luxury", sizes: MID, premium: true,
    keywords: "gucci screener distressed web stripe",
    desc: "Leather and suede with the Web stripe and a deliberately aged rubber sole and midsole.",
    fit: "Runs small. Go up a half size.",
  },
];

/** Free-text search across the library, best match first. */
export function searchModels(term: string, limit = 8): ModelPreset[] {
  const needle = term.trim().toLowerCase();
  if (needle.length < 2) return [];

  return MODEL_PRESETS.map((m) => {
    const name = m.name.toLowerCase();
    const hay = `${name} ${m.brand} ${m.fam} ${m.keywords}`.toLowerCase();
    if (!hay.includes(needle)) return null;
    // A hit at the front of the model name beats one buried in the keywords.
    const rank = name.startsWith(needle) ? 0 : name.includes(needle) ? 1 : 2;
    return { m, rank };
  })
    .filter((x): x is { m: ModelPreset; rank: number } => x !== null)
    .sort((a, b) => a.rank - b.rank)
    .slice(0, limit)
    .map((x) => x.m);
}
