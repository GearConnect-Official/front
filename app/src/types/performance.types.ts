/**
 * Racing Performance Tracker Types
 * Modern, fun interface for tracking racing performance
 */

/**
 * Racing categories available for tracking
 */
export type RaceCategory = 
  | 'karting'
  | 'formula-3'
  | 'formula-2' 
  | 'formula-1'
  | 'gt-sports'
  | 'endurance'
  | 'rally'
  | 'drift'
  | 'drag-racing'
  | 'motocross'
  | 'other';

/**
 * Racing categories with fun labels and emojis
 */
export const RACE_CATEGORIES: { value: RaceCategory; label: string; emoji: string; color: string }[] = [
  { value: 'karting', label: 'Karting', emoji: '🏎️', color: '#FF6B1A' },
  { value: 'formula-3', label: 'Formula 3', emoji: '🏁', color: '#E10600' },
  { value: 'formula-2', label: 'Formula 2', emoji: '🏎️', color: '#003DA5' },
  { value: 'formula-1', label: 'Formula 1', emoji: '🏆', color: '#FFD700' },
  { value: 'gt-sports', label: 'GT Sports', emoji: '🚗', color: '#10B981' },
  { value: 'endurance', label: 'Endurance', emoji: '⏱️', color: '#8B5CF6' },
  { value: 'rally', label: 'Rally', emoji: '🛣️', color: '#F59E0B' },
  { value: 'drift', label: 'Drift', emoji: '💨', color: '#EC4899' },
  { value: 'drag-racing', label: 'Drag Racing', emoji: '⚡', color: '#EF4444' },
  { value: 'motocross', label: 'Motocross', emoji: '🏍️', color: '#84CC16' },
  { value: 'other', label: 'Other', emoji: '🏁', color: '#6B7280' },
];

/**
 * Interface for creating a new performance entry
 */
export interface CreatePerformanceData {
  circuitName: string;
  lapTime: string; // Format "1:23.456"
  racePosition: number;
  totalParticipants: number;
  category: RaceCategory;
  date: string; // ISO date string
  notes?: string;
  weather?: string;
  trackCondition?: 'dry' | 'wet' | 'mixed';
}

/**
 * Interface for updating an existing performance
 */
export interface UpdatePerformanceData {
  circuitName?: string;
  lapTime?: string;
  racePosition?: number;
  totalParticipants?: number;
  category?: RaceCategory;
  date?: string;
  notes?: string;
  weather?: string;
  trackCondition?: 'dry' | 'wet' | 'mixed';
}

/**
 * Complete performance data from API
 */
export interface Performance {
  id: number;
  userId: number;
  circuitName: string;
  lapTime: string;
  racePosition: number;
  totalParticipants: number;
  category: RaceCategory;
  date: string;
  notes?: string;
  weather?: string;
  trackCondition?: 'dry' | 'wet' | 'mixed';
  createdAt: string;
  updatedAt?: string;
}

/**
 * User's performance statistics and achievements
 */
export interface UserPerformanceStats {
  totalRaces: number;
  bestPosition: number;
  averagePosition: number;
  podiumFinishes: number;
  wins: number;
  categoriesCount: Record<string, number>;
  tracksCount: Record<string, number>;
  // Fun stats
  fastestLapTime?: string;
  favoriteCatgory?: RaceCategory;
  mostRacedTrack?: string;
  improvementRate?: number; // Percentage improvement over time
  consistency?: number; // How consistent are the lap times (0-100)
}

/**
 * Form data for the performance input screen
 */
export interface PerformanceFormData {
  circuitName: string;
  lapTime: string;
  racePosition: string; // String for form inputs
  totalParticipants: string; // String for form inputs
  category: RaceCategory;
  date: Date;
  notes: string;
  weather: string;
  trackCondition: 'dry' | 'wet' | 'mixed';
}

/**
 * Form validation errors
 */
export interface PerformanceFormErrors {
  circuitName?: string;
  lapTime?: string;
  racePosition?: string;
  totalParticipants?: string;
  category?: string;
  date?: string;
  notes?: string;
  weather?: string;
  trackCondition?: string;
}

/**
 * Filter options for performance list
 */
export interface PerformanceFilters {
  userId?: string | number;
  category?: RaceCategory | 'all';
  circuitName?: string;
  dateFrom?: string;
  dateTo?: string;
  racePosition?: 'wins' | 'podiums' | 'all';
  limit?: number;
  offset?: number;
}

/**
 * Performance achievement badges
 */
export interface PerformanceAchievement {
  id: string;
  title: string;
  description: string;
  emoji: string;
  color: string;
  unlocked: boolean;
  unlockedAt?: string;
  requirement: {
    type: 'races' | 'wins' | 'podiums' | 'category' | 'consistency';
    value: number | string;
  };
}

/**
 * Pre-defined achievement types
 */
export const PERFORMANCE_ACHIEVEMENTS: PerformanceAchievement[] = [
  {
    id: 'first-race',
    title: 'First Timer',
    description: 'Complete your first race',
    emoji: '🏁',
    color: '#10B981',
    unlocked: false,
    requirement: { type: 'races', value: 1 }
  },
  {
    id: 'speed-demon',
    title: 'Speed Demon',
    description: 'Complete 10 races',
    emoji: '⚡',
    color: '#F59E0B',
    unlocked: false,
    requirement: { type: 'races', value: 10 }
  },
  {
    id: 'first-win',
    title: 'Victory Lane',
    description: 'Win your first race',
    emoji: '🏆',
    color: '#FFD700',
    unlocked: false,
    requirement: { type: 'wins', value: 1 }
  },
  {
    id: 'podium-master',
    title: 'Podium Master',
    description: 'Achieve 5 podium finishes',
    emoji: '🥇',
    color: '#EC4899',
    unlocked: false,
    requirement: { type: 'podiums', value: 5 }
  },
  {
    id: 'karting-pro',
    title: 'Karting Pro',
    description: 'Complete 5 karting races',
    emoji: '🏎️',
    color: '#FF6B1A',
    unlocked: false,
    requirement: { type: 'category', value: 'karting' }
  },
];

/**
 * Track conditions with weather support
 */
export const TRACK_CONDITIONS = [
  { value: 'dry', label: 'Dry', emoji: '☀️', color: '#F59E0B' },
  { value: 'wet', label: 'Wet', emoji: '🌧️', color: '#3B82F6' },
  { value: 'mixed', label: 'Mixed', emoji: '⛅', color: '#6B7280' },
] as const;

/**
 * Common weather conditions for racing
 */
export const WEATHER_CONDITIONS = [
  'Sunny ☀️',
  'Cloudy ☁️', 
  'Rainy 🌧️',
  'Overcast 🌫️',
  'Windy 💨',
  'Hot 🔥',
  'Cold ❄️',
  'Perfect 🌟',
];

/**
 * Performance metrics for analysis
 */
export interface PerformanceMetrics {
  personalBest: string;
  averageLapTime: string;
  improvementTrend: 'improving' | 'stable' | 'declining';
  consistencyScore: number; // 0-100
  competitivenessRating: number; // 0-100 based on positions
}

/**
 * Position helpers for UI display
 */
export const getPositionColor = (racePosition: number): string => {
  if (racePosition === 1) return '#FFD700'; // Gold
  if (racePosition === 2) return '#C0C0C0'; // Silver  
  if (racePosition === 3) return '#CD7F32'; // Bronze
  if (racePosition <= 5) return '#10B981'; // Green for top 5
  if (racePosition <= 10) return '#3B82F6'; // Blue for top 10
  return '#6B7280'; // Gray for others
};

export const getPositionEmoji = (racePosition: number): string => {
  if (racePosition === 1) return '🥇';
  if (racePosition === 2) return '🥈';
  if (racePosition === 3) return '🥉';
  if (racePosition <= 5) return '🏁';
  return '🎯';
};

export const getPositionLabel = (racePosition: number, total: number): string => {
  const suffix = racePosition === 1 ? 'st' : racePosition === 2 ? 'nd' : racePosition === 3 ? 'rd' : 'th';
  return `${racePosition}${suffix} / ${total}`;
};

/**
 * Lap time utilities
 */
export const formatLapTime = (lapTime: string): string => {
  // Ensure proper format MM:SS.sss
  return lapTime;
};

export const parseLapTimeToSeconds = (lapTime: string): number => {
  const parts = lapTime.split(':');
  if (parts.length !== 2) return 0;
  
  const minutes = parseInt(parts[0], 10);
  const secondsParts = parts[1].split('.');
  const seconds = parseInt(secondsParts[0], 10);
  const milliseconds = parseInt(secondsParts[1] || '0', 10);
  
  return minutes * 60 + seconds + milliseconds / 1000;
};

export const compareLapTimes = (time1: string, time2: string): number => {
  return parseLapTimeToSeconds(time1) - parseLapTimeToSeconds(time2);
};

// Default export to prevent Expo Router warnings
const performanceTypes = {
  RACE_CATEGORIES,
  TRACK_CONDITIONS,
  WEATHER_CONDITIONS,
  PERFORMANCE_ACHIEVEMENTS,
  getPositionColor,
  getPositionEmoji,
  getPositionLabel,
  formatLapTime,
  parseLapTimeToSeconds,
  compareLapTimes,
};

export default performanceTypes; 