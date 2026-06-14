import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import useAuthStore from '../context/useAuthStore';

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(formData.email, formData.password);
      toast.success('Welcome back to AGROCORE!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center px-4 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-green-500/10 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[120px] animate-pulse transition-all duration-[5000ms]"></div>

      <div className="w-full max-w-lg relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="glass rounded-[2rem] shadow-2xl p-10 md:p-14 border-white/40"
        >
          {/* Logo */}
          <div className="flex justify-center mb-10">
            <motion.div 
              whileHover={{ rotate: 5, scale: 1.1 }}
              className="w-20 h-20 bg-gradient-to-br from-green-600 to-emerald-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-green-600/30"
            >
              <span className="text-white font-black text-4xl italic">A</span>
            </motion.div>
          </div>

          <div className="text-center space-y-2 mb-10">
            <h1 className="text-4xl font-black tracking-tight text-gray-900 dark:text-white">
              Sign In
            </h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium">
              Access your agricultural intelligence dashboard.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-6 py-4 border border-white/20 rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm text-gray-900 dark:text-white focus:ring-4 focus:ring-green-600/10 focus:border-green-600 transition-all outline-none"
                placeholder="farmer@agrocore.com"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Password
                </label>
                <Link to="/forgot-password" size="sm" className="text-xs font-bold text-green-600 hover:underline">
                  Forgot?
                </Link>
              </div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-6 py-4 border border-white/20 rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm text-gray-900 dark:text-white focus:ring-4 focus:ring-green-600/10 focus:border-green-600 transition-all outline-none"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-5 rounded-2xl gradient-primary font-black text-lg shadow-xl shadow-green-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Authenticating...
                </div>
              ) : 'Access Dashboard'}
            </button>
          </form>

          <div className="mt-12 text-center">
            <p className="text-gray-500 dark:text-gray-400 font-medium">
              New to the platform?{' '}
              <Link to="/register" className="text-green-600 dark:text-green-400 font-black hover:underline underline-offset-4">
                Create Account
              </Link>
            </p>
          </div>
        </motion.div>
        
        <p className="text-center mt-8 text-gray-400 text-xs font-medium uppercase tracking-[0.3em]">
          &copy; 2026 AGROCORE Intelligence Systems
        </p>
      </div>
    </div>
  );
}
