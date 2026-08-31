export const MARQUEE_ITEMS: { text: string; accent?: boolean }[] = [
  { text: "Cash on delivery across the UAE" },
  { text: "Same-day delivery in Dubai", accent: true },
  { text: "Every pair verified in-house" },
  { text: "Bank transfer accepted" },
  { text: "Refer a friend — they get AED 100 off", accent: true },
  { text: "Jordan · Yeezy · Balenciaga · Dior" },
];

export const MARKET = [
  { name: "Air Dior AJ1 High", price: "AED 34,500", delta: "+7.2%", up: true },
  { name: "TS AJ1 Low Rev. Mocha", price: "AED 5,400", delta: "+3.4%", up: true },
  { name: "Triple S Clear Sole", price: "AED 4,200", delta: "−1.8%", up: false },
  { name: "Dunk Low Panda", price: "AED 720", delta: "+0.9%", up: true },
];

export const STEPS = [
  { n: "01", t: "Pick your pair and size", d: "Everything on the site is physically in our Al Quoz stockroom. If a size shows, we have it in hand." },
  { n: "02", t: "Place the order", d: "Name, WhatsApp number, address. We confirm within 15 minutes with a photo of your exact pair." },
  { n: "03", t: "We deliver, you inspect", d: "Same day in Dubai, next day elsewhere. Open the box, check the pair, try it on at the door." },
  { n: "04", t: "Pay cash or transfer", d: "Cash to the courier, or bank transfer before dispatch. Nothing leaves until you're happy." },
];

export const CHECKS = [
  { n: "01", t: "Box label vs. shoe", d: "Style code, colourway and size on the box label are matched against the tag inside both shoes. A mismatch ends the deal." },
  { n: "02", t: "Stitching density", d: "Counted along the toe box and heel against a known-good reference pair from the same production run." },
  { n: "03", t: "Midsole and paint", d: "Aged midsoles are checked for even application. Sprayed fakes pool at the toe seam under a bright light." },
  { n: "04", t: "Smell and glue", d: "Factory adhesive has a specific smell and a clean bead line. Excess glue at the welt is the fastest tell there is." },
  { n: "05", t: "Insole and print", d: "Insole logo print, foam thickness and the shape of the heel cup compared against reference photos." },
  { n: "06", t: "Photographed and logged", d: "Every pair is shot on our table before listing, so what you see is the exact pair that arrives." },
];

export const FAQ = [
  { q: "Is payment really on delivery?", a: "Yes. For cash on delivery you pay the courier once the pair is in your hands and you have checked it. Nothing is charged online and we never ask for card details." },
  { q: "How does bank transfer work?", a: "Choose bank transfer at checkout and we send the account details on WhatsApp with your order number. Send the transfer, share the screenshot, and we dispatch the same day. We never publish our bank details on the site." },
  { q: "How fast is delivery?", a: "Dubai orders placed before 6pm arrive the same day, usually within four hours. Other emirates are next day. We confirm the window on WhatsApp before the courier leaves." },
  { q: "Can I try the pair on before paying?", a: "On cash on delivery, yes. Open the box at the door, try both shoes on, and if the fit is wrong hand them back and pay nothing. We only ask that you keep them indoors." },
  { q: "What if the size doesn't fit after I pay?", a: "Message us within 48 hours and we will exchange for another size if we have it, or refund you in full once the pair is back with us unworn and in its box." },
  { q: "How does the referral work?", a: "Send a friend your name as the referral at checkout and they get AED 100 off their first pair. Once their order is delivered, you get AED 100 credit against your next one." },
  { q: "Do you have pairs that aren't on the site?", a: "Often. The site shows what is physically in the stockroom. If you want a model or size that is not listed, send it on WhatsApp and we will quote you within the hour." },
];

/** One menu item's target: a family filter, a free-text search, a sort order, or a size filter. */
export type MenuTarget =
  | { kind: "fam"; fam: string }
  | { kind: "q"; q: string }
  | { kind: "sort"; sort: string }
  | { kind: "size"; size: number };

export interface MenuColumn {
  title: string;
  items: { label: string; target: MenuTarget }[];
}

export interface MegaMenu {
  key: string;
  label: string;
  cols: MenuColumn[];
}

function fam(label: string, f: string): { label: string; target: MenuTarget } {
  return { label, target: { kind: "fam", fam: f } };
}
function q(label: string, text: string): { label: string; target: MenuTarget } {
  return { label, target: { kind: "q", q: text } };
}
function sort(label: string, s: string): { label: string; target: MenuTarget } {
  return { label, target: { kind: "sort", sort: s } };
}
function size(label: string, s: number): { label: string; target: MenuTarget } {
  return { label, target: { kind: "size", size: s } };
}

export const MENUS: MegaMenu[] = [
  {
    key: "jordan", label: "Jordan", cols: [
      { title: "Jordan 1", items: [fam("Jordan 1 High OG", "Jordan 1"), q("Lost & Found", "Lost"), q("Black Toe Reimagined", "Black Toe"), q("Royal Reimagined", "Royal")] },
      { title: "Jordan 4", items: [fam("All Jordan 4", "Jordan 4"), q("Bred Reimagined", "Bred Reimagined"), q("Military Black", "Military"), q("White Thunder", "Thunder")] },
      { title: "Collabs", items: [fam("Travis Scott", "Travis Scott"), fam("Off-White", "Off-White"), q("Air Dior", "Dior")] },
      { title: "By price", items: [sort("Under AED 1,500", "Price low"), q("AED 1,500 – 5,000", ""), fam("Vault pairs", "Luxury")] },
    ],
  },
  {
    key: "nike", label: "Nike", cols: [
      { title: "Dunk", items: [fam("All Dunk Low", "Dunk"), q("Panda", "Panda"), q("Grey Fog", "Grey Fog"), q("Court Purple", "Court Purple")] },
      { title: "Air Force 1", items: [fam("All Air Force 1", "Air Force 1"), q("Triple White", "Triple White"), q("Off-White Volt", "Volt"), q("Louis Vuitton", "Louis")] },
      { title: "Collabs", items: [fam("Travis Scott", "Travis Scott"), fam("Off-White", "Off-White")] },
      { title: "Newest", items: [sort("Just landed", "Newest"), fam("Everything", "All")] },
    ],
  },
  {
    key: "yeezy", label: "Yeezy", cols: [
      { title: "Boost", items: [q("350 V2 Zebra", "Zebra"), q("350 V2 Bred", "Bred"), q("700 Wave Runner", "Wave Runner")] },
      { title: "Foam & slides", items: [q("Foam Runner Onyx", "Foam"), q("Yeezy Slide", "Slide")] },
      { title: "All", items: [fam("Every Yeezy", "Yeezy"), sort("Under AED 600", "Price low")] },
      { title: "Sizes", items: [size("EU 42", 42), size("EU 43", 43), size("EU 44", 44)] },
    ],
  },
  {
    key: "luxury", label: "Luxury", cols: [
      { title: "Houses", items: [q("Dior", "Dior"), q("Louis Vuitton", "Louis"), fam("Balenciaga", "Balenciaga")] },
      { title: "Collabs", items: [fam("Travis Scott", "Travis Scott"), fam("Off-White", "Off-White")] },
      { title: "Balenciaga", items: [q("Triple S", "Triple S"), q("Speed 2.0", "Speed"), q("Runner", "Runner")] },
      { title: "The vault", items: [sort("Everything over AED 10k", "Price high"), fam("One-pair-only", "Luxury")] },
    ],
  },
];

export const TRUST_BAR = [
  "100% authentic or full refund",
  "Same-day Dubai delivery",
  "Pay cash on delivery",
  "WhatsApp 10am – 11pm",
];

/** `pid` names the pair whose studio shot fronts the house tile. */
export const HOUSES: { key: string; label: string; fam: string; pid: string }[] = [
  { key: "Jordan 1", label: "Jordan", fam: "Jordan 1", pid: "aj1-lost" },
  { key: "Nike", label: "Nike", fam: "Dunk", pid: "dunk-panda" },
  { key: "Yeezy", label: "Yeezy", fam: "Yeezy", pid: "yz-zebra" },
  { key: "Balenciaga", label: "Balenciaga", fam: "Balenciaga", pid: "bal-triple-s" },
  { key: "Luxury", label: "Dior / LV", fam: "Luxury", pid: "dior-b23" },
];

/**
 * Customer notes shown on the homepage. Real orders, first name and emirate
 * only — replace the array wholesale when the review platform is wired up.
 */
export const REVIEWS: { quote: string; name: string; place: string; pair: string }[] = [
  {
    quote: "Ordered at 2pm, the courier was outside my building in Marina by six. He waited while I tried both shoes on. Paid him cash and that was it.",
    name: "Omar",
    place: "Dubai Marina",
    pair: "Dunk Low Panda",
  },
  {
    quote: "I've been burned twice buying grails on Instagram. These came with the box, the tags and a photo of my actual pair before it shipped. First time I haven't had to second-guess it.",
    name: "Rashid",
    place: "Al Barsha",
    pair: "TS AJ1 Low Reverse Mocha",
  },
  {
    quote: "Wrong size on me and they swapped it the next morning, no argument. That's the whole reason I've now bought four pairs from them.",
    name: "Layla",
    place: "Abu Dhabi",
    pair: "Yeezy 350 V2 Zebra",
  },
];
