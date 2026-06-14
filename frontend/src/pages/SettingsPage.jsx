import React, { useState } from 'react';
import { motion } from 'framer-motion';
import useAuthStore from '../context/useAuthStore';
import { userService } from '../services/index';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function SettingsPage() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('security');
  const [isLoading, setIsLoading] = useState(false);
  
  // Password change state
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Delete account state
  const [deleteData, setDeleteData] = useState({
    password: '',
    confirmed: false
  });

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);
    try {
      await userService.changePassword(
        passwordData.oldPassword,
        passwordData.newPassword,
        passwordData.confirmPassword
      );
      toast.success('Password changed successfully!');
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to change password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();

    if (!deleteData.confirmed) {
      toast.error('Please confirm account deletion');
      return;
    }

    setIsLoading(true);
    try {
      await userService.deleteAccount(deleteData.password);
      toast.success('Account deleted successfully');
      await logout();
      navigate('/');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to delete account');
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'security', label: '🔒 Security', icon: '🔒' },
    { id: 'notifications', label: '🔔 Notifications', icon: '🔔' },
    { id: 'privacy', label: '👁️ Privacy', icon: '👁️' },
    { id: 'danger', label: '⚠️ Danger Zone', icon: '⚠️' }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="max-w-5xl mx-auto space-y-8"
    >
      <header>
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Manage your account and preferences</p>
      </header>

      <div className="grid md:grid-cols-4 gap-6">
        {/* Tabs */}
        <div className="md:col-span-1">
          <div className="glass-card p-4 space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full px-4 py-3 rounded-xl text-left font-medium transition-all ${
                  activeTab === tab.id
                    ? 'gradient-primary text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="md:col-span-3">
          {/* Security Tab */}
          {activeTab === 'security' && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card p-8 space-y-8"
            >
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Change Password</h2>
                <form onSubmit={handleChangePassword} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-600 dark:text-gray-400">Current Password</label>
                    <input
                      type="password"
                      value={passwordData.oldPassword}
                      onChange={(e) => setPasswordData({...passwordData, oldPassword: e.target.value})}
                      placeholder="Enter your current password"
                      className="w-full px-4 py-3 rounded-xl glass border-white/20 focus:ring-2 focus:ring-green-600 outline-none transition-all"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-600 dark:text-gray-400">New Password</label>
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                      placeholder="Enter new password"
                      className="w-full px-4 py-3 rounded-xl glass border-white/20 focus:ring-2 focus:ring-green-600 outline-none transition-all"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-600 dark:text-gray-400">Confirm New Password</label>
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                      placeholder="Confirm new password"
                      className="w-full px-4 py-3 rounded-xl glass border-white/20 focus:ring-2 focus:ring-green-600 outline-none transition-all"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 rounded-xl gradient-primary font-bold shadow-xl shadow-green-600/20 disabled:opacity-50 transition-all"
                  >
                    {isLoading ? 'Updating...' : 'Update Password'}
                  </button>
                </form>
              </div>
            </motion.div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card p-8 space-y-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Notification Preferences</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/50 dark:bg-gray-800/50">
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white">🚨 Disease Alerts</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Get notified of detected diseases</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-5 h-5 rounded cursor-pointer" />
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/50 dark:bg-gray-800/50">
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white">🌾 Crop Tips</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Weekly farming tips and recommendations</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-5 h-5 rounded cursor-pointer" />
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/50 dark:bg-gray-800/50">
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white">📧 Email Notifications</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Receive updates via email</p>
                  </div>
                  <input type="checkbox" className="w-5 h-5 rounded cursor-pointer" />
                </div>
              </div>
              <button className="w-full py-3 rounded-xl gradient-primary font-bold shadow-xl shadow-green-600/20">
                Save Preferences
              </button>
            </motion.div>
          )}

          {/* Privacy Tab */}
          {activeTab === 'privacy' && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card p-8 space-y-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Privacy Settings</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/50 dark:bg-gray-800/50">
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white">👥 Profile Visibility</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Make your profile visible to others</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-5 h-5 rounded cursor-pointer" />
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/50 dark:bg-gray-800/50">
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white">🔓 Public Data</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Share your farming data with community</p>
                  </div>
                  <input type="checkbox" className="w-5 h-5 rounded cursor-pointer" />
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/50 dark:bg-gray-800/50">
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white">🎯 Analytics</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Allow us to improve with your usage data</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-5 h-5 rounded cursor-pointer" />
                </div>
              </div>
              <button className="w-full py-3 rounded-xl gradient-primary font-bold shadow-xl shadow-green-600/20">
                Save Privacy Settings
              </button>
            </motion.div>
          )}

          {/* Danger Zone Tab */}
          {activeTab === 'danger' && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card p-8 space-y-6 border-l-4 border-red-500"
            >
              <div>
                <h2 className="text-2xl font-bold text-red-600 mb-2">⚠️ Danger Zone</h2>
                <p className="text-gray-600 dark:text-gray-400">These actions cannot be undone. Please proceed with caution.</p>
              </div>

              <div className="p-6 rounded-xl bg-red-50/50 dark:bg-red-900/10 border border-red-200 dark:border-red-800">
                <h3 className="text-lg font-bold text-red-600 dark:text-red-400 mb-4">Delete Account</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-6">
                  Permanently delete your account and all associated data. This action cannot be reversed.
                </p>
                <form onSubmit={handleDeleteAccount} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-600 dark:text-gray-400">
                      Enter your password to confirm deletion
                    </label>
                    <input
                      type="password"
                      value={deleteData.password}
                      onChange={(e) => setDeleteData({...deleteData, password: e.target.value})}
                      placeholder="Your password"
                      className="w-full px-4 py-3 rounded-xl glass border-white/20 focus:ring-2 focus:ring-red-600 outline-none transition-all"
                      required
                    />
                  </div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={deleteData.confirmed}
                      onChange={(e) => setDeleteData({...deleteData, confirmed: e.target.checked})}
                      className="w-5 h-5 rounded cursor-pointer"
                    />
                    <span className="text-sm font-bold text-gray-600 dark:text-gray-400">
                      I understand this will permanently delete my account
                    </span>
                  </label>
                  <button
                    type="submit"
                    disabled={isLoading || !deleteData.confirmed}
                    className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold shadow-xl shadow-red-600/20 disabled:opacity-50 transition-all"
                  >
                    {isLoading ? 'Deleting...' : 'Delete Account Permanently'}
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
