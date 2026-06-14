import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import useAuthStore from '../context/useAuthStore';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, updateProfile } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(user?.avatar || null);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.state || 'Punjab, India'
  });

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const updateData = {
        name: formData.name,
        phone: formData.phone,
        state: formData.location,
        ...(previewImage !== user?.avatar && { avatar: previewImage })
      };

      await updateProfile(updateData);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="max-w-4xl mx-auto space-y-8"
    >
      <header className="flex items-center justify-between">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">Profile</h1>
        <button 
          onClick={() => setIsEditing(!isEditing)}
          className={`px-6 py-2.5 rounded-xl font-bold transition-all ${
            isEditing ? 'bg-gray-100 text-gray-600' : 'gradient-primary'
          }`}
        >
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </header>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          <div className="glass-card text-center py-10">
            {/* Profile Picture Section */}
            <div className="relative inline-block mb-6">
              {previewImage ? (
                <img 
                  src={previewImage}
                  alt="Profile"
                  className="w-32 h-32 rounded-3xl object-cover shadow-xl ring-4 ring-white dark:ring-gray-800"
                />
              ) : (
                <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center text-white text-5xl font-black shadow-xl ring-4 ring-white dark:ring-gray-800">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
              )}
              
              {isEditing && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 bg-green-600 hover:bg-green-700 text-white rounded-full p-3 shadow-lg transition-all hover:scale-110"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              )}
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{user?.name}</h2>
            <p className="text-sm font-bold text-green-600 dark:text-green-400 uppercase tracking-widest mt-1">
              {user?.role || 'Farmer'}
            </p>
            <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-800 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Joined</span>
                <span className="font-bold text-gray-900 dark:text-white">May 2026</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Total Scans</span>
                <span className="font-bold text-gray-900 dark:text-white">124</span>
              </div>
            </div>
          </div>

          <div className="glass-card p-6 border-l-4 border-amber-500">
             <h3 className="text-sm font-bold text-amber-600 uppercase tracking-wider mb-2">Member Status</h3>
             <p className="text-gray-700 dark:text-gray-300 text-sm">You are currently on the <span className="font-bold">Pro Plan</span>. Your subscription will renew on June 15, 2026.</p>
          </div>
        </div>

        <div className="md:col-span-2">
          <form onSubmit={handleSave} className="glass-card h-full space-y-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white pb-4 border-b border-gray-100 dark:border-gray-800">
              Personal Information
            </h3>
            
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-600 dark:text-gray-400">Full Name</label>
                <input 
                  type="text" 
                  disabled={!isEditing}
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl glass border-white/20 disabled:opacity-60 focus:ring-2 focus:ring-green-600 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-600 dark:text-gray-400">Email Address</label>
                <input 
                  type="email" 
                  disabled={true}
                  value={formData.email}
                  className="w-full px-4 py-3 rounded-xl glass border-white/20 opacity-60 cursor-not-allowed"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-600 dark:text-gray-400">Phone Number</label>
                <input 
                  type="tel" 
                  disabled={!isEditing}
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl glass border-white/20 disabled:opacity-60 focus:ring-2 focus:ring-green-600 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-600 dark:text-gray-400">Farm Location</label>
                <input 
                  type="text" 
                  disabled={!isEditing}
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl glass border-white/20 disabled:opacity-60 focus:ring-2 focus:ring-green-600 outline-none transition-all"
                />
              </div>
            </div>

            {isEditing && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="pt-6 flex gap-4"
              >
                <button 
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-4 rounded-xl gradient-primary font-bold shadow-xl shadow-green-600/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </motion.div>
            )}
          </form>
        </div>
      </div>
    </motion.div>
  );
}
