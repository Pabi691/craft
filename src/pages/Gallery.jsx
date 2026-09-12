import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { FiArrowRight, FiChevronLeft, FiChevronRight, FiImage, FiX } from 'react-icons/fi';
import { useImages } from '../hooks/useImages';
import { EASE } from '../lib/motion';
import Seo from '../components/Seo';
import SplitText from '../components/ui/SplitText';
import SmartImage from '../components/ui/SmartImage';
import EmptyState from '../components/ui/EmptyState';
import Modal from '../components/ui/Modal';

export default function Gallery() {
  const { images, loading } = useImages({ image_type: 'gallery' });
  const [active, setActive] = useState(null);

  useEffect(() => {
    if (active === null) return undefined;
    const onKey = (e) => {
      if (e.key === 'ArrowRight') setActive((i) => (i + 1) % images.length);
      if (e.key === 'ArrowLeft') setActive((i) => (i - 1 + images.length) % images.length);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active, images.length]);

  const current = active !== null ? images[active] : null;

  return (
    <>
      <Seo title="Gallery" description="Moments from our looms, training centres and fairs across Bengal." />

      <section className="container-x pb-16 pt-10 md:pt-14">
        <p className="eyebrow">From the field</p>
        <SplitText as="h1" inView={false} text="Hands at *work*" className="h-display mt-5 text-[3rem] text-ink-900 sm:text-7xl lg:text-8xl" />
        <p className="mt-6 max-w-2xl text-[15px] leading-8 text-ink-500">
          Training camps, looms, value-addition centres and the fairs where our artisans meet their buyers — photographs from the work behind every piece.
        </p>
      </section>

      <section className="container-x pb-24">
        {loading && images.length === 0 ? (
          <div className="columns-2 gap-4 md:columns-3 md:gap-6">
            {Array.from({ length: 9 }, (_, i) => (
              <div key={i} className="skeleton mb-4 h-64 break-inside-avoid rounded-[1.75rem] md:mb-6" />
            ))}
          </div>
        ) : images.length === 0 ? (
          <EmptyState
            icon={FiImage}
            title="The gallery is being hung."
            text="Photographs from our looms and fairs will appear here soon."
            action={
              <Link to="/products" className="btn-primary">
                Explore the collection
              </Link>
            }
          />
        ) : (
          <div className="columns-2 gap-4 md:columns-3 md:gap-6">
            {images.map((img, i) => (
              <motion.figure
                key={img.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.85, delay: (i % 3) * 0.08, ease: EASE }}
                className="group relative mb-4 break-inside-avoid overflow-hidden rounded-[1.75rem] md:mb-6"
              >
                <button onClick={() => setActive(i)} data-cursor="View" className="block w-full text-left">
                  <SmartImage src={img.image_path} alt={img.name || ''} className="w-full" imgClassName="duration-[1400ms] group-hover:scale-105" />
                  <figcaption className="absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-ink-950/90 to-transparent p-5 pt-16 text-sm leading-snug text-paper opacity-0 transition-all duration-500 ease-silk group-hover:translate-y-0 group-hover:opacity-100">
                    {img.name}
                  </figcaption>
                </button>
              </motion.figure>
            ))}
          </div>
        )}
      </section>

      <section className="container-x pb-24">
        <div className="flex flex-col items-start justify-between gap-6 rounded-[2.25rem] bg-ink-950 p-8 text-paper md:flex-row md:items-center md:p-12">
          <p className="font-display text-3xl leading-tight md:text-4xl">
            Every photograph here ends in a <span className="italic text-brand-300">piece you can hold.</span>
          </p>
          <Link to="/products" className="btn-primary shrink-0">
            Shop the collection <FiArrowRight />
          </Link>
        </div>
      </section>

      <Modal open={active !== null} onClose={() => setActive(null)} size="xl">
        {current && (
          <AnimatePresence mode="wait">
            <motion.figure key={current.id} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4, ease: EASE }}>
              <img src={current.image_path} alt={current.name || ''} className="max-h-[70vh] w-full rounded-2xl object-contain" />
              <figcaption className="mt-5 text-center text-sm leading-7 text-ink-600">{current.name}</figcaption>
            </motion.figure>
          </AnimatePresence>
        )}
        <div className="mt-4 flex items-center justify-center gap-4">
          <button onClick={() => setActive((i) => (i - 1 + images.length) % images.length)} aria-label="Previous" className="icon-btn border border-ink-900/10">
            <FiChevronLeft />
          </button>
          <span className="text-sm font-bold text-ink-500">
            {active !== null ? active + 1 : 0} / {images.length}
          </span>
          <button onClick={() => setActive((i) => (i + 1) % images.length)} aria-label="Next" className="icon-btn border border-ink-900/10">
            <FiChevronRight />
          </button>
        </div>
      </Modal>
    </>
  );
}
