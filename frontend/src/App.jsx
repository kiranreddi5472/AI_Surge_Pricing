import React, { useState } from 'react';
import InputForm from './components/InputForm';
import ResultCards from './components/ResultCards';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import { predictPrice } from './services/api';
import { CarFront } from 'lucide-react';

function App() {
  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handlePredict = async (formData) => {
    setIsLoading(true);
    try {
      const result = await predictPrice(formData);
      setPrediction(result);
      // Trigger dashboard refresh by updating state
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      alert("Failed to predict. Is the Django server running?");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
      {/* Navbar */}
      <nav className="bg-uber-black text-white px-8 py-4 shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <CarFront size={28} className="text-uber-blue" />
          <h1 className="text-2xl font-bold tracking-tight">AI Surge Pricing</h1>
          <span className="ml-4 px-3 py-1 bg-white/10 text-xs font-semibold rounded-full tracking-wider uppercase text-gray-300">
            Powered by Machine Learning
          </span>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Top Section: Form and Results */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          
          {/* Left Column: Input Form */}
          <div className="lg:col-span-7">
            <InputForm onSubmit={handlePredict} isLoading={isLoading} />
          </div>

          {/* Right Column: Prediction Results */}
          <div className="lg:col-span-5 flex flex-col h-full">
            <ResultCards prediction={prediction} />
          </div>
          
        </div>

        {/* Bottom Section: Analytics & History */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-uber-black mb-6">Market Analytics</h2>
          <AnalyticsDashboard refreshTrigger={refreshTrigger} />
        </div>

      </main>
      
      <footer className="bg-white border-t border-gray-200 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
          Built with Django MVT & React • Random Forest ML Model Integration
        </div>
      </footer>
    </div>
  );
}

export default App;
