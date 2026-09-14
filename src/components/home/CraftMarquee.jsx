import Marquee from '../ui/Marquee';
import { SITE } from '../../config/site';

export default function CraftMarquee() {
  return (
    <section aria-label="Our crafts" className="relative space-y-3 overflow-hidden border-y border-ink-900/10 bg-paper-200/60 py-8 md:py-10">
      <Marquee
        items={SITE.crafts}
        itemClassName="font-display text-5xl font-light italic text-ink-900 md:text-7xl"
        separator="✺"
        separatorClassName="text-2xl text-gold md:text-4xl"
      />
      <Marquee
        reverse
        items={SITE.crafts}
        itemClassName="font-display text-5xl font-light text-outline text-ink-900/60 md:text-7xl"
        separator="✺"
        separatorClassName="text-2xl text-accent/70 md:text-4xl"
      />
    </section>
  );
}
