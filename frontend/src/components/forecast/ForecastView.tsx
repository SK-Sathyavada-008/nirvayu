import React, { useState } from 'react';
import { 
  TrendingUp, 
  Sparkles,
  Brain,
  Cpu,
  ShieldAlert,
  Gauge,
  Info,
  CheckCircle2,
  RefreshCw,
  Sliders,
  ShieldCheck,
  Activity
} from 'lucide-react';
import type { ForecastData } from '../../types';
import { RiskBadge } from '../common/RiskBadge';
import { apiService } from '../../services/api';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';

interface ForecastViewProps {
  forecastData: ForecastData;
  city: string;
}

export const ForecastView: React.FC<ForecastViewProps> = ({ forecastData: initialData, city }) => {
  const [data, setData] = useState<ForecastData>(initialData);
  const [selectedHorizon, setSelectedHorizon] = useState<number>(30);
  const [loading, setLoading] = useState<boolean>(false);
  const [showSimulator, setShowSimulator] = useState<boolean>(false);

  // Simulation parameters
  const [currentAqi, setCurrentAqi] = useState<number>(initialData.current_aqi || 164);
  const [trafficDensity, setTrafficDensity] = useState<number>(initialData.traffic_density ?? 0.85);
  const [windSpeed, setWindSpeed] = useState<number>(initialData.wind_speed ?? 5.2);
  const [temperature, setTemperature] = useState<number>(initialData.temperature ?? 31.5);
  const [heavyVehicleRatio, setHeavyVehicleRatio] = useState<number>(initialData.heavy_vehicle_ratio ?? 0.38);

  const handleSimulate = async () => {
    setLoading(true);
    try {
      const res = await apiService.getForecast(
        city,
        currentAqi,
        trafficDensity,
        windSpeed,
        temperature,
        heavyVehicleRatio
      );
      setData(res);
    } catch (err) {
      console.error('Forecast recalculation failed:', err);
    } finally {
      setLoading(false);
    }
  };

  // Construct chart data points from ML predictions
  const chartPoints = [
    { time: 'Now (T+0)', aqi: data.current_aqi, isForecast: false, confidence: 1.0 },
    ...data.predictions.map(p => ({
      time: `T+${p.horizon_minutes}m`,
      aqi: p.predicted_aqi,
      isForecast: true,
      confidence: p.confidence
    }))
  ];

  const gemini = data.gemini_reasoning;
  const peakPrediction = data.predictions.reduce(
    (max, p) => (p.predicted_aqi > max.predicted_aqi ? p : max),
    data.predictions[0] || { predicted_aqi: data.current_aqi, horizon_minutes: 0 }
  );

  return (
    <div className="space-y-6">
      {/* Header & Dual Pipeline Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <TrendingUp className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Hyperlocal AQI Short-Term Forecasting
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Coupled predictive intelligence for <span className="text-emerald-300 font-semibold">{city}</span>: Scikit-Learn dispersion modeling coupled with Gemini atmospheric reasoning.
          </p>
        </div>

        {/* Dual Pipeline Source Attribution Badges */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* ML Model Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-cyan-500/30 text-xs shadow-sm">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block leading-tight">Numerical prediction:</span>
              <span className="font-semibold text-cyan-300">ML model (Scikit-Learn)</span>
            </div>
          </div>

          {/* Gemini Risk Interpretation Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-purple-500/30 text-xs shadow-sm">
            <Brain className="w-3.5 h-3.5 text-purple-400" />
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block leading-tight">Risk interpretation:</span>
              <span className="font-semibold text-purple-300">Gemini</span>
            </div>
          </div>

          <button
            onClick={() => setShowSimulator(!showSimulator)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
              showSimulator 
                ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md' 
                : 'bg-slate-800/80 hover:bg-slate-800 text-slate-200 border-slate-700'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{showSimulator ? 'Close Simulator' : 'Telemetry Simulator'}</span>
          </button>
        </div>
      </div>

      {/* Interactive Telemetry Simulator Tray */}
      {showSimulator && (
        <div className="glass-panel p-5 rounded-2xl border border-emerald-500/30 bg-slate-900/95 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">Live Environmental Scenario Simulator</h3>
            </div>
            <span className="text-[11px] text-slate-400">
              Adjust variables to re-evaluate Scikit-Learn predictions & Gemini risk reasoning
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-xs">
            {/* Baseline AQI */}
            <div className="space-y-1 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <div className="flex justify-between text-slate-400">
                <span>Baseline AQI</span>
                <span className="font-bold text-white">{currentAqi}</span>
              </div>
              <input
                type="range"
                min="40"
                max="350"
                value={currentAqi}
                onChange={(e) => setCurrentAqi(Number(e.target.value))}
                className="w-full accent-emerald-400 cursor-pointer"
              />
            </div>

            {/* Traffic Congestion */}
            <div className="space-y-1 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <div className="flex justify-between text-slate-400">
                <span>Traffic Density</span>
                <span className="font-bold text-white">{Math.round(trafficDensity * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={trafficDensity}
                onChange={(e) => setTrafficDensity(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            {/* Wind Speed */}
            <div className="space-y-1 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <div className="flex justify-between text-slate-400">
                <span>Wind Velocity</span>
                <span className="font-bold text-white">{windSpeed} km/h</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="25.0"
                step="0.5"
                value={windSpeed}
                onChange={(e) => setWindSpeed(Number(e.target.value))}
                className="w-full accent-teal-400 cursor-pointer"
              />
            </div>

            {/* Ambient Temperature */}
            <div className="space-y-1 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <div className="flex justify-between text-slate-400">
                <span>Temperature</span>
                <span className="font-bold text-white">{temperature}°C</span>
              </div>
              <input
                type="range"
                min="18.0"
                max="45.0"
                step="0.5"
                value={temperature}
                onChange={(e) => setTemperature(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
            </div>

            {/* Heavy Vehicle Ratio */}
            <div className="space-y-1 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <div className="flex justify-between text-slate-400">
                <span>Heavy Fleet Ratio</span>
                <span className="font-bold text-white">{Math.round(heavyVehicleRatio * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.65"
                step="0.01"
                value={heavyVehicleRatio}
                onChange={(e) => setHeavyVehicleRatio(Number(e.target.value))}
                className="w-full accent-rose-400 cursor-pointer"
              />
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              onClick={handleSimulate}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? 'Running ML & Gemini Models...' : 'Execute Coupled Forecast'}</span>
            </button>
          </div>
        </div>
      )}

      {/* SECTION 1: Numerical prediction: ML model (Scikit-Learn Multi-Horizon Forecast Grid) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs">
            <span className="px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold tracking-wide uppercase text-[10px]">
              Numerical prediction: ML model
            </span>
            <span className="text-slate-400">Scikit-Learn RandomForest dispersion regressor</span>
          </div>
          <span className="text-xs text-slate-400">
            Model Confidence: <strong className="text-white">{(data.confidence_overall * 100).toFixed(0)}% R²</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.predictions.map((p) => {
            const isSelected = selectedHorizon === p.horizon_minutes;
            const isIncrease = p.delta_from_baseline > 0;
            return (
              <div
                key={p.horizon_minutes}
                onClick={() => setSelectedHorizon(p.horizon_minutes)}
                className={`p-5 rounded-2xl cursor-pointer transition-all border ${
                  isSelected
                    ? 'glass-panel-glow bg-slate-900/90 border-cyan-500/50 shadow-cyan-500/10'
                    : 'glass-panel hover:border-slate-700 bg-slate-900/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    T + {p.horizon_minutes} Minutes
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-medium">
                    {(p.confidence * 100).toFixed(0)}% Conf
                  </span>
                </div>

                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl font-black text-white">{p.predicted_aqi}</span>
                  <span className={`text-xs font-semibold ${isIncrease ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {isIncrease ? `+${p.delta_from_baseline}` : p.delta_from_baseline} AQI
                  </span>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-400">ML Risk Category</span>
                  <RiskBadge level={p.predicted_aqi > 180 ? 'Severe' : p.predicted_aqi > 140 ? 'Unhealthy' : 'Moderate'} size="sm" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Forecast Visuals: ML Curve & Factor Weighting */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Projection Trend Line */}
        <div className="lg:col-span-7 glass-panel p-5 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[9px] font-bold uppercase">
                  ML Numerical Model
                </span>
                <h3 className="text-sm font-semibold text-white">
                  Short-Horizon Prediction Trajectory
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Baseline ({data.current_aqi} AQI) vs Scikit-Learn 60-minute trajectory
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block" />
              <span>ML Projected Curve</span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartPoints} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="forecastGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} domain={['dataMin - 15', 'dataMax + 15']} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.5rem', fontSize: '12px' }}
                  labelStyle={{ color: '#f8fafc', fontWeight: 'bold' }}
                />
                <ReferenceLine y={data.current_aqi} stroke="#64748b" strokeDasharray="3 3" label={{ value: 'Current Baseline', fill: '#94a3b8', fontSize: 10 }} />
                <Area
                  type="monotone"
                  dataKey="aqi"
                  name="Scikit-Learn Predicted AQI"
                  stroke="#06b6d4"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#forecastGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <span>Peak predicted spike: <strong className="text-white">T+{peakPrediction.horizon_minutes}m ({peakPrediction.predicted_aqi} AQI, Δ{peakPrediction.predicted_aqi - data.current_aqi > 0 ? `+${peakPrediction.predicted_aqi - data.current_aqi}` : peakPrediction.predicted_aqi - data.current_aqi})</strong>.</span>
            <span className="text-cyan-400 font-semibold flex items-center gap-1">
              <Activity className="w-3.5 h-3.5" />
              Scikit-Learn Output
            </span>
          </div>
        </div>

        {/* Right: Contributing Factors & Model Feature Weights */}
        <div className="lg:col-span-5 glass-panel p-5 rounded-2xl space-y-4">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[9px] font-bold uppercase">
                ML Attribution
              </span>
              <h3 className="text-sm font-semibold text-white">
                Physical Dispersion Drivers
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Feature attribution weights for {selectedHorizon}-minute forecasting window
            </p>
          </div>

          <div className="space-y-3.5">
            {data.contributing_factors.map((cf, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">{cf.factor}</span>
                  <span className={`font-semibold ${cf.direction === 'increasing' ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {cf.direction === 'increasing' ? `+${cf.impact_pct}% (Worsening)` : `-${cf.impact_pct}% (Dispersing)`}
                  </span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      cf.direction === 'increasing' ? 'bg-rose-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, cf.impact_pct * 2)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Meteorological Telemetry Summary */}
          <div className="pt-4 border-t border-slate-800 space-y-2">
            <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">
              Telemetry Context
            </span>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                <span className="text-[10px] text-slate-500 block">Traffic Index</span>
                <span className="font-semibold text-white">{Math.round((data.traffic_density ?? 0.85) * 100)}%</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                <span className="text-[10px] text-slate-500 block">Wind Velocity</span>
                <span className="font-semibold text-white">{data.wind_speed ?? 5.2} km/h</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                <span className="text-[10px] text-slate-500 block">Temperature</span>
                <span className="font-semibold text-white">{data.temperature ?? 31.5}°C</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: Risk interpretation: Gemini (Atmospheric & Policy Intelligence Hub) */}
      <div className="space-y-4 pt-2">
        {/* Gemini Reasoning Header Banner */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-900/80 to-indigo-950/40 border border-purple-500/30 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-purple-500/20">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30">
                <Brain className="w-5 h-5 text-purple-400" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold tracking-wide uppercase text-[10px]">
                    Risk interpretation: Gemini
                  </span>
                  <span className="text-xs text-slate-400">• Multimodal Atmospheric Reasoner</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight mt-0.5">
                  AI Atmospheric Reasoning & Municipal Guidance
                </h3>
              </div>
            </div>

            {/* 1. Overall Pollution Risk Badge */}
            {gemini && (
              <div className="flex items-center gap-2 bg-slate-900/90 px-3.5 py-2 rounded-xl border border-purple-500/30">
                <ShieldAlert className="w-4 h-4 text-purple-400 shrink-0" />
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">1. Overall Pollution Risk</span>
                  <span className="text-xs font-bold text-purple-200">{gemini.overall_pollution_risk}</span>
                </div>
              </div>
            )}
          </div>

          {/* 3. Plain-Language Explanation */}
          {gemini && (
            <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/20 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-purple-300 uppercase tracking-wider">
                <Info className="w-3.5 h-3.5 text-purple-400" />
                <span>3. Plain-Language Explanation</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {gemini.plain_language_explanation}
              </p>
            </div>
          )}
        </div>

        {/* 2-Column Grid: Main Contributing Factors & Authority Actions */}
        {gemini && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* 2. Main Contributing Factors (Gemini Analysis) */}
            <div className="lg:col-span-6 glass-panel p-5 rounded-2xl space-y-4 border border-purple-500/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    <Sparkles className="w-4 h-4" />
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      2. Main Contributing Factors
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Gemini environmental dynamics synthesis
                    </p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 text-[10px] font-semibold border border-purple-500/20">
                  Gemini Reasoning
                </span>
              </div>

              <div className="space-y-2.5">
                {gemini.main_contributing_factors.map((factor, idx) => (
                  <div 
                    key={idx} 
                    className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5 hover:border-purple-500/30 transition-all"
                  >
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-purple-500/20 text-purple-300 font-bold text-[10px] shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{factor}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Recommended Authority Actions */}
            <div className="lg:col-span-6 glass-panel p-5 rounded-2xl space-y-4 border border-emerald-500/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <ShieldCheck className="w-4 h-4" />
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      4. Recommended Authority Actions
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Actionable protocols generated by Gemini for city officials
                    </p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 text-[10px] font-semibold border border-emerald-500/20">
                  Municipal Directives
                </span>
              </div>

              <div className="space-y-2.5">
                {gemini.recommended_authority_actions.map((action, idx) => (
                  <div 
                    key={idx} 
                    className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5 hover:border-emerald-500/30 transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{action}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 5. Confidence Interpretation Card */}
        {gemini && (
          <div className="p-4 rounded-2xl glass-panel border border-cyan-500/20 bg-slate-900/60 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Gauge className="w-4 h-4 text-cyan-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-300">
                  5. Confidence Interpretation
                </h4>
              </div>
              <span className="text-[10px] text-slate-400">
                Coupled Model Verification Index
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {gemini.confidence_interpretation}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
