import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import SplitText from '../ui/SplitText';
import Magnetic from '../ui/Magnetic';
import SmartImage from '../ui/SmartImage';
import WeavePattern from '../ui/WeavePattern';
import { useImages } from '../../hooks/useImages';
import { useGlobal } from '../../context/GlobalContext';
import { SITE } from '../../config/site';
import { inr } from '../../lib/format';
import { EASE } from '../../lib/motion';
import { mediaUrl } from '../../lib/media';

function RotatingBadge() {
  return (
    <div className="relative grid h-32 w-32 place-items-center rounded-full bg-ink-950 text-paper shadow-lift ring-1 ring-gold/50 ring-offset-4 ring-offset-paper sm:h-36 sm:w-36">
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full animate-spin-slow" aria-hidden>
        <defs>
          <path id="hero-badge-circle" d="M50,50 m-37,0 a37,37 0 1,1 74,0 a37,37 0 1,1 -74,0" />
        </defs>
        <text className="fill-gold-light text-[7px] font-bold uppercase" style={{ fontFamily: 'Manrope, sans-serif', letterSpacing: '0.2em' }}>
          <textPath href="#hero-badge-circle" textLength="228" lengthAdjust="spacing">
            Made in India · Rooted in people ·
          </textPath>
        </text>
      </svg>
      <span className="font-display text-2xl">
        C<span className="italic text-accent">&amp;</span>W
      </span>
    </div>
  );
}

export default function Hero() {
  const ref = useRef(null);
  const { images } = useImages({ image_type: 'banner', page_key: 'home' });
  const { products } = useGlobal();
  const [slide, setSlide] = useState(0);

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const yArch = useTransform(scrollYProgress, [0, 1], ['0%', '16%']);
  const yFloat = useTransform(scrollYProgress, [0, 1], ['0%', '-40%']);
  const yText = useTransform(scrollYProgress, [0, 1], ['0%', '22%']);
  const fade = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  useEffect(() => {
    if (images.length < 2) return undefined;
    const t = setInterval(() => setSlide((s) => (s + 1) % images.length), 5600);
    return () => clearInterval(t);
  }, [images.length]);

  const current = images.length ? images[slide % images.length] : null;
  const secondary = images.length > 1 ? images[(slide + 1) % images.length] : null;
  // The priciest piece doubles as the "signature" card (unpriced drafts never qualify).
  const signature = useMemo(
    () =>
      products
        .filter((p) => Number(p.sale_price) > 0)
        .reduce((best, p) => (!best || Number(p.sale_price) > Number(best.sale_price) ? p : best), null),
    [products]
  );

  return (
    <section ref={ref} className="relative overflow-hidden pt-header">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-48 top-10 h-[38rem] w-[38rem] rounded-full bg-brand-200/70 blur-[130px]" />
        <div className="absolute -right-32 bottom-0 h-[30rem] w-[30rem] rounded-full bg-accent-soft blur-[120px]" />
        <WeavePattern className="absolute inset-0 text-ink-900 mask-fade-b" opacity={0.05} />
      </div>

      <div className="container-x relative grid min-h-[calc(100svh-var(--header-total))] items-center gap-14 pb-16 pt-8 lg:grid-cols-12 lg:gap-8 lg:py-16">
        <motion.div style={{ y: yText, opacity: fade }} className="relative z-10 lg:col-span-6">
          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.8, ease: EASE }} className="eyebrow">
            An initiative of {SITE.parent}
          </motion.p>
          <SplitText
            as="h1"
            inView={false}
            delay={0.3}
            text="From Craft | to *Cup.*"
            className="h-display mt-6 text-[3.4rem] leading-[0.92] text-ink-900 sm:text-7xl xl:text-[6.8rem]"
          />
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.8, ease: EASE }}
            className="mt-5 flex items-center gap-3 font-display text-xl italic text-ink-700 md:text-2xl"
          >
            <span className="h-px w-10 bg-gold" aria-hidden />
            {SITE.subTagline}
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.9, ease: EASE }}
            className="mt-6 max-w-lg text-base leading-8 text-ink-600 md:text-lg"
          >
            {SITE.heroCopy}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.05, duration: 0.9, ease: EASE }}
            className="mt-10 flex flex-wrap items-center gap-3 sm:gap-4"
          >
            <Magnetic>
              <Link to="/products" className="btn-primary px-8 py-4 text-[15px]">
                Shop the collection <FiArrowRight />
              </Link>
            </Magnetic>
            <Link to="/tea" className="btn-outline px-8 py-4 text-[15px]">
              Discover SPHOORA teas
            </Link>
          </motion.div>
          <motion.dl
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3, duration: 1 }}
            className="mt-14 flex flex-wrap items-center gap-x-10 gap-y-4 border-t border-ink-900/10 pt-6"
          >
            {SITE.stats.slice(0, 2).map((s) => (
              <div key={s.label}>
                <dt className="font-display text-3xl text-ink-900">
                  {s.value.toLocaleString('en-IN')}
                  {s.suffix}
                </dt>
                <dd className="text-xs font-semibold text-ink-500">{s.label}</dd>
              </div>
            ))}
            <div className="flex items-center gap-3">
              <div className="flex -space-x-3">
                {images.slice(0, 3).map((img) => (
                  <img key={img.id} src={mediaUrl(img.image_path)} alt="" className="h-10 w-10 rounded-full border-2 border-paper object-cover" />
                ))}
              </div>
              <span className="max-w-[10rem] text-xs font-semibold leading-snug text-ink-500">Every order hugs an artisan’s family</span>
            </div>
          </motion.dl>
        </motion.div>

        <div className="relative lg:col-span-6">
          <div className="relative mx-auto aspect-[4/5] w-[86%] max-w-[520px] sm:w-[78%] lg:w-[88%]">
            <motion.div
              style={{ y: yArch }}
              initial={{ clipPath: 'inset(100% 0% 0% 0%)' }}
              animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
              transition={{ duration: 1.4, ease: EASE, delay: 0.15 }}
              className="absolute inset-0 overflow-hidden rounded-arch bg-paper-300 shadow-lift"
            >
              <AnimatePresence initial={false}>
                {current && (
                  <motion.img
                    key={current.id}
                    src={mediaUrl(current.image_path)}
                    alt={current.name || ''}
                    initial={{ opacity: 0, scale: 1.14 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ opacity: { duration: 1.3, ease: 'easeInOut' }, scale: { duration: 6.5, ease: 'linear' } }}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                )}
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/55 via-transparent to-transparent" />
              <div className="absolute inset-x-6 bottom-6 flex items-end justify-between gap-4">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={current?.id || 'caption'}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.6, ease: EASE }}
                    className="font-display text-lg italic leading-snug text-paper/95"
                  >
                    {current?.name}
                  </motion.p>
                </AnimatePresence>
                {images.length > 1 && (
                  <div className="flex shrink-0 gap-1.5">
                    {images.map((img, i) => (
                      <button
                        key={img.id}
                        aria-label={`Show slide ${i + 1}`}
                        onClick={() => setSlide(i)}
                        className={`h-1 rounded-full transition-all duration-500 ${i === slide % images.length ? 'w-8 bg-paper' : 'w-3 bg-paper/45'}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ scale: 0, rotate: -120 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 1.1, type: 'spring', stiffness: 110, damping: 14 }}
              className="absolute -left-8 top-6 sm:-left-14"
            >
              <RotatingBadge />
            </motion.div>

            {secondary && (
              <motion.div
                style={{ y: yFloat }}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.95, duration: 1.1, ease: EASE }}
                className="absolute -right-5 -top-10 hidden h-44 w-32 overflow-hidden rounded-arch border-[5px] border-paper shadow-lift sm:block lg:-right-12"
              >
                <img src={mediaUrl(secondary.image_path)} alt="" className="h-full w-full object-cover" />
              </motion.div>
            )}

            {signature && (
              <motion.div
                style={{ y: yFloat }}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.25, duration: 1, ease: EASE }}
                className="absolute -right-3 bottom-12 w-40 sm:-right-10 sm:w-52"
              >
                <Link to={`/p/${signature.slug}`} data-cursor="View" className="block animate-float rounded-3xl bg-paper-50/90 p-2.5 shadow-lift backdrop-blur-xl">
                  <SmartImage src={signature.primary_img} alt={signature.prod_name} className="aspect-[5/4] rounded-2xl" />
                  <div className="px-1.5 pb-1 pt-3">
                    <p className="text-[9px] font-extrabold uppercase tracking-[0.22em] text-ink-400">Signature piece</p>
                    <p className="mt-1 truncate font-display text-[15px] text-ink-900">{signature.prod_name}</p>
                    <p className="text-xs font-extrabold text-ink-700">{inr(signature.sale_price)}</p>
                  </div>
                </Link>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      <motion.div style={{ opacity: fade }} className="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 lg:flex">
        <span className="text-[10px] font-extrabold uppercase tracking-[0.3em] text-ink-400">Scroll</span>
        <span className="relative h-10 w-px overflow-hidden bg-ink-900/15">
          <motion.span className="absolute inset-x-0 top-0 h-1/2 bg-ink-900" animate={{ y: ['-100%', '200%'] }} transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }} />
        </span>
      </motion.div>
    </section>
  );
}
