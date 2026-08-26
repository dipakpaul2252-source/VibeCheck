import React from 'react';
import { CringeRadar } from './CringeRadar';
import { VibeOMeter } from './VibeOMeter';
import type { SlangTerm } from '../../types';

interface TelemetryDashboardProps {
  cringeScore: number;
  activeTerm: SlangTerm | null;
}

export const TelemetryDashboard: React.FC<TelemetryDashboardProps> = ({ cringeScore, activeTerm }) => {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <CringeRadar score={cringeScore} />
      <VibeOMeter activeTerm={activeTerm} />
    </div>
  );
};
