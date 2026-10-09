import { useEffect, useRef } from 'react';

// Muted autoplay, looping, that only starts once the video is actually on
// screen — the file is 12 MB, so someone who never scrolls this far should not
// pay for it. It pauses again when scrolled away.
//
// Browsers refuse autoplay with sound, so it starts muted and the controls stay
// on for anyone who wants to unmute. A visitor who asks for reduced motion
// keeps the poster and presses play themselves.
export default function AutoplayVideo({ src, poster, className = '', ...rest }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    if (reduced) return undefined;

    // React does not always reflect the muted prop onto the element, and an
    // unmuted play() is refused outright.
    el.muted = true;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Still refused on some phones in low-power mode; the poster and
          // controls remain, so nothing is lost.
          el.play?.().catch(() => {});
        } else {
          el.pause?.();
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      className={className}
      muted
      loop
      controls
      playsInline
      preload="none"
      {...rest}
    />
  );
}
