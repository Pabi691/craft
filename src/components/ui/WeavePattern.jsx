import { useId } from 'react';

// Basket-weave texture: warp and weft blocks alternating like a handloom.
export default function WeavePattern({ className = '', opacity = 0.12, size = 24 }) {
  const id = `weave-${useId().replace(/:/g, '')}`;
  const q = size / 2;
  const lines = [0.25, 0.5, 0.75].map((f) => f * q);
  return (
    <svg className={className} style={{ opacity }} width="100%" height="100%" aria-hidden="true">
      <defs>
        <pattern id={id} width={size} height={size} patternUnits="userSpaceOnUse">
          <g stroke="currentColor" strokeWidth="1" strokeLinecap="round">
            {lines.map((o) => (
              <line key={`a${o}`} x1={1} y1={o} x2={q - 1} y2={o} />
            ))}
            {lines.map((o) => (
              <line key={`b${o}`} x1={q + o} y1={1} x2={q + o} y2={q - 1} />
            ))}
            {lines.map((o) => (
              <line key={`c${o}`} x1={o} y1={q + 1} x2={o} y2={size - 1} />
            ))}
            {lines.map((o) => (
              <line key={`d${o}`} x1={q + 1} y1={q + o} x2={size - 1} y2={q + o} />
            ))}
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}
