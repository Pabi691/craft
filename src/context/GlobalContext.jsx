import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import api from '../lib/api';
import { ENV } from '../config/env';
import { useAuth } from './AuthContext';
import { isDistributor } from '../lib/userRole';
import { sessionCache } from '../lib/cache';
import { apiError, getDefaultVariationId, linePackInfo, lineUnitPrice, sameLocalLine, summarize } from '../lib/cart';

const GlobalContext = createContext(null);
export const useGlobal = () => useContext(GlobalContext);

const readLocalCart = () => {
  try {
    const items = JSON.parse(localStorage.getItem('localCart') || '[]');
    return Array.isArray(items) ? items : [];
  } catch {
    return [];
  }
};

const writeLocalCart = (items) => {
  if (items.length) localStorage.setItem('localCart', JSON.stringify(items));
  else localStorage.removeItem('localCart');
};

const bearer = (token) => ({ headers: { Authorization: `Bearer ${token}` } });

export function GlobalProvider({ children }) {
  const { userToken } = useAuth();
  const token = userToken || ENV.WEB_TOKEN;

  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [categories, setCategories] = useState(() => sessionCache.get('cw_categories', []));
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [cartLoading, setCartLoading] = useState(true);
  const [wishlist, setWishlist] = useState([]);
  const [wishlistLoading, setWishlistLoading] = useState(true);
  const [cartPulse, setCartPulse] = useState(0); // bumps the header bag badge

  // ---- Catalogue -------------------------------------------------------

  const fetchProducts = useCallback(async () => {
    try {
      const { data } = await api.get('/api/v1/get_active_products');
      if (data?.status) setProducts(data.products || []);
    } catch (err) {
      console.error('Fetch products error:', err);
    } finally {
      setProductsLoading(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const { data } = await api.get('/api/v1/categories');
      if (data?.status) {
        setCategories(data.category_list || []);
        sessionCache.set('cw_categories', data.category_list || []);
      }
    } catch (err) {
      console.error('Category fetch error:', err);
    } finally {
      setCategoriesLoading(false);
    }
  }, []);

  // Top-level categories with their children and live product counts —
  // drives the mega menu, footer and "Shop by category".
  const categoryTree = useMemo(() => {
    const childIds = new Set();
    categories.forEach((c) => (c.child_categories || []).forEach((ch) => childIds.add(ch.id)));
    const byId = new Map(categories.map((c) => [c.id, c]));
    const counts = {};
    products.forEach((p) => (p.product_categories || []).forEach((c) => { counts[c.id] = (counts[c.id] || 0) + 1; }));
    const decorate = (c) => ({ ...c, product_count: counts[c.id] || 0 });
    return categories
      .filter((c) => !childIds.has(c.id))
      .map((c) => ({
        ...decorate(c),
        children: (c.child_categories || []).map((ch) => decorate(byId.get(ch.id) || ch)),
      }));
  }, [categories, products]);

  // ---- Cart ------------------------------------------------------------

  const mergeLocalCartWithServer = useCallback(async (userTok) => {
    const localCart = readLocalCart();
    if (!localCart.length) return;
    if (isDistributor()) {
      localStorage.removeItem('localCart');
      return;
    }
    try {
      for (const item of localCart) {
        await api.post(
          '/api/v1/add_to_cart',
          {
            product_id: item.product_id ?? item.id,
            prod_variation_id: item.prod_variation_id ?? null,
            quantity: item.quantity || 1,
            price: item.price ?? item.sale_price,
          },
          bearer(userTok)
        );
      }
      localStorage.removeItem('localCart');
    } catch (err) {
      console.error('Merge cart error:', err);
    }
  }, []);

  const fetchCart = useCallback(async () => {
    const userTok = localStorage.getItem('userToken');
    try {
      if (!userTok) {
        if (isDistributor()) {
          localStorage.removeItem('localCart');
          setCart([]);
          return;
        }
        setCart(readLocalCart());
        return;
      }
      await mergeLocalCartWithServer(userTok);
      const { data } = await api.get('/api/v1/get_customer_cart', bearer(userTok));
      const items = data?.cart_items || [];
      setCart(
        isDistributor()
          ? items.map((item) => {
              const { packQty, packPrice } = linePackInfo(item);
              const unit = packQty > 0 && packPrice > 0 ? packPrice / packQty : Number(item.price ?? item.sale_price ?? 0);
              return { ...item, price: unit };
            })
          : items
      );
    } catch (err) {
      console.error('Fetch cart error:', err);
    } finally {
      setCartLoading(false);
    }
  }, [mergeLocalCartWithServer]);

  /**
   * Adds a product (optionally a specific variation) to the bag.
   * Resolves to { ok, message }.
   */
  const addToCart = useCallback(
    async (product, selectedVariationId, qtyToAdd) => {
      if (!product?.id) return { ok: false, message: 'Invalid product.' };

      const resolvedVariationId = selectedVariationId || getDefaultVariationId(product);
      const variation = product.product_variations?.find((v) => v.id === resolvedVariationId) || null;
      const distributor = isDistributor();
      // Variation pack pricing first, then the product's own base pack pricing.
      const packQty = Number(variation?.pack_qty || product?.pack_qty || 0);
      const packPrice = Number(variation?.pack_price || product?.pack_price || 0);

      const quantity = distributor
        ? Number(qtyToAdd) || (packQty > 0 ? packQty : 1)
        : Math.max(1, Number(qtyToAdd) || 1);

      const price = distributor
        ? packQty > 0 && packPrice > 0
          ? packPrice / packQty
          : Number(variation?.sale_price || product.sale_price || 0)
        : Number(variation?.sale_price || product.sale_price || 0);

      // Drafts are created at ₹0 until priced in the CRM — never sell them for free.
      if (!(price > 0)) return { ok: false, message: 'This piece is priced on request — message us on WhatsApp.' };

      const userTok = localStorage.getItem('userToken');
      if (userTok) {
        try {
          const { data } = await api.post(
            '/api/v1/add_to_cart',
            { product_id: product.id, prod_variation_id: resolvedVariationId, quantity, price },
            bearer(userTok)
          );
          if (!data?.status) return { ok: false, message: apiError(data, 'Could not add this item.') };
          await fetchCart();
          setCartPulse((n) => n + 1);
          return { ok: true };
        } catch (err) {
          return { ok: false, message: apiError(err?.response?.data, 'Could not add this item.') };
        }
      }

      if (distributor) return { ok: false, message: 'Please log in to order as a distributor.' };

      const localCart = readLocalCart();
      const line = { product_id: product.id, prod_variation_id: resolvedVariationId };
      const exists = localCart.find((i) => sameLocalLine(i, line));
      const next = exists
        ? localCart.map((i) => (sameLocalLine(i, line) ? { ...i, quantity: i.quantity + quantity, price } : i))
        : [...localCart, { ...product, quantity, price, prod_variation_id: resolvedVariationId, product_id: product.id }];
      writeLocalCart(next);
      setCart(next);
      setCartPulse((n) => n + 1);
      return { ok: true };
    },
    [fetchCart]
  );

  const updateCartQuantity = useCallback(async (item, quantity) => {
    const price = lineUnitPrice(item);
    const userTok = localStorage.getItem('userToken');
    if (userTok) {
      const { data } = await api.post(
        '/api/v1/update_to_cart',
        { product_id: item.product_id, prod_variation_id: item.prod_variation_id, quantity, price },
        bearer(userTok)
      );
      if (!data?.status) throw new Error(apiError(data, 'Could not update quantity.'));
      setCart((prev) => prev.map((i) => (i.id === item.id ? { ...i, quantity, ...(isDistributor() ? { price } : {}) } : i)));
      return;
    }
    const next = readLocalCart().map((i) => (sameLocalLine(i, item) ? { ...i, quantity, price } : i));
    writeLocalCart(next);
    setCart(next);
  }, []);

  const removeCartItem = useCallback(async (item) => {
    const userTok = localStorage.getItem('userToken');
    if (userTok) {
      const { data } = await api.get(`/api/v1/delete_cart_item/${item.id}`, bearer(userTok));
      if (data?.status) setCart((prev) => prev.filter((i) => i.id !== item.id));
      return !!data?.status;
    }
    const next = readLocalCart().filter((i) => !sameLocalLine(i, item));
    writeLocalCart(next);
    setCart(next);
    return true;
  }, []);

  // ---- Wishlist --------------------------------------------------------

  const fetchWishlist = useCallback(async () => {
    const userTok = localStorage.getItem('userToken');
    if (!userTok) {
      setWishlist([]);
      setWishlistLoading(false);
      return;
    }
    try {
      const { data } = await api.get('/api/v1/get_customer_wishlist', bearer(userTok));
      if (data?.status) setWishlist(data.wishlist || []);
    } catch (err) {
      console.error('Fetch wishlist error:', err);
    } finally {
      setWishlistLoading(false);
    }
  }, []);

  const isInWishlist = useCallback((productId) => wishlist.some((w) => w.product_id === productId), [wishlist]);

  /** Resolves to { needsLogin } | { added: boolean }. */
  const toggleWishlist = useCallback(
    async (product) => {
      const userTok = localStorage.getItem('userToken');
      if (!userTok) return { needsLogin: true };

      const existing = wishlist.find((w) => w.product_id === product.id);
      if (existing) {
        await api.get(`/api/v1/delete_wishlist_item/${existing.id}`, bearer(userTok));
        setWishlist((prev) => prev.filter((w) => w.id !== existing.id));
        return { added: false };
      }

      const { data } = await api.post(
        '/api/v1/add_to_wishlist',
        { product_id: product.id, quantity: 1, prod_variation_id: product.prod_variation_id ?? null },
        bearer(userTok)
      );
      // Keep the real wishlist row id so a later "remove" deletes the right row.
      if (data?.status && data.wishlist_item) setWishlist((prev) => [...prev, { ...data.wishlist_item, product }]);
      else await fetchWishlist();
      return { added: true };
    },
    [wishlist, fetchWishlist]
  );

  // ---- Lifecycle -------------------------------------------------------

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  // Re-read cart & wishlist whenever the signed-in customer changes.
  useEffect(() => {
    setCartLoading(true);
    setWishlistLoading(true);
    fetchCart();
    fetchWishlist();
  }, [userToken, fetchCart, fetchWishlist]);

  const summary = useMemo(() => summarize(cart), [cart]);

  const value = {
    token,
    products,
    productsLoading,
    categories,
    categoryTree,
    categoriesLoading,
    cart,
    setCart,
    cartLoading,
    cartLength: cart.length,
    cartCount: summary.count,
    cartPulse,
    fetchCart,
    addToCart,
    updateCartQuantity,
    removeCartItem,
    mergeLocalCartWithServer,
    wishlist,
    setWishlist,
    wishlistLoading,
    fetchWishlist,
    isInWishlist,
    toggleWishlist,
    totalMRP: summary.totalMRP,
    subtotal: summary.subtotal,
    savings: summary.savings,
    totalAmount: summary.totalAmount,
  };

  return <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>;
}
