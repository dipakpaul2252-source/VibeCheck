import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserRank, TranslationResult, VerdictCard, SlangTerm } from '../types';
import { INITIAL_VERDICTS } from '../data/mockVerdicts';
import { soundEngine } from '../lib/audioEffects';

interface VibeState {
  auraPoints: number;
  rank: UserRank;
  soundEnabled: boolean;
  history: TranslationResult[];
  verdicts: VerdictCard[];
  votedVerdictIds: string[];
  approvedSlangTerms: SlangTerm[];
  // Actions
  addAura: (amount: number) => void;
  deductAura: (amount: number) => void;
  toggleSound: () => void;
  addToHistory: (result: TranslationResult) => void;
  addTranslation: (result: TranslationResult) => void; // Backward compatible alias
  clearHistory: () => void;
  submitSlangCard: (card: VerdictCard) => void;
  submitVerdict: (phrase: string, context: string, proposedMeaning: string, author: string) => boolean; // Backward compatible alias
  voteVerdict: (cardId: string, vote: 'valid' | 'cooked') => void;
}

export function calculateRank(points: number): UserRank {
  if (points < 0) return 'Terminal Unc';
  if (points < 1000) return 'Casual Scroller';
  if (points < 5000) return 'Certified Trendsetter';
  return 'Main Character';
}

export const useVibeStore = create<VibeState>()(
  persist(
    (set, get) => ({
      auraPoints: 1250,
      rank: 'Certified Trendsetter',
      soundEnabled: true,
      history: [],
      verdicts: INITIAL_VERDICTS,
      votedVerdictIds: [],
      approvedSlangTerms: [],

      addAura: (amount: number) => {
        const nextPoints = get().auraPoints + amount;
        set({ auraPoints: nextPoints, rank: calculateRank(nextPoints) });
        soundEngine.playAuraChime();
      },

      deductAura: (amount: number) => {
        const nextPoints = get().auraPoints - amount;
        set({ auraPoints: nextPoints, rank: calculateRank(nextPoints) });
        soundEngine.playCringeAlert();
      },

      toggleSound: () => {
        const next = !get().soundEnabled;
        soundEngine.setMuted(!next);
        set({ soundEnabled: next });
        if (next) soundEngine.playClick();
      },

      addToHistory: (result: TranslationResult) => {
        set({ history: [result, ...get().history.slice(0, 24)] });
      },

      addTranslation: (result: TranslationResult) => {
        const nextPoints = get().auraPoints + 10;
        set({
          auraPoints: nextPoints,
          rank: calculateRank(nextPoints),
          history: [result, ...get().history.slice(0, 24)]
        });
        soundEngine.playAuraChime();
      },

      clearHistory: () => {
        set({ history: [] });
      },

      submitSlangCard: (card: VerdictCard) => {
        const { verdicts, auraPoints } = get();
        set({
          verdicts: [card, ...verdicts],
          auraPoints: auraPoints + 50,
          rank: calculateRank(auraPoints + 50)
        });
        soundEngine.playAuraChime();
      },

      submitVerdict: (phrase: string, context: string, proposedMeaning: string, author: string) => {
        const { auraPoints } = get();
        if (auraPoints < 100) {
          soundEngine.playCringeAlert();
          return false;
        }
        
        const newCard: VerdictCard = {
          id: `user-${Math.random().toString(36).substring(2, 9)}`,
          phrase,
          context,
          proposedMeaning,
          author: author.startsWith('@') ? author : `@${author}`,
          upvotes: 1,
          downvotes: 0
        };
        
        const nextPoints = auraPoints - 50;
        set({
          verdicts: [newCard, ...get().verdicts],
          auraPoints: nextPoints,
          rank: calculateRank(nextPoints)
        });
        soundEngine.playSwap();
        return true;
      },

      voteVerdict: (cardId: string, vote: 'valid' | 'cooked') => {
        const { votedVerdictIds, verdicts, auraPoints, approvedSlangTerms } = get();
        if (votedVerdictIds.includes(cardId)) return;
        
        let promotedTerm: SlangTerm | null = null;
        
        const updatedVerdicts = verdicts.map((v) => {
          if (v.id === cardId) {
            const up = vote === 'valid' ? v.upvotes + 1 : v.upvotes;
            const down = vote === 'cooked' ? v.downvotes + 1 : v.downvotes;
            const totalVotes = up + down;
            
            // CONSENSUS LOGIC: If total votes >= 5 and approval rate >= 70%, promote to live dictionary
            if (totalVotes >= 5 && (up / totalVotes) >= 0.70) {
              const alreadyPromoted = approvedSlangTerms.some(
                (t) => t.term.toLowerCase() === v.phrase.toLowerCase()
              );
              if (!alreadyPromoted) {
                promotedTerm = {
                  id: `promoted-${Date.now()}`,
                  term: v.phrase,
                  subculture: 'universal',
                  meaning: v.proposedMeaning,
                  origin: `Crowdsourced via Vibe-Verdict (@${v.author})`,
                  cringeScore: 20,
                  lifecycle: 'Peak Viral',
                  exampleSentence: v.context,
                  velocityChange: '+100%'
                };
              }
            }
            return { ...v, upvotes: up, downvotes: down, userVote: vote };
          }
          return v;
        });
        
        const auraDelta = vote === 'valid' ? 50 : -50;
        const nextPoints = auraPoints + auraDelta;
        
        if (vote === 'valid') {
          soundEngine.playAuraChime();
        } else {
          soundEngine.playCringeAlert();
        }
        
        set({
          verdicts: updatedVerdicts,
          votedVerdictIds: [...votedVerdictIds, cardId],
          auraPoints: nextPoints,
          rank: calculateRank(nextPoints),
          approvedSlangTerms: promotedTerm ? [promotedTerm, ...approvedSlangTerms] : approvedSlangTerms
        });
      }
    }),
    {
      name: 'vibecheck-store-v2',
      partialize: (state) => ({
        auraPoints: state.auraPoints,
        rank: state.rank,
        soundEnabled: state.soundEnabled,
        history: state.history,
        votedVerdictIds: state.votedVerdictIds,
        approvedSlangTerms: state.approvedSlangTerms,
        verdicts: state.verdicts
      })
    }
  )
);
