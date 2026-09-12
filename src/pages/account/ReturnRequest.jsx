import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { FiArrowLeft, FiCheckCircle, FiUploadCloud, FiVideo } from 'react-icons/fi';
import api from '../../lib/api';
import { apiError } from '../../lib/cart';
import { EASE } from '../../lib/motion';
import Seo from '../../components/Seo';
import Spinner from '../../components/ui/Spinner';
import AccountShell from './AccountShell';

const MAX_SIZE = 20 * 1024 * 1024; // matches the backend's 20 MB rule
const REASONS = [
  'Sizing or fit issues',
  'Damaged or defective item (needs video proof)',
  'Did not meet expectations',
  'Others (explain)',
];

export default function ReturnRequest() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [reason, setReason] = useState('');
  const [otherReason, setOtherReason] = useState('');
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const needsVideo = reason.startsWith('Damaged');

  const onFile = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    if (selected.size > MAX_SIZE) {
      setFileError('That video is larger than 20 MB.');
      setFile(null);
      return;
    }
    setFileError('');
    setFile(selected);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!reason) return toast.error('Please choose a reason.');
    if (reason === 'Others (explain)' && !otherReason.trim()) return toast.error('Please tell us what happened.');
    if (needsVideo && !file) return toast.error('Please attach a short video of the damage.');

    setSubmitting(true);
    try {
      const body = new FormData();
      body.append('order_id', orderId);
      body.append('return_reason', reason === 'Others (explain)' ? `${reason}: ${otherReason}` : reason);
      if (file) body.append('return_video', file);

      const { data } = await api.post('/api/v1/order_return_by_customer', body, { headers: { 'Content-Type': 'multipart/form-data' } });
      if (data?.status) {
        setDone(true);
      } else {
        toast.error(apiError(data, 'Could not submit your return request.'));
      }
    } catch (err) {
      toast.error(apiError(err?.response?.data, 'Could not submit your return request.'));
    } finally {
      setSubmitting(false);
    }
  };

  const back = (
    <Link to={`/myaccount/order/${orderId}`} className="btn-outline btn-sm">
      <FiArrowLeft size={14} /> Order
    </Link>
  );

  return (
    <>
      <Seo title="Request a return" />
      <AccountShell title={`Return · Order #CW${orderId}`} back={back}>
        {done ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="rounded-[1.75rem] border border-ink-900/5 bg-white/85 p-8 text-center shadow-soft"
          >
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-brand-500 text-brand-on">
              <FiCheckCircle size={26} />
            </span>
            <h3 className="mt-5 font-display text-3xl text-ink-900">Return requested</h3>
            <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-ink-500">
              Our team will review your request and update the order status. Once it's approved you can add a bank account for the refund on the order page.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link to={`/myaccount/order/${orderId}`} className="btn-primary">
                View order
              </Link>
              <Link to="/products" className="btn-outline">
                Keep shopping
              </Link>
            </div>
          </motion.div>
        ) : (
          <form onSubmit={submit} className="rounded-[1.75rem] border border-ink-900/5 bg-white/85 p-6 shadow-soft md:p-8">
            <p className="text-sm leading-7 text-ink-500">
              Tell us what went wrong and we'll take it from there. Handloom pieces vary slightly in weave and shade — that's the nature of the craft rather than a defect.
            </p>

            <div className="mt-6">
              <p className="label">Reason for return</p>
              <div className="space-y-2.5">
                {REASONS.map((r) => (
                  <button
                    type="button"
                    key={r}
                    onClick={() => setReason(r)}
                    className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3.5 text-left text-sm font-semibold transition-colors ${
                      reason === r ? 'border-ink-900 bg-brand-50 text-ink-900' : 'border-ink-900/10 text-ink-600 hover:border-ink-900/40'
                    }`}
                  >
                    <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border ${reason === r ? 'border-ink-900 bg-ink-900' : 'border-ink-900/25'}`}>
                      {reason === r && <span className="h-2 w-2 rounded-full bg-paper" />}
                    </span>
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {reason === 'Others (explain)' && (
              <div className="mt-5">
                <label className="label">Tell us more</label>
                <textarea rows={3} value={otherReason} onChange={(e) => setOtherReason(e.target.value)} className="input resize-none" placeholder="What happened?" />
              </div>
            )}

            <div className="mt-6">
              <p className="label">
                Video proof {needsVideo ? '(required)' : '(optional)'}
              </p>
              <label className="flex cursor-pointer items-center gap-4 rounded-2xl border-2 border-dashed border-ink-900/15 p-5 transition-colors hover:border-ink-900/40">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-brand-100 text-brand-800">
                  {file ? <FiVideo size={20} /> : <FiUploadCloud size={20} />}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-bold text-ink-900">{file ? file.name : 'Upload a short video'}</span>
                  <span className="block text-xs text-ink-500">MP4, MOV, AVI or FLV · up to 20 MB</span>
                </span>
                <input type="file" accept="video/mp4,video/quicktime,video/x-msvideo,video/x-flv" onChange={onFile} className="hidden" />
              </label>
              {fileError && <p className="mt-2 text-xs font-bold text-rose-600">{fileError}</p>}
            </div>

            <button type="submit" disabled={submitting} className="btn-primary mt-8 w-full py-4">
              {submitting ? <Spinner /> : null} Submit return request
            </button>
            <p className="mt-4 text-center text-[11px] text-ink-400">
              Refunds follow our <Link to="/return-policy" className="underline">return policy</Link>.
            </p>
          </form>
        )}
      </AccountShell>
    </>
  );
}
