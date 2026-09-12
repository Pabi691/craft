import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCheck, FiPlus, FiShoppingBag } from 'react-icons/fi';
import { toast } from 'react-toastify';
import SmartImage from '../ui/SmartImage';
import Stars from '../ui/Stars';
import Spinner from '../ui/Spinner';
import WishlistButton from './WishlistButton';
import { useGlobal } from '../../context/GlobalContext';
import { cleanTag, discountPercent, inr } from '../../lib/format';
import { isDistributor } from '../../lib/userRole';
import { productPackInfo } from '../../lib/cart';
import { EASE } from '../../lib/motion';

export default function ProductCard({ product, index = 0, className = '' }) {
  const { addToCart } = useGlobal();
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const ratings = Array.isArray(product.product_ratings) ? product.product_ratings : [];
  const avg = ratings.length ? ratings.reduce((s, r) => s + Number(r.rating || 0), 0) / ratings.length : 0;
  const off = discountPercent(product.regular_price, product.sale_price);
  const tag = cleanTag(product.product_tag);
  const cats = product.product_categories || [];
  const category = cats[cats.length - 1]?.category_name;
  const variations = product.product_variations || [];
  const needsSize = variations.filter((v) => v.size_id !== null).length > 1;
  const soldOut = !variations.length && Number(product.stock_qty) <= 0;
  const distributor = isDistributor();
  const { packPrice, packQty } = productPackInfo(product);

  const quickAdd = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (needsSize) {
      navigate(`/p/${product.slug}`);
      return;
    }
    setAdding(true);
    const res = await addToCart(product);
    setAdding(false);
    if (res.ok) {
      setAdded(true);
      toast.success(`${product.prod_name} added to your bag`);
      setTimeout(() => setAdded(false), 1800);
    } else {
      toast.error(res.message);
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 44 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.85, delay: (index % 4) * 0.08, ease: EASE }}
      className={`group relative ${className}`}
    >
      <div className="relative overflow-hidden rounded-[1.6rem] bg-paper-200">
        <Link to={`/p/${product.slug}`} data-cursor="View" className="block" aria-label={product.prod_name}>
          <SmartImage src={product.primary_img} alt={product.prod_name} className="aspect-[4/5]" imgClassName="duration-[1300ms] group-hover:scale-[1.07]" />
          {product.secondary_img ? (
            <img src={product.secondary_img} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
          ) : null}
          <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/30 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        </Link>

        <div className="pointer-events-none absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {soldOut && <span className="chip bg-ink-900 text-paper">Sold out</span>}
          {Number(product.is_sale) === 1 && <span className="chip bg-accent text-white">Sale</span>}
          {off > 0 && <span className="chip bg-ink-900 text-paper">−{off}%</span>}
          {tag && <span className="chip bg-paper/85 text-ink-800 backdrop-blur">{tag}</span>}
        </div>

        <div className="absolute right-3 top-3 z-10">
          <WishlistButton product={product} />
        </div>

        {!distributor && !soldOut && (
          <button
            type="button"
            onClick={quickAdd}
            disabled={adding}
            className="absolute inset-x-3 bottom-3 z-10 hidden translate-y-[140%] items-center justify-center gap-2 rounded-full bg-paper/90 py-3 text-[11px] font-extrabold uppercase tracking-[0.16em] text-ink-900 shadow-soft backdrop-blur transition-all duration-500 ease-silk hover:bg-brand-500 hover:text-brand-on group-hover:translate-y-0 md:flex"
          >
            {adding ? <Spinner /> : added ? <FiCheck size={15} /> : <FiShoppingBag size={14} />}
            {added ? 'Added to bag' : needsSize ? 'Choose size' : 'Add to bag'}
          </button>
        )}
      </div>

      <div className="px-1 pt-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            {category && <p className="truncate text-[10px] font-extrabold uppercase tracking-[0.18em] text-ink-400">{category}</p>}
            <Link to={`/p/${product.slug}`} className="mt-1 block">
              <h3 className="line-clamp-2 font-display text-lg leading-snug text-ink-900 transition-colors duration-300 group-hover:text-brand-800">{product.prod_name}</h3>
            </Link>
          </div>
          {!distributor && !soldOut && (
            <button
              type="button"
              onClick={quickAdd}
              disabled={adding}
              aria-label={`Add ${product.prod_name} to bag`}
              className="mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-500 text-brand-on md:hidden"
            >
              {adding ? <Spinner className="h-3.5 w-3.5" /> : added ? <FiCheck size={15} /> : <FiPlus size={16} />}
            </button>
          )}
        </div>

        {distributor ? (
          packPrice && packQty ? (
            <p className="mt-2 text-sm">
              <span className="font-extrabold text-ink-900">{inr(packPrice)}</span>
              <span className="ml-2 text-xs font-semibold text-ink-500">Pack of {packQty}</span>
            </p>
          ) : null
        ) : (
          <div className="mt-2 flex flex-wrap items-baseline gap-2">
            <span className="text-[15px] font-extrabold text-ink-900">{inr(product.sale_price || product.regular_price)}</span>
            {off > 0 && <span className="text-xs font-semibold text-ink-400 line-through">{inr(product.regular_price)}</span>}
          </div>
        )}

        {ratings.length > 0 && (
          <div className="mt-2 flex items-center gap-1.5">
            <Stars value={avg} size={11} />
            <span className="text-[11px] font-semibold text-ink-400">({ratings.length})</span>
          </div>
        )}
      </div>
    </motion.article>
  );
}

export function ProductCardSkeleton() {
  return (
    <div>
      <div className="skeleton aspect-[4/5] rounded-[1.6rem]" />
      <div className="skeleton mt-4 h-3 w-1/3" />
      <div className="skeleton mt-2 h-5 w-3/4" />
      <div className="skeleton mt-2 h-4 w-1/4" />
    </div>
  );
}
