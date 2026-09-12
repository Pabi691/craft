import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { FiArrowRight, FiPackage, FiTruck } from 'react-icons/fi';
import api from '../lib/api';
import { getBrandColor } from '../lib/theme';
import { EASE } from '../lib/motion';
import { SITE } from '../config/site';
import Seo from '../components/Seo';
import SplitText from '../components/ui/SplitText';
import WeavePattern from '../components/ui/WeavePattern';

export default function ThankYou() {
  const location = useLocation();
  const [orderId, setOrderId] = useState(location.state?.orderId || null);

  useEffect(() => {
    const brand = getBrandColor();
    const colors = [brand, '#E0408C', '#FAF7EF', '#171B14'];
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

  return (
    <>
      <Seo title="Thank you" />

      <section className="relative overflow-hidden py-20 md:py-28">
        <WeavePattern className="absolute inset-0 text-brand-700" opacity={0.06} />
        <div className="pointer-events-none absolute -top-32 left-1/2 h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-brand-200/60 blur-[120px]" />

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

          <p className="eyebrow mt-8 justify-center">Order confirmed</p>
          <SplitText as="h1" inView={false} delay={0.2} text="Thank you for | choosing *handmade.*" className="h-display mt-5 text-4xl text-ink-900 md:text-6xl" />
          <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.8, ease: EASE }} className="mx-auto mt-6 max-w-xl text-[15px] leading-8 text-ink-600">
            Your order is with us and supports the artisans of {SITE.parent}. You'll get an email as soon as it's on its way.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.95, duration: 0.8, ease: EASE }}
            className="mx-auto mt-10 grid max-w-md gap-4 rounded-[1.75rem] border border-ink-900/5 bg-white/85 p-6 text-left shadow-soft sm:grid-cols-2"
          >
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-ink-400">Order number</p>
              <p className="mt-1 font-display text-2xl text-ink-900">{orderId ? `#CW${orderId}` : '—'}</p>
            </div>
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-ink-400">Estimated delivery</p>
              <p className="mt-1 flex items-center gap-2 font-display text-2xl text-ink-900">
                <FiTruck className="text-brand-700" size={18} /> 3–5 days
              </p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1, duration: 0.8 }} className="mt-10 flex flex-wrap justify-center gap-3">
            {orderId && (
              <Link to={`/myaccount/order/${orderId}`} className="btn-dark">
                <FiPackage size={16} /> Track this order
              </Link>
            )}
            <Link to="/products" className="btn-primary">
              Continue shopping <FiArrowRight />
            </Link>
          </motion.div>

          <p className="mt-10 text-xs text-ink-400">{SITE.care}</p>
        </div>
      </section>
    </>
  );
}
