import { motion } from 'framer-motion';
import WeavePattern from './WeavePattern';

export default function EmptyState({ icon: Icon, title, text, action, className = '' }) {
  return (
    <div className={`relative overflow-hidden rounded-[2rem] border border-dashed border-ink-900/15 bg-white/60 px-6 py-16 text-center md:py-20 ${className}`}>
      <WeavePattern className="absolute inset-0 text-brand-700" opacity={0.07} />
      <motion.div
        initial={{ scale: 0.5, opacity: 0, rotate: -12 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 220, damping: 15 }}
        className="relative mx-auto grid h-20 w-20 place-items-center rounded-full bg-brand-100 text-brand-800 ring-8 ring-brand-50"
      >
        {Icon && <Icon size={30} />}
      </motion.div>
      <h3 className="relative mt-7 font-display text-2xl text-ink-900 md:text-3xl">{title}</h3>
      {text && <p className="relative mx-auto mt-3 max-w-md text-sm leading-6 text-ink-500">{text}</p>}
      {action && <div className="relative mt-8 flex flex-wrap justify-center gap-3">{action}</div>}
    </div>
  );
}
