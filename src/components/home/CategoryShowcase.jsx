import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowUpRight } from 'react-icons/fi';
import SectionHeading from '../ui/SectionHeading';
import SmartImage from '../ui/SmartImage';
import { useGlobal } from '../../context/GlobalContext';
import { EASE } from '../../lib/motion';

export default function CategoryShowcase() {
  const { categoryTree, categoriesLoading } = useGlobal();
  const tiles = categoryTree
    .flatMap((c) => [c, ...(c.children || [])])
    .sort((a, b) => (b.product_count || 0) - (a.product_count || 0))
    .slice(0, 5);

  if (!tiles.length && !categoriesLoading) return null;

  return (
    <section id="shop-by-category" className="py-24 md:py-32">
      <div className="container-x">
        <SectionHeading
          eyebrow="Shop by category"
          title="Pieces for every *day*, | every home."
          action={
            <Link to="/products" className="btn-outline">
              View all products <FiArrowUpRight />
            </Link>
          }
        />

        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-12">
          {tiles.length === 0
            ? [0, 1, 2, 3, 4].map((i) => (
                <div key={i} className={i === 0 ? 'sm:col-span-2 lg:col-span-6 lg:row-span-2' : 'lg:col-span-3'}>
                  <div className={`skeleton rounded-[2rem] ${i === 0 ? 'aspect-[4/5] lg:aspect-auto lg:h-full lg:min-h-[36rem]' : 'aspect-[4/5]'}`} />
                </div>
              ))
            : tiles.map((cat, i) => {
                const big = i === 0;
                return (
                  <motion.div
                    key={cat.id}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{ duration: 0.9, delay: i * 0.08, ease: EASE }}
                    className={big ? 'sm:col-span-2 lg:col-span-6 lg:row-span-2' : 'lg:col-span-3'}
                  >
                    <Link to={`/${cat.slug}`} data-cursor="Shop" className="group relative block h-full overflow-hidden rounded-[2rem] bg-paper-300">
                      <SmartImage
                        src={cat.cat_img}
                        alt={cat.category_name}
                        className={big ? 'aspect-[4/5] sm:aspect-[16/10] lg:aspect-auto lg:h-full lg:min-h-[36rem]' : 'aspect-[4/5]'}
                        imgClassName="duration-[1400ms] group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-ink-950/10 to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 md:p-8">
                        <div>
                          <p className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-paper/70">
                            {cat.product_count ? `${cat.product_count} piece${cat.product_count > 1 ? 's' : ''}` : 'Coming soon'}
                          </p>
                          <h3 className={`mt-2 font-display leading-none text-paper ${big ? 'text-4xl md:text-6xl' : 'text-2xl md:text-3xl'}`}>{cat.category_name}</h3>
                          {big && cat.cat_desc && <p className="mt-4 max-w-sm text-sm leading-6 text-paper/75">{cat.cat_desc}</p>}
                        </div>
                        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-paper text-ink-900 transition-all duration-500 ease-silk group-hover:rotate-45 group-hover:bg-brand-500">
                          <FiArrowUpRight size={18} />
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
        </div>
      </div>
    </section>
  );
}
