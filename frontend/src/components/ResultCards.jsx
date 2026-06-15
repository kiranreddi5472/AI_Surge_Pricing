import React from 'react';
import { IndianRupee, TrendingUp, Activity } from 'lucide-react';

const ResultCards = ({ prediction }) => {
  if (!prediction) {
    return (
      <div className="glass-panel p-8 w-full h-full flex flex-col items-center justify-center text-gray-400">
        <Activity size={48} className="mb-4 opacity-50" />
        <p className="text-lg">Enter ride details to see AI prediction</p>
      </div>
    );
  }

  // Determine surge severity color
  const getSurgeColor = (surge) => {
    if (surge > 1.5) return 'text-red-500 bg-red-50 border-red-100';
    if (surge > 1.1) return 'text-orange-500 bg-orange-50 border-orange-100';
    return 'text-green-500 bg-green-50 border-green-100';
  };

  const surgeColorClass = getSurgeColor(prediction.surge_multiplier);

  return (
    <div className="space-y-6 w-full">
      {/* Price Card */}
      <div className="glass-panel p-6 bg-gradient-to-br from-uber-black to-uber-dark-gray text-white transform transition-all hover:scale-[1.02] duration-300">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-gray-300 font-medium mb-1">Estimated Price</p>
            <div className="flex items-center gap-1">
              <IndianRupee size={36} className="text-white" />
              <h2 className="text-5xl font-bold">{prediction.predicted_price.toFixed(0)}</h2>
            </div>
            <p className="text-gray-400 text-sm mt-3">
              Base Price: ₹{prediction.base_price} × Surge: {prediction.surge_multiplier}x
            </p>
          </div>
          <div className="p-3 bg-white/10 rounded-xl backdrop-blur-md">
            <IndianRupee size={24} className="text-white" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Surge Card */}
        <div className={`glass-panel p-5 border ${surgeColorClass} transform transition-all hover:-translate-y-1 duration-300`}>
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={20} />
            <h3 className="font-semibold text-gray-800">Surge Multiplier</h3>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold">{prediction.surge_multiplier}</span>
            <span className="text-lg font-medium">x</span>
          </div>
          <p className="text-xs text-gray-500 mt-2">Driven by AI Model</p>
        </div>

        {/* Demand Card */}
        <div className="glass-panel p-5 border border-uber-blue/20 bg-blue-50/50 transform transition-all hover:-translate-y-1 duration-300">
          <div className="flex items-center gap-2 mb-3">
            <Activity size={20} className="text-uber-blue" />
            <h3 className="font-semibold text-gray-800">Market Status</h3>
          </div>
          <div className="text-xl font-bold text-uber-black">
            {prediction.surge_multiplier > 1.2 ? 'High Demand' : 'Normal'}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Supply: {prediction.supply} | Demand: {prediction.demand}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResultCards;
