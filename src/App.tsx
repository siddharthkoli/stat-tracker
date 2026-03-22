import React, { useState, useEffect } from 'react';
import { Stat, FrequencyConfig } from './types';
import { calculateDecayAmount, getLevelFromXP } from './utils/gameLogic';
import { StatCard } from './components/StatCard';
import { DisciplineHeader } from './components/DisciplineHeader';
import { AddStatModal } from './components/AddStatModal';
import { Plus, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const STORAGE_KEY = 'gta_stats_v2';
const NAME_KEY = 'gta_user_name';

const DEFAULT_STATS: Stat[] = [
  {
    id: '1',
    name: 'Reading',
    xp: 0,
    level: 1,
    lastUpdated: Date.now(),
    frequency: { type: 'daily' },
    completions: []
  },
  {
    id: '2',
    name: 'Fitness',
    xp: 0,
    level: 1,
    lastUpdated: Date.now(),
    frequency: { type: 'interval', interval: 2 },
    completions: []
  },
  {
    id: '3',
    name: 'Sleep',
    xp: 0,
    level: 1,
    lastUpdated: Date.now(),
    frequency: { type: 'daily' },
    completions: []
  }
];

export default function App() {
  const [stats, setStats] = useState<Stat[]>([]);
  const [userName, setUserName] = useState('DISCIPLINE');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [decayNotification, setDecayNotification] = useState<{ name: string, amount: number } | null>(null);

  // Load data and apply decay
  useEffect(() => {
    const savedName = localStorage.getItem(NAME_KEY);
    if (savedName) setUserName(savedName);

    const saved = localStorage.getItem(STORAGE_KEY);
    let currentStats: Stat[] = saved ? JSON.parse(saved) : DEFAULT_STATS;
    const now = Date.now();
    
    let totalDecay = 0;
    const updatedStats = currentStats.map(stat => {
      const decay = calculateDecayAmount(stat, now);
      if (decay > 0) {
        totalDecay += decay;
        const newXP = Math.max(0, stat.xp - decay);
        return {
          ...stat,
          xp: newXP,
          level: getLevelFromXP(newXP),
          lastUpdated: now
        };
      }
      return stat;
    });

    if (totalDecay > 0) {
      setDecayNotification({ name: 'Multiple Stats', amount: Math.round(totalDecay) });
      setTimeout(() => setDecayNotification(null), 5000);
    }

    setStats(updatedStats);
  }, []);

  // Save stats
  useEffect(() => {
    if (stats.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
    }
  }, [stats]);

  // Save name
  useEffect(() => {
    localStorage.setItem(NAME_KEY, userName);
  }, [userName]);

  const handleComplete = (id: string) => {
    setStats(prev => prev.map(stat => {
      if (stat.id === id) {
        const newXP = stat.xp + 5;
        return {
          ...stat,
          xp: newXP,
          level: getLevelFromXP(newXP),
          lastUpdated: Date.now(),
          completions: [...stat.completions, Date.now()]
        };
      }
      return stat;
    }));
  };

  const handleAddStat = (name: string, frequency: FrequencyConfig) => {
    const newStat: Stat = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      xp: 0,
      level: 1,
      lastUpdated: Date.now(),
      frequency,
      completions: []
    };
    setStats(prev => [...prev, newStat]);
  };

  const handleDeleteStat = (id: string) => {
    setStats(prev => prev.filter(s => s.id !== id));
  };

  return (
    <div className="min-h-screen max-w-md mx-auto px-6 py-12 flex flex-col">
      <DisciplineHeader 
        stats={stats} 
        userName={userName} 
        onNameChange={setUserName} 
      />

      <AnimatePresence>
        {decayNotification && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-black/5 border border-black/10 p-3 mb-6 flex items-center gap-3 text-black/60 text-[10px] font-mono uppercase font-bold"
          >
            <AlertCircle size={14} />
            <span>Decay detected: -{decayNotification.amount} XP total</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-grow">
        <AnimatePresence mode="popLayout">
          {stats.map(stat => (
            <StatCard 
              key={stat.id} 
              stat={stat} 
              onComplete={handleComplete} 
              onDelete={handleDeleteStat}
            />
          ))}
        </AnimatePresence>

        {stats.length === 0 && (
          <div className="text-center py-20 opacity-10 font-mono uppercase text-sm font-black">
            No active stats
          </div>
        )}
      </div>

      <button 
        onClick={() => setIsAddModalOpen(true)}
        className="mt-8 border border-black/10 p-4 w-full flex items-center justify-center gap-2 text-black/30 hover:text-black hover:border-black/30 transition-all uppercase font-mono text-[10px] font-bold tracking-widest"
      >
        <Plus size={16} />
        Initialize New Stat
      </button>

      {isAddModalOpen && (
        <AddStatModal 
          onAdd={handleAddStat} 
          onClose={() => setIsAddModalOpen(false)} 
        />
      )}

      <footer className="mt-12 text-[9px] font-mono opacity-20 uppercase text-center tracking-widest font-bold">
        StatTracker System v2.0 // Monochrome Edition
      </footer>
    </div>
  );
}
