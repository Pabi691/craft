import SplitText from './SplitText';
import Reveal from './Reveal';

const SIZES = {
  xl: 'text-[2.6rem] sm:text-6xl lg:text-7xl',
  lg: 'text-4xl sm:text-5xl lg:text-6xl',
  md: 'text-3xl sm:text-4xl lg:text-[2.75rem]',
};

export default function SectionHeading({ eyebrow, title, text, align = 'left', action, light = false, as = 'h2', size = 'lg', className = '' }) {
  const centered = align === 'center';
  return (
    <div className={`flex flex-col gap-6 ${centered ? 'items-center text-center' : 'md:flex-row md:items-end md:justify-between'} ${className}`}>
      <div className={centered ? 'max-w-3xl' : 'max-w-2xl'}>
        {eyebrow && (
          <Reveal as="p" y={14} className={`eyebrow ${light ? 'text-paper/60' : ''}`}>
            {eyebrow}
          </Reveal>
        )}
        <SplitText
          as={as}
          text={title}
          className={`h-display mt-4 text-balance ${SIZES[size] || SIZES.lg} ${light ? 'text-paper' : 'text-ink-900'}`}
          highlightClassName={light ? 'italic text-gold-foil' : 'italic text-brand-700'}
        />
        {text && (
          <Reveal as="p" y={18} delay={0.15} className={`mt-5 max-w-xl text-[15px] leading-7 ${light ? 'text-paper/65' : 'text-ink-500'} ${centered ? 'mx-auto' : ''}`}>
            {text}
          </Reveal>
        )}
      </div>
      {action && (
        <Reveal y={14} delay={0.2} className="shrink-0">
          {action}
        </Reveal>
      )}
    </div>
  );
}
