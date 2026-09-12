export const ENV = {
  API_URL: (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, ''),
  WEB_TOKEN: import.meta.env.VITE_WEB_TOKEN || '',
  RAZORPAY_KEY: import.meta.env.VITE_RAZORPAY_KEY || '',
};
