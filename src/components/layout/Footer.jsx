import { Link } from 'react-router-dom';
import { FiGlobe, FiMail, FiMapPin, FiPhone } from 'react-icons/fi';
import { FaBloggerB, FaFacebookF, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import Logo, { CraftCombineMark } from '../ui/Logo';
import SplitText from '../ui/SplitText';
import WeavePattern from '../ui/WeavePattern';
import Magnetic from '../ui/Magnetic';
import { useGlobal } from '../../context/GlobalContext';
import { SITE, telLink, whatsappLink } from '../../config/site';

const SOCIAL_ICONS = { instagram: FaInstagram, facebook: FaFacebookF, blog: FaBloggerB, website: FiGlobe };

function FooterColumn({ title, links }) {
  return (
    <div>
      <p className="text-[10px] font-extrabold uppercase tracking-[0.3em] text-paper/40">{title}</p>
      <ul className="mt-5 space-y-3">
        {links.map((l) => (
          <li key={`${l.label}-${l.to}`}>
            <Link to={l.to} className="link-underline text-sm font-semibold text-paper/75 transition-colors hover:text-paper">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  const { categoryTree } = useGlobal();
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-ink-950 pb-28 pt-20 text-paper md:pb-28 lg:pt-28">
      <WeavePattern className="absolute inset-0 text-paper" opacity={0.035} size={28} />
      <div className="pointer-events-none absolute -left-40 top-10 h-96 w-96 rounded-full bg-brand-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 bottom-40 h-96 w-96 rounded-full bg-leaf/20 blur-3xl" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-lime/60 to-transparent" />

      <div className="container-x relative">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Logo light />
            <SplitText
              as="h2"
              text="From craft to cup. | From heritage to | everyday *ritual.*"
              className="h-display mt-10 text-[2.4rem] text-paper sm:text-5xl"
              highlightClassName="italic text-lime-light"
            />
            <p className="mt-6 max-w-md text-sm leading-7 text-paper/55">{SITE.about[0]}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Magnetic>
                <a href={whatsappLink('Hello Craft & Weft, ')} target="_blank" rel="noreferrer" className="btn-primary">
                  <FaWhatsapp size={17} /> Chat on WhatsApp
                </a>
              </Magnetic>
              <a href={`mailto:${SITE.contact.email}`} className="btn border border-paper/15 text-paper hover:border-paper/60">
                Email us
              </a>
            </div>
            <div className="mt-8 flex gap-2">
              {SITE.socials.map(({ key, label, href }) => {
                const Icon = SOCIAL_ICONS[key] || FiGlobe;
                return (
                  <a
                    key={key}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    title={label}
                    className="grid h-11 w-11 place-items-center rounded-full border border-paper/15 text-paper/75 transition-colors duration-300 hover:border-lime hover:text-lime-light"
                  >
                    <Icon size={16} />
                  </a>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-6 lg:col-start-7">
            <FooterColumn
              title="Shop"
              links={[
                { label: 'All products', to: '/products' },
                ...categoryTree.flatMap((c) => [c, ...(c.children || [])]).map((c) => ({ label: c.category_name, to: `/${c.slug}` })),
              ]}
            />
            <FooterColumn
              title="The house"
              links={[
                { label: 'Our story', to: '/about-us' },
                { label: 'SPHOORA teas', to: '/tea' },
                { label: 'Gallery', to: '/gallery' },
                { label: 'Contact', to: '/contact-us' },
                { label: 'My account', to: '/myaccount' },
                { label: 'My orders', to: '/myaccount/orders' },
              ]}
            />
            <FooterColumn
              title="Help"
              links={[
                { label: 'Return policy', to: '/return-policy' },
                { label: 'Privacy policy', to: '/privacy-policy' },
                { label: 'Terms & conditions', to: '/terms-and-conditions' },
                { label: 'Wishlist', to: '/wishlist' },
                { label: 'Shopping bag', to: '/cart' },
              ]}
            />
          </div>
        </div>

        <div className="mt-16 grid gap-6 border-t border-paper/10 pt-10 sm:grid-cols-3">
          <div className="flex items-start gap-3 text-sm text-paper/70">
            <FiMapPin className="mt-0.5 shrink-0 text-lime" />
            <span>
              {SITE.contact.addressLines.map((l) => (
                <span key={l} className="block">
                  {l}
                </span>
              ))}
            </span>
          </div>
          <div className="flex items-start gap-3 text-sm text-paper/70">
            <FiPhone className="mt-0.5 shrink-0 text-lime" />
            <span>
              {SITE.contact.phones.map((p) => (
                <a key={p} href={telLink(p)} className="block hover:text-paper">
                  {p}
                </a>
              ))}
            </span>
          </div>
          <div className="flex items-start gap-3 text-sm text-paper/70">
            <FiMail className="mt-0.5 shrink-0 text-lime" />
            <span className="min-w-0">
              {SITE.contact.emails.map((e) => (
                <a key={e} href={`mailto:${e}`} className="block break-all hover:text-paper">
                  {e}
                </a>
              ))}
            </span>
          </div>
        </div>

        <p aria-hidden className="h-display mt-14 select-none whitespace-nowrap text-center text-[17vw] leading-[0.8] text-paper/[0.05] lg:text-[14.5vw]">
          Craft <span>&amp;</span> Weft
        </p>

        <div className="mt-8 flex flex-col gap-6 border-t border-paper/10 pt-8 md:flex-row md:items-center md:justify-between">
          <CraftCombineMark light />
          <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-lime-light/90">{SITE.pillars.join(' • ')}</p>
        </div>
        <div className="mt-6 flex flex-col gap-2 text-xs text-paper/40 md:flex-row md:items-center md:justify-between">
          <p>© {year} Craft &amp; Weft — an initiative of {SITE.parent}.</p>
          <p className="hidden lg:block">{SITE.promise}</p>
          <p>
            Designed &amp; developed by{' '}
            <a
              href="https://kyleinfotech.co.in/"
              target="_blank"
              rel="noopener"
              className="font-bold text-paper/70 underline decoration-lime/50 underline-offset-4 transition-colors hover:text-lime-light"
            >
              Kyle Infotech
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
