import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import { useImages } from '../hooks/useImages';
import { SITE } from '../config/site';
import { ENV } from '../config/env';
import { EASE } from '../lib/motion';
import Seo from '../components/Seo';
import SplitText from '../components/ui/SplitText';
import SectionHeading from '../components/ui/SectionHeading';
import Reveal from '../components/ui/Reveal';
import Counter from '../components/ui/Counter';
import SmartImage from '../components/ui/SmartImage';
import WeavePattern from '../components/ui/WeavePattern';
import Marquee from '../components/ui/Marquee';

export default function About() {
  const { images } = useImages({ image_type: 'gallery' });
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const yImage = useTransform(scrollYProgress, [0, 1], ['0%', '22%']);

  const imageFor = (file) => images.find((i) => i.image_path?.endsWith(`/${file}`))?.image_path || `${ENV.API_URL}/page-images/gallery/${file}`;

  return (
    <>
      <Seo title="Our story" description={SITE.about[0]} />

      <section ref={heroRef} className="relative overflow-hidden pb-16 pt-10 md:pb-24 md:pt-16">
        <div className="pointer-events-none absolute -left-40 top-0 h-[32rem] w-[32rem] rounded-full bg-brand-200/60 blur-[130px]" />
        <div className="container-x relative">
          <p className="eyebrow">{SITE.parent}</p>
          <SplitText
            as="h1"
            inView={false}
            text="Reviving the | *handloom* heritage | of Bengal."
            className="h-display mt-6 text-[3rem] leading-[0.95] text-ink-900 sm:text-7xl xl:text-8xl"
          />
          <div className="mt-12 grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <Reveal as="p" className="text-lg leading-9 text-ink-700">
                {SITE.about[0]}
              </Reveal>
              <Reveal as="p" delay={0.1} className="mt-6 text-[15px] leading-8 text-ink-500">
                {SITE.about[1]}
              </Reveal>
              <Reveal as="p" delay={0.2} className="mt-6 text-[15px] leading-8 text-ink-500">
                {SITE.about[2]}
              </Reveal>
            </div>
            <div className="lg:col-span-7">
              <motion.div style={{ y: yImage }} className="relative">
                <SmartImage src={imageFor('training-given.jpg')} alt="Khesh weaving training in Birbhum" className="aspect-[16/11] rounded-[2.5rem] shadow-lift" />
                <Reveal delay={0.3} className="absolute -bottom-6 -left-4 max-w-[16rem] rounded-[1.5rem] bg-ink-950 p-6 text-paper shadow-lift sm:-left-8">
                  <p className="font-display text-2xl italic leading-snug">“{SITE.mission}”</p>
                </Reveal>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-ink-950 py-20 text-paper md:py-28">
        <WeavePattern className="absolute inset-0 text-paper" opacity={0.04} />
        <div className="container-x relative grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {SITE.stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.1} className="border-t border-paper/15 pt-6">
              <p className="font-display text-6xl font-light md:text-7xl">
                <Counter value={s.value} suffix={s.suffix} />
              </p>
              <p className="mt-3 max-w-[15rem] text-sm leading-6 text-paper/60">{s.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-y border-ink-900/10 bg-paper-200/60 py-8">
        <Marquee items={SITE.crafts} itemClassName="font-display text-4xl italic text-ink-900 md:text-6xl" separator="✦" separatorClassName="text-brand-500" />
      </section>

      <section className="py-24 md:py-32">
        <div className="container-x">
          <SectionHeading eyebrow="What we weave" title="Threads we work *with*" text="Each fabric carries its own history, its own hands, and its own way of catching the light." />
          <div className="mt-14 grid gap-px overflow-hidden rounded-[2rem] bg-ink-900/10 sm:grid-cols-2 lg:grid-cols-3">
            {SITE.techniques.map((t, i) => (
              <Reveal key={t.name} delay={(i % 3) * 0.08} className="bg-paper-50 p-8">
                <span className="font-display text-sm italic text-ink-400">0{i + 1}</span>
                <h3 className="mt-4 font-display text-3xl text-ink-900">{t.name}</h3>
                <p className="mt-3 text-sm leading-7 text-ink-500">{t.text}</p>
              </Reveal>
            ))}
            <Reveal delay={0.24} className="flex flex-col justify-between bg-brand-500 p-8 text-brand-on">
              <p className="font-display text-3xl leading-tight">Every piece supports an artisan household.</p>
              <Link to="/products" className="mt-8 inline-flex items-center gap-2 text-sm font-extrabold">
                <span className="link-underline">Shop the collection</span> <FiArrowRight />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="pb-24 md:pb-32">
        <div className="container-x">
          <SectionHeading eyebrow="How it's made" title="Four hands, | one *finished* piece" />
          <div className="mt-14 space-y-6">
            {SITE.process.map((step, i) => (
              <Reveal key={step.step} delay={(i % 2) * 0.08} className="grid items-center gap-6 rounded-[2rem] border border-ink-900/5 bg-white/70 p-5 md:grid-cols-12 md:p-6">
                <div className="md:col-span-4">
                  <SmartImage src={imageFor(step.image)} alt={step.title} className="aspect-[4/3] rounded-[1.5rem]" />
                </div>
                <div className="md:col-span-8 md:pl-4">
                  <span className="font-display text-sm italic text-brand-700">{step.step}</span>
                  <h3 className="mt-1 font-display text-3xl text-ink-900 md:text-4xl">{step.title}</h3>
                  <p className="mt-3 max-w-xl text-[15px] leading-8 text-ink-500">{step.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-24 md:pb-32">
        <div className="container-x">
          <div className="grid gap-8 rounded-[2.25rem] bg-paper-200/70 p-8 md:grid-cols-2 md:p-12">
            <div>
              <p className="eyebrow">Partners & reach</p>
              <h3 className="h-display mt-4 text-3xl text-ink-900 md:text-4xl">{SITE.history}</h3>
            </div>
            <div className="flex flex-col justify-end gap-4">
              <p className="text-[15px] leading-8 text-ink-600">
                Our value-addition centre in Dumdum turns handwoven fabric into finished pieces, while our outlet at City Centre 2, Rajarhat and
                government and private fairs connect artisans directly with buyers.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/gallery" className="btn-dark">
                  See the gallery <FiArrowRight />
                </Link>
                <Link to="/contact-us" className="btn-outline">
                  Work with us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
