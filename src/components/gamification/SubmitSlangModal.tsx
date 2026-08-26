import React, { useState } from 'react';
import { PlusCircle, X, Sparkles, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { useVibeStore } from '../../store/useVibeStore';


interface SubmitSlangModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SubmitSlangModal: React.FC<SubmitSlangModalProps> = ({ isOpen, onClose }) => {
  const { rank, submitSlangCard } = useVibeStore();
  const [term, setTerm] = useState('');
  const [context, setContext] = useState('');
  const [proposedMeaning, setProposedMeaning] = useState('');
  const [error, setError] = useState('');
  
  if (!isOpen) return null;
  
  // Rank gating: Only 'Certified Trendsetter' or 'Main Character' can submit
  const isEligible = rank === 'Certified Trendsetter' || rank === 'Main Character';
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEligible) {
      setError('You need at least 1,000 Aura (Certified Trendsetter) to propose new slang.');
      return;
    }
    if (!term.trim() || !proposedMeaning.trim()) {
      setError('Please fill in both the slang term and proposed meaning.');
      return;
    }
    
    submitSlangCard({
      id: `user-${Date.now()}`,
      phrase: term.trim(),
      context: context.trim() || 'Spotted in recent social discourse.',
      proposedMeaning: proposedMeaning.trim(),
      author: 'you',
      upvotes: 1,
      downvotes: 0
    });
    
    // Clear inputs and close
    setTerm('');
    setContext('');
    setProposedMeaning('');
    setError('');
    onClose();
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg border-4 border-black bg-white p-6 shadow-brutal-lg animate-in fade-in zoom-in duration-150 text-left">
        <div className="flex items-center justify-between border-b-3 border-black pb-3 select-none">
          <div className="flex items-center gap-2">
            <PlusCircle className="h-5 w-5 text-[#10B981]" />
            <h3 className="font-display text-lg font-black tracking-tight text-black uppercase">
              SUBMIT NEW SLANG TO COMMUNITY
            </h3>
          </div>
          <button
            onClick={onClose}
            className="border-2 border-black bg-neutral-100 p-1 hover:bg-neutral-200 cursor-pointer"
          >
            <X className="h-5 w-5 text-black" />
          </button>
        </div>
        
        {!isEligible ? (
          <div className="mt-4 border-2 border-black bg-[#FAF9F5] p-5 text-center">
            <AlertCircle className="mx-auto h-8 w-8 text-[#FF5C00] animate-bounce" />
            <h4 className="mt-2 font-display text-sm font-black text-black">
              RANK INSUFFICIENT
            </h4>
            <p className="mt-1 font-mono text-xs text-neutral-600">
              Only <strong>Certified Trendsetters (1,000+ Aura)</strong> have authorization to submit new slang. Vote on existing cards to earn Aura points!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            {error && (
              <div className="border border-black bg-red-100 p-2 font-mono text-xs font-bold text-red-600">
                {error}
              </div>
            )}
            
            <div>
              <label className="block font-mono text-xs font-black uppercase text-neutral-700">
                SLANG TERM / PHRASE *
              </label>
              <input
                type="text"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                placeholder="e.g. crashout, lock in, aura deficit"
                className="mt-1 w-full border-2 border-black p-2 font-mono text-sm focus:bg-[#FCFDE8] focus:outline-none"
                required
              />
            </div>
            
            <div>
              <label className="block font-mono text-xs font-black uppercase text-neutral-700">
                WHERE DID YOU SEE IT? (CONTEXT)
              </label>
              <input
                type="text"
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="e.g. Top comment under Kai Cenat stream clip"
                className="mt-1 w-full border-2 border-black p-2 font-mono text-sm focus:bg-[#FCFDE8] focus:outline-none"
              />
            </div>
            
            <div>
              <label className="block font-mono text-xs font-black uppercase text-neutral-700">
                PROPOSED DEFINITION & NUANCE *
              </label>
              <textarea
                value={proposedMeaning}
                onChange={(e) => setProposedMeaning(e.target.value)}
                placeholder="Explain what it means and how it is used..."
                rows={3}
                className="mt-1 w-full resize-none border-2 border-black p-2 font-mono text-sm focus:bg-[#FCFDE8] focus:outline-none"
                required
              />
            </div>
            
            <div className="border-t-2 border-black pt-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] font-bold text-neutral-500">
                  REWARD: +200 AURA IF APPROVED
                </span>
                <Button variant="emerald" size="sm" type="submit" leftIcon={<Sparkles className="h-4 w-4" />}>
                  SUBMIT (+50 AURA)
                </Button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
export default SubmitSlangModal;
