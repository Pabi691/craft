import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { FiBriefcase, FiEdit2, FiHome, FiMapPin, FiPlus, FiTrash2, FiX } from 'react-icons/fi';
import api from '../../lib/api';
import { apiError } from '../../lib/cart';
import { EASE } from '../../lib/motion';
import { confirmDialog } from '../../lib/swal';
import EmptyState from '../../components/ui/EmptyState';
import Spinner from '../../components/ui/Spinner';

const EMPTY = {
  address_label: 'home',
  full_name: '',
  email: '',
  mobile_number: '',
  alt_mob_number: '',
  address_line_1: '',
  address_line_2: '',
  city: '',
  state: '',
  zip_code: '',
  country: 'India',
};

const LABEL_ICON = { home: FiHome, office: FiBriefcase, others: FiMapPin };

const STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Delhi', 'Goa', 'Gujarat', 'Haryana',
  'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya',
  'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
];

export default function Addresses() {
  const location = useLocation();
  const navigate = useNavigate();
  // Checkout hands off here with state, and expects us to bounce back on save.
  const cameFromCheckout = location.state?.status === 'add' || location.state?.status === 'edit';

  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [showForm, setShowForm] = useState(cameFromCheckout);
  const [form, setForm] = useState(location.state?.address || EMPTY);
  const [errors, setErrors] = useState({});

  const isEditing = !!form.id;

  useEffect(() => {
    let alive = true;
    api
      .get('/api/v1/get_customer_shipping_addresses')
      .then(({ data }) => alive && data?.status && setAddresses(data.shipping_addresses || []))
      .catch(() => {})
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const validate = () => {
    const next = {};
    if (!form.full_name?.trim()) next.full_name = 'Required';
    if (!form.email?.trim()) next.email = 'Required';
    if (!/^[0-9]{10}$/.test(String(form.mobile_number || '').replace(/\D/g, ''))) next.mobile_number = 'Enter a 10-digit number';
    if (!form.address_line_1?.trim()) next.address_line_1 = 'Required';
    if (!form.city?.trim()) next.city = 'Required';
    if (!form.state?.trim()) next.state = 'Required';
    if (!/^[0-9]{6}$/.test(String(form.zip_code || ''))) next.zip_code = 'Enter a 6-digit pincode';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const save = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      const url = isEditing ? `/api/v1/update_customer_shipping_addresses?address_id=${form.id}` : '/api/v1/add_customer_shipping_addresses';
      const { data } = await api.post(url, form);
      const saved = data?.updated_address || data?.new_address;

      setAddresses((prev) => (isEditing ? prev.map((a) => (a.id === form.id ? saved || { ...a, ...form } : a)) : [...prev, saved || form]));
      toast.success(isEditing ? 'Address updated' : 'Address saved');

      if (cameFromCheckout) {
        navigate(`/${location.state.slug || 'checkout'}`);
        return;
      }
      setShowForm(false);
      setForm(EMPTY);
    } catch (err) {
      toast.error(apiError(err?.response?.data, 'Could not save this address.'));
    } finally {
      setSaving(false);
    }
  };

  const remove = async (address) => {
    const ok = await confirmDialog({ title: 'Delete this address?', text: 'It will be removed from your account.', confirmText: 'Yes, delete' });
    if (!ok) return;
    setDeletingId(address.id);
    try {
      await api.get(`/api/v1/delete_customer_shipping_addresses/${address.id}`);
      setAddresses((prev) => prev.filter((a) => a.id !== address.id));
      toast('Address removed');
    } catch {
      toast.error('Could not delete this address.');
    } finally {
      setDeletingId(null);
    }
  };

  const closeForm = () => {
    if (cameFromCheckout) {
      navigate(`/${location.state.slug || 'checkout'}`);
      return;
    }
    setShowForm(false);
    setForm(EMPTY);
    setErrors({});
  };

  const field = (key) => `input ${errors[key] ? 'input-error' : ''}`;

  if (showForm) {
    return (
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE }} className="rounded-[1.75rem] border border-ink-900/5 bg-white/85 p-6 shadow-soft md:p-8">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="font-display text-2xl text-ink-900">{isEditing ? 'Edit address' : 'New address'}</h3>
          <button onClick={closeForm} aria-label="Close" className="icon-btn h-10 w-10 bg-ink-900/5">
            <FiX size={16} />
          </button>
        </div>

        <form onSubmit={save} className="space-y-5">
          <div>
            <p className="label">Address type</p>
            <div className="flex gap-2">
              {['home', 'office', 'others'].map((label) => {
                const Icon = LABEL_ICON[label];
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, address_label: label }))}
                    className={`flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-bold capitalize transition-colors ${
                      form.address_label === label ? 'border-ink-900 bg-ink-900 text-paper' : 'border-ink-900/10 bg-white text-ink-700 hover:border-ink-900/40'
                    }`}
                  >
                    <Icon size={14} /> {label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Full name</label>
              <input value={form.full_name} onChange={set('full_name')} className={field('full_name')} />
              {errors.full_name && <p className="mt-1 text-xs font-bold text-rose-600">{errors.full_name}</p>}
            </div>
            <div>
              <label className="label">Email</label>
              <input type="email" value={form.email} onChange={set('email')} className={field('email')} />
              {errors.email && <p className="mt-1 text-xs font-bold text-rose-600">{errors.email}</p>}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Mobile number</label>
              <input
                inputMode="numeric"
                maxLength={10}
                value={form.mobile_number}
                onChange={(e) => setForm((f) => ({ ...f, mobile_number: e.target.value.replace(/\D/g, '').slice(0, 10) }))}
                className={field('mobile_number')}
              />
              {errors.mobile_number && <p className="mt-1 text-xs font-bold text-rose-600">{errors.mobile_number}</p>}
            </div>
            <div>
              <label className="label">Alternate number (optional)</label>
              <input
                inputMode="numeric"
                maxLength={10}
                value={form.alt_mob_number || ''}
                onChange={(e) => setForm((f) => ({ ...f, alt_mob_number: e.target.value.replace(/\D/g, '').slice(0, 10) }))}
                className="input"
              />
            </div>
          </div>

          <div>
            <label className="label">Address</label>
            <textarea rows={2} value={form.address_line_1} onChange={set('address_line_1')} placeholder="House / flat, street, area" className={`${field('address_line_1')} resize-none`} />
            {errors.address_line_1 && <p className="mt-1 text-xs font-bold text-rose-600">{errors.address_line_1}</p>}
          </div>

          <div>
            <label className="label">Landmark (optional)</label>
            <input value={form.address_line_2 || ''} onChange={set('address_line_2')} className="input" />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="label">City</label>
              <input value={form.city} onChange={set('city')} className={field('city')} />
              {errors.city && <p className="mt-1 text-xs font-bold text-rose-600">{errors.city}</p>}
            </div>
            <div>
              <label className="label">State</label>
              <input list="cw-states" value={form.state} onChange={set('state')} className={field('state')} />
              <datalist id="cw-states">
                {STATES.map((s) => (
                  <option key={s} value={s} />
                ))}
              </datalist>
              {errors.state && <p className="mt-1 text-xs font-bold text-rose-600">{errors.state}</p>}
            </div>
            <div>
              <label className="label">Pincode</label>
              <input
                inputMode="numeric"
                maxLength={6}
                value={form.zip_code}
                onChange={(e) => setForm((f) => ({ ...f, zip_code: e.target.value.replace(/\D/g, '').slice(0, 6) }))}
                className={field('zip_code')}
              />
              {errors.zip_code && <p className="mt-1 text-xs font-bold text-rose-600">{errors.zip_code}</p>}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving} className="btn-primary flex-1 py-4">
              {saving ? <Spinner /> : null} {isEditing ? 'Update address' : 'Save address'}
            </button>
            <button type="button" onClick={closeForm} className="btn-outline">
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex justify-end">
        <button
          onClick={() => {
            setForm(EMPTY);
            setShowForm(true);
          }}
          className="btn-primary btn-sm"
        >
          <FiPlus size={14} /> Add new address
        </button>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {[0, 1].map((i) => (
            <div key={i} className="skeleton h-52 rounded-[1.75rem]" />
          ))}
        </div>
      ) : addresses.length === 0 ? (
        <EmptyState
          icon={FiMapPin}
          title="No addresses saved."
          text="Add a delivery address so checkout is quicker next time."
          action={
            <button
              onClick={() => {
                setForm(EMPTY);
                setShowForm(true);
              }}
              className="btn-primary"
            >
              <FiPlus size={15} /> Add an address
            </button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          <AnimatePresence>
            {addresses.filter(Boolean).map((address, i) => {
              const Icon = LABEL_ICON[address.address_label] || FiMapPin;
              return (
                <motion.div
                  key={address.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.5, delay: i * 0.05, ease: EASE }}
                  className="rounded-[1.75rem] border border-ink-900/5 bg-white/85 p-6 shadow-soft"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-2">
                      <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-100 text-brand-800">
                        <Icon size={15} />
                      </span>
                      <span className="text-xs font-extrabold uppercase tracking-wider text-ink-600">{address.address_label}</span>
                      {Number(address.is_default) === 1 && <span className="chip bg-brand-500 py-1 text-brand-on">Default</span>}
                    </span>
                    <span className="flex gap-1">
                      <button
                        onClick={() => {
                          setForm(address);
                          setShowForm(true);
                        }}
                        aria-label="Edit address"
                        className="grid h-9 w-9 place-items-center rounded-full text-ink-400 hover:bg-ink-900/5 hover:text-ink-900"
                      >
                        <FiEdit2 size={14} />
                      </button>
                      <button
                        onClick={() => remove(address)}
                        disabled={deletingId === address.id}
                        aria-label="Delete address"
                        className="grid h-9 w-9 place-items-center rounded-full text-ink-400 hover:bg-rose-50 hover:text-rose-500"
                      >
                        {deletingId === address.id ? <Spinner className="h-3.5 w-3.5" /> : <FiTrash2 size={14} />}
                      </button>
                    </span>
                  </div>

                  <p className="mt-4 font-display text-xl text-ink-900">{address.full_name}</p>
                  <p className="mt-1 text-sm leading-6 text-ink-600">
                    {address.address_line_1}
                    {address.address_line_2 ? `, ${address.address_line_2}` : ''}
                    <br />
                    {address.city}, {address.state} — {address.zip_code}
                    <br />
                    {address.country}
                  </p>
                  <p className="mt-3 border-t border-ink-900/10 pt-3 text-xs text-ink-500">
                    {address.mobile_number}
                    {address.alt_mob_number ? ` · ${address.alt_mob_number}` : ''}
                    <br />
                    {address.email}
                  </p>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
