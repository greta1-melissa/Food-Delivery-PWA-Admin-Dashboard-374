import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import { AdminProvider } from './context/AdminContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import Login from './pages/Login';
import CustomerDashboard from './pages/CustomerDashboard';
import OrderSuccess from './pages/OrderSuccess';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminMenus from './pages/admin/AdminMenus';
import AdminOrders from './pages/admin/AdminOrders';
import AdminSettings from './pages/admin/AdminSettings';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import OfflineIndicator from './components/OfflineIndicator';
import PushNotificationManager from './components/PushNotificationManager';
import './App.css';

function App() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // PWA Install Prompt
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setShowInstallPrompt(true);
      window.deferredPrompt = e;
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  return (
    <AuthProvider>
      <AdminProvider>
        <AppProvider>
          <Router>
            <div className="app">
              <AnimatePresence mode="wait">
                <Routes>
                  {/* Admin Routes */}
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  <Route path="/admin/menus" element={<AdminMenus />} />
                  <Route path="/admin/orders" element={<AdminOrders />} />
                  <Route path="/admin/settings" element={<AdminSettings />} />
                  
                  {/* Customer Login */}
                  <Route path="/login" element={<Login />} />
                  
                  {/* Customer Dashboard */}
                  <Route path="/dashboard" element={<CustomerDashboard />} />
                  
                  {/* Order Success Page - No Header/Footer */}
                  <Route path="/order-success" element={<OrderSuccess />} />
                  
                  {/* Public Routes */}
                  <Route path="/*" element={
                    <div className="app-layout">
                      <Header />
                      <main className="main-content">
                        <Routes>
                          <Route path="/" element={<Home />} />
                          <Route path="/menu" element={<Menu />} />
                          <Route path="/cart" element={<Cart />} />
                          <Route path="/checkout" element={<Checkout />} />
                          <Route path="/orders" element={<Orders />} />
                          <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                      </main>
                      <Footer />
                    </div>
                  } />
                </Routes>
              </AnimatePresence>

              {/* PWA Components */}
              <PWAInstallPrompt 
                show={showInstallPrompt} 
                onClose={() => setShowInstallPrompt(false)} 
              />
              <OfflineIndicator isOnline={isOnline} />
              <PushNotificationManager />
            </div>
          </Router>
        </AppProvider>
      </AdminProvider>
    </AuthProvider>
  );
}

export default App;