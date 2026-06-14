import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import useAuthStore from '../context/useAuthStore';
import { motion, AnimatePresence } from 'framer-motion';

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const { isAuthenticated, user } = useAuthStore();

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊', protected: true },
    { path: '/disease-detection', label: 'Disease Detection', icon: '🔍', protected: true },
    { path: '/crop-recommendation', label: 'Crop Recommendation', icon: '🌾', protected: true },
    { path: '/history', label: 'History', icon: '📜', protected: true },
    { path: '/about', label: 'About', icon: 'ℹ️', protected: false },
  ];

  const adminItems = user?.role === 'admin' ? [
    { path: '/admin', label: 'Admin Dashboard', icon: '⚙️', protected: true },
    { path: '/admin/users', label: 'Users', icon: '👥', protected: true },
    { path: '/admin/analytics', label: 'Analytics', icon: '📈', protected: true },
  ] : [];

  const isActive = (path) => location.pathname === path;
  const filteredItems = menuItems.filter(item => !item.protected || isAuthenticated);

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={window.innerWidth < 768 ? { x: -280 } : { x: 0 }}
        animate={window.innerWidth < 768 ? { x: isOpen ? 0 : -280 } : { x: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed md:relative left-0 top-0 w-72 h-screen glass border-r border-white/20 z-50 overflow-y-auto shrink-0"
      >
        <div className="p-8">
          <div className="flex items-center gap-3 mb-10">
             <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center text-white font-bold">A</div>
             <h2 className="text-xl font-black tracking-tight text-gray-900 dark:text-white">AGROCORE</h2>
          </div>

          <div className="space-y-8">
            {/* Main menu */}
            <nav className="space-y-1">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] px-4 mb-4">Core Platform</p>
              {filteredItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
                    isActive(item.path)
                      ? 'bg-green-600 text-white shadow-lg shadow-green-600/20 font-bold'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-800 hover:translate-x-1'
                  }`}
                >
                  <span className={`text-xl transition-transform group-hover:scale-125 ${isActive(item.path) ? 'scale-110' : ''}`}>
                    {item.icon}
                  </span>
                  <span className="text-sm">{item.label}</span>
                </Link>
              ))}
            </nav>

            {/* Admin section */}
            {adminItems.length > 0 && (
              <nav className="space-y-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] px-4 mb-4">Administration</p>
                {adminItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
                      isActive(item.path)
                        ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20 font-bold'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-800 hover:translate-x-1'
                    }`}
                  >
                    <span className={`text-xl transition-transform group-hover:scale-125 ${isActive(item.path) ? 'scale-110' : ''}`}>
                      {item.icon}
                    </span>
                    <span className="text-sm">{item.label}</span>
                  </Link>
                ))}
              </nav>
            )}

            {/* Resources section removed */}
          </div>
        </div>
      </motion.aside>
    </>
  );
}
