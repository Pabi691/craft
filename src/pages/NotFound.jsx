import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiSearch } from 'react-icons/fi';
import { EASE } from '../lib/motion';
import Seo from '../components/Seo';
import SplitText from '../components/ui/SplitText';
import WeavePattern from '../components/ui/WeavePattern';

export default function NotFound() {
  return (
    <>
      <Seo title="Page not found" />
      <section className="relative flex min-h-[70vh] items-center overflow-hidden py-20">
        <WeavePattern className="absolute inset-0 text-ink-900" opacity={0.05} />
        <div className="pointer-events-none absolute -right-32 top-10 h-[26rem] w-[26rem] rounded-full bg-brand-200/60 blur-[120px]" />

        <div className="container-x relative text-center">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} className="eyebrow justify-center">
            Error 404
          </motion.p>

          <SplitText as="h1" inView={false} delay={0.15} text="A loose *thread*" className="h-display mt-6 text-[3.5rem] text-ink-900 sm:text-8xl" />

          <svg viewBox="0 0 600 80" className="mx-auto mt-6 h-16 w-full max-w-xl text-brand-500" aria-hidden>
            <motion.path
              d="M0 40 C 90 5, 180 75, 300 40 S 510 5, 600 40"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.8, ease: 'easeInOut', delay: 0.4 }}
            />
          </svg>

          <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.8, ease: EASE }} className="mx-auto mt-4 max-w-md text-[15px] leading-8 text-ink-500">
            This page slipped off the loom. Let's get you back to something beautiful.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.95, duration: 0.8, ease: EASE }} className="mt-9 flex flex-wrap justify-center gap-3">
            <Link to="/" className="btn-primary">
              Back home <FiArrowRight />
            </Link>
            <Link to="/products" className="btn-outline">
              <FiSearch size={15} /> Browse the collection
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
