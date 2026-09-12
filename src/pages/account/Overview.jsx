import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiBookOpen, FiHelpCircle, FiMapPin, FiPackage, FiUser } from 'react-icons/fi';
import api from '../../lib/api';
import { useGlobal } from '../../context/GlobalContext';
import { getUserRole } from '../../lib/userRole';
import { formatDate, inr } from '../../lib/format';

const LINKS = [
  { label: 'Orders', text: 'Track and manage your orders', to: '/myaccount/orders', icon: FiPackage },
  { label: 'Addresses', text: 'Manage delivery locations', to: '/myaccount/addresses', icon: FiMapPin },
  { label: 'Profile', text: 'Edit your personal details', to: '/myaccount/profile', icon: FiUser },
  { label: 'Help', text: 'Questions? We are here', to: '/contact-us', icon: FiHelpCircle },
  { label: 'Our story', text: 'Meet the artisans', to: '/about-us', icon: FiBookOpen },
];

export default function Overview() {
  const { wishlist, cartCount } = useGlobal();
  const [customer, setCustomer] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const role = getUserRole();

  useEffect(() => {
    let alive = true;
    Promise.all([api.get('/api/v1/get_customer_details').catch(() => null), api.get('/api/v1/get_my_orders').catch(() => null)])
      .then(([profileRes, ordersRes]) => {
        if (!alive) return;
        if (profileRes?.data?.status !== false) setCustomer(profileRes?.data?.customer_data || null);
        if (ordersRes?.data?.status) setOrders(ordersRes.data.orders || []);
      })
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  const latest = orders[0];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-5 rounded-[1.75rem] border border-ink-900/5 bg-white/85 p-6 shadow-soft">
        {loading ? (
          <>
            <div className="skeleton h-16 w-16 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="skeleton h-5 w-40" />
              <div className="skeleton h-4 w-56" />
            </div>
          </>
        ) : (
          <>
            <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-brand-500 font-display text-2xl text-brand-on">
              {(customer?.first_name || 'C').charAt(0).toUpperCase()}
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-display text-2xl text-ink-900">{customer?.first_name || 'Welcome'}</p>
                {role === 'distributor' && <span className="chip bg-brand-100 py-1 text-brand-900">Distributor</span>}
              </div>
              <p className="truncate text-sm text-ink-500">{customer?.email}</p>
              {customer?.mobile_number && <p className="text-sm text-ink-500">{customer.mobile_number}</p>}
            </div>
          </>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: 'Orders', value: orders.length },
          { label: 'Saved pieces', value: wishlist.length },
          { label: 'In your bag', value: cartCount },
        ].map((stat) => (
          <div key={stat.label} className="rounded-[1.5rem] border border-ink-900/5 bg-white/70 p-5">
            <p className="font-display text-4xl text-ink-900">{stat.value}</p>
            <p className="mt-1 text-xs font-bold uppercase tracking-wider text-ink-400">{stat.label}</p>
          </div>
        ))}
      </div>

      {latest && (
        <div className="rounded-[1.75rem] border border-ink-900/5 bg-white/85 p-6 shadow-soft">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="label mb-0">Latest order</p>
            <Link to="/myaccount/orders" className="text-xs font-extrabold uppercase tracking-wider text-ink-900">
              <span className="link-underline">View all</span>
            </Link>
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-display text-2xl text-ink-900">#CW{latest.id}</p>
              <p className="text-sm text-ink-500">
                {latest.shipping_status?.trim()} · Placed {formatDate(latest.order_date)}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <p className="font-display text-2xl text-ink-900">{inr(latest.pay_amt || latest.net_amt)}</p>
              <Link to={`/myaccount/order/${latest.id}`} className="btn-dark btn-sm">
                Track <FiArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {LINKS.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.label}
              to={link.to}
              className="group rounded-[1.5rem] border border-ink-900/5 bg-white/70 p-6 transition-all duration-500 hover:-translate-y-1 hover:border-brand-500/40 hover:shadow-soft"
            >
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-100 text-brand-800 transition-transform duration-500 group-hover:-rotate-6">
                <Icon size={20} />
              </span>
              <p className="mt-5 font-display text-xl text-ink-900">{link.label}</p>
              <p className="mt-1 text-sm text-ink-500">{link.text}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
