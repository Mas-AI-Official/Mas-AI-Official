/**
 * Centralized Calendly / booking URLs.
 *
 * Every CTA that routes a visitor to a booking page should import from
 * this file. Do NOT hardcode Calendly URLs in components. When Masoud
 * updates the Calendly slug, we update this file and every CTA
 * re-points automatically.
 *
 * Last updated by user: 2026-04-23. Slug moved from `masoud-masoori`
 * to `masoud-masoori-mas-ai`.
 */

export const BOOKING = {
  /**
   * Primary 30-minute consultation call. Default for every "Book a call"
   * CTA unless the context is specifically an automation audit.
   */
  consult30: 'https://calendly.com/masoud-masoori-mas-ai/30min',

  /**
   * 45-minute automation scoping call. Longer slot for deeper discovery
   * on automation/install engagements.
   *
   * TODO(Masoud): confirm the event-type slug at the new Calendly.
   * Currently pointing at the 30-min default until you send the real URL.
   */
  audit45: 'https://calendly.com/masoud-masoori-mas-ai/30min',

  /**
   * Intermediate /book landing page on mas-ai.co. Daena-website and
   * other MAS-AI surfaces link here when we want the visitor to pick
   * between options (30-min vs scan vs audit) before booking.
   */
  bookPage: 'https://mas-ai.co/book',
} as const

/**
 * Shorthand default — use when the CTA is generic ("Book a call").
 */
export const BOOKING_DEFAULT = BOOKING.consult30
