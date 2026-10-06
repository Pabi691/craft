// Category landing pages live at /<slug> — /bags, /sarees, /signature-blends.
// A few CRM slugs collide with real pages of the site, and the page always
// wins the route: /tea is the SPHOORA story, so the Tea category could never
// show its products. Those categories open at /shop/<slug> instead, which
// renders the same listing.
//
// Keep this in step with the routes in App.jsx.
const RESERVED_SLUGS = new Set([
  'tea',
  'about-us',
  'gallery',
  'contact-us',
  'products',
  'cart',
  'checkout',
  'thank-you',
  'wishlist',
  'search',
  'login',
  'register',
  'logout',
  'reset-password',
  'email-verification',
  'myaccount',
  'privacy-policy',
  'terms-and-conditions',
  'return-policy',
  '404',
]);

export const isReservedSlug = (slug) => RESERVED_SLUGS.has(String(slug || '').toLowerCase());

export const categoryPath = (slug) => (isReservedSlug(slug) ? `/shop/${slug}` : `/${slug}`);
