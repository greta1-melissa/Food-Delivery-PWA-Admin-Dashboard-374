import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import Logo from '../assets/logo';

const { FiDownload, FiX } = FiIcons;

const PWAInstallPrompt = ({ show, onClose }) => {
  const handleInstall = async () => {
    if (window.deferredPrompt) {
      window.deferredPrompt.prompt();
      const { outcome } = await window.deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        console.log('PWA installed');
      }
      window.deferredPrompt = null;
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="fixed bottom-4 left-4 right-4 bg-white rounded-lg shadow-lg p-4 z-50 max-w-sm mx-auto"
        >
          <div className="flex items-start space-x-3">
            <Logo size="large" className="flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">
                Install The Hungry Drop
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                Get the full app experience with offline access and notifications!
              </p>
              <div className="flex space-x-2">
                <button
                  onClick={handleInstall}
                  className="flex items-center space-x-1 bg-orange-500 text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-orange-600 transition-colors"
                >
                  <SafeIcon icon={FiDownload} className="w-4 h-4" />
                  <span>Install</span>
                </button>
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <SafeIcon icon={FiX} className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PWAInstallPrompt;