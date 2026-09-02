import React, { useState } from 'react';
import type { TranslationResult } from '../../types';
import { Button } from '../ui/Button';
import { X, Share2, Sparkles, Check } from 'lucide-react';
import { soundEngine } from '../../lib/audioEffects';

interface ShareCardModalProps {
  result: TranslationResult | null;
  onClose: () => void;
}

export const ShareCardModal: React.FC<ShareCardModalProps> = ({ result, onClose }) => {
  const [copied, setCopied] = useState(false);
  if (!result) return null;
  
  const handleExport = () => {
    const cardText = `⚡ VIBECHECK // LVL ${result.intensity} BRAINROT\nOriginal: "${result.originalText}"\nTranslation: "${result.translatedText}"\nCringe Score: ${result.cringeScore}%\nPowered by VibeCheck.ai`;
    navigator.clipboard.writeText(cardText);
    soundEngine.playAuraChime();
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg border-4 border-black bg-white p-6 shadow-brutal-lg animate-in fade-in zoom-in duration-150">
        <div className="flex items-center justify-between border-b-3 border-black pb-3">
          <div className="flex items-center gap-2 select-none">
            <Sparkles className="h-5 w-5 text-[#FF5C00]" />
            <h3 className="font-display text-lg font-black tracking-tight text-black">
              SHARE VIBE CARD
            </h3>
          </div>
          <button
            onClick={onClose}
            className="border-2 border-black bg-neutral-100 p-1 hover:bg-neutral-200 cursor-pointer"
          >
            <X className="h-5 w-5 text-black" />
          </button>
        </div>
        
        {/* THE CARD PREVIEW */}
        <div className="mt-6 border-3 border-black bg-[#E2F952] p-6 shadow-brutal text-left">
          <div className="flex items-center justify-between border-b-2 border-black pb-2 select-none">
            <span className="font-mono text-xs font-black uppercase text-black">
              VIBECHECK // TRANSLATION CARD
            </span>
            <span className="border border-black bg-white px-2 py-0.5 font-mono text-[10px] font-black text-black">
              LVL {result.intensity} BRAINROT
            </span>
          </div>
          
          <div className="mt-4">
            <span className="font-mono text-[10px] font-bold text-neutral-700 uppercase select-none">
              ORIGINAL:
            </span>
            <p className="font-mono text-xs font-medium text-black">"{result.originalText}"</p>
          </div>
          
          <div className="mt-4 border-t-2 border-dashed border-black pt-3">
            <span className="font-mono text-[10px] font-bold text-neutral-700 uppercase select-none">
              TRANSLATED:
            </span>
            <p className="font-display text-base font-black text-black leading-tight">
              "{result.translatedText}"
            </p>
          </div>
          
          <div className="mt-4 flex items-center justify-between border-t-2 border-black pt-2 font-mono text-[10px] font-bold text-black select-none">
            <span>CRINGE SCORE: {result.cringeScore}%</span>
            <span>POWERED BY VIBECHECK.AI</span>
          </div>
        </div>
        
        <div className="mt-6 flex items-center justify-end gap-3 border-t-2 border-black pt-4">
          <Button variant="white" size="sm" onClick={onClose}>
            CLOSE
          </Button>
          <Button
            variant={copied ? "emerald" : "coral"}
            size="sm"
            onClick={handleExport}
            leftIcon={copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
          >
            {copied ? "COPIED TO CLIPBOARD!" : "EXPORT CARD"}
          </Button>
        </div>
      </div>
    </div>
  );
};

