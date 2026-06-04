export interface CatProfile {
  name: string;
  breed: string;
  age: string;
  personality: string[];
  favoriteSpot: string;
  favoriteToy: string;
  avatarUrl: string;
  bio: string;
  furColor: string;
  pattern: string;
  distinctiveFeatures: string[];
}

export interface WeightRecord {
  id: string;
  date: string;
  weight: number | string; // in kg or string expression
}

export interface GalleryImage {
  id: string;
  url: string;
  caption: string;
  date: string;
}

export interface DailyTask {
  id: string;
  name: string;
  category: 'diet' | 'activity' | 'hygiene' | 'other';
  completed: boolean;
  time?: string;
}

export interface DailyLogState {
  waterCount: number; // in bowls (e.g. 1 bowl = 100ml)
  waterTarget: number; // target (e.g. 4 bowls)
  tasks: DailyTask[];
}

export interface MoodRecord {
  id: string;
  date: string;
  mood: 'peaceful' | 'playful' | 'sleepy' | 'curious' | 'grumpy' | 'hungry';
  note?: string;
}
