import { useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FiArrowRight, FiClock, FiDroplet, FiThermometer } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { SITE, whatsappLink } from '../config/site';
import { useGlobal } from '../context/GlobalContext';
import { isPriced, priceLabel } from '../lib/format';
import { EASE } from '../lib/motion';
import Seo from '../components/Seo';
import SplitText from '../components/ui/SplitText';
import SectionHeading from '../components/ui/SectionHeading';
import Reveal from '../components/ui/Reveal';
import SmartImage from '../components/ui/SmartImage';
import WeavePattern from '../components/ui/WeavePattern';
import LeafPattern from '../components/ui/LeafPattern';
import Magnetic from '../components/ui/Magnetic';

const TEA = SITE.tea;
const story = SITE.story.filter((c) => /cup|ritual/i.test(c.title)).flatMap((c) => c.paragraphs);

const BREW = [
  { name: 'Black teas & blends', grams: '2–3 g', temp: '90–95 °C', time: '3–4 min' },
  { name: 'Green tea', grams: '2 g', temp: '75–80 °C', time: '2–3 min' },
  { name: 'Oolong', grams: '3 g', temp: '85–90 °C', time: '3–5 min' },
];

function TeaCard({ item, range, product, index }) {
  const live = Boolean(product);
  const priced = live && isPriced(product);
  const name = range.slug === 'signature-blends' ? `${TEA.brand} ${item.name}` : item.name;
  const image = product?.primary_img || `/product-images/${item.slug}.jpg`;

  const body = (
    <>
      <div className="relative overflow-hidden rounded-[1.5rem] bg-paper-200">
        <SmartImage src={image} alt={name} className="aspect-[4/5]" imgClassName="duration-[1300ms] group-hover:scale-[1.06]" />
        <span className="pointer-events-none absolute left-3 top-3 chip bg-paper/90 text-ink-800 backdrop-blur">{TEA.packs.join(' · ')}</span>
      </div>
      <div className="px-1 pt-4">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-gold-dark">{range.name}</p>
        <h3 className="mt-1 font-display text-2xl leading-tight text-ink-900">{name}</h3>
        {item.notes && <p className="mt-1 font-display text-[15px] italic text-ink-600">{item.notes}</p>}
        {item.origin && <p className="mt-2 text-xs font-semibold text-ink-400">{item.origin}</p>}
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1">
          {priced ? (
            <>
              <span className="text-[15px] font-extrabold text-ink-900">{priceLabel(product)}</span>
              <span className="inline-flex items-center gap-1 text-xs font-extrabold text-brand-800">
                Choose pack <FiArrowRight size={12} />
              </span>
            </>
          ) : (
            <span className="text-sm font-bold italic text-ink-500">Coming soon</span>
          )}
        </div>
      </div>
    </>
  );

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.8, delay: (index % 4) * 0.07, ease: EASE }}
      className="group"
    >
      {live ? (
        <Link to={`/p/${item.slug}`} data-cursor="View" className="block">
          {body}
        </Link>
      ) : (
        <div>
          {body}
          <a
            href={whatsappLink(`Hello Craft & Weft, I'd like to order ${name}. Which pack sizes and prices are available?`)}
            target="_blank"
            rel="noreferrer"
            className="mx-1 mt-3 inline-flex items-center gap-1.5 text-xs font-extrabold text-brand-800 hover:text-ink-900"
          >
            <FaWhatsapp size={13} /> Order ahead on WhatsApp
          </a>
        </div>
      )}
    </motion.article>
  );
}

export default function Tea() {
  const { products } = useGlobal();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const yA = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const yB = useTransform(scrollYProgress, [0, 1], ['0%', '-22%']);

  // Active products only come back from the API, so a match means it's live.
  const bySlug = useMemo(() => new Map(products.map((p) => [p.slug, p])), [products]);

  return (
    <>
      <Seo
        title="SPHOORA teas"
        description="SPHOORA fine Indian teas from Craft & Weft — Connoisseur’s Choice and Signature Blends from Darjeeling, Dooars, Assam and Kangra, in 50 g, 100 g and 200 g packs."
        image="/product-images/sphoora-udaya.jpg"
      />

      {/* Hero */}
      <section ref={heroRef} className="relative overflow-hidden bg-ink-950 pb-20 pt-12 text-paper md:pb-28 md:pt-16">
        <LeafPattern className="mask-soft-left pointer-events-none absolute inset-0 text-gold" opacity={0.11} size={150} />
        <div className="pointer-events-none absolute -left-40 top-10 h-[30rem] w-[30rem] rounded-full bg-brand-500/15 blur-[130px]" />
        <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-violet/25 blur-[120px]" />

        <div className="container-x relative grid items-center gap-14 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <p className="eyebrow text-gold-light">
              {TEA.brand} · {TEA.sister}
            </p>
            <SplitText
              as="h1"
              inView={false}
              delay={0.15}
              text="From craft | to *cup.*"
              className="h-display mt-6 text-[3.4rem] text-paper sm:text-7xl xl:text-8xl"
              highlightClassName="italic text-gold-light"
            />
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8, ease: EASE }}
              className="mt-8 max-w-lg text-base leading-8 text-paper/70 md:text-lg"
            >
              {story[1]}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85, duration: 0.8, ease: EASE }}
              className="mt-8 flex flex-wrap gap-2"
            >
              {TEA.regions.map((r) => (
                <span key={r} className="rounded-full border border-gold/40 px-4 py-1.5 text-xs font-bold tracking-wide text-gold-light">
                  {r}
                </span>
              ))}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8, ease: EASE }}
              className="mt-10 flex flex-wrap gap-3"
            >
              <Magnetic>
                <a href="#signature-blends" className="btn-primary">
                  Meet the blends <FiArrowRight />
                </a>
              </Magnetic>
              <a
                href={whatsappLink('Hello Craft & Weft, I would like to order SPHOORA tea.')}
                target="_blank"
                rel="noreferrer"
                className="btn border border-paper/20 text-paper hover:border-gold"
              >
                <FaWhatsapp size={16} /> Order on WhatsApp
              </a>
            </motion.div>
          </div>

          <div className="relative lg:col-span-6">
            <div className="relative mx-auto aspect-square max-w-[560px]">
              <motion.div
                style={{ y: yA }}
                initial={{ clipPath: 'inset(100% 0% 0% 0%)' }}
                animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
                transition={{ duration: 1.3, ease: EASE, delay: 0.2 }}
                className="absolute left-0 top-[8%] w-[78%] overflow-hidden rounded-[2rem] shadow-lift ring-1 ring-gold/30"
              >
                <SmartImage src="/product-images/sphoora-prabha.jpg" alt="SPHOORA Prabha tea" className="aspect-[3/2]" loading="eager" />
              </motion.div>
              <motion.div
                style={{ y: yB }}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1.1, ease: EASE, delay: 0.6 }}
                className="absolute bottom-[6%] right-0 w-[62%] overflow-hidden rounded-[1.5rem] border-[5px] border-ink-950 shadow-lift"
              >
                <SmartImage src="/product-images/sphoora-udaya.jpg" alt="SPHOORA Udaya tea" className="aspect-[3/2]" loading="eager" />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Ritual */}
      <section className="py-20 md:py-28">
        <div className="container-x grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow="The ritual" title="A small *alchemy* | of leaf and time." size="md" />
          </div>
          <div className="space-y-6 lg:col-span-6 lg:col-start-7">
            {story.slice(2).map((p, i) => (
              <Reveal key={i} as="p" delay={i * 0.08} className={i === 0 ? 'text-lg leading-9 text-ink-700' : 'text-[15px] leading-8 text-ink-500'}>
                {p}
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Ranges */}
      {TEA.ranges.map((range) => (
        <section key={range.slug} id={range.slug} className="scroll-mt-28 pb-24 md:pb-32">
          <div className="container-x">
            <SectionHeading
              eyebrow={range.name}
              title={range.slug === 'signature-blends' ? 'Each blend, | a *feeling.*' : 'Pure, premium, | single *origin.*'}
              text={range.intro}
              action={
                <Link to={`/${range.slug}`} className="btn-outline">
                  Shop {range.name} <FiArrowRight />
                </Link>
              }
            />
            <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-12 md:gap-x-6 lg:grid-cols-4">
              {range.items.map((item, i) => (
                <TeaCard key={item.slug} item={item} range={range} product={bySlug.get(item.slug)} index={i} />
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* Brewing guide */}
      <section className="pb-24 md:pb-32">
        <div className="container-x">
          <div className="relative overflow-hidden rounded-[2.25rem] bg-brand-100 p-8 md:p-12">
            <WeavePattern className="absolute inset-0 text-brand-800" opacity={0.07} />
            <div className="relative grid gap-10 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <p className="eyebrow text-brand-900/70">Brewing guide</p>
                <h2 className="h-display mt-4 text-4xl text-ink-900 md:text-5xl">
                  Per cup, <span className="italic text-brand-800">200 ml.</span>
                </h2>
                <p className="mt-4 text-sm leading-7 text-ink-600">Every pack carries its own guide — start here, then brew to your taste. Store airtight, away from light and moisture.</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-3 lg:col-span-8">
                {BREW.map((b, i) => (
                  <Reveal key={b.name} delay={i * 0.08} className="rounded-[1.5rem] bg-paper-50 p-6">
                    <h3 className="font-display text-xl text-ink-900">{b.name}</h3>
                    <dl className="mt-5 space-y-3 text-sm text-ink-700">
                      <div className="flex items-center gap-3">
                        <FiDroplet className="text-gold-dark" /> <dt className="sr-only">Leaf</dt>
                        <dd>{b.grams} leaf</dd>
                      </div>
                      <div className="flex items-center gap-3">
                        <FiThermometer className="text-gold-dark" /> <dt className="sr-only">Water</dt>
                        <dd>{b.temp}</dd>
                      </div>
                      <div className="flex items-center gap-3">
                        <FiClock className="text-gold-dark" /> <dt className="sr-only">Steep</dt>
                        <dd>{b.time}</dd>
                      </div>
                    </dl>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Invite */}
      <section className="pb-24 text-center md:pb-32">
        <div className="container-x max-w-3xl">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-gold-dark">{SITE.pillars.join(' • ')}</p>
          <SplitText as="h2" text="Join us. Sip with us. | *Co-create* with us." className="h-display mt-6 text-4xl text-ink-900 md:text-6xl" />
          <p className="mx-auto mt-6 max-w-xl text-[15px] leading-8 text-ink-500">{SITE.story[SITE.story.length - 1].paragraphs[0]}</p>
        </div>
      </section>
    </>
  );
}
