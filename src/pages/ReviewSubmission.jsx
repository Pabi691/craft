import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { BsStar, BsStarFill } from 'react-icons/bs';
import { FiCheckCircle } from 'react-icons/fi';
import api from '../lib/api';
import { apiError } from '../lib/cart';
import { EASE } from '../lib/motion';
import Seo from '../components/Seo';
import SplitText from '../components/ui/SplitText';
import Spinner from '../components/ui/Spinner';

const LABELS = ['', 'Poor', 'Fair', 'Good', 'Very good', 'Excellent'];

function StarPicker({ value, onChange, disabled }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex items-center gap-2">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          disabled={disabled}
          onClick={() => onChange(s)}
          onMouseEnter={() => setHover(s)}
          onMouseLeave={() => setHover(0)}
          aria-label={`${s} star${s > 1 ? 's' : ''}`}
          className="text-3xl text-amber-500 transition-transform hover:scale-110"
        >
          {s <= (hover || value) ? <BsStarFill /> : <BsStar className="text-ink-200" />}
        </button>
      ))}
    </div>
  );
}

export default function ReviewSubmission() {
  const { token } = useParams();
  const [info, setInfo] = useState(null);
  const [loadError, setLoadError] = useState('');
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rating, setRating] = useState(0);
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!token) return undefined;
    let alive = true;
    api
      .get(`/api/v1/review_link/${token}`)
      .then(({ data }) => {
        if (!alive) return;
        if (data?.status) {
          setInfo(data);
          setName(data.customer_name || '');
          setEmail(data.customer_email || '');
        } else {
          setLoadError(apiError(data, 'This review link is not valid.'));
        }
      })
      .catch(() => alive && setLoadError('This review link is invalid or has expired.'))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [token]);

  const submit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error('Please enter your name.');
    if (!email.trim()) return toast.error('Please enter your email.');
    if (!rating) return toast.error('Please choose a star rating.');
    if (!text.trim()) return toast.error('Please write a short review.');

    setSubmitting(true);
    try {
      const { data } = await api.post(`/api/v1/review_link/${token}`, { name, email, rating, review_text: text });
      if (data?.status) setDone(true);
      else toast.error(apiError(data, 'Could not submit your review.'));
    } catch (err) {
      toast.error(apiError(err?.response?.data, 'Could not submit your review.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Seo title="Write a review" />
      <section className="container-x py-14 md:py-20">
        <div className="mx-auto max-w-xl">
          <p className="eyebrow">Your experience</p>
          <SplitText as="h1" inView={false} text="How did it *feel*?" className="h-display mt-4 text-4xl text-ink-900 md:text-6xl" />

          <div className="mt-10 rounded-[1.75rem] border border-ink-900/5 bg-white/85 p-7 shadow-soft md:p-9">
            {loading && (
              <p className="flex items-center gap-3 text-sm font-semibold text-ink-500">
                <Spinner className="h-5 w-5" /> Loading your review link…
              </p>
            )}

            {!loading && loadError && <p className="text-sm font-semibold text-rose-600">{loadError}</p>}

            {done && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE }}>
                <span className="grid h-16 w-16 place-items-center rounded-full bg-brand-500 text-brand-on">
                  <FiCheckCircle size={26} />
                </span>
                <h2 className="mt-5 font-display text-2xl text-ink-900">Thank you!</h2>
                <p className="mt-2 text-sm leading-7 text-ink-500">
                  Your review has been sent to our team and will appear on the product page once approved.
                </p>
                <Link to="/products" className="btn-primary mt-6">
                  Keep exploring
                </Link>
              </motion.div>
            )}

            {!loading && !loadError && !done && info && (
              <form onSubmit={submit} className="space-y-6">
                <div className="rounded-2xl bg-paper-200/70 p-4">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-ink-400">You purchased</p>
                  <p className="mt-1 font-display text-xl text-ink-900">{info.product_name}</p>
                </div>

                <div>
                  <label className="label" htmlFor="rname">
                    Your name
                  </label>
                  <input id="rname" value={name} onChange={(e) => setName(e.target.value)} className="input" />
                </div>

                <div>
                  <label className="label" htmlFor="remail">
                    Email address
                  </label>
                  <input id="remail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input" />
                  <p className="mt-1.5 text-xs text-ink-400">Use the email from your order.</p>
                </div>

                <div>
                  <p className="label">Your rating</p>
                  <StarPicker value={rating} onChange={setRating} disabled={submitting} />
                  {rating > 0 && <p className="mt-2 text-sm font-bold text-amber-600">{LABELS[rating]}</p>}
                </div>

                <div>
                  <label className="label" htmlFor="rtext">
                    Your review
                  </label>
                  <textarea id="rtext" rows={4} value={text} onChange={(e) => setText(e.target.value)} placeholder="Tell others how the piece looks and feels…" className="input resize-none" />
                </div>

                <button type="submit" disabled={submitting || !rating} className="btn-primary w-full py-4">
                  {submitting ? <Spinner /> : null} Submit review
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
