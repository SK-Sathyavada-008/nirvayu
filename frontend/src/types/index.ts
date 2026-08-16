export type RiskSeverity = 'Good' | 'Moderate' | 'Unhealthy' | 'Severe' | 'Critical';

export interface Hotspot {
  id: string;
  name: string;
  lat: number;
  lng: number;
  latitude?: number;
  longitude?: number;
  aqi: number;
  traffic_density: string;
  vehicle_emission_reports: number;
  wind_speed: string;
  risk_level: RiskSeverity | string;
  likely_pollution_source: string;
  likely_sources?: string;
  ai_risk_assessment?: string;
  timestamp: string;
}

export interface ForecastPrediction {
  horizon_minutes: number;
  predicted_aqi: number;
  confidence: number;
  delta_from_baseline: number;
}

export interface ContributingFactor {
  factor: string;
  impact_pct: number;
  direction: 'increasing' | 'decreasing';
}

export interface GeminiReasoning {
  overall_pollution_risk: string;
  main_contributing_factors: string[];
  plain_language_explanation: string;
  recommended_authority_actions: string[];
  confidence_interpretation: string;
  source?: string;
}

export interface ForecastData {
  city?: string;
  current_aqi: number;
  traffic_density?: number;
  wind_speed?: number;
  temperature?: number;
  heavy_vehicle_ratio?: number;
  forecast_timestamp: string;
  numerical_prediction_source?: string;
  reasoning_source?: string;
  predictions: ForecastPrediction[];
  confidence_overall: number;
  contributing_factors: ContributingFactor[];
  gemini_reasoning?: GeminiReasoning;
}

export interface AlertSupportingData {
  predicted_peak_aqi?: number;
  baseline_aqi?: number;
  traffic_density?: string;
  wind_speed?: string;
  citizen_flags_count?: number;
  lead_time_minutes?: number;
  heavy_vehicle_share?: string;
  source_corridor?: string;
}

export interface AuthorityAlert {
  id: string;
  title: string;
  category: 'pollution_spike' | 'recurring_hotspot' | 'vehicle_cluster' | string;
  severity: RiskSeverity | 'High' | 'Medium-High' | string;
  location: string;
  description: string;
  probability: number | string;
  timestamp: string;
  predicted_aqi_peak: number;
  horizon: string;
  factors: string[];
  recommended_actions: string[];
  why_generated: string;
  supporting_data: AlertSupportingData;
  recommended_intervention: string;
  expected_impact: string;
  status: 'Active Dispatch' | 'Under Review' | 'Actioned' | string;
}

export interface CityNode {
  id: string;
  city: string;
  country: string;
  latitude?: number;
  longitude?: number;
  aqi: number;
  pollution_risk: RiskSeverity | string;
  vehicle_emission_reports?: number;
  data_samples?: string;
  local_data_volume?: string;
  model_status: string;
  last_updated?: string;
  state?: string;
  active_nodes?: number;
  primary_pollutant?: string;
  federated_loss?: number;
}

// Backward-compatible alias
export type BRICSCity = CityNode;

export interface TranslatedIncident {
  incident_type: string;
  vehicle_type: string;
  severity: string;
  description_english: string;
  source_language: string;
}

export interface VehicleAnalysisResult {
  vehicle_type: string;
  visible_exhaust_detected: boolean;
  smoke_severity: string;
  emission_risk_score: number; // 0 - 100
  confidence: number; // 0.0 - 1.0
  observations: string;
  recommended_action: string;
  disclaimer?: string;
}

export interface CitizenReportAIAssessment {
  emission_risk_score: number;
  smoke_severity: string;
  observations: string;
  recommended_action: string;
  confidence?: number;
  vehicle_type?: string;
}

export interface CitizenReport {
  id: string;
  location: string;
  description: string;
  severity: string;
  vehicle_type?: string;
  image_url?: string;
  timestamp: string;
  status: string;
  ai_assessment?: CitizenReportAIAssessment;
}

export type ActiveTab = 'dashboard' | 'vehicle' | 'map' | 'forecast' | 'alerts' | 'network' | 'citizen';
