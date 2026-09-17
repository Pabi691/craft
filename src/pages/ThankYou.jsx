import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { FiArrowRight, FiPackage, FiTruck } from 'react-icons/fi';
import api from '../lib/api';
import { getBrandColor } from '../lib/theme';
import { EASE } from '../lib/motion';
import { inr } from '../lib/format';
import { SITE } from '../config/site';
import Seo from '../components/Seo';
import SplitText from '../components/ui/SplitText';
import WeavePattern from '../components/ui/WeavePattern';

const MSG = SITE.orderMessage;

const fade = (delay) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.8, ease: EASE },
});

export default function ThankYou() {
  const location = useLocation();
  const [orderId, setOrderId] = useState(location.state?.orderId || null);
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const brand = getBrandColor();
    const colors = [brand, '#017D3E', '#84C243', '#603814'];
    confetti({ particleCount: 130, spread: 90, origin: { y: 0.4 }, colors });
    const t = setTimeout(() => confetti({ particleCount: 70, spread: 110, origin: { y: 0.5 }, colors, scalar: 0.8 }), 450);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (orderId) return undefined;
    let alive = true;
    api
      .get('/api/v1/get_my_orders')
      .then(({ data }) => {
        if (alive && data?.status && data.orders?.length) setOrderId(data.orders[0].id);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [orderId]);

  useEffect(() => {
    if (!orderId) return undefined;
    let alive = true;
    api
      .get(`/api/v1/order/${orderId}`)
      .then(({ data }) => alive && data?.status && setOrder(data.order))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [orderId]);

  const items = order?.order_items || [];
  const firstName = order?.customer?.first_name;

  return (
    <>
      <Seo title="Thank you" />

      <section className="relative overflow-hidden py-20 md:py-28">
        <WeavePattern className="absolute inset-0 text-brand-700" opacity={0.06} />
        <div className="pointer-events-none absolute -top-32 left-1/2 h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-brand-200/60 blur-[120px]" />
        <div className="pointer-events-none absolute -right-40 bottom-0 h-80 w-80 rounded-full bg-leaf-soft blur-[110px]" />

        <div className="container-x relative max-w-3xl text-center">
          <motion.div
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 180, damping: 14 }}
            className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-brand-500 text-brand-on ring-8 ring-brand-100"
          >
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" aria-hidden>
              <motion.path
                d="M4 12.5 L9.5 18 L20 7"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
              />
            </svg>
          </motion.div>

          <motion.p {...fade(0.15)} className="mt-8 font-display text-xl italic text-ink-600">
            {MSG.greeting}
            {firstName ? ` ${firstName}` : ''},
          </motion.p>
          <SplitText as="h1" inView={false} delay={0.25} text="Thank you for | choosing *us.*" className="h-display mt-3 text-4xl text-ink-900 md:text-6xl" />
          <motion.p {...fade(0.7)} className="mt-5 flex items-center justify-center gap-3 text-sm font-extrabold uppercase tracking-[0.22em] text-brand-800">
            <span className="h-px w-8 bg-gold" aria-hidden /> {MSG.status} <span className="h-px w-8 bg-gold" aria-hidden />
          </motion.p>

          <motion.div
            {...fade(0.9)}
            className="mx-auto mt-10 max-w-lg overflow-hidden rounded-[1.75rem] border border-ink-900/5 bg-white/85 text-left shadow-soft"
          >
            <div className="flex items-center justify-between gap-4 border-b border-ink-900/5 px-6 py-4">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-gold-dark">Order details</p>
              <p className="font-display text-lg text-ink-900">{orderId ? `#CW${orderId}` : '—'}</p>
            </div>

            <ul className="divide-y divide-ink-900/5 px-6">
              {items.length
                ? items.map((item) => (
                    <li key={item.id} className="flex items-start justify-between gap-4 py-3 text-sm">
                      <span className="min-w-0">
                        <span className="block font-semibold text-ink-900">{item.product_name}</span>
                        <span className="text-xs text-ink-400">
                          {item.quantity} × {inr(item.price)}
                        </span>
                      </span>
                      <span className="shrink-0 font-semibold text-ink-800">{inr(Number(item.price) * Number(item.quantity))}</span>
                    </li>
                  ))
                : [0, 1].map((i) => (
                    <li key={i} className="py-3">
                      <div className="skeleton h-9" />
                    </li>
                  ))}
            </ul>

            <div className="flex items-center justify-between gap-4 bg-ink-900 px-6 py-4 text-paper">
              <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-gold-light">Amount</span>
              <span className="font-display text-2xl">{order ? inr(order.pay_amt) : '—'}</span>
            </div>
            <p className="flex items-center gap-2 px-6 py-3 text-xs font-semibold text-ink-500">
              <FiTruck className="text-brand-700" size={14} /> Usually delivered in 3–5 days · a confirmation email is on its way
            </p>
          </motion.div>

          <motion.div {...fade(1.05)} className="mx-auto mt-10 max-w-xl">
            <p className="font-display text-2xl leading-snug text-ink-900 md:text-3xl">{MSG.onTheWay}</p>
            <p className="mt-6 font-display text-xl italic text-brand-800">{MSG.signOff}</p>
            <p className="mt-1 text-sm text-ink-500">{MSG.impact}</p>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 0.8 }} className="mt-10 flex flex-wrap justify-center gap-3">
            {orderId && (
              <Link to={`/myaccount/order/${orderId}`} className="btn-dark">
                <FiPackage size={16} /> Track this order
              </Link>
            )}
            <Link to="/products" className="btn-primary">
              Continue shopping <FiArrowRight />
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
