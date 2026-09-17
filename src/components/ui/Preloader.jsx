import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { EASE } from '../../lib/motion';
import { useLenis } from '../motion/SmoothScroll';
import { SITE } from '../../config/site';

const KEY = 'cw_intro_seen';
const INTRO_MS = 2500;
const bootedAt = performance.now();

const unseen = () => {
  try {
    return !sessionStorage.getItem(KEY);
  } catch {
    return false;
  }
};

// Seconds until this session's intro curtain lifts (0 once it has), so
// above-the-fold motion plays as the page is revealed instead of under it.
export const introDelay = () => (unseen() ? Math.max(0, INTRO_MS - (performance.now() - bootedAt)) / 1000 : 0);

// Once-per-session intro: a thread draws across the dark loom, the wordmark
// rises, then the whole curtain is pulled up to reveal the site.
export default function Preloader() {
  const lenis = useLenis();
  const [show, setShow] = useState(unseen);

  useEffect(() => {
    if (!show) return undefined;
    const timer = setTimeout(() => {
      setShow(false);
      try {
        sessionStorage.setItem(KEY, '1');
      } catch {
        // ignore
      }
    }, INTRO_MS);
    return () => clearTimeout(timer);
  }, [show]);

  useEffect(() => {
    if (!show) return undefined;
    lenis?.stop();
    document.documentElement.style.overflow = 'hidden';
    return () => {
      lenis?.start();
      document.documentElement.style.overflow = '';
    };
  }, [show, lenis]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[140] flex flex-col items-center justify-center overflow-hidden bg-ink-950 px-6 text-paper"
          initial={{ clipPath: 'inset(0% 0% 0% 0%)' }}
          exit={{ clipPath: 'inset(0% 0% 100% 0%)', transition: { duration: 1.05, ease: EASE } }}
        >
          <svg className="absolute inset-x-0 top-1/2 h-40 w-full -translate-y-1/2 text-brand-500" viewBox="0 0 1440 200" preserveAspectRatio="none" aria-hidden>
            <motion.path
              d="M0 120 C 220 30, 460 190, 720 100 S 1180 20, 1440 110"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              initial={{ pathLength: 0, opacity: 0.2 }}
              animate={{ pathLength: 1, opacity: 0.9 }}
              transition={{ duration: 2, ease: 'easeInOut' }}
            />
            <motion.path
              d="M0 80 C 260 170, 520 10, 760 110 S 1220 170, 1440 70"
              fill="none"
              stroke="rgb(var(--accent))"
              strokeWidth="1"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.55 }}
              transition={{ duration: 2.1, ease: 'easeInOut', delay: 0.15 }}
            />
          </svg>

          <div className="relative overflow-hidden pb-2">
            <motion.h1
              initial={{ y: '110%' }}
              animate={{ y: '0%' }}
              transition={{ duration: 1.1, ease: EASE, delay: 0.2 }}
              className="text-center font-display text-5xl font-light tracking-tight sm:text-7xl md:text-8xl"
            >
              Craft <span className="text-accent">&amp;</span> Weft
            </motion.h1>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.8, ease: EASE }}
            className="relative mt-5 text-center text-[10px] font-extrabold uppercase tracking-[0.42em] text-paper/60 sm:text-[11px]"
          >
            {SITE.tagline}
          </motion.p>

          <span className="absolute bottom-12 left-1/2 block h-px w-44 -translate-x-1/2 overflow-hidden bg-paper/15">
            <motion.span
              className="block h-full origin-left bg-brand-500"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 2.2, ease: 'easeInOut' }}
            />
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
