import axios from 'axios';
import { ENV } from '../config/env';

// Logged-in customer token wins; otherwise the storefront's guest token.
export const getToken = () => localStorage.getItem('userToken') || ENV.WEB_TOKEN;
export const isLoggedIn = () => !!localStorage.getItem('userToken');

const api = axios.create({
  baseURL: ENV.API_URL,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const data = error?.response?.data;
    // EnsureCustomerIsActive revokes the token of a deactivated account —
    // drop the session and send the customer to login with the reason.
    if (status === 403 && data?.reason === 'account_inactive') {
      ['userToken', 'uservarified', 'username', 'useremail', 'role', 'localCart'].forEach((k) => localStorage.removeItem(k));
      localStorage.setItem('loginMessage', data.error_message || 'Your account is not active.');
      if (!window.location.pathname.startsWith('/login')) window.location.href = '/login';
    }
    // A customer token that no longer exists server-side (logged out
    // elsewhere / expired) — fall back to browsing as a guest.
    if (status === 401 && isLoggedIn()) {
      localStorage.removeItem('userToken');
    }
    return Promise.reject(error);
  }
);

export default api;
