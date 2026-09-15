import { useId } from 'react';

// Tea-leaf texture: scattered line-drawn leaves and a "two leaves and a bud"
// sprig, tiled like a printed tea-chest paper. Colour comes from currentColor.

// One leaf pointing up, 22 units long, centred on 0,0.
const LEAF = 'M0,-11 C6.5,-6.5 6.5,6 0,11 C-6.5,6 -6.5,-6.5 0,-11 Z';
const VEINS = 'M0,-9.5 L0,10 M0,-4 L3.6,-6.8 M0,0.5 L4.3,-2.4 M0,5 L3.8,2.4 M0,-4 L-3.6,-6.8 M0,0.5 L-4.3,-2.4 M0,5 L-3.8,2.4';

function Leaf({ x, y, r = 0, s = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
      <path d={LEAF} fill="currentColor" fillOpacity="0.28" />
      <path d={LEAF} />
      <path d={VEINS} strokeWidth="0.7" />
    </g>
  );
}

// Stem with two leaves and a closed bud at the tip.
function Sprig({ x, y, r = 0, s = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
      <path d="M0,18 C1,8 -1,-2 1,-14" />
      <g transform="translate(0.5 2) rotate(-52) translate(0 -11) scale(0.82)">
        <path d={LEAF} fill="currentColor" fillOpacity="0.28" />
        <path d={LEAF} />
        <path d={VEINS} strokeWidth="0.7" />
      </g>
      <g transform="translate(0 -5) rotate(48) translate(0 -9.5) scale(0.7)">
        <path d={LEAF} fill="currentColor" fillOpacity="0.28" />
        <path d={LEAF} />
        <path d={VEINS} strokeWidth="0.7" />
      </g>
      <path d="M1,-14 C3.6,-17 3,-22 1,-25 C-1.2,-22 -1.6,-17 1,-14 Z" fill="currentColor" fillOpacity="0.45" />
    </g>
  );
}

export default function LeafPattern({ className = '', opacity = 0.1, size = 150 }) {
  const id = `leaf-${useId().replace(/:/g, '')}`;
  return (
    <svg className={className} style={{ opacity }} width="100%" height="100%" aria-hidden="true">
      <defs>
        <pattern id={id} width={size} height={size} patternUnits="userSpaceOnUse" viewBox="0 0 150 150">
          <g fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <Leaf x={24} y={30} r={-38} />
            <Leaf x={104} y={22} r={56} s={0.78} />
            <Sprig x={74} y={84} r={14} />
            <Leaf x={132} y={112} r={-72} s={0.9} />
            <Leaf x={28} y={122} r={118} s={0.74} />
            <Leaf x={122} y={62} r={20} s={0.55} />
            <circle cx="52" cy="58" r="1.2" fill="currentColor" stroke="none" />
            <circle cx="108" cy="140" r="1" fill="currentColor" stroke="none" />
            <circle cx="10" cy="80" r="0.9" fill="currentColor" stroke="none" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}
