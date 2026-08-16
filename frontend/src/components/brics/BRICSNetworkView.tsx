import React, { useState } from 'react';
import { 
  Globe2, 
  Cpu, 
  Database, 
  Share2, 
  Sparkles, 
  Server,
  ArrowRight,
  Code2,
  CheckCircle2,
  Info
} from 'lucide-react';
import type { CityNode, ActiveTab } from '../../types';
import { RiskBadge } from '../common/RiskBadge';

interface BRICSNetworkViewProps {
  cities: CityNode[];
  selectedCity?: string;
  onSelectCity?: (city: string) => void;
  setActiveTab?: (tab: ActiveTab) => void;
}

export const BRICSNetworkView: React.FC<BRICSNetworkViewProps> = ({ 
  cities, 
  selectedCity = 'Hyderabad',
  onSelectCity,
  setActiveTab
}) => {
  const [activeSchemaCity, setActiveSchemaCity] = useState<string>(selectedCity);

  const federatedPipelineSteps = [
    {
      step: 1,
      title: 'City Data',
      nodeLabel: 'Local Edge IoT & Vision Stream',
      desc: 'Ground-level vehicle optical captures, IoT ambient sensors, and citizen reports collected within municipal boundaries.',
      icon: Database,
      badge: 'Edge Ingestion'
    },
    {
      step: 2,
      title: 'Local Model',
      nodeLabel: 'On-Premise Dispersion Model',
      desc: 'Municipal edge servers fit local Scikit-Learn regressors and feature weights without raw imagery leaving city perimeter.',
      icon: Cpu,
      badge: 'Local Training'
    },
    {
      step: 3,
      title: 'Model Update',
      nodeLabel: 'Privacy-Preserved Gradient Weights',
      desc: 'Differential privacy noise (ε=0.8) added to local parameter deltas; encrypted gradient vectors prepared for transmission.',
      icon: Share2,
      badge: 'DP Encrypted'
    },
    {
      step: 4,
      title: 'Federated Aggregation',
      nodeLabel: 'Central Parameter Consensus',
      desc: 'FedAvg consensus coordinator computes weighted parameter aggregation across Hyderabad, Banglore, Delhi, and Mumbai.',
      icon: Server,
      badge: 'FedAvg Protocol'
    },
    {
      step: 5,
      title: 'Shared Climate Model',
      nodeLabel: 'Global NIRVĀYU Model v1.0',
      desc: 'Aggregated, generalized dispersion and vehicle emission screening weights distributed back to all metropolitan nodes.',
      icon: Sparkles,
      badge: 'Shared Intelligence'
    }
  ];

  const selectedCityData = cities.find(c => c.city.toLowerCase() === activeSchemaCity.toLowerCase()) || cities[0];

  const handleCitySwitch = (cityName: string) => {
    setActiveSchemaCity(cityName);
    if (onSelectCity) {
      onSelectCity(cityName);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header & Mandatory Prototype Simulation Notice */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Globe2 className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                BRICS & National Metropolitan Climate Mesh
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Standardized cross-city telemetry and simulated federated learning network across Indian metropolitan nodes.
              </p>
            </div>
          </div>
        </div>

        {/* Clear Prototype Notice Ribbon */}
        <div className="px-3.5 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-2 max-w-md">
          <Info className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong>PROTOTYPE SIMULATION:</strong> Demonstrating simulated federated network architecture using independent city nodes. No live cross-border model training is occurring.
          </span>
        </div>
      </div>

      {/* Visual Federated-Learning Flow: City Data -> Local Model -> Model Update -> Federated Aggregation -> Shared Climate Model */}
      <div className="glass-panel p-6 rounded-3xl border border-emerald-500/30 space-y-6 bg-slate-900/90 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 text-[10px] font-bold uppercase border border-emerald-500/20">
                Visual Federated-Learning Flow
              </span>
              <h3 className="text-sm sm:text-base font-bold text-white">
                Decentralized Sovereign Intelligence Architecture
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Privacy-first pipeline: City Data → Local Model → Model Update → Federated Aggregation → Shared Climate Model
            </p>
          </div>

          <div className="text-[11px] text-slate-400 font-mono">
            Global Consensus Loss: <strong className="text-emerald-400">0.038 (Round 48)</strong>
          </div>
        </div>

        {/* 5-Stage Federated Learning Flow Steps */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
          {federatedPipelineSteps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={step.step} className="relative flex flex-col">
                <div className="h-full p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between hover:border-emerald-500/40 transition-all space-y-3">
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-bold text-slate-500 font-mono">Step 0{step.step}</span>
                    </div>

                    <h4 className="text-xs font-bold text-white mt-3">
                      {step.title}
                    </h4>
                    <span className="text-[10px] font-semibold text-emerald-400 block mb-1">
                      {step.nodeLabel}
                    </span>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-300 bg-slate-800 px-2 py-0.5 rounded">
                      {step.badge}
                    </span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                </div>

                {/* Arrow connector between stages on desktop */}
                {idx < 4 && (
                  <div className="hidden md:flex absolute -right-2 top-1/2 -translate-y-1/2 z-10 text-slate-600">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span>Simulation Mode: Edge nodes in <strong>Hyderabad, Banglore, Delhi, and Mumbai</strong> synchronize parameter vectors every 15 minutes.</span>
          <span className="text-emerald-400 font-semibold font-mono">36.8M Weights Synchronized</span>
        </div>
      </div>

      {/* 4 Standardized City Node Cards (City Selector) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Standardized Metropolitan City Nodes</h3>
            <p className="text-xs text-slate-400">
              Click any city to switch active dashboard telemetry or view standardized schema data
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-400">4 Active Municipal Nodes</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {cities.map((c) => {
            const isCurrentActive = selectedCity.toLowerCase() === c.city.toLowerCase();
            return (
              <div
                key={c.id}
                onClick={() => handleCitySwitch(c.city)}
                className={`p-5 rounded-2xl cursor-pointer transition-all border flex flex-col justify-between ${
                  isCurrentActive
                    ? 'glass-panel-glow bg-slate-900/90 border-emerald-500/60 shadow-lg shadow-emerald-950/40'
                    : 'glass-panel hover:border-slate-700 bg-slate-900/50'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xl">🇮🇳</span>
                        <h4 className="text-base font-bold text-white">{c.city}</h4>
                      </div>
                      <p className="text-xs text-emerald-400 font-medium">{c.country}</p>
                    </div>
                    <RiskBadge level={c.pollution_risk} size="sm" />
                  </div>

                  <div className="mt-4 p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block uppercase tracking-wider font-bold">Standardized AQI</span>
                    <span className="text-3xl font-black text-white font-mono">{c.aqi}</span>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      Coords: {c.latitude?.toFixed(4)}, {c.longitude?.toFixed(4)}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Vehicle Reports:</span>
                    <span className="text-slate-200 font-bold">{c.vehicle_emission_reports || 184} Reports</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Data Samples:</span>
                    <span className="text-slate-200 font-medium truncate ml-1">{c.data_samples || c.local_data_volume}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Last Updated:</span>
                    <span className="text-cyan-400 font-medium">{c.last_updated || '2 mins ago'}</span>
                  </div>

                  <div className="mt-3 pt-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCitySwitch(c.city);
                        if (setActiveTab) setActiveTab('dashboard');
                      }}
                      className={`w-full py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        isCurrentActive
                          ? 'bg-emerald-500 text-slate-950 shadow-md'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                      }`}
                    >
                      {isCurrentActive ? 'Active Dashboard City ✓' : 'Load Dashboard for ' + c.city}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Standardized API Schema Viewer: Demonstrating how the same API schema supports every city */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Code2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white">
                Standardized API Schema Verification (`GET /api/brics`)
              </h3>
              <p className="text-xs text-slate-400">
                Demonstrating identical schema fields supporting all metropolitan nodes in the network
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Inspecting Schema for:</span>
            <span className="font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/30">
              {selectedCityData?.city}, {selectedCityData?.country}
            </span>
          </div>
        </div>

        {/* Live JSON Payload Inspector */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 overflow-x-auto font-mono text-xs text-slate-300">
          <pre className="text-[11px] leading-relaxed">
{JSON.stringify({
  "city": selectedCityData?.city,
  "country": selectedCityData?.country,
  "latitude": selectedCityData?.latitude || 17.3850,
  "longitude": selectedCityData?.longitude || 78.4867,
  "aqi": selectedCityData?.aqi,
  "pollution_risk": selectedCityData?.pollution_risk,
  "vehicle_emission_reports": selectedCityData?.vehicle_emission_reports || 184,
  "data_samples": selectedCityData?.data_samples || "1.2M logs (142.8 GB)",
  "model_status": selectedCityData?.model_status,
  "last_updated": selectedCityData?.last_updated || "2 mins ago"
}, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};
