import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSearch, FiX } from 'react-icons/fi';
import { useGlobal } from '../context/GlobalContext';
import { POPULAR_SEARCHES, searchProducts } from '../lib/search';
import { EASE } from '../lib/motion';
import Seo from '../components/Seo';
import SplitText from '../components/ui/SplitText';
import EmptyState from '../components/ui/EmptyState';
import ProductCard, { ProductCardSkeleton } from '../components/product/ProductCard';

export default function Search() {
  const [params, setParams] = useSearchParams();
  const query = params.get('q') || '';
  const { products, productsLoading } = useGlobal();
  const [value, setValue] = useState(query);

  useEffect(() => setValue(query), [query]);

  const results = useMemo(() => (query ? searchProducts(products, query) : products), [products, query]);

  const submit = (e) => {
    e.preventDefault();
    setParams(value.trim() ? { q: value.trim() } : {});
  };

  return (
    <>
      <Seo title={query ? `Search: ${query}` : 'Search'} />

      <section className="container-x pb-20 pt-10 md:pt-14">
        <p className="eyebrow">Search</p>
        <SplitText as="h1" inView={false} text="Find your *piece*" className="h-display mt-4 text-5xl text-ink-900 md:text-7xl" />

        <form onSubmit={submit} className="mt-10 flex items-center gap-4 border-b-2 border-ink-900 pb-3">
          <FiSearch size={24} className="shrink-0 text-ink-400" />
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Khesh tote, botua, cushion…"
            className="w-full bg-transparent font-display text-2xl text-ink-900 outline-none placeholder:text-ink-300 md:text-4xl"
          />
          {value && (
            <button type="button" onClick={() => setParams({})} aria-label="Clear" className="icon-btn h-9 w-9 bg-ink-900/5">
              <FiX size={16} />
            </button>
          )}
        </form>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span className="mr-1 text-xs font-bold text-ink-400">Try:</span>
          {POPULAR_SEARCHES.map((term) => (
            <button
              key={term}
              onClick={() => setParams({ q: term })}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                query.toLowerCase() === term.toLowerCase() ? 'border-ink-900 bg-ink-900 text-paper' : 'border-ink-900/10 bg-white text-ink-700 hover:border-ink-900/40'
              }`}
            >
              {term}
            </button>
          ))}
        </div>

        <motion.p
          key={`${query}-${results.length}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="mt-10 text-sm font-semibold text-ink-500"
        >
          {query ? (
            <>
              <span className="font-extrabold text-ink-900">{results.length}</span> result{results.length === 1 ? '' : 's'} for “{query}”
            </>
          ) : (
            'Browsing the full collection'
          )}
        </motion.p>

        <div className="mt-8">
          {productsLoading ? (
            <div className="grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 md:gap-x-6 xl:grid-cols-4">
              {Array.from({ length: 8 }, (_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : results.length === 0 ? (
            <EmptyState
              icon={FiSearch}
              title="Nothing woven by that name."
              text="Try a different word — a craft like “khesh”, a category like “bags”, or simply browse everything."
              action={
                <button onClick={() => setParams({})} className="btn-primary">
                  Browse everything
                </button>
              }
            />
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 md:gap-x-6 xl:grid-cols-4">
              {results.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
