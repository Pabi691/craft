import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiCheckCircle, FiMapPin, FiTruck } from 'react-icons/fi';
import api from '../../lib/api';
import Spinner from '../ui/Spinner';

// Pincode serviceability — same API as the reference (Delhivery via
// /search_pin_code). When the courier can't confirm (no API key yet, network)
// we still reassure with the general shipping promise instead of an error.
export default function DeliveryEstimate() {
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const check = async (e) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(pin)) {
      setError('Enter a valid 6-digit pincode');
      setResult(null);
      return;
    }
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const { data } = await api.get(`/api/v1/search_pin_code/${pin}`);
      const code = data?.status && data?.result_data?.delivery_codes?.[0]?.postal_code;
      if (code) {
        setResult({
          confirmed: true,
          eta: code.sun_tat ? '1–3 days (express)' : '3–5 days (standard)',
          cod: code.cod === 'Y',
        });
      } else {
        setResult({ confirmed: false });
      }
    } catch {
      setResult({ confirmed: false });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <p className="flex items-center gap-2 text-sm font-extrabold text-ink-900">
        <FiTruck className="text-brand-700" /> Check delivery
      </p>
      <form onSubmit={check} className="mt-3 flex gap-2">
        <div className="relative flex-1">
          <FiMapPin className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-400" />
          <input
            inputMode="numeric"
            maxLength={6}
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
            placeholder="Enter pincode"
            className="input pl-10"
          />
        </div>
        <button type="submit" disabled={loading} className="btn-dark px-5">
          {loading ? <Spinner light /> : 'Check'}
        </button>
      </form>
      <AnimatePresence mode="wait">
        {(error || result) && (
          <motion.div key={error || JSON.stringify(result)} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-3 text-sm">
            {error && <p className="font-semibold text-rose-600">{error}</p>}
            {result?.confirmed && (
              <div className="space-y-1">
                <p className="flex items-center gap-2 font-semibold text-brand-800">
                  <FiCheckCircle /> Delivers to {pin} in {result.eta}
                </p>
                <p className="text-ink-500">{result.cod ? 'Cash on delivery available' : 'Prepaid orders only for this pincode'}</p>
              </div>
            )}
            {result && !result.confirmed && (
              <p className="flex items-start gap-2 text-ink-600">
                <FiCheckCircle className="mt-0.5 shrink-0 text-brand-700" />
                We ship across India. Your delivery estimate is confirmed when the order is dispatched.
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
