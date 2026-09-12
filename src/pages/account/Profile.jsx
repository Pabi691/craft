import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { FiEdit2 } from 'react-icons/fi';
import api from '../../lib/api';
import { apiError } from '../../lib/cart';
import { formatDate } from '../../lib/format';
import Spinner from '../../components/ui/Spinner';

const EDITABLE = [
  { key: 'first_name', label: 'Full name' },
  { key: 'email', label: 'Email', type: 'email' },
  { key: 'mobile_number', label: 'Mobile number' },
  { key: 'alt_mob_number', label: 'Alternate number' },
  { key: 'address_line_1', label: 'Address' },
  { key: 'city', label: 'City' },
  { key: 'state', label: 'State' },
  { key: 'zip_code', label: 'Pincode' },
  { key: 'country', label: 'Country' },
];

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [draft, setDraft] = useState({});
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let alive = true;
    api
      .get('/api/v1/get_customer_details')
      .then(({ data }) => {
        if (!alive) return;
        if (data?.status !== false && data?.customer_data) {
          setProfile(data.customer_data);
          setDraft(data.customer_data);
        } else {
          setFailed(true);
        }
      })
      .catch(() => alive && setFailed(true))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      await api.post('/api/v1/update_customer_profile', draft);
      setProfile(draft);
      setEditing(false);
      if (draft.first_name) localStorage.setItem('username', draft.first_name);
      toast.success('Profile updated');
    } catch (err) {
      toast.error(apiError(err?.response?.data, 'Could not update your profile.'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="skeleton h-16 rounded-2xl" />
        ))}
      </div>
    );
  }

  if (failed) return <p className="rounded-2xl bg-paper-200/70 p-6 text-sm text-ink-500">We couldn't load your profile. Please refresh and try again.</p>;

  return (
    <div className="rounded-[1.75rem] border border-ink-900/5 bg-white/85 p-6 shadow-soft md:p-8">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-brand-500 font-display text-2xl text-brand-on">
            {(profile?.first_name || 'C').charAt(0).toUpperCase()}
          </span>
          <div>
            <p className="font-display text-2xl text-ink-900">{profile?.first_name}</p>
            <p className="text-sm text-ink-500">
              {profile?.gender ? `${profile.gender} · ` : ''}
              {profile?.dob ? formatDate(profile.dob) : ''}
            </p>
          </div>
        </div>
        {!editing && (
          <button onClick={() => setEditing(true)} className="btn-outline btn-sm">
            <FiEdit2 size={13} /> Edit
          </button>
        )}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {EDITABLE.map((f) => (
          <div key={f.key}>
            <label className="label">{f.label}</label>
            <input
              type={f.type || 'text'}
              value={draft[f.key] ?? ''}
              disabled={!editing}
              onChange={(e) => setDraft((d) => ({ ...d, [f.key]: e.target.value }))}
              placeholder={editing ? '' : 'Not provided'}
              className="input disabled:border-ink-900/5 disabled:bg-paper-200/50"
            />
          </div>
        ))}
      </div>

      {editing && (
        <div className="mt-8 flex justify-end gap-3 border-t border-ink-900/10 pt-6">
          <button
            onClick={() => {
              setDraft(profile);
              setEditing(false);
            }}
            className="btn-outline"
          >
            Cancel
          </button>
          <button onClick={save} disabled={saving} className="btn-primary">
            {saving ? <Spinner /> : null} Save changes
          </button>
        </div>
      )}
    </div>
  );
}
