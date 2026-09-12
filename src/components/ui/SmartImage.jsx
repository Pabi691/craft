import { useEffect, useRef, useState } from 'react';
import WeavePattern from './WeavePattern';

// Image with a shimmer placeholder, blur-up fade-in, and a woven fallback
// when the file is missing.
export default function SmartImage({ src, alt = '', className = '', imgClassName = '', loading = 'lazy', ...rest }) {
  const ref = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(!src);

  useEffect(() => {
    setFailed(!src);
    setLoaded(false);
  }, [src]);

  useEffect(() => {
    // Cached images can finish before React attaches onLoad.
    if (ref.current?.complete && ref.current.naturalWidth > 0) setLoaded(true);
  }, [src]);

  return (
    <div className={`relative overflow-hidden bg-paper-200 ${className}`}>
      {!loaded && !failed && <div className="skeleton absolute inset-0 rounded-none" />}
      {failed ? (
        <div className="absolute inset-0 flex items-center justify-center text-ink-300">
          <WeavePattern className="absolute inset-0 text-ink-400" opacity={0.18} />
          <span className="relative font-display text-2xl italic text-ink-400">C&amp;W</span>
        </div>
      ) : (
        <img
          ref={ref}
          src={src}
          alt={alt}
          loading={loading}
          decoding="async"
          draggable={false}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={`h-full w-full object-cover transition-[opacity,filter,transform] duration-700 ease-silk ${loaded ? 'opacity-100 blur-0' : 'opacity-0 blur-md'} ${imgClassName}`}
          {...rest}
        />
      )}
    </div>
  );
}
