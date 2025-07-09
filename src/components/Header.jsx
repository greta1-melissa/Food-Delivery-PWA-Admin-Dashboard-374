import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useApp } from '../context/AppContext';
import Logo from '../assets/logo';

const { FiMenu, FiX, FiShoppingCart, FiUser, FiHome, FiBook, FiTruck } = FiIcons;

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { state } = useApp();
  const location = useLocation();
  const cartItemsCount = state.cart.reduce((total, item) => total + item.quantity, 0);

  const navItems = [
    { path: '/', label: 'Home', icon: FiHome },
    { path: '/menu', label: 'Menu', icon: FiBook },
    { path: '/orders', label: 'Orders', icon: FiTruck }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-lg">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Logo />
            <span className="text-xl font-bold text-gray-800">The Hungry Drop</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? 'bg-orange-100 text-orange-600'
                    : 'text-gray-600 hover:text-orange-600'
                }`}
              >
                <SafeIcon icon={item.icon} className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Cart & User Actions */}
          <div className="flex items-center space-x-4">
            <Link
              to="/cart"
              className="relative p-2 text-gray-600 hover:text-orange-600 transition-colors"
            >
              <SafeIcon icon={FiShoppingCart} className="w-6 h-6" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </Link>
            <button className="p-2 text-gray-600 hover:text-orange-600 transition-colors">
              <SafeIcon icon={FiUser} className="w-6 h-6" />
            </button>
            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-gray-600 hover:text-orange-600 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <SafeIcon icon={isMenuOpen ? FiX : FiMenu} className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <motion.div
          initial={false}
          animate={{ height: isMenuOpen ? 'auto' : 0 }}
          className="md:hidden overflow-hidden"
        >
          <div className="py-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? 'bg-orange-100 text-orange-600'
                    : 'text-gray-600 hover:text-orange-600'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <SafeIcon icon={item.icon} className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </motion.div>
      </nav>
    </header>
  );
};

export default Header;