import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AnimatePresence, motion, useInView } from 'framer-motion';
import confetti from 'canvas-confetti';
import { toast } from 'react-toastify';
import {
  FiArrowRight,
  FiCheck,
  FiCheckCircle,
  FiChevronLeft,
  FiChevronRight,
  FiFeather,
  FiMaximize2,
  FiRefreshCw,
  FiShoppingBag,
  FiTruck,
  FiXCircle,
  FiZap,
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import api from '../lib/api';
import { useGlobal } from '../context/GlobalContext';
import { recentlyViewed } from '../lib/cache';
import { isDistributor } from '../lib/userRole';
import { getDefaultVariationId } from '../lib/cart';
import { cleanTag, discountPercent, inr } from '../lib/format';
import { getBrandColor } from '../lib/theme';
import { SITE, whatsappLink } from '../config/site';
import { EASE } from '../lib/motion';
import { useTestimonials } from '../hooks/useTestimonials';
import Seo from '../components/Seo';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import SplitText from '../components/ui/SplitText';
import Stars from '../components/ui/Stars';
import Accordion from '../components/ui/Accordion';
import QuantityStepper from '../components/ui/QuantityStepper';
import Spinner from '../components/ui/Spinner';
import Modal from '../components/ui/Modal';
import EmptyState from '../components/ui/EmptyState';
import SectionHeading from '../components/ui/SectionHeading';
import WishlistButton from '../components/product/WishlistButton';
import DeliveryEstimate from '../components/product/DeliveryEstimate';
import ReviewsBlock from '../components/product/ReviewsBlock';
import ProductRail from '../components/product/ProductRail';

function Gallery({ images, name }) {
  const [index, setIndex] = useState(0);
  const [zoom, setZoom] = useState({ on: false, x: 50, y: 50 });
  const [lightbox, setLightbox] = useState(false);
  const key = images.join('|');

  useEffect(() => setIndex(0), [key]);

  const current = images[index] || images[0];
  const go = (d) => setIndex((i) => (i + d + images.length) % images.length);

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    setZoom({ on: true, x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
  };

  if (!images.length) return <div className="skeleton aspect-[4/5] rounded-[2rem]" />;

  return (
    <>
      <div className="flex flex-col-reverse gap-4 lg:flex-row">
        {images.length > 1 && (
          <div className="no-scrollbar flex gap-3 overflow-x-auto lg:w-24 lg:flex-col lg:overflow-y-auto">
            {images.map((img, i) => (
              <button
                key={img + i}
                onClick={() => setIndex(i)}
                aria-label={`View image ${i + 1}`}
                className={`aspect-[4/5] w-20 shrink-0 overflow-hidden rounded-2xl border-2 transition-all duration-300 lg:w-full ${
                  i === index ? 'border-ink-900' : 'border-transparent opacity-55 hover:opacity-100'
                }`}
              >
                <img src={img} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}

        <div className="relative flex-1">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-paper-200">
            <div
              className="absolute inset-0 transition-transform duration-500 ease-silk"
              style={{ transform: zoom.on ? 'scale(1.85)' : 'scale(1)', transformOrigin: `${zoom.x}% ${zoom.y}%` }}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={current}
                  src={current}
                  alt={name}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: EASE }}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </AnimatePresence>
            </div>

            <motion.div
              className="absolute inset-0 cursor-zoom-in"
              data-cursor="Zoom"
              drag={images.length > 1 ? 'x' : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.18}
              onDragEnd={(e, info) => {
                if (info.offset.x < -70) go(1);
                else if (info.offset.x > 70) go(-1);
              }}
              onTap={() => setLightbox(true)}
              onMouseMove={onMove}
              onMouseLeave={() => setZoom((z) => ({ ...z, on: false }))}
            />

            <button
              onClick={() => setLightbox(true)}
              aria-label="Open full screen"
              className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-paper/85 text-ink-800 backdrop-blur transition-transform hover:scale-110"
            >
              <FiMaximize2 size={16} />
            </button>

            {images.length > 1 && (
              <>
                <button
                  onClick={() => go(-1)}
                  aria-label="Previous image"
                  className="absolute left-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-paper/85 text-ink-800 backdrop-blur transition-transform hover:scale-110 md:grid"
                >
                  <FiChevronLeft />
                </button>
                <button
                  onClick={() => go(1)}
                  aria-label="Next image"
                  className="absolute right-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-paper/85 text-ink-800 backdrop-blur transition-transform hover:scale-110 md:grid"
                >
                  <FiChevronRight />
                </button>
                <div className="absolute inset-x-0 bottom-4 flex justify-center gap-1.5 md:hidden">
                  {images.map((_, i) => (
                    <span key={i} className={`h-1 rounded-full transition-all duration-500 ${i === index ? 'w-7 bg-ink-900' : 'w-3 bg-ink-900/25'}`} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <Modal open={lightbox} onClose={() => setLightbox(false)} size="xl">
        <img src={current} alt={name} className="max-h-[74vh] w-full rounded-2xl object-contain" />
        {images.length > 1 && (
          <div className="mt-5 flex items-center justify-center gap-4">
            <button onClick={() => go(-1)} aria-label="Previous" className="icon-btn border border-ink-900/10">
              <FiChevronLeft />
            </button>
            <span className="text-sm font-bold text-ink-500">
              {index + 1} / {images.length}
            </span>
            <button onClick={() => go(1)} aria-label="Next" className="icon-btn border border-ink-900/10">
              <FiChevronRight />
            </button>
          </div>
        )}
      </Modal>
    </>
  );
}

export default function ProductDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart, products } = useGlobal();
  const testimonials = useTestimonials();

  const [product, setProduct] = useState(() => recentlyViewed.find(slug));
  const [notFound, setNotFound] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);
  const [sizeError, setSizeError] = useState(false);
  const [qty, setQty] = useState(1);
  const [packQtyChoice, setPackQtyChoice] = useState(null);
  const [packTotal, setPackTotal] = useState(0);
  const [adding, setAdding] = useState(false);
  const [buying, setBuying] = useState(false);
  const [added, setAdded] = useState(false);
  const [sizeChartOpen, setSizeChartOpen] = useState(false);

  const actionsRef = useRef(null);
  const actionsInView = useInView(actionsRef, { margin: '-120px 0px -120px 0px' });

  // Show the cached copy instantly, then refresh from the API.
  useEffect(() => {
    let alive = true;
    const cached = recentlyViewed.find(slug);
    setProduct(cached);
    setNotFound(false);
    setSelectedSize(null);
    setQty(1);
    setAdded(false);

    api
      .get(`/api/v1/get_slug_data/${slug}`)
      .then(({ data }) => {
        if (!alive) return;
        if (data?.status && data.product_details) {
          setProduct(data.product_details);
          recentlyViewed.add(data.product_details);
        } else if (data?.status && data.category_data) {
          navigate(`/${slug}`, { replace: true });
        } else if (!cached) {
          setNotFound(true);
        }
      })
      .catch(() => {
        if (alive && !cached) setNotFound(true);
      });

    return () => {
      alive = false;
    };
  }, [slug, navigate]);

  const distributor = isDistributor();
  const variations = product?.product_variations || [];
  const sizeVariations = variations.filter((v) => v.size !== null && v.size !== '');
  const hasSizes = variations.some((v) => v.size_id !== null);
  const packVariations = variations.filter((v) => v.pack_price != null && v.pack_qty != null);
  const hasVariationPack = distributor && packVariations.length > 0;
  const hasBasePack = distributor && product?.pack_price != null && product?.pack_qty != null;
  const selectedVariation = variations.find((v) => v.id === selectedSize) || null;

  const activePack = useMemo(() => {
    if (!distributor) return product;
    if (selectedVariation) return selectedVariation;
    const fallbackId = getDefaultVariationId(product);
    return variations.find((v) => v.id === fallbackId) || product;
  }, [distributor, selectedVariation, product, variations]);

  const activePackQty = Number(activePack?.pack_qty || product?.pack_qty || 1) || 1;
  const quantityOptions = Array.from({ length: 10 }, (_, i) => (i + 1) * activePackQty);

  // Distributor price follows the selected pack, as in the reference.
  useEffect(() => {
    if (!product || !distributor) return;
    if (activePack?.pack_qty && activePack?.pack_price) {
      setPackQtyChoice(Number(activePack.pack_qty));
      setPackTotal(Number(activePack.pack_price));
    }
  }, [product, distributor, activePack]);

  const onPackQtyChange = (value) => {
    const q = Number(value);
    setPackQtyChoice(q);
    const perPiece = activePack?.pack_qty ? Number(activePack.pack_price) / Number(activePack.pack_qty) : 0;
    setPackTotal(perPiece * q);
  };

  const price = Number(selectedVariation?.sale_price || product?.sale_price || product?.regular_price || 0);
  const regular = Number(selectedVariation?.regular_price || product?.regular_price || 0);
  const off = discountPercent(regular, price);
  const stock = selectedVariation ? Number(selectedVariation.stock_qty) : Number(product?.stock_qty ?? 0);
  const soldOut = !variations.length && Number(product?.stock_qty) <= 0;
  const maxQty = Math.max(1, Math.min(10, stock > 0 ? stock : 10));

  const images = useMemo(() => {
    if (!product) return [];
    const list = [product.primary_img, product.secondary_img, ...(product.product_image_list || []).map((i) => i.prod_img_url)];
    return [...new Set(list.filter((x) => x && x !== 'null'))];
  }, [product]);

  const reviews = product?.product_ratings || [];
  const avg = reviews.length ? reviews.reduce((s, r) => s + Number(r.rating || 0), 0) / reviews.length : 0;
  const cats = product?.product_categories || [];
  const category = cats[cats.length - 1];
  const highlights = product?.product_key_highlights || [];

  const related = useMemo(() => {
    if (!product) return [];
    const ids = cats.map((c) => c.id);
    const same = products.filter((p) => p.id !== product.id && p.product_categories?.some((c) => ids.includes(c.id)));
    const others = products.filter((p) => p.id !== product.id && !same.some((s) => s.id === p.id));
    return [...same, ...others].slice(0, 8);
  }, [product, products, cats]);

  const recent = recentlyViewed.list().filter((p) => p.slug !== slug).slice(0, 8);

  const celebrate = () =>
    confetti({ particleCount: 90, spread: 72, origin: { y: 0.62 }, scalar: 0.9, colors: [getBrandColor(), '#E0408C', '#FAF7EF', '#171B14'] });

  const handleAdd = async () => {
    const needsSelection = (!distributor && hasSizes) || (distributor && packVariations.length > 0);
    if (needsSelection && !selectedSize) {
      setSizeError(true);
      setTimeout(() => setSizeError(false), 3500);
      return false;
    }
    const quantity = distributor ? Number(packQtyChoice) || Number(activePack?.pack_qty) || 1 : qty;
    const res = await addToCart(product, selectedSize, quantity);
    if (res.ok) {
      setAdded(true);
      celebrate();
      toast.success(`${product.prod_name} added to your bag`);
    } else {
      toast.error(res.message);
    }
    return res.ok;
  };

  if (notFound) {
    return (
      <div className="container-x py-24">
        <EmptyState
          icon={FiFeather}
          title="We couldn't find that piece."
          text="It may have been sold or renamed. Explore the rest of the collection instead."
          action={
            <Link to="/products" className="btn-primary">
              Browse the collection
            </Link>
          }
        />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container-x grid gap-10 py-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <div className="skeleton aspect-[4/5] rounded-[2rem]" />
        </div>
        <div className="space-y-4 lg:col-span-5">
          <div className="skeleton h-4 w-24" />
          <div className="skeleton h-12 w-3/4" />
          <div className="skeleton h-8 w-40" />
          <div className="skeleton h-24 w-full" />
          <div className="skeleton h-14 w-full rounded-full" />
        </div>
      </div>
    );
  }

  const showPackControls = hasVariationPack || hasBasePack;

  return (
    <>
      <Seo title={product.prod_name} description={product.prod_desc} image={product.primary_img} seo={product.seo_metadata} type="product" />

      <div className="container-x pt-8">
        <Breadcrumbs
          items={[
            { label: 'Shop', to: '/products' },
            ...(category ? [{ label: category.category_name, to: `/${category.slug}` }] : []),
            { label: product.prod_name },
          ]}
        />
      </div>

      <section className="container-x grid gap-10 pb-16 pt-8 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-7">
          <div className="lg:sticky lg:top-[calc(var(--nav-h)+1.5rem)]">
            <Gallery images={images} name={product.prod_name} />
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="flex flex-wrap items-center gap-3">
            {product.brand_details?.brand_name && (
              <span className="text-[10px] font-extrabold uppercase tracking-[0.24em] text-ink-400">{product.brand_details.brand_name}</span>
            )}
            {reviews.length > 0 && (
              <a href="#reviews" className="inline-flex items-center gap-1.5 rounded-full bg-brand-100 px-3 py-1 text-xs font-extrabold text-brand-900">
                <Stars value={avg} size={11} /> {avg.toFixed(1)} ({reviews.length})
              </a>
            )}
          </div>

          <SplitText as="h1" inView={false} text={product.prod_name} className="h-display mt-4 text-4xl text-ink-900 md:text-5xl" />

          {!distributor ? (
            <div className="mt-6 flex flex-wrap items-end gap-3">
              <span className="font-display text-4xl text-ink-900">{inr(price)}</span>
              {off > 0 && (
                <>
                  <span className="text-lg text-ink-400 line-through">{inr(regular)}</span>
                  <span className="chip bg-brand-500 py-1.5 text-brand-on">{off}% off</span>
                </>
              )}
            </div>
          ) : showPackControls ? (
            <div className="mt-6">
              <p className="font-display text-4xl text-ink-900">{inr(packTotal)}</p>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <span className="label mb-0">Quantity</span>
                <select
                  disabled={packVariations.length > 0 && !selectedSize}
                  value={packQtyChoice || ''}
                  onChange={(e) => onPackQtyChange(e.target.value)}
                  className="input w-auto py-2.5 disabled:opacity-50"
                >
                  {quantityOptions.map((q) => (
                    <option key={q} value={q}>
                      {q} pieces
                    </option>
                  ))}
                </select>
              </div>
              {packVariations.length > 0 && !selectedSize && (
                <p className="mt-2 text-xs font-semibold text-amber-600">Select a pack size below to choose your quantity.</p>
              )}
            </div>
          ) : (
            <p className="mt-6 font-display text-4xl text-ink-900">{inr(price)}</p>
          )}

          <p className="mt-2 text-xs font-semibold text-ink-400">Inclusive of all taxes</p>

          {(cleanTag(product.product_tag) || cleanTag(product.product_quality)) && (
            <div className="mt-5 flex flex-wrap gap-2">
              {cleanTag(product.product_tag) && <span className="chip bg-brand-100 py-1.5 text-brand-900">{product.product_tag}</span>}
              {cleanTag(product.product_quality) && <span className="chip bg-ink-900/[0.06] py-1.5 text-ink-700">{product.product_quality}</span>}
            </div>
          )}

          {product.color_details?.id && (
            <div className="mt-8 border-t border-ink-900/10 pt-6">
              <p className="text-sm font-extrabold text-ink-900">
                Colour: <span className="font-semibold text-ink-500">{product.color_details.color_name}</span>
              </p>
              <div className="mt-3 flex items-center gap-2.5">
                <span className="grid h-9 w-9 place-items-center rounded-full border-2 border-ink-900 p-1">
                  <span className="h-full w-full rounded-full" style={{ background: product.color_details.color_code }} />
                </span>
                {variations
                  .filter((v) => v.color && v.color_page_link && v.color_page_link !== 'null')
                  .map((v) => (
                    <Link
                      key={v.id}
                      to={v.color_page_link}
                      aria-label={`Colour ${v.color}`}
                      className="h-8 w-8 rounded-full border-2 border-ink-900/10 transition-transform hover:scale-110"
                      style={{ background: v.color }}
                    />
                  ))}
              </div>
            </div>
          )}

          {!distributor && sizeVariations.length > 0 && (
            <div className="mt-8 border-t border-ink-900/10 pt-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-extrabold text-ink-900">Select size</p>
                {product.size_chart_details?.chart_image && (
                  <button onClick={() => setSizeChartOpen(true)} className="text-xs font-extrabold uppercase tracking-wider text-brand-800 underline underline-offset-4">
                    Size guide
                  </button>
                )}
              </div>

              <AnimatePresence>
                {sizeError && (
                  <motion.p
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-3 rounded-xl bg-rose-50 px-3.5 py-2.5 text-xs font-bold text-rose-600"
                  >
                    Please choose a size to continue.
                  </motion.p>
                )}
              </AnimatePresence>

              <div className="mt-4 flex flex-wrap gap-2.5">
                {sizeVariations.map((v) => {
                  const out = Number(v.stock_qty) === 0;
                  const low = Number(v.stock_qty) > 0 && Number(v.stock_qty) < 5;
                  const active = selectedSize === v.id;
                  return (
                    <div key={v.id} className="text-center">
                      <button
                        type="button"
                        disabled={out}
                        onClick={() => {
                          setSelectedSize(v.id);
                          setSizeError(false);
                        }}
                        className={`h-12 min-w-[3.25rem] rounded-2xl border px-4 text-sm font-bold transition-all duration-300 ${
                          active ? 'border-ink-900 bg-ink-900 text-paper' : 'border-ink-900/10 bg-white text-ink-800 hover:border-ink-900'
                        } ${out ? 'cursor-not-allowed opacity-35 line-through' : ''}`}
                      >
                        {v.size}
                      </button>
                      {low && <p className="mt-1 text-[10px] font-bold text-rose-500">{v.stock_qty} left</p>}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {hasVariationPack && (
            <div className="mt-8 border-t border-ink-900/10 pt-6">
              <p className="text-sm font-extrabold text-ink-900">Select pack size</p>
              {sizeError && <p className="mt-3 rounded-xl bg-rose-50 px-3.5 py-2.5 text-xs font-bold text-rose-600">Please choose a pack size to continue.</p>}
              <div className="mt-4 flex flex-wrap gap-2.5">
                {packVariations.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => {
                      setSelectedSize(v.id);
                      setSizeError(false);
                    }}
                    className={`h-12 rounded-2xl border px-4 text-sm font-bold transition-all ${
                      selectedSize === v.id ? 'border-ink-900 bg-ink-900 text-paper' : 'border-ink-900/10 bg-white text-ink-800 hover:border-ink-900'
                    }`}
                  >
                    {v.size || `Pack of ${v.pack_qty}`}
                  </button>
                ))}
              </div>
            </div>
          )}

          {!distributor && !soldOut && (
            <div className="mt-8 flex items-center gap-4 border-t border-ink-900/10 pt-6">
              <span className="label mb-0">Quantity</span>
              <QuantityStepper value={qty} onChange={setQty} min={1} max={maxQty} />
              {stock > 0 && stock < 5 && <span className="text-xs font-bold text-rose-500">Only {stock} left</span>}
            </div>
          )}

          <div ref={actionsRef} className="mt-8 flex flex-wrap items-center gap-3">
            {soldOut ? (
              <>
                <button disabled className="btn-dark flex-1 opacity-60">
                  Sold out
                </button>
                <a
                  href={whatsappLink(`Hello Craft & Weft, is "${product.prod_name}" available again?`)}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-outline"
                >
                  <FaWhatsapp /> Ask us
                </a>
              </>
            ) : (
              <>
                <button
                  onClick={async () => {
                    if (added) {
                      navigate('/cart');
                      return;
                    }
                    setAdding(true);
                    try {
                      await handleAdd();
                    } finally {
                      setAdding(false);
                    }
                  }}
                  disabled={adding}
                  className={`flex-1 ${added ? 'btn-dark' : 'btn-primary'} px-6 py-4`}
                >
                  {adding ? <Spinner /> : added ? <FiCheck size={17} /> : <FiShoppingBag size={17} />}
                  {added ? 'Go to bag' : 'Add to bag'}
                  {added && <FiArrowRight />}
                </button>
                <button
                  onClick={async () => {
                    setBuying(true);
                    try {
                      const ok = await handleAdd();
                      if (ok) setTimeout(() => navigate('/checkout'), 700);
                    } finally {
                      setBuying(false);
                    }
                  }}
                  disabled={buying}
                  className="btn-dark px-6 py-4"
                >
                  {buying ? <Spinner light /> : <FiZap className="text-brand-300" size={17} />}
                  Buy now
                </button>
              </>
            )}
            <WishlistButton product={product} variant="button" className="px-5 py-4" />
          </div>

          <div className="mt-8 grid gap-3 rounded-[1.5rem] bg-white/70 p-6 sm:grid-cols-2">
            <span className="flex items-center gap-2.5 text-sm font-semibold text-ink-700">
              {Number(product.is_returnable) === 1 ? <FiRefreshCw className="text-brand-700" /> : <FiXCircle className="text-ink-300" />}
              {Number(product.is_returnable) === 1 ? 'Easy returns' : 'Not returnable'}
            </span>
            <span className="flex items-center gap-2.5 text-sm font-semibold text-ink-700">
              {Number(product.is_cod) === 1 ? <FiCheckCircle className="text-brand-700" /> : <FiXCircle className="text-ink-300" />}
              {Number(product.is_cod) === 1 ? 'Cash on delivery' : 'Prepaid only'}
            </span>
            <span className="flex items-center gap-2.5 text-sm font-semibold text-ink-700">
              <FiTruck className="text-brand-700" /> Free shipping in India
            </span>
            <span className="flex items-center gap-2.5 text-sm font-semibold text-ink-700">
              <FiFeather className="text-brand-700" /> Handmade in Bengal
            </span>
          </div>

          <div className="mt-6 rounded-[1.5rem] bg-white/70 p-6">
            <DeliveryEstimate />
          </div>

          <Accordion
            className="mt-8"
            items={[
              {
                title: 'Description',
                content: <p className="whitespace-pre-line">{product.prod_desc || 'A handcrafted piece from our artisan clusters in Bengal.'}</p>,
              },
              ...(highlights.length
                ? [
                    {
                      title: 'Details',
                      content: (
                        <dl className="grid gap-4 sm:grid-cols-2">
                          {highlights.map((h) => (
                            <div key={h.id || h.label}>
                              <dt className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-ink-400">{h.label}</dt>
                              <dd className="mt-1 text-sm font-semibold text-ink-800">{h.value}</dd>
                            </div>
                          ))}
                        </dl>
                      ),
                    },
                  ]
                : []),
              { title: 'Care', content: <p>{SITE.care}</p> },
              {
                title: 'Shipping & returns',
                content: (
                  <p>
                    Free shipping across India, usually dispatched in 2–3 working days. Cash on delivery carries a ₹20 collection charge. See our{' '}
                    <Link to="/return-policy">return policy</Link> for how returns and refunds work.
                  </p>
                ),
              },
            ]}
          />
        </div>
      </section>

      <section id="reviews" className="container-x py-16">
        <SectionHeading eyebrow="Reviews" title="What people *say*" size="md" />
        <div className="mt-10">
          <ReviewsBlock reviews={reviews} testimonials={testimonials} />
        </div>
      </section>

      {related.length > 0 && <ProductRail eyebrow="You may also like" title="Woven to go *together*" products={related} className="pb-8" />}
      {recent.length > 0 && <ProductRail eyebrow="Recently viewed" title="Back to what caught *your eye*" products={recent} className="pb-20" />}

      <Modal open={sizeChartOpen} onClose={() => setSizeChartOpen(false)} title="Size guide" size="lg">
        <img src={product.size_chart_details?.chart_image} alt="Size chart" className="w-full rounded-2xl" />
      </Modal>

      <AnimatePresence>
        {!actionsInView && !soldOut && (
          <motion.div
            initial={{ y: 120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 120, opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="fixed inset-x-3 bottom-[5.25rem] z-[65] flex items-center gap-3 rounded-[1.5rem] border border-ink-900/5 bg-paper-50/95 p-3 shadow-lift backdrop-blur-xl md:hidden"
          >
            <div className="min-w-0 flex-1 pl-2">
              <p className="truncate text-xs font-bold text-ink-500">{product.prod_name}</p>
              <p className="font-display text-xl text-ink-900">{distributor && showPackControls ? inr(packTotal) : inr(price)}</p>
            </div>
            <button
              onClick={async () => {
                if (added) {
                  navigate('/cart');
                  return;
                }
                setAdding(true);
                try {
                  await handleAdd();
                } finally {
                  setAdding(false);
                }
              }}
              disabled={adding}
              className="btn-primary shrink-0"
            >
              {adding ? <Spinner /> : added ? <FiCheck /> : <FiShoppingBag size={16} />}
              {added ? 'Go to bag' : 'Add to bag'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
