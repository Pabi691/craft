import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { FiArrowRight, FiCheck, FiChevronRight, FiShoppingBag, FiTag, FiTrash2, FiTruck, FiX } from 'react-icons/fi';
import api from '../lib/api';
import { useGlobal } from '../context/GlobalContext';
import { useAuth } from '../context/AuthContext';
import { isDistributor } from '../lib/userRole';
import {
  COD_FEE,
  lineBrand,
  lineImage,
  lineKey,
  lineName,
  linePackInfo,
  lineSize,
  lineSlug,
  lineTotal,
  lineUnitPrice,
} from '../lib/cart';
import { inr } from '../lib/format';
import { EASE } from '../lib/motion';
import { confirmDialog } from '../lib/swal';
import { useWishlistAddToCart } from '../hooks/useWishlistAddToCart';
import Seo from '../components/Seo';
import SplitText from '../components/ui/SplitText';
import Reveal from '../components/ui/Reveal';
import Modal from '../components/ui/Modal';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';
import QuantityStepper from '../components/ui/QuantityStepper';
import SmartImage from '../components/ui/SmartImage';
import ProductRail from '../components/product/ProductRail';
import SizeSelectionPopup from '../components/product/SizeSelectionPopup';
import DistributorQuantityPopup from '../components/product/DistributorQuantityPopup';

function CartLine({ item, onQuantity, onRemove, busy, removing }) {
  const distributor = isDistributor();
  const { packQty, packPrice } = linePackInfo(item);
  const slug = lineSlug(item);
  const size = lineSize(item);
  const unit = lineUnitPrice(item);
  const total = lineTotal(item);
  const step = distributor && packQty > 0 ? packQty : 1;
  const min = step;
  const max = step * 10;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -30, transition: { duration: 0.3 } }}
      transition={{ duration: 0.5, ease: EASE }}
      className="relative flex gap-4 rounded-[1.5rem] border border-ink-900/5 bg-white/80 p-4 sm:gap-5 sm:p-5"
    >
      <Link to={slug ? `/p/${slug}` : '#'} className="shrink-0">
        <SmartImage src={lineImage(item)} alt={lineName(item)} className="h-28 w-24 rounded-2xl sm:h-32 sm:w-28" />
      </Link>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            {lineBrand(item) && <p className="truncate text-[10px] font-extrabold uppercase tracking-[0.18em] text-ink-400">{lineBrand(item)}</p>}
            <Link to={slug ? `/p/${slug}` : '#'} className="block">
              <h3 className="mt-0.5 line-clamp-2 font-display text-lg leading-snug text-ink-900">{lineName(item)}</h3>
            </Link>
          </div>
          <button
            onClick={() => onRemove(item)}
            disabled={removing}
            aria-label="Remove item"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-ink-400 transition-colors hover:bg-rose-50 hover:text-rose-500 disabled:opacity-40"
          >
            {removing ? <Spinner className="h-3.5 w-3.5" /> : <FiTrash2 size={15} />}
          </button>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-2">
          {size && <span className="chip bg-ink-900/[0.06] text-ink-700">Size {size}</span>}
          {distributor && packQty > 0 && packPrice > 0 && (
            <span className="chip bg-brand-100 text-brand-900">
              {inr(packPrice)} / pack of {packQty}
            </span>
          )}
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-ink-500">
            <FiTruck size={13} className="text-brand-700" /> Ships in 2–3 days
          </span>
        </div>

        <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
          <QuantityStepper
            size="sm"
            value={Number(item.quantity)}
            min={min}
            max={max}
            step={step}
            disabled={busy}
            onChange={(q) => onQuantity(item, q)}
          />
          <div className="text-right">
            <p className="font-display text-xl text-ink-900">{inr(total)}</p>
            {Number(item.quantity) > 1 && <p className="text-[11px] font-semibold text-ink-400">{inr(unit)} each</p>}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Cart() {
  const navigate = useNavigate();
  const { userToken } = useAuth();
  const { cart, cartLoading, cartCount, subtotal, totalMRP, savings, updateCartQuantity, removeCartItem, products, wishlist, wishlistLoading } = useGlobal();

  const [busyId, setBusyId] = useState(null);
  const [removingId, setRemovingId] = useState(null);
  const [couponOpen, setCouponOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [coupon, setCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [applying, setApplying] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  const wishlistActions = useWishlistAddToCart({ navigateOnSuccess: false });

  useEffect(() => {
    let alive = true;
    api
      .get('/api/v1/get_suggestion_coupons')
      .then(({ data }) => alive && data?.status && setSuggestions(data.coupons || []))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  const applyCoupon = useCallback(
    async (code) => {
      const value = String(code || '').trim();
      if (!value) return;
      setApplying(true);
      setCouponError('');
      try {
        const { data } = await api.post('/api/v1/validate_coupon', { coupon_code: value });
        if (!data?.status) {
          setCouponError(data?.message || 'That coupon is not valid.');
          return;
        }
        const c = data.data;
        if (subtotal < Number(c.minimum_order_value || 0)) {
          setCouponError(`Add ${inr(Number(c.minimum_order_value) - subtotal)} more to use this coupon.`);
          return;
        }
        setCoupon(c);
        setCouponCode(c.coupon_code);
        setCouponOpen(false);
        toast.success(`Coupon ${c.coupon_code} applied`);
      } catch {
        setCouponError('That coupon is not valid.');
      } finally {
        setApplying(false);
      }
    },
    [subtotal]
  );

  // Mirrors the backend: percentage coupons are capped by maximum_discount.
  const discount = useMemo(() => {
    if (!coupon) return 0;
    if (subtotal < Number(coupon.minimum_order_value || 0)) return 0;
    if (coupon.discount_type === 'Percentage') {
      const raw = (subtotal * Number(coupon.discount_value)) / 100;
      const cap = Number(coupon.maximum_discount || 0);
      return cap > 0 ? Math.min(raw, cap) : raw;
    }
    return Number(coupon.discount_value || 0);
  }, [coupon, subtotal]);

  const payable = Math.max(0, subtotal - discount);

  const handleQuantity = async (item, quantity) => {
    setBusyId(lineKey(item));
    try {
      await updateCartQuantity(item, quantity);
    } catch (err) {
      toast.error(err?.message || 'Could not update quantity.');
    } finally {
      setBusyId(null);
    }
  };

  const handleRemove = async (item) => {
    const ok = await confirmDialog({ title: 'Remove this piece?', text: 'It will be taken out of your bag.', confirmText: 'Yes, remove' });
    if (!ok) return;
    setRemovingId(lineKey(item));
    try {
      await removeCartItem(item);
      toast('Removed from your bag');
    } catch {
      toast.error('Could not remove that item.');
    } finally {
      setRemovingId(null);
    }
  };

  const proceed = () => {
    if (!userToken) {
      navigate('/login', { state: { slug: '/cart' } });
      return;
    }
    navigate('/checkout', { state: { discount, couponCode: coupon?.coupon_code || null } });
  };

  const cartProductIds = cart.map((i) => i.product_id ?? i.id);
  const alsoLike = products.filter((p) => !cartProductIds.includes(p.id)).slice(0, 8);

  return (
    <>
      <Seo title="Your bag" />

      <section className="container-x pb-24 pt-10 md:pt-14">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="eyebrow">Your bag</p>
            <SplitText as="h1" inView={false} text="The *bag*" className="h-display mt-4 text-5xl text-ink-900 md:text-7xl" />
          </div>
          {cartCount > 0 && (
            <p className="hidden text-sm font-semibold text-ink-500 sm:block">
              {cartCount} item{cartCount > 1 ? 's' : ''}
            </p>
          )}
        </div>

        {cartLoading ? (
          <div className="mt-12 grid gap-8 lg:grid-cols-12">
            <div className="space-y-4 lg:col-span-7">
              {[0, 1, 2].map((i) => (
                <div key={i} className="skeleton h-40 rounded-[1.5rem]" />
              ))}
            </div>
            <div className="lg:col-span-5">
              <div className="skeleton h-80 rounded-[1.75rem]" />
            </div>
          </div>
        ) : cart.length === 0 ? (
          <div className="mt-12">
            <EmptyState
              icon={FiShoppingBag}
              title="Your bag is still empty."
              text="Handwoven bags, purses and home pieces are waiting to be discovered."
              action={
                <Link to="/products" className="btn-primary">
                  Start exploring <FiArrowRight />
                </Link>
              }
            />
          </div>
        ) : (
          <div className="mt-12 grid gap-8 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-7">
              {savings > 0 && (
                <Reveal className="mb-5 flex items-center gap-3 rounded-2xl bg-brand-100 px-5 py-4 text-sm font-bold text-brand-900">
                  <FiCheck className="shrink-0" /> You're saving {inr(savings)} on this order
                </Reveal>
              )}
              <motion.div layout className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {cart.filter(Boolean).map((item) => (
                    <CartLine
                      key={lineKey(item)}
                      item={item}
                      onQuantity={handleQuantity}
                      onRemove={handleRemove}
                      busy={busyId === lineKey(item)}
                      removing={removingId === lineKey(item)}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>

              <Link to="/products" className="mt-6 inline-flex items-center gap-2 text-sm font-extrabold text-ink-900">
                <span className="link-underline">Continue shopping</span> <FiArrowRight />
              </Link>
            </div>

            <div className="lg:col-span-5">
              <div className="space-y-4 lg:sticky lg:top-[calc(var(--nav-h)+1.5rem)]">
                <button
                  onClick={() => setCouponOpen(true)}
                  className="flex w-full items-center justify-between gap-4 rounded-[1.5rem] border border-ink-900/5 bg-white/80 p-5 text-left transition-colors hover:border-ink-900/20"
                >
                  <span className="flex items-center gap-3">
                    <span className="grid h-11 w-11 place-items-center rounded-2xl bg-accent-soft text-accent">
                      <FiTag size={17} />
                    </span>
                    <span>
                      <span className="block text-sm font-extrabold text-ink-900">{coupon ? `Coupon ${coupon.coupon_code} applied` : 'Apply a coupon'}</span>
                      <span className="block text-xs text-ink-400">{coupon ? `You saved ${inr(discount)}` : 'Offers and gift codes'}</span>
                    </span>
                  </span>
                  <FiChevronRight className="text-ink-400" />
                </button>

                <div className="rounded-[1.75rem] border border-ink-900/5 bg-white/85 p-6 shadow-soft">
                  <p className="label">Price summary</p>
                  <dl className="mt-4 space-y-3 text-sm">
                    <div className="flex justify-between text-ink-600">
                      <dt>Total MRP</dt>
                      <dd className="font-semibold text-ink-900">{inr(totalMRP)}</dd>
                    </div>
                    {savings > 0 && (
                      <div className="flex justify-between text-ink-600">
                        <dt>Bag discount</dt>
                        <dd className="font-semibold text-brand-800">−{inr(savings)}</dd>
                      </div>
                    )}
                    {discount > 0 && (
                      <div className="flex justify-between text-ink-600">
                        <dt>Coupon ({coupon.coupon_code})</dt>
                        <dd className="font-semibold text-brand-800">−{inr(discount)}</dd>
                      </div>
                    )}
                    <div className="flex justify-between text-ink-600">
                      <dt>Delivery</dt>
                      <dd className="font-semibold text-brand-800">Free</dd>
                    </div>
                  </dl>

                  <div className="mt-5 flex items-end justify-between border-t border-dashed border-ink-900/15 pt-5">
                    <span className="font-extrabold text-ink-900">Total</span>
                    <span className="font-display text-3xl text-ink-900">{inr(payable)}</span>
                  </div>
                  <p className="mt-1 text-right text-[11px] text-ink-400">Cash on delivery adds {inr(COD_FEE)}</p>

                  <button onClick={proceed} className="btn-primary mt-6 w-full py-4">
                    {userToken ? 'Proceed to checkout' : 'Log in to checkout'} <FiArrowRight />
                  </button>
                  {!userToken && <p className="mt-3 text-center text-xs text-ink-400">Your bag comes with you when you log in.</p>}
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {userToken && !wishlistLoading && wishlist.length > 0 && (
        <section className="container-x pb-20">
          <p className="eyebrow">Saved for later</p>
          <div className="no-scrollbar mt-6 flex gap-4 overflow-x-auto pb-2">
            {wishlist.map((item) => {
              const product = item.product || item;
              return (
                <div key={item.id} className="w-56 shrink-0 rounded-[1.5rem] border border-ink-900/5 bg-white/80 p-3">
                  <Link to={`/p/${product.slug}`}>
                    <SmartImage src={product.primary_img} alt={product.prod_name} className="aspect-[4/5] rounded-2xl" />
                  </Link>
                  <p className="mt-3 truncate text-sm font-bold text-ink-900">{product.prod_name}</p>
                  <p className="text-xs font-semibold text-ink-500">{inr(product.sale_price)}</p>
                  <button
                    onClick={() => wishlistActions.handleAddToCartClick(item)}
                    disabled={wishlistActions.addingId === item.id}
                    className="btn-outline btn-sm mt-3 w-full"
                  >
                    {wishlistActions.addingId === item.id ? <Spinner className="h-3.5 w-3.5" /> : <FiShoppingBag size={13} />} Move to bag
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {cart.length > 0 && alsoLike.length > 0 && <ProductRail eyebrow="Complete the set" title="You may also *like*" products={alsoLike} className="pb-20" />}

      <Modal open={couponOpen} onClose={() => setCouponOpen(false)} title="Coupons & offers" size="md">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            applyCoupon(couponCode);
          }}
          className="flex gap-2"
        >
          <input
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
            placeholder="Enter coupon code"
            className="input flex-1"
          />
          <button type="submit" disabled={applying} className="btn-dark px-6">
            {applying ? <Spinner light /> : 'Apply'}
          </button>
        </form>
        {couponError && <p className="mt-3 text-sm font-semibold text-rose-600">{couponError}</p>}

        {coupon && (
          <button
            onClick={() => {
              setCoupon(null);
              setCouponCode('');
              toast('Coupon removed');
            }}
            className="mt-4 inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-ink-500"
          >
            <FiX /> Remove applied coupon
          </button>
        )}

        <div className="mt-8">
          <p className="label">Available offers</p>
          {suggestions.length ? (
            <div className="mt-3 space-y-2.5">
              {suggestions.map((c) => (
                <button
                  key={c.id}
                  onClick={() => applyCoupon(c.coupon_code)}
                  className="flex w-full items-center justify-between gap-4 rounded-2xl border border-dashed border-ink-900/20 p-4 text-left transition-colors hover:border-ink-900"
                >
                  <span>
                    <span className="block text-sm font-extrabold text-ink-900">{c.coupon_code}</span>
                    <span className="block text-xs text-ink-500">
                      {c.description || (c.discount_type === 'Percentage' ? `${c.discount_value}% off` : `${inr(c.discount_value)} off`)}
                      {c.minimum_order_value ? ` · min ${inr(c.minimum_order_value)}` : ''}
                    </span>
                  </span>
                  <span className="chip bg-brand-500 py-1.5 text-brand-on">Apply</span>
                </button>
              ))}
            </div>
          ) : (
            <p className="mt-3 rounded-2xl bg-paper-200/70 p-4 text-sm text-ink-500">No public offers right now — have a code? Enter it above.</p>
          )}
        </div>
      </Modal>

      <SizeSelectionPopup
        open={wishlistActions.isSizePopupOpen}
        sizeOptions={wishlistActions.sizeOptions}
        selectedVariation={wishlistActions.selectedVariation}
        onSelect={wishlistActions.setSelectedVariation}
        onClose={wishlistActions.closeSizePopup}
        onConfirm={wishlistActions.confirmSize}
      />
      <DistributorQuantityPopup
        open={wishlistActions.isQtyPopupOpen}
        packQty={wishlistActions.getItemPackQty(wishlistActions.currentItem, wishlistActions.selectedVariation)}
        quantities={wishlistActions.popupQuantities}
        selectedQuantity={wishlistActions.selectedQuantity}
        onSelect={wishlistActions.setSelectedQuantity}
        onClose={wishlistActions.closeQtyPopup}
        onConfirm={wishlistActions.confirmQuantity}
      />
    </>
  );
}
