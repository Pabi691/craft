import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import SectionHeading from '../ui/SectionHeading';
import SmartImage from '../ui/SmartImage';
import Reveal from '../ui/Reveal';
import { useImages } from '../../hooks/useImages';
import { SITE } from '../../config/site';

export default function StorySection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const yBack = useTransform(scrollYProgress, [0, 1], ['10%', '-10%']);
  const yFront = useTransform(scrollYProgress, [0, 1], ['-6%', '16%']);
  const rotate = useTransform(scrollYProgress, [0, 1], [-4, 3]);
  const { images } = useImages({ image_type: 'gallery' });

  const back = images.find((i) => /khesh/i.test(i.name || '')) || images[0];
  const front = images.find((i) => /muslin/i.test(i.name || '') && i.id !== back?.id) || images[1];

  return (
    <section ref={ref} className="relative overflow-hidden py-24 md:py-36">
      <div className="container-x grid items-center gap-16 lg:grid-cols-12">
        <div className="relative lg:col-span-6">
          <div className="relative mx-auto aspect-[5/6] max-w-[560px]">
            <motion.div style={{ y: yBack }} className="absolute left-0 top-0 h-[80%] w-[72%] overflow-hidden rounded-[2rem] shadow-lift">
              <SmartImage src={back?.image_path} alt={back?.name || 'Artisans at work'} className="h-full w-full" />
            </motion.div>
            <motion.div style={{ y: yFront, rotate }} className="absolute bottom-0 right-0 h-[58%] w-[50%] overflow-hidden rounded-arch border-[6px] border-paper shadow-lift">
              <SmartImage src={front?.image_path} alt={front?.name || 'Weaving muslin'} className="h-full w-full" />
            </motion.div>
            <Reveal delay={0.3} className="absolute -bottom-4 left-4 rounded-2xl bg-ink-950 px-5 py-4 text-paper shadow-lift md:left-8">
              <p className="font-display text-3xl">4,500+</p>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-paper/60">Artisans trained</p>
            </Reveal>
          </div>
        </div>

        <div className="lg:col-span-5 lg:col-start-8">
          <SectionHeading eyebrow="Who we are" title="Where heritage meets | everyday *ritual.*" size="md" />
          <Reveal as="p" delay={0.1} className="mt-8 text-base leading-8 text-ink-600">
            {SITE.about[0]} {SITE.about[1]}
          </Reveal>
          <Reveal as="blockquote" delay={0.2} className="mt-8 border-l-2 border-gold pl-6 font-display text-2xl italic leading-snug text-ink-800">
            {SITE.promise}
          </Reveal>
          <Reveal delay={0.3} className="mt-10 flex flex-wrap gap-3">
            <Link to="/about-us" className="btn-dark">
              Read our story <FiArrowRight />
            </Link>
            <Link to="/gallery" className="btn-outline">
              Visit the gallery
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
