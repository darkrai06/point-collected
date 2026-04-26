import { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      if (localStorage.getItem('token')) {
        try {
          const res = await api.get('/auth/profile');
          setUser(res.data);
        } catch (err) {
          console.error('Initial auth load error', err);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const register = async (formData) => {
    try {
      const res = await api.post('/auth/register', formData);
      localStorage.setItem('token', res.data.token);
      
      // Fetch user profile immediately after registration
      const profileRes = await api.get('/auth/profile');
      setUser(profileRes.data);
      return true;
    } catch (err) {
      console.error(err.response?.data?.msg || 'Registration failed');
      return false;
    }
  };

  const login = async (formData) => {
    try {
      const res = await api.post('/auth/login', formData);
      localStorage.setItem('token', res.data.token);
      
      const profileRes = await api.get('/auth/profile');
      setUser(profileRes.data);
      return true;
    } catch (err) {
      console.error(err.response?.data?.msg || 'Login failed');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };
  
  // Method to manually update user context if stats change
  const refreshUser = async () => {
      try {
          const res = await api.get('/auth/profile');
          setUser(res.data);
      } catch (err) {
          console.error('Failed to refresh user', err);
      }
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};
