import { ENV } from '../config/env';

// Image URLs are stored absolute in the database (the CRM saves them that way
// on upload, and the seeder builds them from APP_URL). If a record was created
// on another machine — a local seed later imported to the server — the origin
// baked into it is wrong for this environment. Rewrite those to the configured
// API origin so the picture still loads, and expand root-relative paths too.
const LOCAL_ORIGIN = /^https?:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0)(:\d+)?/i;

export const mediaUrl = (src) => {
  if (!src || typeof src !== 'string') return src;
  const value = src.trim();
  if (!value || value === 'null') return '';
  if (LOCAL_ORIGIN.test(value)) return value.replace(LOCAL_ORIGIN, ENV.API_URL);
  if (value.startsWith('/')) return `${ENV.API_URL}${value}`;
  return value;
};
