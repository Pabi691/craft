import { FAQS } from '../content/faqs';

// Rule-based intent matching for the help-desk bot — no external service.
// Each keyword that appears in the question scores its length, doubled for
// multi-word phrases, so specific phrases ("cash on delivery") beat loose
// single words ("delivery").

const SPECIAL = [
  {
    id: 'track',
    keywords: ['track', 'order status', 'where is my order', 'my order', 'order id', 'order no', 'order number', 'shipment', 'awb', 'not received', 'not delivered', 'dispatched yet', 'status of'],
  },
  {
    id: 'human',
    keywords: ['human', 'person', 'agent', 'talk to', 'speak to', 'call me', 'call back', 'whatsapp', 'representative', 'someone', 'executive', 'support'],
  },
];

const GREETING = /^(hi+|hello+|hey+|hii+|namaste|namaskar|good (morning|afternoon|evening)|yo)\b[\s!.]*$/i;
const THANKS = /^(thanks?|thank you|thx|ty|great|awesome|ok(ay)?|cool|got it|perfect)\b[\s!.]*$/i;

// "#CW12", "CW-12", "order 12", "order id: 12", or a bare number.
const ORDER_ID = /(?:#\s*(?:cw)?|\bcw[\s-]*|\border\s*(?:id|no\.?|number)?\s*[:#-]?\s*)(\d{1,8})\b/i;

export const extractOrderId = (text) => {
  const m = String(text).match(ORDER_ID);
  if (m) return Number(m[1]);
  const bare = String(text).trim().match(/^#?(\d{1,8})$/);
  return bare ? Number(bare[1]) : null;
};

export function matchIntent(raw) {
  const text = ` ${String(raw).toLowerCase().replace(/\s+/g, ' ').trim()} `;
  const plain = text.trim();
  if (!plain) return { id: 'fallback' };
  if (GREETING.test(plain)) return { id: 'greet' };
  if (THANKS.test(plain)) return { id: 'thanks' };

  const orderId = extractOrderId(plain);
  if (orderId && (/order|track|#|cw/.test(plain) || /^#?\d+$/.test(plain))) return { id: 'track', orderId };

  const score = (keywords) => keywords.reduce((sum, k) => (text.includes(k) ? sum + k.trim().length * (k.trim().includes(' ') ? 2 : 1) : sum), 0);
  const candidates = [
    ...SPECIAL.map((s) => ({ id: s.id, score: score(s.keywords) })),
    ...FAQS.map((f) => ({ id: 'faq', faq: f, score: score(f.keywords) })),
  ].sort((a, b) => b.score - a.score);

  const best = candidates[0];
  return best && best.score > 0 ? { id: best.id, faq: best.faq, orderId } : { id: 'fallback' };
}

export const faqById = (id) => FAQS.find((f) => f.id === id);
