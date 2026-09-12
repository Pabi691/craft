import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiGrid, FiHeart, FiHome, FiSearch, FiShoppingBag } from 'react-icons/fi';
import { useGlobal } from '../../context/GlobalContext';

const TABS = [
  { to: '/', label: 'Home', icon: FiHome, match: (p) => p === '/' },
  { to: '/products', label: 'Shop', icon: FiGrid, match: (p) => p === '/products' },
  { to: '/search', label: 'Search', icon: FiSearch, match: (p) => p.startsWith('/search') },
  { to: '/wishlist', label: 'Saved', icon: FiHeart, match: (p) => p.startsWith('/wishlist') },
  { to: '/cart', label: 'Bag', icon: FiShoppingBag, match: (p) => p.startsWith('/cart') || p.startsWith('/checkout'), badge: true },
];

export default function MobileTabBar() {
  const { pathname } = useLocation();
  const { cartLength } = useGlobal();

  return (
    <nav className="fixed inset-x-3 bottom-3 z-[70] md:hidden" aria-label="Quick navigation">
      <div className="flex items-center justify-between rounded-[1.5rem] border border-ink-900/5 bg-paper-50/85 px-1.5 py-1.5 shadow-lift backdrop-blur-xl">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const active = tab.match(pathname);
          return (
            <Link key={tab.to} to={tab.to} className="relative flex flex-1 flex-col items-center gap-0.5 py-1.5" aria-current={active ? 'page' : undefined}>
              {active && (
                <motion.span layoutId="tab-pill" className="absolute inset-0 rounded-2xl bg-brand-500/25" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />
              )}
              <span className="relative">
                <Icon size={19} className={active ? 'text-ink-900' : 'text-ink-500'} />
                {tab.badge && cartLength > 0 && (
                  <span className="absolute -right-2.5 -top-1.5 grid h-4 min-w-[1rem] place-items-center rounded-full bg-accent px-1 text-[9px] font-extrabold text-white">
                    {cartLength}
                  </span>
                )}
              </span>
              <span className={`relative text-[10px] font-bold ${active ? 'text-ink-900' : 'text-ink-500'}`}>{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
