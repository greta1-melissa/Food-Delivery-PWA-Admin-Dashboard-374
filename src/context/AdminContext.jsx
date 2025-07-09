import React, { createContext, useContext, useState, useEffect } from 'react';
import bcrypt from 'bcryptjs';

const AdminContext = createContext();

const ADMIN_CREDENTIALS = {
  username: 'thehungrydrop',
  password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' // admin123
};

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
      if (username === ADMIN_CREDENTIALS.username) {
        const isValid = await bcrypt.compare(password, ADMIN_CREDENTIALS.password);
        if (isValid) {
          const adminData = {
            user: { username, role: 'admin' },
            expiry: new Date().getTime() + (24 * 60 * 60 * 1000) // 24 hours
          };
          setAdminUser(adminData.user);
          localStorage.setItem('hungryDropAdmin', JSON.stringify(adminData));
          return { success: true };
        }
      }
      return { success: false, error: 'Invalid credentials' };
    } catch (error) {
      return { success: false, error: 'Login failed' };
    }
  };

  const adminLogout = () => {
    setAdminUser(null);
    localStorage.removeItem('hungryDropAdmin');
  };

  const changeAdminPassword = async (currentPassword, newPassword) => {
    try {
      const isValid = await bcrypt.compare(currentPassword, ADMIN_CREDENTIALS.password);
      if (isValid) {
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        // In a real app, this would update the database
        console.log('New password hash:', hashedNewPassword);
        return { success: true };
      }
      return { success: false, error: 'Current password is incorrect' };
    } catch (error) {
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