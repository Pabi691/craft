import { TEA_SLUGS } from './categories';

// Tea is sold in a minimum of 100 g. A 50 g pouch therefore goes into the bag
// in twos, a 100 g (or larger) pouch singly. Every place that sets a quantity
// for a tea line — the product page, the cart, the server check on order
// creation — asks this module rather than doing the arithmetic itself.
export const MIN_TEA_GRAMS = 100;

export const isTeaProduct = (product) =>
  (product?.product_categories || []).some((c) => TEA_SLUGS.includes(c?.slug));

// "50 g", "250g", "100 G" → 50 / 250 / 100. A size that is not a weight —
// "M", "32 in", a pack of 6 — returns null and is left alone.
export const packGrams = (size) => {
  const match = String(size ?? '')
    .trim()
    .match(/^(\d+(?:\.\d+)?)\s*g(?:ram|rams)?$/i);
  return match ? Number(match[1]) : null;
};

export const minUnitsForPack = (grams) =>
  grams && grams > 0 ? Math.max(1, Math.ceil(MIN_TEA_GRAMS / grams)) : 1;

// The smallest quantity this product may be bought in at the chosen size.
export const minQtyFor = (product, variation) =>
  isTeaProduct(product) ? minUnitsForPack(packGrams(variation?.size)) : 1;

// "Minimum order 100 g — 50 g packs are added in twos." Null when the rule
// does not change anything for this size, so callers can skip the line.
export const minQtyNote = (variation, minQty) => {
  if (!minQty || minQty < 2) return null;
  const grams = packGrams(variation?.size);
  return `Minimum order ${MIN_TEA_GRAMS} g — ${grams} g packs are added in ${minQty === 2 ? 'twos' : `${minQty}s`}.`;
};
