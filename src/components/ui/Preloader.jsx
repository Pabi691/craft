import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { EASE } from '../../lib/motion';
import { useLenis } from '../motion/SmoothScroll';
import { SITE } from '../../config/site';

const KEY = 'cw_intro_seen';
const INTRO_MS = 3700;
const WRITE_AT = 1; // s — the pen starts once the wordmark has risen
const WRITE_SPAN = 1.7; // s — for the pen to travel from the first letter to the last
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

// The tagline written out as if by hand: each letter's outline is traced by
// the pen, then filled, travelling left to right. The letter shapes load as a
// separate chunk while the wordmark rises.
function WrittenLine({ text, mountedAt }) {
  const [art, setArt] = useState(null);

  useEffect(() => {
    let alive = true;
    import('./introTagline').then(({ TAGLINE_VIEWBOX, TAGLINE_GLYPHS }) => {
      if (!alive) return;
      const [, , w, h] = TAGLINE_VIEWBOX.split(' ').map(Number);
      setArt({ viewBox: TAGLINE_VIEWBOX, ratio: w / h, glyphs: TAGLINE_GLYPHS, start: Math.max(WRITE_AT, (performance.now() - mountedAt) / 1000) });
    });
    return () => {
      alive = false;
    };
  }, [mountedAt]);

  return (
    <svg
      role="img"
      aria-label={text}
      viewBox={art?.viewBox}
      style={{ aspectRatio: art?.ratio || 14 }}
      className="relative mt-6 w-[min(88vw,32rem)] overflow-visible text-gold-light"
    >
      {art?.glyphs.map((g, i) => {
        const delay = art.start + g.at * WRITE_SPAN;
        return (
          <motion.path
            key={i}
            d={g.d}
            fill="currentColor"
            stroke="currentColor"
            strokeWidth={1}
            vectorEffect="non-scaling-stroke"
            initial={{ pathLength: 0, fillOpacity: 0 }}
            animate={{ pathLength: 1, fillOpacity: 1 }}
            transition={{
              pathLength: { delay, duration: 0.5, ease: 'easeOut' },
              fillOpacity: { delay: delay + 0.3, duration: 0.45, ease: 'easeOut' },
            }}
          />
        );
      })}
    </svg>
  );
}

// Once-per-session intro: a gold thread draws across the loom, the wordmark
// rises over the C&W mark, the tagline is written out, then the curtain lifts.
export default function Preloader() {
  const lenis = useLenis();
  const [show, setShow] = useState(unseen);
  const [mountedAt] = useState(() => performance.now());

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
          className="fixed inset-0 z-[140] flex flex-col items-center justify-center overflow-hidden bg-ink-700 px-6 text-paper"
          initial={{ clipPath: 'inset(0% 0% 0% 0%)' }}
          exit={{ clipPath: 'inset(0% 0% 100% 0%)', transition: { duration: 1.05, ease: EASE } }}
        >
          {/* Warm light in the middle, deeper cocoa at the edges. */}
          <div aria-hidden className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_45%,#6E4725_0%,#603814_45%,#3E250F_100%)]" />
          <svg className="absolute inset-x-0 top-[calc(50%-4.5rem)] h-40 w-full -translate-y-1/2 text-gold" viewBox="0 0 1440 200" preserveAspectRatio="none" aria-hidden>
            <motion.path
              d="M0 120 C 220 30, 460 190, 720 100 S 1180 20, 1440 110"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              initial={{ pathLength: 0, opacity: 0.2 }}
              animate={{ pathLength: 1, opacity: 0.9 }}
              transition={{ duration: 3, ease: 'easeInOut' }}
            />
            <motion.path
              d="M0 80 C 260 170, 520 10, 760 110 S 1220 170, 1440 70"
              fill="none"
              stroke="rgb(var(--brand-300))"
              strokeWidth="1"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.55 }}
              transition={{ duration: 3.1, ease: 'easeInOut', delay: 0.15 }}
            />
          </svg>

          <div className="relative overflow-hidden pb-2">
            <motion.h1
              initial={{ y: '110%' }}
              animate={{ y: '0%' }}
              transition={{ duration: 1.1, ease: EASE, delay: 0.2 }}
              className="text-center font-display text-5xl font-light tracking-tight sm:text-7xl md:text-8xl"
            >
              Craft <span className="text-gold-light">&amp;</span> Weft
            </motion.h1>
          </div>
          <motion.img
            src="/brand/logo-craft-weft-light.png"
            alt=""
            width="340"
            height="127"
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.7, duration: 0.9, ease: EASE }}
            className="relative mt-7 h-12 w-auto select-none sm:h-14"
            draggable="false"
          />
          <WrittenLine text={SITE.introLine} mountedAt={mountedAt} />

          <span className="absolute bottom-12 left-1/2 block h-px w-44 -translate-x-1/2 overflow-hidden bg-paper/20">
            <motion.span
              className="block h-full origin-left bg-gold"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: INTRO_MS / 1000 - 0.2, ease: 'easeInOut' }}
            />
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
