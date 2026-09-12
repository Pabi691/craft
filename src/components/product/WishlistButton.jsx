import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { FiHeart } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useGlobal } from '../../context/GlobalContext';

export default function WishlistButton({ product, variant = 'icon', className = '' }) {
  const { isInWishlist, toggleWishlist } = useGlobal();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [burst, setBurst] = useState(0);
  const active = isInWishlist(product.id);

  const onClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (busy) return;
    setBusy(true);
    try {
      const res = await toggleWishlist(product);
      if (res.needsLogin) {
        toast.info('Log in to save pieces to your wishlist');
        navigate('/login', { state: { slug: window.location.pathname } });
        return;
      }
      if (res.added) {
        setBurst((n) => n + 1);
        toast.success('Saved to your wishlist');
      } else {
        toast('Removed from your wishlist');
      }
    } catch {
      toast.error('Could not update your wishlist');
    } finally {
      setBusy(false);
    }
  };

  const heart = (
    <span className="relative grid place-items-center">
      <motion.span animate={burst ? { scale: [1, 1.35, 1] } : {}} transition={{ duration: 0.45 }} key={burst} className="grid place-items-center">
        <FiHeart size={variant === 'icon' ? 17 : 18} className={`transition-colors duration-300 ${active ? 'fill-accent text-accent' : 'text-ink-800'}`} />
      </motion.span>
      <AnimatePresence>
        {burst > 0 && (
          <motion.span
            key={`ring-${burst}`}
            className="pointer-events-none absolute h-8 w-8 rounded-full border-2 border-accent"
            initial={{ scale: 0.3, opacity: 0.9 }}
            animate={{ scale: 1.9, opacity: 0 }}
            transition={{ duration: 0.65, ease: 'easeOut' }}
          />
        )}
      </AnimatePresence>
    </span>
  );

  if (variant === 'button') {
    return (
      <button type="button" onClick={onClick} disabled={busy} aria-pressed={active} className={`btn-outline ${className}`}>
        {heart}
        <span>{active ? 'Saved' : 'Save'}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy}
      aria-pressed={active}
      aria-label={active ? 'Remove from wishlist' : 'Save to wishlist'}
      className={`grid h-10 w-10 place-items-center rounded-full bg-paper/85 shadow-sm backdrop-blur transition-transform duration-300 hover:scale-110 ${className}`}
    >
      {heart}
    </button>
  );
}
