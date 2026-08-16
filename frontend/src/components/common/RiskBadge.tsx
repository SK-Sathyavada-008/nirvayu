import React from 'react';

interface RiskBadgeProps {
  level: string;
  size?: 'sm' | 'md' | 'lg';
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level, size = 'md' }) => {
  const norm = (level || '').toLowerCase();

  let colors = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
  let dotColor = 'bg-emerald-400';

  if (norm.includes('critical') || norm.includes('severe') || norm.includes('dense')) {
    colors = 'bg-rose-500/15 text-rose-300 border-rose-500/40 shadow-[0_0_12px_rgba(244,63,94,0.2)]';
    dotColor = 'bg-rose-400 animate-pulse';
  } else if (norm.includes('unhealthy') || norm.includes('high')) {
    colors = 'bg-amber-500/15 text-amber-300 border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.15)]';
    dotColor = 'bg-amber-400';
  } else if (norm.includes('moderate')) {
    colors = 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30';
    dotColor = 'bg-yellow-400';
  } else if (norm.includes('good') || norm.includes('clean') || norm.includes('low') || norm.includes('none')) {
    colors = 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
    dotColor = 'bg-emerald-400';
  }

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 gap-1.5',
    md: 'text-xs px-2.5 py-1 gap-2',
    lg: 'text-sm px-3 py-1.5 gap-2'
  }[size];

  return (
    <span className={`inline-flex items-center font-medium border rounded-full ${sizeClasses} ${colors}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      {level}
    </span>
  );
};
