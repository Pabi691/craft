import { useEffect } from 'react';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import PageLoader from '../../components/ui/PageLoader';

export default function Logout() {
  const { logout } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    const done = () => logout();
    if (token) api.get('/api/v1/webuser/logout').catch(() => {}).finally(done);
    else done();
  }, [logout]);

  return <PageLoader />;
}
