import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMail } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import api from '../lib/api';
import { POLICIES } from '../content/policies';
import { SITE, whatsappLink } from '../config/site';
import Seo from '../components/Seo';
import SplitText from '../components/ui/SplitText';
import Reveal from '../components/ui/Reveal';

const OTHER_PAGES = [
  { slug: 'return-policy', label: 'Returns & refunds' },
  { slug: 'privacy-policy', label: 'Privacy policy' },
  { slug: 'terms-and-conditions', label: 'Terms & conditions' },
];

const looksLikeHtml = (value) => /<[a-z][\s\S]*>/i.test(value || '');

export default function InfoPage({ slug }) {
  const fallback = POLICIES[slug] || { title: 'Information', intro: '', html: '' };
  const [page, setPage] = useState(null);

  // Content typed into the CRM (Pages) wins; otherwise the defaults show.
  useEffect(() => {
    let alive = true;
    setPage(null);
    api
      .get(`/api/v1/get_slug_data/${slug}`)
      .then(({ data }) => alive && data?.status && data.pageData && setPage(data.pageData))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [slug]);

  const cmsContent = page?.content?.trim();
  const title = page?.title || fallback.title;

  return (
    <>
      <Seo title={title} description={fallback.intro} />

      <section className="container-x pb-10 pt-10 md:pt-14">
        <p className="eyebrow">Craft &amp; Weft</p>
        <SplitText as="h1" inView={false} text={title} className="h-display mt-5 text-[2.75rem] text-ink-900 sm:text-6xl lg:text-7xl" />
        {fallback.intro && <p className="mt-6 max-w-2xl text-[15px] leading-8 text-ink-500">{fallback.intro}</p>}
      </section>

      <section className="container-x pb-24 md:pb-32">
        <div className="grid gap-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-8">
            <div className="rounded-[2rem] border border-ink-900/5 bg-white/85 p-7 shadow-soft md:p-10">
              {cmsContent ? (
                looksLikeHtml(cmsContent) ? (
                  <div className="prose-craft" dangerouslySetInnerHTML={{ __html: cmsContent }} />
                ) : (
                  <div className="prose-craft whitespace-pre-line">{cmsContent}</div>
                )
              ) : (
                <div className="prose-craft" dangerouslySetInnerHTML={{ __html: fallback.html }} />
              )}
            </div>
          </Reveal>

          <div className="lg:col-span-4">
            <div className="space-y-4 lg:sticky lg:top-[calc(var(--nav-h)+1.5rem)]">
              <div className="rounded-[1.75rem] border border-ink-900/5 bg-white/70 p-6">
                <p className="label">More pages</p>
                <ul className="mt-3 space-y-2.5">
                  {OTHER_PAGES.filter((p) => p.slug !== slug).map((p) => (
                    <li key={p.slug}>
                      <Link to={`/${p.slug}`} className="link-underline text-sm font-bold text-ink-800">
                        {p.label}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link to="/contact-us" className="link-underline text-sm font-bold text-ink-800">
                      Contact us
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="rounded-[1.75rem] bg-ink-950 p-6 text-paper">
                <p className="font-display text-2xl leading-snug">Still have a question?</p>
                <p className="mt-2 text-sm leading-7 text-paper/60">We answer on WhatsApp and email, usually the same day.</p>
                <div className="mt-5 flex flex-wrap gap-2.5">
                  <a href={whatsappLink('Hello Craft & Weft, ')} target="_blank" rel="noreferrer" className="btn-primary btn-sm">
                    <FaWhatsapp size={14} /> WhatsApp
                  </a>
                  <a href={`mailto:${SITE.contact.email}`} className="btn btn-sm border border-paper/20 text-paper hover:border-paper/60">
                    <FiMail size={14} /> Email
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
