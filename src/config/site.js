// Brand content — taken from craftcombine.org. Change copy here, not in components.

export const SITE = {
  name: 'Craft & Weft',
  short: 'C&W',
  parent: 'Kolkata Craft Combine Society',
  tagline: 'Where Tradition Meets Modernity',
  subTagline: 'Crafted with Care, Inspired by Heritage',
  heroCopy:
    'Explore our exclusive collection of handcrafted garments and accessories, blending heritage techniques with contemporary styles.',
  url: 'https://www.craftcombine.org',

  about: [
    'CRAFT & WEFT, the name which itself defines handmade and hand woven products, is the commercial wing of Kolkata Craft Combine Society.',
    'Working mainly with the handloom sector, KCCS has helped to revive various techniques which had been forgotten due to modern industrialization. It has worked effortlessly to hold back the younger generations to the profession of their forefathers, yet keeping in pace with the taste of the current age.',
    'Blending tradition with modern age trends, Craft and Weft has brought an exclusive range of eco-friendly modern outfits and accessories, crafted with intricate design, bringing out the rich cultural heritage of Bengal.',
  ],
  mission:
    'We promote handcrafted sustainable fashion with eco-friendly Indian textiles like khadi cotton and other natural fibres.',
  history:
    'Craft Combine, a registered society, has trained over 4,500 artisans across nine districts of West Bengal, along with Orissa and Jharkhand, in partnership with institutes including NIIFT and the Institute of Jute Technology.',

  stats: [
    { value: 4500, suffix: '+', label: 'Artisans trained' },
    { value: 9, suffix: '', label: 'Districts of West Bengal' },
    { value: 3, suffix: '', label: 'States — Bengal, Orissa & Jharkhand' },
    { value: 2, suffix: '', label: 'Institute partners — NIIFT & IJT' },
  ],

  crafts: ['Khesh', 'Muslin', 'Tussar', 'Khadi', 'Silk', 'Handloom', 'Natural Dyes', 'Vegetable Dyes'],

  techniques: [
    { name: 'Khadi & Cotton', text: 'Hand-spun, hand-woven and breathable — the everyday fabric of India.' },
    { name: 'Muslin', text: 'Bengal’s legendary fine weave, revived by artisans in Burdwan and Malda.' },
    { name: 'Tussar & Silk', text: 'Wild silk reeled by hand in Birbhum, with a soft natural sheen.' },
    { name: 'Khesh', text: 'Old cotton saris torn into strips and re-woven into bold, colourful fabric.' },
    { name: 'Natural Dyes', text: 'Colours drawn from plants and vegetables, gentle on skin and soil.' },
  ],

  process: [
    { step: '01', title: 'Spin', text: 'Master trainers teach spinning and the reeling of tussar — the first, patient step.', image: 'training-of-spinning.jpg' },
    { step: '02', title: 'Weave', text: 'Preloom preparation, then khesh and muslin woven on traditional looms across Bengal.', image: 'an-artisan.jpg' },
    { step: '03', title: 'Craft', text: 'At our value-addition centre in Dumdum, designers and tailors shape fabric into products.', image: 'work-in-progress.jpg' },
    { step: '04', title: 'Share', text: 'From our outlet at City Centre 2, fairs and now online — linking artisans to you.', image: 'our-selling.jpg' },
  ],

  whyShop: [
    { title: 'Pure natural fabrics', text: 'Pure cotton, tussar, silk and muslin fabrics.' },
    { title: 'Ethnic & indo-western', text: 'Ethnic and indo-western designer wear.' },
    { title: 'Trendy yet affordable', text: 'Contemporary designs at honest, affordable prices.' },
    { title: 'Fast delivery across India', text: 'Carefully packed and shipped across India.' },
  ],

  care: 'Please hand wash all our products with light detergent. Wash only when necessary, avoid frequent washing. Dry in shade.',

  contact: {
    address: '54/1, Bipin Ganguly Road, Kolkata 700030',
    phones: ['+91 90516 26156', '+91 98306 40086'],
    whatsapp: '919051626156',
    email: 'craftcombine.ac@gmail.com',
    mapQuery: '54/1 Bipin Ganguly Road, Kolkata 700030',
  },

  testimonials: [
    { reviewer_name: 'Soumen Das', review_text: 'Craft & Weft, the commercial wing of Kolkata Craft Combine Society, is dedicated to reviving traditional handloom techniques that have been overshadowed by modern industrialization.' },
    { reviewer_name: 'Parna Ghara', review_text: 'Their commitment to fabrics like muslin and khesh weaving is commendable, as is their effort to keep younger generations engaged in the crafts of their forefathers.' },
    { reviewer_name: 'Susmita Roy', review_text: 'For those interested in supporting traditional artisans and acquiring unique, handcrafted products that reflect Bengal’s richness, Craft & Weft is a highly recommended destination.' },
  ],

  // Order-support WhatsApp message prefix (MyOrders).
  whatsappOrderText: 'Hello Craft & Weft, I need help with my order ID ',
};

export const NAV = [
  { label: 'Home', to: '/' },
  { label: 'Shop', to: '/products', mega: true },
  { label: 'Our Story', to: '/about-us' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'Contact', to: '/contact-us' },
];

export const whatsappLink = (text = '') =>
  `https://wa.me/${SITE.contact.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
