import React, { createContext, useContext, useState, useEffect } from 'react';
import supabase from '../lib/supabase';
import bcrypt from 'bcryptjs';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for saved user session
    const savedUser = localStorage.getItem('hungryDropUser');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        if (userData.expiry && new Date().getTime() < userData.expiry) {
          setUser(userData.user);
        } else {
          localStorage.removeItem('hungryDropUser');
        }
      } catch (error) {
        console.error('Error loading user session:', error);
        localStorage.removeItem('hungryDropUser');
      }
    }
    setLoading(false);
  }, []);

  const createAccount = async (customerInfo, password) => {
    try {
      // Hash password
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('users_hd2024')
        .select('*')
        .eq('email', customerInfo.email)
        .single();

      if (existingUser) {
        return { success: false, error: 'Account already exists with this email' };
      }

      // Create new user
      const { data, error } = await supabase
        .from('users_hd2024')
        .insert([{
          email: customerInfo.email,
          password_hash: passwordHash,
          name: customerInfo.name,
          phone: customerInfo.phone,
          address: customerInfo.address,
          city: customerInfo.city,
          zip_code: customerInfo.zipCode
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating account:', error);
        return { success: false, error: 'Failed to create account' };
      }

      // Auto-login the user
      const userData = {
        user: {
          id: data.id,
          email: data.email,
          name: data.name,
          phone: data.phone,
          address: data.address,
          city: data.city,
          zipCode: data.zip_code
        },
        expiry: new Date().getTime() + (7 * 24 * 60 * 60 * 1000) // 7 days
      };

      setUser(userData.user);
      localStorage.setItem('hungryDropUser', JSON.stringify(userData));

      return { success: true, user: userData.user };
    } catch (error) {
      console.error('Account creation error:', error);
      return { success: false, error: 'Failed to create account' };
    }
  };

  const login = async (email, password) => {
    try {
      // Get user from database
      const { data: userData, error } = await supabase
        .from('users_hd2024')
        .select('*')
        .eq('email', email)
        .single();

      if (error || !userData) {
        return { success: false, error: 'Invalid email or password' };
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, userData.password_hash);
      if (!isValidPassword) {
        return { success: false, error: 'Invalid email or password' };
      }

      // Create session
      const sessionData = {
        user: {
          id: userData.id,
          email: userData.email,
          name: userData.name,
          phone: userData.phone,
          address: userData.address,
          city: userData.city,
          zipCode: userData.zip_code
        },
        expiry: new Date().getTime() + (7 * 24 * 60 * 60 * 1000) // 7 days
      };

      setUser(sessionData.user);
      localStorage.setItem('hungryDropUser', JSON.stringify(sessionData));

      return { success: true, user: sessionData.user };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('hungryDropUser');
  };

  const updateProfile = async (profileData) => {
    try {
      if (!user) return { success: false, error: 'Not logged in' };

      const { data, error } = await supabase
        .from('users_hd2024')
        .update({
          name: profileData.name,
          phone: profileData.phone,
          address: profileData.address,
          city: profileData.city,
          zip_code: profileData.zipCode,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating profile:', error);
        return { success: false, error: 'Failed to update profile' };
      }

      // Update local user data
      const updatedUser = {
        ...user,
        name: data.name,
        phone: data.phone,
        address: data.address,
        city: data.city,
        zipCode: data.zip_code
      };

      setUser(updatedUser);
      
      // Update localStorage
      const savedData = JSON.parse(localStorage.getItem('hungryDropUser'));
      if (savedData) {
        savedData.user = updatedUser;
        localStorage.setItem('hungryDropUser', JSON.stringify(savedData));
      }

      return { success: true, user: updatedUser };
    } catch (error) {
      console.error('Profile update error:', error);
      return { success: false, error: 'Failed to update profile' };
    }
  };

  const value = {
    user,
    login,
    logout,
    createAccount,
    updateProfile,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};