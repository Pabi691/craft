import { motion } from 'framer-motion';
import { FiFeather, FiHeart, FiMapPin, FiUsers } from 'react-icons/fi';
import SectionHeading from '../ui/SectionHeading';
import { SITE } from '../../config/site';
import { EASE } from '../../lib/motion';

const ICONS = [FiFeather, FiUsers, FiMapPin, FiHeart];

export default function WhyUs() {
  return (
    <section className="bg-paper-200/60 py-24 md:py-32">
      <div className="container-x">
        <SectionHeading eyebrow="Why shop with us" title="Rooted in people. | Crafted *differently.*" align="center" />
        <div className="mt-16 grid gap-px overflow-hidden rounded-[2rem] bg-ink-900/10 sm:grid-cols-2 lg:grid-cols-4">
          {SITE.whyShop.map((item, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8, delay: i * 0.1, ease: EASE }}
                className="group relative bg-paper-50 p-8 md:p-10"
              >
                <span className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gold transition-transform duration-700 ease-silk group-hover:scale-x-100" />
                <span className="font-display text-sm italic text-ink-400">0{i + 1}</span>
                <span className="mt-6 grid h-14 w-14 place-items-center rounded-2xl bg-gold/15 text-gold-dark ring-1 ring-gold/30 transition-transform duration-500 ease-silk group-hover:-rotate-6 group-hover:scale-110">
                  <Icon size={22} />
                </span>
                <h3 className="mt-8 font-display text-2xl text-ink-900">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-ink-500">{item.text}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
