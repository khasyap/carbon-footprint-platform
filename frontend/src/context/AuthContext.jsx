'use client';

import React, { createContext, useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import * as authService from '../services/auth';
import { GoogleOAuthProvider } from '@react-oauth/google';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Load user profile on mount if token exists
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await authService.getProfile();
          if (res.success) {
            setUser(res.data);
          } else {
            logout();
          }
        } catch (error) {
          console.error('Failed to restore session:', error.message);
          logout();
        }
      }
      setLoading(false);
    };

    fetchProfile();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await authService.login(email, password);
      if (res.success) {
        localStorage.setItem('token', res.data.token);
        setUser({
          _id: res.data._id,
          name: res.data.name,
          email: res.data.email,
          role: res.data.role,
          greenPoints: res.data.greenPoints,
          badges: res.data.badges
        });
        router.push('/dashboard');
        return { success: true };
      }
      return { success: false, message: res.message || 'Login failed' };
    } catch (error) {
      const msg = error.response?.data?.message || 'Login error occurred';
      return { success: false, message: msg };
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await authService.register(name, email, password);
      if (res.success) {
        localStorage.setItem('token', res.data.token);
        setUser({
          _id: res.data._id,
          name: res.data.name,
          email: res.data.email,
          role: res.data.role,
          greenPoints: res.data.greenPoints,
          badges: res.data.badges
        });
        router.push('/dashboard');
        return { success: true };
      }
      return { success: false, message: res.message || 'Registration failed' };
    } catch (error) {
      const msg = error.response?.data?.message || 'Registration error occurred';
      return { success: false, message: msg };
    }
  };

  const loginWithGoogle = async (token, name, email) => {
    try {
      const res = await authService.loginWithGoogle(token, name, email);
      if (res.success) {
        localStorage.setItem('token', res.data.token);
        setUser({
          _id: res.data._id,
          name: res.data.name,
          email: res.data.email,
          role: res.data.role,
          greenPoints: res.data.greenPoints,
          badges: res.data.badges
        });
        router.push('/dashboard');
        return { success: true };
      }
      return { success: false, message: res.message || 'Google Login failed' };
    } catch (error) {
      const msg = error.response?.data?.message || 'Google Login error occurred';
      return { success: false, message: msg };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/login');
  };

  const refreshProfile = async () => {
    try {
      const res = await authService.getProfile();
      if (res.success) {
        setUser(res.data);
      }
    } catch (error) {
      console.error('Profile refresh failed:', error.message);
    }
  };

  const googleClientId = typeof window !== 'undefined' ? (process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '') : '';

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <AuthContext.Provider value={{ user, loading, login, register, loginWithGoogle, logout, refreshProfile }}>
        {children}
      </AuthContext.Provider>
    </GoogleOAuthProvider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
