// Infinite ticker — the list is rendered twice and the track slides by -50%.
export default function Marquee({
  items = [],
  className = '',
  itemClassName = '',
  separator = '✦',
  separatorClassName = 'opacity-50',
  reverse = false,
  fast = false,
}) {
  const list = [...items, ...items];
  return (
    <div className={`relative flex overflow-hidden ${className}`}>
      <div
        className={`flex w-max shrink-0 items-center whitespace-nowrap ${fast ? 'animate-marquee-fast' : 'animate-marquee'} hover:[animation-play-state:paused]`}
        style={reverse ? { animationDirection: 'reverse' } : undefined}
      >
        {list.map((item, i) => (
          <span key={i} className="flex items-center" aria-hidden={i >= items.length}>
            <span className={itemClassName}>{item}</span>
            <span className={`mx-6 md:mx-10 ${separatorClassName}`} aria-hidden="true">
              {separator}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
