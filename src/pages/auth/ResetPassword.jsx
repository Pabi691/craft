import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import api from '../../lib/api';
import { apiError } from '../../lib/cart';
import Seo from '../../components/Seo';
import Spinner from '../../components/ui/Spinner';
import AuthShell from './AuthShell';

export default function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const token = params.get('token');
  const email = params.get('email');

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      setError('Use at least 6 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Both passwords must match.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/api/v1/reset-password', {
        token,
        email,
        password,
        password_confirmation: confirm,
      });
      if (data?.status) {
        setDone(true);
        setTimeout(() => navigate('/login', { replace: true }), 2600);
      } else {
        setError(apiError(data, 'This reset link is no longer valid.'));
      }
    } catch (err) {
      setError(apiError(err?.response?.data, 'Could not reset your password.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Seo title="Reset password" />
      <AuthShell
        eyebrow="Account security"
        title="Set a new password"
        subtitle={email ? `For ${email}` : 'Choose a new password for your account.'}
        footer={
          <Link to="/login" className="font-extrabold text-ink-900 underline underline-offset-4">
            Back to sign in
          </Link>
        }
      >
        {!token || !email ? (
          <p className="flex items-start gap-2.5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-800">
            <FiAlertCircle className="mt-0.5 shrink-0" /> This reset link looks incomplete. Please request a new one from the sign-in page.
          </p>
        ) : done ? (
          <p className="flex items-center gap-2 rounded-2xl bg-brand-100 px-4 py-3 text-sm font-bold text-brand-900">
            <FiCheckCircle /> Password updated — taking you to sign in…
          </p>
        ) : (
          <form onSubmit={submit} className="space-y-5">
            {error && (
              <p className="flex items-start gap-2.5 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-700">
                <FiAlertCircle className="mt-0.5 shrink-0" /> {error}
              </p>
            )}
            <div>
              <label className="label" htmlFor="password">
                New password
              </label>
              <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input" autoComplete="new-password" required />
            </div>
            <div>
              <label className="label" htmlFor="confirm">
                Confirm password
              </label>
              <input id="confirm" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className="input" autoComplete="new-password" required />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-4">
              {loading ? <Spinner /> : null} Update password
            </button>
          </form>
        )}
      </AuthShell>
    </>
  );
}
