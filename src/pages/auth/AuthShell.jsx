import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useImages } from '../../hooks/useImages';
import { SITE } from '../../config/site';
import { EASE } from '../../lib/motion';
import Logo from '../../components/ui/Logo';
import WeavePattern from '../../components/ui/WeavePattern';
import { mediaUrl } from '../../lib/media';

// Shared split layout for login / register / reset screens.
export default function AuthShell({ eyebrow, title, subtitle, children, footer }) {
  const { images } = useImages({ image_type: 'gallery' });
  const image = images[2] || images[0];

  return (
    <section className="container-x pb-24 pt-8 md:pt-12">
      <div className="grid overflow-hidden rounded-[2rem] border border-ink-900/5 bg-white/70 shadow-soft lg:grid-cols-2">
        <div className="relative hidden lg:block">
          {image ? (
            <img src={mediaUrl(image.image_path)} alt={image.name || ''} className="absolute inset-0 h-full w-full object-cover" />
          ) : (
            <div className="absolute inset-0 bg-ink-900" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/45 to-ink-950/20" />
          <WeavePattern className="absolute inset-0 text-paper" opacity={0.06} />
          <div className="relative flex h-full flex-col justify-between p-10">
            <Logo light />
            <div>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.9, ease: EASE }}
                className="font-display text-4xl leading-tight text-paper"
              >
                {SITE.subTagline}
              </motion.p>
              <p className="mt-4 max-w-sm text-sm leading-7 text-paper/60">{SITE.mission}</p>
              <p className="mt-8 text-[11px] font-extrabold uppercase tracking-[0.28em] text-paper/40">{SITE.parent}</p>
            </div>
          </div>
        </div>

        <div className="p-7 sm:p-10 lg:p-14">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE }} className="mx-auto w-full max-w-md">
            {eyebrow && <p className="eyebrow">{eyebrow}</p>}
            <h1 className="h-display mt-4 text-4xl text-ink-900 md:text-5xl">{title}</h1>
            {subtitle && <p className="mt-3 text-sm leading-7 text-ink-500">{subtitle}</p>}
            <div className="mt-8">{children}</div>
            {footer && <div className="mt-8 border-t border-ink-900/10 pt-6 text-sm text-ink-500">{footer}</div>}
            <p className="mt-8 text-center text-xs text-ink-400 lg:hidden">
              <Link to="/" className="underline underline-offset-4">
                Back to the store
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
