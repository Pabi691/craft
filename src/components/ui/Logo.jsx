import { Link } from 'react-router-dom';

// The client's C&W logo. `light` swaps to the cream-lettered cutout for dark
// grounds; `compact` shrinks it for tight spots such as the mobile menu.
export default function Logo({ light = false, className = '', onClick, compact = false }) {
  return (
    <Link
      to="/"
      onClick={onClick}
      aria-label="Craft & Weft — home"
      className={`group inline-flex shrink-0 items-center ${className}`}
    >
      <img
        src={light ? '/brand/logo-craft-weft-light.png' : '/brand/logo-craft-weft.png'}
        alt="Craft & Weft"
        width="340"
        height="127"
        decoding="async"
        className={`w-auto select-none transition-transform duration-500 ease-silk group-hover:-rotate-2 group-hover:scale-[1.03] ${
          compact ? 'h-9' : 'h-10 lg:h-12'
        }`}
        draggable="false"
      />
    </Link>
  );
}

// "An initiative of Craft Combine" lock-up used in the header, footer and About
// page. `compact` stacks the label over the logo so it fits the header bar.
export function CraftCombineMark({ light = false, compact = false, className = '' }) {
  return (
    <a
      href="https://www.craftcombine.org/"
      target="_blank"
      rel="noreferrer"
      className={`inline-flex transition-opacity duration-300 hover:opacity-80 ${compact ? 'flex-col items-start gap-1' : 'items-center gap-3'} ${className}`}
      aria-label="Craft Combine — visit craftcombine.org"
    >
      <span
        className={`font-extrabold uppercase ${compact ? 'text-[8px] leading-none tracking-[0.16em]' : 'text-[10px] tracking-[0.22em]'} ${
          light ? 'text-paper/55' : 'text-ink-400'
        }`}
      >
        An initiative of
      </span>
      <img
        src={light ? '/brand/logo-craft-combine-light.png' : '/brand/logo-craft-combine.png'}
        alt="Craft Combine"
        width="285"
        height="132"
        loading="lazy"
        className="h-10 w-auto"
      />
    </a>
  );
}
