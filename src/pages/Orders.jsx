import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useApp } from '../context/AppContext';
import { format } from 'date-fns';

const { FiClock, FiCheckCircle, FiTruck, FiMapPin, FiPackage } = FiIcons;

const Orders = () => {
  const { state } = useApp();
  const { orders } = state;

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed': return FiCheckCircle;
      case 'preparing': return FiClock;
      case 'ready': return FiPackage;
      case 'delivered': return FiTruck;
      default: return FiClock;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'text-green-500';
      case 'preparing': return 'text-yellow-500';
      case 'ready': return 'text-blue-500';
      case 'delivered': return 'text-green-600';
      default: return 'text-gray-500';
    }
  };

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <SafeIcon icon={FiPackage} className="w-24 h-24 text-gray-400 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No orders yet</h2>
          <p className="text-gray-600 mb-8">When you place an order, it will appear here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Orders</h1>

          <div className="space-y-6">
            {orders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-lg p-6"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                      Order #{order.id}
                    </h2>
                    <p className="text-gray-600">
                      {format(new Date(order.orderDate), 'MMM dd, yyyy - hh:mm a')}
                    </p>
                  </div>
                  <div className="mt-4 md:mt-0 flex items-center space-x-2">
                    <SafeIcon 
                      icon={getStatusIcon(order.status)} 
                      className={`w-5 h-5 ${getStatusColor(order.status)}`} 
                    />
                    <span className={`font-semibold capitalize ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Order Items */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Items Ordered</h3>
                    <div className="space-y-2">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex justify-between items-center">
                          <div>
                            <span className="font-medium">{item.name}</span>
                            <span className="text-gray-500 ml-2">x{item.quantity}</span>
                          </div>
                          <span className="font-semibold">₱{(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Details */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Order Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <SafeIcon 
                          icon={order.orderType === 'delivery' ? FiTruck : FiMapPin} 
                          className="w-4 h-4 text-orange-500" 
                        />
                        <span className="capitalize">{order.orderType}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Payment: </span>
                        <span className="capitalize">{order.paymentMethod}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Customer: </span>
                        <span>{order.customerInfo.name}</span>
                      </div>
                      {order.orderType === 'delivery' && order.customerInfo.address && (
                        <div>
                          <span className="text-gray-600">Address: </span>
                          <span>{order.customerInfo.address}, {order.customerInfo.city}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4 mt-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-gray-600">Total: </span>
                      <span className="text-xl font-bold text-orange-500">₱{order.total.toFixed(2)}</span>
                    </div>
                    {order.status === 'preparing' && (
                      <div className="text-sm text-gray-600">
                        <SafeIcon icon={FiClock} className="inline w-4 h-4 mr-1" />
                        Estimated: {order.estimatedTime} minutes
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;