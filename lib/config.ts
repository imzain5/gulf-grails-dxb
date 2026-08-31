// Editable site-wide settings. In the original Claude Design prototype these
// were exposed as component "props" you could tweak in a side panel; here
// they're just constants — change them and redeploy.
export const SITE_CONFIG = {
  whatsappNumber: "+971 55 689 2085",
  /** AED delivery fee for any emirate other than Dubai. Dubai is free. */
  deliveryFeeOutside: 30,
  /** Orders above this AED amount are asked to pay by bank transfer instead of COD. */
  codLimit: 6000,
  /** AED credited to a referral code/name at checkout. */
  referralDiscount: 100,
};
