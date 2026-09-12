import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiAlertTriangle } from 'react-icons/fi';
import api from '../../lib/api';
import { apiError } from '../../lib/cart';
import { EASE } from '../../lib/motion';
import Seo from '../../components/Seo';
import Spinner from '../../components/ui/Spinner';
import AuthShell from './AuthShell';

export default function VerifyEmail() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const token = params.get('token');
  const email = params.get('email');

  const [status, setStatus] = useState('verifying'); // verifying | success | error
  const [message, setMessage] = useState('');
  const [countdown, setCountdown] = useState(4);

  useEffect(() => {
    let alive = true;
    if (!token || !email) {
      setStatus('error');
      setMessage('This verification link is incomplete. Please request a new one.');
      return undefined;
    }
    api
      .post('/api/v1/verify_email_verification', { token, email })
      .then(({ data }) => {
        if (!alive) return;
        if (data?.status) {
          localStorage.removeItem('uservarified');
          setStatus('success');
        } else {
          setStatus('error');
          setMessage(apiError(data, 'This link has expired.'));
        }
      })
      .catch((err) => {
        if (!alive) return;
        setStatus('error');
        setMessage(apiError(err?.response?.data, 'Something went wrong. Please try again.'));
      });
    return () => {
      alive = false;
    };
  }, [token, email]);

  useEffect(() => {
    if (status !== 'success') return undefined;
    if (countdown === 0) {
      navigate('/login', { replace: true });
      return undefined;
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [status, countdown, navigate]);

  return (
    <>
      <Seo title="Email verification" />
      <AuthShell
        eyebrow="Email verification"
        title={status === 'success' ? 'You’re verified' : status === 'error' ? 'Verification failed' : 'Verifying…'}
        subtitle={status === 'success' ? 'Your account is ready. Sign in and pick up where you left off.' : status === 'error' ? message : 'Just a moment while we confirm your email.'}
      >
        {status === 'verifying' && (
          <div className="flex items-center gap-3 text-sm font-semibold text-ink-500">
            <Spinner className="h-5 w-5" /> Checking your link…
          </div>
        )}

        {status === 'success' && (
          <div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 14 }}
              className="grid h-20 w-20 place-items-center rounded-full bg-brand-500 text-brand-on"
            >
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" aria-hidden>
                <motion.path
                  d="M4 12.5 L9.5 18 L20 7"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
                />
              </svg>
            </motion.div>
            <p className="mt-6 text-sm text-ink-500">Taking you to sign in in {countdown}s…</p>
            <button onClick={() => navigate('/login', { replace: true })} className="btn-primary mt-5">
              Sign in now
            </button>
          </div>
        )}

        {status === 'error' && (
          <div>
            <span className="grid h-16 w-16 place-items-center rounded-full bg-amber-100 text-amber-600">
              <FiAlertTriangle size={26} />
            </span>
            <button onClick={() => navigate('/login', { replace: true })} className="btn-dark mt-6">
              Back to sign in
            </button>
          </div>
        )}
      </AuthShell>
    </>
  );
}
