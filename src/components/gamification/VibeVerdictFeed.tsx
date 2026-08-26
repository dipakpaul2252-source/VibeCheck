import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, Flame, Sparkles } from 'lucide-react';
import { useVibeStore } from '../../store/useVibeStore';
import { Button } from '../ui/Button';

export const VibeVerdictFeed: React.FC = () => {
  const { verdicts, votedVerdictIds, voteVerdict } = useVibeStore();
  const [floatingAura, setFloatingAura] = useState<{ id: number; text: string; color: string } | null>(null);
  
  const availableCards = verdicts.filter((card) => !votedVerdictIds.includes(card.id));
  const activeCard = availableCards[0];
  
  const handleVote = (vote: 'valid' | 'cooked') => {
    if (!activeCard) return;
    const deltaText = vote === 'valid' ? '+50 AURA 🔥' : '-50 AURA 💀';
    const color = vote === 'valid' ? 'text-[#10B981]' : 'text-[#EF4444]';
    
    setFloatingAura({ id: Date.now(), text: deltaText, color });
    voteVerdict(activeCard.id, vote);
    
    setTimeout(() => {
      setFloatingAura(null);
    }, 900);
  };
  
  return (
    <div className="relative border-3 border-black bg-white p-5 shadow-brutal flex flex-col justify-between min-h-[300px]">
      {/* Floating Animated Aura Counter Notification */}
      {floatingAura && (
        <div 
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none font-mono text-2xl font-black ${floatingAura.color} animate-bounce`}
        >
          {floatingAura.text}
        </div>
      )}
      
      <div>
        <div className="flex items-center justify-between border-b-2 border-black pb-3 select-none">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center border-2 border-black bg-[#C084FC] p-1 shadow-brutal-sm text-black">
              <Sparkles className="h-4 w-4" />
            </div>
            <h3 className="font-display font-black text-black">VIBE-VERDICT CROWD VALIDATION</h3>
          </div>
          <span className="border-2 border-black bg-[#FAF9F5] px-2.5 py-0.5 font-mono text-xs font-black shadow-brutal-sm text-black">
            {availableCards.length} CARDS LEFT
          </span>
        </div>
        
        {activeCard ? (
          <div className="mt-4 border-3 border-black bg-[#FAF9F5] p-4 shadow-brutal text-left">
            <div className="flex items-center justify-between border-b border-black pb-2 select-none">
              <span className="font-mono text-xs font-bold text-neutral-500">
                POSTED BY @{activeCard.author}
              </span>
              <div className="flex items-center gap-2 font-mono text-xs font-bold">
                <span className="text-[#10B981]">+{activeCard.upvotes}</span>
                <span>/</span>
                <span className="text-[#EF4444]">-{activeCard.downvotes}</span>
              </div>
            </div>
            <div className="mt-3">
              <h4 className="font-display text-base font-black text-black leading-tight">
                "{activeCard.phrase}"
              </h4>
              <p className="mt-2 font-mono text-xs text-neutral-700">
                <strong>Context:</strong> {activeCard.context}
              </p>
            </div>
            <div className="mt-3 border-t border-dashed border-black pt-2">
              <span className="font-mono text-[10px] font-bold text-neutral-500 uppercase select-none">
                PROPOSED MEANING:
              </span>
              <p className="font-mono text-xs font-medium text-black">
                {activeCard.proposedMeaning}
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-4 flex flex-col items-center justify-center border-3 border-dashed border-black bg-[#FCFDE8] p-8 text-center select-none">
            <Flame className="h-8 w-8 text-[#FF5C00] animate-pulse" />
            <h4 className="mt-2 font-display text-base font-black text-black">
              ALL VIBES VERIFIED FOR TODAY!
            </h4>
            <p className="mt-1 font-mono text-xs text-neutral-600">
              You've cleared the verification deck and claimed maximum Aura.
            </p>
          </div>
        )}
      </div>
      
      {activeCard && (
        <div className="mt-4 grid grid-cols-2 gap-3 pt-3 border-t-2 border-black">
          <Button
            variant="crimson"
            size="md"
            onClick={() => handleVote('cooked')}
            leftIcon={<ThumbsDown className="h-4 w-4" />}
          >
            COOKED (-50)
          </Button>
          <Button
            variant="emerald"
            size="md"
            onClick={() => handleVote('valid')}
            leftIcon={<ThumbsUp className="h-4 w-4" />}
          >
            VALID (+50)
          </Button>
        </div>
      )}
    </div>
  );
};
