import { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../../lib/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await axiosInstance.get('/api/auth/me');
        setUser(res.data.user);
      } catch (error) {
        setUser(null);
      }
      setLoading(false);
    }

    fetchUser();
  }, []);

  const login = async (credentials) => {
    await axiosInstance.post('/api/auth/login', credentials);
    const res = await axiosInstance.get('/api/auth/me');
    setUser(res.data.user);
  };

  const logout = async () => {
    await axiosInstance.post('/api/auth/logout');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
