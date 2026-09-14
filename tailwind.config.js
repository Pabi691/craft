/** @type {import('tailwindcss').Config} */

// The brand scale is read from CSS custom properties (space-separated RGB
// triples) that src/lib/theme.js writes at runtime from the CRM's Theme
// Settings — change the colour there and every `bg-brand-*`, `text-brand-*`
// etc. updates live, no rebuild. Defaults (sage leaf) live in src/index.css.
const brandVar = (name) => `rgb(var(--brand-${name}) / <alpha-value>)`;

export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: brandVar('50'),
          100: brandVar('100'),
          200: brandVar('200'),
          300: brandVar('300'),
          400: brandVar('400'),
          500: brandVar('500'),
          600: brandVar('600'),
          700: brandVar('700'),
          800: brandVar('800'),
          900: brandVar('900'),
          950: brandVar('950'),
          DEFAULT: brandVar('500'),
          // Readable text colour on top of brand-500 (auto dark/light).
          on: brandVar('on'),
        },
        accent: {
          DEFAULT: 'rgb(var(--accent) / <alpha-value>)',
          soft: 'rgb(var(--accent-soft) / <alpha-value>)',
        },
        // Rustic neutrals from the client palette: espresso browns for text and
        // dark surfaces, warm linen for grounds.
        ink: {
          50: '#F7F2EC',
          100: '#EDE3D8',
          200: '#DCCBB8',
          300: '#C2A98E',
          400: '#A2856A',
          500: '#7F6450',
          600: '#624B3B',
          700: '#4A382C',
          800: '#36281F',
          900: '#261B14',
          950: '#18110C',
        },
        paper: {
          DEFAULT: '#F6EFE4',
          50: '#FBF7F1',
          100: '#F6EFE4',
          200: '#EEE3D2',
          300: '#E2D2BA',
        },
        // The golden touch — rules, stars, small highlights.
        gold: {
          DEFAULT: '#C69C4B',
          light: '#E7CF94',
          dark: '#9C7630',
        },
        // Violet and leaf green from the Craft Combine logo.
        violet: {
          DEFAULT: '#8F1265',
          soft: '#F1DCEA',
        },
        leaf: '#94BB4F',
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'Cambria', 'Times New Roman', 'serif'],
        sans: ['Manrope', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      fontSize: {
        '10xl': ['10rem', { lineHeight: '0.9' }],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.75rem',
        arch: '999px 999px 1.75rem 1.75rem',
      },
      boxShadow: {
        soft: '0 10px 40px -12px rgb(38 27 20 / 0.18)',
        lift: '0 24px 60px -20px rgb(38 27 20 / 0.30)',
        glow: '0 0 0 6px rgb(var(--brand-500) / 0.18)',
      },
      transitionTimingFunction: {
        silk: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      keyframes: {
        marquee: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
        'spin-slow': { to: { transform: 'rotate(360deg)' } },
        shimmer: { '100%': { transform: 'translateX(100%)' } },
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
      },
      animation: {
        marquee: 'marquee 38s linear infinite',
        'marquee-fast': 'marquee 22s linear infinite',
        'spin-slow': 'spin-slow 18s linear infinite',
        shimmer: 'shimmer 1.6s infinite',
        float: 'float 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
