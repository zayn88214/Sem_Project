import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../context/useAuthStore';
import { motion, AnimatePresence } from 'framer-motion';

import ThemeToggle from './ThemeToggle';

export default function Navbar({ onMenuClick }) {
  const { user, logout, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="glass relative z-50 w-full border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo and brand */}
          <div className="flex items-center">
            <button
              onClick={onMenuClick}
              className="md:hidden p-2 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-800 transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <Link to="/" className="flex items-center gap-3 ml-4 group">
              <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <span className="text-white font-black text-xl">A</span>
              </div>
              <span className="hidden sm:inline font-black text-2xl tracking-tighter text-gray-900 dark:text-white group-hover:text-green-600 transition-colors">AGROCORE</span>
            </Link>
          </div>

          {/* Right section */}
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="hidden sm:inline px-4 py-2 text-sm font-bold text-gray-700 dark:text-gray-200 hover:text-green-600 hover:bg-green-600/10 rounded-xl transition-all"
            >
              🏠 Home
            </Link>
            <ThemeToggle />
            
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-white/50 dark:hover:bg-gray-800 transition-all border border-transparent hover:border-white/40"
                >
                  {user?.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user?.name}
                      className="w-9 h-9 rounded-lg object-cover shadow-md"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center text-white font-bold shadow-md">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="hidden sm:inline text-sm font-bold text-gray-900 dark:text-white mr-1">{user?.name}</span>
                </button>

                {/* Dropdown menu */}
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-3 w-56 glass rounded-2xl shadow-2xl border border-white/40 z-50 overflow-hidden"
                    >
                      <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Account</p>
                        <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user?.email}</p>
                      </div>
                      <div className="p-2">
                        <Link
                          to="/profile"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-green-600 hover:text-white rounded-xl transition-all"
                        >
                          👤 Profile
                        </Link>
                        <Link
                          to="/settings"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-green-600 hover:text-white rounded-xl transition-all"
                        >
                          ⚙️ Settings
                        </Link>
                        {user?.role === 'admin' && (
                          <Link
                            to="/admin"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-green-600 hover:text-white rounded-xl transition-all"
                          >
                            🛡️ Admin Panel
                          </Link>
                        )}
                      </div>
                      <div className="p-2 border-t border-gray-100 dark:border-gray-700">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                        >
                          🚪 Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-5 py-2.5 text-sm font-bold text-gray-700 dark:text-gray-200 hover:text-green-600 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 text-sm font-bold gradient-primary rounded-xl"
                >
                  Join Us
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

