import { useRef } from 'react';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import ProductCard from './ProductCard';
import SectionHeading from '../ui/SectionHeading';

// Horizontal, snap-scrolling row of product cards with arrow controls.
export default function ProductRail({ eyebrow, title, text, products = [], className = '' }) {
  const track = useRef(null);
  if (!products.length) return null;

  const scroll = (dir) => {
    const el = track.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.max(el.clientWidth * 0.8, 280), behavior: 'smooth' });
  };

  return (
    <section className={className}>
      <div className="container-x">
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          text={text}
          size="md"
          action={
            products.length > 3 && (
              <div className="hidden gap-2 md:flex">
                <button onClick={() => scroll(-1)} aria-label="Previous" className="icon-btn border border-ink-900/10 bg-white">
                  <FiArrowLeft />
                </button>
                <button onClick={() => scroll(1)} aria-label="Next" className="icon-btn border border-ink-900/10 bg-white">
                  <FiArrowRight />
                </button>
              </div>
            )
          }
        />
      </div>
      <div
        ref={track}
        data-lenis-prevent-wheel
        className="no-scrollbar mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-5 pb-4 sm:px-8 lg:px-[max(3rem,calc((100vw_-_1440px)/2_+_3rem))]"
      >
        {products.map((p, i) => (
          <div key={p.id} className="w-[70vw] shrink-0 snap-start sm:w-[42vw] md:w-[30vw] lg:w-[23%] xl:w-[21%]">
            <ProductCard product={p} index={i} />
          </div>
        ))}
      </div>
    </section>
  );
}
