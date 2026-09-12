import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'react-toastify';
import {
  FiAlertCircle,
  FiCheck,
  FiCreditCard,
  FiEdit2,
  FiLock,
  FiMapPin,
  FiPackage,
  FiPlus,
  FiRefreshCw,
  FiShield,
  FiTruck,
} from 'react-icons/fi';
import api from '../lib/api';
import { ENV } from '../config/env';
import { useGlobal } from '../context/GlobalContext';
import { useAuth } from '../context/AuthContext';
import { isDistributor } from '../lib/userRole';
import { COD_FEE, apiError, lineImage, lineIsCod, lineName, lineTotal, lineUnitPrice, summarize } from '../lib/cart';
import { inr } from '../lib/format';
import { getBrandColor } from '../lib/theme';
import { EASE } from '../lib/motion';
import { alertDialog } from '../lib/swal';
import Seo from '../components/Seo';
import SplitText from '../components/ui/SplitText';
import Spinner from '../components/ui/Spinner';
import SmartImage from '../components/ui/SmartImage';

const loadRazorpay = () => {
  if (window.Razorpay) return Promise.resolve(true);
  return new Promise((resolve) => {
    const s = document.createElement('script');
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
};

function Step({ n, title, children, done }) {
  return (
    <section className="rounded-[1.75rem] border border-ink-900/5 bg-white/85 p-6 shadow-soft md:p-7">
      <div className="mb-5 flex items-center gap-3">
        <span className={`grid h-8 w-8 place-items-center rounded-full text-xs font-extrabold ${done ? 'bg-brand-500 text-brand-on' : 'bg-ink-900 text-paper'}`}>
          {done ? <FiCheck size={14} /> : n}
        </span>
        <h2 className="font-display text-2xl text-ink-900">{title}</h2>
      </div>
      {children}
    </section>
  );
}

export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { userToken } = useAuth();
  const { fetchCart } = useGlobal();

  const discount = Number(location.state?.discount || 0);
  const couponCode = location.state?.couponCode || null;

  const [items, setItems] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [methods, setMethods] = useState([]);
  const [method, setMethod] = useState(ENV.RAZORPAY_KEY ? 'online' : 'cod');
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [addressError, setAddressError] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);

  useEffect(() => {
    const verified = localStorage.getItem('uservarified');
    if (verified === 'null') setNeedsVerification(true);
  }, []);

  useEffect(() => {
    if (!userToken) navigate('/login', { replace: true, state: { slug: '/checkout' } });
  }, [userToken, navigate]);

  const load = useCallback(async () => {
    try {
      const [cartRes, addrRes, payRes] = await Promise.all([
        api.get('/api/v1/get_customer_cart'),
        api.get('/api/v1/get_customer_shipping_addresses'),
        api.get('/api/v1/get_payment_mothods'),
      ]);

      const cartItems = cartRes.data?.cart_items || [];
      if (!cartItems.length) {
        navigate('/cart', { replace: true });
        return;
      }
      setItems(
        isDistributor()
          ? cartItems.map((item) => ({ ...item, price: lineUnitPrice(item) }))
          : cartItems
      );

      const list = addrRes.data?.shipping_addresses || [];
      setAddresses(list);
      setSelectedAddress(list.find((a) => Number(a.is_default) === 1) || list[0] || null);

      if (payRes.data?.status) setMethods(payRes.data.payment_methods || []);
    } catch (err) {
      toast.error('Could not load your checkout. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    if (userToken) load();
  }, [userToken, load]);

  const { subtotal, totalMRP, savings } = useMemo(() => summarize(items), [items]);
  const codAllowed = items.length === 0 || items.every(lineIsCod);
  const onlineAllowed = !!ENV.RAZORPAY_KEY;

  useEffect(() => {
    if (!codAllowed && method === 'cod' && onlineAllowed) setMethod('online');
    if (!onlineAllowed && method === 'online') setMethod('cod');
  }, [codAllowed, onlineAllowed, method]);

  const isCod = method === 'cod';
  const net = Math.max(0, subtotal - discount);
  const shipping = isCod ? COD_FEE : 0;
  const payable = net + shipping;
  const payAmt = Math.round(payable);
  const roundOff = Number(Math.abs(payAmt - payable).toFixed(2));

  const resendVerification = async () => {
    setResending(true);
    try {
      const { data } = await api.get('/api/v1/resend_email_verification');
      if (data?.status) setResent(true);
      else toast.error(data?.message || 'Could not send the email.');
    } catch {
      toast.error('Could not send the email.');
    } finally {
      setResending(false);
    }
  };

  const recordPayment = (orderId, payload) => api.post('/api/v1/add_order_payment', { order_id: orderId, ...payload }).catch(() => {});
  const cancelOrder = (orderId) => api.get(`/api/v1/order_cancel_by_customer/${orderId}`).catch(() => {});

  const payWithRazorpay = async (orderId) => {
    const ready = await loadRazorpay();
    if (!ready) {
      await alertDialog({ title: 'Payment gateway unavailable', text: 'Please check your connection and try again.', icon: 'error' });
      return;
    }

    const rzp = new window.Razorpay({
      key: ENV.RAZORPAY_KEY,
      amount: Math.round(payAmt * 100),
      currency: 'INR',
      name: 'Craft & Weft',
      description: `Order #CW${orderId}`,
      prefill: {
        name: selectedAddress?.full_name || '',
        email: selectedAddress?.email || '',
        contact: selectedAddress?.mobile_number || '',
      },
      theme: { color: getBrandColor() },
      handler: async (response) => {
        if (!response?.razorpay_payment_id) {
          await cancelOrder(orderId);
          await alertDialog({ title: 'Payment failed', text: 'Your order has been cancelled.', icon: 'warning' });
          return;
        }
        await recordPayment(orderId, {
          payment_method: 'razorpay',
          payment_status: 'completed',
          payment_amount: payAmt,
          payment_reference: response.razorpay_payment_id,
          payment_details: JSON.stringify(response),
        });
        await fetchCart();
        navigate('/thank-you', { replace: true, state: { orderId } });
      },
      modal: {
        escape: true,
        ondismiss: async () => {
          await recordPayment(orderId, {
            payment_method: 'razorpay',
            payment_status: 'cancelled',
            payment_amount: payAmt,
            payment_details: JSON.stringify({ message: 'Payment cancelled by the customer' }),
          });
          await cancelOrder(orderId);
          alertDialog({ title: 'Payment cancelled', text: 'Your order has been cancelled. Your bag is still saved.', icon: 'warning' });
        },
      },
    });

    // Razorpay only calls `handler` on success — genuine gateway failures land here.
    rzp.on('payment.failed', async (response) => {
      const err = response?.error || {};
      await recordPayment(orderId, {
        payment_method: 'razorpay',
        payment_status: 'failed',
        payment_amount: payAmt,
        payment_reference: err.metadata?.payment_id || null,
        payment_details: JSON.stringify(err),
      });
      await cancelOrder(orderId);
      alertDialog({ title: 'Payment failed', text: err.description || 'Your payment could not be processed, so the order was cancelled.', icon: 'error' });
    });

    rzp.open();
  };

  const placeOrder = async () => {
    if (!selectedAddress?.id) {
      setAddressError(true);
      toast.error('Please choose a delivery address.');
      return;
    }
    if (!methods.length) {
      toast.error('Payment methods are still loading. Please try again.');
      return;
    }

    const codMethod = methods.find((m) => /cod|cash/i.test(m.method_name || '')) || methods[0];
    const onlineMethod = methods.find((m) => /razor|online/i.test(m.method_name || '')) || methods[methods.length - 1];

    setPlacing(true);
    try {
      const payload = {
        order_items: items.map((item) => ({
          product_id: item.product_id,
          prod_variation_id: item.prod_variation_id,
          product_name: lineName(item),
          quantity: item.quantity,
          price: lineUnitPrice(item),
          regular_price: Number(item.regular_price ?? lineUnitPrice(item)),
          total_price: lineTotal(item),
        })),
        pay_method_id: isCod ? codMethod.id : onlineMethod.id,
        shipping_address: selectedAddress.id,
        bill_amt: Number(subtotal.toFixed(2)),
        discount_amt: Number(discount.toFixed(2)),
        coupon_code: couponCode,
        net_amt: Number(net.toFixed(2)),
        shipping_total: shipping,
        r_off: roundOff,
        pay_amt: payAmt,
      };

      const { data } = await api.post('/api/v1/create_order', payload);
      if (!data?.order_id) {
        await alertDialog({ title: 'Order could not be placed', text: apiError(data, 'Please review your details and try again.'), icon: 'error' });
        return;
      }

      if (isCod) {
        await recordPayment(data.order_id, {
          payment_method: 'COD',
          payment_status: 'pending',
          payment_amount: payAmt,
          payment_reference: `COD_${data.order_id}`,
        });
        await fetchCart();
        navigate('/thank-you', { replace: true, state: { orderId: data.order_id } });
      } else {
        await payWithRazorpay(data.order_id);
      }
    } catch (err) {
      await alertDialog({ title: 'Something went wrong', text: apiError(err?.response?.data, 'Your order could not be placed.'), icon: 'error' });
    } finally {
      setPlacing(false);
    }
  };

  if (needsVerification) {
    return (
      <section className="container-x py-20">
        <div className="mx-auto max-w-lg rounded-[1.75rem] border border-amber-200 bg-amber-50/70 p-8 text-center">
          <FiAlertCircle className="mx-auto text-amber-500" size={28} />
          <h1 className="mt-4 font-display text-3xl text-ink-900">Verify your email first</h1>
          <p className="mt-3 text-sm leading-7 text-ink-600">
            We've sent a verification link to your email address. Please confirm it so we can send you order updates.
          </p>
          <div className="mt-6">
            {resent ? (
              <p className="text-sm font-bold text-brand-800">Verification link sent — check your inbox.</p>
            ) : (
              <button onClick={resendVerification} disabled={resending} className="btn-dark">
                {resending ? <Spinner light /> : <FiRefreshCw size={15} />} Resend verification link
              </button>
            )}
          </div>
          <Link to="/cart" className="mt-6 inline-block text-sm font-extrabold text-ink-900 underline underline-offset-4">
            Back to bag
          </Link>
        </div>
      </section>
    );
  }

  if (loading) {
    return (
      <section className="container-x grid gap-8 py-14 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-7">
          <div className="skeleton h-48 rounded-[1.75rem]" />
          <div className="skeleton h-56 rounded-[1.75rem]" />
        </div>
        <div className="lg:col-span-5">
          <div className="skeleton h-96 rounded-[1.75rem]" />
        </div>
      </section>
    );
  }

  return (
    <>
      <Seo title="Checkout" />

      <section className="container-x pb-24 pt-10 md:pt-14">
        <p className="eyebrow">Secure checkout</p>
        <SplitText as="h1" inView={false} text="Almost *yours*" className="h-display mt-4 text-5xl text-ink-900 md:text-7xl" />

        <div className="mt-12 grid gap-6 lg:grid-cols-12 lg:gap-8">
          <div className="space-y-6 lg:col-span-7">
            <Step n="1" title="Delivery address" done={!!selectedAddress}>
              {addresses.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-ink-900/20 p-6 text-center">
                  <FiMapPin className="mx-auto text-ink-400" size={22} />
                  <p className="mt-3 text-sm text-ink-500">No saved addresses yet.</p>
                  <Link to="/myaccount/addresses" state={{ status: 'add', slug: 'checkout' }} className="btn-primary btn-sm mt-4">
                    <FiPlus size={14} /> Add an address
                  </Link>
                </div>
              ) : (
                <>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {addresses.map((address) => {
                      const active = selectedAddress?.id === address.id;
                      return (
                        <button
                          key={address.id}
                          onClick={() => {
                            setSelectedAddress(address);
                            setAddressError(false);
                          }}
                          className={`relative rounded-2xl border p-4 text-left transition-all duration-300 ${
                            active ? 'border-ink-900 bg-brand-50' : 'border-ink-900/10 hover:border-ink-900/35'
                          } ${addressError && !selectedAddress ? 'border-rose-300' : ''}`}
                        >
                          <span className="flex items-center justify-between gap-2">
                            <span className="chip bg-ink-900/[0.06] capitalize text-ink-700">{address.address_label}</span>
                            {active && (
                              <span className="grid h-6 w-6 place-items-center rounded-full bg-ink-900 text-paper">
                                <FiCheck size={12} />
                              </span>
                            )}
                          </span>
                          <span className="mt-3 block text-sm font-extrabold text-ink-900">{address.full_name}</span>
                          <span className="mt-1 block text-xs leading-5 text-ink-500">
                            {address.address_line_1}
                            {address.address_line_2 ? `, ${address.address_line_2}` : ''}
                            <br />
                            {address.city}, {address.state} — {address.zip_code}
                            <br />
                            {address.mobile_number}
                          </span>
                          <Link
                            to="/myaccount/addresses"
                            state={{ status: 'edit', address, slug: 'checkout' }}
                            onClick={(e) => e.stopPropagation()}
                            className="absolute bottom-3 right-3 grid h-8 w-8 place-items-center rounded-full text-ink-400 hover:bg-ink-900/5 hover:text-ink-900"
                            aria-label="Edit address"
                          >
                            <FiEdit2 size={13} />
                          </Link>
                        </button>
                      );
                    })}
                  </div>
                  <Link
                    to="/myaccount/addresses"
                    state={{ status: 'add', slug: 'checkout' }}
                    className="mt-4 inline-flex items-center gap-2 text-sm font-extrabold text-ink-900"
                  >
                    <FiPlus size={14} /> <span className="link-underline">Add a new address</span>
                  </Link>
                </>
              )}
            </Step>

            <Step n="2" title="Payment method" done={!!method}>
              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  onClick={() => onlineAllowed && setMethod('online')}
                  disabled={!onlineAllowed}
                  className={`rounded-2xl border p-5 text-left transition-all duration-300 ${
                    method === 'online' ? 'border-ink-900 bg-brand-50' : 'border-ink-900/10 hover:border-ink-900/35'
                  } ${!onlineAllowed ? 'cursor-not-allowed opacity-45' : ''}`}
                >
                  <span className="flex items-center gap-3">
                    <FiCreditCard className="text-brand-700" size={20} />
                    <span className="font-extrabold text-ink-900">Pay online</span>
                  </span>
                  <span className="mt-2 block text-xs leading-5 text-ink-500">
                    {onlineAllowed ? 'UPI, cards, net banking and wallets via Razorpay.' : 'Add your Razorpay key to enable online payment.'}
                  </span>
                </button>

                <button
                  onClick={() => codAllowed && setMethod('cod')}
                  disabled={!codAllowed}
                  className={`rounded-2xl border p-5 text-left transition-all duration-300 ${
                    method === 'cod' ? 'border-ink-900 bg-brand-50' : 'border-ink-900/10 hover:border-ink-900/35'
                  } ${!codAllowed ? 'cursor-not-allowed opacity-45' : ''}`}
                >
                  <span className="flex items-center gap-3">
                    <FiTruck className="text-brand-700" size={20} />
                    <span className="font-extrabold text-ink-900">Cash on delivery</span>
                  </span>
                  <span className="mt-2 block text-xs leading-5 text-ink-500">
                    {codAllowed ? `Pay when it arrives. A ${inr(COD_FEE)} collection charge applies.` : 'Not available for one or more items in your bag.'}
                  </span>
                </button>
              </div>

              <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-xs font-semibold text-ink-500">
                <span className="inline-flex items-center gap-1.5">
                  <FiShield className="text-brand-700" /> Secure payments
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <FiRefreshCw className="text-brand-700" /> Easy returns
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <FiLock className="text-brand-700" /> Your details stay private
                </span>
              </div>
            </Step>

            <Step n="3" title={`Your order (${items.length})`} done>
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <SmartImage src={lineImage(item)} alt={lineName(item)} className="h-16 w-14 shrink-0 rounded-xl" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-ink-900">{lineName(item)}</p>
                      <p className="text-xs text-ink-500">
                        {inr(lineUnitPrice(item))} × {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-extrabold text-ink-900">{inr(lineTotal(item))}</p>
                  </div>
                ))}
              </div>
            </Step>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-[1.75rem] border border-ink-900/5 bg-white/85 p-6 shadow-soft lg:sticky lg:top-[calc(var(--nav-h)+1.5rem)] md:p-7">
              <p className="label">Order summary</p>
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
                    <dt>Coupon{couponCode ? ` (${couponCode})` : ''}</dt>
                    <dd className="font-semibold text-brand-800">−{inr(discount)}</dd>
                  </div>
                )}
                <div className="flex justify-between text-ink-600">
                  <dt>Delivery</dt>
                  <dd className="font-semibold text-brand-800">Free</dd>
                </div>
                {isCod && (
                  <div className="flex justify-between text-ink-600">
                    <dt>COD collection charge</dt>
                    <dd className="font-semibold text-ink-900">+{inr(COD_FEE)}</dd>
                  </div>
                )}
                {roundOff > 0 && (
                  <div className="flex justify-between text-ink-600">
                    <dt>Round off</dt>
                    <dd className="font-semibold text-ink-900">{inr(roundOff)}</dd>
                  </div>
                )}
              </dl>

              <div className="mt-5 flex items-end justify-between border-t border-dashed border-ink-900/15 pt-5">
                <span className="font-extrabold text-ink-900">To pay</span>
                <span className="font-display text-3xl text-ink-900">{inr(payAmt)}</span>
              </div>

              <button onClick={placeOrder} disabled={placing} className="btn-primary mt-6 w-full py-4">
                {placing ? <Spinner /> : <FiPackage size={16} />}
                {placing ? 'Placing your order…' : isCod ? 'Place order' : `Pay ${inr(payAmt)}`}
              </button>

              <AnimatePresence>
                {addressError && !selectedAddress && (
                  <motion.p
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, ease: EASE }}
                    className="mt-3 text-center text-xs font-bold text-rose-600"
                  >
                    Choose a delivery address to continue.
                  </motion.p>
                )}
              </AnimatePresence>

              <p className="mt-4 text-center text-[11px] leading-5 text-ink-400">
                By placing this order you agree to our <Link to="/terms-and-conditions" className="underline">terms</Link> and{' '}
                <Link to="/return-policy" className="underline">return policy</Link>.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
