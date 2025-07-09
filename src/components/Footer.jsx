import React from 'react';
import { Link } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import Logo from '../assets/logo';

const { FiPhone, FiMail, FiMapPin, FiClock } = FiIcons;

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <Logo size="small" />
              <span className="text-lg font-bold">The Hungry Drop</span>
            </div>
            <p className="text-gray-400 text-sm">
              Fresh homemade meals delivered to your door. Made with love, served with care.
            </p>
          </div>

          {/* Contact */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <SafeIcon icon={FiPhone} className="w-4 h-4 text-orange-500" />
                <span className="text-sm text-gray-400">+63 912 345 6789</span>
              </div>
              <div className="flex items-center space-x-3">
                <SafeIcon icon={FiMail} className="w-4 h-4 text-orange-500" />
                <span className="text-sm text-gray-400">hello@thehungrydrop.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <SafeIcon icon={FiMapPin} className="w-4 h-4 text-orange-500" />
                <span className="text-sm text-gray-400">123 Food Street, Manila, Philippines</span>
              </div>
            </div>
          </div>

          {/* Hours */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Operating Hours</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <SafeIcon icon={FiClock} className="w-4 h-4 text-orange-500" />
                <span className="text-sm text-gray-400">Mon-Sun: 8:00 AM - 10:00 PM</span>
              </div>
            </div>
          </div>

          {/* Links */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <div className="space-y-2">
              <Link to="/menu" className="block text-sm text-gray-400 hover:text-orange-500 transition-colors">
                Today's Menu
              </Link>
              <Link to="/orders" className="block text-sm text-gray-400 hover:text-orange-500 transition-colors">
                Order History
              </Link>
              <Link to="/admin/login" className="block text-sm text-gray-400 hover:text-orange-500 transition-colors">
                Admin Login
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-sm text-gray-400">
            © 2024 The Hungry Drop. All rights reserved. | Private Platform - Not indexed by search engines
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;