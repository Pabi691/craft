import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [userToken, setUserToken] = useState(() => localStorage.getItem('userToken'));
  const navigate = useNavigate();

  useEffect(() => {
    if (userToken) localStorage.setItem('userToken', userToken);
    else localStorage.removeItem('userToken');
  }, [userToken]);

  // Another tab logged in / out — follow it.
  useEffect(() => {
    const onStorage = (e) => e.key === 'userToken' && setUserToken(e.newValue);
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const setToken = useCallback((token) => setUserToken(token || null), []);

  const logout = useCallback(() => {
    setUserToken(null);
    // Same as the reference: wipe the session entirely, then land on login.
    localStorage.clear();
    sessionStorage.clear();
    navigate('/login', { replace: true });
    window.location.reload();
  }, [navigate]);

  return <AuthContext.Provider value={{ userToken, setToken, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
