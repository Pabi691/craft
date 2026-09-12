import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { FiCheckCircle, FiChevronRight, FiClock, FiPackage, FiRefreshCw, FiXCircle } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import api from '../../lib/api';
import { formatDate, inr } from '../../lib/format';
import { EASE } from '../../lib/motion';
import { confirmDialog } from '../../lib/swal';
import { SITE, whatsappLink } from '../../config/site';
import EmptyState from '../../components/ui/EmptyState';
import Spinner from '../../components/ui/Spinner';

const statusStyle = (status = '') => {
  const s = status.trim().toLowerCase();
  if (s.includes('cancel') || s.includes('failed')) return { icon: FiXCircle, className: 'bg-ink-900 text-paper' };
  if (s.includes('deliver')) return { icon: FiCheckCircle, className: 'bg-brand-500 text-brand-on' };
  if (s.includes('return') || s.includes('refund')) return { icon: FiRefreshCw, className: 'bg-amber-500 text-white' };
  if (s.includes('pending')) return { icon: FiClock, className: 'bg-amber-500 text-white' };
  return { icon: FiPackage, className: 'bg-ink-900 text-paper' };
};

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let alive = true;
    api
      .get('/api/v1/get_my_orders')
      .then(({ data }) => alive && data?.status && setOrders(data.orders || []))
      .catch(() => {})
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  // Cancellation stays open for 24 hours after the order is placed.
  const canCancel = (order) => {
    const status = (order.shipping_status || '').trim().toLowerCase();
    if (['order cancelled', 'delivered', 'refund received'].includes(status)) return false;
    const placed = new Date(order.created_at || order.order_date);
    return (Date.now() - placed.getTime()) / 36e5 <= 24;
  };

  const cancelOrder = async (order) => {
    const ok = await confirmDialog({
      title: 'Cancel this order?',
      text: 'Frequent cancellations can restrict your account. If something is wrong, message us and we will help.',
      confirmText: 'Yes, cancel it',
      cancelText: 'Keep the order',
    });
    if (!ok) return;
    setCancelling(order.id);
    try {
      const { data } = await api.get(`/api/v1/order_cancel_by_customer/${order.id}`);
      if (data?.status) {
        setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, shipping_status: 'Order Cancelled ' } : o)));
        toast('Order cancelled');
      } else {
        toast.error(data?.message || 'Could not cancel this order.');
      }
    } catch {
      toast.error('Could not cancel this order.');
    } finally {
      setCancelling(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="skeleton h-44 rounded-[1.75rem]" />
        ))}
      </div>
    );
  }

  if (!orders.length) {
    return (
      <EmptyState
        icon={FiPackage}
        title="No orders yet."
        text="When you place an order it will appear here, with tracking and returns."
        action={
          <Link to="/products" className="btn-primary">
            Start shopping
          </Link>
        }
      />
    );
  }

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {orders.map((order, i) => {
          const { icon: Icon, className } = statusStyle(order.shipping_status);
          const delivered = (order.shipping_status || '').trim().toLowerCase() === 'delivered';
          return (
            <motion.article
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.05, ease: EASE }}
              className="rounded-[1.75rem] border border-ink-900/5 bg-white/85 p-5 shadow-soft md:p-6"
            >
              <button onClick={() => navigate(`/myaccount/order/${order.id}`)} className="flex w-full items-center justify-between gap-4 border-b border-ink-900/10 pb-4 text-left">
                <span className="flex items-center gap-3">
                  <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-full ${className}`}>
                    <Icon size={18} />
                  </span>
                  <span>
                    <span className="block font-display text-lg text-ink-900">#CW{order.id}</span>
                    <span className="block text-xs font-semibold text-ink-500">
                      {order.shipping_status?.trim()} · {formatDate(order.order_date)}
                    </span>
                  </span>
                </span>
                <FiChevronRight className="shrink-0 text-ink-300" size={20} />
              </button>

              <div className="mt-4 space-y-2">
                {(order.order_items || []).map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-3 rounded-xl bg-paper-200/60 px-4 py-3">
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-bold text-ink-900">{item.product_name}</span>
                      <span className="block text-xs text-ink-500">
                        {inr(item.price)} × {item.quantity}
                      </span>
                    </span>
                    <span className="shrink-0 text-sm font-extrabold text-ink-900">{inr(item.total_price)}</span>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm font-semibold text-ink-600">
                  Total paid <span className="font-display text-xl text-ink-900">{inr(order.pay_amt || order.net_amt)}</span>
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href={whatsappLink(`${SITE.whatsappOrderText}#CW${order.id}`)}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-outline btn-sm"
                    aria-label="Get help on WhatsApp"
                  >
                    <FaWhatsapp className="text-brand-700" /> Help
                  </a>
                  {delivered && (
                    <Link to={`/myaccount/return/${order.id}`} className="btn-outline btn-sm">
                      <FiRefreshCw size={13} /> Return
                    </Link>
                  )}
                  {canCancel(order) && (
                    <button onClick={() => cancelOrder(order)} disabled={cancelling === order.id} className="btn-outline btn-sm">
                      {cancelling === order.id ? <Spinner className="h-3.5 w-3.5" /> : <FiXCircle size={13} />} Cancel
                    </button>
                  )}
                  <Link to={`/myaccount/order/${order.id}`} className="btn-dark btn-sm">
                    Track order
                  </Link>
                </div>
              </div>
              {canCancel(order) && <p className="mt-3 text-[11px] text-ink-400">Cancellation is available within 24 hours of placing an order.</p>}
            </motion.article>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
