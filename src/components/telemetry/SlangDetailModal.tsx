import React from 'react';
import type { SlangTerm } from '../../types';
import { Button } from '../ui/Button';
import { X, BookOpen, Clock, Flame } from 'lucide-react';

interface SlangDetailModalProps {
  term: SlangTerm | null;
  onClose: () => void;
}

export const SlangDetailModal: React.FC<SlangDetailModalProps> = ({ term, onClose }) => {
  if (!term) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md border-4 border-black bg-white p-6 shadow-brutal-lg animate-in fade-in zoom-in duration-150">
        <div className="flex items-center justify-between border-b-3 border-black pb-3">
          <div className="flex items-center gap-2 select-none">
            <BookOpen className="h-5 w-5 text-[#FF5C00]" />
            <h3 className="font-display text-lg font-black tracking-tight text-black uppercase">
              SLANG ETYMOLOGY FILE
            </h3>
          </div>
          <button
            onClick={onClose}
            className="border-2 border-black bg-neutral-100 p-1 hover:bg-neutral-200 cursor-pointer"
          >
            <X className="h-5 w-5 text-black" />
          </button>
        </div>
        
        {/* TERM BANNER */}
        <div className="mt-4 border-3 border-black bg-[#E2F952] p-4 shadow-brutal text-left">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl font-black text-black uppercase">
              #{term.term}
            </h2>
            <span className="border border-black bg-white px-2 py-0.5 font-mono text-xs font-black text-black">
              {term.subculture.toUpperCase()}
            </span>
          </div>
          <p className="mt-2 font-mono text-xs text-neutral-800 leading-relaxed font-bold">
            "{term.meaning}"
          </p>
        </div>
        
        {/* STATS MATRIX */}
        <div className="mt-4 grid grid-cols-2 gap-3 font-mono text-xs text-left">
          <div className="border-2 border-black bg-[#FAF9F5] p-2.5">
            <div className="flex items-center gap-1 font-bold text-neutral-500">
              <Clock className="w-3.5 h-3.5 text-black" />
              <span>ORIGIN & DATE:</span>
            </div>
            <p className="mt-1 font-black text-black">{term.origin}</p>
          </div>
          <div className="border-2 border-black bg-[#FAF9F5] p-2.5">
            <div className="flex items-center gap-1 font-bold text-neutral-500">
              <Flame className="w-3.5 h-3.5 text-[#FF5C00]" />
              <span>CRINGE INDEX:</span>
            </div>
            <p className="mt-1 font-black text-black">{term.cringeScore} / 100</p>
          </div>
        </div>
        
        {/* USAGE EXAMPLE */}
        <div className="mt-4 border-2 border-black bg-white p-3 shadow-brutal-sm text-left">
          <span className="font-mono text-[10px] font-bold text-neutral-500 uppercase">
            FIELD USAGE EXAMPLE:
          </span>
          <p className="mt-1 font-mono text-xs font-bold text-black italic">
            "{term.exampleSentence}"
          </p>
        </div>
        
        <div className="mt-6 flex justify-end border-t-2 border-black pt-4">
          <Button variant="yellow" size="sm" onClick={onClose}>
            GOT IT
          </Button>
        </div>
      </div>
    </div>
  );
};
