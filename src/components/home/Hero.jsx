import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import SplitText from '../ui/SplitText';
import Magnetic from '../ui/Magnetic';
import TeaScene from './TeaScene';
import { introDelay } from '../ui/Preloader';
import useMediaQuery from '../../hooks/useMediaQuery';
import { SITE } from '../../config/site';
import { EASE } from '../../lib/motion';

const HERO = SITE.hero;
const IMG = HERO.image;
const REGIONS = SITE.tea.regions;
const REGION_MS = 3400;

function RegionTicker({ start }) {
  const [tick, setTick] = useState(0);
  const active = tick % REGIONS.length;

  useEffect(() => {
    let interval;
    const wait = setTimeout(() => {
      interval = setInterval(() => setTick((t) => t + 1), REGION_MS);
    }, start * 1000);
    return () => {
      clearTimeout(wait);
      clearInterval(interval);
    };
  }, [start]);

  return (
    <div className="flex items-end gap-5 sm:gap-7">
      <span className="hidden pb-px text-[10px] font-extrabold uppercase tracking-[0.28em] text-paper/45 sm:inline">Sourced from</span>
      <ol className="flex items-end gap-4 sm:gap-6">
        {REGIONS.map((region, i) => (
          <li key={region} className="flex flex-col gap-2.5">
            <span className="relative block h-[2px] w-10 overflow-hidden rounded-full bg-paper/20 sm:w-14" aria-hidden>
              {i === active && (
                <motion.span
                  key={tick}
                  className="absolute inset-0 origin-left bg-gold-light"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: REGION_MS / 1000, ease: 'linear', delay: tick === 0 ? start : 0 }}
                />
              )}
            </span>
            <span
              className={`text-[9.5px] font-extrabold uppercase tracking-[0.2em] transition-colors duration-700 sm:text-[10px] ${
                i === active ? 'text-paper' : 'text-paper/40'
              }`}
            >
              {region}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function Hero() {
  const ref = useRef(null);
  const imgRef = useRef(null);
  const frameRef = useRef(null);
  const desktop = useMediaQuery('(min-width: 1024px)');
  const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  // Everything waits for the intro curtain on a first visit.
  const [delay] = useState(introDelay);
  const [revealAt] = useState(() => performance.now() + delay * 1000);
  const [loaded, setLoaded] = useState(false);
  const [imageDelay, setImageDelay] = useState(delay);
  // The live WebGL scene when the device can carry it, the still otherwise.
  const [scene, setScene] = useState('pending');
  const still = reduceMotion || scene === 'failed';
  const [stillShown, setStillShown] = useState(false);

  // Show the still whenever the live scene isn't there in time (slow network,
  // no WebGL, reduced motion); the scene then fades in over it.
  useEffect(() => {
    if (!loaded || scene === 'live') return undefined;
    if (still) {
      setStillShown(true);
      return undefined;
    }
    const timer = setTimeout(() => {
      setImageDelay(0);
      setStillShown(true);
    }, Math.max(0, revealAt - performance.now()) + 900);
    return () => clearTimeout(timer);
  }, [loaded, scene, still, revealAt]);

  const onImageLoad = () => {
    setImageDelay(Math.max(0, revealAt - performance.now()) / 1000);
    setLoaded(true);
  };

  // A cached photo can finish loading before React attaches onLoad.
  useEffect(() => {
    if (imgRef.current?.complete && imgRef.current.naturalWidth) onImageLoad();
  }, []);

  // Depth: the photo drifts slowly on scroll while the copy lifts away. On
  // phones the copy sits below the photo, so it stays put until it's read.
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const sceneY = useTransform(scrollYProgress, [0, 1], ['0%', '14%']);
  const copyY = useTransform(scrollYProgress, [0, 1], ['0%', '-18%']);
  const copyFade = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
  const dim = useTransform(scrollYProgress, [0, 1], [0, 0.65]);

  // …and the virtual camera leans with the pointer.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 40, damping: 18, mass: 0.8 });
  const sy = useSpring(py, { stiffness: 40, damping: 18, mass: 0.8 });

  const onPointerMove = (e) => {
    if (e.pointerType !== 'mouse') return;
    const r = ref.current.getBoundingClientRect();
    px.set(((e.clientX - r.left) / r.width) * 2 - 1);
    py.set(((e.clientY - r.top) / r.height) * 2 - 1);
  };
  const onPointerLeave = () => {
    px.set(0);
    py.set(0);
  };

  const rise = (at, distance = 18) => ({
    initial: { opacity: 0, y: distance },
    animate: { opacity: 1, y: 0 },
    transition: { delay: delay + at, duration: 1, ease: EASE },
  });

  return (
    <section ref={ref} aria-label={HERO.eyebrow} className="relative pt-header" onPointerMove={onPointerMove} onPointerLeave={onPointerLeave}>
      <div className="relative isolate flex min-h-[calc(100svh-var(--header-total))] flex-col overflow-hidden bg-ink-950 text-paper lg:min-h-[max(40rem,calc(100svh-var(--header-total)))]">
        {/* Scene */}
        <div className="hero-scene pointer-events-none absolute inset-x-0 top-0 h-[60svh] min-h-[21rem] overflow-hidden md:h-[66svh] lg:inset-y-0 lg:h-auto">
          <motion.div className="absolute inset-0" style={{ y: sceneY }}>
            <div ref={frameRef} className="hero-frame" style={{ '--ratio': IMG.width / IMG.height, '--fx': IMG.focusX / 100 }}>
              <motion.div
                className="absolute inset-0"
                initial={{ opacity: 0, scale: 1.18 }}
                animate={loaded && stillShown ? { opacity: 1, scale: 1.04 } : { opacity: 0, scale: 1.18 }}
                transition={{
                  opacity: { delay: imageDelay, duration: 1.8, ease: 'easeOut' },
                  scale: { delay: imageDelay, duration: 4, ease: EASE },
                }}
              >
                <picture>
                  <source srcSet={IMG.src} type="image/webp" />
                  <img
                    ref={imgRef}
                    src={IMG.fallback}
                    alt={IMG.alt}
                    width={IMG.width}
                    height={IMG.height}
                    fetchpriority="high"
                    onLoad={onImageLoad}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </picture>
              </motion.div>
            </div>

            {loaded && !still && (
              // Hidden until its first frame: an unpainted WebGL canvas is black.
              <motion.div
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: scene === 'live' ? 1 : 0 }}
                transition={{ duration: stillShown ? 1.4 : 0, ease: 'easeInOut' }}
              >
                <TeaScene
                  image={imgRef.current}
                  mapSrc={IMG.map}
                  frameRef={frameRef}
                  startAt={revealAt}
                  skipIntro={stillShown}
                  pointerX={sx}
                  pointerY={sy}
                  scroll={scrollYProgress}
                  onReady={() => setScene('live')}
                  onFail={() => {
                    setImageDelay(0);
                    setScene('failed');
                  }}
                />
              </motion.div>
            )}
          </motion.div>

          <div className="hero-shade absolute inset-0" />
          <motion.div className="absolute inset-0 bg-ink-950" style={{ opacity: dim }} />
        </div>

        {/* Copy */}
        <div className="container-x relative z-10 flex flex-1 flex-col justify-end pb-28 pt-[50svh] md:pt-[56svh] lg:justify-center lg:pb-28 lg:pt-16 short:pb-20 short:pt-8">
          <motion.div style={desktop ? { y: copyY, opacity: copyFade } : undefined} className="max-w-[40rem] xl:max-w-[46rem]">
            {/* SPHOORA lockup */}
            <motion.div {...rise(0.25, 12)} className="flex items-center gap-4 sm:gap-5">
              <img
                src={HERO.logo.src}
                alt={HERO.logo.alt}
                width={HERO.logo.width}
                height={HERO.logo.height}
                className="h-[4.25rem] w-auto drop-shadow-[0_8px_24px_rgb(0_0_0/0.45)] sm:h-20 xl:h-24 short:h-16"
              />
              <motion.span
                aria-hidden
                className="h-12 w-px origin-top bg-gradient-to-b from-gold/0 via-gold/80 to-gold/0 sm:h-14"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: delay + 0.45, duration: 1, ease: EASE }}
              />
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-[0.32em] text-paper/90">{HERO.eyebrow}</p>
                <p className="mt-1.5 font-display text-[15px] italic text-gold-light/90">{HERO.byline}</p>
              </div>
            </motion.div>

            <SplitText
              as="h1"
              inView={false}
              delay={delay + 0.5}
              stagger={0.08}
              text={HERO.title}
              className="h-display mt-6 text-[2.85rem] leading-[1] text-paper [text-shadow:0_2px_30px_rgb(0_0_0/0.35)] sm:mt-7 sm:text-6xl lg:text-[4.4rem] xl:text-[5.2rem] short:mt-5 short:text-[3.9rem]"
              highlightClassName="italic text-gold-foil"
            />

            <motion.p {...rise(1.05)} className="mt-5 font-display text-xl italic text-paper/90 sm:mt-7 sm:text-2xl xl:text-[1.75rem] short:mt-5 short:text-2xl">
              {HERO.tagline}
            </motion.p>

            <motion.p {...rise(1.2)} className="mt-4 max-w-md text-[15px] leading-7 text-paper/70 sm:text-base sm:leading-8 xl:max-w-[31rem]">
              {HERO.copy}
            </motion.p>

            <motion.div {...rise(1.35)} className="mt-8 flex flex-wrap items-center gap-3 sm:mt-10 sm:gap-4 short:mt-7">
              <Magnetic>
                <Link to={HERO.primary.to} className="btn-primary group px-7 py-4 text-[15px]">
                  {HERO.primary.label}
                  <FiArrowRight className="transition-transform duration-500 ease-silk group-hover:translate-x-1" />
                </Link>
              </Magnetic>
              <Link
                to={HERO.secondary.to}
                className="btn border border-paper/35 bg-ink-950/20 px-7 py-4 text-[15px] text-paper backdrop-blur-sm hover:border-paper hover:bg-paper hover:text-ink-900"
              >
                {HERO.secondary.label}
              </Link>
            </motion.div>
          </motion.div>
        </div>

        <motion.div style={desktop ? { opacity: copyFade } : undefined} className="container-x absolute inset-x-0 bottom-8 z-10 lg:bottom-10 short:bottom-6">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: delay + 1.8, duration: 1.2 }}>
            <RegionTicker start={delay + 1.8} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
