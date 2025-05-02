// File: src/context/AuthProvider.jsx
import { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import axios from '../api/axios';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get('/api/auth/validate-token');
          setUser(response.data.user);
        } catch (error) {
          console.error('Token validation failed:', error);
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      setLoading(false);
    };
    initializeAuth();
  }, []);

  const login = async (email, password) => {
    const response = await axios.post('/api/auth/login', { email, password });
    const { token, ...userData } = response.data;
    localStorage.setItem('token', token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
