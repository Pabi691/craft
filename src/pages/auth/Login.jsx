import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiAlertCircle, FiCheckCircle, FiEye, FiEyeOff, FiLock, FiMail, FiMessageCircle } from 'react-icons/fi';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { useGlobal } from '../../context/GlobalContext';
import { apiError } from '../../lib/cart';
import { SITE, whatsappLink } from '../../config/site';
import Seo from '../../components/Seo';
import Spinner from '../../components/ui/Spinner';
import AuthShell from './AuthShell';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [verifyPending, setVerifyPending] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [resent, setResent] = useState(false);

  const { setToken } = useAuth();
  const { mergeLocalCartWithServer } = useGlobal();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.slug || '/myaccount';

  useEffect(() => {
    const message = localStorage.getItem('loginMessage');
    if (message) {
      setError(message);
      localStorage.removeItem('loginMessage');
    }
  }, []);

  useEffect(() => {
    const verified = localStorage.getItem('uservarified');
    if (localStorage.getItem('userToken') && verified && verified !== 'null') {
      navigate(redirectTo, { replace: true });
    }
  }, [navigate, redirectTo]);

  const accountInactive = !!error && /not active|deactivat/i.test(error);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post('/api/v1/webuser/login', { username, password });
      if (!data?.status) {
        setError(apiError(data, 'Login failed. Please check your details.'));
        return;
      }

      // Registered with an email that has not been verified yet.
      if (data.user_data?.email && data.user_data?.email_verified_at === null) {
        setToken(data.user_token);
        setVerifyPending(true);
        return;
      }

      if (data.user_data?.email_verified_at) localStorage.setItem('uservarified', data.user_data.email_verified_at);
      localStorage.setItem('username', data.user_data?.name || '');
      localStorage.setItem('useremail', data.user_data?.email || '');
      localStorage.setItem('role', data.user_data?.role || 'customer');
      if (data.user_data?.role === 'distributor') sessionStorage.clear();

      setToken(data.user_token);
      await mergeLocalCartWithServer(data.user_token);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(apiError(err?.response?.data, 'We could not sign you in. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  const sendResetLink = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post('/api/v1/forgot-password', { email: username });
      if (data?.status) setResetSent(true);
      else setError(data?.response || data?.message || 'Could not send the reset link.');
    } catch (err) {
      setError(apiError(err?.response?.data, 'Could not send the reset link.'));
    } finally {
      setLoading(false);
    }
  };

  const resendVerification = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/api/v1/resend_email_verification');
      if (data?.status) setResent(true);
    } finally {
      setLoading(false);
    }
  };

  if (verifyPending) {
    return (
      <>
        <Seo title="Verify your email" />
        <AuthShell eyebrow="One last step" title="Verify your email" subtitle="We've sent a verification link to your inbox. Click it and you're in.">
          {resent ? (
            <p className="inline-flex items-center gap-2 rounded-2xl bg-brand-100 px-4 py-3 text-sm font-bold text-brand-900">
              <FiCheckCircle /> Verification link sent again
            </p>
          ) : (
            <button onClick={resendVerification} disabled={loading} className="btn-dark">
              {loading ? <Spinner light /> : <FiMail size={15} />} Resend verification link
            </button>
          )}
          <p className="mt-6 text-sm text-ink-500">
            Already verified?{' '}
            <button onClick={() => setVerifyPending(false)} className="font-extrabold text-ink-900 underline underline-offset-4">
              Sign in
            </button>
          </p>
        </AuthShell>
      </>
    );
  }

  return (
    <>
      <Seo title={forgotMode ? 'Reset password' : 'Log in'} />
      <AuthShell
        eyebrow="Welcome back"
        title={forgotMode ? 'Reset your password' : 'Sign in'}
        subtitle={forgotMode ? 'Enter your registered email and we will send you a reset link.' : 'Your bag, wishlist and orders are waiting for you.'}
        footer={
          forgotMode ? (
            <button onClick={() => setForgotMode(false)} className="font-extrabold text-ink-900 underline underline-offset-4">
              Back to sign in
            </button>
          ) : (
            <>
              New to Craft &amp; Weft?{' '}
              <Link to="/register" state={location.state} className="font-extrabold text-ink-900 underline underline-offset-4">
                Create an account
              </Link>
            </>
          )
        }
      >
        {error && (
          <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 p-4">
            <p className="flex items-start gap-2.5 text-sm font-semibold text-rose-700">
              <FiAlertCircle className="mt-0.5 shrink-0" /> {error}
            </p>
            {accountInactive && (
              <div className="mt-3 flex flex-wrap gap-4 border-t border-rose-200 pt-3 text-xs font-bold">
                <a href={`mailto:${SITE.contact.email}`} className="inline-flex items-center gap-1.5 text-rose-700 underline">
                  <FiMail size={13} /> {SITE.contact.email}
                </a>
                <a href={whatsappLink('Hello, my Craft & Weft account seems inactive.')} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-rose-700 underline">
                  <FiMessageCircle size={13} /> WhatsApp support
                </a>
              </div>
            )}
          </div>
        )}

        <form onSubmit={forgotMode ? sendResetLink : submit} className="space-y-5">
          <div>
            <label htmlFor="username" className="label">
              {forgotMode ? 'Registered email' : 'Email or mobile number'}
            </label>
            <div className="relative">
              <FiMail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-400" size={16} />
              <input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={forgotMode ? 'you@example.com' : 'you@example.com or 98xxxxxxxx'}
                className="input pl-11"
                autoComplete="username"
                required
              />
            </div>
          </div>

          {!forgotMode && (
            <div>
              <label htmlFor="password" className="label">
                Password
              </label>
              <div className="relative">
                <FiLock className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-400" size={16} />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your password"
                  className="input px-11"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-ink-400 hover:text-ink-700"
                >
                  {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>
          )}

          {resetSent && (
            <p className="inline-flex items-center gap-2 rounded-2xl bg-brand-100 px-4 py-3 text-sm font-bold text-brand-900">
              <FiCheckCircle /> Reset link sent — check your inbox.
            </p>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full py-4">
            {loading ? <Spinner /> : null}
            {forgotMode ? 'Send reset link' : 'Sign in'}
          </button>
        </form>

        {!forgotMode && (
          <button onClick={() => setForgotMode(true)} className="mt-5 text-sm font-semibold text-ink-500 underline underline-offset-4 hover:text-ink-900">
            Forgot your password?
          </button>
        )}
      </AuthShell>
    </>
  );
}
