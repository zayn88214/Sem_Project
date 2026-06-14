import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { diseaseService } from '../services/index';

export default function DiseaseDetectionPage() {
  const [activeTab, setActiveTab] = useState('upload'); // 'url', 'upload', 'text'
  const [imageUrl, setImageUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [symptoms, setSymptoms] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size too large (max 5MB)');
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setActiveTab('upload');
    }
  };

  const handlePredict = async (e) => {
    e.preventDefault();
    
    setIsLoading(true);
    setResult(null);
    
    try {
      let prediction;
      if (activeTab === 'url') {
        if (!imageUrl.trim()) throw new Error('Please enter an image URL');
        prediction = await diseaseService.predictDisease(imageUrl);
      } else if (activeTab === 'upload') {
        if (!selectedFile) throw new Error('Please select an image file');
        prediction = await diseaseService.predictDiseaseFile(selectedFile);
      } else {
        if (!symptoms.trim()) throw new Error('Please describe the symptoms');
        prediction = await diseaseService.predictDiseaseText(symptoms);
      }
      
      setResult(prediction);
      toast.success('Analysis complete!');
    } catch (error) {
      toast.error(error.message || 'Prediction failed');
    } finally {
      setIsLoading(false);
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setImageUrl('');
    setSymptoms('');
    setResult(null);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="max-w-6xl mx-auto space-y-8 pb-12"
    >
      <header className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-bold uppercase tracking-widest">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          AI Disease Analysis Engine
        </div>
        <h1 className="text-5xl md:text-6xl font-black tracking-tight text-gray-900 dark:text-white">
          Plant <span className="gradient-text">Health Diagnosis</span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-lg font-medium">
          Identify plant pathologies using advanced computer vision or describe symptoms for instant AI-driven treatment insights.
        </p>
      </header>

      {/* Mode Switcher */}
      <div className="flex justify-center">
        <div className="p-1.5 glass rounded-2xl flex items-center gap-1">
          <button 
            onClick={() => setActiveTab('upload')}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'upload' ? 'bg-green-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
          >
            <span>📁</span> Upload
          </button>
          <button 
            onClick={() => setActiveTab('url')}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'url' ? 'bg-green-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
          >
            <span>🔗</span> URL
          </button>
          <button 
            onClick={() => setActiveTab('text')}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'text' ? 'bg-green-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
          >
            <span>📝</span> Symptoms
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 items-start">
        {/* Left: Input Section */}
        <section className="space-y-6">
          <div className="glass-card overflow-hidden">
            <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-gray-200">Submit Details</h2>
            
            <form onSubmit={handlePredict} className="space-y-6">
              {activeTab !== 'text' && (
                <div 
                  onClick={() => activeTab === 'upload' && fileInputRef.current?.click()}
                  className={`relative border-2 border-dashed rounded-3xl p-8 transition-all duration-300 flex flex-col items-center justify-center gap-4 min-h-[300px] cursor-pointer group ${
                    isHovered ? 'border-green-500 bg-green-500/5' : 'border-gray-200 dark:border-gray-700 hover:border-green-400'
                  }`}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleFileChange}
                  />

                  {previewUrl || imageUrl ? (
                    <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl group">
                      <img src={previewUrl || imageUrl} alt="Preview" className="w-full h-full object-cover max-h-[400px]" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <p className="text-white font-bold">Click to change image</p>
                      </div>
                      <button 
                        type="button"
                        onClick={(e) => { e.stopPropagation(); clearSelection(); }}
                        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center backdrop-blur-md hover:bg-red-500 transition-all z-10"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="w-24 h-24 rounded-3xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-5xl group-hover:scale-110 transition-transform">
                        {activeTab === 'upload' ? '📤' : '🌐'}
                      </div>
                      <div className="text-center">
                        <p className="text-gray-900 dark:text-white font-bold text-xl">
                          {activeTab === 'upload' ? 'Drop Image Here' : 'Provide Image URL'}
                        </p>
                        <p className="text-gray-500 mt-2">
                          {activeTab === 'upload' ? 'Supports JPG, PNG (max 5MB)' : 'Paste a direct link to the leaf photo'}
                        </p>
                      </div>
                      <button type="button" className="mt-2 px-6 py-2 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-bold">
                        Browse Files
                      </button>
                    </>
                  )}
                </div>
              )}

              {activeTab === 'url' && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">
                    Image Address
                  </label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://example.com/plant-leaf.jpg"
                    className="w-full px-5 py-4 border border-gray-200 dark:border-gray-700 rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-green-600 transition-all outline-none font-medium"
                  />
                </div>
              )}

              {activeTab === 'text' && (
                <div className="space-y-4">
                   <div className="p-6 rounded-3xl bg-amber-500/5 border border-amber-500/10 flex gap-4">
                    <span className="text-2xl">💡</span>
                    <p className="text-sm text-amber-800 dark:text-amber-300 leading-relaxed font-medium">
                      Describe the color, texture, and pattern of the spots or damage. For example: "Yellowing edges with dark brown circular spots on tomato leaves."
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">
                      Symptom Description
                    </label>
                    <textarea
                      value={symptoms}
                      onChange={(e) => setSymptoms(e.target.value)}
                      placeholder="Describe what you see on the plant..."
                      rows="6"
                      className="w-full px-5 py-4 border border-gray-200 dark:border-gray-700 rounded-3xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-green-600 transition-all outline-none font-medium resize-none"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-5 rounded-2xl font-black text-xl shadow-xl transition-all ${
                  isLoading
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'gradient-primary hover:scale-[1.02] active:scale-[0.98] text-white'
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-3">
                    <svg className="animate-spin h-6 w-6 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Processing AI Logic...
                  </span>
                ) : 'Analyze Health Now'}
              </button>
            </form>
          </div>
        </section>

        {/* Right: Results Section */}
        <section className="h-full">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="glass-card h-full flex flex-col items-center justify-center py-32"
              >
                <div className="relative w-32 h-32 mb-8">
                  <div className="absolute inset-0 border-[6px] border-green-500/10 rounded-full"></div>
                  <div className="absolute inset-0 border-[6px] border-green-500 border-t-transparent rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center text-5xl">🧬</div>
                </div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white">AI Inference Active</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-3 font-medium">Extracting leaf features & patterns...</p>
              </motion.div>
            ) : result ? (
              <motion.div 
                key="result"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="glass-card border-t-8 border-green-500 relative overflow-hidden">
                   {/* Decorative background element */}
                  <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-green-500/5 rounded-full blur-3xl"></div>
                  
                  <div className="flex flex-col md:flex-row justify-between items-start gap-6 relative z-10">
                    <div className="flex-1">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-[10px] font-black uppercase tracking-widest mb-4">
                        Status: Positive Match
                      </div>
                      <h2 className="text-4xl font-black text-gray-900 dark:text-white leading-tight">
                        {result.disease}
                      </h2>
                      <div className="flex gap-2 mt-4">
                         <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${
                          result.severity === 'high' ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 
                          result.severity === 'medium' ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' : 
                          'bg-green-500 text-white shadow-lg shadow-green-500/20'
                        }`}>
                          Severity: {result.severity}
                        </span>
                        <span className="px-4 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs font-bold border border-gray-200 dark:border-gray-700">
                          ID: #{Math.floor(Math.random() * 10000)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-center justify-center p-6 bg-green-500 rounded-[2.5rem] text-white shadow-xl min-w-[140px]">
                      <span className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">Confidence</span>
                      <span className="text-4xl font-black tracking-tighter">{result.confidence}%</span>
                    </div>
                  </div>

                  <div className="mt-10 grid gap-4 relative z-10">
                    <div className="p-6 rounded-[2rem] bg-white dark:bg-gray-800/50 shadow-sm border border-gray-100 dark:border-gray-700 group hover:border-green-500/30 transition-all">
                      <div className="flex gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">💊</div>
                        <div className="flex-1">
                          <h4 className="font-black text-gray-900 dark:text-white uppercase text-xs tracking-widest mb-2 text-blue-600">Treatment Plan</h4>
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-medium">{result.treatment}</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 rounded-[2rem] bg-white dark:bg-gray-800/50 shadow-sm border border-gray-100 dark:border-gray-700 group hover:border-green-500/30 transition-all">
                      <div className="flex gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">🛡️</div>
                        <div className="flex-1">
                          <h4 className="font-black text-gray-900 dark:text-white uppercase text-xs tracking-widest mb-2 text-green-600">Prevention Strategy</h4>
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-medium">{result.prevention}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 flex gap-4">
                    <button 
                      onClick={clearSelection}
                      className="flex-1 py-4 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold hover:opacity-90 transition-all">
                      New Diagnosis
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-card h-full flex flex-col items-center justify-center py-32 border-dashed border-2 opacity-50 text-center px-10"
              >
                <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-5xl mb-8">
                   🧬
                </div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-3">Waiting for Analysis</h3>
                <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                  Choose your preferred detection method to get started. Our AI models are ready to help protect your crops.
                </p>
                <div className="mt-10 flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>
    </motion.div>
  );
}
