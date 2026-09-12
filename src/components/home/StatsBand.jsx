import Counter from '../ui/Counter';
import Reveal from '../ui/Reveal';
import WeavePattern from '../ui/WeavePattern';
import { SITE } from '../../config/site';

export default function StatsBand() {
  return (
    <section className="relative overflow-hidden bg-ink-950 py-20 text-paper md:py-28">
      <WeavePattern className="absolute inset-0 text-paper" opacity={0.04} size={28} />
      <div className="pointer-events-none absolute -right-40 -top-40 h-[30rem] w-[30rem] rounded-full bg-brand-500/15 blur-3xl" />
      <div className="container-x relative">
        <Reveal as="p" className="eyebrow text-paper/50">
          The society in numbers
        </Reveal>
        <div className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {SITE.stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.1} className="border-t border-paper/15 pt-6">
              <p className="font-display text-6xl font-light text-paper md:text-7xl">
                <Counter value={s.value} suffix={s.suffix} />
              </p>
              <p className="mt-3 max-w-[15rem] text-sm leading-6 text-paper/60">{s.label}</p>
            </Reveal>
          ))}
        </div>
        <Reveal as="p" delay={0.2} className="mt-16 max-w-4xl font-display text-2xl font-light italic leading-snug text-paper/85 md:text-[2rem]">
          {SITE.history}
        </Reveal>
      </div>
    </section>
  );
}
