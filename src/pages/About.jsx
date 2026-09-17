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
import ScrollHighlight from '../components/ui/ScrollHighlight';
import Counter from '../components/ui/Counter';
import SmartImage from '../components/ui/SmartImage';
import WeavePattern from '../components/ui/WeavePattern';
import Marquee from '../components/ui/Marquee';
import LeafPattern from '../components/ui/LeafPattern';
import { CraftCombineMark } from '../components/ui/Logo';

// One picture per chapter of the "Who we are" story (SITE.story[1..]).
const CHAPTER_IMAGES = [
  { gallery: 'work-in-progress.jpg', alt: 'Textile waste being given new life' },
  { src: '/product-images/sphoora-udaya.jpg', alt: 'SPHOORA Udaya tea' },
  { src: '/product-images/sphoora-aabha.jpg', alt: 'SPHOORA Aabha tea' },
  { gallery: 'an-artisan.jpg', alt: 'An artisan at the loom' },
];

const SPHOORA = SITE.sphoora;

export default function About() {
  const { images } = useImages({ image_type: 'gallery' });
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const yImage = useTransform(scrollYProgress, [0, 1], ['0%', '22%']);

  // Gallery file names resolve against the CMS gallery; root paths ("/product-images/…") pass straight through.
  const imageFor = (file) =>
    file.startsWith('/') ? file : images.find((i) => i.image_path?.endsWith(`/${file}`))?.image_path || `${ENV.API_URL}/page-images/gallery/${file}`;
  const [intro, ...chapters] = SITE.story;

  const renderChapter = (chapter, i) => {
    const pic = CHAPTER_IMAGES[i] || CHAPTER_IMAGES[0];
    const flip = i % 2 === 1;
    return (
      <div key={chapter.title} className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
        <Reveal x={flip ? 40 : -40} y={0} className={`lg:col-span-5 ${flip ? 'lg:order-2 lg:col-start-8' : ''}`}>
          <SmartImage
            src={pic.src || imageFor(pic.gallery)}
            alt={pic.alt}
            className={`rounded-[2rem] shadow-lift ${pic.src ? 'aspect-[3/2]' : 'aspect-[4/3]'}`}
          />
        </Reveal>
        <div className={`lg:col-span-6 ${flip ? 'lg:order-1 lg:col-start-1' : 'lg:col-start-7'}`}>
          <Reveal as="p" y={14} className="font-display text-sm italic text-gold-dark">
            {String(i + 2).padStart(2, '0')}
          </Reveal>
          <SplitText as="h2" text={chapter.title} className="h-display mt-3 text-4xl text-ink-900 md:text-5xl" />
          {chapter.quote && (
            <Reveal as="blockquote" delay={0.05} className="mt-7 border-l-2 border-gold pl-5 font-display text-2xl italic leading-snug text-ink-800 md:text-[1.75rem]">
              {chapter.quote}
            </Reveal>
          )}
          {chapter.paragraphs.map((p, j) => (
            <Reveal key={j} as="p" delay={0.1 + j * 0.08} className="mt-6 text-[15px] leading-8 text-ink-600">
              {p}
            </Reveal>
          ))}
        </div>
      </div>
    );
  };

  const renderChapters = (list, offset) => {
    const blocks = [];
    let group = [];
    const flush = (key) => {
      if (!group.length) return;
      blocks.push(
        <section key={`chapters-${key}`} className="py-20 md:py-28">
          <div className="container-x space-y-20 md:space-y-28">{group}</div>
        </section>
      );
      group = [];
    };
    list.forEach((chapter, i) => {
      if (chapter.statement) {
        flush(i);
        blocks.push(
          <section key={`turn-${i}`} className="relative overflow-hidden bg-ink-950 py-28 text-paper md:py-40">
            <LeafPattern className="pointer-events-none absolute inset-0 text-lime" opacity={0.05} size={150} />
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-leaf/20 blur-[140px]" />
            <div className="container-x relative flex flex-col items-center text-center">
              <ScrollHighlight
                text={chapter.statement}
                className="h-display max-w-5xl text-[2.6rem] leading-[1.05] sm:text-6xl lg:text-[5.5rem]"
                highlightClassName="italic text-lime-light"
              />
              <Reveal delay={0.2} className="mt-12 flex items-center gap-5">
                <img src={SITE.hero.logo.src} alt={SITE.hero.logo.alt} width={SITE.hero.logo.width} height={SITE.hero.logo.height} loading="lazy" className="h-20 w-auto md:h-24" />
                <span aria-hidden className="h-12 w-px bg-paper/20" />
                <span className="text-left font-display text-lg italic text-paper/70">
                  SPHOORA
                  <br />& Kettletales
                </span>
              </Reveal>
            </div>
          </section>
        );
      }
      group.push(renderChapter(chapter, i + offset));
    });
    flush('end');
    return blocks;
  };

  return (
    <>
      <Seo title="Who we are" description={SITE.about[0]} />

      {/* Hero */}
      <section ref={heroRef} className="relative overflow-hidden pb-16 pt-10 md:pb-24 md:pt-16">
        <div className="pointer-events-none absolute -left-40 top-0 h-[32rem] w-[32rem] rounded-full bg-brand-200/60 blur-[130px]" />
        <div className="pointer-events-none absolute -right-40 top-40 h-[26rem] w-[26rem] rounded-full bg-leaf-soft blur-[120px]" />
        <div className="container-x relative">
          <p className="eyebrow">Who we are</p>
          <SplitText
            as="h1"
            inView={false}
            text="From Craft to Cup. | From heritage to | everyday *ritual.*"
            className="h-display mt-6 text-[2.8rem] leading-[0.95] text-ink-900 sm:text-7xl xl:text-8xl"
          />
          <Reveal delay={0.2} className="mt-8">
            <CraftCombineMark />
          </Reveal>
          <div className="mt-12 grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-5">
              {intro.paragraphs.map((p, i) => (
                <Reveal key={i} as="p" delay={i * 0.1} className={i === 0 ? 'text-lg leading-9 text-ink-700' : 'mt-6 text-[15px] leading-8 text-ink-500'}>
                  {p}
                </Reveal>
              ))}
            </div>
            <div className="lg:col-span-7">
              <motion.div style={{ y: yImage }} className="relative">
                <SmartImage src={imageFor('training-given.jpg')} alt="Weaving training with artisans" className="aspect-[16/11] rounded-[2.5rem] shadow-lift" />
                <Reveal delay={0.3} className="absolute -bottom-6 -left-4 max-w-[17rem] rounded-[1.5rem] bg-ink-950 p-6 text-paper shadow-lift ring-1 ring-gold/50 sm:-left-8">
                  <p className="font-display text-2xl italic leading-snug">{SITE.promise}</p>
                </Reveal>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* The bridge */}
      <section className="pb-8 pt-24 md:pb-12 md:pt-36">
        <div className="container-x">
          <ScrollHighlight
            text={intro.statement}
            className="h-display mx-auto max-w-5xl text-balance text-center text-[2.1rem] leading-[1.12] text-ink-900 sm:text-5xl lg:text-[3.9rem]"
            highlightClassName="italic text-leaf"
          />
        </div>
      </section>

      {/* Numbers */}
      <section className="relative overflow-hidden bg-ink-950 py-20 text-paper md:py-28">
        <WeavePattern className="absolute inset-0 text-gold" opacity={0.05} />
        <div className="container-x relative grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {SITE.stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.1} className="border-t border-gold/40 pt-6">
              <p className="font-display text-6xl font-light md:text-7xl">
                <Counter value={s.value} suffix={s.suffix} />
              </p>
              <p className="mt-3 max-w-[15rem] text-sm leading-6 text-paper/60">{s.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Story chapters: textile waste, (the turn) craft to cup, tea ritual */}
      {renderChapters(chapters.slice(0, 3), 0)}

      {/* SPHOORA */}
      <section className="relative overflow-hidden bg-ink-950 py-24 text-paper md:py-32">
        <LeafPattern className="mask-soft-left pointer-events-none absolute inset-0 text-lime" opacity={0.1} size={150} />
        <div className="pointer-events-none absolute -right-32 top-10 h-96 w-96 rounded-full bg-leaf/25 blur-[120px]" />
        <div className="pointer-events-none absolute -left-40 bottom-0 h-[26rem] w-[26rem] rounded-full bg-brand-500/15 blur-[130px]" />

        <div className="container-x relative">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <Reveal y={14}>
                <img src={SITE.hero.logo.src} alt={SITE.hero.logo.alt} width={SITE.hero.logo.width} height={SITE.hero.logo.height} loading="lazy" className="h-24 w-auto md:h-28" />
              </Reveal>
              <Reveal as="p" y={14} className="eyebrow mt-8 text-lime-light">
                SPHOORA · Fine Indian teas
              </Reveal>
              <SplitText as="h2" text={SPHOORA.title} className="h-display mt-5 text-[2.6rem] text-paper sm:text-6xl lg:text-7xl" highlightClassName="italic text-lime-light" />
              <Reveal as="p" delay={0.1} className="mt-8 max-w-xl text-base leading-8 text-paper/70 md:text-lg">
                {SPHOORA.lead}
              </Reveal>
              <Reveal as="blockquote" delay={0.2} className="mt-10 border-l-2 border-gold pl-6 font-display text-3xl italic leading-snug text-lime-light md:text-4xl">
                {SPHOORA.quote}
              </Reveal>
            </div>
            <Reveal x={40} y={0} className="lg:col-span-5">
              <SmartImage src="/product-images/sphoora-prabha.jpg" alt="SPHOORA Prabha tea" className="aspect-[3/2] rounded-[2rem] shadow-lift ring-1 ring-gold/40" />
            </Reveal>
          </div>

          <ScrollHighlight
            text={SPHOORA.statement}
            className="h-display mx-auto mt-24 max-w-4xl text-balance text-center text-[2rem] leading-[1.15] text-paper sm:text-4xl md:mt-32 lg:text-5xl"
            highlightClassName="italic text-lime-light"
          />

          <div className="isolate mt-16 grid gap-px overflow-hidden rounded-[1.75rem] bg-paper/10 md:mt-24 md:grid-cols-3">
            {SPHOORA.points.map((pt, i) => (
              <Reveal key={pt.title} delay={i * 0.08} className="bg-ink-950 p-7 md:p-8">
                <span className="text-[11px] font-extrabold tracking-[0.2em] text-gold/80">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="mt-3 font-display text-2xl text-paper">{pt.title}</h3>
                <p className="mt-3 text-sm leading-7 text-paper/60">{pt.text}</p>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-14 flex flex-col items-start justify-between gap-3 border-t border-paper/10 pt-10 md:flex-row md:items-center">
            <p className="font-display text-2xl font-light italic text-paper/85 md:text-3xl">{SPHOORA.closing}</p>
            <p className="font-display text-2xl text-gold-light md:text-3xl">{SPHOORA.signOff}</p>
          </Reveal>
        </div>
      </section>

      {/* Closing chapter: a human story in every choice */}
      <section className="py-20 md:py-28">
        <div className="container-x space-y-20 md:space-y-28">{chapters.slice(3).map((c, i) => renderChapter(c, i + 3))}</div>
      </section>

      <section className="border-y border-ink-900/10 bg-paper-200/60 py-8">
        <Marquee items={SITE.crafts} itemClassName="font-display text-4xl italic text-ink-900 md:text-6xl" separator="✦" separatorClassName="text-gold" />
      </section>

      {/* Textiles */}
      <section className="py-24 md:py-32">
        <div className="container-x">
          <SectionHeading eyebrow="What we weave" title="Threads we work *with*" text="Each fabric carries its own history, its own hands, and its own way of catching the light." />
          <div className="mt-14 grid gap-px overflow-hidden rounded-[2rem] bg-ink-900/10 sm:grid-cols-2 lg:grid-cols-3">
            {SITE.techniques.map((t, i) => (
              <Reveal key={t.name} delay={(i % 3) * 0.08} className="bg-paper-50 p-8">
                <span className="font-display text-sm italic text-gold-dark">0{i + 1}</span>
                <h3 className="mt-4 font-display text-3xl text-ink-900">{t.name}</h3>
                <p className="mt-3 text-sm leading-7 text-ink-500">{t.text}</p>
              </Reveal>
            ))}
            <Reveal delay={0.24} className="flex flex-col justify-between bg-brand-500 p-8 text-brand-on">
              <p className="font-display text-3xl leading-tight">{SITE.orderMessage.impact}</p>
              <Link to="/products" className="mt-8 inline-flex items-center gap-2 text-sm font-extrabold">
                <span className="link-underline">Shop the collection</span> <FiArrowRight />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="pb-24 md:pb-32">
        <div className="container-x">
          <SectionHeading eyebrow="How it comes together" title="From the loom | to your *cup*" />
          <div className="mt-14 space-y-6">
            {SITE.process.map((step, i) => (
              <Reveal key={step.step} delay={(i % 2) * 0.08} className="grid items-center gap-6 rounded-[2rem] border border-ink-900/5 bg-white/70 p-5 md:grid-cols-12 md:p-6">
                <div className="md:col-span-4">
                  <SmartImage src={imageFor(step.image)} alt={step.title} className="aspect-[4/3] rounded-[1.5rem]" />
                </div>
                <div className="md:col-span-8 md:pl-4">
                  <span className="font-display text-sm italic text-gold-dark">{step.step}</span>
                  <h3 className="mt-1 font-display text-3xl text-ink-900 md:text-4xl">{step.title}</h3>
                  <p className="mt-3 max-w-xl text-[15px] leading-8 text-ink-500">{step.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Values + closing */}
      <section className="relative overflow-hidden bg-ink-950 py-24 text-paper md:py-32">
        <WeavePattern className="absolute inset-0 text-gold" opacity={0.045} size={30} />
        <div className="pointer-events-none absolute -left-32 bottom-0 h-96 w-96 rounded-full bg-leaf/25 blur-[120px]" />
        <div className="container-x relative">
          <Reveal as="p" className="eyebrow text-gold-light">
            What has always defined us
          </Reveal>
          <div className="mt-8 flex flex-wrap items-baseline gap-x-6 gap-y-2">
            {SITE.values.map((v, i) => (
              <Reveal key={v} as="span" delay={i * 0.08} className="flex items-baseline gap-6 font-display text-4xl font-light text-paper md:text-6xl">
                <span className={i % 2 ? 'italic text-lime-light' : ''}>{v}</span>
                {i < SITE.values.length - 1 && <span className="text-2xl text-gold/70">✦</span>}
              </Reveal>
            ))}
          </div>

          <div className="mt-20 grid gap-10 border-t border-paper/10 pt-12 lg:grid-cols-12">
            <Reveal as="p" className="font-display text-2xl font-light italic leading-snug text-paper/85 md:text-3xl lg:col-span-7">
              {SITE.closing}
            </Reveal>
            <div className="lg:col-span-4 lg:col-start-9">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-gold-light">{SITE.pillars.join(' • ')}</p>
              <SplitText as="h3" text={SITE.invite.replace('Co-create', '*Co-create*')} className="h-display mt-5 text-3xl text-paper md:text-4xl" highlightClassName="italic text-lime-light" />
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/products" className="btn-primary">
                  Shop the collection <FiArrowRight />
                </Link>
                <Link to="/tea" className="btn border border-paper/20 text-paper hover:border-gold">
                  SPHOORA teas
                </Link>
              </div>
            </div>
          </div>

          <p className="mt-16 max-w-3xl text-sm leading-7 text-paper/50">{SITE.history}</p>
        </div>
      </section>
    </>
  );
}
