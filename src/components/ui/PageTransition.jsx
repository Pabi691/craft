import { useState } from 'react';
import { motion } from 'framer-motion';
import { EASE } from '../../lib/motion';

let firstPage = true;

/**
 * Route change: a dark curtain rises over the leaving page, then lifts off
 * the arriving one while its content drifts up into place. The very first
 * page skips the curtain (the Preloader handles the intro).
 */
export default function PageTransition({ children }) {
  const [skipCurtain] = useState(() => {
    const skip = firstPage;
    firstPage = false;
    return skip;
  });

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 26 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE, delay: skipCurtain ? 0 : 0.28 } }}
        exit={{ opacity: 0, y: -14, transition: { duration: 0.3, ease: EASE } }}
      >
        {children}
      </motion.div>

      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[110] bg-ink-700"
        style={{ originY: 0 }}
        initial={{ scaleY: skipCurtain ? 0 : 1 }}
        animate={{ scaleY: 0, transition: { duration: 0.7, ease: EASE, delay: 0.06 } }}
        exit={{ scaleY: 0 }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[110] bg-ink-700"
        style={{ originY: 1 }}
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 0 }}
        exit={{ scaleY: 1, transition: { duration: 0.42, ease: EASE } }}
      />
    </>
  );
}
