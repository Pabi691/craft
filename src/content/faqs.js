import { SITE } from '../config/site';

// One source for the Contact page FAQ and the help-desk bot. `keywords` are
// what the bot matches free-typed questions against (lower-case, partial
// words are fine: "deliver" matches "delivery" and "delivered").

const phones = SITE.contact.phones.join(' / ');

export const FAQS = [
  {
    id: 'delivery',
    title: 'How long does delivery take?',
    content:
      'Orders are usually dispatched in 2–3 working days and delivered across India within 3–5 days after that. Shipping is free.',
    keywords: ['deliver', 'shipping', 'ship', 'dispatch', 'arrive', 'how many days', 'when will', 'courier', 'pincode', 'pin code'],
  },
  {
    id: 'cod',
    title: 'Do you offer cash on delivery?',
    content:
      'Yes, on most products. A ₹20 collection charge applies to COD orders, and a few items are prepaid-only — the product page always says which.',
    keywords: ['cash', ' cod', 'cash on delivery', 'pay on delivery', 'pay at delivery'],
  },
  {
    id: 'payment',
    title: 'How can I pay?',
    content:
      'Pay online at checkout (UPI, cards, net banking and wallets) or choose cash on delivery. Prices include GST.',
    keywords: ['payment', 'pay ', 'upi', 'card', 'net banking', 'razorpay', 'gst', 'invoice', 'paid'],
  },
  {
    id: 'returns',
    title: 'How do returns work?',
    content:
      'Once an order is delivered, open My Orders and tap Return against it. For a damaged piece please attach a short video so we can sort it out quickly. Refunds go to the bank account you add.',
    keywords: ['return', 'refund', 'exchange', 'replace', 'damaged', 'broken', 'wrong item', 'money back'],
  },
  {
    id: 'cancel',
    title: 'Can I cancel my order?',
    content: 'Yes — within 24 hours of placing it. Open My Orders and tap Cancel. After that, message us and we will do our best.',
    keywords: ['cancel'],
  },
  {
    id: 'care',
    title: 'How should I care for my piece?',
    content: SITE.care,
    keywords: ['wash', 'care', 'clean', ' iron', 'dry', 'detergent', 'fade'],
  },
  {
    id: 'tea-brew',
    title: 'How do I brew SPHOORA tea?',
    content:
      'Black teas and blends: 2–3 g per cup (200 ml), water at 90–95 °C, steep 3–4 minutes. Green tea: 2 g, water at 75–80 °C, 2–3 minutes. Oolong: 3 g, water at 85–90 °C, 3–5 minutes. Each pack carries its own brewing guide.',
    keywords: ['brew', 'steep', 'make tea', 'how to make', 'how do i make', 'prepare', 'temperature', 'water', 'cup of', 'milk', 'recipe'],
  },
  {
    id: 'tea-packs',
    title: 'Which pack sizes do the teas come in?',
    content: `SPHOORA teas come in ${SITE.tea.packs.join(', ')} packs. Store them airtight, away from light, moisture and strong aromas.`,
    keywords: ['pack', 'size', '50 g', '100 g', '200 g', 'gram', 'sphoora', ' tea', 'darjeeling', 'assam', 'oolong', 'green tea', 'blend', 'udaya', 'aabha', 'prabha', 'tejas', ' ira', 'arka', 'urja', 'kiran', 'dooars', 'kangra', 'kettletales'],
  },
  {
    id: 'availability',
    title: 'Is my size or colour available?',
    content:
      'Each product page lists the sizes and options ready to ship — anything unavailable is marked sold out. Many pieces are handmade in small runs, so if you need another size or a custom piece, message us and we will check with our makers.',
    keywords: ['available', 'availability', 'in stock', 'stock', 'sold out', 'size chart', ' xl', ' xxl', ' small', ' medium', ' large', 'measurement', 'fit ', 'custom size', 'restock'],
  },
  {
    id: 'price',
    title: 'Why does a product say “Price on request”?',
    content:
      'A few new pieces and teas are listed before their prices are final. Message us on WhatsApp and we will share the price and availability right away.',
    keywords: ['price', 'cost', 'how much', ' rate', 'price on request', 'mrp', 'discount', 'coupon', 'offer'],
  },
  {
    id: 'bulk',
    title: 'Can I order in bulk?',
    content: `Yes — festive hampers, corporate gifting and boutique stock are welcome, in textiles and teas. Call or WhatsApp ${phones} and we will plan it with you.`,
    keywords: ['bulk', 'corporate', 'gift', 'hamper', 'wholesale', 'reseller', 'boutique', 'quantity', 'custom', 'collaborat'],
  },
  {
    id: 'handmade',
    title: 'Why does my piece look slightly different?',
    content:
      'Everything is handwoven and hand-finished, so slight variations in weave, shade and size are natural — they are the signature of a handmade product.',
    keywords: ['different', 'colour', 'color', 'shade', 'variation', 'not same', 'photo'],
  },
  {
    id: 'about',
    title: 'Who is Craft & Weft?',
    content: `${SITE.about[0]} ${SITE.promise}`,
    keywords: ['who are', 'about', 'craft combine', 'story', 'company', 'society', 'artisan', 'kolkata'],
  },
  {
    id: 'contact',
    title: 'How do I reach you?',
    content: `Call ${phones}, email ${SITE.contact.emails.join(' or ')}, or visit us at ${SITE.contact.address}.`,
    keywords: ['contact', 'phone', 'call', 'email', 'address', 'visit', 'store', 'shop location', 'number', 'reach'],
  },
];

// Shown on the Contact page, in this order.
export const CONTACT_FAQ_IDS = ['delivery', 'cod', 'returns', 'care', 'tea-brew', 'tea-packs', 'bulk', 'handmade'];
