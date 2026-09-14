import { useState } from 'react';
import { FiGlobe, FiMail, FiMapPin, FiPhone, FiSend } from 'react-icons/fi';
import { FaBloggerB, FaFacebookF, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import { SITE, telLink, whatsappLink } from '../config/site';
import { CONTACT_FAQ_IDS, FAQS } from '../content/faqs';
import Seo from '../components/Seo';
import SplitText from '../components/ui/SplitText';
import Reveal from '../components/ui/Reveal';
import Accordion from '../components/ui/Accordion';
import Magnetic from '../components/ui/Magnetic';

const TOPICS = ['Order help', 'SPHOORA teas', 'Bulk / corporate gifting', 'Collaboration', 'Something else'];
const SOCIAL_ICONS = { instagram: FaInstagram, facebook: FaFacebookF, blog: FaBloggerB, website: FiGlobe };
const WHATSAPP_DISPLAY = `+91 ${SITE.contact.whatsapp.slice(2, 7)} ${SITE.contact.whatsapp.slice(7)}`;

export default function Contact() {
  const [form, setForm] = useState({ name: '', phone: '', topic: TOPICS[0], message: '' });
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const composed = `Hello Craft & Weft,%0A%0AName: ${form.name}%0APhone: ${form.phone}%0ATopic: ${form.topic}%0A%0A${form.message}`;
  const waHref = `https://wa.me/${SITE.contact.whatsapp}?text=${composed}`;
  const mailHref = `mailto:${SITE.contact.email}?subject=${encodeURIComponent(`${form.topic} — ${form.name || 'Enquiry'}`)}&body=${composed}`;

  const cards = [
    {
      icon: FiMapPin,
      title: 'Visit us',
      lines: SITE.contact.addressLines,
      action: { label: 'Get directions', href: `https://maps.google.com/?q=${encodeURIComponent(SITE.contact.mapQuery)}` },
    },
    {
      icon: FiPhone,
      title: 'Call us',
      lines: SITE.contact.phones,
      action: { label: 'Call now', href: telLink(SITE.contact.phones[0]) },
    },
    {
      icon: FaWhatsapp,
      title: 'WhatsApp',
      lines: [WHATSAPP_DISPLAY, 'Orders, prices & bulk enquiries'],
      action: { label: 'Start a chat', href: whatsappLink('Hello Craft & Weft, ') },
    },
    {
      icon: FiMail,
      title: 'Email',
      lines: SITE.contact.emails,
      action: { label: 'Write to us', href: `mailto:${SITE.contact.email}` },
    },
  ];

  const faqs = CONTACT_FAQ_IDS.map((id) => FAQS.find((f) => f.id === id));

  return (
    <>
      <Seo title="Contact" description={`Talk to Craft & Weft — ${SITE.contact.address}`} />

      <section className="container-x pb-14 pt-10 md:pt-14">
        <p className="eyebrow">Say hello</p>
        <SplitText as="h1" inView={false} text="Let's talk craft | over *tea.*" className="h-display mt-5 text-[3rem] text-ink-900 sm:text-7xl lg:text-8xl" />
        <p className="mt-6 max-w-2xl text-[15px] leading-8 text-ink-500">
          Questions about an order, a tea you would like to try, bulk gifting, or an idea to co-create — we would love to hear from you.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-2">
          {SITE.socials.map(({ key, label, href }) => {
            const Icon = SOCIAL_ICONS[key] || FiGlobe;
            return (
              <a
                key={key}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-ink-900/10 bg-white/70 px-4 py-2 text-xs font-bold text-ink-700 transition-colors duration-300 hover:border-gold hover:text-ink-900"
              >
                <Icon size={13} /> {label}
              </a>
            );
          })}
        </div>
      </section>

      <section className="container-x pb-16">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card, i) => {
            const Icon = card.icon;
            return (
              <Reveal key={card.title} delay={i * 0.08} className="group rounded-[1.75rem] border border-ink-900/5 bg-white/80 p-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-soft">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-100 text-brand-800 transition-transform duration-500 group-hover:-rotate-6">
                  <Icon size={20} />
                </span>
                <h2 className="mt-5 font-display text-xl text-ink-900">{card.title}</h2>
                <div className="mt-2 space-y-0.5 break-words text-sm leading-6 text-ink-500">
                  {card.lines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
                <a
                  href={card.action.href}
                  target={card.action.href.startsWith('http') ? '_blank' : undefined}
                  rel="noreferrer"
                  className="mt-4 inline-block text-xs font-extrabold uppercase tracking-wider text-ink-900"
                >
                  <span className="link-underline">{card.action.label}</span>
                </a>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section className="container-x pb-24">
        <div className="grid gap-6 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <div className="rounded-[2rem] border border-ink-900/5 bg-white/85 p-7 shadow-soft md:p-8">
              <h2 className="font-display text-3xl text-ink-900">Send us a message</h2>
              <p className="mt-2 text-sm leading-7 text-ink-500">Fill this in and it opens WhatsApp (or your email) with everything ready to send.</p>

              <div className="mt-6 space-y-4">
                <div>
                  <label className="label">Your name</label>
                  <input value={form.name} onChange={set('name')} className="input" placeholder="Your name" />
                </div>
                <div>
                  <label className="label">Phone</label>
                  <input
                    inputMode="numeric"
                    maxLength={10}
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value.replace(/\D/g, '').slice(0, 10) }))}
                    className="input"
                    placeholder="10-digit mobile number"
                  />
                </div>
                <div>
                  <label className="label">What is it about?</label>
                  <select value={form.topic} onChange={set('topic')} className="input">
                    {TOPICS.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label">Message</label>
                  <textarea rows={4} value={form.message} onChange={set('message')} className="input resize-none" placeholder="Tell us what you need…" />
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Magnetic>
                  <a href={waHref} target="_blank" rel="noreferrer" className="btn-primary">
                    <FaWhatsapp size={17} /> Send on WhatsApp
                  </a>
                </Magnetic>
                <a href={mailHref} className="btn-outline">
                  <FiSend size={15} /> Send as email
                </a>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="lg:col-span-7">
            <div className="h-full overflow-hidden rounded-[2rem] border border-ink-900/5 bg-white/85 shadow-soft">
              <iframe
                title="Craft & Weft on the map"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(SITE.contact.mapQuery)}&z=15&output=embed`}
                className="h-[22rem] w-full lg:h-full lg:min-h-[30rem]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                style={{ border: 0 }}
              />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="container-x pb-24 md:pb-32">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="eyebrow">Good to know</p>
            <h2 className="h-display mt-4 text-4xl text-ink-900 md:text-5xl">Frequent questions</h2>
            <p className="mt-4 text-sm leading-7 text-ink-500">
              Still unsure about something? Call or WhatsApp us on {SITE.contact.phones[0]} — a real person answers.
            </p>
          </div>
          <div className="lg:col-span-8">
            <Accordion items={faqs} />
          </div>
        </div>
      </section>
    </>
  );
}
