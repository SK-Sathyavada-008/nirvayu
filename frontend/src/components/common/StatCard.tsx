import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: string;
  isIncreasePositive?: boolean;
  icon: LucideIcon;
  color?: 'emerald' | 'rose' | 'amber' | 'blue' | 'purple';
  isSimulation?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  change,
  isIncreasePositive = false,
  icon: Icon,
  color = 'emerald',
  isSimulation = false
}) => {
  const colorMap = {
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    rose: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    blue: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    purple: 'text-purple-400 bg-purple-500/10 border-purple-500/20'
  };

  const isUp = change && change.startsWith('+');
  const changeColor = (isUp && !isIncreasePositive) || (!isUp && isIncreasePositive)
    ? 'text-rose-400'
    : 'text-emerald-400';

  return (
    <div className="glass-panel p-4 sm:p-5 rounded-2xl transition-all duration-150 hover:border-slate-700 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{title}</span>
          <div className={`p-2 rounded-xl border ${colorMap[color]}`}>
            <Icon className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-black tracking-tight text-white font-mono">{value}</span>
          {change && (
            <span className={`text-xs font-semibold ${changeColor}`}>
              {change}
            </span>
          )}
        </div>
      </div>

      <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        {subtitle && (
          <span className="truncate">{subtitle}</span>
        )}
        {isSimulation && (
          <span className="text-[9px] uppercase font-bold text-amber-400/80 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 shrink-0 ml-1">
            Simulated
          </span>
        )}
      </div>
    </div>
  );
};
