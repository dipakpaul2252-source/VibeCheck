import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { Button } from '../ui/Button';
import { AuraPointsWidget } from '../gamification/AuraPointsWidget';

interface NavbarProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenLeaderboard: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  soundEnabled = true,
  onToggleSound,
  onOpenLeaderboard,
}) => {
  return (
    <header className="sticky top-0 z-50 border-b-3 border-black bg-white px-4 py-3 sm:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 border-2 border-black bg-[#E2F952] px-3 py-1 shadow-brutal-sm">
            <span className="h-3 w-3 animate-pulse rounded-full border border-black bg-[#10B981]" />
            <h1 className="font-display text-lg font-black tracking-tight text-black sm:text-xl select-none">
              VIBECHECK // 01
            </h1>
          </div>
          <span className="hidden font-mono text-xs font-bold text-neutral-500 md:inline-block">
            CULTURAL RAG v2.4
          </span>
        </div>

        <div className="flex items-center gap-3 flex-wrap md:flex-nowrap">
          <AuraPointsWidget onOpenLeaderboard={onOpenLeaderboard} />

          <Button
            variant="white"
            size="sm"
            onClick={onToggleSound}
            aria-label="Toggle procedural audio"
            leftIcon={soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4 text-red-500" />}
          >
            <span className="hidden sm:inline">{soundEnabled ? 'AUDIO ON' : 'MUTED'}</span>
          </Button>
        </div>
      </div>
    </header>
  );
};
