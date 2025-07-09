import React, { createContext, useContext, useState, useEffect } from 'react';
import supabase from '../lib/supabase';

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [adminUser, setAdminUser] = useState(null);
  const [adminLoading, setAdminLoading] = useState(true);

  useEffect(() => {
    // Check for saved admin session
    const savedAdmin = localStorage.getItem('hungryDropAdmin');
    if (savedAdmin) {
      try {
        const adminData = JSON.parse(savedAdmin);
        if (adminData.expiry && new Date().getTime() < adminData.expiry) {
          setAdminUser(adminData.user);
        } else {
          localStorage.removeItem('hungryDropAdmin');
        }
      } catch (error) {
        console.error('Error loading admin session:', error);
      }
    }
    setAdminLoading(false);
  }, []);

  const adminLogin = async (username, password) => {
    try {
      // For now, use hardcoded credentials while we debug the database
      const validCredentials = {
        'thehungrydrop': 'admin123',
        'admin': 'admin123'
      };

      if (validCredentials[username] && validCredentials[username] === password) {
        const adminData = {
          user: {
            username: username,
            role: 'admin'
          },
          expiry: new Date().getTime() + (24 * 60 * 60 * 1000) // 24 hours
        };
        
        setAdminUser(adminData.user);
        localStorage.setItem('hungryDropAdmin', JSON.stringify(adminData));
        return { success: true };
      }
      
      return { success: false, error: 'Invalid credentials' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed' };
    }
  };

  const adminLogout = () => {
    setAdminUser(null);
    localStorage.removeItem('hungryDropAdmin');
  };

  const changeAdminPassword = async (currentPassword, newPassword) => {
    try {
      if (!adminUser) {
        return { success: false, error: 'Not logged in' };
      }

      // For demo purposes, just check if current password is correct
      if (currentPassword === 'admin123') {
        // In a real app, this would update the database
        return { success: true };
      }
      
      return { success: false, error: 'Current password is incorrect' };
    } catch (error) {
      console.error('Password change error:', error);
      return { success: false, error: 'Failed to change password' };
    }
  };

  const value = {
    adminUser,
    adminLogin,
    adminLogout,
    changeAdminPassword,
    adminLoading
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};