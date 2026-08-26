import React from 'react';
import type { SubcultureType } from '../../types';
import { SUBCULTURES } from '../../data/subcultures';

interface SubculturePickerProps {
  selected: SubcultureType;
  onSelect: (subculture: SubcultureType) => void;
  disabled?: boolean;
}

export const SubculturePicker: React.FC<SubculturePickerProps> = ({ selected, onSelect, disabled }) => {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="font-mono text-xs font-black uppercase tracking-wider text-neutral-700">
        SUBCULTURE LENS:
      </span>
      {Object.values(SUBCULTURES).map((item) => {
        const isSelected = selected === item.id;
        return (
          <button
            key={item.id}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(item.id)}
            className={`border-2 border-black px-3 py-1 font-display text-xs transition-all ${
              isSelected
                ? 'translate-x-[2px] translate-y-[2px] shadow-none font-black text-black'
                : 'bg-white hover:bg-neutral-100 shadow-brutal-sm font-bold text-neutral-800'
            }`}
            style={{ backgroundColor: isSelected ? item.badgeColor : undefined }}
          >
            {item.name}
          </button>
        );
      })}
    </div>
  );
};
