import Marquee from '../ui/Marquee';
import { SITE } from '../../config/site';

// Two opposing ribbons of words — the tea names near the top of the home
// page, the heritage weaves further down.
export default function CraftMarquee({ items = SITE.crafts, label = 'Our crafts' }) {
  return (
    <section aria-label={label} className="relative space-y-3 overflow-hidden border-y border-ink-900/10 bg-paper-200/60 py-8 md:py-10">
      <Marquee
        items={items}
        itemClassName="font-display text-5xl font-light italic text-ink-900 md:text-7xl"
        separator="✺"
        separatorClassName="text-2xl text-gold md:text-4xl"
      />
      <Marquee
        reverse
        items={items}
        itemClassName="font-display text-5xl font-light text-outline text-ink-900/60 md:text-7xl"
        separator="✺"
        separatorClassName="text-2xl text-accent/70 md:text-4xl"
      />
    </section>
  );
}
