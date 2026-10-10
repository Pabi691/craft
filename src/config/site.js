// Brand content — from the client brief ("Details for website") and
// craftcombine.org. Change copy here, not in components.

export const SITE = {
  name: 'Craft & Weft',
  short: 'C&W',
  parent: 'Craft Combine',
  tagline: 'From Craft to Cup',
  // Written out in script on the intro loader (paths: components/ui/introTagline.js).
  introLine: 'Where Hands, Harvests and Stories meet…',
  subTagline: 'From Heritage to Everyday Ritual',
  // Default meta description.
  description:
    'Heritage weaves from artisan hands. Honest teas from small gardens in the Himalayan Hills, Himalayan Foothills, North Eastern Plains and Himachal Hills.',

  // Home hero — the tea cinemagraph. `map` drives the WebGL motion and is
  // measured from this exact photo (see components/home/teaSceneShader.js);
  // `focusX` is the % of the photo kept in view on narrow screens.
  hero: {
    eyebrow: 'Premium Indian Teas',
    byline: 'SPHOORA teas by Craft & Weft',
    logo: { src: '/brand/sphoora-logo-light.png', alt: 'SPHOORA', width: 504, height: 600 },
    title: 'From the Gardens | to Your *Cup.*',
    tagline: 'Pure. Authentic. Thoughtfully Crafted.',
    copy: 'Distinctive teas from Himalayan Hills, Himalayan Foothills, North Eastern Plains, Himachal Hills and beyond\u00A0— rooted in provenance, crafted with care.',
    primary: { label: 'Explore Our Teas', to: '/tea' },
    secondary: { label: 'Our Tea Collection', to: '/tea#connoisseurs-choice' },
    image: {
      src: '/hero/tea-ritual.webp',
      fallback: '/hero/tea-ritual.jpg',
      width: 1819,
      height: 749,
      alt: 'Amber tea poured from a dark teapot into a handmade ceramic cup, steam rising, loose leaf tea on a wooden table',
      map: '/hero/tea-ritual-map.png',
      focusX: 70,
    },
  },
  url: 'https://www.craftcombine.org',

  // Brand lines, verbatim from the brief.
  promise: 'Made in India. Rooted in people. Crafted differently.',
  pillars: ['Crafted with Wisdom', 'Sourced with Care', 'Made in India'],
  invite: 'Join us. Sip with us. Co-create with us.',

  // "Who we are" — short version for the home page and footer.
  about: [
    'Craft & Weft, an initiative of Craft Combine, always works where heritage, creativity, livelihoods and markets meet.',
    'Our journey began in the development sector — reviving and reimagining Indian textiles such as Muslin, Silk, Baluchari, Tasar and Khesh, working alongside artisans, government institutions and development partners.',
    'Today, that journey evolves from craft to cup. Through SPHOORA and Kettletales, we bring the same philosophy to fine Indian teas.',
  ],

  // Full "Who we are" story for the About page. `statement` is a line shown
  // big on its own before the chapter; `quote` is pulled out beside the text.
  // (*word* = highlighted, | = line break.)
  story: [
    {
      title: 'Where heritage meets markets',
      statement: 'We worked to create one essential bridge — between the hands that *create* and the people who *value* their work.',
      paragraphs: [
        'Craft & Weft, an initiative of Craft Combine, always works where heritage, creativity, livelihoods and markets meet.',
        'Our journey began in the development sector - reviving and reimagining Indian textiles such as Muslin, Silk, Baluchar. Tussar, Kantha and Khesh, working alongside artisans, government institutions and development partners. From innovative product and design development to research, revival strategies, heritage installations, exhibitions, catalogues and coffee-table books. We use textile wastes and extensively work on recycled textile to create various lifestyle products. Developing corporate gifts and décor have also been our expertise. We work to create one essential bridge - between the hands that create and the people who value their work.',
      ],
    },
    {
      title: 'New life for textile waste',
      quote: 'To take something authentic and rooted, and make it distinctive, relevant and market-ready.',
      paragraphs: [
        'We also explore new life for textile waste, transforming it into art, artefacts, fashion, accessories and objects of everyday use. Across projects for government, development organizations and corporates, our niche remained constant: to take something authentic and rooted and make it distinctive, relevant and market-ready.',
      ],
    },
    {
      title: 'From craft to cup',
      statement: 'Today, that journey evolves | from *craft* to *cup.*',
      quote: 'Pure premium teas, select single-origin offerings and signature collections.',
      paragraphs: [
        'Today, that journey evolves from craft to cup.',
        'Through SPHOORA and Kettletales, we bring the same philosophy to fine Indian teas — working close to small tea growers and farming communities and discovering distinctive teas from the Himalayan Hills, Himalayan Foothills, North Eastern Plains, Himachal Hills and beyond.',
        'Expect pure premium teas, select single-origin offerings and signature collections — thoughtfully crafted around provenance, taste, aroma and experience.',
      ],
    },
    {
      title: 'Tea as a ritual',
      quote: 'Tea is more than a beverage. It is a ritual — a moment to pause, ground and reconnect.',
      paragraphs: [
        'For us, tea is more than a beverage. It is a ritual — a moment to pause, ground and reconnect. A small alchemy of leaf, aroma, taste and time that brings clarity and calm into an ordinary day.',
        'And this is just the beginning. From tea, we continue to evolve into signature collections, wellness-led infusions and conscious everyday creations — staying true to what has always defined us: craft, creativity, purity, sustainability and people.',
      ],
    },
    {
      title: 'A human story in every choice',
      quote: 'Every choice you make with us carries a human story.',
      paragraphs: [
        'Every choice you make with us carries a human story — a small grower, farmer, artisan or maker whose work is valued along the way. As we grow, we hope to keep nurturing this connection, creating a more harmonious chain from source to you.',
      ],
    },
  ],
  // SPHOORA brand story — the About page's tea section.
  sphoora: {
    // Home page launch note — "we do it again", from the client.
    launch: {
      eyebrow: 'Introducing SPHOORA Tea',
      title: 'From artisans to farmers — | and now, *small* *tea* *growers.*',
      kicker: 'We’ve done it before. We’re doing it again.',
      text: 'SPHOORA is our tea from small tea growers, rooted in the same mission that started it all: a bridge between the hands that grow and the people who value their work.',
      journey: [
        { label: 'Artisan livelihoods', text: 'Muslin, Silk, Baluchari, Tasar and Khesh, revived with the hands that weave them.' },
        { label: 'Farmers', text: 'Working close to farming communities, where every harvest begins.' },
        { label: 'Small tea growers', text: 'SPHOORA — tea from small gardens, curated with the same care.', now: true },
      ],
      tagline: ['Grown from the soil.', 'Curated cup by cup.'],
      logo: { src: '/brand/sphoora-logo.png', alt: 'SPHOORA', width: 504, height: 600 },
    },
    title: 'Where real hands | make real *tea.*',
    lead:
      'From the small gardens of the Himalayan Foothills to the high Himalayan Hills, or the North Eastern Plains and the Himachal Hills, we seek out growers whose finest harvests are shaped by hand, season and soil.',
    quote: 'From known hands to your cup.',
    statement: 'SPHOORA stays small enough to know where *every* *leaf* comes from — yet exacting enough to belong *anywhere* in the world.',
    points: [
      {
        title: 'Carefully chosen leaves',
        text: 'From growers whose finest harvests are shaped by hand, season and soil.',
      },
      {
        title: 'Honest craft',
        text: 'We keep things simple. No unnecessary shortcuts.',
      },
      {
        title: 'Time to let tea be tea',
        text: 'Each brew is allowed to unfurl naturally — releasing its aroma, character and life.',
      },
    ],
    closing: 'From soil to steep, an unbroken story.',
    signOff: 'That is SPHOORA.',
  },

  closing:
    'Because Craft & Weft isn’t simply about what we make. It is about how we evolve together — nurturing people, honoring provenance and bringing a little more beauty, harmony and meaning into everyday life.',
  values: ['Craft', 'Creativity', 'Purity', 'Sustainability', 'People'],

  mission:
    'To take something authentic and rooted, and make it distinctive, relevant and market-ready — a bridge between the hands that create and the people who value their work.',
  history:
    'Craft Combine, a registered society, has trained over 4,500 artisans across nine districts of West Bengal, along with Orissa and Jharkhand, in partnership with institutes including NIIFT and the Institute of Jute Technology.',

  stats: [
    { value: 4500, suffix: '+', label: 'Artisans trained' },
    { value: 9, suffix: '', label: 'Districts of West Bengal' },
    { value: 5, suffix: '', label: 'Heritage weaves revived' },
    { value: 4, suffix: '', label: 'Tea regions — Himalayan Hills, Foothills, North Eastern Plains & Himachal' },
  ],

  crafts: ['Muslin', 'Silk', 'Baluchari', 'Tasar', 'Khesh', 'Refreshing Flush teas', 'North Eastern Plains - Bramhaputra varieties with aroma, Strength and Colour', 'Bold Terrai', 'Mild Palampur'],

  techniques: [
    { name: 'Muslin', text: 'Bengal’s legendary fine weave — airy, soft and revived with master weavers.' },
    { name: 'Silk & Baluchari', text: 'Lustrous silks and the storytelling pallus of Baluchari, reimagined for today.' },
    { name: 'Tasar', text: 'Wild silk with a soft natural sheen, reeled and woven by hand.' },
    { name: 'Khesh', text: 'Old cotton saris torn into strips and re-woven into bold, colourful fabric.' },
    { name: 'Upcycled textiles', text: 'Textile waste given new life as art, accessories and objects of everyday use.' },
    // The teas belong beside the weaves — the About grid names both.
    { name: 'Himalayan Hills', text: 'High on Himalayan slopes, where thin air and slow growth make a delicate, aromatic cup — our Udaya and Prabha.' },
    { name: 'North Eastern Plains', text: 'Deep valley soils and heavy rain give a full-bodied, malty tea — the strength behind Tejas and Kiran.' },
    { name: 'Himalayan Foothills & Himachal Hills', text: 'Foothill gardens below the Himalaya and the quieter valleys of Himachal — brisk everyday cups and rarer small-garden lots.' },
  ],

  process: [
    { step: '01', title: 'Revive', text: 'Muslin, Silk, Baluchari, Tasar and Khesh — reimagined alongside artisans and development partners.', image: 'training-of-spinning.jpg' },
    { step: '02', title: 'Weave', text: 'Hands at the loom turn heritage techniques into fabric with a story.', image: 'an-artisan.jpg' },
    { step: '03', title: 'Craft', text: 'Designers and makers shape fabric — and textile waste — into things you use every day.', image: 'work-in-progress.jpg' },
    { step: '04', title: 'Sip', text: 'The same care, from craft to cup: fine teas sourced close to small growers.', image: '/product-images/sphoora-prabha.jpg' },
  ],

  whyShop: [
    { title: 'Crafted with wisdom', text: 'Heritage techniques, reimagined with designers and artisans.' },
    { title: 'Sourced with care', text: 'Close to small tea growers, farmers and artisan families.' },
    { title: 'Made in India', text: 'Rooted in people. Crafted differently.' },
    { title: 'Every order hugs a family', text: 'Shop with heart — each order supports a small farmer or an artisan family.' },
  ],

  // Limited-edition saree drop. The poster is the client's own artwork, so the
  // words here stay short; the claims are theirs, from the poster itself.
  // These pieces are not listed as products, hence the WhatsApp enquiry.
  campaign: {
    eyebrow: 'Limited edition',
    title: 'A piece of *heritage.*',
    text:
      'Exquisite handwoven silk sarees carrying a rare and striking Buddha motif — created through tedious human labour, exceptional skill and a lifetime of craftsmanship. The artisan who wove these masterpieces is no more, and this design will never be repeated.',
    note: 'Only 4 left',
    image: '/product-images/heritage.jpeg',
    alt: 'A Piece of Heritage — limited edition handwoven silk sarees with a Buddha motif',
    cta: 'Enquire on WhatsApp',
    enquiry: 'Hello Craft & Weft, I’d like to know more about the limited edition Buddha motif silk sarees.',
    secondary: 'See all sarees',
    to: '/sarees',
  },

  care: 'Please hand wash all our textile products with light detergent. Wash only when necessary, avoid frequent washing. Dry in shade.',

  // SPHOORA teas — shown on the home page and /tea even before the products
  // are priced and switched on in the CRM.
  tea: {
    brand: 'SPHOORA',
    sister: 'Kettletales',
    title: 'Tea is a *ritual*',
    intro:
      'A moment to pause, ground and reconnect. A small alchemy of leaf, aroma, taste and time that brings clarity and calm into an ordinary day.',
    regions: ['Himalayan Hills', 'Himalayan Foothills', 'North Eastern Plains', 'Himachal Hills'],
    scrollwords: ['Refreshing Flush teas', 'North Eastern Plains - Bramhaputra varieties with aroma, Strength and Colour', 'Bold Terrai', 'Mild Palampur'],

    // The client's tea copy, used word for word and in the order written. Do
    // not split a line into a label plus a heading, or change its casing —
    // they asked for this exact text on the page.
    sourcing: [
      'Rooted in the gardens. Curated with care. Priced with honesty.',
      'From the Himalayan Foothills, Himalayan Hills, North Eastern Plains and Himachal Hills, we bring you garden-fresh green and white teas, premium long-leaf orthodox teas and select second-flush black teas — each with the distinctive taste and character of its region.',
      'Working closely with small tea growers and consulting tea experts and connoisseurs, we explore, taste and thoughtfully curate our selection, reaching even remote gardens to discover teas worth sharing.',
      'From the growers’ hands to homes and corporate tables, we bring together traditional craft and fresh ideas, giving recognition to the people behind every leaf.',
      'Premium tea. Distinctive flavour. Honest prices. For every generation and every walk of life.',
      'With a vibrant Gen Z collection and new specialty teas coming soon, we are creating more ways for everyone to discover their favourite cup.',
    ],
    packs: ['50 g', '100 g', '200 g', '250 g'],
    ranges: [
      {
        name: 'Connoisseur’s Choice',
        slug: 'connoisseurs-choice',
        intro: 'Pure premium teas and select single-origin offerings.',
        items: [
          { name: 'Indu', slug: 'sphoora-indu', notes: 'White Tea', origin: 'A whisper of delicate flavour, a moment of quiet elegance.', image: 'indu-white-tea.jpeg' },
          { name: 'Harit', slug: 'sphoora-harit', notes: 'Green Tea', origin: 'Fresh, gentle flavour — a little pause, a greener perspective.', image: 'harit-green-tea.jpeg' },
          { name: 'Premium 2nd Flush', slug: 'sphoora-premium-second-flush', origin: 'Himalayan Hills' },
          { name: 'Premium Long Leaf', slug: 'sphoora-premium-long-leaf', origin: 'Himalayan Hills' },
          { name: 'Green Tea', slug: 'green-tea' },
          { name: 'Premium Broken Leaf', slug: 'dooars-broken-leaf', origin: 'Himalayan Foothills' },
          { name: 'Oolong', slug: 'oolong-tea' },
        ],
      },
      {
        name: 'Signature Collections',
        slug: 'signature-collection',
        intro: 'Each SPHOORA collection is named for a feeling.',
        items: [
          { name: 'Udaya', slug: 'sphoora-udaya', notes: 'Refreshing Flush teas', origin: 'Delicate aroma meets rich depth — a graceful cup to greet the day.', image: 'golden-pack.jpeg' },
          { name: 'Aabha', slug: 'sphoora-aabha', notes: 'Himalayan Signature', origin: 'A little mountain magic in every cup.', image: 'green-pack.jpeg' },
          { name: 'Prabha', slug: 'sphoora-prabha', notes: 'Himalayan Symphony — 20% long leaf', origin: 'A harmonious cup with 20% long leaf, bringing depth to every sip.', image: 'golden-pack.jpeg' },
          { name: 'Tejas', slug: 'sphoora-tejas', notes: 'North Eastern Plains - Bramhaputra varieties with aroma, Strength and Colour', origin: 'Bold Assam character with a lively aroma — made to brighten your everyday chai.', image: 'green-pack.jpeg' },
          { name: 'Ira', slug: 'sphoora-ira', notes: 'Floral Signature', origin: 'Delicate floral tea', image: 'sphoora-ira.jpg' },
          { name: 'Arka', slug: 'sphoora-arka', notes: 'Roasted Karak Selection', origin: 'Full-bodied strength for your comforting cup of kadak chai.', image: 'golden-pack.jpeg' },
          { name: 'Urja', slug: 'sphoora-urja', notes: 'Botanical Signature', origin: 'Energy awakened naturally', image: 'sphoora-urja.jpg' },
          { name: 'Kiran', slug: 'sphoora-kiran', notes: 'North Eastern Plains Leaf Selection', origin: 'Orthodox leaf', image: 'sphoora-kiran.jpg' },
          // { name: 'Udaya', slug: 'sphoora-udaya', notes: 'Sunrise, awakening, vigor', origin: 'Darjeeling × Assam', image: 'sphoora-udaya.jpg' },
          // { name: 'Aabha', slug: 'sphoora-aabha', notes: 'Glow, radiance, freshness', origin: 'Dooars × Kangra', image: 'sphoora-aabha.jpg' },
          // { name: 'Prabha', slug: 'sphoora-prabha', notes: 'First light, brilliance', origin: 'Darjeeling 2nd flush & CTC', image: 'sphoora-prabha.jpg' },
          // { name: 'Tejas', slug: 'sphoora-tejas', notes: 'Vitality, energy, fire', origin: 'Strong Assam-forward tea' },
          // { name: 'Ira', slug: 'sphoora-ira', notes: 'Graceful, fresh, refined', origin: 'Delicate floral tea' },
          // { name: 'Arka', slug: 'sphoora-arka', notes: 'Warmth, radiance, sun', origin: 'Roasted / deeper tea' },
          // { name: 'Urja', slug: 'sphoora-urja', notes: 'Wellness infusion' },
          // { name: 'Kiran', slug: 'sphoora-kiran', notes: 'Classic premium blend', origin: 'Assam Orthodox' },
        ],
      },
    ],
  },

  contact: {
    address: '54/1, Bipin Ganguly Road, Seth Bagan, Kolkata 700 030',
    addressLines: ['54/1, Bipin Ganguly Road', 'Seth Bagan', 'Kolkata 700 030'],
    phones: ['+91 98306 40086', '+91 90516 26156', '+91 70036 78472'],
    whatsapp: '919051626156',
    // "Email us" everywhere on the site writes to the first address.
    email: 'craftnweft@gmail.com',
    // Listed in the client's order; the first is the one every mailto uses.
    emails: ['craftnweft@gmail.com', 'craftweft888@gmail.com', 'craftcombine.ac@gmail.com', 'craftcombine@gmail.com'],
    mapQuery: '54/1 Bipin Ganguly Road, Seth Bagan, Kolkata 700030',
  },

  // Instagram handle is exactly as written in the brief ("carftcombineinsta");
  // correct it here if the real handle differs.
  socials: [
    { label: 'Instagram', key: 'instagram', href: 'https://www.instagram.com/carftcombineinsta/' },
    { label: 'Facebook', key: 'facebook', href: 'https://www.facebook.com/p/Kolkata-Craft-Combine-Society-100070626183002/' },
    { label: 'Blog', key: 'blog', href: 'https://craftcombine.blogspot.com/' },
    { label: 'craftcombine.org', key: 'website', href: 'https://www.craftcombine.org/' },
  ],

  testimonials: [
    { reviewer_name: 'Soumen Das', review_text: 'Craft & Weft, the commercial wing of Kolkata Craft Combine Society, is dedicated to reviving traditional handloom techniques that have been overshadowed by modern industrialization.' },
    { reviewer_name: 'Parna Ghara', review_text: 'Their commitment to fabrics like muslin and khesh weaving is commendable, as is their effort to keep younger generations engaged in the crafts of their forefathers.' },
    { reviewer_name: 'Susmita Roy', review_text: 'For those interested in supporting traditional artisans and acquiring unique, handcrafted products that reflect Bengal’s richness, Craft & Weft is a highly recommended destination.' },
  ],

  // Sent with every order (email + thank-you page), verbatim from the brief.
  orderMessage: {
    greeting: 'Hey there',
    thanks: 'Thank you for choosing us',
    status: 'Your order is set to roll',
    onTheWay: 'Your essentials are on the way to put a big smile on your face.',
    signOff: 'Shop with heart.',
    impact: 'Every order hugs a small farmer or an artisan family.',
  },

  // Order-support WhatsApp message prefix (MyOrders).
  whatsappOrderText: 'Hello Craft & Weft, I need help with my order ID ',
};

export const NAV = [
  { label: 'Home', to: '/' },
  { label: 'Shop', to: '/products', mega: true },
  { label: 'Tea', to: '/tea' },
  { label: 'Our Story', to: '/about-us' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'Contact', to: '/contact-us' },
];

export const whatsappLink = (text = '') =>
  `https://wa.me/${SITE.contact.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ''}`;

export const telLink = (phone) => `tel:${phone.replace(/[^\d+]/g, '')}`;
