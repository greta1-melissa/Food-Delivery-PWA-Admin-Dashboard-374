import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import Logo from '../../assets/logo';

const { FiHome, FiMenu, FiShoppingBag, FiSettings, FiLogOut } = FiIcons;

const AdminLayout = ({ children }) => {
  const location = useLocation();

  const navItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: FiHome },
    { path: '/admin/menus', label: 'Menus', icon: FiMenu },
    { path: '/admin/orders', label: 'Orders', icon: FiShoppingBag },
    { path: '/admin/settings', label: 'Settings', icon: FiSettings }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <div className="flex items-center space-x-2">
            <Logo />
            <div>
              <h1 className="text-xl font-bold text-gray-900">The Hungry Drop</h1>
              <p className="text-sm text-gray-600">Admin Console</p>
            </div>
          </div>
        </div>

        <nav className="mt-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-6 py-3 text-sm font-medium transition-colors ${
                isActive(item.path)
                  ? 'bg-orange-50 text-orange-600 border-r-2 border-orange-500'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-orange-600'
              }`}
            >
              <SafeIcon icon={item.icon} className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <Link
            to="/"
            className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-600 hover:text-orange-600 transition-colors"
          >
            <SafeIcon icon={FiLogOut} className="w-4 h-4" />
            <span>Back to Site</span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <main className="p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;