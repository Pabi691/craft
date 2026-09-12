import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { FiX } from 'react-icons/fi';
import { useLenis } from '../motion/SmoothScroll';

const WIDTHS = { sm: 'sm:max-w-sm', md: 'sm:max-w-md', lg: 'sm:max-w-2xl', xl: 'sm:max-w-4xl' };

// Bottom sheet on phones, centred dialog from `sm` up.
export default function Modal({ open, onClose, title, subtitle, children, size = 'md', className = '' }) {
  const lenis = useLenis();

  useEffect(() => {
    if (!open) return undefined;
    lenis?.stop();
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => e.key === 'Escape' && onClose?.();
    window.addEventListener('keydown', onKey);
    return () => {
      lenis?.start();
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, lenis, onClose]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[120] flex items-end justify-center sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <button aria-label="Close" className="absolute inset-0 cursor-default bg-ink-950/45 backdrop-blur-[3px]" onClick={onClose} />
          <motion.div
            role="dialog"
            aria-modal="true"
            data-lenis-prevent
            className={`relative max-h-[88vh] w-full overflow-y-auto rounded-t-[2rem] bg-paper-50 p-6 shadow-lift sm:rounded-[2rem] sm:p-8 ${WIDTHS[size] || WIDTHS.md} ${className}`}
            initial={{ y: 80, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 50, opacity: 0, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 280, damping: 30 }}
          >
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-ink-900/10 sm:hidden" />
            {(title || subtitle) && (
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  {title && <h3 className="font-display text-2xl leading-tight text-ink-900">{title}</h3>}
                  {subtitle && <p className="mt-1 text-sm text-ink-500">{subtitle}</p>}
                </div>
                <button onClick={onClose} aria-label="Close" className="icon-btn -mr-2 -mt-1 h-10 w-10 bg-ink-900/5">
                  <FiX size={18} />
                </button>
              </div>
            )}
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
