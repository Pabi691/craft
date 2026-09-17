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
        // Cocoa browns built on the SPHOORA brown #603814 (shade 700) for text
        // and dark surfaces; each step keeps the contrast of the old scale.
        ink: {
          50: '#F8F2ED',
          100: '#EFE2D7',
          200: '#E0CAB6',
          300: '#C9A788',
          400: '#B08156',
          500: '#8A613B',
          600: '#6E4725',
          700: '#603814',
          800: '#3E250F',
          900: '#2A1A0B',
          950: '#1A1008',
        },
        paper: {
          DEFAULT: '#F6EFE4',
          50: '#FBF7F1',
          100: '#F6EFE4',
          200: '#EEE3D2',
          300: '#E2D2BA',
        },
        // SPHOORA lime (the logo's steam) — rules, stars, small highlights.
        // light = text on dark grounds, dark = text on light grounds.
        lime: {
          DEFAULT: '#84C243',
          light: '#B6DC8C',
          dark: '#3B7320',
        },
        // SPHOORA leaf greens (the logo's cup).
        leaf: {
          DEFAULT: '#017D3E',
          dark: '#0C592E',
          fresh: '#54B846',
          soft: '#DCEFD9',
        },
      },
      screens: {
        // Laptop-height desktops (1366×768 and the like): tighter hero.
        short: { raw: '(min-width: 1024px) and (max-height: 820px)' },
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
        soft: '0 10px 40px -12px rgb(42 26 11 / 0.18)',
        lift: '0 24px 60px -20px rgb(42 26 11 / 0.30)',
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
