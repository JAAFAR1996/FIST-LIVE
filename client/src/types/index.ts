export type DifficultyLevel = 'easy' | 'medium' | 'hard' | 'expert';
export type ThemeOption = 'light' | 'dark' | 'neon-ocean' | 'pastel';

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  category: string;
  specs: string;
  isNew?: boolean;
  isBestSeller?: boolean;
  
  // Phase 0 Updates
  difficulty?: DifficultyLevel;
  ecoFriendly?: boolean;
  videoUrl?: string;
  explodedViewParts?: { name: string; image: string }[];
  bundleProducts?: string[]; // IDs of products in bundle
}

export interface FishFinderResult {
  tankSize: string;
  experienceLevel: string;
  fishType: string;
  recommendedProducts: Product[];
}
