import { BsStar, BsStarFill, BsStarHalf } from 'react-icons/bs';

export default function Stars({ value = 0, size = 14, className = '' }) {
  const v = Math.max(0, Math.min(5, Number(value) || 0));
  return (
    <span className={`inline-flex items-center gap-0.5 text-gold ${className}`} aria-label={`${v.toFixed(1)} out of 5`}>
      {Array.from({ length: 5 }, (_, i) => {
        if (v >= i + 1) return <BsStarFill key={i} size={size} />;
        if (v > i) return <BsStarHalf key={i} size={size} />;
        return <BsStar key={i} size={size} className="text-ink-200" />;
      })}
    </span>
  );
}
