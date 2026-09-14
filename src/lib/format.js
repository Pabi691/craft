const inr0 = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
const inr2 = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const toNumber = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

// ₹1,299 for whole amounts, ₹1,299.50 otherwise.
export const inr = (value) => {
  const n = toNumber(value);
  return Number.isInteger(Math.round(n * 100) / 100) ? inr0.format(n) : inr2.format(n);
};

export const inrExact = (value) => inr2.format(toNumber(value));

export const discountPercent = (regular, sale) => {
  const r = toNumber(regular);
  const s = toNumber(sale);
  if (!r || !s || s >= r) return 0;
  return Math.round(((r - s) / r) * 100);
};

export const formatDate = (value, opts = { day: '2-digit', month: 'short', year: 'numeric' }) => {
  if (!value) return '';
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? String(value) : d.toLocaleDateString('en-GB', opts);
};

export const formatDateTime = (value) => {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return `${d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })} · ${d
    .toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
    .toLowerCase()}`;
};

export const cleanTag = (v) => (v && v !== 'null' && v !== 'undefined' ? v : '');

// Lowest real price across a product and its variations — 0 means the piece
// has not been priced yet (drafts are created at ₹0 until the client sets one).
export const productPrice = (product) => {
  if (!product) return 0;
  const prices = [product.sale_price || product.regular_price, ...(product.product_variations || []).map((v) => v.sale_price || v.regular_price)]
    .map(toNumber)
    .filter((n) => n > 0);
  return prices.length ? Math.min(...prices) : 0;
};

export const isPriced = (product) => productPrice(product) > 0;

// "₹1,299", "From ₹249" when pack sizes differ, or "Price on request".
export const priceLabel = (product) => {
  const min = productPrice(product);
  if (!min) return 'Price on request';
  const variationPrices = new Set((product.product_variations || []).map((v) => toNumber(v.sale_price || v.regular_price)).filter((n) => n > 0));
  return variationPrices.size > 1 ? `From ${inr(min)}` : inr(min);
};
