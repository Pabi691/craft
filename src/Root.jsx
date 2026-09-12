import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './context/AuthContext';
import { GlobalProvider } from './context/GlobalContext';
import App from './App';

const INACTIVITY_LIMIT = 60 * 60 * 1000; // 1 hour, as in the reference app
const SESSION_KEYS = ['userToken', 'uservarified', 'username', 'useremail', 'role'];

function useInactivityLogout() {
  useEffect(() => {
    const touch = () => localStorage.setItem('lastActivity', String(Date.now()));
    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    events.forEach((e) => window.addEventListener(e, touch, { passive: true }));
    touch();

    const timer = setInterval(() => {
      const last = Number(localStorage.getItem('lastActivity') || 0);
      // Only signed-in customers are timed out — guests just keep browsing.
      if (localStorage.getItem('userToken') && Date.now() - last > INACTIVITY_LIMIT) {
        SESSION_KEYS.forEach((k) => localStorage.removeItem(k));
        sessionStorage.clear();
        localStorage.setItem('loginMessage', 'You were signed out after an hour of inactivity.');
        window.location.href = '/login';
      }
    }, 60000);

    return () => {
      clearInterval(timer);
      events.forEach((e) => window.removeEventListener(e, touch));
    };
  }, []);
}

export default function Root() {
  useInactivityLogout();

  return (
    <HelmetProvider>
      <BrowserRouter>
        <AuthProvider>
          <GlobalProvider>
            <App />
          </GlobalProvider>
        </AuthProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}
