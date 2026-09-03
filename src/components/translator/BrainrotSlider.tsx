import React from 'react';
import type { BrainrotLevel } from '../../types';
import { Flame, Skull, Zap, Sparkles, Smile } from 'lucide-react';

interface BrainrotSliderProps {
  value: BrainrotLevel;
  onChange: (level: BrainrotLevel) => void;
  disabled?: boolean;
}

const LEVEL_DETAILS: Record<BrainrotLevel, { name: string; tag: string; icon: React.ReactNode; color: string; desc: string }> = {
  1: { name: 'Subtle / Casual', tag: 'LVL 1', icon: <Smile className="w-4 h-4" />, color: '#A3B86C', desc: 'Mild slang (lowkey, bet, hits different)' },
  2: { name: 'Active Social', tag: 'LVL 2', icon: <Sparkles className="w-4 h-4" />, color: '#9BBFC0', desc: 'Mainstream discourse (delulu, side-eye, rent-free)' },
  3: { name: 'Hyper-Online', tag: 'LVL 3', icon: <Zap className="w-4 h-4" />, color: '#A3B86C', desc: 'High velocity slang (lock in, cooked, crashout)' },
  4: { name: 'High Irony', tag: 'LVL 4', icon: <Flame className="w-4 h-4" />, color: '#C27D65', desc: 'Subculture meta-irony (mewing streak, mogging, mid)' },
  5: { name: 'TERMINAL BRAINROT', tag: 'LVL 5', icon: <Skull className="w-4 h-4" />, color: '#A35C48', desc: 'Absolute surreal delirium (skibidi, fanum tax, ohio)' },
};

export const BrainrotSlider: React.FC<BrainrotSliderProps> = ({ value, onChange, disabled = false }) => {
  const current = LEVEL_DETAILS[value];
  
  return (
    <div className={`fluid-surface p-4 transition-all duration-300 ${value === 5 ? 'ring-2 ring-[var(--coral)]' : ''}`}>
      <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-black pb-3">
        <div className="flex items-center gap-2">
          <div
            className="flex items-center gap-1.5 border-2 border-black px-2.5 py-1 font-mono text-xs font-black shadow-brutal-sm text-black"
            style={{ backgroundColor: current.color }}
          >
            {current.icon}
            <span>{current.tag}</span>
          </div>
          <h3 className="font-display font-black tracking-tight text-black sm:text-base">
            BRAINROT INTENSITY DIAL: <span className="underline">{current.name}</span>
          </h3>
        </div>
        <span className="font-mono text-xs font-bold text-neutral-600">
          {current.desc}
        </span>
      </div>
      
      <div className="mt-4 grid grid-cols-5 gap-px overflow-hidden rounded-lg border border-[var(--line)] bg-[var(--line)]">
        {([1, 2, 3, 4, 5] as BrainrotLevel[]).map((level) => {
          const isSelected = value === level;
          const config = LEVEL_DETAILS[level];
          return (
            <button
              key={level}
              type="button"
              disabled={disabled}
              onClick={() => onChange(level)}
              className={`flex flex-col items-center justify-center gap-1 border-2 border-black py-2.5 px-1 font-display transition-all ${
                isSelected
                  ? 'translate-x-[2px] translate-y-[2px] shadow-none font-black text-black'
                  : 'bg-neutral-100 hover:bg-neutral-200 shadow-brutal-sm font-bold text-neutral-700'
              }`}
              style={{ backgroundColor: isSelected ? config.color : undefined }}
            >
              <div className="flex items-center gap-1">
                {config.icon}
                <span className="text-xs font-mono font-black">{level}</span>
              </div>
              <span className="hidden text-[11px] uppercase tracking-tight md:inline-block">
                {config.name.split('/')[0]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
