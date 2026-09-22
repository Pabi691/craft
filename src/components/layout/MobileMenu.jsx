import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { FiArrowUpRight, FiHeart, FiSearch, FiUser, FiX } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import Logo, { CraftCombineMark } from '../ui/Logo';
import { useGlobal } from '../../context/GlobalContext';
import { useAuth } from '../../context/AuthContext';
import { useLenis } from '../motion/SmoothScroll';
import { NAV, SITE, whatsappLink } from '../../config/site';
import { EASE } from '../../lib/motion';

const ORIGIN = 'at 30px 70px';

export default function MobileMenu({ open, onClose, onSearch }) {
  const { categoryTree } = useGlobal();
  const { userToken } = useAuth();
  const lenis = useLenis();

  useEffect(() => {
    if (!open) return undefined;
    lenis?.stop();
    document.body.style.overflow = 'hidden';
    return () => {
      lenis?.start();
      document.body.style.overflow = '';
    };
  }, [open, lenis]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          data-lenis-prevent
          className="fixed inset-0 z-[100] flex flex-col overflow-y-auto bg-ink-950 text-paper lg:hidden"
          initial={{ clipPath: `circle(0% ${ORIGIN})` }}
          animate={{ clipPath: `circle(150% ${ORIGIN})` }}
          exit={{ clipPath: `circle(0% ${ORIGIN})` }}
          transition={{ duration: 0.75, ease: EASE }}
        >
          <div className="container-x flex h-[calc(var(--header-total))] items-end justify-between pb-3">
            <Logo light onClick={onClose} />
            <button onClick={onClose} aria-label="Close menu" className="grid h-11 w-11 place-items-center rounded-full bg-paper/10">
              <FiX size={20} />
            </button>
          </div>

          <nav className="container-x mt-8 flex flex-col" aria-label="Mobile">
            {NAV.map((item, i) => (
              <motion.div
                key={item.to}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + i * 0.06, duration: 0.7, ease: EASE }}
                className="border-b border-paper/10"
              >
                <Link to={item.to} onClick={onClose} className="flex items-center justify-between py-4 font-display text-[2.4rem] font-light leading-none">
                  {item.label}
                  <FiArrowUpRight className="text-paper/40" size={22} />
                </Link>
              </motion.div>
            ))}
          </nav>

          {categoryTree.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="container-x mt-8">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.3em] text-paper/45">Collections</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {categoryTree.flatMap((c) => [c, ...(c.children || [])]).map((c) => (
                  <Link key={c.id} to={`/${c.slug}`} onClick={onClose} className="rounded-full border border-paper/15 px-4 py-2 text-sm font-semibold text-paper/85">
                    {c.category_name}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, ease: EASE }} className="container-x mb-10 mt-auto pt-10">
            <div className="grid grid-cols-3 gap-2">
              <button onClick={onSearch} className="flex flex-col items-center gap-2 rounded-2xl bg-paper/5 py-4 text-xs font-bold">
                <FiSearch size={18} /> Search
              </button>
              <Link to={userToken ? '/myaccount' : '/login'} onClick={onClose} className="flex flex-col items-center gap-2 rounded-2xl bg-paper/5 py-4 text-xs font-bold">
                <FiUser size={18} /> {userToken ? 'Account' : 'Log in'}
              </Link>
              <Link to="/wishlist" onClick={onClose} className="flex flex-col items-center gap-2 rounded-2xl bg-paper/5 py-4 text-xs font-bold">
                <FiHeart size={18} /> Wishlist
              </Link>
            </div>
            <a href={whatsappLink('Hello Craft & Weft, ')} target="_blank" rel="noreferrer" className="btn-primary mt-4 w-full">
              <FaWhatsapp size={18} /> Chat with us on WhatsApp
            </a>
            <div className="mt-6 flex justify-center">
              <CraftCombineMark light />
            </div>
            <p className="mt-4 text-center text-xs text-paper/45">{SITE.contact.address}</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
