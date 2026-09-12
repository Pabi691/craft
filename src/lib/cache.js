// Tiny sessionStorage wrapper — never throws (private mode / quota).
export const sessionCache = {
  get(key, fallback = null) {
    try {
      const raw = sessionStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
    } catch {
      // ignore
    }
  },
  remove(key) {
    try {
      sessionStorage.removeItem(key);
    } catch {
      // ignore
    }
  },
};

const RECENT_KEY = 'cw_recently_viewed';

export const recentlyViewed = {
  list: () => sessionCache.get(RECENT_KEY, []),
  find: (slug) => sessionCache.get(RECENT_KEY, []).find((p) => p.slug === slug) || null,
  add(product) {
    if (!product?.slug) return;
    const next = [product, ...sessionCache.get(RECENT_KEY, []).filter((p) => p.slug !== product.slug)].slice(0, 12);
    sessionCache.set(RECENT_KEY, next);
  },
};
