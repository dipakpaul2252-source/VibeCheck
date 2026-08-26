export type BrainrotLevel = 1 | 2 | 3 | 4 | 5;

export type TranslationDirection = 'to_genz' | 'to_corporate';

export type LifecycleStatus = 'Emerging' | 'Peak Viral' | 'Brand-Adopted' | 'Deceased' | 'Fatal Cringe';

export type SubcultureType = 'universal' | 'twitch' | 'stan' | 'gym' | 'tech_twitter';

export type UserRank = 'Terminal Unc' | 'Casual Scroller' | 'Certified Trendsetter' | 'Main Character';

export interface SlangTerm {
  id: string;
  term: string;
  subculture: SubcultureType;
  meaning: string;
  origin: string;
  cringeScore: number; // 0 to 100
  lifecycle: LifecycleStatus;
  exampleSentence: string;
  velocityChange: string; // e.g. "+84%"
}

export interface TranslationResult {
  originalText: string;
  translatedText: string;
  intensity: BrainrotLevel;
  direction: TranslationDirection;
  cringeScore: number;
  detectedTerms: SlangTerm[];
  timestamp: number;
  whyItsFunny: {
    breakdown: string;
    ironyLayer: string;
    safetyRating: 'Safe for Work' | 'Casual Only' | 'Instant HR Meeting';
  };
}

export interface VerdictCard {
  id: string;
  phrase: string;
  context: string;
  proposedMeaning: string;
  author: string;
  upvotes: number;
  downvotes: number;
  userVote?: 'valid' | 'cooked';
}

export interface UserAuraProfile {
  points: number;
  rank: UserRank;
  consecutiveValidVotes: number;
  soundEnabled: boolean;
  history: TranslationResult[];
}
