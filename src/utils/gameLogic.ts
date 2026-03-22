import { Stat } from '../types';

/**
 * Level calculation: xp_required(level) = 10 * (level ^ 1.5)
 * To find level from XP: level = (xp / 10) ^ (1 / 1.5)
 */
export const getLevelFromXP = (xp: number): number => {
  if (xp <= 0) return 1;
  return Math.floor(Math.pow(xp / 10, 1 / 1.5)) + 1;
};

export const getXPForLevel = (level: number): number => {
  if (level <= 1) return 0;
  return Math.floor(10 * Math.pow(level - 1, 1.5));
};

export const getProgressToNextLevel = (xp: number) => {
  const currentLevel = getLevelFromXP(xp);
  const currentLevelXP = getXPForLevel(currentLevel);
  const nextLevelXP = getXPForLevel(currentLevel + 1);
  
  const progressXP = xp - currentLevelXP;
  const totalXPNeeded = nextLevelXP - currentLevelXP;
  
  return Math.min(100, Math.max(0, (progressXP / totalXPNeeded) * 100));
};

/**
 * Base decay formula: decay = 2 * (1 + level * 0.1)
 */
export const calculateBaseDecay = (level: number): number => {
  return 2 * (1 + level * 0.1);
};

/**
 * Frequency-aware decay logic
 * Returns the amount of XP to decay
 */
export const calculateDecayAmount = (stat: Stat, now: number): number => {
  const lastUpdate = stat.lastUpdated;
  const diffMs = now - lastUpdate;
  const oneDayMs = 1000 * 60 * 60 * 24;
  const diffDays = diffMs / oneDayMs;
  
  if (diffDays < 1) return 0;

  let missedIntervals = 0;
  const { type, interval, daysOfWeek } = stat.frequency;

  if (type === 'daily') {
    missedIntervals = Math.floor(diffDays);
  } else if (type === 'interval' && interval) {
    missedIntervals = Math.floor(diffDays / interval);
  } else if (type === 'weekly' && daysOfWeek && daysOfWeek.length > 0) {
    // For weekly, we check how many of the target days have passed since lastUpdate
    let current = new Date(lastUpdate + oneDayMs); // Start checking from the day after lastUpdate
    current.setHours(0, 0, 0, 0);
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);

    while (current <= today) {
      if (daysOfWeek.includes(current.getDay())) {
        missedIntervals++;
      }
      current.setDate(current.getDate() + 1);
    }
    
    // If they completed it today, don't count today as missed yet
    // But completions are tracked separately. 
    // Actually, if they completed it on a target day, lastUpdated would have been updated.
    // So if lastUpdated was Monday (target day), and now is Tuesday, missedIntervals would be 0.
    // If lastUpdated was Sunday, and Monday was a target day, and now is Tuesday, missedIntervals is 1.
  }

  if (missedIntervals <= 0) return 0;

  const baseDecay = calculateBaseDecay(stat.level);
  return baseDecay * missedIntervals;
};
