import api from './api';

// Dynamic brand colour. The CRM (Theme Settings) stores one hex; this derives
// a full 50–950 scale plus a readable "on" colour and writes them as CSS
// custom properties that tailwind.config.js maps to `brand-*` utilities.

export const DEFAULT_BRAND = '#93C572'; // pista green

const HEX = /^#[0-9A-Fa-f]{6}$/;
const VARS_KEY = 'cw_brand_vars';
const HEX_KEY = 'cw_brand_color';

const WHITE = { r: 255, g: 255, b: 255 };
const INK = { r: 14, g: 17, b: 12 }; // warm olive-black keeps dark shades earthy

// [target, amount] — the chosen colour is shade 500.
const STEPS = {
  50: [WHITE, 0.92], 100: [WHITE, 0.82], 200: [WHITE, 0.64], 300: [WHITE, 0.42], 400: [WHITE, 0.2],
  500: null,
  600: [INK, 0.16], 700: [INK, 0.34], 800: [INK, 0.52], 900: [INK, 0.68], 950: [INK, 0.8],
};

const hexToRgb = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
};

const mix = (a, b, t) => ({
  r: Math.round(a.r + (b.r - a.r) * t),
  g: Math.round(a.g + (b.g - a.g) * t),
  b: Math.round(a.b + (b.b - a.b) * t),
});

const luminance = ({ r, g, b }) => {
  const lin = (c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
};

const triple = ({ r, g, b }) => `${r} ${g} ${b}`;

export function buildBrandVars(hex) {
  const base = hexToRgb(hex);
  const vars = {};
  Object.entries(STEPS).forEach(([step, rule]) => {
    vars[`--brand-${step}`] = triple(rule ? mix(base, rule[0], rule[1]) : base);
  });
  // Pick whichever of near-white / deep-ink reads better on the brand colour.
  const L = luminance(base);
  const inkL = luminance({ r: 23, g: 27, b: 20 });
  const onWhite = 1.05 / (L + 0.05);
  const onInk = (L + 0.05) / (inkL + 0.05);
  vars['--brand-on'] = onInk >= onWhite ? '23 27 20' : '255 255 255';
  return vars;
}

export function applyBrandColor(hex) {
  if (!HEX.test(hex || '')) return;
  const vars = buildBrandVars(hex);
  const root = document.documentElement;
  Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v));
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', hex);
  try {
    localStorage.setItem(VARS_KEY, JSON.stringify(vars));
    localStorage.setItem(HEX_KEY, hex.toUpperCase());
  } catch {
    // storage full / blocked — the colour still applies for this visit
  }
}

export const getBrandColor = () => {
  try {
    return localStorage.getItem(HEX_KEY) || DEFAULT_BRAND;
  } catch {
    return DEFAULT_BRAND;
  }
};

export async function syncBrandColorFromServer() {
  try {
    const res = await api.get('/api/v1/theme_settings');
    const hex = res?.data?.data?.primary_color;
    if (HEX.test(hex || '') && hex.toUpperCase() !== getBrandColor().toUpperCase()) {
      applyBrandColor(hex);
    }
  } catch {
    // endpoint unreachable — keep the cached / default colour
  }
}

// Re-check whenever the tab regains focus, so a colour saved in the CRM shows
// up on an open storefront without a reload.
export function watchBrandColor() {
  syncBrandColorFromServer();
  const onVisible = () => document.visibilityState === 'visible' && syncBrandColorFromServer();
  document.addEventListener('visibilitychange', onVisible);
  return () => document.removeEventListener('visibilitychange', onVisible);
}
