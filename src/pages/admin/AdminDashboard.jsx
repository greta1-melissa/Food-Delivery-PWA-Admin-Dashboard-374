import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { useAdmin } from '../../context/AdminContext';
import { useApp } from '../../context/AppContext';
import AdminLayout from '../../components/admin/AdminLayout';

const { FiShoppingBag, FiDollarSign, FiUsers, FiTrendingUp, FiClock, FiCheckCircle } = FiIcons;

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { adminUser } = useAdmin();
  const { state } = useApp();

  useEffect(() => {
    if (!adminUser) {
      navigate('/admin/login');
    }
  }, [adminUser, navigate]);

  if (!adminUser) {
    return null;
  }

  const { orders } = state;
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  
  const todayOrders = orders.filter(order => {
    const orderDate = new Date(order.orderDate);
    const today = new Date();
    return orderDate.toDateString() === today.toDateString();
  }).length;
  
  const completedOrders = orders.filter(order => order.status === 'delivered').length;

  const stats = [
    {
      title: 'Total Orders',
      value: totalOrders,
      icon: FiShoppingBag,
      color: 'bg-blue-500',
      change: '+12%'
    },
    {
      title: 'Revenue',
      value: `₱${totalRevenue.toFixed(2)}`,
      icon: FiDollarSign,
      color: 'bg-green-500',
      change: '+8%'
    },
    {
      title: 'Today\'s Orders',
      value: todayOrders,
      icon: FiClock,
      color: 'bg-orange-500',
      change: '+23%'
    },
    {
      title: 'Completed',
      value: completedOrders,
      icon: FiCheckCircle,
      color: 'bg-purple-500',
      change: '+15%'
    }
  ];

  const recentOrders = orders.slice(-5).reverse();

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-lg p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">Welcome back, Admin!</h1>
          <p className="opacity-90">Here's what's happening with The Hungry Drop today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <SafeIcon icon={stat.icon} className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center space-x-1 text-green-600">
                  <SafeIcon icon={FiTrendingUp} className="w-4 h-4" />
                  <span className="text-sm font-medium">{stat.change}</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
              <p className="text-gray-600">{stat.title}</p>
            </motion.div>
          ))}
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Orders</h2>
          {recentOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Order ID</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Customer</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Items</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Total</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">#{order.id}</td>
                      <td className="py-3 px-4">{order.customerInfo.name}</td>
                      <td className="py-3 px-4">{order.items.length} items</td>
                      <td className="py-3 px-4 font-semibold">₱{order.total.toFixed(2)}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          order.status === 'delivered' 
                            ? 'bg-green-100 text-green-800' 
                            : order.status === 'preparing' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No orders yet. Orders will appear here once customers start placing them.
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;