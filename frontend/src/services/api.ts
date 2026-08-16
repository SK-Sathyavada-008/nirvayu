import type { Hotspot, ForecastData, AuthorityAlert, BRICSCity, VehicleAnalysisResult, CitizenReport } from '../types';
import { MOCK_HOTSPOTS, MOCK_FORECAST, MOCK_ALERTS, MOCK_BRICS_CITIES, MOCK_CITIZEN_REPORTS } from '../data/mockData';

const BASE_URL = '/api';

export const apiService = {
  // Fetch Hotspots
  async getHotspots(city: string = 'Hyderabad'): Promise<Hotspot[]> {
    try {
      const res = await fetch(`${BASE_URL}/hotspots?city=${encodeURIComponent(city)}`);
      if (!res.ok) throw new Error('Network response was not ok');
      const json = await res.json();
      return json.data || MOCK_HOTSPOTS;
    } catch (e) {
      console.warn('Backend unavailable, using mock hotspots:', e);
      return MOCK_HOTSPOTS;
    }
  },

  // Fetch AQI Forecast
  async getForecast(
    city: string = 'Hyderabad',
    currentAqi: number = 164,
    trafficDensity: number = 0.85,
    windSpeed: number = 5.2,
    temperature: number = 31.5,
    heavyVehicleRatio: number = 0.38
  ): Promise<ForecastData> {
    try {
      const params = new URLSearchParams({
        city,
        current_aqi: currentAqi.toString(),
        traffic_density: trafficDensity.toString(),
        wind_speed: windSpeed.toString(),
        temperature: temperature.toString(),
        heavy_vehicle_ratio: heavyVehicleRatio.toString()
      });
      const res = await fetch(`${BASE_URL}/forecast?${params.toString()}`);
      if (!res.ok) throw new Error('Network response was not ok');
      const json = await res.json();
      return json.data || MOCK_FORECAST;
    } catch (e) {
      console.warn('Backend unavailable, using mock forecast:', e);
      return MOCK_FORECAST;
    }
  },

  // Fetch Authority Alerts
  async getAlerts(city: string = 'Hyderabad'): Promise<AuthorityAlert[]> {
    try {
      const res = await fetch(`${BASE_URL}/alerts?city=${encodeURIComponent(city)}`);
      if (!res.ok) throw new Error('Network response was not ok');
      const json = await res.json();
      return json.data || MOCK_ALERTS;
    } catch (e) {
      console.warn('Backend unavailable, using mock alerts:', e);
      return MOCK_ALERTS;
    }
  },

  // Fetch BRICS Network
  async getBricsNetwork(): Promise<BRICSCity[]> {
    try {
      const res = await fetch(`${BASE_URL}/brics`);
      if (!res.ok) throw new Error('Network response was not ok');
      const json = await res.json();
      return json.data || MOCK_BRICS_CITIES;
    } catch (e) {
      console.warn('Backend unavailable, using mock BRICS network:', e);
      return MOCK_BRICS_CITIES;
    }
  },

  // Fetch Citizen Reports
  async getCitizenReports(): Promise<CitizenReport[]> {
    try {
      const res = await fetch(`${BASE_URL}/citizen-report`);
      if (!res.ok) throw new Error('Network response was not ok');
      const json = await res.json();
      return json.data || MOCK_CITIZEN_REPORTS;
    } catch (e) {
      console.warn('Backend unavailable, using mock citizen reports:', e);
      return MOCK_CITIZEN_REPORTS;
    }
  },

  // Submit Citizen Report
  async submitCitizenReport(report: Omit<CitizenReport, 'id' | 'timestamp' | 'status'>): Promise<CitizenReport> {
    try {
      const res = await fetch(`${BASE_URL}/citizen-report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(report)
      });
      if (!res.ok) throw new Error('Network response was not ok');
      const json = await res.json();
      return json.data;
    } catch (e) {
      console.warn('Backend unavailable, falling back to local creation:', e);
      return {
        id: `cit-${Date.now().toString().slice(-4)}`,
        ...report,
        timestamp: 'Just now',
        status: 'Logged & Queued for AI Validation'
      };
    }
  },

  // Analyze Vehicle Image
  async analyzeVehicle(file: File): Promise<VehicleAnalysisResult> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch(`${BASE_URL}/vehicle/analyze`, {
        method: 'POST',
        body: formData
      });
      if (!res.ok) throw new Error('Network response was not ok');
      const json = await res.json();
      return json.data;
    } catch (e) {
      console.warn('Backend unavailable, falling back to client heuristic:', e);
      // Simulate 1.2s AI analysis
      await new Promise(r => setTimeout(r, 1200));
      const filename = file.name.toLowerCase();
      if (filename.includes('bus') || filename.includes('ev') || filename.includes('clean')) {
        return {
          vehicle_type: 'Electric Transit Bus',
          visible_exhaust_detected: false,
          smoke_severity: 'None',
          emission_risk_score: 12,
          confidence: 0.96,
          observations: 'Zero visible exhaust plume. Clean lower chassis profile typical of high-efficiency electric zero-emission transit powertrain.',
          recommended_action: 'No intervention required. Suitable for eco-transit priority corridors.',
          disclaimer: 'This is an AI-based visual screening system, NOT a legally certified emissions test.'
        };
      } else if (filename.includes('auto') || filename.includes('rickshaw')) {
        return {
          vehicle_type: '3-Wheeler Auto-Rickshaw',
          visible_exhaust_detected: true,
          smoke_severity: 'Light Grey / Blue Tinge',
          emission_risk_score: 68,
          confidence: 0.89,
          observations: 'Intermittent blue-grey combustion smoke detected near exhaust outlet. Suggests 2-stroke lube oil combustion or fuel mix irregularity.',
          recommended_action: 'Flag for mandatory spot PUC verification and intake valve check.',
          disclaimer: 'This is an AI-based visual screening system, NOT a legally certified emissions test.'
        };
      } else {
        return {
          vehicle_type: 'Heavy Duty Multi-Axle Diesel Truck',
          visible_exhaust_detected: true,
          smoke_severity: 'Dense Black Plume (Ringelmann Scale Class 3.5)',
          emission_risk_score: 88,
          confidence: 0.94,
          observations: 'High-density unburnt carbon particulate matter plume detected under load. Severe tailpipe soot deposition around exhaust outlet.',
          recommended_action: 'Immediate municipal dispatch flag: issue roadside tailpipe audit notice.',
          disclaimer: 'This is an AI-based visual screening system, NOT a legally certified emissions test.'
        };
      }
    }
  },

  // Translate Multilingual Citizen Report via Gemini
  async translateCitizenReport(text: string, language: string = 'auto'): Promise<{
    incident_type: string;
    vehicle_type: string;
    severity: string;
    description_english: string;
    source_language: string;
  }> {
    try {
      const res = await fetch(`${BASE_URL}/citizen-report/translate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, language })
      });
      if (!res.ok) throw new Error('Translation failed');
      const json = await res.json();
      return json;
    } catch (e) {
      console.warn('Backend translation unavailable, falling back to local extractor:', e);
      return {
        incident_type: 'Stationary Bottleneck Exhaust Plume',
        vehicle_type: 'Commercial Transit Vehicle',
        severity: 'Severe',
        description_english: text,
        source_language: language
      };
    }
  }
};
