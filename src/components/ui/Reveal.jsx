import { motion } from 'framer-motion';
import { EASE } from '../../lib/motion';

// Fades + lifts its children the first time they scroll into view.
export default function Reveal({
  as = 'div',
  children,
  className = '',
  delay = 0,
  y = 36,
  x = 0,
  scale = 1,
  duration = 0.9,
  once = true,
  amount = 0.2,
  ...rest
}) {
  const Comp = motion[as] || motion.div;
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y, x, scale }}
      whileInView={{ opacity: 1, y: 0, x: 0, scale: 1 }}
      viewport={{ once, amount }}
      transition={{ duration, delay, ease: EASE }}
      {...rest}
    >
      {children}
    </Comp>
  );
}
