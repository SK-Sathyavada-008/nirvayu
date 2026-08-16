import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Hotspot } from '../../types';
import { RiskBadge } from '../common/RiskBadge';
import { 
  Wind, 
  Car, 
  MapPin, 
  Clock, 
  Sparkles
} from 'lucide-react';

interface PollutionMapViewProps {
  hotspots: Hotspot[];
  city: string;
}

// Function to create sleek, high-tech DOM markers with AQI number
const createCustomMarker = (aqi: number, riskLevel: string) => {
  let color = '#10b981'; // emerald
  let pulseColor = 'rgba(16, 185, 129, 0.4)';

  const norm = riskLevel.toLowerCase();
  if (norm.includes('critical') || aqi > 200) {
    color = '#f43f5e'; // rose/red
    pulseColor = 'rgba(244, 63, 94, 0.5)';
  } else if (norm.includes('severe') || aqi > 160) {
    color = '#f97316'; // orange
    pulseColor = 'rgba(249, 115, 22, 0.4)';
  } else if (norm.includes('unhealthy') || aqi > 140) {
    color = '#f59e0b'; // amber
    pulseColor = 'rgba(245, 158, 11, 0.35)';
  }

  const html = `
    <div style="
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: #0f172a;
      border: 2px solid ${color};
      box-shadow: 0 0 15px ${pulseColor};
      color: #fff;
      font-weight: 800;
      font-size: 11px;
      font-family: 'JetBrains Mono', monospace;
      cursor: pointer;
    ">
      <span style="z-index: 2;">${aqi}</span>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-aqi-marker',
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18]
  });
};

export const PollutionMapView: React.FC<PollutionMapViewProps> = ({ hotspots, city }) => {
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(hotspots[0] || null);
  const [filterSeverity, setFilterSeverity] = useState<string>('all');

  // Center coordinate mapping
  const cityCoords: Record<string, [number, number]> = {
    Hyderabad: [17.4150, 78.4450],
    Banglore: [12.9716, 77.5946],
    Delhi: [28.7041, 77.1025],
    Mumbai: [19.0760, 72.8777]
  };

  const center = cityCoords[city] || [17.4150, 78.4450];

  const filteredHotspots = hotspots.filter(h => {
    if (filterSeverity === 'all') return true;
    return h.risk_level.toLowerCase().includes(filterSeverity.toLowerCase());
  });

  return (
    <div className="space-y-6">
      {/* Header & Map Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <MapPin className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Hyperlocal Pollution & Hotspot GIS
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Street-level air quality telemetry and vehicular emission density clusters around {city}.
              </p>
            </div>
          </div>
        </div>

        {/* Severity Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 self-start sm:self-center">
          <span className="text-[11px] font-bold text-slate-400 px-2 uppercase tracking-wide">Filter:</span>
          {['all', 'critical', 'severe', 'unhealthy'].map((sev) => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                filterSeverity === sev
                  ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {sev === 'all' ? `All (${hotspots.length})` : sev}
            </button>
          ))}
        </div>
      </div>

      {/* Map + Hotspot Detail Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Map */}
        <div className="lg:col-span-8 glass-panel p-3 rounded-2xl h-[560px] relative overflow-hidden flex flex-col">
          <div className="flex-1 w-full rounded-xl overflow-hidden relative">
            <MapContainer
              key={`${city}-${center[0]}-${center[1]}`}
              center={center}
              zoom={12}
              scrollWheelZoom={false}
              className="w-full h-full"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              />

              {filteredHotspots.map((hotspot) => (
                <Marker
                  key={hotspot.id}
                  position={[hotspot.lat, hotspot.lng]}
                  icon={createCustomMarker(hotspot.aqi, hotspot.risk_level)}
                  eventHandlers={{
                    click: () => setSelectedHotspot(hotspot),
                  }}
                >
                  <Popup>
                    <div className="p-1 space-y-1.5 text-slate-100 min-w-[200px]">
                      <div className="font-bold text-xs text-white flex items-center justify-between">
                        <span>{hotspot.name}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                          AQI {hotspot.aqi}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300">
                        {hotspot.likely_pollution_source}
                      </p>
                      <div className="text-[10px] text-slate-400 border-t border-slate-800 pt-1 flex justify-between font-mono">
                        <span>Traffic: {hotspot.traffic_density}</span>
                        <span>Wind: {hotspot.wind_speed}</span>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>

            {/* Map Legend Overlay */}
            <div className="absolute bottom-4 left-4 z-[1000] p-3 rounded-xl text-[10px] space-y-1.5 border border-slate-800 bg-slate-950/95 shadow-xl">
              <div className="font-bold text-slate-300 uppercase tracking-wider text-[9px] flex items-center justify-between gap-3">
                <span>AQI Severity</span>
                <span className="text-amber-400">Prototype Mesh</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span>Critical (&gt; 200)</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                <span>Severe (160 - 200)</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>Unhealthy (130 - 160)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Selected Hotspot Details & Fleet Telemetry */}
        <div className="lg:col-span-4 space-y-4">
          {selectedHotspot ? (
            <div className="glass-panel p-5 rounded-2xl space-y-4">
              <div className="flex items-start justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Node Dossier
                  </span>
                  <h3 className="text-base font-bold text-white mt-0.5">
                    {selectedHotspot.name}
                  </h3>
                  <span className="text-xs text-emerald-400 font-medium">{city} Monitoring Sector</span>
                </div>
                <RiskBadge level={selectedHotspot.risk_level} size="md" />
              </div>

              {/* AQI Metric Highlight */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Corridor AQI Index</span>
                  <span className="text-3xl font-black text-white font-mono">{selectedHotspot.aqi}</span>
                </div>
                <div className="text-right text-xs">
                  <span className="text-slate-400 block">Primary Sector</span>
                  <span className="text-slate-200 font-semibold">{selectedHotspot.name.split(' ')[0]} Transit</span>
                </div>
              </div>

              {/* Telemetry Sensor Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                    <Car className="w-3.5 h-3.5 text-cyan-400" /> Traffic Load
                  </span>
                  <span className="text-sm font-bold text-white mt-1 block font-mono">
                    {selectedHotspot.traffic_density}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                    <Wind className="w-3.5 h-3.5 text-emerald-400" /> Wind Speed
                  </span>
                  <span className="text-sm font-bold text-white mt-1 block font-mono">
                    {selectedHotspot.wind_speed}
                  </span>
                </div>
              </div>

              {/* Source Analysis */}
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-1">
                <span className="text-slate-400 font-semibold text-[10px] uppercase tracking-wider block">
                  Identified Emission Source
                </span>
                <p className="text-slate-200 leading-relaxed">
                  {selectedHotspot.likely_pollution_source}
                </p>
              </div>

              {/* AI Environmental Assessment */}
              <div className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-500/20 text-xs space-y-1">
                <span className="text-purple-300 font-semibold text-[10px] uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-purple-400" /> AI Microclimate Assessment
                </span>
                <p className="text-slate-300 leading-relaxed">
                  {selectedHotspot.ai_risk_assessment}
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Real-time Node Sync
                </span>
                <span className="text-emerald-400 font-medium">Node Status: Online</span>
              </div>
            </div>
          ) : (
            <div className="glass-panel p-8 rounded-2xl text-center text-slate-500">
              <MapPin className="w-8 h-8 mx-auto mb-2 text-slate-600" />
              <p className="text-xs">Click any marker on the map to inspect its hyperlocal corridor dossier.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
