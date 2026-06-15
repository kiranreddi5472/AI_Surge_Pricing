import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from 'recharts';
import { fetchHistory } from '../services/api';
import { History, BarChart3, AlertCircle } from 'lucide-react';

const AnalyticsDashboard = ({ refreshTrigger }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        setLoading(true);
        const data = await fetchHistory();
        // Backend returns oldest first, let's reverse for table (newest first)
        setHistory(data.reverse());
        setError(null);
      } catch (err) {
        setError("Failed to connect to Django Backend. Ensure it is running.");
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, [refreshTrigger]);

  if (loading) {
    return <div className="glass-panel p-6 w-full text-center py-12">Loading analytics...</div>;
  }

  if (error) {
    return (
      <div className="glass-panel p-6 w-full bg-red-50 border-red-200">
        <div className="flex items-center gap-2 text-red-600 mb-2">
          <AlertCircle size={20} />
          <h3 className="font-semibold">Backend Connection Error</h3>
        </div>
        <p className="text-sm text-red-500">{error}</p>
      </div>
    );
  }

  // Data for chart (oldest to newest, so we reverse back a slice)
  const chartData = history.slice(0, 10).reverse().map((item, index) => ({
    name: `Ride ${index + 1}`,
    surge: item.surge_multiplier,
    price: item.predicted_price,
    demand: item.demand
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Surge Trends */}
        <div className="glass-panel p-5">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 size={20} className="text-uber-blue" />
            <h3 className="font-bold text-gray-800">Recent Surge Trends</h3>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#888'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#888'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Line type="monotone" dataKey="surge" stroke="#276EF1" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Demand vs Price */}
        <div className="glass-panel p-5">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 size={20} className="text-uber-black" />
            <h3 className="font-bold text-gray-800">Demand Impact on Price</h3>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#888'}} />
                <YAxis yAxisId="left" orientation="left" stroke="#888" axisLine={false} tickLine={false} />
                <YAxis yAxisId="right" orientation="right" stroke="#276EF1" axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: 'transparent'}} />
                <Legend />
                <Bar yAxisId="left" dataKey="price" fill="#000000" radius={[4, 4, 0, 0]} />
                <Bar yAxisId="right" dataKey="demand" fill="#276EF1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className="glass-panel p-6 overflow-hidden">
        <div className="flex items-center gap-2 mb-6">
          <History size={20} className="text-gray-600" />
          <h3 className="font-bold text-xl text-gray-800">Prediction History</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 text-sm text-gray-500">
                <th className="pb-3 font-medium">Time</th>
                <th className="pb-3 font-medium">Route</th>
                <th className="pb-3 font-medium">Conditions</th>
                <th className="pb-3 font-medium text-right">Surge</th>
                <th className="pb-3 font-medium text-right">Final Price</th>
              </tr>
            </thead>
            <tbody>
              {history.slice(0, 8).map((item) => (
                <tr key={item.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                  <td className="py-4 text-sm text-gray-600">
                    {new Date(item.timestamp).toLocaleString(undefined, {
                      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                  </td>
                  <td className="py-4">
                    <div className="font-medium text-gray-800">{item.pickup}</div>
                    <div className="text-xs text-gray-500">to {item.drop}</div>
                  </td>
                  <td className="py-4">
                    <div className="text-sm text-gray-600 capitalize">{item.weather}, {item.time_of_day}</div>
                    <div className="text-xs text-gray-500">Traffic: {item.traffic_level}</div>
                  </td>
                  <td className="py-4 text-right">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${item.surge_multiplier > 1.2 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                      {item.surge_multiplier}x
                    </span>
                  </td>
                  <td className="py-4 text-right font-bold text-uber-black">
                    ₹{item.predicted_price.toFixed(2)}
                  </td>
                </tr>
              ))}
              {history.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-gray-500">No predictions made yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
