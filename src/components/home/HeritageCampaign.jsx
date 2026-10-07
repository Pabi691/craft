import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { SITE, whatsappLink } from '../../config/site';
import Reveal from '../ui/Reveal';
import SectionHeading from '../ui/SectionHeading';
import SmartImage from '../ui/SmartImage';

// The limited-edition saree campaign. The poster carries its own typography,
// so the words beside it stay short — they are there for anyone who cannot
// see the image, and to give the enquiry a button. These sarees are not
// listed as products yet, so the main call to action is WhatsApp.
export default function HeritageCampaign() {
  const c = SITE.campaign;
  if (!c) return null;

  return (
    <section className="py-20 md:py-28">
      <div className="container-x grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
        <Reveal scale={0.96} y={28} className="lg:col-span-5">
          <SmartImage
            src={c.image}
            alt={c.alt}
            className="aspect-[2/3] rounded-[2rem] shadow-lift"
            imgClassName="duration-[1400ms] hover:scale-[1.03]"
          />
        </Reveal>

        <div className="lg:col-span-6 lg:col-start-7">
          <SectionHeading eyebrow={c.eyebrow} title={c.title} size="md" />

          <Reveal as="p" delay={0.1} className="mt-6 text-[15px] leading-8 text-ink-600">
            {c.text}
          </Reveal>

          <Reveal delay={0.16} className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            <span className="text-xs font-extrabold uppercase tracking-[0.18em] text-accent">{c.note}</span>
          </Reveal>

          <Reveal delay={0.22} className="mt-8 flex flex-wrap items-center gap-3">
            <a href={whatsappLink(c.enquiry)} target="_blank" rel="noreferrer" className="btn-primary">
              <FaWhatsapp size={18} /> {c.cta}
            </a>
            <Link to={c.to} className="btn-outline">
              {c.secondary} <FiArrowRight />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
