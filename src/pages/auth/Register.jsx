import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiAlertCircle, FiCheckCircle, FiEye, FiEyeOff, FiMail } from 'react-icons/fi';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { useGlobal } from '../../context/GlobalContext';
import { apiError } from '../../lib/cart';
import Seo from '../../components/Seo';
import Spinner from '../../components/ui/Spinner';
import AuthShell from './AuthShell';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[0-9]{10}$/;

export default function Register() {
  const [form, setForm] = useState({ name: '', gender: '', dob: '', username: '', mobile_no: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [verifyPending, setVerifyPending] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [resent, setResent] = useState(false);

  const { setToken } = useAuth();
  const { mergeLocalCartWithServer } = useGlobal();
  const navigate = useNavigate();
  const location = useLocation();

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = 'Please tell us your name';
    else if (form.name.trim().length < 3) next.name = 'Name must be at least 3 characters';
    if (!form.username.trim()) next.username = 'Email is required';
    else if (!EMAIL_RE.test(form.username)) next.username = 'Enter a valid email address';
    if (!form.mobile_no.trim()) next.mobile_no = 'Mobile number is required';
    else if (!PHONE_RE.test(form.mobile_no)) next.mobile_no = 'Enter a valid 10-digit mobile number';
    if (!form.password) next.password = 'Password is required';
    else if (form.password.length < 6) next.password = 'Use at least 6 characters';
    if (!form.dob) next.dob = 'Date of birth is required';
    else if (new Date(form.dob) > new Date(new Date().setFullYear(new Date().getFullYear() - 10))) next.dob = 'You must be at least 10 years old';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setErrors({});
    try {
      const { data } = await api.post('/api/v1/webuser/sign_up', {
        username: form.username,
        password: form.password,
        name: form.name,
        gender: form.gender,
        dob: form.dob,
        mobile_no: form.mobile_no,
      });

      if (!data?.status) {
        setErrors({ form: apiError(data, 'Registration failed. Please try again.') });
        return;
      }

      setToken(data.user_token);
      localStorage.setItem('username', data.user_data?.name || form.name);
      localStorage.setItem('useremail', data.user_data?.email || form.username);
      localStorage.setItem('uservarified', String(data.user_data?.email_verified_at));
      localStorage.setItem('role', data.user_data?.role || 'customer');
      await mergeLocalCartWithServer(data.user_token);

      if (data.user_data?.email && data.user_data?.email_verified_at === null) {
        setRegisteredEmail(data.user_data.email);
        setVerifyPending(true);
      } else {
        navigate(location.state?.slug || '/myaccount', { replace: true });
      }
    } catch (err) {
      setErrors({ form: apiError(err?.response?.data, 'Something went wrong. Please try again.') });
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
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
        <Seo title="Check your inbox" />
        <AuthShell eyebrow="Almost there" title="Check your inbox" subtitle={`We sent a verification link to ${registeredEmail}. Click it to activate your account.`}>
          {resent ? (
            <p className="inline-flex items-center gap-2 rounded-2xl bg-brand-100 px-4 py-3 text-sm font-bold text-brand-900">
              <FiCheckCircle /> Verification link sent again
            </p>
          ) : (
            <button onClick={resend} disabled={loading} className="btn-dark">
              {loading ? <Spinner light /> : <FiMail size={15} />} Resend the email
            </button>
          )}
          <p className="mt-6 text-sm text-ink-500">
            Verified already?{' '}
            <Link to="/login" className="font-extrabold text-ink-900 underline underline-offset-4">
              Sign in
            </Link>
          </p>
        </AuthShell>
      </>
    );
  }

  const fieldClass = (key) => `input ${errors[key] ? 'input-error' : ''}`;

  return (
    <>
      <Seo title="Create an account" />
      <AuthShell
        eyebrow="Join us"
        title="Create your account"
        subtitle="Save your favourites, track orders and check out faster."
        footer={
          <>
            Already have an account?{' '}
            <Link to="/login" state={location.state} className="font-extrabold text-ink-900 underline underline-offset-4">
              Sign in
            </Link>
          </>
        }
      >
        {errors.form && (
          <p className="mb-6 flex items-start gap-2.5 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-700">
            <FiAlertCircle className="mt-0.5 shrink-0" /> {errors.form}
          </p>
        )}

        <form onSubmit={submit} className="space-y-5">
          <div>
            <label className="label" htmlFor="name">
              Full name
            </label>
            <input id="name" value={form.name} onChange={set('name')} placeholder="Your full name" className={fieldClass('name')} />
            {errors.name && <p className="mt-1.5 text-xs font-bold text-rose-600">{errors.name}</p>}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="gender">
                Gender
              </label>
              <select id="gender" value={form.gender} onChange={set('gender')} className="input">
                <option value="">Select</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="label" htmlFor="dob">
                Date of birth
              </label>
              <input id="dob" type="date" value={form.dob} onChange={set('dob')} max={new Date().toISOString().split('T')[0]} className={fieldClass('dob')} />
              {errors.dob && <p className="mt-1.5 text-xs font-bold text-rose-600">{errors.dob}</p>}
            </div>
          </div>

          <div>
            <label className="label" htmlFor="email">
              Email
            </label>
            <input id="email" type="email" value={form.username} onChange={set('username')} placeholder="you@example.com" className={fieldClass('username')} />
            {errors.username && <p className="mt-1.5 text-xs font-bold text-rose-600">{errors.username}</p>}
          </div>

          <div>
            <label className="label" htmlFor="mobile">
              Mobile number
            </label>
            <input
              id="mobile"
              inputMode="numeric"
              maxLength={10}
              value={form.mobile_no}
              onChange={(e) => setForm((f) => ({ ...f, mobile_no: e.target.value.replace(/\D/g, '').slice(0, 10) }))}
              placeholder="10-digit mobile number"
              className={fieldClass('mobile_no')}
            />
            {errors.mobile_no && <p className="mt-1.5 text-xs font-bold text-rose-600">{errors.mobile_no}</p>}
          </div>

          <div>
            <label className="label" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={set('password')}
                placeholder="At least 6 characters"
                className={`${fieldClass('password')} pr-11`}
                autoComplete="new-password"
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
            {errors.password && <p className="mt-1.5 text-xs font-bold text-rose-600">{errors.password}</p>}
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full py-4">
            {loading ? <Spinner /> : null} Create account
          </button>
        </form>
      </AuthShell>
    </>
  );
}
