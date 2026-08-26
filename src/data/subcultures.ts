import type { SubcultureType } from '../types';

export interface SubcultureConfig {
  id: SubcultureType;
  name: string;
  badgeColor: string;
  description: string;
  affixes: {
    prefixes: string[];
    suffixes: string[];
  };
}

export const SUBCULTURES: Record<SubcultureType, SubcultureConfig> = {
  universal: {
    id: 'universal',
    name: 'Universal Gen Z',
    badgeColor: '#E2F952',
    description: 'Mainstream social vernacular, TikTok trends, and everyday brainrot.',
    affixes: {
      prefixes: ['bro really thought', 'lowkey', 'not gonna lie', 'real talk'],
      suffixes: ['no cap fr', 'deadass', 'it is what it is', 'straight facts']
    }
  },
  tech_twitter: {
    id: 'tech_twitter',
    name: 'Tech Twitter / X',
    badgeColor: '#00F0FF',
    description: 'Silicon Valley hyper-scaling, AI agents, founder grindset, and vibe coding.',
    affixes: {
      prefixes: ['according to first principles', 'shipping this fast,', 'AI agent vibe check:'],
      suffixes: ['building in public fr', 'huge TAM opportunity', 'infinite scale achieved']
    }
  },
  twitch: {
    id: 'twitch',
    name: 'Twitch & Gaming',
    badgeColor: '#C084FC',
    description: 'Chat emotes, tournament cliches, speedrunning culture, and stream yapping.',
    affixes: {
      prefixes: ['chat is this real?', 'W in the chat,', 'bro got ganked:'],
      suffixes: ['L + ratio', 'clip that immediately', 'pure copium intake']
    }
  },
  gym: {
    id: 'gym',
    name: 'Gym & Looksmaxxing',
    badgeColor: '#FF5C00',
    description: 'Jawline maintenance, mogging hierarchies, hypertrophy, and sigma discipline.',
    affixes: {
      prefixes: ['holding the mewing posture,', 'mid-set realization:', 'certified mogger:'],
      suffixes: ['maintaining calorie deficit', 'insane shoulder-to-waist ratio', 'never break the streak']
    }
  },
  stan: {
    id: 'stan',
    name: 'Stan Culture & K-Pop',
    badgeColor: '#10B981',
    description: 'Fandom defense, streaming goals, aesthetic edits, and delightful delusions.',
    affixes: {
      prefixes: ['manifesting this so hard,', 'bestie wake up:', 'my Roman empire:'],
      suffixes: ['delulu is the solulu', 'ate and left zero crumbs', 'ended all careers effortlessly']
    }
  }
};
