// Editable site-wide settings. In the original Claude Design prototype these
// were exposed as component "props" you could tweak in a side panel; here
// they're just constants — change them and redeploy.
export const SITE_CONFIG = {
  /** Canonical origin, no trailing slash. Used for canonical URLs, Open Graph
      images, the sitemap and the structured data. Change this before launch. */
  siteUrl: "https://gulfgrails.ae",
  whatsappNumber: "+971 55 689 2085",
  /** Shown in the footer and the contact points; also feeds the structured data. */
  email: "gulfgrails@gmail.com",
  /** AED delivery fee for any emirate other than Dubai. Dubai is free. */
  deliveryFeeOutside: 30,
  /** Orders above this AED amount are asked to pay by bank transfer instead of COD. */
  codLimit: 6000,
  /** AED credited to a referral code/name at checkout. */
  /**
   * What the house pays, as a fraction of what it sells the same model for.
   *
   * Used only for the indicative band on /sell. It is a commercial decision,
   * not a design one, which is why it lives here rather than inside a
   * component — set it to your real spread before that page goes live. The
   * band is labelled indicative and subject to inspection either way.
   */
  sellBand: [0.6, 0.72] as [number, number],

  referralDiscount: 100,
};