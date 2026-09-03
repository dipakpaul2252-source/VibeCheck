import React from 'react';
import { useVibeStore } from '../../store/useVibeStore';
import { Trophy, Zap } from 'lucide-react';

interface AuraPointsWidgetProps {
  onOpenLeaderboard: () => void;
}

export const AuraPointsWidget: React.FC<AuraPointsWidgetProps> = ({ onOpenLeaderboard }) => {
  const { auraPoints, rank } = useVibeStore();
  
  const getProgress = (points: number) => {
    if (points < 0) return 0;
    if (points < 1000) return (points / 1000) * 100;
    if (points < 5000) return ((points - 1000) / 4000) * 100;
    return 100;
  };
  
  const getNextRankLabel = (points: number) => {
    if (points < 0) return 'CASUAL SCROLLER (0)';
    if (points < 1000) return 'TRENDSETTER (1K)';
    if (points < 5000) return 'MAIN CHARACTER (5K)';
    return 'MAX RANK';
  };

  const progress = getProgress(auraPoints);
  
  return (
    <div 
      onClick={onOpenLeaderboard}
      className="flex cursor-pointer select-none flex-col items-stretch gap-3 rounded-xl border border-[var(--line)] bg-[var(--surface)] p-2.5 shadow-[3px_4px_0_rgba(23,23,23,.08)] transition-transform hover:-translate-y-0.5 md:flex-row md:items-center"
    >
      {/* Points Badge */}
      <div className="flex items-center gap-2 border-2 border-black bg-[#E2F952] px-3 py-1 text-black font-mono shadow-brutal-sm">
        <Zap className="h-4.5 w-4.5 fill-black" />
        <span className="font-black text-sm md:text-base tracking-tight">
          {auraPoints >= 0 ? `+${auraPoints}` : auraPoints} AURA
        </span>
      </div>
      
      {/* Rank & progress bar */}
      <div className="flex-1 min-w-[140px] text-left">
        <div className="flex items-center justify-between font-mono text-[9px] font-black text-black mb-1 uppercase">
          <span>RANK: {rank}</span>
          <span className="text-neutral-500">NEXT: {getNextRankLabel(auraPoints)}</span>
        </div>
        <div className="relative h-3 w-full border-2 border-black bg-neutral-100 overflow-hidden shadow-brutal-sm">
          <div 
            className="h-full bg-[#C084FC] border-r border-black transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      
      {/* Leaderboard button */}
      <button 
        type="button"
        className="flex items-center justify-center border-2 border-black bg-white hover:bg-neutral-50 p-2 shadow-brutal-sm"
        title="Open leaderboards"
      >
        <Trophy className="h-4 w-4 text-[#FF5C00]" />
      </button>
    </div>
  );
};
