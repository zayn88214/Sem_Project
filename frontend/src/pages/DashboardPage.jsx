import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { adminService, diseaseService, cropService } from '../services/index';
import useAuthStore from '../context/useAuthStore';

const data = [
  { name: 'Mon', predictions: 4, recommendations: 2 },
  { name: 'Tue', predictions: 7, recommendations: 5 },
  { name: 'Wed', predictions: 5, recommendations: 8 },
  { name: 'Thu', predictions: 9, recommendations: 4 },
  { name: 'Fri', predictions: 12, recommendations: 7 },
  { name: 'Sat', predictions: 8, recommendations: 3 },
  { name: 'Sun', predictions: 15, recommendations: 9 },
];

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];

import { useSocket } from '../context/SocketContext';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const socket = useSocket();
  const [stats, setStats] = useState({
    predictions: 0,
    recommendations: 0,
    accuracy: 95.5,
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [diseaseStats, cropStats, history] = await Promise.all([
          diseaseService.getStatistics(),
          cropService.getStatistics(),
          diseaseService.getPredictionHistory(1, 5)
        ]);
        
        setStats({
          predictions: diseaseStats.totalPredictions || 0,
          recommendations: cropStats.totalRecommendations || 0,
          accuracy: 95.5,
          recentActivity: history.predictions || []
        });
      } catch (error) {
        console.error('Failed to fetch stats', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Socket.io listeners
  useEffect(() => {
    if (!socket) return;

    socket.on('NEW_PREDICTION', (prediction) => {
      setStats(prev => ({
        ...prev,
        predictions: prev.predictions + 1,
        recentActivity: [prediction, ...prev.recentActivity].slice(0, 5)
      }));
    });

    socket.on('NEW_RECOMMENDATION', (recommendation) => {
      setStats(prev => ({
        ...prev,
        recommendations: prev.recommendations + 1
      }));
    });

    return () => {
      socket.off('NEW_PREDICTION');
      socket.off('NEW_RECOMMENDATION');
    };
  }, [socket]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8 animate-in"
    >
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
            Welcome back, <span className="gradient-text">{user?.name || 'Farmer'}</span>!
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Here's what's happening on your farm today.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => navigate('/disease-detection')}
            className="px-4 py-2 rounded-xl gradient-primary font-medium hover:opacity-90 transition-opacity"
          >
            New Prediction
          </button>
        </div>
      </header>
      
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Total Predictions', value: stats.predictions, icon: '🔍', color: 'bg-blue-100 text-blue-600', trend: '+12%' },
          { title: 'Crop Recommendations', value: stats.recommendations, icon: '🌾', color: 'bg-green-100 text-green-600', trend: '+5%' },
          { title: 'System Accuracy', value: `${stats.accuracy}%`, icon: '🎯', color: 'bg-amber-100 text-amber-600', trend: 'Stable' },
          { title: 'Soil Health Index', value: '8.4', icon: '🌱', color: 'bg-emerald-100 text-emerald-600', trend: 'Excellent' },
        ].map((stat, idx) => (
          <motion.div key={idx} variants={item} className="stat-card group">
            <div className="flex justify-between items-start">
              <div className={`icon-box ${stat.color} group-hover:scale-110 transition-transform`}>
                {stat.icon}
              </div>
              <span className="text-xs font-medium text-green-500 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
                {stat.trend}
              </span>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">{stat.title}</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                {loading ? <span className="shimmer inline-block w-16 h-8"></span> : stat.value}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Analytics Chart */}
        <motion.div variants={item} className="lg:col-span-2 glass-card h-[400px]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Activity Overview</h2>
            <select className="bg-transparent border-none text-sm text-gray-500 dark:text-gray-400 focus:ring-0 cursor-pointer">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-full pb-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorPred" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12 }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12 }} 
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.8)', 
                    borderRadius: '12px', 
                    border: 'none', 
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 8px 32px 0 rgba(31,38,135,0.1)'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="predictions" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorPred)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Top Diseases */}
        <motion.div variants={item} className="glass-card">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Top Diseases Detected</h2>
          <div className="space-y-6">
            {[
              { label: 'Tomato Early Blight', count: 12, percentage: 75, color: 'bg-red-500' },
              { label: 'Potato Late Blight', count: 8, percentage: 50, color: 'bg-orange-500' },
              { label: 'Apple Scab', count: 5, percentage: 30, color: 'bg-yellow-500' },
              { label: 'Corn Rust', count: 3, percentage: 20, color: 'bg-blue-500' },
            ].map((item, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-700 dark:text-gray-300">{item.label}</span>
                  <span className="text-gray-500">{item.count} cases</span>
                </div>
                <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${item.percentage}%` }}
                    transition={{ duration: 1, delay: idx * 0.1 }}
                    className={`h-full ${item.color} rounded-full`}
                  />
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-8 py-3 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 text-gray-500 hover:border-green-500 hover:text-green-500 transition-all">
            View All Statistics
          </button>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <motion.div variants={item} className="glass-card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Activity</h2>
            <button className="text-green-600 dark:text-green-400 text-sm font-medium hover:underline">See all</button>
          </div>
          <div className="space-y-6">
            {stats.recentActivity.length > 0 ? (
              stats.recentActivity.map((activity, idx) => (
                <motion.div 
                  key={activity._id || idx} 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex gap-4 items-start group"
                >
                  <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    {activity.disease === 'Healthy' ? '🌿' : '⚠️'}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900 dark:text-white font-semibold">
                      {activity.disease === 'Healthy' ? 'Plant is Healthy' : activity.disease}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-1 font-medium">
                      <span>{new Date(activity.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      <span>•</span>
                      <span className="text-green-600 dark:text-green-400">Confidence: {activity.confidence}%</span>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-10">
                <div className="text-4xl mb-4">📭</div>
                <p className="text-gray-500 dark:text-gray-400">No recent activity to show.</p>
                <button className="mt-4 text-green-600 font-medium">Start a new analysis</button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Soil Insights */}
        <motion.div variants={item} className="glass-card bg-green-900/5 dark:bg-green-500/5 border-green-500/20">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">AI Soil Insights</h2>
          <div className="p-4 rounded-2xl bg-white dark:bg-gray-800 shadow-sm mb-4">
            <div className="flex gap-4">
              <div className="text-2xl">💡</div>
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                Your soil's <span className="font-bold text-green-600">Nitrogen levels</span> are slightly lower than optimal for your upcoming Wheat crop. Consider applying a balanced fertilizer before the next rainfall expected on Wednesday.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30">
              <p className="text-xs text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider">Moisture</p>
              <p className="text-xl font-bold text-blue-900 dark:text-blue-100">Optimal</p>
            </div>
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/30">
              <p className="text-xs text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wider">pH Level</p>
              <p className="text-xl font-bold text-amber-900 dark:text-amber-100">6.8 (Ideal)</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* About AGROCORE Section */}
      <motion.div variants={item} className="space-y-8">
        <div className="glass-card bg-green-900/5 dark:bg-green-500/5 border-green-500/20">
          <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6">About AGROCORE</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-8 font-medium">
            AGROCORE is an advanced agricultural intelligence platform powered by artificial intelligence and machine learning. 
            We help farmers identify crop diseases, optimize crop selection, and make data-driven farming decisions in real-time.
          </p>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: '🔍',
                title: 'Disease Detection',
                description: 'AI-powered visual analysis identifies 38+ plant diseases with 98% accuracy using EfficientNetV2 models'
              },
              {
                icon: '🌾',
                title: 'Crop Recommendation',
                description: 'Machine learning algorithms analyze soil parameters to recommend the most profitable crops for your conditions'
              },
              {
                icon: '📊',
                title: 'Real-time Analytics',
                description: 'Monitor your farm performance with interactive dashboards and detailed historical analytics'
              },
              {
                icon: '🧬',
                title: 'Advanced AI Models',
                description: 'Powered by state-of-the-art deep learning and ensemble methods for maximum accuracy'
              },
              {
                icon: '📱',
                title: 'User-Friendly Interface',
                description: 'Intuitive design makes it easy for farmers to get actionable insights without technical knowledge'
              },
              {
                icon: '☁️',
                title: 'Cloud-Based Platform',
                description: 'Access your farm data anytime, anywhere with our secure cloud infrastructure'
              }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -5 }}
                className="p-6 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-green-500/50 transition-all"
              >
                <div className="text-3xl mb-3">{feature.icon}</div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Platform Statistics */}
        <div className="grid md:grid-cols-4 gap-6">
          {[
            { label: 'Active Farmers', value: '50K+', icon: '👨‍🌾', color: 'bg-blue-100 dark:bg-blue-900/30' },
            { label: 'Crops Analyzed', value: '1M+', icon: '🌱', color: 'bg-green-100 dark:bg-green-900/30' },
            { label: 'Disease Types', value: '38+', icon: '🦠', color: 'bg-red-100 dark:bg-red-900/30' },
            { label: 'AI Accuracy', value: '98%', icon: '🎯', color: 'bg-amber-100 dark:bg-amber-900/30' }
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05 }}
              className={`p-6 rounded-xl ${stat.color} border border-gray-200 dark:border-gray-700 text-center`}
            >
              <div className="text-4xl mb-3 flex justify-center">{stat.icon}</div>
              <p className="text-2xl font-black text-gray-900 dark:text-white mb-1">{stat.value}</p>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Technology Stack */}
        <div className="glass-card">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Technology Stack</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-4">AI & Machine Learning</h4>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li className="flex gap-2"><span className="text-green-600">✓</span> EfficientNetV2 for Disease Detection</li>
                <li className="flex gap-2"><span className="text-green-600">✓</span> Random Forest for Crop Recommendation</li>
                <li className="flex gap-2"><span className="text-green-600">✓</span> TensorFlow & PyTorch</li>
                <li className="flex gap-2"><span className="text-green-600">✓</span> Real-time Inference Engine</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-4">Platform Architecture</h4>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li className="flex gap-2"><span className="text-green-600">✓</span> React + Vite Frontend</li>
                <li className="flex gap-2"><span className="text-green-600">✓</span> Express.js Backend API</li>
                <li className="flex gap-2"><span className="text-green-600">✓</span> FastAPI ML Service</li>
                <li className="flex gap-2"><span className="text-green-600">✓</span> MongoDB Database</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Key Benefits */}
        <div className="glass-card bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-500/20">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Why Choose AGROCORE?</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: 'High Accuracy', description: 'Achieve 98% accuracy in disease detection' },
              { title: 'Instant Results', description: 'Get predictions in seconds, not hours' },
              { title: 'Cost Effective', description: 'Reduce crop losses and increase yields' },
              { title: 'Easy to Use', description: 'No technical expertise required' },
              { title: '24/7 Available', description: 'Access support anytime you need it' },
              { title: 'Data Secure', description: 'Enterprise-grade security for your farm data' }
            ].map((benefit, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="text-2xl">✨</div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">{benefit.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
