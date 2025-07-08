// src/contexts/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
      checkAuthStatus(token);
    } else {
      setLoading(false);
    }
  }, []);

  const checkAuthStatus = async (token) => {
    try {
      // Set the token in the API headers
      api.setAuthToken(token);
      
      // Fetch user data
      const response = await api.get('/auth/me');
      setCurrentUser(response.data);
      setIsAuthenticated(true);
      setLoading(false);
    } catch (error) {
      console.error('Auth check failed:', error);
      logout();
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setError('');
      // SICHERHEITSHINWEIS: Der hartcodierte Passwort-Bypass wurde entfernt.
      const data = new URLSearchParams();
      data.append('username', email);
      data.append('password', password);
      const response = await api.post('/auth/login', data, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
      const access_token = response.access_token || response.token;
      const role = response.role || 'user';
      if (!access_token) throw new Error('No access token in response');
      localStorage.setItem('token', access_token);
      api.setAuthToken(access_token);
      // Nach erfolgreichem Login die Benutzerdaten abrufen, um den Context-Status zu setzen.
      await checkAuthStatus(access_token);
      return true; // Erfolg signalisieren
    } catch (error) {
      console.error('Login failed:', error);
      setError(error.response?.data?.message || 'Login fehlgeschlagen');
      throw error;
    }
  };

  const register = async (name, email, password) => {
    try {
      setError('');
      const response = await api.post('/auth/register', { name, email, password });
      const { token, user } = response.data;
      
      // Store token in localStorage
      localStorage.setItem('token', token);
      
      // Set the token in the API headers
      api.setAuthToken(token);
      
      setCurrentUser(user);
      setIsAuthenticated(true);
      return user;
    } catch (error) {
      console.error('Registration failed:', error);
      setError(error.response?.data?.message || 'Failed to register');
      throw error;
    }
  };

  const logout = () => {
    // Remove token from localStorage
    localStorage.removeItem('token');
    
    // Clear the token from API headers
    api.clearAuthToken();
    
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  const forgotPassword = async (email) => {
    try {
      setError('');
      await api.post('/auth/forgot-password', { email });
      return true;
    } catch (error) {
      console.error('Forgot password request failed:', error);
      setError(error.response?.data?.message || 'Failed to process forgot password request');
      throw error;
    }
  };

  const resetPassword = async (token, password) => {
    try {
      setError('');
      await api.post('/auth/reset-password', { token, password });
      return true;
    } catch (error) {
      console.error('Password reset failed:', error);
      setError(error.response?.data?.message || 'Failed to reset password');
      throw error;
    }
  };

  const updateProfile = async (userData) => {
    try {
      setError('');
      const response = await api.put('/auth/profile', userData);
      setCurrentUser(response.data);
      return response.data;
    } catch (error) {
      console.error('Profile update failed:', error);
      setError(error.response?.data?.message || 'Failed to update profile');
      throw error;
    }
  };

  const value = {
    currentUser,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
