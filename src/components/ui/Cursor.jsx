import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const INTERACTIVE = '[data-cursor], a, button, [role="button"], input, textarea, select, label';

// Soft trailing ring for mouse users. It grows over interactive elements and
// shows a label over anything marked data-cursor="View". The native cursor
// stays visible — this only adds to it.
export default function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [state, setState] = useState({ hover: false, label: '' });
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 420, damping: 36, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 420, damping: 36, mass: 0.6 });

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduced) return undefined;
    setEnabled(true);

    const move = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
    };
    const over = (e) => {
      const el = e.target?.closest?.(INTERACTIVE);
      const label = el?.getAttribute?.('data-cursor') || '';
      setState((s) => (s.hover === !!el && s.label === label ? s : { hover: !!el, label }));
    };
    const leave = () => setVisible(false);

    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerover', over, { passive: true });
    document.documentElement.addEventListener('mouseleave', leave);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerover', over);
      document.documentElement.removeEventListener('mouseleave', leave);
    };
  }, [x, y]);

  if (!enabled) return null;

  const ring = state.label
    ? 'h-20 w-20 border-transparent bg-brand-500/95'
    : state.hover
      ? 'h-12 w-12 border-brand-600/70 bg-brand-500/15'
      : 'h-8 w-8 border-ink-900/30';

  return (
    <>
      <motion.div aria-hidden className="pointer-events-none fixed left-0 top-0 z-[130]" style={{ x: sx, y: sy, opacity: visible ? 1 : 0 }}>
        <div className={`grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border transition-[width,height,background-color,border-color] duration-300 ease-silk ${ring}`}>
          {state.label && <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-brand-on">{state.label}</span>}
        </div>
      </motion.div>
      <motion.div aria-hidden className="pointer-events-none fixed left-0 top-0 z-[130]" style={{ x, y, opacity: visible && !state.label ? 1 : 0 }}>
        <div className="h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent" />
      </motion.div>
    </>
  );
}
