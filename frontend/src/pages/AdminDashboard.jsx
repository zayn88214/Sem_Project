import React from 'react';
import { motion } from 'framer-motion';

export default function AdminDashboard() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">Admin Dashboard</h1>
      <div className="grid md:grid-cols-3 gap-6">
        {[
          { title: 'Total Users', value: '1,234', icon: '👥' },
          { title: 'Total Predictions', value: '5,678', icon: '🔍' },
          { title: 'System Health', value: '99.9%', icon: '✅' },
        ].map((stat, idx) => (
          <div key={idx} className="glass rounded-xl p-6">
            <div className="text-3xl mb-2">{stat.icon}</div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">{stat.title}</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
