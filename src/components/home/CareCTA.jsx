import { FiDroplet, FiPhoneCall, FiSun, FiWind } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import Reveal from '../ui/Reveal';
import SplitText from '../ui/SplitText';
import WeavePattern from '../ui/WeavePattern';
import Magnetic from '../ui/Magnetic';
import { SITE, telLink, whatsappLink } from '../../config/site';

const CARE = [
  { icon: FiDroplet, text: 'Hand wash with a light detergent' },
  { icon: FiWind, text: 'Wash only when necessary' },
  { icon: FiSun, text: 'Dry in shade, away from harsh sun' },
];

export default function CareCTA() {
  return (
    <section className="pb-24 md:pb-32">
      <div className="container-x grid gap-5 lg:grid-cols-2">
        <Reveal className="relative overflow-hidden rounded-[2.25rem] bg-brand-100 p-8 md:p-12">
          <WeavePattern className="absolute inset-0 text-brand-800" opacity={0.08} />
          <div className="relative">
            <p className="eyebrow text-brand-900/70">Care for your textiles</p>
            <SplitText as="h3" text="Handmade pieces love a *gentle* touch." className="h-display mt-5 text-4xl text-ink-900 md:text-5xl" highlightClassName="italic text-brand-800" />
            <ul className="mt-10 space-y-4">
              {CARE.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-4 text-[15px] font-semibold text-ink-800">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-paper text-brand-800">
                    <Icon size={18} />
                  </span>
                  {text}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="relative overflow-hidden rounded-[2.25rem] bg-ink-950 p-8 text-paper md:p-12">
          <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-leaf/30 blur-3xl" />
          <div className="relative flex h-full flex-col">
            <p className="eyebrow text-gold-light">Bulk, gifting & collaborations</p>
            <SplitText as="h3" text="Join us. Sip with us. | *Co-create* with us." className="h-display mt-5 text-4xl text-paper md:text-5xl" highlightClassName="italic text-lime-light" />
            <p className="mt-6 max-w-md text-sm leading-7 text-paper/60">
              Festive hampers of textiles and SPHOORA teas, corporate gifting or boutique stock — talk to us directly for bulk pricing and custom runs.
            </p>
            <div className="mt-auto flex flex-wrap gap-3 pt-10">
              <Magnetic>
                <a href={whatsappLink('Hello Craft & Weft, I would like to enquire about a bulk order.')} target="_blank" rel="noreferrer" className="btn-primary">
                  <FaWhatsapp size={17} /> WhatsApp us
                </a>
              </Magnetic>
              <a href={telLink(SITE.contact.phones[0])} className="btn border border-paper/20 text-paper hover:border-paper/60">
                <FiPhoneCall /> {SITE.contact.phones[0]}
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
