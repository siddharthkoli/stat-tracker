export type FrequencyType = 'daily' | 'weekly' | 'interval';

export interface FrequencyConfig {
  type: FrequencyType;
  interval?: number; // for 'interval' type
  daysOfWeek?: number[]; // for 'weekly' type (0-6, 0=Sunday)
}

export interface Stat {
  id: string;
  name: string;
  xp: number;
  level: number;
  lastUpdated: number; // timestamp
  frequency: FrequencyConfig;
  completions: number[]; // array of timestamps
}

export interface GameState {
  stats: Stat[];
  lastOpened: number;
}
