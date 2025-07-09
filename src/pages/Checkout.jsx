import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import supabase from '../lib/supabase';

const { FiCreditCard, FiTruck, FiMapPin, FiPhone, FiMail, FiUser, FiCheckCircle, FiLock } = FiIcons;

const Checkout = () => {
  const navigate = useNavigate();
  const { state, addOrder, clearCart } = useApp();
  const { user, createAccount } = useAuth();
  const { cart } = state;
  const [orderType, setOrderType] = useState('delivery');
  const [paymentMethod, setPaymentMethod] = useState('online');
  const [customerInfo, setCustomerInfo] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    zipCode: user?.zipCode || ''
  });
  const [accountPassword, setAccountPassword] = useState('');
  const [createAccountOption, setCreateAccountOption] = useState(!user);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const deliveryFee = orderType === 'delivery' ? 250 : 0;
  const total = subtotal + deliveryFee;

  const handleInputChange = (e) => {
    setCustomerInfo({ ...customerInfo, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Required fields validation
    if (!customerInfo.name.trim()) newErrors.name = 'Name is required';
    if (!customerInfo.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(customerInfo.email)) newErrors.email = 'Email is invalid';
    if (!customerInfo.phone.trim()) newErrors.phone = 'Phone number is required';
    
    // Password validation for new accounts
    if (createAccountOption && !user) {
      if (!accountPassword.trim()) newErrors.accountPassword = 'Password is required for account creation';
      else if (accountPassword.length < 6) newErrors.accountPassword = 'Password must be at least 6 characters';
    }
    
    // Address fields validation for delivery
    if (orderType === 'delivery') {
      if (!customerInfo.address.trim()) newErrors.address = 'Address is required';
      if (!customerInfo.city.trim()) newErrors.city = 'City is required';
      if (!customerInfo.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveOrderToDatabase = async (order, userId = null) => {
    try {
      const { data, error } = await supabase
        .from('orders_hd2024')
        .insert([{
          order_id: order.id.toString(),
          user_id: userId,
          customer_name: order.customerInfo.name,
          customer_email: order.customerInfo.email,
          customer_phone: order.customerInfo.phone,
          order_type: order.orderType,
          payment_method: order.paymentMethod,
          subtotal: order.subtotal,
          delivery_fee: order.deliveryFee,
          total: order.total,
          status: order.status,
          items: order.items,
          address: order.customerInfo.address,
          city: order.customerInfo.city,
          zip_code: order.customerInfo.zipCode,
          created_at: new Date().toISOString()
        }])
        .select();

      if (error) {
        console.error("Error saving order:", error);
        return false;
      }
      
      return true;
    } catch (err) {
      console.error("Exception saving order:", err);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      const firstErrorField = Object.keys(errors)[0];
      if (firstErrorField) {
        document.getElementsByName(firstErrorField)[0]?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }
      return;
    }

    setLoading(true);

    try {
      let currentUser = user;
      
      // Create account if needed
      if (createAccountOption && !user) {
        const accountResult = await createAccount(customerInfo, accountPassword);
        if (!accountResult.success) {
          setErrors({ accountPassword: accountResult.error });
          setLoading(false);
          return;
        }
        currentUser = accountResult.user;
      }

      const order = {
        id: Date.now(),
        items: cart,
        customerInfo,
        orderType,
        paymentMethod,
        subtotal,
        deliveryFee,
        total,
        status: 'confirmed',
        orderDate: new Date().toISOString(),
        estimatedTime: 30,
        userId: currentUser?.id || null
      };

      // Save order to database
      const saveSuccess = await saveOrderToDatabase(order, currentUser?.id);
      
      if (saveSuccess) {
        addOrder(order);
        clearCart();
        setShowSuccess(true);
        
        setTimeout(() => {
          setShowSuccess(false);
          navigate('/dashboard');
        }, 3000);
      } else {
        addOrder(order);
        clearCart();
        setShowSuccess(true);
        alert("Your order was processed but we encountered a synchronization issue. Don't worry, your order is still confirmed!");
        
        setTimeout(() => {
          setShowSuccess(false);
          navigate('/dashboard');
        }, 3000);
      }
    } catch (error) {
      console.error("Order processing error:", error);
      alert("We encountered an issue processing your order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0 && !showSuccess) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            className="fixed inset-x-0 top-20 mx-auto z-50 max-w-md bg-green-100 border border-green-300 text-green-700 px-4 py-3 rounded-lg shadow-lg"
          >
            <div className="flex items-center space-x-3">
              <SafeIcon icon={FiCheckCircle} className="w-6 h-6 text-green-500" />
              <div>
                <h3 className="font-semibold">Order Successful!</h3>
                <p className="text-sm">
                  {createAccountOption && !user ? 
                    'Your account has been created and order placed successfully!' : 
                    'Your order has been placed successfully!'
                  }
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Order Details */}
              <div className="space-y-6">
                {/* Order Type */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Type</h2>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="orderType"
                        value="delivery"
                        checked={orderType === 'delivery'}
                        onChange={(e) => setOrderType(e.target.value)}
                        className="text-orange-500"
                      />
                      <SafeIcon icon={FiTruck} className="w-5 h-5 text-orange-500" />
                      <span>Delivery (+₱250.00)</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="orderType"
                        value="pickup"
                        checked={orderType === 'pickup'}
                        onChange={(e) => setOrderType(e.target.value)}
                        className="text-orange-500"
                      />
                      <SafeIcon icon={FiMapPin} className="w-5 h-5 text-orange-500" />
                      <span>Pickup (Free)</span>
                    </label>
                  </div>
                </div>

                {/* Account Creation Option */}
                {!user && (
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Options</h2>
                    <div className="space-y-3">
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={createAccountOption}
                          onChange={(e) => setCreateAccountOption(e.target.checked)}
                          className="text-orange-500"
                        />
                        <span>Create an account to track your orders</span>
                      </label>
                      {createAccountOption && (
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password for your account *
                          </label>
                          <div className="relative">
                            <SafeIcon icon={FiLock} className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                            <input
                              type="password"
                              name="accountPassword"
                              value={accountPassword}
                              onChange={(e) => setAccountPassword(e.target.value)}
                              className={`w-full pl-10 pr-3 py-2 border ${errors.accountPassword ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                              placeholder="Enter password (min 6 characters)"
                            />
                          </div>
                          {errors.accountPassword && <p className="text-red-500 text-sm mt-1">{errors.accountPassword}</p>}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Customer Information */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Customer Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name *
                      </label>
                      <div className="relative">
                        <SafeIcon icon={FiUser} className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          name="name"
                          value={customerInfo.name}
                          onChange={handleInputChange}
                          required
                          className={`w-full pl-10 pr-3 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                          placeholder="Enter your full name"
                        />
                      </div>
                      {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email *
                      </label>
                      <div className="relative">
                        <SafeIcon icon={FiMail} className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <input
                          type="email"
                          name="email"
                          value={customerInfo.email}
                          onChange={handleInputChange}
                          required
                          className={`w-full pl-10 pr-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                          placeholder="Enter your email"
                        />
                      </div>
                      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone *
                      </label>
                      <div className="relative">
                        <SafeIcon icon={FiPhone} className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <input
                          type="tel"
                          name="phone"
                          value={customerInfo.phone}
                          onChange={handleInputChange}
                          required
                          className={`w-full pl-10 pr-3 py-2 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                          placeholder="Enter your phone number"
                        />
                      </div>
                      {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                    </div>

                    {orderType === 'delivery' && (
                      <>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Address *
                          </label>
                          <input
                            type="text"
                            name="address"
                            value={customerInfo.address}
                            onChange={handleInputChange}
                            required
                            className={`w-full px-3 py-2 border ${errors.address ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                            placeholder="Enter your address"
                          />
                          {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            City *
                          </label>
                          <input
                            type="text"
                            name="city"
                            value={customerInfo.city}
                            onChange={handleInputChange}
                            required
                            className={`w-full px-3 py-2 border ${errors.city ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                            placeholder="Enter your city"
                          />
                          {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            ZIP Code *
                          </label>
                          <input
                            type="text"
                            name="zipCode"
                            value={customerInfo.zipCode}
                            onChange={handleInputChange}
                            required
                            className={`w-full px-3 py-2 border ${errors.zipCode ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                            placeholder="Enter ZIP code"
                          />
                          {errors.zipCode && <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Payment Method */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Method</h2>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="online"
                        checked={paymentMethod === 'online'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="text-orange-500"
                      />
                      <SafeIcon icon={FiCreditCard} className="w-5 h-5 text-orange-500" />
                      <span>Pay Online</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={paymentMethod === 'cod'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="text-orange-500"
                      />
                      <span>💵</span>
                      <span>Cash on Delivery</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="pickup"
                        checked={paymentMethod === 'pickup'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="text-orange-500"
                      />
                      <span>💰</span>
                      <span>Cash on Pickup</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
                  <div className="space-y-4 mb-6">
                    {cart.map((item) => (
                      <div key={item.id} className="flex justify-between items-center">
                        <div>
                          <span className="font-medium">{item.name}</span>
                          <span className="text-gray-500 ml-2">x{item.quantity}</span>
                        </div>
                        <span className="font-semibold">₱{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-semibold">₱{subtotal.toFixed(2)}</span>
                    </div>
                    {deliveryFee > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Delivery Fee</span>
                        <span className="font-semibold">₱{deliveryFee.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="border-t pt-2">
                      <div className="flex justify-between">
                        <span className="text-lg font-semibold text-gray-900">Total</span>
                        <span className="text-lg font-semibold text-orange-500">₱{total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="loading-spinner"></div>
                        <span>Processing...</span>
                      </div>
                    ) : (
                      createAccountOption && !user ? 'Create Account & Place Order' : 'Place Order'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Checkout;