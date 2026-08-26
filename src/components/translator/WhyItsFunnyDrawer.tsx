import React from 'react';
import { X, HelpCircle, ShieldAlert, ShieldCheck, AlertTriangle, Layers, BookOpen } from 'lucide-react';
import type { TranslationResult } from '../../types';
import { Button } from '../ui/Button';

interface WhyItsFunnyDrawerProps {
  isOpen: boolean;
  result: TranslationResult | null;
  onClose: () => void;
}

export const WhyItsFunnyDrawer: React.FC<WhyItsFunnyDrawerProps> = ({ isOpen, result, onClose }) => {
  if (!isOpen || !result) return null;
  const { whyItsFunny, detectedTerms } = result;
  
  const safetyBadgeColors = {
    'Safe for Work': 'bg-[#10B981] text-white',
    'Casual Only': 'bg-[#E2F952] text-black',
    'Instant HR Meeting': 'bg-[#EF4444] text-white'
  };
  
  const safetyIcons = {
    'Safe for Work': <ShieldCheck className="w-4 h-4" />,
    'Casual Only': <AlertTriangle className="w-4 h-4 text-black" />,
    'Instant HR Meeting': <ShieldAlert className="w-4 h-4 text-white" />
  };
  
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md border-l-4 border-black bg-white p-6 shadow-brutal-lg flex flex-col justify-between animate-in slide-in-from-right duration-200">
        <div>
          <div className="flex items-center justify-between border-b-3 border-black pb-3 select-none">
            <div className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-[#00F0FF]" />
              <h3 className="font-display text-lg font-black text-black uppercase">
                HUMOR & IRONY ANATOMY
              </h3>
            </div>
            <button
              onClick={onClose}
              className="border-2 border-black bg-neutral-100 p-1 hover:bg-neutral-200 cursor-pointer"
            >
              <X className="h-5 w-5 text-black" />
            </button>
          </div>
          
          {/* SAFETY STATUS BADGE */}
          <div className="mt-4 flex items-center justify-between border-2 border-black bg-[#FAF9F5] p-3 shadow-brutal-sm text-left">
            <span className="font-mono text-xs font-black uppercase text-neutral-700 select-none">
              WORKPLACE SAFETY CLEARANCE:
            </span>
            <div className={`flex items-center gap-1.5 border border-black px-2.5 py-0.5 font-mono text-xs font-black ${
              safetyBadgeColors[whyItsFunny.safetyRating]
            }`}>
              {safetyIcons[whyItsFunny.safetyRating]}
              <span>{whyItsFunny.safetyRating.toUpperCase()}</span>
            </div>
          </div>
          
          {/* CULTURAL ETYMOLOGY BREAKDOWN */}
          <div className="mt-4 border-2 border-black bg-[#FAF9F5] p-4 shadow-brutal-sm text-left">
            <div className="flex items-center gap-1.5 font-mono text-xs font-black text-black mb-2">
              <BookOpen className="h-4 w-4 text-[#FF5C00]" />
              <span>SUBTEXT & ETYMOLOGY:</span>
            </div>
            <p className="font-mono text-xs text-neutral-800 leading-relaxed font-medium">
              {whyItsFunny.breakdown}
            </p>
          </div>
          
          {/* IRONY MECHANICS */}
          <div className="mt-4 border-2 border-black bg-[#FCFDE8] p-4 shadow-brutal-sm text-left">
            <div className="flex items-center gap-1.5 font-mono text-xs font-black text-black mb-2">
              <Layers className="h-4 w-4 text-[#C084FC]" />
              <span>IRONY LAYER BREAKDOWN:</span>
            </div>
            <p className="font-mono text-xs text-neutral-800 leading-relaxed font-medium">
              {whyItsFunny.ironyLayer}
            </p>
          </div>
          
          {/* DETECTED SLANG SUMMARY */}
          <div className="mt-4 space-y-2 text-left">
            <span className="font-mono text-xs font-black uppercase text-neutral-700 select-none">
              ANCHOR SLANG TERMS DETECTED:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {detectedTerms.length === 0 ? (
                <span className="font-mono text-xs text-neutral-500">None detected.</span>
              ) : (
                detectedTerms.map((t) => (
                  <span
                    key={t.id}
                    className="border border-black bg-[#E2F952] px-2 py-0.5 font-mono text-xs font-black shadow-brutal-sm text-black"
                  >
                    #{t.term} ({t.cringeScore}% Cringe)
                  </span>
                ))
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end border-t-2 border-black pt-4">
          <Button variant="yellow" size="sm" onClick={onClose}>
            CLOSE ANATOMY
          </Button>
        </div>
      </div>
    </div>
  );
};
export default WhyItsFunnyDrawer;
