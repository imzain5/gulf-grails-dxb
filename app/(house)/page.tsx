import { getCatalogue } from "@/lib/catalogue";
import Hero from "@/components/house/home/Hero";
import Vault from "@/components/house/home/Vault";
import CurrentlyHeld from "@/components/house/home/CurrentlyHeld";
import SixChecks from "@/components/house/home/SixChecks";
import GrailIndex from "@/components/house/home/GrailIndex";
import HeldInDubai from "@/components/house/home/HeldInDubai";
import Journal, { type Story } from "@/components/house/home/Journal";

/**
 * The homepage, eight acts instead of sixteen.
 *
 * Gone: the standalone drop countdown, the Off-White archive band, the "By
 * House" tile grid (that is navigation and now lives in the mega-menu), the
 * Instagram embed (a third-party grid dilutes a controlled brand — the footer
 * links out instead), the guarantee band (folded into the footer), the review
 * wall, and the Travis Scott band and stockroom grid, both merged into
 * "Currently held".
 *
 * Nothing here is pinned by hand. Every section derives from the catalogue, so
 * a pair added at /admin lands in the right act on its own.
 */

const STORIES: Story[] = [
  {
    kicker: "Most wanted",
    title: "What Dubai asked us for most this month",
    body: "Reverse Mocha lows took the top spot for the third month running, Panda Dunks refuse to die, and Air Dior enquiries tripled after the Mall of the Emirates pop-up.",
    href: "/shop",
    photo: "/assets/campaign/air-dior-flatlay.jpg",
  },
  {
    kicker: "Care",
    title: "Keeping white leather white in 45°C",
    body: "Heat yellows midsoles faster than wear does. Never leave a pair in the car, never store them in direct sun, and keep the silica packs that come in the box.",
    href: "/trust",
    photo: "/assets/campaign/air-dior-white.jpg",
  },
];

export default async function HomePage() {
  const catalogue = await getCatalogue();

  // The Vault is defined by price, so a new grail lands in it on its own.
  const vault = [...catalogue]
    .filter((p) => p.price >= 10000)
    .sort((a, b) => b.price - a.price)
    .slice(0, 3);
  const vaultIds = new Set(vault.map((p) => p.id));

  // Badged pairs lead, then the rest fills to eight.
  const held = [
    ...catalogue.filter((p) => p.drop && !vaultIds.has(p.id)),
    ...catalogue.filter((p) => !p.drop && !vaultIds.has(p.id)),
  ].slice(0, 8);

  return (
    <>
      <Hero
        campaign="/assets/campaign/air-dior-campaign.webp"
        headline={<>Six checks.<br />One pair.<br />One chance.</>}
        line="A private house for grails, physically held in Jumeirah. Every pair authenticated in-house, photographed on our own table, and paid for at your door."
      />

      <Vault lots={vault} />

      <CurrentlyHeld products={held} total={catalogue.length} />

      <SixChecks />

      <GrailIndex />

      <HeldInDubai photo="/assets/campaign/air-dior-onfoot.jpg" />

      <Journal stories={STORIES} />
    </>
  );
}
