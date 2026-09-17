import { motion } from 'framer-motion';
import { FiCheck } from 'react-icons/fi';
import Reveal from '../ui/Reveal';
import SplitText from '../ui/SplitText';
import { SITE } from '../../config/site';
import { EASE } from '../../lib/motion';

const LAUNCH = SITE.sphoora.launch;

// "We do it again": the journey from artisans to farmers to small tea
// growers, introducing SPHOORA right under the hero.
export default function SphooraIntro() {
  return (
    <section id="introducing-sphoora" className="relative overflow-hidden py-24 md:py-32">
      <div className="pointer-events-none absolute -left-40 top-10 h-[28rem] w-[28rem] rounded-full bg-brand-200/50 blur-[130px]" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-[24rem] w-[24rem] rounded-full bg-leaf-soft blur-[120px]" />

      <div className="container-x relative grid items-center gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="flex flex-col items-center lg:col-span-4 lg:items-start">
          <Reveal scale={0.94} y={24} className="relative">
            <div aria-hidden className="absolute inset-[12%] -z-10 rounded-full bg-leaf-soft blur-2xl" />
            <img
              src={LAUNCH.logo.src}
              alt={LAUNCH.logo.alt}
              width={LAUNCH.logo.width}
              height={LAUNCH.logo.height}
              loading="lazy"
              className="h-52 w-auto animate-float sm:h-64 lg:h-72"
            />
          </Reveal>
          <Reveal as="p" delay={0.15} className="mt-8 text-center font-display text-2xl italic leading-snug text-ink-700 lg:text-left">
            {LAUNCH.tagline[0]}
            <br />
            <span className="text-leaf">{LAUNCH.tagline[1]}</span>
          </Reveal>
        </div>

        <div className="lg:col-span-7 lg:col-start-6">
          <Reveal as="p" y={14} className="eyebrow">
            {LAUNCH.eyebrow}
          </Reveal>
          <SplitText
            as="h2"
            text={LAUNCH.title}
            className="h-display mt-4 text-balance text-[2.4rem] text-ink-900 sm:text-5xl lg:text-[3.6rem]"
            highlightClassName="italic text-leaf"
          />
          <Reveal as="p" delay={0.1} className="mt-6 font-display text-xl italic text-gold-dark">
            {LAUNCH.kicker}
          </Reveal>
          <Reveal as="p" delay={0.15} className="mt-4 max-w-xl text-base leading-8 text-ink-600">
            {LAUNCH.text}
          </Reveal>

          <ol className="relative mt-12 grid gap-9 sm:grid-cols-3 sm:gap-6">
            {/* The thread from where we began to where we are now. */}
            <span aria-hidden className="absolute bottom-3 left-3 top-3 w-px bg-gradient-to-b from-ink-900/15 to-leaf sm:hidden" />
            <motion.span
              aria-hidden
              className="absolute left-3 right-3 top-3 hidden h-px origin-left bg-gradient-to-r from-ink-900/15 via-ink-900/20 to-leaf sm:block"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 1.6, ease: EASE }}
            />
            {LAUNCH.journey.map((step, i) => (
              <motion.li
                key={step.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.8, delay: 0.25 + i * 0.2, ease: EASE }}
                className="relative pl-12 sm:pl-0"
              >
                <span
                  className={`absolute left-0 top-0 grid h-6 w-6 place-items-center rounded-full sm:relative ${
                    step.now ? 'bg-leaf text-white ring-4 ring-leaf/20' : 'bg-paper ring-1 ring-ink-900/20'
                  }`}
                >
                  {step.now ? <FiCheck size={13} strokeWidth={3} /> : <span className="h-1.5 w-1.5 rounded-full bg-ink-400" />}
                </span>
                <p className={`text-[10px] font-extrabold uppercase tracking-[0.22em] sm:mt-5 ${step.now ? 'text-leaf' : 'text-ink-400'}`}>
                  {step.now ? 'Now' : String(i + 1).padStart(2, '0')}
                </p>
                <h3 className="mt-1 font-display text-2xl text-ink-900">{step.label}</h3>
                <p className="mt-2 text-sm leading-6 text-ink-500">{step.text}</p>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
