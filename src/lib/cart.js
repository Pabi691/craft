import { isDistributor } from './userRole';
import { toNumber } from './format';

// A cart line is either a server row (GET get_customer_cart: product fields
// joined in, plus `product` / `product_variation` relations) or, for guests,
// a product object saved in localStorage with quantity/price/prod_variation_id.
// These helpers read both shapes the same way so Cart, Checkout and the
// header badge always agree on prices.

export const COD_FEE = 20;

export const lineProduct = (item) => item?.product || item || {};

export const lineVariation = (item) => {
  if (item?.product_variation) return item.product_variation;
  const list = item?.product_variations || item?.product?.product_variations;
  if (Array.isArray(list) && item?.prod_variation_id) {
    return list.find((v) => v.id === item.prod_variation_id) || null;
  }
  return null;
};

export const linePackInfo = (item) => {
  const v = lineVariation(item);
  const p = lineProduct(item);
  return {
    packQty: toNumber(v?.pack_qty || item?.pack_qty || p?.pack_qty),
    packPrice: toNumber(v?.pack_price || item?.pack_price || p?.pack_price),
  };
};

// Distributors pay the pack rate (pack_price / pack_qty per piece); everyone
// else pays the variation's sale price when one is chosen, else the product's.
export const lineUnitPrice = (item) => {
  if (isDistributor()) {
    const { packQty, packPrice } = linePackInfo(item);
    if (packQty > 0 && packPrice > 0) return packPrice / packQty;
  }
  const v = lineVariation(item);
  return toNumber(v?.sale_price ?? item?.price ?? item?.sale_price ?? lineProduct(item)?.sale_price);
};

export const lineRegularPrice = (item) => {
  if (isDistributor()) return lineUnitPrice(item);
  const v = lineVariation(item);
  return toNumber(v?.regular_price ?? item?.regular_price ?? lineProduct(item)?.regular_price) || lineUnitPrice(item);
};

export const lineTotal = (item) => {
  const qty = toNumber(item?.quantity);
  if (isDistributor()) {
    const { packQty, packPrice } = linePackInfo(item);
    if (packQty > 0 && packPrice > 0) return (qty / packQty) * packPrice;
  }
  return lineUnitPrice(item) * qty;
};

export const lineName = (item) => item?.prod_name || lineProduct(item)?.prod_name || 'Product';
export const lineImage = (item) => item?.primary_img || lineProduct(item)?.primary_img || '';
export const lineSlug = (item) => item?.slug || item?.product?.slug || '';
export const lineBrand = (item) => item?.product?.brand_details?.brand_name || item?.brand_details?.brand_name || '';
export const lineSize = (item) => lineVariation(item)?.size || null;
export const lineIsCod = (item) => Number(lineProduct(item)?.is_cod ?? 1) === 1;

// Guest lines have no cart-row id, so identify them by product + variation.
export const lineKey = (item) =>
  item?.customer_id !== undefined || item?.product
    ? `row-${item.id}`
    : `local-${item.product_id ?? item.id}-${item.prod_variation_id ?? 'none'}`;

export const sameLocalLine = (a, b) =>
  (a.product_id ?? a.id) === (b.product_id ?? b.id) && (a.prod_variation_id ?? null) === (b.prod_variation_id ?? null);

export const summarize = (items) => {
  const list = Array.isArray(items) ? items.filter(Boolean) : [];
  const subtotal = list.reduce((sum, i) => sum + lineTotal(i), 0);
  const totalMRP = isDistributor()
    ? subtotal
    : list.reduce((sum, i) => sum + lineRegularPrice(i) * toNumber(i.quantity), 0);
  return {
    subtotal,
    totalAmount: subtotal,
    totalMRP,
    savings: Math.max(0, totalMRP - subtotal),
    count: list.reduce((sum, i) => sum + toNumber(i.quantity), 0),
  };
};

// Same default-variation rules as the reference GlobalContext.
export const getDefaultVariationId = (product) => {
  const variations = product?.product_variations || [];
  if (!variations.length) return null;
  if (isDistributor()) {
    const withPack = variations.find((v) => v?.pack_price != null && v?.pack_qty != null);
    return (withPack || variations[0])?.id ?? null;
  }
  const inStock = variations.find((v) => v?.size_id !== null && v?.stock_qty !== 0);
  const withSize = variations.find((v) => v?.size_id !== null);
  return (inStock || withSize || variations[0])?.id ?? null;
};

export const productPackInfo = (product) => {
  const variation = product?.product_variations?.find((v) => v?.pack_price != null && v?.pack_qty != null);
  return {
    packPrice: variation?.pack_price ?? product?.pack_price,
    packQty: variation?.pack_qty ?? product?.pack_qty,
  };
};

export const apiError = (data, fallback = 'Something went wrong. Please try again.') => {
  const e = data?.error_message ?? data?.message;
  if (!e) return fallback;
  if (typeof e === 'string') return e;
  const first = Object.values(e)[0];
  return Array.isArray(first) ? first[0] : String(first || fallback);
};
