import React from 'react';
import { Stat } from '../types';
import { getLevelFromXP } from '../utils/gameLogic';
import { motion } from 'motion/react';

interface DisciplineHeaderProps {
  stats: Stat[];
  userName: string;
  onNameChange: (name: string) => void;
}

export const DisciplineHeader: React.FC<DisciplineHeaderProps> = ({ stats, userName, onNameChange }) => {
  const avgLevel = stats.length > 0 
    ? stats.reduce((acc, s) => acc + getLevelFromXP(s.xp), 0) / stats.length 
    : 1;
  
  const displayLevel = Math.floor(avgLevel);
  const progress = (avgLevel - displayLevel) * 100;

  return (
    <div className="mb-8 border-b border-black/10 pb-6">
      <div className="flex justify-between items-end mb-2">
        <div className="flex-grow mr-4">
          <input
            type="text"
            value={userName}
            onChange={(e) => onNameChange(e.target.value)}
            className="text-4xl font-black uppercase tracking-tighter font-mono text-black bg-transparent border-none focus:outline-none w-full p-0"
            placeholder="YOUR NAME"
          />
        </div>
        <div className="text-right flex-shrink-0">
          <div className="text-[9px] font-mono opacity-40 uppercase tracking-widest font-bold">Global Rank</div>
          <div className="text-2xl font-black font-mono uppercase">Level {displayLevel}</div>
        </div>
      </div>
      
      <div className="h-1 w-full bg-black/5 rounded-none overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progress || 0}%` }}
          className="h-full bg-black"
        />
      </div>
    </div>
  );
};
