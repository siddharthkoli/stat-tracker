import React, { useState } from 'react';
import { Stat } from '../types';
import { getProgressToNextLevel, getLevelFromXP } from '../utils/gameLogic';
import { Check, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface StatCardProps {
  stat: Stat;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

export const StatCard: React.FC<StatCardProps> = ({ stat, onComplete, onDelete }) => {
  const [showXP, setShowXP] = useState(false);
  const progress = getProgressToNextLevel(stat.xp);
  const level = getLevelFromXP(stat.xp);

  const handleComplete = () => {
    onComplete(stat.id);
    setShowXP(true);
    setTimeout(() => setShowXP(false), 1000);
  };

  const getFrequencyLabel = () => {
    const { type, interval, daysOfWeek } = stat.frequency;
    if (type === 'daily') return 'Daily';
    if (type === 'interval') return `Every ${interval} days`;
    if (type === 'weekly' && daysOfWeek) {
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      return `Weekly: ${daysOfWeek.map(d => days[d]).join(', ')}`;
    }
    return 'Custom';
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="stat-card p-4 mb-4 relative group rounded-sm"
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-xl font-black uppercase tracking-tighter font-mono">
            {stat.name}
          </h3>
          <div className="text-[10px] text-black/40 font-mono uppercase font-bold">
            Level {level} — {getFrequencyLabel()}
          </div>
        </div>
        <button 
          onClick={() => onDelete(stat.id)}
          className="opacity-0 group-hover:opacity-100 p-1 text-black/20 hover:text-black transition-all"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-[9px] font-mono mb-1 uppercase font-bold opacity-60">
          <span>XP Progression</span>
          <span>{Math.floor(progress)}%</span>
        </div>
        <div className="progress-bar-bg h-1.5 w-full rounded-none overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="progress-bar-fill h-full"
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-[9px] font-mono opacity-30 uppercase font-bold">
          XP: {Math.floor(stat.xp)}
        </span>
        <button
          onClick={handleComplete}
          className="bg-black text-white px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors flex items-center gap-2 rounded-none"
        >
          <Check size={12} />
          Complete
        </button>
      </div>

      <AnimatePresence>
        {showXP && (
          <motion.div 
            initial={{ y: 0, opacity: 1 }}
            animate={{ y: -40, opacity: 0 }}
            exit={{ opacity: 0 }}
            className="absolute right-4 top-1/2 text-black font-mono font-bold text-lg pointer-events-none"
          >
            +5 XP
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
