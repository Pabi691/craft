import { Link } from 'react-router-dom';
import { FiMail, FiMapPin, FiPhone } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import Logo from '../ui/Logo';
import SplitText from '../ui/SplitText';
import WeavePattern from '../ui/WeavePattern';
import Magnetic from '../ui/Magnetic';
import { useGlobal } from '../../context/GlobalContext';
import { SITE, whatsappLink } from '../../config/site';

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
    <footer className="relative overflow-hidden bg-ink-950 pb-28 pt-20 text-paper md:pb-10 lg:pt-28">
      <WeavePattern className="absolute inset-0 text-paper" opacity={0.035} size={28} />
      <div className="pointer-events-none absolute -left-40 top-10 h-96 w-96 rounded-full bg-brand-500/10 blur-3xl" />

      <div className="container-x relative">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Logo light />
            <SplitText
              as="h2"
              text="Crafted with care, | inspired by *heritage.*"
              className="h-display mt-10 text-[2.6rem] text-paper sm:text-5xl"
              highlightClassName="italic text-brand-300"
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
            <FiMapPin className="mt-0.5 shrink-0 text-brand-400" /> {SITE.contact.address}
          </div>
          <div className="flex items-start gap-3 text-sm text-paper/70">
            <FiPhone className="mt-0.5 shrink-0 text-brand-400" />
            <span>
              {SITE.contact.phones.map((p, i) => (
                <a key={p} href={`tel:${p.replace(/\s/g, '')}`} className="hover:text-paper">
                  {p}
                  {i < SITE.contact.phones.length - 1 ? ' / ' : ''}
                </a>
              ))}
              <span className="block text-xs text-paper/40">Bulk orders & WhatsApp</span>
            </span>
          </div>
          <a href={`mailto:${SITE.contact.email}`} className="flex items-start gap-3 text-sm text-paper/70 hover:text-paper">
            <FiMail className="mt-0.5 shrink-0 text-brand-400" /> {SITE.contact.email}
          </a>
        </div>

        <p aria-hidden className="h-display mt-14 select-none whitespace-nowrap text-center text-[17vw] leading-[0.8] text-paper/[0.05] lg:text-[14.5vw]">
          Craft <span className="italic">&amp;</span> Weft
        </p>

        <div className="mt-8 flex flex-col gap-3 text-xs text-paper/40 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} Craft &amp; Weft — the commercial wing of {SITE.parent}.</p>
          <p>Hand wash with light detergent · Dry in shade</p>
        </div>
      </div>
    </footer>
  );
}
