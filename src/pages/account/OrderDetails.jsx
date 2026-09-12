import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiCheck, FiChevronDown, FiChevronUp, FiMapPin, FiPackage, FiTruck } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import api from '../../lib/api';
import { formatDate, formatDateTime, inr } from '../../lib/format';
import { EASE } from '../../lib/motion';
import { SITE, whatsappLink } from '../../config/site';
import Seo from '../../components/Seo';
import SmartImage from '../../components/ui/SmartImage';
import EmptyState from '../../components/ui/EmptyState';
import AccountShell from './AccountShell';
import BankDetails from './BankDetails';

// Raw status names from the tracking table, said in plain language.
const FRIENDLY = {
  'New Order': 'Order confirmed',
  Processing: 'Your order is being prepared',
  'Ready For Ship': 'Packed and ready to ship',
  Shipped: 'Shipped',
  'Out for Delivery': 'Out for delivery',
  Delivered: 'Delivered',
  'Return Requested': 'Return requested',
  'Return Accepted': 'Return approved',
  'Return  Collected': 'Return collected',
  'Return Received': 'Return received',
  'Order Cancelled': 'Order cancelled',
  'Payment Refunded': 'Refund issued',
};

export default function OrderDetails() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBreakup, setShowBreakup] = useState(false);

  useEffect(() => {
    let alive = true;
    api
      .get(`/api/v1/order/${orderId}`)
      .then(({ data }) => alive && data?.status && setOrder(data.order))
      .catch(() => {})
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [orderId]);

  const trackingId = order?.shiprocket_awb || order?.allotment_vehicle?.[0]?.ref_no || null;
  const courier = order?.shiprocket_awb ? 'Shiprocket' : order?.allotment_vehicle?.[0]?.ref_no ? 'Delhivery' : null;
  const payment = order?.order_payments?.[0];
  const returnAccepted = (order?.shipping_status || '').trim() === 'Return Accepted';

  const back = (
    <Link to="/myaccount/orders" className="btn-outline btn-sm">
      <FiArrowLeft size={14} /> All orders
    </Link>
  );

  if (loading) {
    return (
      <>
        <Seo title={`Order #CW${orderId}`} />
        <AccountShell title="Order details" back={back}>
          <div className="space-y-4">
            <div className="skeleton h-24 rounded-[1.75rem]" />
            <div className="skeleton h-56 rounded-[1.75rem]" />
            <div className="skeleton h-40 rounded-[1.75rem]" />
          </div>
        </AccountShell>
      </>
    );
  }

  if (!order) {
    return (
      <>
        <Seo title="Order not found" />
        <AccountShell title="Order details" back={back}>
          <EmptyState
            icon={FiPackage}
            title="We couldn't find that order."
            text="It may belong to a different account."
            action={
              <Link to="/myaccount/orders" className="btn-primary">
                Back to my orders
              </Link>
            }
          />
        </AccountShell>
      </>
    );
  }

  const tracking = order.order_trackings || [];

  return (
    <>
      <Seo title={`Order #CW${order.id}`} />
      <AccountShell title={`Order #CW${order.id}`} back={back}>
        <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-[1.75rem] border border-ink-900/5 bg-white/85 p-6 shadow-soft">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-ink-400">Placed on</p>
              <p className="mt-1 font-display text-xl text-ink-900">{formatDate(order.order_date)}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-ink-400">Status</p>
              <p className="mt-1 font-display text-xl text-ink-900">{order.shipping_status?.trim()}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-ink-400">Total</p>
              <p className="mt-1 font-display text-xl text-ink-900">{inr(order.pay_amt)}</p>
            </div>
            <a href={whatsappLink(`${SITE.whatsappOrderText}#CW${order.id}`)} target="_blank" rel="noreferrer" className="btn-outline btn-sm">
              <FaWhatsapp className="text-brand-700" /> Need help?
            </a>
          </div>

          <div className="rounded-[1.75rem] border border-ink-900/5 bg-white/85 p-6 shadow-soft">
            <p className="label">Items</p>
            <div className="mt-4 space-y-4">
              {(order.order_items || []).map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <Link to={item.product_details?.slug ? `/p/${item.product_details.slug}` : '#'} className="shrink-0">
                    <SmartImage src={item.product_details?.primary_img} alt={item.product_name} className="h-20 w-16 rounded-xl" />
                  </Link>
                  <div className="min-w-0 flex-1">
                    {item.product_details?.brand_details?.brand_name && (
                      <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-ink-400">{item.product_details.brand_details.brand_name}</p>
                    )}
                    <p className="truncate text-sm font-bold text-ink-900">{item.product_name}</p>
                    <p className="text-xs text-ink-500">
                      {inr(item.price)} × {item.quantity}
                    </p>
                  </div>
                  <p className="shrink-0 font-display text-lg text-ink-900">{inr(item.total_price)}</p>
                </div>
              ))}
            </div>
          </div>

          {order.shipping_info && (
            <div className="rounded-[1.75rem] border border-ink-900/5 bg-white/85 p-6 shadow-soft">
              <p className="label flex items-center gap-2">
                <FiMapPin /> Delivery address
              </p>
              <p className="mt-3 font-display text-lg text-ink-900">{order.shipping_info.full_name}</p>
              <p className="mt-1 text-sm leading-6 text-ink-600">
                {order.shipping_info.address_line_1}
                {order.shipping_info.address_line_2 ? `, ${order.shipping_info.address_line_2}` : ''}
                <br />
                {order.shipping_info.city}, {order.shipping_info.state} — {order.shipping_info.zip_code}
                <br />
                {order.shipping_info.mobile_number}
              </p>
            </div>
          )}

          <div className="rounded-[1.75rem] border border-ink-900/5 bg-white/85 p-6 shadow-soft">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="label mb-0">Tracking</p>
              {trackingId && (
                <span className="inline-flex items-center gap-2 rounded-full bg-brand-100 px-3.5 py-1.5 text-xs font-extrabold text-brand-900">
                  <FiTruck size={13} /> {courier} · {trackingId}
                </span>
              )}
            </div>

            {tracking.length === 0 ? (
              <p className="mt-4 text-sm text-ink-500">Tracking updates will appear here as your order moves.</p>
            ) : (
              <ol className="mt-6 space-y-6 border-l-2 border-dashed border-ink-900/15 pl-6">
                {tracking.map((step, i) => {
                  const raw = step.full_details?.split('=>')[1]?.trim() || step.full_details || '';
                  const label = FRIENDLY[raw] || raw || 'Status updated';
                  const last = i === tracking.length - 1;
                  return (
                    <motion.li
                      key={step.id}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: i * 0.06, ease: EASE }}
                      className="relative"
                    >
                      <span className={`absolute -left-[2.1rem] grid h-6 w-6 place-items-center rounded-full ${last ? 'bg-brand-500 text-brand-on' : 'bg-ink-900 text-paper'}`}>
                        <FiCheck size={12} />
                      </span>
                      <p className="text-sm font-bold text-ink-900">{label}</p>
                      <p className="mt-0.5 text-xs text-ink-400">{formatDateTime(step.created_at)}</p>
                    </motion.li>
                  );
                })}
              </ol>
            )}
          </div>

          {payment && (
            <div className="rounded-[1.75rem] border border-ink-900/5 bg-white/85 p-6 shadow-soft">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-display text-2xl text-ink-900">{inr(order.pay_amt)}</p>
                  <p className="text-xs font-semibold text-ink-500">
                    {payment.payment_status === 'completed'
                      ? `Paid via ${order.payment_method?.method_name}`
                      : order.payment_method?.method_name === 'COD'
                        ? 'To be paid on delivery'
                        : `Payment ${payment.payment_status}`}
                  </p>
                </div>
                <button onClick={() => setShowBreakup((v) => !v)} className="btn-outline btn-sm">
                  {showBreakup ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />} {showBreakup ? 'Hide' : 'View'} breakup
                </button>
              </div>

              {showBreakup && (
                <motion.dl initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-5 space-y-2.5 overflow-hidden border-t border-dashed border-ink-900/15 pt-5 text-sm">
                  <div className="flex justify-between text-ink-600">
                    <dt>Items total</dt>
                    <dd className="font-semibold text-ink-900">{inr(order.bill_amt)}</dd>
                  </div>
                  {Number(order.discount_amt) > 0 && (
                    <div className="flex justify-between text-ink-600">
                      <dt>Discount{order.coupon_code ? ` (${order.coupon_code})` : ''}</dt>
                      <dd className="font-semibold text-brand-800">−{inr(order.discount_amt)}</dd>
                    </div>
                  )}
                  <div className="flex justify-between text-ink-600">
                    <dt>Delivery</dt>
                    <dd className="font-semibold text-brand-800">Free</dd>
                  </div>
                  {Number(order.shipping_total) > 0 && (
                    <div className="flex justify-between text-ink-600">
                      <dt>COD charge</dt>
                      <dd className="font-semibold text-ink-900">{inr(order.shipping_total)}</dd>
                    </div>
                  )}
                  <div className="flex justify-between border-t border-dashed border-ink-900/15 pt-3 text-ink-900">
                    <dt className="font-extrabold">Total paid</dt>
                    <dd className="font-display text-xl">{inr(order.pay_amt)}</dd>
                  </div>
                  {Number(order.tax_total) > 0 && (
                    <p className="pt-1 text-[11px] text-ink-400">
                      Includes GST of {inr(order.tax_total)} (CGST {inr(order.cgst)} + SGST {inr(order.sgst)}).
                    </p>
                  )}
                </motion.dl>
              )}
            </div>
          )}

          {returnAccepted && <BankDetails />}
        </div>
      </AccountShell>
    </>
  );
}
