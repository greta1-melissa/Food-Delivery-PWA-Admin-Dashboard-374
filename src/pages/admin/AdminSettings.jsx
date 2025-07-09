import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { useAdmin } from '../../context/AdminContext';
import AdminLayout from '../../components/admin/AdminLayout';

const { FiSettings, FiLock, FiDollarSign, FiClock, FiSave, FiEye, FiEyeOff } = FiIcons;

const AdminSettings = () => {
  const navigate = useNavigate();
  const { adminUser, changeAdminPassword, adminLogout } = useAdmin();
  const [activeTab, setActiveTab] = useState('general');
  const [showPasswords, setShowPasswords] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const [generalSettings, setGeneralSettings] = useState({
    siteName: 'The Hungry Drop',
    deliveryFee: 250.00,
    minimumOrder: 750.00,
    operatingHours: {
      open: '08:00',
      close: '22:00'
    },
    contactEmail: 'hello@thehungrydrop.com',
    contactPhone: '+63 912 345 6789',
    address: '123 Food Street, Manila, Philippines'
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  React.useEffect(() => {
    if (!adminUser) {
      navigate('/admin/login');
    }
  }, [adminUser, navigate]);

  if (!adminUser) {
    return null;
  }

  const handleGeneralSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate saving settings
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setMessage('Settings saved successfully!');
    setLoading(false);
    setTimeout(() => setMessage(''), 3000);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage('New passwords do not match!');
      setLoading(false);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage('Password must be at least 6 characters long!');
      setLoading(false);
      return;
    }

    const result = await changeAdminPassword(passwordData.currentPassword, passwordData.newPassword);
    
    if (result.success) {
      setMessage('Password changed successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } else {
      setMessage(result.error);
    }
    
    setLoading(false);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      adminLogout();
      navigate('/admin/login');
    }
  };

  const tabs = [
    { id: 'general', label: 'General Settings', icon: FiSettings },
    { id: 'password', label: 'Change Password', icon: FiLock }
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>

        {message && (
          <div className={`p-4 rounded-lg ${
            message.includes('successfully') 
              ? 'bg-green-50 border border-green-200 text-green-700'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            {message}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <SafeIcon icon={tab.icon} className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'general' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <form onSubmit={handleGeneralSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Site Name
                      </label>
                      <input
                        type="text"
                        value={generalSettings.siteName}
                        onChange={(e) => setGeneralSettings({...generalSettings, siteName: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contact Email
                      </label>
                      <input
                        type="email"
                        value={generalSettings.contactEmail}
                        onChange={(e) => setGeneralSettings({...generalSettings, contactEmail: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contact Phone
                      </label>
                      <input
                        type="tel"
                        value={generalSettings.contactPhone}
                        onChange={(e) => setGeneralSettings({...generalSettings, contactPhone: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Business Address
                      </label>
                      <input
                        type="text"
                        value={generalSettings.address}
                        onChange={(e) => setGeneralSettings({...generalSettings, address: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Delivery Fee (₱)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-3 text-gray-400">₱</span>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={generalSettings.deliveryFee}
                          onChange={(e) => setGeneralSettings({...generalSettings, deliveryFee: parseFloat(e.target.value)})}
                          className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Minimum Order (₱)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-3 text-gray-400">₱</span>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={generalSettings.minimumOrder}
                          onChange={(e) => setGeneralSettings({...generalSettings, minimumOrder: parseFloat(e.target.value)})}
                          className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Opening Time
                      </label>
                      <div className="relative">
                        <SafeIcon icon={FiClock} className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <input
                          type="time"
                          value={generalSettings.operatingHours.open}
                          onChange={(e) => setGeneralSettings({
                            ...generalSettings,
                            operatingHours: {...generalSettings.operatingHours, open: e.target.value}
                          })}
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Closing Time
                      </label>
                      <div className="relative">
                        <SafeIcon icon={FiClock} className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <input
                          type="time"
                          value={generalSettings.operatingHours.close}
                          onChange={(e) => setGeneralSettings({
                            ...generalSettings,
                            operatingHours: {...generalSettings.operatingHours, close: e.target.value}
                          })}
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex items-center space-x-2 bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <div className="loading-spinner"></div>
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <SafeIcon icon={FiSave} className="w-4 h-4" />
                          <span>Save Settings</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {activeTab === 'password' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <form onSubmit={handlePasswordSubmit} className="space-y-6 max-w-md">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Password
                    </label>
                    <div className="relative">
                      <SafeIcon icon={FiLock} className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <input
                        type={showPasswords ? 'text' : 'password'}
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                        required
                        className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Enter current password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords(!showPasswords)}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      >
                        <SafeIcon icon={showPasswords ? FiEyeOff : FiEye} className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <SafeIcon icon={FiLock} className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <input
                        type={showPasswords ? 'text' : 'password'}
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                        required
                        minLength="6"
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Enter new password"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <SafeIcon icon={FiLock} className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <input
                        type={showPasswords ? 'text' : 'password'}
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                        required
                        minLength="6"
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Confirm new password"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex items-center space-x-2 bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <div className="loading-spinner"></div>
                          <span>Changing...</span>
                        </>
                      ) : (
                        <>
                          <SafeIcon icon={FiLock} className="w-4 h-4" />
                          <span>Change Password</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;