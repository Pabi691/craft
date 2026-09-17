// Brand content — from the client brief ("Details for website") and
// craftcombine.org. Change copy here, not in components.

export const SITE = {
  name: 'Craft & Weft',
  short: 'C&W',
  parent: 'Craft Combine',
  tagline: 'From Craft to Cup',
  subTagline: 'From Heritage to Everyday Ritual',
  // Default meta description.
  description:
    'Heritage weaves from artisan hands. Honest teas from small gardens in Darjeeling, Dooars, Assam and Kangra.',

  // Home hero — the tea cinemagraph. `map` drives the WebGL motion and is
  // measured from this exact photo (see components/home/teaSceneShader.js);
  // `focusX` is the % of the photo kept in view on narrow screens.
  hero: {
    eyebrow: 'Premium Indian Teas',
    byline: 'Fine teas by Craft & Weft',
    logo: { src: '/brand/sphoora-logo-light.png', alt: 'SPHOORA', width: 218, height: 300 },
    title: 'From Our Gardens | to Your *Cup.*',
    tagline: 'Pure. Authentic. Thoughtfully Crafted.',
    copy: 'Distinctive teas from Darjeeling, Dooars, Assam, Kangra and beyond\u00A0— rooted in provenance, crafted with care.',
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
    'Craft & Weft, an initiative of Craft Combine, has always worked where heritage, creativity, livelihoods and markets meet.',
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
        'Craft & Weft, an initiative of Craft Combine, has always worked where heritage, creativity, livelihoods and markets meet.',
        'Our journey began in the development sector — reviving and reimagining Indian textiles such as Muslin, Silk, Baluchari, Tasar and Khesh, working alongside artisans, government institutions and development partners. From innovative product and design development to research, revival strategies, heritage installations, exhibitions, catalogues and coffee-table books, we worked to create one essential bridge — between the hands that create and the people who value their work.',
      ],
    },
    {
      title: 'New life for textile waste',
      quote: 'To take something authentic and rooted, and make it distinctive, relevant and market-ready.',
      paragraphs: [
        'We also explored new life for textile waste, transforming it into art, artefacts, fashion, accessories and objects of everyday use. Across projects for government, development organizations and corporates, our niche remained constant: to take something authentic and rooted, and make it distinctive, relevant and market-ready.',
      ],
    },
    {
      title: 'From craft to cup',
      statement: 'Today, that journey evolves | from *craft* to *cup.*',
      quote: 'Pure premium teas, select single-origin offerings and signature blends.',
      paragraphs: [
        'Today, that journey evolves from craft to cup.',
        'Through SPHOORA and Kettletales, we bring the same philosophy to fine Indian teas — working close to small tea growers and farming communities and discovering distinctive teas from Darjeeling, Dooars, Assam, Kangra and beyond.',
        'Expect pure premium teas, select single-origin offerings and signature blends — thoughtfully crafted around provenance, taste, aroma and experience.',
      ],
    },
    {
      title: 'Tea as a ritual',
      quote: 'Tea is more than a beverage. It is a ritual — a moment to pause, ground and reconnect.',
      paragraphs: [
        'For us, tea is more than a beverage. It is a ritual — a moment to pause, ground and reconnect. A small alchemy of leaf, aroma, taste and time that brings clarity and calm into an ordinary day.',
        'And this is just the beginning. From tea, we continue to evolve into signature blends, wellness-led infusions and conscious everyday creations — staying true to what has always defined us: craft, creativity, purity, sustainability and people.',
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
      eyebrow: 'Introducing SPHOORA',
      title: 'From artisans to farmers — | and now, *small* *tea* *growers.*',
      kicker: 'We’ve done it before. We’re doing it again.',
      text: 'SPHOORA is our tea from small tea growers, rooted in the same mission that started it all: a bridge between the hands that grow and the people who value their work.',
      journey: [
        { label: 'Artisan livelihoods', text: 'Muslin, Silk, Baluchari, Tasar and Khesh, revived with the hands that weave them.' },
        { label: 'Farmers', text: 'Working close to farming communities, where every harvest begins.' },
        { label: 'Small tea growers', text: 'SPHOORA — tea from small gardens, curated with the same care.', now: true },
      ],
      tagline: ['Grown from the soil.', 'Curated cup by cup.'],
      logo: { src: '/brand/sphoora-logo.png', alt: 'SPHOORA', width: 218, height: 300 },
    },
    title: 'Where real hands | make real *tea.*',
    lead:
      'From the small gardens of the Dooars to the high slopes of Darjeeling or the valleys of Assam or Kangra, we seek out growers whose finest harvests are shaped by hand, season and soil.',
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
    { value: 4, suffix: '', label: 'Tea regions — Darjeeling, Dooars, Assam & Kangra' },
  ],

  crafts: ['Muslin', 'Silk', 'Baluchari', 'Tasar', 'Khesh', 'Darjeeling', 'Dooars', 'Assam', 'Kangra'],

  techniques: [
    { name: 'Muslin', text: 'Bengal’s legendary fine weave — airy, soft and revived with master weavers.' },
    { name: 'Silk & Baluchari', text: 'Lustrous silks and the storytelling pallus of Baluchari, reimagined for today.' },
    { name: 'Tasar', text: 'Wild silk with a soft natural sheen, reeled and woven by hand.' },
    { name: 'Khesh', text: 'Old cotton saris torn into strips and re-woven into bold, colourful fabric.' },
    { name: 'Upcycled textiles', text: 'Textile waste given new life as art, accessories and objects of everyday use.' },
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
    { title: 'Every order hugs a family', text: 'Shop with heart — each order supports a small farmer or an artisan’s family.' },
  ],

  care: 'Please hand wash all our textile products with light detergent. Wash only when necessary, avoid frequent washing. Dry in shade.',

  // SPHOORA teas — shown on the home page and /tea even before the products
  // are priced and switched on in the CRM.
  tea: {
    brand: 'SPHOORA',
    sister: 'Kettletales',
    title: 'Tea is a *ritual*',
    intro:
      'A moment to pause, ground and reconnect. A small alchemy of leaf, aroma, taste and time that brings clarity and calm into an ordinary day.',
    regions: ['Darjeeling', 'Dooars', 'Assam', 'Kangra'],
    packs: ['50 g', '100 g', '200 g'],
    ranges: [
      {
        name: 'Connoisseur’s Choice',
        slug: 'connoisseurs-choice',
        intro: 'Pure premium teas and select single-origin offerings.',
        items: [
          { name: 'Darjeeling 2nd Flush', slug: 'darjeeling-second-flush', origin: 'Darjeeling' },
          { name: 'Darjeeling Long Leaf', slug: 'darjeeling-long-leaf', origin: 'Darjeeling' },
          { name: 'Green Tea', slug: 'green-tea' },
          { name: 'Dooars Broken Leaf', slug: 'dooars-broken-leaf', origin: 'Dooars' },
          { name: 'Oolong', slug: 'oolong-tea' },
        ],
      },
      {
        name: 'Signature Blends',
        slug: 'signature-blends',
        intro: 'Each SPHOORA blend is named for a feeling.',
        items: [
          { name: 'Udaya', slug: 'sphoora-udaya', notes: 'Sunrise, awakening, vigor', origin: 'Darjeeling × Assam', image: 'sphoora-udaya.jpg' },
          { name: 'Aabha', slug: 'sphoora-aabha', notes: 'Glow, radiance, freshness', origin: 'Dooars × Kangra', image: 'sphoora-aabha.jpg' },
          { name: 'Prabha', slug: 'sphoora-prabha', notes: 'First light, brilliance', origin: 'Darjeeling 2nd flush & CTC', image: 'sphoora-prabha.jpg' },
          { name: 'Tejas', slug: 'sphoora-tejas', notes: 'Vitality, energy, fire', origin: 'Strong Assam-forward tea' },
          { name: 'Ira', slug: 'sphoora-ira', notes: 'Graceful, fresh, refined', origin: 'Delicate floral tea' },
          { name: 'Arka', slug: 'sphoora-arka', notes: 'Warmth, radiance, sun', origin: 'Roasted / deeper tea' },
          { name: 'Urja', slug: 'sphoora-urja', notes: 'Wellness infusion' },
          { name: 'Kiran', slug: 'sphoora-kiran', notes: 'Classic premium blend', origin: 'Assam Orthodox' },
        ],
      },
    ],
  },

  contact: {
    address: '54/1, Bipin Ganguly Road, Seth Bagan, Kolkata 700 030',
    addressLines: ['54/1, Bipin Ganguly Road', 'Seth Bagan', 'Kolkata 700 030'],
    phones: ['+91 98306 40086', '+91 90516 26156', '+91 70036 78472'],
    whatsapp: '919051626156',
    email: 'craftcombine.ac@gmail.com',
    emails: ['craftcombine.ac@gmail.com', 'craftcombine@gmail.com'],
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
    impact: 'Every order hugs a small farmer or an artisan’s family.',
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
