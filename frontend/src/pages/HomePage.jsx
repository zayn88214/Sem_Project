import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import useAuthStore from '../context/useAuthStore';
import Navbar from '../components/Navbar';

export default function HomePage() {
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="min-h-screen gradient-bg">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-8"
        >
          <div className="inline-block px-4 py-1.5 rounded-full glass border-green-500/20 text-green-600 dark:text-green-400 text-sm font-bold uppercase tracking-widest mb-4">
            AI-Powered Agriculture 2.0
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tight text-gray-900 dark:text-white leading-tight">
            Revolutionize Your <br />
            <span className="gradient-text">Farming Intelligence</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-3xl mx-auto font-medium leading-relaxed">
            Harness the power of neural networks to detect crop diseases instantly and optimize your yields with hyper-local data analysis.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to={isAuthenticated ? '/dashboard' : '/register'} className="gradient-primary text-lg px-10 py-4 rounded-2xl font-bold hover-scale shadow-2xl shadow-green-600/30">
              {isAuthenticated ? 'Enter Dashboard' : 'Get Started for Free'}
            </Link>
            <Link to="/about" className="glass text-lg px-10 py-4 rounded-2xl font-bold hover:bg-white/50 transition-all border border-white/40">
              Learn More
            </Link>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid md:grid-cols-3 gap-8 mt-32"
        >
          {[
            {
              icon: '🔍',
              title: 'Disease Detection',
              description: 'Our EfficientNetV2 models identify 38 different plant diseases with 98% accuracy in seconds.',
              color: 'border-blue-500/20'
            },
            {
              icon: '🌾',
              title: 'Crop Recommendation',
              description: 'Random Forest algorithms analyze soil NPK, pH, and climate to suggest the most profitable crops.',
              color: 'border-green-500/20'
            },
            {
              icon: '📊',
              title: 'Real-time Analytics',
              description: 'Monitor your farm\'s health through interactive charts and historical trend analysis.',
              color: 'border-amber-500/20'
            },
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -10 }}
              className={`glass-card p-10 flex flex-col items-center text-center group ${feature.color}`}
            >
              <div className="text-6xl mb-8 group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white/30 dark:bg-black/20 backdrop-blur-md mt-20 border-y border-white/20">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <p className="text-4xl font-black text-green-600">50K+</p>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mt-2">Active Farmers</p>
          </div>
          <div>
            <p className="text-4xl font-black text-green-600">1M+</p>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mt-2">Crops Analyzed</p>
          </div>
          <div>
            <p className="text-4xl font-black text-green-600">38</p>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mt-2">Disease Types</p>
          </div>
          <div>
            <p className="text-4xl font-black text-green-600">98%</p>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mt-2">AI Accuracy</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-5xl mx-auto px-4 py-32">
        <div className="gradient-primary rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              Ready to modernize <br />your agricultural workflow?
            </h2>
            <p className="text-green-50 text-xl mb-10 max-w-2xl mx-auto">
              Join the data-driven farming revolution today. Start your 14-day free trial.
            </p>
            <Link to={isAuthenticated ? '/dashboard' : '/register'} className="inline-block bg-white text-green-600 font-black px-12 py-5 rounded-2xl hover:scale-105 transition-transform shadow-xl">
              {isAuthenticated ? 'Back to Dashboard' : 'Create Your Account'}
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/20">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6 text-gray-500 dark:text-gray-400 font-medium">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center text-white font-bold">A</div>
             <span className="font-black text-gray-900 dark:text-white">AGROCORE</span>
          </div>
          <p className="text-sm">&copy; 2026 AGROCORE Intelligence Systems. All rights reserved.</p>
          <div className="flex gap-8 text-sm">
            <Link to="/privacy" className="hover:text-green-600">Privacy</Link>
            <Link to="/terms" className="hover:text-green-600">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
