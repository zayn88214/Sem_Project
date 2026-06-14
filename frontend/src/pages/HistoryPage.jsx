import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { diseaseService, cropService } from '../services/index';
import { format } from 'date-fns';

export default function HistoryPage() {
  const [activeTab, setActiveTab] = useState('diseases');
  const [diseases, setDiseases] = useState([]);
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        if (activeTab === 'diseases') {
          const res = await diseaseService.getPredictionHistory();
          setDiseases(res.predictions || []);
        } else {
          const res = await cropService.getRecommendationHistory();
          setCrops(res.recommendations || []);
        }
      } catch (error) {
        console.error('Failed to fetch history', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [activeTab]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="max-w-6xl mx-auto space-y-8 pb-12"
    >
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Analysis <span className="gradient-text">History</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            Review your past crop optimizations and disease detections.
          </p>
        </div>

        <div className="flex p-1.5 glass rounded-2xl w-fit">
          <button 
            onClick={() => setActiveTab('diseases')}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'diseases' ? 'bg-green-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Diseases
          </button>
          <button 
            onClick={() => setActiveTab('crops')}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'crops' ? 'bg-green-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Crops
          </button>
        </div>
      </header>

      <div className="glass-card min-h-[400px]">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-20 flex flex-col items-center"
            >
              <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-500 font-medium">Retrieving history...</p>
            </motion.div>
          ) : (
            <motion.div 
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="overflow-x-auto"
            >
              {activeTab === 'diseases' ? (
                diseases.length > 0 ? (
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100 dark:border-gray-800">
                        <th className="px-6 py-4">Disease</th>
                        <th className="px-6 py-4">Confidence</th>
                        <th className="px-6 py-4">Severity</th>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                      {diseases.map((item) => (
                        <tr key={item._id} className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                          <td className="px-6 py-4">
                            <p className="font-bold text-gray-900 dark:text-white">{item.disease}</p>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-green-600 font-bold">{item.confidence}%</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                              item.severity === 'high' ? 'bg-red-100 text-red-600' : 
                              item.severity === 'medium' ? 'bg-orange-100 text-orange-600' : 
                              'bg-green-100 text-green-600'
                            }`}>
                              {item.severity}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {format(new Date(item.createdAt), 'MMM dd, yyyy')}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button className="text-gray-400 hover:text-green-600 transition-colors">👁️</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <EmptyState type="diseases" />
                )
              ) : (
                crops.length > 0 ? (
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100 dark:border-gray-800">
                        <th className="px-6 py-4">Top Recommendation</th>
                        <th className="px-6 py-4">Confidence</th>
                        <th className="px-6 py-4">Soil pH</th>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                      {crops.map((item) => (
                        <tr key={item._id} className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                          <td className="px-6 py-4">
                            <p className="font-bold text-gray-900 dark:text-white">{item.topRecommendation}</p>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-green-600 font-bold">{item.topConfidence}%</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-gray-600 dark:text-gray-400 font-medium">{item.soilData?.pH}</span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {format(new Date(item.createdAt), 'MMM dd, yyyy')}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button className="text-gray-400 hover:text-green-600 transition-colors">👁️</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <EmptyState type="crops" />
                )
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function EmptyState({ type }) {
  return (
    <div className="py-20 flex flex-col items-center justify-center opacity-50">
      <div className="text-6xl mb-6">{type === 'diseases' ? '🔍' : '🌾'}</div>
      <h3 className="text-xl font-bold">No Records Found</h3>
      <p className="text-gray-500 mt-2 text-center max-w-xs">
        Your {type} analysis history will appear here once you run your first scan.
      </p>
    </div>
  );
}
