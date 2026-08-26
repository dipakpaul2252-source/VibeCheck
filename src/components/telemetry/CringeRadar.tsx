import React from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle, Zap } from 'lucide-react';

interface CringeRadarProps {
  score: number; // 0 to 100
}

export const CringeRadar: React.FC<CringeRadarProps> = ({ score }) => {
  // Clamp score between 0 and 100
  const clampedScore = Math.max(0, Math.min(100, score));
  // Needle angle calculation: 0 -> -90 deg, 50 -> 0 deg, 100 -> +90 deg
  const needleRotation = -90 + (clampedScore / 100) * 180;
  // Determine status band
  const isCritical = clampedScore > 75;
  const isQuestionable = clampedScore > 35 && clampedScore <= 75;
  
  let statusBadge = {
    label: 'CERTIFIED VALID',
    color: '#10B981',
    textColor: 'text-black',
    icon: <CheckCircle className="w-4 h-4" />,
    desc: 'Low social risk. Slang is current, natural, and culturally aligned.'
  };
  
  if (isQuestionable) {
    statusBadge = {
      label: 'QUESTIONABLE USAGE',
      color: '#E2F952',
      textColor: 'text-black',
      icon: <AlertTriangle className="w-4 h-4" />,
      desc: 'Moderate risk. Term is either over-commercialized or borderline stale.'
    };
  } else if (isCritical) {
    statusBadge = {
      label: 'FATAL UNC CRINGE',
      color: '#EF4444',
      textColor: 'text-white',
      icon: <ShieldAlert className="w-4 h-4 text-white" />,
      desc: 'Severe social penalty! Outdated millennial/dead slang detected.'
    };
  }
  
  return (
    <div className={`border-3 border-black bg-white p-5 shadow-brutal transition-all duration-200 ${
      isCritical ? 'animate-wiggle border-red-600 ring-2 ring-red-500' : ''
    }`}>
      <div className="flex items-center justify-between border-b-2 border-black pb-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center border-2 border-black bg-[#FF5C00] p-1 shadow-brutal-sm text-white">
            <Zap className="h-4 w-4" />
          </div>
          <h3 className="font-display font-black text-black">CRINGE RADAR TELEMETRY</h3>
        </div>
        <div
          className="flex items-center gap-1.5 border-2 border-black px-2.5 py-0.5 font-mono text-xs font-black shadow-brutal-sm"
          style={{ backgroundColor: statusBadge.color }}
        >
          {statusBadge.icon}
          <span className={statusBadge.textColor}>{statusBadge.label}</span>
        </div>
      </div>
      
      {/* SVG SPEEDOMETER GAUGE */}
      <div className="relative mt-4 flex flex-col items-center justify-center">
        <svg viewBox="0 0 200 110" className="w-full max-w-[240px] overflow-visible">
          {/* Arc Background Paths */}
          {/* Green Zone (0-35) */}
          <path
            d="M 20 100 A 80 80 0 0 1 65 35"
            fill="none"
            stroke="#10B981"
            strokeWidth="18"
            strokeLinecap="round"
          />
          {/* Yellow Zone (35-70) */}
          <path
            d="M 69 32 A 80 80 0 0 1 131 32"
            fill="none"
            stroke="#E2F952"
            strokeWidth="18"
          />
          {/* Red Zone (70-100) */}
          <path
            d="M 135 35 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="#EF4444"
            strokeWidth="18"
            strokeLinecap="round"
          />
          {/* Scale Tick Marks */}
          <text x="15" y="108" className="font-mono text-[9px] font-black fill-neutral-600">0%</text>
          <text x="94" y="20" className="font-mono text-[9px] font-black fill-neutral-600">50%</text>
          <text x="175" y="108" className="font-mono text-[9px] font-black fill-neutral-600">100%</text>
          {/* Needle Center Pivot */}
          <circle cx="100" cy="100" r="8" fill="#000000" />
          <circle cx="100" cy="100" r="4" fill="#FFFFFF" />
          {/* Animated Needle */}
          <g
            style={{
              transformOrigin: '100px 100px',
              transform: `rotate(${needleRotation}deg)`,
              transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          >
            <line
              x1="100"
              y1="100"
              x2="100"
              y2="24"
              stroke="#000000"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <polygon points="97,28 100,16 103,28" fill="#FF5C00" />
          </g>
        </svg>
        
        {/* Big Score Readout */}
        <div className="mt-2 text-center select-none">
          <span className="font-mono text-3xl font-black text-black tracking-tight">
            {clampedScore}%
          </span>
          <span className="ml-2 font-mono text-xs font-bold text-neutral-500 uppercase">
            CRINGE INDEX
          </span>
        </div>
      </div>
      
      <div className="mt-3 border-t-2 border-dashed border-black pt-3">
        <p className="font-mono text-xs text-neutral-700 leading-normal">
          {statusBadge.desc}
        </p>
      </div>
      
      {isCritical && (
        <div className="mt-3 border-2 border-black bg-red-500 p-2 font-mono text-xs font-black text-white shadow-brutal-sm animate-bounce">
          ⚠️ WARNING: UNC DETECTED. IMMEDIATE REPUTATIONAL HAZARD.
        </div>
      )}
    </div>
  );
};
