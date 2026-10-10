// Writes public/sitemap.xml and public/robots.txt before a build.
//
// Category and product pages live in the CRM, so a hand-written sitemap goes
// stale the moment someone adds a tea. This asks the live API for what exists
// right now and lists it. It runs as part of `npm run build`, and never fails
// the build: if the API cannot be reached it still writes the fixed pages and
// says so, rather than leaving the site without a sitemap.
//
// Private pages (cart, checkout, account, auth) are deliberately absent — they
// are useless in search results and some carry tokens.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { categoryPath } from '../src/lib/links.js';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');

// .env is the same file Vite reads; no dependency needed for five lines.
const readEnv = () => {
  try {
    return Object.fromEntries(
      readFileSync(resolve(root, '.env'), 'utf8')
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line && !line.startsWith('#') && line.includes('='))
        .map((line) => {
          const i = line.indexOf('=');
          return [line.slice(0, i).trim(), line.slice(i + 1).trim().replace(/^["']|["']$/g, '')];
        })
    );
  } catch {
    return {};
  }
};

const env = readEnv();
const SITE = (process.env.SITE_URL || env.VITE_SITE_URL || 'https://craftcombine.org').replace(/\/$/, '');
const API = (process.env.VITE_API_URL || env.VITE_API_URL || '').replace(/\/$/, '');
const TOKEN = process.env.VITE_WEB_TOKEN || env.VITE_WEB_TOKEN || '';

// changefreq is a hint, not a promise. priority is relative within this site.
const STATIC_PAGES = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/tea', changefreq: 'weekly', priority: '0.9' },
  { path: '/products', changefreq: 'weekly', priority: '0.9' },
  { path: '/about-us', changefreq: 'monthly', priority: '0.7' },
  { path: '/gallery', changefreq: 'monthly', priority: '0.6' },
  { path: '/contact-us', changefreq: 'monthly', priority: '0.6' },
  { path: '/privacy-policy', changefreq: 'yearly', priority: '0.3' },
  { path: '/terms-and-conditions', changefreq: 'yearly', priority: '0.3' },
  { path: '/return-policy', changefreq: 'yearly', priority: '0.3' },
];

const api = async (path) => {
  if (!API) throw new Error('VITE_API_URL is not set');
  const res = await fetch(`${API}${path}`, {
    headers: { Accept: 'application/json', ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}) },
    signal: AbortSignal.timeout(30000),
  });
  if (!res.ok) throw new Error(`${path} answered ${res.status}`);
  return res.json();
};

const flattenCategories = (nodes = []) =>
  nodes.flatMap((n) => [n, ...flattenCategories(n.child_categories || n.children || [])]);

const isoDate = (value) => {
  const d = value ? new Date(String(value).replace(' ', 'T')) : null;
  return d && !Number.isNaN(d.valueOf()) ? d.toISOString().slice(0, 10) : null;
};

const xmlEscape = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const urlTag = ({ path, lastmod, changefreq, priority }) =>
  [
    '  <url>',
    `    <loc>${xmlEscape(SITE + path)}</loc>`,
    lastmod ? `    <lastmod>${lastmod}</lastmod>` : null,
    changefreq ? `    <changefreq>${changefreq}</changefreq>` : null,
    priority ? `    <priority>${priority}</priority>` : null,
    '  </url>',
  ]
    .filter(Boolean)
    .join('\n');

const main = async () => {
  const pages = [...STATIC_PAGES];
  let categories = 0;
  let products = 0;

  try {
    const catData = await api('/api/v1/categories');
    const tree = Object.values(catData).find(Array.isArray) || [];
    const seen = new Set();
    for (const c of flattenCategories(tree)) {
      if (!c?.slug || seen.has(c.slug)) continue;
      seen.add(c.slug);
      pages.push({ path: categoryPath(c.slug), changefreq: 'weekly', priority: '0.8' });
      categories++;
    }
  } catch (err) {
    console.warn(`[sitemap] categories skipped — ${err.message}`);
  }

  try {
    const prodData = await api('/api/v1/get_active_products');
    const list = prodData.products || prodData.product_list || prodData.data || [];
    for (const p of list) {
      if (!p?.slug) continue;
      pages.push({
        path: `/p/${p.slug}`,
        lastmod: isoDate(p.updated_at),
        changefreq: 'weekly',
        priority: '0.7',
      });
      products++;
    }
  } catch (err) {
    console.warn(`[sitemap] products skipped — ${err.message}`);
  }

  const today = new Date().toISOString().slice(0, 10);
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...pages.map((p) => urlTag({ lastmod: today, ...p })),
    '</urlset>',
    '',
  ].join('\n');

  const robots = [
    '# Craft & Weft',
    'User-agent: *',
    'Allow: /',
    '',
    '# Private or single-use pages — nothing to index, and some carry tokens.',
    'Disallow: /cart',
    'Disallow: /checkout',
    'Disallow: /thank-you',
    'Disallow: /wishlist',
    'Disallow: /myaccount',
    'Disallow: /login',
    'Disallow: /register',
    'Disallow: /logout',
    'Disallow: /reset-password',
    'Disallow: /email-verification',
    'Disallow: /review/',
    'Disallow: /search',
    '',
    `Sitemap: ${SITE}/sitemap.xml`,
    '',
  ].join('\n');

  mkdirSync(resolve(root, 'public'), { recursive: true });
  writeFileSync(resolve(root, 'public/sitemap.xml'), xml, 'utf8');
  writeFileSync(resolve(root, 'public/robots.txt'), robots, 'utf8');

  console.log(`[sitemap] ${pages.length} urls — ${STATIC_PAGES.length} pages, ${categories} categories, ${products} products`);
};

main().catch((err) => {
  // Never break a deploy over a sitemap.
  console.warn(`[sitemap] not generated — ${err.message}`);
});
