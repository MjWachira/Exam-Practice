import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser, loginUser, registerUser, loginGuestUser } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkLoggedInUser();
  }, []);

  const checkLoggedInUser = async () => {
    const token = localStorage.getItem('csm_token');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const res = await getCurrentUser();
      setUser(res.data.user);
    } catch (err) {
      console.error('Session restore failed:', err);
      localStorage.removeItem('csm_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const res = await loginUser({ email, password });
    const { token, user } = res.data;
    localStorage.setItem('csm_token', token);
    setUser(user);
    return user;
  };

  const signup = async (name, email, password) => {
    const res = await registerUser({ name, email, password });
    const { token, user } = res.data;
    localStorage.setItem('csm_token', token);
    setUser(user);
    return user;
  };

  const guestLogin = async (name) => {
    const res = await loginGuestUser({ name });
    const { token, user } = res.data;
    localStorage.setItem('csm_token', token);
    setUser(user);
    return user;
  };

  const logout = () => {
    localStorage.removeItem('csm_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, guestLogin, logout, checkLoggedInUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
