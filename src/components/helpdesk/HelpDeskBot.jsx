import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { FiArrowUpRight, FiMessageCircle, FiPackage, FiRotateCcw, FiSend, FiX } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import api, { isLoggedIn } from '../../lib/api';
import { formatDate, inr } from '../../lib/format';
import { faqById, matchIntent } from '../../lib/helpdesk';
import { EASE } from '../../lib/motion';
import { SITE, whatsappLink } from '../../config/site';

// On-site help desk. Answers common questions from content/faqs.js, looks up
// a logged-in customer's orders, and hands anything else to a person on
// WhatsApp with the question pre-filled. The chat lives in sessionStorage so
// it survives page changes but not a new visit.

const STORE_KEY = 'cw_helpdesk_v1';
const NUDGE_KEY = 'cw_helpdesk_nudged';
const MAX_MESSAGES = 40;

const QUICK = [
  { label: 'Track my order', text: 'Track my order' },
  { label: 'Delivery', faq: 'delivery' },
  { label: 'Returns', faq: 'returns' },
  { label: 'SPHOORA teas', faq: 'tea-packs' },
  { label: 'Brewing', faq: 'tea-brew' },
  { label: 'Bulk & gifting', faq: 'bulk' },
  { label: 'Talk to a person', text: 'Talk to a person' },
];

let seq = 0;
const uid = () => `${Date.now().toString(36)}-${(seq += 1)}`;

const bot = (text, extra = {}) => ({ id: uid(), from: 'bot', text, ...extra });
const wa = (label, message) => ({ kind: 'external', label, href: whatsappLink(message), whatsapp: true });

const WELCOME = bot(`${SITE.orderMessage.greeting}! I’m the Craft & Weft help desk. Ask me about an order, delivery, returns or our teas — or pick a topic below.`);

const readStore = () => {
  try {
    const saved = JSON.parse(sessionStorage.getItem(STORE_KEY) || 'null');
    return Array.isArray(saved) && saved.length ? saved : [WELCOME];
  } catch {
    return [WELCOME];
  }
};

function OrderCard({ order, onNavigate }) {
  const status = (order.shipping_status || 'Processing').trim();
  return (
    <Link
      to={`/myaccount/order/${order.id}`}
      onClick={onNavigate}
      className="group flex items-center gap-3 rounded-2xl border border-ink-900/5 bg-paper-50 p-3 transition-colors hover:border-lime/60"
    >
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-100 text-brand-800">
        <FiPackage size={17} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center justify-between gap-2">
          <span className="text-sm font-extrabold text-ink-900">#CW{order.id}</span>
          <span className="text-sm font-bold text-ink-800">{inr(order.pay_amt)}</span>
        </span>
        <span className="mt-0.5 flex items-center justify-between gap-2 text-[11px] font-semibold text-ink-500">
          <span className="truncate">{status}</span>
          <span className="shrink-0">{formatDate(order.order_date || order.created_at)}</span>
        </span>
      </span>
      <FiArrowUpRight className="shrink-0 text-ink-400 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </Link>
  );
}

export default function HelpDeskBot() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(readStore);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [nudge, setNudge] = useState(false);
  const listRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORE_KEY, JSON.stringify(messages.slice(-MAX_MESSAGES)));
    } catch {
      // storage blocked — the chat still works for this page view
    }
  }, [messages]);

  useEffect(() => {
    if (!open) return;
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, typing, open]);

  useEffect(() => {
    if (open) {
      setNudge(false);
      const t = setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 350);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [open]);

  // One gentle nudge per visit, never during checkout.
  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(NUDGE_KEY) === '1';
    } catch {
      seen = true;
    }
    if (seen || pathname.startsWith('/checkout')) return undefined;
    const show = setTimeout(() => {
      setNudge(true);
      try {
        sessionStorage.setItem(NUDGE_KEY, '1');
      } catch {
        // ignore
      }
    }, 12000);
    return () => clearTimeout(show);
  }, [pathname]);

  useEffect(() => {
    if (!nudge) return undefined;
    const hide = setTimeout(() => setNudge(false), 9000);
    return () => clearTimeout(hide);
  }, [nudge]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const reply = useCallback((msg, delay = 550) => {
    setTyping(true);
    return new Promise((resolve) =>
      setTimeout(() => {
        setTyping(false);
        setMessages((prev) => [...prev, msg]);
        resolve();
      }, delay)
    );
  }, []);

  const trackOrders = useCallback(
    async (orderId) => {
      if (!isLoggedIn()) {
        await reply(
          bot(
            orderId
              ? `To show live status for order #CW${orderId}, please log in — or send the order ID to our team on WhatsApp.`
              : 'Log in to see all your orders and their live status here. No account? Our team can look it up on WhatsApp.',
            {
              actions: [
                { kind: 'link', label: 'Log in', to: '/login' },
                wa('Send order ID on WhatsApp', `Hello Craft & Weft, I need help with my order${orderId ? ` #CW${orderId}` : ' (order ID: )'}.`),
              ],
            }
          )
        );
        return;
      }

      setTyping(true);
      let orders = [];
      try {
        const { data } = await api.get('/api/v1/get_my_orders');
        orders = data?.status ? data.orders || [] : [];
      } catch {
        setTyping(false);
        await reply(bot('I couldn’t reach your orders just now. Please try again in a moment, or message us.', { actions: [wa('WhatsApp us', 'Hello Craft & Weft, I need help with my order.')] }), 0);
        return;
      }
      setTyping(false);

      if (orderId) {
        const found = orders.find((o) => Number(o.id) === Number(orderId));
        await reply(
          found
            ? bot(`Here’s order #CW${found.id}:`, { orders: [found], actions: [{ kind: 'link', label: 'Open order details', to: `/myaccount/order/${found.id}` }] })
            : bot(`I couldn’t find order #CW${orderId} on this account. If it was placed from another number or email, our team can check.`, {
                actions: [wa('Ask on WhatsApp', `Hello Craft & Weft, please check the status of order #CW${orderId}.`)],
              }),
          150
        );
        return;
      }

      if (!orders.length) {
        await reply(bot('You haven’t placed an order yet. When you do, you can track it right here.', { actions: [{ kind: 'link', label: 'Start shopping', to: '/products' }] }), 150);
        return;
      }

      await reply(
        bot(orders.length > 3 ? 'Here are your latest orders:' : 'Here are your orders:', {
          orders: orders.slice(0, 3),
          actions: [{ kind: 'link', label: 'All my orders', to: '/myaccount/orders' }],
        }),
        150
      );
    },
    [reply]
  );

  const answer = useCallback(
    async (text, forcedFaq) => {
      const intent = forcedFaq ? { id: 'faq', faq: faqById(forcedFaq) } : matchIntent(text);

      switch (intent.id) {
        case 'greet':
          await reply(bot('Hello! How can I help you today?'));
          break;
        case 'thanks':
          await reply(bot(`Happy to help. ${SITE.orderMessage.signOff}`));
          break;
        case 'track':
          await trackOrders(intent.orderId);
          break;
        case 'human':
          await reply(
            bot(`Our team is on WhatsApp and phone — ${SITE.contact.phones.join(' / ')}.`, {
              actions: [wa('Chat on WhatsApp', 'Hello Craft & Weft, I need some help.'), { kind: 'link', label: 'Contact page', to: '/contact-us' }],
            })
          );
          break;
        case 'faq': {
          const { faq } = intent;
          const actions = [];
          if (faq.id === 'returns' || faq.id === 'cancel') actions.push({ kind: 'link', label: 'My orders', to: '/myaccount/orders' });
          if (faq.id.startsWith('tea')) actions.push({ kind: 'link', label: 'Explore SPHOORA teas', to: '/tea' });
          if (faq.id === 'about') actions.push({ kind: 'link', label: 'Our story', to: '/about-us' });
          if (faq.id === 'price' || faq.id === 'bulk') actions.push(wa('Ask on WhatsApp', `Hello Craft & Weft, ${faq.id === 'bulk' ? 'I would like to enquire about a bulk order.' : 'I would like to know a price.'}`));
          await reply(bot(faq.content, { title: faq.title, actions }));
          break;
        }
        default:
          await reply(
            bot('I’m not sure about that one — a person from our team can help. Tap below and your question goes along with it.', {
              actions: [wa('Ask on WhatsApp', `Hello Craft & Weft, ${text}`)],
            })
          );
      }
    },
    [reply, trackOrders]
  );

  const send = (text, faq) => {
    const clean = String(text || '').trim();
    if (!clean || typing) return;
    setMessages((prev) => [...prev, { id: uid(), from: 'user', text: clean }]);
    setInput('');
    answer(clean, faq);
  };

  const reset = () => {
    setMessages([WELCOME]);
    setTyping(false);
  };

  // Clear the mobile tab bar, and the product page's sticky add-to-bag bar.
  const onProduct = pathname.startsWith('/p/');
  const launcherPos = onProduct ? 'bottom-[10.75rem] md:bottom-6' : 'bottom-[5.75rem] md:bottom-6';

  return (
    <>
      <div className={`fixed right-4 z-[75] md:right-6 ${launcherPos}`}>
        <AnimatePresence>
          {nudge && !open && (
            <motion.button
              type="button"
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.95 }}
              transition={{ duration: 0.45, ease: EASE }}
              onClick={() => setOpen(true)}
              className="absolute bottom-[calc(100%+0.75rem)] right-0 w-56 rounded-2xl rounded-br-md bg-paper-50 px-4 py-3 text-left text-sm font-semibold text-ink-800 shadow-lift ring-1 ring-ink-900/5"
            >
              Need a hand? Ask me about orders, delivery or our teas.
            </motion.button>
          )}
        </AnimatePresence>

        <motion.button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close help desk' : 'Open help desk'}
          aria-expanded={open}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1.2, type: 'spring', stiffness: 260, damping: 18 }}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          data-cursor="Help"
          className="relative grid h-14 w-14 place-items-center rounded-full bg-ink-950 text-paper shadow-lift ring-2 ring-lime/60 ring-offset-2 ring-offset-paper"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={open ? 'x' : 'chat'}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              {open ? <FiX size={22} /> : <FiMessageCircle size={22} />}
            </motion.span>
          </AnimatePresence>
          {!open && (
            <span className="absolute right-0.5 top-0.5 flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-70" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-brand-500 ring-2 ring-ink-950" />
            </span>
          )}
        </motion.button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.section
            role="dialog"
            aria-label="Craft & Weft help desk"
            data-lenis-prevent
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.45, ease: EASE }}
            style={{ transformOrigin: 'bottom right' }}
            className={`fixed inset-x-3 z-[90] flex flex-col overflow-hidden rounded-[1.75rem] border border-ink-900/5 bg-paper-50 shadow-lift md:inset-x-auto md:bottom-24 md:right-6 md:h-[min(40rem,calc(100svh-9rem))] md:w-[23.5rem] ${
              onProduct ? 'bottom-[15rem] h-[min(34rem,calc(100svh-16rem))]' : 'bottom-[10rem] h-[min(38rem,calc(100svh-11rem))]'
            }`}
          >
            <header className="relative overflow-hidden bg-ink-950 px-5 pb-4 pt-5 text-paper">
              <div className="pointer-events-none absolute -right-10 -top-16 h-40 w-40 rounded-full bg-leaf/40 blur-3xl" />
              <div className="relative flex items-center gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center whitespace-nowrap rounded-full bg-paper font-display text-[13px] font-semibold tracking-tight text-ink-900 ring-2 ring-lime/70">
                  C<span className="text-accent">&amp;</span>W
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-display text-lg leading-tight">Help desk</p>
                  <p className="flex items-center gap-1.5 text-[11px] font-semibold text-paper/60">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-400" /> Instant answers · people on WhatsApp
                  </p>
                </div>
                <button type="button" onClick={reset} aria-label="Start over" title="Start over" className="grid h-9 w-9 place-items-center rounded-full text-paper/70 hover:bg-paper/10 hover:text-paper">
                  <FiRotateCcw size={15} />
                </button>
                <button type="button" onClick={() => setOpen(false)} aria-label="Close help desk" className="grid h-9 w-9 place-items-center rounded-full text-paper/70 hover:bg-paper/10 hover:text-paper">
                  <FiX size={18} />
                </button>
              </div>
            </header>

            <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto overscroll-contain px-4 py-4" aria-live="polite">
              {messages.map((m) =>
                m.from === 'user' ? (
                  <motion.div key={m.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex justify-end">
                    <p className="max-w-[80%] whitespace-pre-line rounded-2xl rounded-br-md bg-brand-500 px-4 py-2.5 text-sm font-semibold text-brand-on">{m.text}</p>
                  </motion.div>
                ) : (
                  <motion.div key={m.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="max-w-[92%] space-y-2">
                    <div className="rounded-2xl rounded-bl-md bg-white px-4 py-3 text-sm leading-6 text-ink-700 shadow-soft ring-1 ring-ink-900/5">
                      {m.title && <p className="mb-1 font-display text-[15px] text-ink-900">{m.title}</p>}
                      <p className="whitespace-pre-line">{m.text}</p>
                    </div>
                    {m.orders?.length > 0 && (
                      <div className="space-y-2">
                        {m.orders.map((o) => (
                          <OrderCard key={o.id} order={o} onNavigate={() => setOpen(false)} />
                        ))}
                      </div>
                    )}
                    {m.actions?.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {m.actions.map((a) =>
                          a.kind === 'link' ? (
                            <Link
                              key={a.label}
                              to={a.to}
                              onClick={() => setOpen(false)}
                              className="inline-flex items-center gap-1.5 rounded-full border border-ink-900/10 bg-paper px-3.5 py-2 text-xs font-extrabold text-ink-900 hover:border-ink-900"
                            >
                              {a.label} <FiArrowUpRight size={12} />
                            </Link>
                          ) : (
                            <a
                              key={a.label}
                              href={a.href}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 rounded-full bg-[#25D366] px-3.5 py-2 text-xs font-extrabold text-white hover:brightness-95"
                            >
                              {a.whatsapp && <FaWhatsapp size={13} />} {a.label}
                            </a>
                          )
                        )}
                      </div>
                    )}
                  </motion.div>
                )
              )}
              {typing && (
                <div className="inline-flex items-center gap-1 rounded-2xl rounded-bl-md bg-white px-4 py-3.5 shadow-soft ring-1 ring-ink-900/5" aria-label="Typing">
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      className="h-1.5 w-1.5 rounded-full bg-ink-400"
                      animate={{ y: [0, -4, 0], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="border-t border-ink-900/5 bg-paper-100/70">
              <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 pt-3">
                {QUICK.map((q) => (
                  <button
                    key={q.label}
                    type="button"
                    disabled={typing}
                    onClick={() => (q.faq ? send(q.label, q.faq) : send(q.text))}
                    className="shrink-0 rounded-full border border-lime/50 bg-paper-50 px-3 py-1.5 text-[11px] font-extrabold text-ink-800 transition-colors hover:bg-lime-light/40 disabled:opacity-50"
                  >
                    {q.label}
                  </button>
                ))}
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  send(input);
                }}
                className="flex items-center gap-2 p-3"
              >
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your question…"
                  maxLength={300}
                  className="input flex-1 rounded-full py-3"
                  aria-label="Your question"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || typing}
                  aria-label="Send"
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-ink-950 text-paper transition-transform hover:scale-105 disabled:opacity-40"
                >
                  <FiSend size={16} />
                </button>
              </form>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </>
  );
}
