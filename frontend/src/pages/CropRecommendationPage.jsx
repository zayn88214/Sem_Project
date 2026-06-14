import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { cropService } from '../services/index';

export default function CropRecommendationPage() {
  const [formData, setFormData] = useState({
    N: '', P: '', K: '', temperature: '', humidity: '', pH: '', rainfall: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.values(formData).some(v => v === '')) {
      toast.error('Please fill all soil parameters');
      return;
    }

    setIsLoading(true);
    setResult(null);
    try {
      const recommendation = await cropService.recommendCrop(
        parseFloat(formData.N), parseFloat(formData.P), parseFloat(formData.K),
        parseFloat(formData.temperature), parseFloat(formData.humidity),
        parseFloat(formData.pH), parseFloat(formData.rainfall)
      );
      setResult(recommendation);
      toast.success('Optimization analysis complete!');
    } catch (error) {
      toast.error('Failed to generate recommendation');
    } finally {
      setIsLoading(false);
    }
  };

  const inputFields = [
    { name: 'N', label: 'Nitrogen (N)', icon: '🧪', placeholder: '0-140', desc: 'Soil nitrogen content' },
    { name: 'P', label: 'Phosphorus (P)', icon: '🧪', placeholder: '0-145', desc: 'Soil phosphorus content' },
    { name: 'K', label: 'Potassium (K)', icon: '🧪', placeholder: '0-205', desc: 'Soil potassium content' },
    { name: 'pH', label: 'pH Level', icon: '⚖️', placeholder: '0-14', desc: 'Soil acidity/alkalinity' },
    { name: 'temperature', label: 'Temperature', icon: '🌡️', placeholder: '°C', desc: 'Ambient temperature' },
    { name: 'humidity', label: 'Humidity', icon: '💧', placeholder: '%', desc: 'Relative humidity' },
    { name: 'rainfall', label: 'Rainfall', icon: '🌧️', placeholder: 'mm', desc: 'Annual rainfall' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="max-w-6xl mx-auto space-y-8 pb-12"
    >
      <header className="text-center space-y-2">
        <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          Intelligent <span className="gradient-text">Crop Recommendation</span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-lg">
          Our Random Forest AI model analyzes your soil properties to suggest the most suitable crops for maximum yield.
        </p>
      </header>

      <div className="grid lg:grid-cols-5 gap-8 items-start">
        {/* Input Form */}
        <div className="lg:col-span-3 space-y-6">
          <form onSubmit={handleSubmit} className="glass-card">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-sm">📋</span>
              Soil Parameters
            </h2>
            
            <div className="grid sm:grid-cols-2 gap-6">
              {inputFields.map((field) => (
                <div key={field.name} className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    <span>{field.icon}</span>
                    {field.label}
                  </label>
                  <input
                    type="number"
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    step="any"
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-green-600 transition-all outline-none"
                  />
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider">{field.desc}</p>
                </div>
              ))}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-8 py-4 rounded-xl gradient-primary font-bold text-lg hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Processing Data...' : 'Generate Recommendations'}
            </button>
          </form>

          <div className="p-6 rounded-2xl bg-amber-500/5 border border-amber-500/10 flex gap-4">
            <div className="text-2xl">💡</div>
            <div>
              <h4 className="font-bold text-amber-800 dark:text-amber-400">Why these values matter?</h4>
              <p className="text-sm text-amber-700 dark:text-amber-300/80 leading-relaxed">
                N-P-K values represent the primary nutrients. pH affects nutrient availability, and climatic factors like rainfall and temperature determine the biological feasibility of specific crops.
              </p>
            </div>
          </div>
        </div>

        {/* Results Sidebar */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="glass-card h-full flex flex-col items-center justify-center py-20"
              >
                <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <h3 className="text-xl font-bold">Calculating Yields</h3>
                <p className="text-gray-500">Evaluating 22 different crop types...</p>
              </motion.div>
            ) : result ? (
              <motion.div 
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                <div className="glass-card bg-green-600 text-white border-none">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-80">Best Choice</span>
                  <h2 className="text-4xl font-black mt-2 mb-4">{result.topRecommendation}</h2>
                  <div className="flex items-center gap-2 bg-white/20 w-fit px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                    <span>🎯</span> Confidence: {result.topConfidence}%
                  </div>
                </div>

                <div className="glass-card">
                  <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Other Alternatives</h3>
                  <div className="space-y-3">
                    {result.recommendations?.slice(1, 5).map((rec, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700">
                        <span className="font-bold text-gray-800 dark:text-gray-200">{rec.crop}</span>
                        <span className="text-sm font-medium text-green-600">{rec.confidence}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-6 rounded-2xl glass border-green-500/20">
                  <h3 className="font-bold mb-2">Soil Insights</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed italic">
                    "Based on your soil's pH and NPK levels, {result.topRecommendation} is the most resilient choice. Ensure consistent irrigation during the early growth phase."
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-card h-full flex flex-col items-center justify-center py-20 opacity-60 border-dashed"
              >
                <div className="text-6xl mb-6">🌾</div>
                <h3 className="text-xl font-bold">Ready for Analysis</h3>
                <p className="text-gray-500 text-center px-6">Input your soil data to see AI crop suggestions.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
