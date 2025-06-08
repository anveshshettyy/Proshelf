import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await axios.get('/api/auth/me', { withCredentials: true });
        setUser(res.data.user);
      } catch (error) {
        setUser(null);
      }
      setLoading(false);
    }

    fetchUser();
  }, []);

  const login = async (credentials) => {
    await axios.post('/api/login', credentials, { withCredentials: true });
    const res = await axios.get('/api/auth/me', { withCredentials: true });
    setUser(res.data.user);
  };

  const logout = async () => {
    await axios.post('/api/auth/logout', {}, { withCredentials: true });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => useContext(AuthContext);
