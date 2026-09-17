import { motion } from 'framer-motion';

export default function PageLoader() {
  return (
    <div className="grid min-h-[60vh] place-items-center">
      <div className="flex flex-col items-center gap-5">
        <span className="font-display text-3xl text-ink-300">
          C<span className="text-accent">&amp;</span>W
        </span>
        <span className="relative block h-px w-28 overflow-hidden bg-ink-900/10">
          <motion.span
            className="absolute inset-y-0 left-0 w-1/2 bg-brand-500"
            animate={{ x: ['-100%', '220%'] }}
            transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
          />
        </span>
      </div>
    </div>
  );
}
