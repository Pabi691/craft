import { Fragment } from 'react';
import { motion } from 'framer-motion';
import { EASE } from '../../lib/motion';

/**
 * Word-by-word masked reveal for headlines.
 *   "Where Tradition | *Meets* Modernity"
 * `*word*` gets the highlight style, a lone `|` forces a line break.
 */
export default function SplitText({
  text,
  as = 'h2',
  className = '',
  wordClassName = '',
  highlightClassName = 'italic text-brand-700',
  delay = 0,
  stagger = 0.07,
  inView = true,
}) {
  const Tag = motion[as] || motion.h2;
  const words = String(text).split(' ').filter(Boolean);

  const container = { hidden: {}, show: { transition: { staggerChildren: stagger, delayChildren: delay } } };
  const word = {
    hidden: { y: '115%', rotate: 3 },
    show: { y: '0%', rotate: 0, transition: { duration: 1.05, ease: EASE } },
  };
  const trigger = inView
    ? { whileInView: 'show', viewport: { once: true, amount: 0.35 } }
    : { animate: 'show' };

  return (
    <Tag className={className} variants={container} initial="hidden" {...trigger} aria-label={text.replace(/[*|]/g, '').replace(/\s+/g, ' ')}>
      {words.map((w, i) => {
        if (w === '|') return <br key={i} />;
        const highlighted = /^\*.+\*[.,!?]?$/.test(w);
        const clean = w.replace(/\*/g, '');
        return (
          <Fragment key={i}>
            <span aria-hidden="true" className="-mb-[0.14em] inline-block overflow-hidden pb-[0.14em] align-bottom">
              <motion.span variants={word} className={`inline-block origin-bottom-left will-change-transform ${highlighted ? highlightClassName : ''} ${wordClassName}`}>
                {clean}
              </motion.span>
            </span>
            {i < words.length - 1 && words[i + 1] !== '|' ? ' ' : ''}
          </Fragment>
        );
      })}
    </Tag>
  );
}
