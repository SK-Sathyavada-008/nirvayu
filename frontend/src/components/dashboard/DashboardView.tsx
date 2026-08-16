import React from 'react';
import { 
  Wind, 
  Car, 
  MapPin, 
  ShieldAlert, 
  Users, 
  ArrowUpRight, 
  TrendingUp, 
  Clock, 
  Sparkles
} from 'lucide-react';
import { StatCard } from '../common/StatCard';
import { RiskBadge } from '../common/RiskBadge';
import type { Hotspot, AuthorityAlert, CitizenReport, ActiveTab } from '../../types';
import { HOURLY_TREND_DATA } from '../../data/mockData';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface DashboardViewProps {
  city: string;
  hotspots: Hotspot[];
  alerts: AuthorityAlert[];
  citizenReports: CitizenReport[];
  setActiveTab: (tab: ActiveTab) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  city,
  hotspots,
  alerts,
  citizenReports,
  setActiveTab,
}) => {
  const currentAQI = 164;
  const primaryAlert = alerts[0];

  return (
    <div className="space-y-6">
      {/* Top Banner / AI Alert Briefing */}
      {primaryAlert && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-rose-950/40 via-slate-900/90 to-amber-950/20 border border-rose-500/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg shadow-rose-950/20">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 shrink-0">
              <ShieldAlert className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] uppercase font-bold tracking-wider text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                  Priority Dispatch Alert
                </span>
                <span className="text-xs text-slate-400">• {primaryAlert.location}</span>
                <span className="text-xs text-slate-400">• Expected: {primaryAlert.horizon}</span>
                <span className="text-[9px] uppercase font-bold text-amber-400/80 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                  Prototype Model
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-white mt-1">
                {primaryAlert.title}
              </h3>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl">
                Immediate municipal protocol: {primaryAlert.recommended_actions[0]}
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('alerts')}
            className="self-end md:self-center px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-md shadow-rose-950/40 whitespace-nowrap cursor-pointer"
          >
            Dispatch Protocol
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* KPI Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Hyperlocal AQI"
          value={currentAQI}
          subtitle={`City Baseline for ${city}`}
          change="+18 vs 1h ago"
          isIncreasePositive={false}
          icon={Wind}
          color="rose"
          isSimulation={true}
        />
        <StatCard
          title="Active Hotspots"
          value={hotspots.length}
          subtitle="6 Hyperlocal Monitoring Nodes"
          change="2 Critical Zones"
          isIncreasePositive={false}
          icon={MapPin}
          color="amber"
          isSimulation={true}
        />
        <StatCard
          title="Fleet Emission Risk"
          value="88 / 100"
          subtitle="High Diesel Plume Density"
          change="+12% Micro-Spike"
          isIncreasePositive={false}
          icon={Car}
          color="purple"
          isSimulation={true}
        />
        <StatCard
          title="Citizen Flags (24h)"
          value={citizenReports.length + 38}
          subtitle="Community Ground Verified"
          change="+14 New Today"
          isIncreasePositive={true}
          icon={Users}
          color="emerald"
          isSimulation={true}
        />
      </div>

      {/* Main Visuals Grid: AQI Trend & Hyperlocal Hotspot Nodes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: 24h Trend Chart */}
        <div className="lg:col-span-7 glass-panel p-5 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-bold text-white">
                    Hyperlocal Pollution Trend (24h Corridor Profile)
                  </h3>
                  <span className="text-[9px] uppercase font-bold text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">
                    Telemetry Feed
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Continuous optical PM2.5 dispersion & vehicle density correlation for {city}
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
                  AQI Curve
                </span>
                <span className="flex items-center gap-1 text-slate-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block" />
                  Traffic Load %
                </span>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={HOURLY_TREND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="aqiGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="trafficGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="time" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} domain={[0, 250]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }}
                    labelStyle={{ color: '#f8fafc', fontWeight: 'bold' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="aqi"
                    name="AQI Index"
                    stroke="#10b981"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#aqiGrad)"
                  />
                  <Area
                    type="monotone"
                    dataKey="vehicleDensity"
                    name="Traffic Density %"
                    stroke="#06b6d4"
                    strokeWidth={1.5}
                    fillOpacity={1}
                    fill="url(#trafficGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              Evening transit peak projected: 18:00 - 20:00 (Heavy freight corridor accumulation)
            </span>
            <button
              onClick={() => setActiveTab('forecast')}
              className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 cursor-pointer"
            >
              Open ML Forecast →
            </button>
          </div>
        </div>

        {/* Right: Active Monitoring Hotspots */}
        <div className="lg:col-span-5 glass-panel p-5 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">
                  Active Monitoring Hubs ({city})
                </h3>
              </div>
              <button
                onClick={() => setActiveTab('map')}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer"
              >
                Full GIS Map →
              </button>
            </div>

            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {hotspots.slice(0, 4).map((h) => (
                <div
                  key={h.id}
                  onClick={() => setActiveTab('map')}
                  className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 cursor-pointer transition-all hover:bg-slate-900/80"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-white truncate max-w-[180px]">
                      {h.name}
                    </span>
                    <RiskBadge level={h.risk_level} size="sm" />
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                    <span>AQI <strong className="text-slate-200 font-mono">{h.aqi}</strong></span>
                    <span>Traffic: <strong className="text-slate-300 font-mono">{h.traffic_density}</strong></span>
                    <span>Flags: <strong className="text-slate-300 font-mono">{h.vehicle_emission_reports}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-500" /> IoT edge sync 2m ago
            </span>
            <button
              onClick={() => setActiveTab('vehicle')}
              className="text-xs bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30 px-3 py-1.5 rounded-lg transition-colors font-semibold cursor-pointer"
            >
              Analyze Tailpipe Smoke
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Quick Screening Launchpad & Live Community Ground Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Quick Launchpad */}
        <div className="lg:col-span-4 glass-panel p-5 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Car className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">
                Vehicle Emission AI Screening
              </h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Upload street-level tailpipe or roadside imagery to run AI visual smoke classification, Ringelmann scale opacity estimation, and fleet risk grading.
            </p>
          </div>

          <button
            onClick={() => setActiveTab('vehicle')}
            className="w-full mt-4 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-md shadow-emerald-950/50 transition-all cursor-pointer"
          >
            Launch Vehicle AI Vision Tool
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {/* Recent Community Feed */}
        <div className="lg:col-span-8 glass-panel p-5 rounded-2xl">
          <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2.5">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">
                Recent Citizen Ground Reports
              </h3>
              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                AI Verified
              </span>
            </div>
            <button
              onClick={() => setActiveTab('citizen')}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer"
            >
              Submit New Report →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {citizenReports.slice(0, 2).map((r) => (
              <div key={r.id} className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex gap-3">
                {r.image_url && (
                  <img
                    src={r.image_url}
                    alt={r.vehicle_type || 'Vehicle'}
                    className="w-16 h-16 rounded-xl object-cover border border-slate-700 shrink-0 bg-slate-900"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-bold text-white truncate">{r.location}</span>
                    <RiskBadge level={r.severity} size="sm" />
                  </div>
                  <p className="text-[11px] text-slate-300 mt-1 line-clamp-2">{r.description}</p>
                  <span className="text-[10px] text-slate-500 mt-1 block font-mono">{r.timestamp} • {r.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
