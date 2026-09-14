import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { FiCheck, FiChevronDown, FiFeather, FiSliders, FiX } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import api from '../lib/api';
import { useGlobal } from '../context/GlobalContext';
import { isDistributor } from '../lib/userRole';
import { inr } from '../lib/format';
import { EASE } from '../lib/motion';
import { whatsappLink } from '../config/site';
import Seo from '../components/Seo';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import SplitText from '../components/ui/SplitText';
import Reveal from '../components/ui/Reveal';
import Modal from '../components/ui/Modal';
import EmptyState from '../components/ui/EmptyState';
import SmartImage from '../components/ui/SmartImage';
import ProductCard, { ProductCardSkeleton } from '../components/product/ProductCard';

const TEA_SLUGS = ['tea', 'connoisseurs-choice', 'signature-blends'];

const SORTS = [
  { value: 'popularity', label: 'Popularity' },
  { value: 'newArrival', label: 'New arrivals' },
  { value: 'priceLowToHigh', label: 'Price: low to high' },
  { value: 'priceHighToLow', label: 'Price: high to low' },
];

const PRICE_BANDS = [
  { id: 'u500', label: `Under ${inr(500)}`, test: (p) => p < 500 },
  { id: '500-1000', label: `${inr(500)} – ${inr(1000)}`, test: (p) => p >= 500 && p <= 1000 },
  { id: '1000-2000', label: `${inr(1000)} – ${inr(2000)}`, test: (p) => p > 1000 && p <= 2000 },
  { id: 'o2000', label: `Above ${inr(2000)}`, test: (p) => p > 2000 },
];

const EMPTY_FILTERS = { size: [], brand: [], color_id: [], price: null };

const avgRating = (p) => {
  const r = Array.isArray(p.product_ratings) ? p.product_ratings : [];
  return r.length ? r.reduce((s, x) => s + Number(x.rating || 0), 0) / r.length : 0;
};

function FilterPanel({ facets, filters, toggle, setPrice, clear, activeCount }) {
  const section = 'border-b border-ink-900/10 pb-6 mb-6 last:mb-0 last:border-0 last:pb-0';
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <p className="font-display text-2xl">Refine</p>
        {activeCount > 0 && (
          <button onClick={clear} className="text-xs font-extrabold uppercase tracking-wider text-ink-500 underline underline-offset-4 hover:text-ink-900">
            Clear all
          </button>
        )}
      </div>

      <div className={section}>
        <p className="label">Price</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {PRICE_BANDS.map((b) => (
            <button
              key={b.id}
              onClick={() => setPrice(filters.price === b.id ? null : b.id)}
              className={`rounded-full border px-3.5 py-2 text-xs font-bold transition-colors ${
                filters.price === b.id ? 'border-ink-900 bg-ink-900 text-paper' : 'border-ink-900/10 bg-white text-ink-700 hover:border-ink-900/40'
              }`}
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>

      {facets.sizes.length > 0 && (
        <div className={section}>
          <p className="label">Size</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {facets.sizes.map((s) => (
              <button
                key={s}
                onClick={() => toggle('size', s)}
                className={`min-w-[2.75rem] rounded-xl border px-3 py-2 text-xs font-bold transition-colors ${
                  filters.size.includes(s) ? 'border-ink-900 bg-ink-900 text-paper' : 'border-ink-900/10 bg-white text-ink-700 hover:border-ink-900/40'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {facets.brands.length > 1 && (
        <div className={section}>
          <p className="label">Brand</p>
          <div className="mt-3 space-y-2.5">
            {facets.brands.map((b) => {
              const on = filters.brand.includes(b);
              return (
                <button key={b} onClick={() => toggle('brand', b)} className="flex items-center gap-3 text-sm font-semibold text-ink-700">
                  <span className={`grid h-5 w-5 place-items-center rounded-md border transition-colors ${on ? 'border-ink-900 bg-ink-900 text-paper' : 'border-ink-900/20'}`}>
                    {on && <FiCheck size={12} />}
                  </span>
                  {b}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {facets.colors.length > 0 && (
        <div className={section}>
          <p className="label">Colour</p>
          <div className="mt-3 flex flex-wrap gap-2.5">
            {facets.colors.map((c) => (
              <button
                key={c.id}
                title={c.name}
                aria-label={c.name}
                onClick={() => toggle('color_id', c.id)}
                className={`h-8 w-8 rounded-full border-2 transition-transform ${filters.color_id.includes(c.id) ? 'scale-110 border-ink-900' : 'border-white shadow'}`}
                style={{ background: c.code }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Shop({ showAll = false }) {
  const { categorySlug } = useParams();
  const navigate = useNavigate();
  const { products: allProducts, productsLoading, categoryTree } = useGlobal();

  const [meta, setMeta] = useState(null); // { name, desc, image, banner, children, seo }
  const [catProducts, setCatProducts] = useState([]);
  const [loading, setLoading] = useState(!showAll);
  const [slow, setSlow] = useState(false);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [sort, setSort] = useState('popularity');
  const [sortOpen, setSortOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    setFilters(EMPTY_FILTERS);
    if (showAll) {
      setMeta(null);
      setLoading(false);
      return undefined;
    }
    let alive = true;
    setLoading(true);
    api
      .get(`/api/v1/get_slug_data/${categorySlug}`)
      .then(({ data }) => {
        if (!alive) return;
        if (data?.status && data.category_data) {
          const c = data.category_data;
          setMeta({ name: c.category_name, desc: c.cat_desc, image: c.cat_img, banner: c.cat_banner, id: c.id, children: c.child_categories || [], seo: c.seo_metadata });
          setCatProducts(data.products || []);
        } else if (data?.status && data.brand_data) {
          const b = data.brand_data;
          setMeta({ name: b.brand_name, desc: b.brand_desc, children: [] });
          setCatProducts(data.products || []);
        } else if (data?.status && data.product_details) {
          navigate(`/p/${categorySlug}`, { replace: true });
        } else {
          navigate('/404', { replace: true });
        }
      })
      .catch(() => alive && navigate('/404', { replace: true }))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [categorySlug, showAll, navigate]);

  const isLoading = showAll ? productsLoading : loading;

  // A retry prompt if a fetch hangs (as in the reference ProductPage).
  useEffect(() => {
    if (!isLoading) {
      setSlow(false);
      return undefined;
    }
    const t = setTimeout(() => setSlow(true), 10000);
    return () => clearTimeout(t);
  }, [isLoading]);

  const source = showAll ? allProducts : catProducts;

  const facets = useMemo(() => {
    const sizes = new Map();
    const brands = new Set();
    const colors = new Map();
    source.forEach((p) => {
      (p.product_variations || []).forEach((v) => v?.size_id && v?.size && sizes.set(v.size_id, v.size));
      if (p.brand_details?.brand_name) brands.add(p.brand_details.brand_name);
      if (p.color_details?.id) colors.set(Number(p.color_details.id), { id: Number(p.color_details.id), name: p.color_details.color_name, code: p.color_details.color_code || '#000' });
    });
    return { sizes: [...new Set(sizes.values())], brands: [...brands], colors: [...colors.values()] };
  }, [source]);

  const visible = useMemo(() => {
    const band = PRICE_BANDS.find((b) => b.id === filters.price);
    const list = source.filter((p) => {
      if (isDistributor()) return p.pack_price != null && p.pack_qty != null;
      const matchesSize = !filters.size.length || p.product_variations?.some((v) => filters.size.includes(v.size));
      const matchesBrand = !filters.brand.length || filters.brand.includes(p.brand_details?.brand_name);
      const matchesColor = !filters.color_id.length || (p.color_id && filters.color_id.includes(Number(p.color_id)));
      const matchesPrice = !band || band.test(Number(p.sale_price || p.regular_price || 0));
      return matchesSize && matchesBrand && matchesColor && matchesPrice;
    });
    const sorted = [...list];
    if (sort === 'popularity') sorted.sort((a, b) => avgRating(b) - avgRating(a) || (b.product_ratings?.length || 0) - (a.product_ratings?.length || 0));
    if (sort === 'newArrival') sorted.sort((a, b) => new Date(b.updated_at || 0) - new Date(a.updated_at || 0));
    if (sort === 'priceLowToHigh') sorted.sort((a, b) => parseFloat(a.sale_price) - parseFloat(b.sale_price));
    if (sort === 'priceHighToLow') sorted.sort((a, b) => parseFloat(b.sale_price) - parseFloat(a.sale_price));
    return sorted;
  }, [source, filters, sort]);

  const toggle = (key, value) =>
    setFilters((f) => ({ ...f, [key]: f[key].includes(value) ? f[key].filter((v) => v !== value) : [...f[key], value] }));
  const setPrice = (price) => setFilters((f) => ({ ...f, price }));
  const clear = () => setFilters(EMPTY_FILTERS);
  const activeCount = filters.size.length + filters.brand.length + filters.color_id.length + (filters.price ? 1 : 0);

  // Sub-navigation: children of this category, else its siblings, else top level.
  const parent = meta?.id ? categoryTree.find((t) => t.children?.some((c) => c.id === meta.id)) : null;
  const chips = showAll
    ? categoryTree.flatMap((c) => [c, ...(c.children || [])])
    : meta?.children?.length
      ? meta.children
      : parent
        ? [parent, ...parent.children]
        : categoryTree;
  const countFor = (id) => categoryTree.flatMap((c) => [c, ...(c.children || [])]).find((c) => c.id === id)?.product_count;

  const title = showAll ? 'The *Collection*' : meta?.name || '';
  const description = showAll
    ? 'Sarees, jackets, fabric accessories, home décor and SPHOORA teas — crafted with wisdom, sourced with care, made in India.'
    : meta?.desc || '';

  return (
    <>
      <Seo title={showAll ? 'Shop all' : meta?.name} description={description} seo={meta?.seo} image={meta?.image} />

      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -right-40 -top-40 h-[28rem] w-[28rem] rounded-full bg-brand-200/60 blur-[120px]" />
        <div className="container-x relative pb-10 pt-10 md:pt-14">
          <Breadcrumbs items={showAll ? [{ label: 'Shop' }] : [{ label: 'Shop', to: '/products' }, ...(parent ? [{ label: parent.category_name, to: `/${parent.slug}` }] : []), { label: meta?.name || '…' }]} />
          <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              {title ? (
                <SplitText key={title} as="h1" inView={false} text={title} className="h-display text-[3.4rem] text-ink-900 sm:text-7xl lg:text-8xl" />
              ) : (
                <div className="skeleton h-20 w-2/3" />
              )}
              {description && (
                <Reveal as="p" delay={0.3} className="mt-6 max-w-xl text-[15px] leading-7 text-ink-500">
                  {description}
                </Reveal>
              )}
            </div>
            <div className="hidden lg:col-span-4 lg:flex lg:justify-end">
              {!showAll && meta?.image && (
                <motion.div
                  initial={{ clipPath: 'inset(100% 0% 0% 0%)' }}
                  animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
                  transition={{ duration: 1.2, ease: EASE, delay: 0.2 }}
                  className="h-52 w-40 overflow-hidden rounded-arch shadow-lift"
                >
                  <SmartImage src={meta.image} alt={meta.name} className="h-full w-full" />
                </motion.div>
              )}
            </div>
          </div>

          {chips.length > 0 && (
            <div className="no-scrollbar -mx-5 mt-10 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:px-0">
              <Link
                to="/products"
                className={`shrink-0 rounded-full border px-5 py-2.5 text-sm font-bold transition-colors ${showAll ? 'border-ink-900 bg-ink-900 text-paper' : 'border-ink-900/10 bg-white text-ink-700 hover:border-ink-900/40'}`}
              >
                All
              </Link>
              {chips.map((c) => {
                const active = !showAll && c.slug === categorySlug;
                const count = countFor(c.id);
                return (
                  <Link
                    key={c.id}
                    to={`/${c.slug}`}
                    className={`shrink-0 rounded-full border px-5 py-2.5 text-sm font-bold transition-colors ${active ? 'border-ink-900 bg-ink-900 text-paper' : 'border-ink-900/10 bg-white text-ink-700 hover:border-ink-900/40'}`}
                  >
                    {c.category_name}
                    {count ? <span className={`ml-2 text-xs ${active ? 'text-paper/60' : 'text-ink-400'}`}>{count}</span> : null}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {meta?.banner && (
        <div className="container-x">
          <SmartImage src={meta.banner} alt={meta.name} className="aspect-[21/7] rounded-[2rem]" />
        </div>
      )}

      <section className="container-x pb-24 pt-6">
        <div className="sticky top-[var(--nav-h)] z-30 -mx-5 mb-8 flex items-center justify-between gap-3 border-y border-ink-900/10 bg-paper/85 px-5 py-3 backdrop-blur-xl sm:mx-0 sm:rounded-full sm:border sm:px-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setFilterOpen(true)} className="btn-outline btn-sm lg:hidden">
              <FiSliders /> Filters {activeCount > 0 && <span className="grid h-5 w-5 place-items-center rounded-full bg-ink-900 text-[10px] text-paper">{activeCount}</span>}
            </button>
            <p className="text-sm font-semibold text-ink-500">
              <span className="font-extrabold text-ink-900">{isLoading ? '—' : visible.length}</span> piece{visible.length === 1 ? '' : 's'}
            </p>
          </div>

          <div className="relative">
            <button onClick={() => setSortOpen((v) => !v)} className="btn-outline btn-sm" aria-expanded={sortOpen}>
              <span className="hidden sm:inline text-ink-400">Sort:</span> {SORTS.find((s) => s.value === sort)?.label}
              <FiChevronDown className={`transition-transform ${sortOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {sortOpen && (
                <>
                  <button aria-label="Close" className="fixed inset-0 z-10 cursor-default" onClick={() => setSortOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.97 }}
                    transition={{ duration: 0.25, ease: EASE }}
                    className="absolute right-0 z-20 mt-2 w-56 origin-top-right rounded-2xl border border-ink-900/5 bg-paper-50 p-2 shadow-lift"
                  >
                    {SORTS.map((s) => (
                      <button
                        key={s.value}
                        onClick={() => {
                          setSort(s.value);
                          setSortOpen(false);
                        }}
                        className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-left text-sm font-semibold transition-colors ${sort === s.value ? 'bg-brand-100 text-ink-900' : 'text-ink-600 hover:bg-ink-900/5'}`}
                      >
                        {s.label}
                        {sort === s.value && <FiCheck />}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>

        {activeCount > 0 && (
          <div className="mb-8 flex flex-wrap items-center gap-2">
            {filters.price && (
              <button onClick={() => setPrice(null)} className="chip bg-ink-900 py-2 text-paper">
                {PRICE_BANDS.find((b) => b.id === filters.price)?.label} <FiX />
              </button>
            )}
            {filters.size.map((s) => (
              <button key={s} onClick={() => toggle('size', s)} className="chip bg-ink-900 py-2 text-paper">
                Size {s} <FiX />
              </button>
            ))}
            {filters.brand.map((b) => (
              <button key={b} onClick={() => toggle('brand', b)} className="chip bg-ink-900 py-2 text-paper">
                {b} <FiX />
              </button>
            ))}
            {filters.color_id.map((c) => (
              <button key={c} onClick={() => toggle('color_id', c)} className="chip bg-ink-900 py-2 text-paper">
                {facets.colors.find((x) => x.id === c)?.name || 'Colour'} <FiX />
              </button>
            ))}
          </div>
        )}

        <div className="grid gap-10 lg:grid-cols-12">
          <aside className="hidden lg:col-span-3 lg:block">
            <div className="card sticky top-[calc(var(--nav-h)+5.5rem)] p-7">
              <FilterPanel facets={facets} filters={filters} toggle={toggle} setPrice={setPrice} clear={clear} activeCount={activeCount} />
            </div>
          </aside>

          <div className="lg:col-span-9">
            {isLoading ? (
              <>
                <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:gap-x-6 xl:grid-cols-3">
                  {Array.from({ length: 6 }, (_, i) => (
                    <ProductCardSkeleton key={i} />
                  ))}
                </div>
                {slow && (
                  <div className="mt-10 text-center">
                    <p className="text-sm text-ink-500">This is taking longer than usual.</p>
                    <button onClick={() => window.location.reload()} className="btn-dark btn-sm mt-3">
                      Try again
                    </button>
                  </div>
                )}
              </>
            ) : source.length === 0 && TEA_SLUGS.includes(categorySlug) ? (
              <EmptyState
                icon={FiFeather}
                title="These teas are steeping."
                text="SPHOORA teas are being packed in 50 g, 100 g and 200 g right now. Meet the blends, or message us to order ahead."
                action={
                  <>
                    <Link to="/tea" className="btn-primary">
                      Meet the teas
                    </Link>
                    <a href={whatsappLink(`Hello Craft & Weft, I'm interested in SPHOORA ${meta?.name || 'teas'}.`)} target="_blank" rel="noreferrer" className="btn-outline">
                      <FaWhatsapp /> Ask on WhatsApp
                    </a>
                  </>
                }
              />
            ) : source.length === 0 ? (
              <EmptyState
                icon={FiFeather}
                title="New pieces are on the loom."
                text="This collection is being woven right now. Meanwhile, explore what's ready — or message us for bulk and custom orders."
                action={
                  <>
                    <Link to="/products" className="btn-primary">
                      Explore the collection
                    </Link>
                    <a href={whatsappLink(`Hello Craft & Weft, I'm interested in ${meta?.name || 'your products'}.`)} target="_blank" rel="noreferrer" className="btn-outline">
                      <FaWhatsapp /> Ask on WhatsApp
                    </a>
                  </>
                }
              />
            ) : visible.length === 0 ? (
              <EmptyState
                icon={FiSliders}
                title="No pieces match these filters."
                text="Try removing a filter or two."
                action={
                  <button onClick={clear} className="btn-dark">
                    Clear filters
                  </button>
                }
              />
            ) : (
              <motion.div layout className="grid grid-cols-2 gap-x-4 gap-y-12 md:gap-x-6 xl:grid-cols-3">
                <AnimatePresence mode="popLayout">
                  {visible.map((p, i) => (
                    <motion.div
                      key={p.id}
                      layout
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.94 }}
                      transition={{ duration: 0.45, ease: EASE }}
                    >
                      <ProductCard product={p} index={i} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      <Modal open={filterOpen} onClose={() => setFilterOpen(false)} size="md">
        <FilterPanel facets={facets} filters={filters} toggle={toggle} setPrice={setPrice} clear={clear} activeCount={activeCount} />
        <button onClick={() => setFilterOpen(false)} className="btn-primary mt-8 w-full">
          Show {visible.length} piece{visible.length === 1 ? '' : 's'}
        </button>
      </Modal>
    </>
  );
}
