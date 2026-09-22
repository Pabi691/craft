import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import ProductCard, { ProductCardSkeleton } from '../product/ProductCard';
import ProductRail from '../product/ProductRail';
import SplitText from '../ui/SplitText';
import useMediaQuery from '../../hooks/useMediaQuery';
import { useGlobal } from '../../context/GlobalContext';

const TITLE = 'Fresh off the *loom*';

/**
 * Desktop: the section pins while vertical scrolling drives the product row
 * sideways — a slow, cinematic pan across the collection.
 * Phones/tablets: a normal swipeable rail.
 */
export default function FeaturedScroll() {
  const { products, productsLoading } = useGlobal();
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const section = useRef(null);
  const track = useRef(null);
  const [distance, setDistance] = useState(0);

  const list = useMemo(
    () => [...products].sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0)).slice(0, 10),
    [products]
  );

  useLayoutEffect(() => {
    if (!isDesktop) return undefined;
    const measure = () => {
      if (track.current) setDistance(Math.max(0, track.current.scrollWidth - window.innerWidth));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (track.current) ro.observe(track.current);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [isDesktop, list.length]);

  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end end'] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);
  const progress = useTransform(scrollYProgress, [0, 1], [0, 1]);

  if (!isDesktop) {
    return (
      <ProductRail
        eyebrow="New from the looms"
        title={TITLE}
        text="Handcrafted in small batches — once a weave is gone, it may not return in quite the same way."
        products={list}
        className="pb-24"
      />
    );
  }

  return (
    <section ref={section} className="relative" style={{ height: `calc(100vh + ${distance}px)` }}>
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <div className="container-x mb-10 flex items-end justify-between gap-10">
          <div>
            <p className="eyebrow">New from the looms</p>
            <SplitText as="h2" text={TITLE} className="h-display mt-4 text-6xl text-ink-900 xl:text-7xl" />
          </div>
          <div className="flex w-72 items-center gap-4">
            <span className="relative h-px flex-1 overflow-hidden bg-ink-900/10">
              <motion.span className="absolute inset-0 origin-left bg-ink-900" style={{ scaleX: progress }} />
            </span>
            <Link to="/products" className="btn-dark btn-sm">
              Shop all <FiArrowRight />
            </Link>
          </div>
        </div>

        <motion.div ref={track} style={{ x }} className="flex w-max items-start gap-6 pl-[max(3rem,calc((100vw_-_1440px)/2_+_3rem))] pr-16">
          <div className="flex w-[clamp(15rem,24vw,20rem)] shrink-0 flex-col justify-between self-stretch rounded-[1.6rem] bg-ink-950 p-8 text-paper">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.3em] text-paper/50">The edit</p>
            <div>
              <p className="font-display text-4xl leading-tight">
                Made slowly, <span className="italic text-gold-foil">by hand.</span>
              </p>
              <p className="mt-4 text-sm leading-6 text-paper/60">Every stripe, stitch and fold carries a maker’s story — scroll to meet the collection.</p>
            </div>
            <span className="text-5xl text-gold">→</span>
          </div>

          {productsLoading && !list.length
            ? [0, 1, 2, 3].map((i) => (
                <div key={i} className="w-[clamp(15rem,26vh,20rem)] shrink-0">
                  <ProductCardSkeleton />
                </div>
              ))
            : list.map((p, i) => (
                <div key={p.id} className="w-[clamp(15rem,26vh,20rem)] shrink-0">
                  <ProductCard product={p} index={i} />
                </div>
              ))}

          <Link
            to="/products"
            data-cursor="Shop"
            className="group grid aspect-square w-[clamp(14rem,22vh,18rem)] shrink-0 place-items-center self-center rounded-full border border-ink-900/15 text-center transition-colors duration-500 hover:bg-brand-500"
          >
            <span>
              <span className="block font-display text-3xl">See every piece</span>
              <FiArrowRight className="mx-auto mt-3 transition-transform duration-500 group-hover:translate-x-2" size={22} />
            </span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
