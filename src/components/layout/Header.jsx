import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { FiArrowUpRight, FiHeart, FiMenu, FiSearch, FiShoppingBag, FiUser } from 'react-icons/fi';
import Logo from '../ui/Logo';
import Marquee from '../ui/Marquee';
import SmartImage from '../ui/SmartImage';
import MobileMenu from './MobileMenu';
import SearchOverlay from './SearchOverlay';
import { useGlobal } from '../../context/GlobalContext';
import { useAuth } from '../../context/AuthContext';
import { NAV } from '../../config/site';
import { EASE } from '../../lib/motion';
import { inr } from '../../lib/format';

const ANNOUNCEMENTS = [
  'Handmade by the artisans of Bengal',
  'Free shipping across India',
  'Cash on delivery available',
  'Bulk orders — +91 90516 26156',
  'Khesh · Muslin · Tussar · Khadi',
];

function CountBadge({ count, pulse = 0 }) {
  if (!count) return null;
  return (
    <motion.span
      key={pulse}
      initial={{ scale: 0.4 }}
      animate={{ scale: [1.4, 1] }}
      transition={{ duration: 0.45, ease: EASE }}
      className="absolute -right-0.5 -top-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-accent px-1 text-[10px] font-extrabold text-white ring-2 ring-paper"
    >
      {count > 99 ? '99+' : count}
    </motion.span>
  );
}

function MegaMenu({ open, tree, products, onClose }) {
  const [active, setActive] = useState(0);
  const current = tree[active] || tree[0];
  const ids = current ? [current.id, ...(current.children || []).map((c) => c.id)] : [];
  const featured = products.filter((p) => p.product_categories?.some((c) => ids.includes(c.id))).slice(0, 2);

  return (
    <AnimatePresence>
      {open && tree.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.35, ease: EASE }}
          className="absolute inset-x-0 top-full hidden lg:block"
        >
          <div className="container-x">
            <div className="grid grid-cols-12 gap-8 rounded-b-[2rem] border border-t-0 border-ink-900/5 bg-paper-50/95 p-8 shadow-lift backdrop-blur-xl">
              <div className="col-span-4">
                <p className="eyebrow mb-4">Collections</p>
                <ul className="space-y-1">
                  {tree.map((cat, i) => (
                    <li key={cat.id}>
                      <Link
                        to={`/${cat.slug}`}
                        onMouseEnter={() => setActive(i)}
                        onFocus={() => setActive(i)}
                        onClick={onClose}
                        className={`flex items-center justify-between rounded-2xl px-4 py-3 transition-colors duration-300 ${active === i ? 'bg-brand-100' : 'hover:bg-ink-900/5'}`}
                      >
                        <span className="font-display text-2xl text-ink-900">{cat.category_name}</span>
                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-ink-400">
                          {cat.product_count ? `${cat.product_count} pieces` : 'Soon'}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link to="/products" onClick={onClose} className="mt-5 inline-flex items-center gap-2 px-4 text-sm font-extrabold text-ink-900">
                  <span className="link-underline">Shop everything</span> <FiArrowUpRight />
                </Link>
              </div>

              <div className="col-span-3 border-l border-ink-900/10 pl-8">
                <p className="eyebrow mb-4">{current?.category_name}</p>
                {current?.children?.length ? (
                  <ul className="space-y-3">
                    {current.children.map((ch) => (
                      <li key={ch.id}>
                        <Link to={`/${ch.slug}`} onClick={onClose} className="link-underline text-[15px] font-semibold text-ink-700 hover:text-ink-900">
                          {ch.category_name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm leading-6 text-ink-500">{current?.cat_desc}</p>
                )}
              </div>

              <div className="col-span-5">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={current?.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.35, ease: EASE }}
                    className="grid grid-cols-2 gap-4"
                  >
                    {featured.length ? (
                      featured.map((p) => (
                        <Link key={p.id} to={`/p/${p.slug}`} onClick={onClose} className="group">
                          <SmartImage src={p.primary_img} alt={p.prod_name} className="aspect-[4/5] rounded-2xl" imgClassName="duration-1000 group-hover:scale-105" />
                          <p className="mt-3 truncate text-sm font-bold text-ink-900">{p.prod_name}</p>
                          <p className="text-xs font-semibold text-ink-500">{inr(p.sale_price)}</p>
                        </Link>
                      ))
                    ) : (
                      <div className="relative col-span-2 overflow-hidden rounded-2xl">
                        <SmartImage src={current?.cat_img} alt={current?.category_name} className="aspect-[16/10]" />
                        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/75 to-transparent" />
                        <p className="absolute bottom-5 left-5 right-5 font-display text-2xl text-paper">New pieces are on the loom — arriving soon.</p>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function Header() {
  const { pathname } = useLocation();
  const { cartLength, cartPulse, wishlist, categoryTree, products } = useGlobal();
  const { userToken } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const { scrollY } = useScroll();

  // Hide on scroll down, reveal on scroll up.
  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 24);
    if (megaOpen) return;
    if (y > 320 && y > prev + 2) setHidden(true);
    else if (y < prev - 2 || y < 320) setHidden(false);
  });

  useEffect(() => {
    setMegaOpen(false);
    setMenuOpen(false);
    setSearchOpen(false);
    setHidden(false);
  }, [pathname]);

  const transparent = pathname === '/' && !scrolled && !megaOpen;

  const navClass = ({ isActive }) => `link-underline text-[14px] font-bold text-ink-900 ${isActive ? 'active' : ''}`;

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-[80]"
        animate={{ y: hidden ? '-100%' : '0%' }}
        transition={{ duration: 0.5, ease: EASE }}
        onMouseLeave={() => setMegaOpen(false)}
      >
        <motion.div
          initial={false}
          animate={{ height: scrolled ? 0 : 34, opacity: scrolled ? 0 : 1 }}
          transition={{ duration: 0.4, ease: EASE }}
          className="overflow-hidden bg-ink-950 text-paper"
        >
          <Marquee
            items={ANNOUNCEMENTS}
            className="h-[34px] items-center text-[10.5px] font-bold uppercase tracking-[0.2em] text-paper/80"
            separatorClassName="text-brand-400"
          />
        </motion.div>

        <div
          className={`relative transition-[background-color,box-shadow] duration-500 ${
            transparent ? 'bg-transparent' : 'bg-paper/85 shadow-[0_1px_0_rgb(23_27_20/0.07)] backdrop-blur-xl'
          }`}
        >
          <div className="container-x flex h-[var(--nav-h)] items-center justify-between gap-4">
            <div className="flex items-center gap-1">
              <button className="icon-btn -ml-2 lg:hidden" aria-label="Open menu" onClick={() => setMenuOpen(true)}>
                <FiMenu size={21} />
              </button>
              <Logo />
            </div>

            <nav className="hidden items-center gap-10 lg:flex" aria-label="Main">
              {NAV.map((item) =>
                item.mega ? (
                  <div key={item.to} onMouseEnter={() => setMegaOpen(true)} className="py-6">
                    <NavLink to={item.to} className={navClass}>
                      {item.label}
                    </NavLink>
                  </div>
                ) : (
                  <NavLink key={item.to} to={item.to} end={item.to === '/'} onMouseEnter={() => setMegaOpen(false)} className={navClass}>
                    {item.label}
                  </NavLink>
                )
              )}
            </nav>

            <div className="flex items-center gap-0.5 sm:gap-1">
              <button className="icon-btn" aria-label="Search" onClick={() => setSearchOpen(true)}>
                <FiSearch size={19} />
              </button>
              <Link to={userToken ? '/myaccount' : '/login'} className="icon-btn hidden sm:inline-flex" aria-label="My account">
                <FiUser size={19} />
              </Link>
              <Link to="/wishlist" className="icon-btn hidden sm:inline-flex" aria-label="Wishlist">
                <FiHeart size={19} />
                <CountBadge count={wishlist.length} />
              </Link>
              <Link to="/cart" className="icon-btn" aria-label="Shopping bag">
                <FiShoppingBag size={19} />
                <CountBadge count={cartLength} pulse={cartPulse} />
              </Link>
            </div>
          </div>

          <MegaMenu open={megaOpen} tree={categoryTree} products={products} onClose={() => setMegaOpen(false)} />
        </div>
      </motion.header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} onSearch={() => { setMenuOpen(false); setSearchOpen(true); }} />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
