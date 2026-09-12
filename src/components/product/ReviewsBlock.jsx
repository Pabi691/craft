import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiCheckCircle } from 'react-icons/fi';
import Stars from '../ui/Stars';
import { formatDate } from '../../lib/format';

// Approved product reviews with a rating breakdown (reference
// ReviewRatingComments), plus store testimonials underneath.
export default function ReviewsBlock({ reviews = [], testimonials = [] }) {
  const [showAll, setShowAll] = useState(false);
  const total = reviews.length;
  const avg = total ? reviews.reduce((s, r) => s + Number(r.rating || 0), 0) / total : 0;
  const breakdown = [5, 4, 3, 2, 1].map((star) => ({ star, count: reviews.filter((r) => Number(r.rating) === star).length }));
  const visible = showAll ? reviews : reviews.slice(0, 3);

  return (
    <div className="space-y-10">
      <div className="grid gap-8 md:grid-cols-[220px,1fr] md:items-center">
        <div>
          <p className="font-display text-6xl text-ink-900">{avg ? avg.toFixed(1) : '—'}</p>
          <Stars value={avg} size={16} className="mt-2" />
          <p className="mt-2 text-sm text-ink-500">{total ? `${total} verified rating${total > 1 ? 's' : ''}` : 'No ratings yet'}</p>
        </div>
        <div className="space-y-2">
          {breakdown.map(({ star, count }) => (
            <div key={star} className="flex items-center gap-3 text-sm">
              <span className="w-3 font-bold text-ink-700">{star}</span>
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink-900/[0.07]">
                <motion.div
                  className="h-full rounded-full bg-brand-500"
                  initial={{ width: 0 }}
                  whileInView={{ width: total ? `${(count / total) * 100}%` : 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
              <span className="w-6 text-right text-ink-400">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {total > 0 ? (
        <div className="divide-y divide-ink-900/10">
          {visible.map((r, i) => (
            <div key={r.id || i} className="py-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-brand-100 font-display text-lg text-brand-900">
                  {(r.name || 'C').charAt(0).toUpperCase()}
                </span>
                <div>
                  <p className="text-sm font-bold text-ink-900">{r.name || 'Customer'}</p>
                  <Stars value={r.rating} size={11} />
                </div>
                <span className="ml-auto inline-flex items-center gap-1 text-xs font-bold text-brand-800">
                  <FiCheckCircle /> Verified buyer
                </span>
              </div>
              {r.review_text && <p className="mt-3 text-sm leading-7 text-ink-600">{r.review_text}</p>}
            </div>
          ))}
          {total > 3 && (
            <button onClick={() => setShowAll((v) => !v)} className="pt-5 text-sm font-extrabold text-ink-900 underline decoration-brand-500 decoration-2 underline-offset-4">
              {showAll ? 'Show fewer reviews' : `Show all ${total} reviews`}
            </button>
          )}
        </div>
      ) : (
        <p className="rounded-2xl bg-paper-200/60 p-5 text-sm text-ink-500">Be the first to share how this piece feels in your home. Reviews open after delivery.</p>
      )}

      {testimonials.length > 0 && (
        <div>
          <p className="eyebrow">What our patrons say</p>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {testimonials.slice(0, 4).map((t, i) => (
              <figure key={t.id || i} className="rounded-3xl bg-paper-200/60 p-6">
                <blockquote className="font-display text-lg italic leading-relaxed text-ink-800">“{t.review_text}”</blockquote>
                <figcaption className="mt-4 text-xs font-extrabold uppercase tracking-[0.18em] text-ink-500">
                  {t.reviewer_name}
                  {t.review_date ? ` · ${formatDate(t.review_date)}` : ''}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
