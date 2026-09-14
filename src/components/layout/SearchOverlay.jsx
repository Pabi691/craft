import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { FiArrowRight, FiSearch, FiX } from 'react-icons/fi';
import SmartImage from '../ui/SmartImage';
import { useGlobal } from '../../context/GlobalContext';
import { useLenis } from '../motion/SmoothScroll';
import { POPULAR_SEARCHES, searchProducts } from '../../lib/search';
import { priceLabel } from '../../lib/format';
import { EASE } from '../../lib/motion';

export default function SearchOverlay({ open, onClose }) {
  const { products } = useGlobal();
  const navigate = useNavigate();
  const lenis = useLenis();
  const inputRef = useRef(null);
  const [q, setQ] = useState('');

  useEffect(() => {
    if (!open) {
      setQ('');
      return undefined;
    }
    lenis?.stop();
    const t = setTimeout(() => inputRef.current?.focus(), 200);
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      clearTimeout(t);
      lenis?.start();
      window.removeEventListener('keydown', onKey);
    };
  }, [open, lenis, onClose]);

  const results = useMemo(() => searchProducts(products, q).slice(0, 6), [products, q]);

  const submit = (e) => {
    e.preventDefault();
    if (!q.trim()) return;
    onClose();
    navigate(`/search?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[100]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <button aria-label="Close search" className="absolute inset-0 cursor-default bg-ink-950/40 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            data-lenis-prevent
            initial={{ y: '-100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ duration: 0.6, ease: EASE }}
            className="relative max-h-[90vh] overflow-y-auto rounded-b-[2.5rem] bg-paper-50 pb-10 pt-8 shadow-lift"
          >
            <div className="container-x">
              <div className="flex items-center justify-between">
                <p className="eyebrow">Search the collection</p>
                <button onClick={onClose} aria-label="Close" className="icon-btn bg-ink-900/5">
                  <FiX size={18} />
                </button>
              </div>

              <form onSubmit={submit} className="mt-6 flex items-center gap-4 border-b-2 border-ink-900 pb-3">
                <FiSearch size={26} className="shrink-0 text-ink-400" />
                <input
                  ref={inputRef}
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Khesh tote, botua, cushion…"
                  className="w-full bg-transparent font-display text-3xl text-ink-900 outline-none placeholder:text-ink-300 md:text-5xl"
                />
                {q && (
                  <button type="submit" className="btn-dark btn-sm shrink-0">
                    Search <FiArrowRight />
                  </button>
                )}
              </form>

              {!q && (
                <div className="mt-7 flex flex-wrap items-center gap-2">
                  <span className="mr-2 text-xs font-bold text-ink-400">Popular:</span>
                  {POPULAR_SEARCHES.map((term) => (
                    <button key={term} onClick={() => setQ(term)} className="rounded-full border border-ink-900/10 bg-white px-4 py-2 text-sm font-semibold text-ink-700 transition-colors hover:border-ink-900">
                      {term}
                    </button>
                  ))}
                </div>
              )}

              {q && (
                <div className="mt-8">
                  {results.length ? (
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                      {results.map((p, i) => (
                        <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05, ease: EASE }}>
                          <Link to={`/p/${p.slug}`} onClick={onClose} className="group block">
                            <SmartImage src={p.primary_img} alt={p.prod_name} className="aspect-square rounded-2xl" imgClassName="duration-700 group-hover:scale-105" />
                            <p className="mt-2 truncate text-sm font-bold text-ink-900">{p.prod_name}</p>
                            <p className="text-xs font-semibold text-ink-500">{priceLabel(p)}</p>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <p className="font-display text-2xl text-ink-400">Nothing woven by that name yet — try another word.</p>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
