import { Helmet } from 'react-helmet-async';
import { SITE } from '../config/site';
import { mediaUrl } from '../lib/media';

const filled = (v) => (v && v !== 'null' ? v : '');

// Page meta. `seo` accepts the backend's seo_metadata object (products and
// categories carry one, edited in the CRM) and wins over the defaults.
export default function Seo({ title, description, image, seo, type = 'website' }) {
  const metaTitle = filled(seo?.meta_title) || (title ? `${title} — ${SITE.name}` : `${SITE.name} — ${SITE.tagline}`);
  const metaDesc = filled(seo?.meta_description) || description || SITE.description;
  const ogImage = mediaUrl(filled(seo?.og_image) || image);
  return (
    <Helmet>
      <title>{metaTitle}</title>
      <meta name="description" content={String(metaDesc).slice(0, 300)} />
      {filled(seo?.meta_keywords) && <meta name="keywords" content={seo.meta_keywords} />}
      {filled(seo?.canonical_url) && <link rel="canonical" href={seo.canonical_url} />}
      <meta property="og:title" content={filled(seo?.og_title) || metaTitle} />
      <meta property="og:description" content={filled(seo?.og_description) || String(metaDesc).slice(0, 300)} />
      <meta property="og:type" content={filled(seo?.og_type) || type} />
      {ogImage && <meta property="og:image" content={ogImage} />}
    </Helmet>
  );
}
