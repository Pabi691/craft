import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowUpRight } from 'react-icons/fi';
import SectionHeading from '../ui/SectionHeading';
import SmartImage from '../ui/SmartImage';
import { useImages } from '../../hooks/useImages';
import { EASE } from '../../lib/motion';

const SHAPES = ['aspect-[3/4]', 'aspect-square', 'aspect-[4/5]', 'aspect-[3/4]', 'aspect-[5/4]', 'aspect-[4/5]'];

export default function GalleryTeaser() {
  const { images } = useImages({ image_type: 'gallery' });
  if (!images.length) return null;

  return (
    <section className="py-24 md:py-32">
      <div className="container-x">
        <SectionHeading
          eyebrow="From the field"
          title="Moments from our *looms* | and fairs."
          action={
            <Link to="/gallery" className="btn-outline">
              Open the gallery <FiArrowUpRight />
            </Link>
          }
        />
        <div className="mt-14 columns-2 gap-4 md:columns-3 md:gap-5">
          {images.slice(0, 6).map((img, i) => (
            <motion.figure
              key={img.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.9, delay: (i % 3) * 0.1, ease: EASE }}
              className="group relative mb-4 break-inside-avoid overflow-hidden rounded-[1.75rem] md:mb-5"
            >
              <Link to="/gallery" data-cursor="View">
                <SmartImage src={img.image_path} alt={img.name || ''} className={SHAPES[i % SHAPES.length]} imgClassName="duration-[1400ms] group-hover:scale-105" />
                <figcaption className="absolute inset-x-0 bottom-0 translate-y-3 bg-gradient-to-t from-ink-950/85 to-transparent p-5 pt-14 text-sm leading-snug text-paper opacity-0 transition-all duration-500 ease-silk group-hover:translate-y-0 group-hover:opacity-100">
                  {img.name}
                </figcaption>
              </Link>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
