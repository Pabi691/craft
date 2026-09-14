import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// Browser-visible variables. VITE_ is Vite's convention, but Vercel's dashboard
// nudges you to drop that prefix — so the bare names are accepted too, instead
// of silently building a site that calls localhost.
const ENV_PREFIXES = ['VITE_', 'API_URL', 'WEB_TOKEN', 'RAZORPAY_KEY'];

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), ENV_PREFIXES);
  const apiUrl = env.VITE_API_URL || env.API_URL || '';

  if (mode === 'production' && process.env.VERCEL && (!apiUrl || /localhost|127\.0\.0\.1/.test(apiUrl))) {
    console.warn(
      '\n[craft] VITE_API_URL (or API_URL) is not set to a public URL — this deployment will call ' +
        'localhost and show no products. Set it in Vercel → Settings → Environment Variables and redeploy.\n'
    );
  }

  return {
    plugins: [react()],
    envPrefix: ENV_PREFIXES,
    // Port 3000 matches SITE_URL in the backend .env — email verification and
    // password-reset links point here.
    server: { port: 3000, open: false },
    preview: { port: 3000 },
    build: {
      outDir: 'dist',
      chunkSizeWarningLimit: 900,
      rollupOptions: {
        output: {
          manualChunks: {
            react: ['react', 'react-dom', 'react-router-dom'],
            motion: ['framer-motion', 'lenis'],
            vendor: ['axios', 'sweetalert2', 'react-toastify'],
          },
        },
      },
    },
  };
});
