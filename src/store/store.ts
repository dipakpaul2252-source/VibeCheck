import { create } from 'zustand';
import type { UserAuraProfile, VerdictCard, TranslationResult, UserRank } from '../types';
import { playClick, playVoteValid, playVoteCooked, playRankUp, playRankDown, playSuccess } from '../utils/audio';

interface AppState {
  profile: UserAuraProfile;
  verdicts: VerdictCard[];
  toggleSound: () => void;
  addTranslation: (result: TranslationResult) => void;
  voteVerdict: (id: string, vote: 'valid' | 'cooked') => void;
  submitVerdict: (phrase: string, context: string, proposedMeaning: string, author: string) => boolean;
  clearHistory: () => void;
}

const initialVerdicts: VerdictCard[] = [
  {
    id: '1',
    phrase: 'Unspoken Rizz',
    context: 'He didn\'t say a single word, just looked at her, and she gave him her number.',
    proposedMeaning: 'Having an innate magnetic charm that requires zero verbal communication.',
    author: '@swagmaster_99',
    upvotes: 245,
    downvotes: 18,
  },
  {
    id: '2',
    phrase: 'Corporate Glazing',
    context: 'Gary brought our manager home-baked cookies and organized his desk drawer.',
    proposedMeaning: 'Performative flattery towards leadership to secure professional advantages.',
    author: '@corporate_cynic',
    upvotes: 189,
    downvotes: 4,
  },
  {
    id: '3',
    phrase: 'Skibidi Standup',
    context: 'The Monday morning project alignment call was extremely skibidi.',
    proposedMeaning: 'A highly chaotic, unorganized, or confusing status meeting.',
    author: '@brainrot_analyst',
    upvotes: 32,
    downvotes: 145,
  },
  {
    id: '4',
    phrase: 'Sigma Deliverables',
    context: 'He didn\'t attend any planning sessions but shipped the entire feature overnight.',
    proposedMeaning: 'High-quality software shipped by an engineer working in total isolation.',
    author: '@rust_coder',
    upvotes: 156,
    downvotes: 22,
  },
  {
    id: '5',
    phrase: 'Aura Deficit',
    context: 'I tripped on the carpet during my client presentation and dropped my coffee.',
    proposedMeaning: 'A sudden, embarrassing loss of social credibility or dignity.',
    author: '@slide_master',
    upvotes: 310,
    downvotes: 8,
  }
];

const determineRank = (points: number): UserRank => {
  if (points < 1000) return 'Terminal Unc';
  if (points < 1500) return 'Casual Scroller';
  if (points < 2000) return 'Certified Trendsetter';
  return 'Main Character';
};

export const useStore = create<AppState>((set, get) => ({
  profile: {
    points: 1250,
    rank: 'Casual Scroller',
    consecutiveValidVotes: 0,
    soundEnabled: true,
    history: [],
  },
  verdicts: initialVerdicts,

  toggleSound: () => {
    const nextVal = !get().profile.soundEnabled;
    set((state) => ({
      profile: { ...state.profile, soundEnabled: nextVal },
    }));
    // Play a click confirmation on the new state
    playClick(nextVal);
  },

  addTranslation: (result: TranslationResult) => {
    const { profile } = get();
    const oldRank = profile.rank;
    
    // Translating gives +10 Aura
    const nextPoints = profile.points + 10;
    const nextRank = determineRank(nextPoints);
    
    // Add to history, keeping max 15 entries
    const nextHistory = [result, ...profile.history].slice(0, 15);

    set((state) => ({
      profile: {
        ...state.profile,
        points: nextPoints,
        rank: nextRank,
        history: nextHistory,
      },
    }));

    // Play sounds
    if (nextRank !== oldRank) {
      if (nextPoints > profile.points) {
        playRankUp(profile.soundEnabled);
      } else {
        playRankDown(profile.soundEnabled);
      }
    } else {
      playSuccess(profile.soundEnabled);
    }
  },

  voteVerdict: (id: string, vote: 'valid' | 'cooked') => {
    const { profile, verdicts } = get();
    const card = verdicts.find((v) => v.id === id);
    if (!card || card.userVote) return; // Can only vote once

    // Play feedback sound
    if (vote === 'valid') {
      playVoteValid(profile.soundEnabled);
    } else {
      playVoteCooked(profile.soundEnabled);
    }

    // Determine community alignment:
    // Community opinion is 'valid' if upvotes >= downvotes, otherwise 'cooked'
    const communityOpinion = card.upvotes >= card.downvotes ? 'valid' : 'cooked';
    const isAligned = vote === communityOpinion;

    // Aura update:
    // Base vote reward: +15 Aura
    // Streak reward: +50 Aura on 3 consecutive aligned votes
    let voteReward = 15;
    let nextStreak = profile.consecutiveValidVotes;

    if (isAligned) {
      nextStreak += 1;
      if (nextStreak === 3) {
        voteReward += 50; // Streak bonus!
        nextStreak = 0; // Reset streak
        setTimeout(() => playRankUp(profile.soundEnabled), 200); // Play bonus sound
      }
    } else {
      nextStreak = 0; // Broken streak
    }

    const nextPoints = profile.points + voteReward;
    const nextRank = determineRank(nextPoints);
    const oldRank = profile.rank;

    // Update the card's votes
    const updatedVerdicts = verdicts.map((v) => {
      if (v.id === id) {
        return {
          ...v,
          userVote: vote,
          upvotes: vote === 'valid' ? v.upvotes + 1 : v.upvotes,
          downvotes: vote === 'cooked' ? v.downvotes + 1 : v.downvotes,
        };
      }
      return v;
    });

    set((state) => ({
      verdicts: updatedVerdicts,
      profile: {
        ...state.profile,
        points: nextPoints,
        rank: nextRank,
        consecutiveValidVotes: nextStreak,
      },
    }));

    if (nextRank !== oldRank) {
      if (nextPoints > profile.points) {
        playRankUp(profile.soundEnabled);
      } else {
        playRankDown(profile.soundEnabled);
      }
    }
  },

  submitVerdict: (phrase: string, context: string, proposedMeaning: string, author: string) => {
    const { profile } = get();
    
    // Submitting a card costs 50 Aura!
    if (profile.points < 100) {
      playRankDown(profile.soundEnabled);
      return false; // Not enough aura
    }

    playSuccess(profile.soundEnabled);

    const newCard: VerdictCard = {
      id: Math.random().toString(36).substring(2, 9),
      phrase,
      context,
      proposedMeaning,
      author: author.startsWith('@') ? author : `@${author}`,
      upvotes: 1, // Author's vote
      downvotes: 0,
    };

    const nextPoints = profile.points - 50;
    const nextRank = determineRank(nextPoints);
    const oldRank = profile.rank;

    set((state) => ({
      verdicts: [newCard, ...state.verdicts],
      profile: {
        ...state.profile,
        points: nextPoints,
        rank: nextRank,
      },
    }));

    if (nextRank !== oldRank) {
      playRankDown(profile.soundEnabled); // Cost lowered their rank
    }

    return true;
  },

  clearHistory: () => {
    playClick(get().profile.soundEnabled);
    set((state) => ({
      profile: {
        ...state.profile,
        history: [],
      },
    }));
  }
}));
