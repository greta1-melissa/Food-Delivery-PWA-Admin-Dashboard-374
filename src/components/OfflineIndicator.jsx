import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiWifiOff } = FiIcons;

const OfflineIndicator = ({ isOnline }) => {
  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-20 left-4 right-4 bg-red-500 text-white p-3 rounded-lg shadow-lg z-50 max-w-sm mx-auto"
        >
          <div className="flex items-center space-x-2">
            <SafeIcon icon={FiWifiOff} className="w-5 h-5" />
            <span className="font-medium">You're offline</span>
          </div>
          <p className="text-sm mt-1 opacity-90">
            Some features may not be available until you reconnect.
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OfflineIndicator;