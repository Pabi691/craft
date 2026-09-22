import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import Reveal from '../ui/Reveal';
import { useTestimonials } from '../../hooks/useTestimonials';
import { EASE } from '../../lib/motion';

export default function Testimonials() {
  const items = useTestimonials();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = items.length;

  useEffect(() => {
    if (count < 2 || paused) return undefined;
    const t = setInterval(() => setIndex((i) => (i + 1) % count), 7000);
    return () => clearInterval(t);
  }, [count, paused]);

  if (!count) return null;
  const current = items[index % count];
  const go = (d) => setIndex((i) => (i + d + count) % count);

  return (
    <section className="relative overflow-hidden py-24 md:py-36" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <span aria-hidden className="pointer-events-none absolute left-1/2 top-4 -translate-x-1/2 select-none font-display text-[16rem] leading-none text-gold/25 md:text-[24rem]">
        “
      </span>
      <div className="container-x relative text-center">
        <Reveal as="p" className="eyebrow justify-center">
          Kind words
        </Reveal>
        <div className="relative mx-auto mt-10 min-h-[15rem] max-w-4xl md:min-h-[13rem]">
          <AnimatePresence mode="wait">
            <motion.figure
              key={index}
              initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -16, filter: 'blur(6px)' }}
              transition={{ duration: 0.8, ease: EASE }}
            >
              <blockquote className="text-balance font-display text-2xl font-light leading-snug text-ink-900 md:text-4xl">“{current.review_text}”</blockquote>
              <figcaption className="mt-8 flex items-center justify-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-brand-500 font-display text-lg text-brand-on">{current.reviewer_name?.charAt(0)}</span>
                <span className="text-left">
                  <span className="block text-sm font-extrabold text-ink-900">{current.reviewer_name}</span>
                  <span className="block text-xs font-semibold text-ink-400">Craft & Weft patron</span>
                </span>
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>

        {count > 1 && (
          <div className="mt-10 flex items-center justify-center gap-5">
            <button onClick={() => go(-1)} aria-label="Previous testimonial" className="icon-btn border border-ink-900/10 bg-white">
              <FiArrowLeft />
            </button>
            <div className="flex gap-2">
              {items.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  aria-label={`Testimonial ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-500 ${i === index % count ? 'w-10 bg-ink-900' : 'w-4 bg-ink-900/20'}`}
                />
              ))}
            </div>
            <button onClick={() => go(1)} aria-label="Next testimonial" className="icon-btn border border-ink-900/10 bg-white">
              <FiArrowRight />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
