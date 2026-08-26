import React from 'react';
import { TrendingUp, Activity } from 'lucide-react';
import type { SlangTerm } from '../../types';

interface VibeOMeterProps {
  activeTerm: SlangTerm | null;
}

export const VibeOMeter: React.FC<VibeOMeterProps> = ({ activeTerm }) => {
  // Mock 30-day velocity sparkline coordinates
  const sparklinePoints = "5,45 25,40 45,35 65,42 85,28 105,20 125,25 145,12 165,15 185,5";
  
  const lifecycleColors: Record<string, string> = {
    'Peak Viral': 'bg-[#E2F952] text-black',
    'Emerging': 'bg-[#00F0FF] text-black',
    'Brand-Adopted': 'bg-[#C084FC] text-black',
    'Deceased': 'bg-[#EF4444] text-white',
    'Fatal Cringe': 'bg-[#EF4444] text-white',
  };
  
  const termName = activeTerm ? activeTerm.term : 'Discourse Overview';
  const velocity = activeTerm ? activeTerm.velocityChange : '+78%';
  const lifecycle = activeTerm ? activeTerm.lifecycle : 'Peak Viral';
  
  return (
    <div className="border-3 border-black bg-white p-5 shadow-brutal flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between border-b-2 border-black pb-3 select-none">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center border-2 border-black bg-[#00F0FF] p-1 shadow-brutal-sm text-black">
              <Activity className="h-4 w-4" />
            </div>
            <h3 className="font-display font-black text-black">VIBE VELOCITY & LIFECYCLE</h3>
          </div>
          <span className={`border-2 border-black px-2.5 py-0.5 font-mono text-xs font-black shadow-brutal-sm ${
            lifecycleColors[lifecycle] || 'bg-neutral-200 text-black'
          }`}>
            {lifecycle.toUpperCase()}
          </span>
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <div>
            <span className="font-mono text-[10px] font-bold text-neutral-500 uppercase select-none">
              ACTIVE SUBJECT:
            </span>
            <h4 className="font-display text-lg font-black text-black uppercase">
              {termName}
            </h4>
          </div>
          <div className="text-right">
            <span className="font-mono text-[10px] font-bold text-neutral-500 uppercase select-none">
              30D VELOCITY:
            </span>
            <div className="flex items-center gap-1 font-mono text-lg font-black text-[#10B981]">
              <TrendingUp className="h-4 w-4" />
              <span>{velocity}</span>
            </div>
          </div>
        </div>
        
        {/* 30-DAY SVG SPARKLINE GRAPH */}
        <div className="mt-4 border-2 border-black bg-[#FAF9F5] p-3 shadow-brutal-sm">
          <div className="flex items-center justify-between font-mono text-[10px] font-bold text-neutral-500 mb-1 select-none">
            <span>DAY 0</span>
            <span>30-DAY TRAJECTORY SPARKLINE</span>
            <span>TODAY</span>
          </div>
          <svg viewBox="0 0 190 50" className="w-full h-12 overflow-visible">
            <polyline
              fill="none"
              stroke="#000000"
              strokeWidth="3"
              points={sparklinePoints}
            />
            <polyline
              fill="none"
              stroke="#FF5C00"
              strokeWidth="2"
              strokeDasharray="4 2"
              points={sparklinePoints}
            />
            {/* Pulsing point at latest coordinate */}
            <circle cx="185" cy="5" r="4" fill="#FF5C00" className="animate-ping" />
            <circle cx="185" cy="5" r="3" fill="#000000" />
          </svg>
        </div>
        
        {/* PLATFORM DISTRIBUTION BARS */}
        <div className="mt-4 space-y-2">
          <span className="font-mono text-[11px] font-black uppercase text-neutral-700 select-none">
            PLATFORM ENGAGEMENT SPREAD:
          </span>
          <div className="grid grid-cols-4 gap-2 font-mono text-[10px]">
            <div className="border border-black bg-[#FCFDE8] p-1.5 text-center">
              <span className="block font-bold text-neutral-500">TIKTOK</span>
              <span className="font-black text-black">68%</span>
            </div>
            <div className="border border-black bg-[#F5E8FF] p-1.5 text-center">
              <span className="block font-bold text-neutral-500">TWITCH</span>
              <span className="font-black text-black">18%</span>
            </div>
            <div className="border border-black bg-[#E6FCFF] p-1.5 text-center">
              <span className="block font-bold text-neutral-500">X / TWITTER</span>
              <span className="font-black text-black">10%</span>
            </div>
            <div className="border border-black bg-[#FAF9F5] p-1.5 text-center">
              <span className="block font-bold text-neutral-500">REDDIT</span>
              <span className="font-black text-black">4%</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-4 border-t-2 border-black pt-2 flex items-center justify-between font-mono text-[10px] text-neutral-500 font-bold select-none">
        <span>DATA SOURCE: LIVE RAG INGESTION</span>
        <span>INDEX UPDATED: REAL-TIME</span>
      </div>
    </div>
  );
};
