import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { FrequencyConfig, FrequencyType } from '../types';

interface AddStatModalProps {
  onAdd: (name: string, frequency: FrequencyConfig) => void;
  onClose: () => void;
}

export const AddStatModal: React.FC<AddStatModalProps> = ({ onAdd, onClose }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<FrequencyType>('daily');
  const [interval, setInterval] = useState(3);
  const [daysOfWeek, setDaysOfWeek] = useState<number[]>([1]); // Default Monday

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      const frequency: FrequencyConfig = {
        type,
        interval: type === 'interval' ? interval : undefined,
        daysOfWeek: type === 'weekly' ? daysOfWeek : undefined,
      };
      onAdd(name.trim(), frequency);
      onClose();
    }
  };

  const toggleDay = (dayIndex: number) => {
    setDaysOfWeek(prev => 
      prev.includes(dayIndex) 
        ? prev.filter(d => d !== dayIndex) 
        : [...prev, dayIndex]
    );
  };

  return (
    <div className="fixed inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white border border-black/10 p-6 w-full max-w-md shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-mono font-black uppercase tracking-tighter">New Stat</h2>
          <button onClick={onClose} className="text-black/30 hover:text-black">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-[10px] font-mono uppercase opacity-50 mb-1 font-bold">Stat Name</label>
            <input 
              autoFocus
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-black/5 border border-black/10 p-2 font-mono text-black focus:outline-none focus:border-black"
              placeholder="e.g. MEDITATION"
            />
          </div>

          <div className="mb-4">
            <label className="block text-[10px] font-mono uppercase opacity-50 mb-1 font-bold">Frequency Type</label>
            <select 
              value={type}
              onChange={(e) => setType(e.target.value as FrequencyType)}
              className="w-full bg-black/5 border border-black/10 p-2 font-mono text-black focus:outline-none focus:border-black"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly (Specific Days)</option>
              <option value="interval">Interval (Every X Days)</option>
            </select>
          </div>

          {type === 'interval' && (
            <div className="mb-4">
              <label className="block text-[10px] font-mono uppercase opacity-50 mb-1 font-bold">Every X Days</label>
              <input 
                type="number" 
                min="1"
                value={interval}
                onChange={(e) => setInterval(parseInt(e.target.value))}
                className="w-full bg-black/5 border border-black/10 p-2 font-mono text-black focus:outline-none focus:border-black"
              />
            </div>
          )}

          {type === 'weekly' && (
            <div className="mb-6">
              <label className="block text-[10px] font-mono uppercase opacity-50 mb-2 font-bold">Select Days</label>
              <div className="flex flex-wrap gap-2">
                {days.map((day, index) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(index)}
                    className={`px-2 py-1 text-[10px] font-mono font-bold border ${
                      daysOfWeek.includes(index) 
                        ? 'bg-black text-white border-black' 
                        : 'bg-transparent text-black/40 border-black/10'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button 
            type="submit"
            className="w-full bg-black text-white font-black py-3 uppercase tracking-widest hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
          >
            <Plus size={18} />
            Initialize Stat
          </button>
        </form>
      </div>
    </div>
  );
};
