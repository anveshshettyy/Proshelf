import { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../lib/axios';

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
        console.warn('User fetch failed:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  const login = async (credentials) => {
    try {
      await axiosInstance.post('/api/auth/login', credentials);
      const res = await axiosInstance.get('/api/auth/me');
      setUser(res.data.user);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await axiosInstance.post('/api/auth/logout');
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
