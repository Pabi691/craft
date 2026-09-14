import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import SectionHeading from '../ui/SectionHeading';
import Reveal from '../ui/Reveal';
import SmartImage from '../ui/SmartImage';
import { useImages } from '../../hooks/useImages';
import { SITE } from '../../config/site';
import { ENV } from '../../config/env';
import { EASE } from '../../lib/motion';
import { mediaUrl } from '../../lib/media';

export default function ProcessSection() {
  const { images } = useImages({ image_type: 'gallery' });
  const [active, setActive] = useState(0);
  // Gallery file names resolve against the CMS gallery; root paths ("/product-images/…") pass straight through.
  const imageFor = (file) =>
    file.startsWith('/') ? file : images.find((i) => i.image_path?.endsWith(`/${file}`))?.image_path || `${ENV.API_URL}/page-images/gallery/${file}`;

  return (
    <section className="py-24 md:py-32">
      <div className="container-x">
        <SectionHeading
          eyebrow="How it comes together"
          title="From the loom | to your *cup.*"
          text="Heritage weaves revived with artisans, shaped by designers and makers — and the same care carried from craft to cup."
        />

        <div className="mt-14 hidden h-[34rem] gap-4 lg:flex">
          {SITE.process.map((s, i) => {
            const open = active === i;
            return (
              <motion.button
                key={s.step}
                type="button"
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
                animate={{ flexGrow: open ? 3.2 : 1 }}
                transition={{ duration: 0.9, ease: EASE }}
                style={{ flexBasis: 0 }}
                className="relative overflow-hidden rounded-[2rem] text-left"
              >
                <img
                  src={mediaUrl(imageFor(s.image))}
                  alt=""
                  loading="lazy"
                  className={`absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-silk ${open ? 'scale-100' : 'scale-110'}`}
                />
                <div className={`absolute inset-0 transition-colors duration-700 ${open ? 'bg-gradient-to-t from-ink-950/85 via-ink-950/15 to-transparent' : 'bg-ink-950/55'}`} />
                <div className="absolute inset-x-0 bottom-0 p-7">
                  <span className="font-display text-sm italic text-brand-300">{s.step}</span>
                  <h3 className="mt-1 font-display text-4xl text-paper">{s.title}</h3>
                  <AnimatePresence>
                    {open && (
                      <motion.p
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: 0.3, duration: 0.6, ease: EASE }}
                        className="mt-3 max-w-sm text-sm leading-6 text-paper/80"
                      >
                        {s.text}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </motion.button>
            );
          })}
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:hidden">
          {SITE.process.map((s, i) => (
            <Reveal key={s.step} delay={(i % 2) * 0.1} className="overflow-hidden rounded-[1.75rem] bg-white/70">
              <SmartImage src={imageFor(s.image)} alt={s.title} className="aspect-[4/3]" />
              <div className="p-6">
                <span className="font-display text-sm italic text-brand-700">{s.step}</span>
                <h3 className="mt-1 font-display text-3xl text-ink-900">{s.title}</h3>
                <p className="mt-2 text-sm leading-6 text-ink-600">{s.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
