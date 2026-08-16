import { useState, useEffect } from 'react';
import { Navbar } from './components/common/Navbar';
import { DashboardView } from './components/dashboard/DashboardView';
import { VehicleAIView } from './components/vehicle/VehicleAIView';
import { PollutionMapView } from './components/map/PollutionMapView';
import { ForecastView } from './components/forecast/ForecastView';
import { AuthorityAlertsView } from './components/alerts/AuthorityAlertsView';
import { BRICSNetworkView } from './components/brics/BRICSNetworkView';
import { CitizenReportView } from './components/citizen/CitizenReportView';

import type { ActiveTab, Hotspot, AuthorityAlert, CityNode, ForecastData, CitizenReport } from './types';
import { MOCK_HOTSPOTS, MOCK_ALERTS, MOCK_CITY_NODES, MOCK_FORECAST, MOCK_CITIZEN_REPORTS } from './data/mockData';
import { apiService } from './services/api';
import { Globe, Shield } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [selectedCity, setSelectedCity] = useState<string>('Hyderabad');

  const [hotspots, setHotspots] = useState<Hotspot[]>(MOCK_HOTSPOTS);
  const [alerts, setAlerts] = useState<AuthorityAlert[]>(MOCK_ALERTS);
  const [cities, setCities] = useState<CityNode[]>(MOCK_CITY_NODES);
  const [forecastData, setForecastData] = useState<ForecastData>(MOCK_FORECAST);
  const [citizenReports, setCitizenReports] = useState<CitizenReport[]>(MOCK_CITIZEN_REPORTS);

  useEffect(() => {
    async function loadInitialData() {
      try {
        const [hotspotsRes, alertsRes, bricsRes, forecastRes, citizenRes] = await Promise.all([
          apiService.getHotspots(selectedCity),
          apiService.getAlerts(selectedCity),
          apiService.getBricsNetwork(),
          apiService.getForecast(selectedCity),
          apiService.getCitizenReports()
        ]);

        setHotspots(hotspotsRes);
        setAlerts(alertsRes);
        setCities(bricsRes);
        setForecastData(forecastRes);
        setCitizenReports(citizenRes);
      } catch (err) {
        console.error('Data initialization error:', err);
      }
    }
    loadInitialData();
  }, [selectedCity]);

  const handleAddCitizenReport = (newReport: CitizenReport) => {
    setCitizenReports(prev => [newReport, ...prev]);
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
        alertCount={alerts.filter(a => a.severity === 'Critical').length}
      />

      {/* Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'dashboard' && (
          <DashboardView
            city={selectedCity}
            hotspots={hotspots}
            alerts={alerts}
            citizenReports={citizenReports}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'vehicle' && <VehicleAIView />}

        {activeTab === 'map' && (
          <PollutionMapView
            hotspots={hotspots}
            city={selectedCity}
          />
        )}

        {activeTab === 'forecast' && (
          <ForecastView
            forecastData={forecastData}
            city={selectedCity}
          />
        )}

        {activeTab === 'alerts' && (
          <AuthorityAlertsView
            alerts={alerts}
            city={selectedCity}
          />
        )}

        {activeTab === 'network' && (
          <BRICSNetworkView
            cities={cities}
            selectedCity={selectedCity}
            onSelectCity={setSelectedCity}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'citizen' && (
          <CitizenReportView
            citizenReports={citizenReports}
            onAddReport={handleAddCitizenReport}
            city={selectedCity}
          />
        )}
      </main>

      {/* Modern Climate-Tech Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/60 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-bold text-white font-mono">
              NIRV<span className="text-emerald-400">Ā</span>YU
            </span>
            <span>•</span>
            <span className="text-slate-400">AI-Powered Hyperlocal Emission & Air-Quality Intelligence Platform</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              National Grid Mesh v1.0
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              Sovereign Climate Architecture
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
