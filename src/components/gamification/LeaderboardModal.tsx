import React from 'react';
import { Trophy, X, Flame, Shield, Award, Crown } from 'lucide-react';
import { Button } from '../ui/Button';
import { useVibeStore } from '../../store/useVibeStore';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({ isOpen, onClose }) => {
  const { auraPoints, rank } = useVibeStore();
  
  if (!isOpen) return null;
  
  const TIERS = [
    { name: 'Terminal Unc', range: '< 0 Aura', icon: <Shield className="h-4 w-4 text-neutral-500" />, desc: 'Outdated terminology. Severe social risk.' },
    { name: 'Casual Scroller', range: '0 - 999 Aura', icon: <Award className="h-4 w-4 text-blue-500" />, desc: 'Standard consumer of internet discourse.' },
    { name: 'Certified Trendsetter', range: '1,000 - 4,999 Aura', icon: <Flame className="h-4 w-4 text-[#FF5C00]" />, desc: 'Early adopter capable of verifying emerging slang.' },
    { name: 'Main Character', range: '5,000+ Aura', icon: <Crown className="h-4 w-4 text-yellow-500" />, desc: 'Top 1% cultural architect. Unlocks Level 5 Brainrot.' },
  ];
  
  const MOCK_LEADERS = [
    { rank: 1, handle: 'aura_god_2026', points: 14850, tier: 'Main Character' },
    { rank: 2, handle: 'skibidi_scientist', points: 9400, tier: 'Main Character' },
    { rank: 3, handle: 'mewing_champion', points: 4820, tier: 'Certified Trendsetter' },
    { rank: 4, handle: 'you', points: auraPoints, tier: rank, isCurrent: true },
    { rank: 5, handle: 'unc_alert_corp', points: -250, tier: 'Terminal Unc' },
  ];
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg border-4 border-black bg-white p-6 shadow-brutal-lg animate-in fade-in zoom-in duration-150">
        <div className="flex items-center justify-between border-b-3 border-black pb-3 select-none">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-[#FF5C00]" />
            <h3 className="font-display text-lg font-black tracking-tight text-black">
              AURA CULTURE HIERARCHY
            </h3>
          </div>
          <button
            onClick={onClose}
            className="border-2 border-black bg-neutral-100 p-1 hover:bg-neutral-200 cursor-pointer"
          >
            <X className="h-5 w-5 text-black" />
          </button>
        </div>
        
        {/* RANK TIERS MATRIX */}
        <div className="mt-4 space-y-2 text-left">
          <span className="font-mono text-xs font-black uppercase text-neutral-700 select-none">
            RANK TIERS & THRESHOLDS:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {TIERS.map((t) => (
              <div
                key={t.name}
                className={`border-2 border-black p-2.5 ${t.name === rank ? 'bg-[#E2F952] shadow-brutal-sm font-black' : 'bg-[#FAF9F5]'}`}
              >
                <div className="flex items-center gap-1.5 font-display text-xs font-black text-black">
                  {t.icon}
                  <span>{t.name}</span>
                </div>
                <span className="mt-1 block font-mono text-[10px] font-bold text-neutral-600 uppercase">
                  {t.range}
                </span>
                <p className="mt-1 font-mono text-[9px] text-neutral-500 font-medium leading-tight">
                  {t.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
        
        {/* COMMUNITY LEADERBOARD */}
        <div className="mt-5 border-2 border-black bg-[#FAF9F5] p-3 shadow-brutal-sm text-left">
          <span className="font-mono text-xs font-black uppercase text-neutral-700 select-none">
            GLOBAL LEADERBOARD:
          </span>
          <div className="mt-2 divide-y divide-black/25 font-mono text-xs">
            {MOCK_LEADERS.map((leader) => (
              <div
                key={leader.handle}
                className={`flex items-center justify-between py-1.5 ${leader.isCurrent ? 'bg-[#FCFDE8] font-black px-1.5 border-2 border-black my-1' : ''}`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-bold">#{leader.rank}</span>
                  <span>@{leader.handle}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={leader.points >= 0 ? 'text-[#10B981] font-bold' : 'text-[#EF4444] font-bold'}>
                    {leader.points >= 0 ? `+${leader.points}` : leader.points}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-6 flex justify-end border-t-2 border-black pt-4">
          <Button variant="yellow" size="sm" onClick={onClose}>
            CLOSE LEADERBOARD
          </Button>
        </div>
      </div>
    </div>
  );
};
