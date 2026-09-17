import { Fragment, useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';

function Word({ progress, range, children, className }) {
  const opacity = useTransform(progress, range, [0.16, 1]);
  return (
    <motion.span aria-hidden="true" style={{ opacity }} className={`inline-block ${className}`}>
      {children}
    </motion.span>
  );
}

/**
 * A statement whose words light up one by one as it scrolls through the
 * viewport — for the lines a page should never let you skim past.
 *   "Today, that journey evolves | from *craft* to *cup.*"
 * `*word*` gets the highlight style, a lone `|` forces a line break.
 */
export default function ScrollHighlight({ text, as = 'p', className = '', highlightClassName = 'italic' }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.4'] });
  const Tag = as;
  const words = String(text).split(' ').filter(Boolean);
  const count = words.filter((w) => w !== '|').length;
  let n = 0;

  return (
    <Tag ref={ref} className={className} aria-label={text.replace(/[*|]/g, '').replace(/\s+/g, ' ')}>
      {words.map((w, i) => {
        if (w === '|') return <br key={i} />;
        const highlighted = /^\*.+\*[.,!?]?$/.test(w);
        const clean = w.replace(/\*/g, '');
        const at = n++;
        const style = highlighted ? highlightClassName : '';
        return (
          <Fragment key={i}>
            {reduce ? (
              <span aria-hidden="true" className={style}>
                {clean}
              </span>
            ) : (
              <Word progress={scrollYProgress} range={[at / count, (at + 1) / count]} className={style}>
                {clean}
              </Word>
            )}
            {i < words.length - 1 && words[i + 1] !== '|' ? ' ' : ''}
          </Fragment>
        );
      })}
    </Tag>
  );
}
