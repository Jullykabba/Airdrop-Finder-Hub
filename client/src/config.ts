/**
 * ─────────────────────────────────────────────────────────────────
 *  AirdropHub — Buyer Configuration File
 *  Edit this file to personalise the template without touching
 *  any other code.
 * ─────────────────────────────────────────────────────────────────
 */

/** The full site name shown in the header and footer. */
export const SITE_NAME = "AirdropHub";

/** Short tagline shown in the hero section. */
export const SITE_TAGLINE =
  "The #1 platform to discover verified crypto airdrops before everyone else.";

/**
 * Your WhatsApp phone number in international format (no + sign, no spaces).
 * Example: "2349133719207" for a Nigerian number +234 913 371 9207
 */
export const WHATSAPP_PHONE = "2349133719207";

/** Label on the floating WhatsApp button. */
export const WHATSAPP_LABEL = "Chat with us";

/** Computed WhatsApp link — do not edit this line. */
export const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_PHONE}`;

/**
 * URL for the Premium nav link.
 * By default this sends users to WhatsApp.
 * You can change it to a Paystack, Stripe, or any payment page.
 */
export const PREMIUM_LINK = WHATSAPP_LINK;

/** Footer copyright line. */
export const FOOTER_TEXT = `© ${new Date().getFullYear()} ${SITE_NAME}. All rights reserved.`;
