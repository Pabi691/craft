import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import Reveal from '../ui/Reveal';
import SplitText from '../ui/SplitText';
import SmartImage from '../ui/SmartImage';
import LeafPattern from '../ui/LeafPattern';
import Magnetic from '../ui/Magnetic';
import { SITE, whatsappLink } from '../../config/site';
import { EASE } from '../../lib/motion';

const TEA = SITE.tea;
const blends = TEA.ranges.find((r) => r.slug === 'signature-blends');
const choice = TEA.ranges.find((r) => r.slug === 'connoisseurs-choice');

// Home-page SPHOORA band. Reads from config, so it shows the ranges even
// while the tea products are still unpriced drafts in the CRM.
export default function TeaSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const yMain = useTransform(scrollYProgress, [0, 1], ['6%', '-8%']);
  const yTop = useTransform(scrollYProgress, [0, 1], ['-10%', '14%']);
  const yLow = useTransform(scrollYProgress, [0, 1], ['18%', '-12%']);
  const yLeaves = useTransform(scrollYProgress, [0, 1], ['-48px', '48px']);

  return (
    <section ref={ref} id="sphoora" className="relative overflow-hidden bg-ink-950 py-24 text-paper md:py-36">
      {/* Tea-leaf texture, drifting gently against the scroll; lighter behind the copy. */}
      <motion.div
        aria-hidden
        style={{ y: yLeaves }}
        className="mask-soft-left pointer-events-none absolute inset-x-0 -inset-y-16"
      >
        <LeafPattern className="h-full w-full text-lime" opacity={0.11} size={150} />
      </motion.div>
      <div className="pointer-events-none absolute -left-40 top-20 h-[30rem] w-[30rem] rounded-full bg-brand-500/15 blur-[130px]" />
      <div className="pointer-events-none absolute -right-32 bottom-10 h-96 w-96 rounded-full bg-leaf/25 blur-[120px]" />

      <div className="container-x relative">
        <div className="grid items-center gap-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Reveal as="p" y={14} className="eyebrow text-lime-light">
              {TEA.brand} · Fine Indian teas
            </Reveal>
            <SplitText
              as="h2"
              text="Tea is a | *ritual.*"
              className="h-display mt-5 text-[3rem] text-paper sm:text-6xl lg:text-7xl"
              highlightClassName="italic text-lime-light"
            />
            <Reveal as="p" delay={0.1} className="mt-7 max-w-md text-base leading-8 text-paper/70">
              {TEA.intro}
            </Reveal>
            <Reveal delay={0.18} className="mt-8 flex flex-wrap gap-2">
              {TEA.regions.map((r) => (
                <span key={r} className="rounded-full border border-lime/40 px-4 py-1.5 text-xs font-bold tracking-wide text-lime-light">
                  {r}
                </span>
              ))}
            </Reveal>
            <Reveal delay={0.26} className="mt-10 flex flex-wrap gap-3">
              <Magnetic>
                <Link to="/tea" className="btn-primary">
                  Explore the teas <FiArrowRight />
                </Link>
              </Magnetic>
              <a
                href={whatsappLink('Hello Craft & Weft, I would like to know more about SPHOORA teas and pack sizes.')}
                target="_blank"
                rel="noreferrer"
                className="btn border border-paper/20 text-paper hover:border-gold"
              >
                <FaWhatsapp size={16} /> Ask about packs
              </a>
            </Reveal>
          </div>

          <div className="relative lg:col-span-7">
            <div className="relative mx-auto aspect-[6/5] max-w-[640px]">
              {/* The in-view trigger sits on an unclipped wrapper: a fully clipped
                  element never registers as visible, so the reveal would never start. */}
              <motion.div
                style={{ y: yMain }}
                initial="hidden"
                whileInView="shown"
                viewport={{ once: true, amount: 0.2 }}
                className="absolute left-[8%] top-[14%] w-[70%]"
              >
                <motion.div
                  variants={{ hidden: { clipPath: 'inset(0% 100% 0% 0%)' }, shown: { clipPath: 'inset(0% 0% 0% 0%)' } }}
                  transition={{ duration: 1.3, ease: EASE }}
                  className="overflow-hidden rounded-[1.75rem] shadow-lift ring-1 ring-gold/40"
                >
                  <SmartImage src="/product-images/sphoora-udaya.jpg" alt="SPHOORA Udaya tea" className="aspect-[3/2]" />
                </motion.div>
              </motion.div>
              <motion.div
                style={{ y: yTop }}
                className="absolute right-0 top-0 w-[42%] overflow-hidden rounded-2xl border-[5px] border-ink-950 shadow-lift"
              >
                <SmartImage src="/product-images/sphoora-aabha.jpg" alt="SPHOORA Aabha tea" className="aspect-[3/2]" />
              </motion.div>
              <motion.div
                style={{ y: yLow }}
                className="absolute bottom-0 right-[6%] w-[46%] overflow-hidden rounded-2xl border-[5px] border-ink-950 shadow-lift"
              >
                <SmartImage src="/product-images/sphoora-prabha.jpg" alt="SPHOORA Prabha tea" className="aspect-[3/2]" />
              </motion.div>
              <Reveal delay={0.4} className="absolute bottom-[6%] left-0 rounded-2xl bg-paper px-5 py-4 text-ink-900 shadow-lift">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-gold-dark">Pack sizes</p>
                <p className="mt-1 font-display text-xl">{TEA.packs.join(' · ')}</p>
              </Reveal>
            </div>
          </div>
        </div>

        {/* Signature blends */}
        <div className="mt-24 border-t border-paper/10 pt-14 md:mt-32">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow text-lime-light">{blends.name}</p>
              <p className="mt-3 max-w-md text-sm leading-7 text-paper/60">{blends.intro}</p>
            </div>
            <Link to="/signature-blends" className="link-underline self-start text-sm font-extrabold text-paper md:self-auto">
              See all blends
            </Link>
          </div>

          <ul className="isolate mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-[1.75rem] bg-paper/10 sm:grid-cols-2 lg:grid-cols-4">
            {blends.items.map((b, i) => (
              <motion.li
                key={b.slug}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, delay: (i % 4) * 0.07, ease: EASE }}
                className="group relative bg-ink-950 p-6 transition-colors duration-500 hover:bg-ink-900 md:p-7"
              >
                <span className="text-[11px] font-extrabold tracking-[0.2em] text-gold/80">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="mt-3 font-display text-3xl text-paper transition-colors duration-500 group-hover:text-lime-light">{b.name}</h3>
                <p className="mt-2 font-display text-[15px] italic text-paper/70">{b.notes}</p>
                {b.origin && <p className="mt-4 text-xs font-semibold text-paper/45">{b.origin}</p>}
                <span className="absolute inset-x-6 bottom-0 h-px origin-left scale-x-0 bg-gold transition-transform duration-700 ease-silk group-hover:scale-x-100" />
              </motion.li>
            ))}
          </ul>

          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
            <span className="text-[10px] font-extrabold uppercase tracking-[0.24em] text-gold-light">{choice.name}</span>
            {choice.items.map((c, i) => (
              <span key={c.slug} className="flex items-center gap-6 font-display text-lg text-paper/80">
                {c.name}
                {i < choice.items.length - 1 && <span className="text-gold/70">✦</span>}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
