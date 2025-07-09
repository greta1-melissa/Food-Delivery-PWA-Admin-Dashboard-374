import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { Link } from 'react-router-dom';

const { FiCheckCircle, FiClock, FiArrowRight } = FiIcons;

const OrderSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const order = location.state?.order;

  useEffect(() => {
    if (!order) {
      navigate('/orders');
    }
    
    // Automatically redirect after 5 seconds
    const timer = setTimeout(() => {
      navigate('/orders');
    }, 5000);

    return () => clearTimeout(timer);
  }, [order, navigate]);

  if (!order) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center"
      >
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <SafeIcon icon={FiCheckCircle} className="w-12 h-12 text-green-500" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
        <p className="text-gray-600 mb-6">
          Thank you for your order. We've received your request and are processing it now.
        </p>
        
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Order ID:</span>
            <span className="font-semibold">#{order.id}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Total Amount:</span>
            <span className="font-semibold">₱{order.total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Estimated Time:</span>
            <div className="flex items-center">
              <SafeIcon icon={FiClock} className="w-4 h-4 mr-1 text-orange-500" />
              <span className="font-semibold">{order.estimatedTime} minutes</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          <Link 
            to="/orders" 
            className="block w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
          >
            View Order Status
          </Link>
          
          <Link 
            to="/menu" 
            className="block w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
          >
            <span>Continue Shopping</span>
            <SafeIcon icon={FiArrowRight} className="w-4 h-4" />
          </Link>
        </div>
        
        <p className="text-sm text-gray-500 mt-6">
          You will be redirected to your orders in 5 seconds...
        </p>
      </motion.div>
    </div>
  );
};

export default OrderSuccess;