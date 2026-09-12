import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiGrid, FiHeart, FiLogOut, FiMapPin, FiPackage, FiUser } from 'react-icons/fi';
import SplitText from '../../components/ui/SplitText';
import { EASE } from '../../lib/motion';

const NAV = [
  { label: 'Overview', to: '/myaccount', icon: FiGrid },
  { label: 'My Orders', to: '/myaccount/orders', icon: FiPackage },
  { label: 'My Addresses', to: '/myaccount/addresses', icon: FiMapPin },
  { label: 'My Profile', to: '/myaccount/profile', icon: FiUser },
  { label: 'Wishlist', to: '/wishlist', icon: FiHeart },
];

export default function AccountShell({ title, children, back }) {
  const { pathname } = useLocation();
  const fullName = (localStorage.getItem('username') || '').trim();
  const firstName = fullName.split(' ')[0] || 'friend';

  return (
    <section className="container-x pb-24 pt-10 md:pt-14">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow">My account</p>
          <SplitText as="h1" inView={false} text={`Namaskar, *${firstName}*`} className="h-display mt-4 text-4xl text-ink-900 md:text-6xl" />
        </div>
        <Link to="/logout" className="btn-outline btn-sm self-start md:self-auto">
          <FiLogOut size={14} /> Log out
        </Link>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-12 lg:gap-10">
        <aside className="lg:col-span-3">
          <nav className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 lg:sticky lg:top-[calc(var(--nav-h)+2rem)] lg:mx-0 lg:flex-col lg:px-0" aria-label="Account">
            {NAV.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`relative flex shrink-0 items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition-colors ${
                    active ? 'text-ink-900' : 'text-ink-500 hover:text-ink-900'
                  }`}
                >
                  {active && <motion.span layoutId="account-pill" className="absolute inset-0 rounded-2xl bg-brand-500/25" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />}
                  <Icon size={17} className="relative" />
                  <span className="relative whitespace-nowrap">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        <div className="min-w-0 lg:col-span-9">
          {(title || back) && (
            <div className="mb-6 flex items-center justify-between gap-4">
              {title && <h2 className="font-display text-2xl text-ink-900 md:text-3xl">{title}</h2>}
              {back}
            </div>
          )}
          <motion.div key={pathname} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }}>
            {children}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
