import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiCreditCard } from 'react-icons/fi';
import api from '../../lib/api';
import { apiError } from '../../lib/cart';
import Spinner from '../../components/ui/Spinner';

const FIELDS = [
  { key: 'account_holder_name', label: 'Account holder name' },
  { key: 'bank_name', label: 'Bank name' },
  { key: 'account_number', label: 'Account number' },
  { key: 'ifsc_code', label: 'IFSC code' },
  { key: 'branch_name', label: 'Branch name' },
  { key: 'account_type', label: 'Account type (e.g. Savings)' },
];

// Shown once a return is accepted — the refund needs a bank account.
export default function BankDetails() {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(Object.fromEntries(FIELDS.map((f) => [f.key, ''])));

  useEffect(() => {
    let alive = true;
    api
      .get('/api/v1/getCustomerBankAccounts')
      .then(({ data }) => alive && setAccount(data?.bankAccounts?.[0] || null))
      .catch(() => {})
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.post('/api/v1/addBankAccount', form);
      setAccount(data?.bankAccount || form);
      toast.success('Bank details saved for your refund');
    } catch (err) {
      toast.error(apiError(err?.response?.data, 'Could not save your bank details.'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="skeleton h-48 rounded-[1.75rem]" />;

  if (account) {
    return (
      <div className="rounded-[1.75rem] border border-ink-900/5 bg-white/85 p-6 shadow-soft">
        <p className="flex items-center gap-2 font-display text-xl text-ink-900">
          <FiCreditCard className="text-brand-700" /> Refund account
        </p>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-xs font-bold uppercase tracking-wider text-ink-400">Account holder</dt>
            <dd className="text-ink-800">{account.account_holder_name}</dd>
          </div>
          <div>
            <dt className="text-xs font-bold uppercase tracking-wider text-ink-400">Account number</dt>
            <dd className="text-ink-800">{account.account_number ? `••••${String(account.account_number).slice(-4)}` : '—'}</dd>
          </div>
          <div>
            <dt className="text-xs font-bold uppercase tracking-wider text-ink-400">Bank</dt>
            <dd className="text-ink-800">
              {account.bank_name}
              {account.branch_name ? `, ${account.branch_name}` : ''}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-bold uppercase tracking-wider text-ink-400">IFSC</dt>
            <dd className="text-ink-800">{account.ifsc_code}</dd>
          </div>
        </dl>
        <p className="mt-4 text-xs text-ink-400">Refunds are credited after the returned piece is verified — usually within 14 business days.</p>
      </div>
    );
  }

  return (
    <div className="rounded-[1.75rem] border border-ink-900/5 bg-white/85 p-6 shadow-soft md:p-8">
      <p className="font-display text-2xl text-ink-900">Add a bank account for your refund</p>
      <ol className="mt-4 list-decimal space-y-1.5 pl-5 text-sm leading-6 text-ink-500 marker:text-brand-600">
        <li>Refunds are issued after the returned product is verified.</li>
        <li>Please check the details carefully — we can't recover a wrong transfer.</li>
        <li>
          Refunds follow our <Link to="/return-policy" className="underline underline-offset-2">return policy</Link>.
        </li>
        <li>It can take up to 14 business days to reach your account.</li>
      </ol>

      <form onSubmit={submit} className="mt-6 grid gap-4 sm:grid-cols-2">
        {FIELDS.map((f) => (
          <div key={f.key}>
            <label className="label">{f.label}</label>
            <input value={form[f.key]} onChange={(e) => setForm((s) => ({ ...s, [f.key]: e.target.value }))} className="input" required />
          </div>
        ))}
        <div className="sm:col-span-2">
          <button type="submit" disabled={saving} className="btn-primary w-full py-4">
            {saving ? <Spinner /> : null} Save bank details
          </button>
        </div>
      </form>
    </div>
  );
}
