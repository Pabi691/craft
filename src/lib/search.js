// Client-side product search over the catalogue already in memory.
// Every term must match somewhere; names rank above descriptions.
export function searchProducts(products, query) {
  const q = String(query || '').trim().toLowerCase();
  if (!q) return [];
  const terms = q.split(/\s+/);

  return products
    .map((p) => {
      const name = (p.prod_name || '').toLowerCase();
      const cats = (p.product_categories || []).map((c) => c.category_name).join(' ');
      const hay = [name, p.product_tag, p.product_quality, cats, p.prod_desc].filter(Boolean).join(' ').toLowerCase();
      if (!terms.every((t) => hay.includes(t))) return null;
      const score =
        (name.startsWith(q) ? 5 : 0) + (name.includes(q) ? 3 : 0) + terms.filter((t) => name.includes(t)).length * 2 + (cats.toLowerCase().includes(q) ? 1 : 0);
      return { p, score };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score)
    .map((r) => r.p);
}

export const POPULAR_SEARCHES = ['Khesh', 'Bags', 'Purse', 'Botua', 'Cushion', 'Table mat'];
