import { Link } from 'react-router-dom';

// Typographic take on the C&W mark — black wordmark, pink ampersand.
export default function Logo({ light = false, className = '', onClick, compact = false }) {
  return (
    <Link to="/" onClick={onClick} aria-label="Craft & Weft — home" className={`group inline-flex items-center gap-3 ${className}`}>
      <span
        className={`grid h-11 w-11 shrink-0 place-items-center rounded-[14px] font-display text-[15px] font-semibold tracking-tight transition-transform duration-500 ease-silk group-hover:-rotate-6 ${
          light ? 'bg-paper text-ink-900' : 'bg-ink-900 text-paper'
        }`}
      >
        <span>
          C<span className="font-normal italic text-accent">&amp;</span>W
        </span>
      </span>
      {!compact && (
        <span className="leading-none">
          <span className={`block font-display text-[1.3rem] font-medium tracking-tight ${light ? 'text-paper' : 'text-ink-900'}`}>
            Craft <span className="font-normal italic text-accent">&amp;</span> Weft
          </span>
          <span className={`mt-1 block text-[8.5px] font-extrabold uppercase tracking-[0.34em] ${light ? 'text-paper/55' : 'text-ink-400'}`}>
            Handmade in Bengal
          </span>
        </span>
      )}
    </Link>
  );
}
