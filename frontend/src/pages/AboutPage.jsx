import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function AboutPage() {
  const navigate = useNavigate();
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const cardHoverVariants = {
    hover: {
      y: -10,
      boxShadow: '0 20px 40px rgba(34, 197, 94, 0.2)',
      transition: { duration: 0.3 },
    },
  };

  const features = [
    {
      icon: '🔍',
      title: 'Disease Detection',
      description: 'AI-powered visual analysis with 98% accuracy for early disease identification',
    },
    {
      icon: '🌾',
      title: 'Crop Recommendation',
      description: 'Machine learning-based crop optimization for maximum yield',
    },
    {
      icon: '📊',
      title: 'Real-time Analytics',
      description: 'Interactive dashboards with actionable insights for your farm',
    },
    {
      icon: '🧬',
      title: 'Advanced AI Models',
      description: 'EfficientNetV2 and ensemble methods for superior accuracy',
    },
    {
      icon: '📱',
      title: 'User-Friendly Interface',
      description: 'Simple, intuitive design requires no technical expertise',
    },
    {
      icon: '☁️',
      title: 'Cloud-Based Platform',
      description: 'Access your data securely from anywhere, anytime',
    },
  ];

  const stats = [
    { number: '50K+', label: 'Active Farmers', color: 'from-green-600 to-emerald-600' },
    { number: '1M+', label: 'Crops Analyzed', color: 'from-blue-600 to-cyan-600' },
    { number: '38+', label: 'Disease Types', color: 'from-purple-600 to-pink-600' },
    { number: '98%', label: 'AI Accuracy', color: 'from-orange-600 to-red-600' },
  ];

  const techStack = {
    aiml: ['EfficientNetV2 for Disease Detection', 'Random Forest for Crop Recommendation', 'TensorFlow & PyTorch', 'Real-time Inference Engine'],
    platform: ['React + Vite Frontend', 'Express.js Backend API', 'FastAPI ML Service', 'MongoDB Database'],
  };

  const benefits = [
    { emoji: '✨', title: 'High Accuracy', desc: '98% AI accuracy for disease detection and predictions' },
    { emoji: '⚡', title: 'Instant Results', desc: 'Get predictions in seconds, not hours or days' },
    { emoji: '💰', title: 'Cost Effective', desc: 'Reduce crop losses and increase profitability significantly' },
    { emoji: '👥', title: 'Easy to Use', desc: 'No technical expertise required, simple interface' },
    { emoji: '🔓', title: '24/7 Available', desc: 'Always accessible, whenever you need help' },
    { emoji: '🔒', title: 'Data Secure', desc: 'Enterprise-grade security and data privacy protection' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-gradient-to-r from-green-600 to-emerald-600 text-white py-16 md:py-24"
      >
        <div className="absolute inset-0 opacity-10 bg-white/10" />
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black tracking-tight mb-4"
          >
            About AGROCORE
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl opacity-90 max-w-2xl"
          >
            Revolutionizing Agriculture Through Artificial Intelligence and Machine Learning
          </motion.p>
        </div>
      </motion.div>

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-4 py-16 md:py-24">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-24"
        >
          {/* Mission Section */}
          <motion.section variants={itemVariants} className="prose prose-lg dark:prose-invert max-w-none">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-6">
              Our Mission
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              AGROCORE is dedicated to transforming agriculture by providing farmers with cutting-edge AI technology that enables early disease detection, optimized crop recommendations, and real-time analytics. We believe that technology should be accessible to every farmer, regardless of their technical expertise. Our platform empowers agricultural professionals to make data-driven decisions that increase yields, reduce losses, and ensure sustainable farming practices.
            </p>
          </motion.section>

          {/* Features Grid */}
          <motion.section variants={itemVariants}>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-12">
              Key Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, idx) => (
                <motion.div
                  key={idx}
                  variants={cardHoverVariants}
                  whileHover="hover"
                  className="glass rounded-2xl p-8 border border-white/20 hover:border-green-500/50 transition-colors"
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Statistics */}
          <motion.section variants={itemVariants}>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-12">
              By The Numbers
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, idx) => (
                <motion.div
                  key={idx}
                  variants={cardHoverVariants}
                  whileHover="hover"
                  className={`rounded-2xl p-8 text-white text-center shadow-lg overflow-hidden relative group`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-90 group-hover:opacity-100 transition-opacity`} />
                  <div className="relative z-10">
                    <div className="text-4xl md:text-5xl font-black mb-2">{stat.number}</div>
                    <div className="text-sm md:text-base font-semibold opacity-90">{stat.label}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Technology Stack */}
          <motion.section variants={itemVariants}>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-12">
              Our Technology Stack
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* AI & ML */}
              <motion.div
                variants={cardHoverVariants}
                whileHover="hover"
                className="glass rounded-2xl p-8 border border-white/20 hover:border-blue-500/50 transition-colors"
              >
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <span className="text-2xl">🧠</span> AI & Machine Learning
                </h3>
                <ul className="space-y-3">
                  {techStack.aiml.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                      <span className="text-green-600 font-bold">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Platform */}
              <motion.div
                variants={cardHoverVariants}
                whileHover="hover"
                className="glass rounded-2xl p-8 border border-white/20 hover:border-purple-500/50 transition-colors"
              >
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <span className="text-2xl">⚙️</span> Platform Architecture
                </h3>
                <ul className="space-y-3">
                  {techStack.platform.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                      <span className="text-green-600 font-bold">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </motion.section>

          {/* Benefits */}
          <motion.section variants={itemVariants}>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-12">
              Why Choose AGROCORE?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {benefits.map((benefit, idx) => (
                <motion.div
                  key={idx}
                  variants={cardHoverVariants}
                  whileHover="hover"
                  className="glass rounded-2xl p-8 border border-white/20 hover:border-green-500/50 transition-colors flex items-start gap-4"
                >
                  <div className="text-4xl shrink-0">{benefit.emoji}</div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                      {benefit.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* CTA */}
          <motion.section
            variants={itemVariants}
            className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl p-12 md:p-16 text-white text-center"
          >
            <h2 className="text-3xl md:text-4xl font-black mb-4">Ready to Transform Your Farm?</h2>
            <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
              Join thousands of farmers already using AGROCORE to increase yields and reduce crop losses.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/register')}
              className="inline-block px-8 py-4 bg-white text-green-600 font-bold rounded-xl hover:shadow-2xl transition-shadow cursor-pointer"
            >
              Get Started Today
            </motion.button>
          </motion.section>
        </motion.div>
      </div>
    </div>
  );
}
