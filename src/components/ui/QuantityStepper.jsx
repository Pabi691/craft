import { FiMinus, FiPlus } from 'react-icons/fi';

export default function QuantityStepper({ value, onChange, min = 1, max = 10, step = 1, disabled = false, size = 'md' }) {
  const h = size === 'sm' ? 'h-10' : 'h-[3.25rem]';
  return (
    <div className={`inline-flex items-center rounded-full border border-ink-900/10 bg-white ${h}`}>
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={() => onChange(Math.max(min, value - step))}
        disabled={disabled || value <= min}
        className="grid h-full w-11 place-items-center rounded-l-full text-ink-700 transition-colors hover:bg-ink-900/5 disabled:opacity-30"
      >
        <FiMinus size={14} />
      </button>
      <span className="min-w-[2.25rem] text-center text-sm font-extrabold tabular-nums">{value}</span>
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={() => onChange(Math.min(max, value + step))}
        disabled={disabled || value >= max}
        className="grid h-full w-11 place-items-center rounded-r-full text-ink-700 transition-colors hover:bg-ink-900/5 disabled:opacity-30"
      >
        <FiPlus size={14} />
      </button>
    </div>
  );
}
