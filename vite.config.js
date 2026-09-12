import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Port 3000 matches SITE_URL in the backend .env — email verification and
// password-reset links point here.
export default defineConfig({
  plugins: [react()],
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
});
