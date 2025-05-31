import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await axios.get('/api/me', { withCredentials: true });
        setUser(res.data.user); // depends on your backend response structure
      } catch (error) {
        setUser(null);
      }
      setLoading(false);
    }

    fetchUser();
  }, []);

  const login = (userData) => {
    // you might call your backend login API here
    setUser(userData);
  };

  const logout = async () => {
    await axios.post('/api/logout', {}, { withCredentials: true });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
