import React, { useState } from 'react';
import { MapPin, Navigation, Clock, CloudRain, Car, Users } from 'lucide-react';

const InputForm = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    pickup: 'Downtown',
    drop: 'Airport',
    demand: 120,
    supply: 50,
    time_of_day: 'evening',
    traffic_level: 'high',
    weather: 'clear'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Convert numeric fields from string to number
    const newValue = ['demand', 'supply'].includes(name) ? Number(value) : value;
    setFormData({ ...formData, [name]: newValue });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="glass-panel p-6 w-full h-full">
      <h2 className="text-2xl font-bold mb-6 text-uber-black">Ride Details</h2>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <MapPin size={16} className="text-uber-blue" /> Pickup Location
            </label>
            <input type="text" name="pickup" value={formData.pickup} onChange={handleChange} className="input-field" required />
          </div>
          
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Navigation size={16} className="text-uber-blue" /> Drop Location
            </label>
            <input type="text" name="drop" value={formData.drop} onChange={handleChange} className="input-field" required />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Users size={16} className="text-uber-blue" /> Demand (Riders)
            </label>
            <input type="number" name="demand" value={formData.demand} onChange={handleChange} className="input-field" min="0" required />
          </div>
          
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Car size={16} className="text-uber-blue" /> Supply (Drivers)
            </label>
            <input type="number" name="supply" value={formData.supply} onChange={handleChange} className="input-field" min="0" required />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
            <Clock size={16} className="text-uber-blue" /> Time of Day
          </label>
          <select name="time_of_day" value={formData.time_of_day} onChange={handleChange} className="input-field bg-white">
            <option value="morning">Morning (6 AM - 12 PM)</option>
            <option value="afternoon">Afternoon (12 PM - 5 PM)</option>
            <option value="evening">Evening (5 PM - 9 PM)</option>
            <option value="night">Night (9 PM - 6 AM)</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Car size={16} className="text-uber-blue" /> Traffic Level
            </label>
            <select name="traffic_level" value={formData.traffic_level} onChange={handleChange} className="input-field bg-white">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <CloudRain size={16} className="text-uber-blue" /> Weather
            </label>
            <select name="weather" value={formData.weather} onChange={handleChange} className="input-field bg-white">
              <option value="clear">Clear</option>
              <option value="rainy">Rainy</option>
              <option value="storm">Storm</option>
              <option value="snow">Snow</option>
            </select>
          </div>
        </div>

        <button type="submit" disabled={isLoading} className="btn-primary mt-6 flex justify-center items-center gap-2">
          {isLoading ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            "Predict Price"
          )}
        </button>
      </form>
    </div>
  );
};

export default InputForm;
