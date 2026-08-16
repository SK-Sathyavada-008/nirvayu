import type { Hotspot, CityNode, AuthorityAlert, CitizenReport, ForecastData } from '../types';

export const MOCK_HOTSPOTS: Hotspot[] = [
  {
    id: "hyd-01",
    name: "Gachibowli Junction",
    lat: 17.4401,
    lng: 78.3489,
    aqi: 182,
    traffic_density: "High (88%)",
    vehicle_emission_reports: 14,
    wind_speed: "6.2 km/h WNW",
    risk_level: "Severe",
    likely_pollution_source: "Heavy Diesel Transport & Tech Corridor Congestion",
    timestamp: "2 mins ago"
  },
  {
    id: "hyd-02",
    name: "Charminar Heritage Area",
    lat: 17.3616,
    lng: 78.4747,
    aqi: 154,
    traffic_density: "Very High (94%)",
    vehicle_emission_reports: 26,
    wind_speed: "4.1 km/h NE",
    risk_level: "Unhealthy",
    likely_pollution_source: "2-Stroke Auto-rickshaws & Narrow Canyon Dispersion",
    timestamp: "5 mins ago"
  },
  {
    id: "hyd-03",
    name: "HITEC City Cyber Towers",
    lat: 17.4504,
    lng: 78.3808,
    aqi: 138,
    traffic_density: "High (76%)",
    vehicle_emission_reports: 9,
    wind_speed: "8.5 km/h W",
    risk_level: "Moderate-High",
    likely_pollution_source: "Fleet Cabs & Peak Commuter Traffic",
    timestamp: "12 mins ago"
  },
  {
    id: "hyd-04",
    name: "Begumpet Airport Road",
    lat: 17.4435,
    lng: 78.4682,
    aqi: 168,
    traffic_density: "High (82%)",
    vehicle_emission_reports: 18,
    wind_speed: "5.0 km/h NW",
    risk_level: "Severe",
    likely_pollution_source: "Arterial Transit Corridor & Interstate Buses",
    timestamp: "8 mins ago"
  },
  {
    id: "hyd-05",
    name: "Uppal Industrial Junction",
    lat: 17.4018,
    lng: 78.5602,
    aqi: 210,
    traffic_density: "Severe (91%)",
    vehicle_emission_reports: 31,
    wind_speed: "3.8 km/h ESE",
    risk_level: "Critical",
    likely_pollution_source: "Heavy Freight Trucks & Industrial Fleet Mixing",
    timestamp: "1 min ago"
  },
  {
    id: "hyd-06",
    name: "Secunderabad Railway Corridor",
    lat: 17.4399,
    lng: 78.4983,
    aqi: 146,
    traffic_density: "Moderate-High (72%)",
    vehicle_emission_reports: 11,
    wind_speed: "7.1 km/h N",
    risk_level: "Unhealthy",
    likely_pollution_source: "Diesel Shunting & Multi-modal Transit Hub",
    timestamp: "15 mins ago"
  }
];

export const MOCK_CITY_NODES: CityNode[] = [
  {
    id: "city-hyd",
    city: "Hyderabad",
    state: "Telangana",
    country: "India",
    latitude: 17.3850,
    longitude: 78.4867,
    aqi: 164,
    pollution_risk: "Severe",
    vehicle_emission_reports: 184,
    data_samples: "1.2M logs (142.8 GB)",
    local_data_volume: "142.8 GB / 1.2M logs",
    model_status: "Synchronized (Round 48)",
    last_updated: "2 mins ago",
    active_nodes: 28,
    primary_pollutant: "PM2.5 / NOx",
    federated_loss: 0.038
  },
  {
    id: "city-blr",
    city: "Banglore",
    state: "Karnataka",
    country: "India",
    latitude: 12.9716,
    longitude: 77.5946,
    aqi: 88,
    pollution_risk: "Moderate",
    vehicle_emission_reports: 142,
    data_samples: "1.5M logs (168.4 GB)",
    local_data_volume: "168.4 GB / 1.5M logs",
    model_status: "Synchronized (Round 48)",
    last_updated: "5 mins ago",
    active_nodes: 34,
    primary_pollutant: "PM10 / Vehicular VOCs",
    federated_loss: 0.032
  },
  {
    id: "city-del",
    city: "Delhi",
    state: "National Capital Region",
    country: "India",
    latitude: 28.7041,
    longitude: 77.1025,
    aqi: 268,
    pollution_risk: "Critical",
    vehicle_emission_reports: 420,
    data_samples: "4.1M logs (385.2 GB)",
    local_data_volume: "385.2 GB / 4.1M logs",
    model_status: "Aggregating Weights (Round 49)",
    last_updated: "Just now",
    active_nodes: 64,
    primary_pollutant: "PM2.5 / Heavy Soot",
    federated_loss: 0.045
  },
  {
    id: "city-mum",
    city: "Mumbai",
    state: "Maharashtra",
    country: "India",
    latitude: 19.0760,
    longitude: 72.8777,
    aqi: 138,
    pollution_risk: "Unhealthy",
    vehicle_emission_reports: 230,
    data_samples: "2.3M logs (210.6 GB)",
    local_data_volume: "210.6 GB / 2.3M logs",
    model_status: "Synchronized (Round 48)",
    last_updated: "12 mins ago",
    active_nodes: 42,
    primary_pollutant: "Coastal Humidity / PM2.5",
    federated_loss: 0.036
  }
];

// Alias for backward compatibility
export const MOCK_BRICS_CITIES = MOCK_CITY_NODES;

export const MOCK_ALERTS: AuthorityAlert[] = [
  {
    id: "alt-001",
    title: "Pollution Spike Predicted — Uppal Freight Corridor",
    category: "pollution_spike",
    severity: "Critical",
    location: "Uppal - NH163 Transit Route, Hyderabad",
    description: "Scikit-Learn dispersion model and localized telemetry predict an acute AQI surge reaching 235 AQI over the next 35–45 minutes due to heavy commercial freight entry coinciding with atmospheric boundary layer stagnation.",
    probability: 0.94,
    timestamp: "8 mins ago",
    predicted_aqi_peak: 235,
    horizon: "In 35-45 minutes",
    factors: [
      "Heavy diesel truck convoy entry post 14:00 (48% heavy fleet mix)",
      "Low wind velocity (< 3.8 km/h) causing thermal trapping",
      "34 citizen & sensor vehicle smoke flags in last 60 mins"
    ],
    recommended_actions: [
      "Deploy mobile misting / anti-smog water cannons at Uppal Circle",
      "Divert incoming inter-city heavy commercial vehicles via ORR Exit 9",
      "Alert traffic police post for targeted commercial vehicle tailpipe checks"
    ],
    why_generated: "The Scikit-Learn dispersion model detected an acute +25 AQI inflection rate, while ground optical sensors confirmed 18 multi-axle trucks exhibiting high-opacity soot emissions under stagnant 3.8 km/h wind conditions.",
    supporting_data: {
      predicted_peak_aqi: 235,
      baseline_aqi: 210,
      traffic_density: "92% (Severe Congestion)",
      wind_speed: "3.8 km/h ESE",
      citizen_flags_count: 34,
      lead_time_minutes: 35,
      heavy_vehicle_share: "48% Freight Mix",
      source_corridor: "NH163 Inbound Logistics Gateway"
    },
    recommended_intervention: "Execute Phase-2 Emergency Smog Protocol: Immediate dispatch of 2 municipal misting cannons to Uppal Circle, automated freight rerouting via ORR Exit 9, and dynamic green-signal extension.",
    expected_impact: "Projected -28% localized PM2.5 spike mitigation and prevention of hazardous inversion buildup within the corridor.",
    status: "Active Dispatch"
  },
  {
    id: "alt-002",
    title: "Recurring Vehicle-Emission Hotspot Detected",
    category: "recurring_hotspot",
    severity: "High",
    location: "Charminar Old City Arterials, Hyderabad",
    description: "Persistent hyper-local particulate entrapment detected across historic street canyons. Micro-sensors and vision screening indicate sustained PM2.5 concentrations exceeding safe limits by 3.2x.",
    probability: 0.89,
    timestamp: "24 mins ago",
    predicted_aqi_peak: 178,
    horizon: "Sustained through evening peak",
    factors: [
      "High density of aged 2-stroke 3-wheelers with incomplete combustion",
      "Narrow street canyon limiting atmospheric dispersion",
      "Pedestrian proximity index exceeding safe threshold"
    ],
    recommended_actions: [
      "Initiate strict spot emission audits with handheld gas analyzers",
      "Implement temporary 2-hour low-emission vehicle only restriction",
      "Publish real-time advisory to citizen health channel"
    ],
    why_generated: "Hyperlocal air quality nodes at Charminar have recorded 4 consecutive days of severe evening particulate stagnation caused by street canyon geometry and concentrated 2-stroke fleet circulation.",
    supporting_data: {
      predicted_peak_aqi: 178,
      baseline_aqi: 158,
      traffic_density: "94% (Extreme Density)",
      wind_speed: "4.1 km/h NE",
      citizen_flags_count: 26,
      lead_time_minutes: 15,
      heavy_vehicle_share: "12% (High 3-Wheeler density)",
      source_corridor: "Heritage Street Grid"
    },
    recommended_intervention: "Activate Urban Low-Emission Zone (LEZ) perimeter check: Restrict non-compliant 2-stroke vehicles, deploy electric shuttle transit, and enforce spot PUC certification checks.",
    expected_impact: "Estimated 35% reduction in pedestrian VOC/soot inhalation risk and accelerated dissipation of street-level exhaust pockets.",
    status: "Under Review"
  },
  {
    id: "alt-003",
    title: "High-Risk Vehicle Cluster Identified via Vision AI",
    category: "vehicle_cluster",
    severity: "Medium-High",
    location: "Gachibowli Flyover Base & ORR Feeder",
    description: "Automated Vision AI optical screening and citizen ground reports identified a cluster of 8 overloaded logistics trucks and transit buses emitting Ringelmann Class 3.5–4.0 black exhaust plumes.",
    probability: 0.92,
    timestamp: "42 mins ago",
    predicted_aqi_peak: 192,
    horizon: "Next 60 minutes",
    factors: [
      "Cluster of 8 overloaded logistics trucks exhibiting Class-4 black soot",
      "Idle engine queue length > 650m due to lane merger",
      "Spike in localized NO2 sensor readings (+42%)"
    ],
    recommended_actions: [
      "Optimize signal cycle time to minimize bottleneck idling",
      "Notify Regional Transport Authority (RTA) for fleet compliance review",
      "Dispatch roadside enforcement unit to inspect offending commercial vehicles"
    ],
    why_generated: "Gemini Vision AI processed roadside camera feeds and citizen uploads, confirming multiple Class-4 particulate plumes from stationary freight haulers queuing at the flyover base.",
    supporting_data: {
      predicted_peak_aqi: 192,
      baseline_aqi: 164,
      traffic_density: "88% (High Congestion)",
      wind_speed: "6.2 km/h WNW",
      citizen_flags_count: 19,
      lead_time_minutes: 20,
      heavy_vehicle_share: "38% Commercial Fleet",
      source_corridor: "ORR Technology Feeder"
    },
    recommended_intervention: "Dispatch mobile RTA inspection squad, synchronize adaptive traffic signal phases to eliminate idling queues, and issue direct fleet audit notices to the logistics operator.",
    expected_impact: "Immediate clearing of stationary smoke plume cluster and 22% decrease in localized NOx surge within 30 minutes.",
    status: "Actioned"
  }
];

export const MOCK_FORECAST: ForecastData = {
  city: "Hyderabad",
  current_aqi: 164,
  traffic_density: 0.85,
  wind_speed: 5.2,
  temperature: 31.5,
  heavy_vehicle_ratio: 0.38,
  forecast_timestamp: new Date().toISOString(),
  numerical_prediction_source: "Scikit-Learn ML Model",
  reasoning_source: "Gemini Reasoning Engine",
  predictions: [
    { horizon_minutes: 15, predicted_aqi: 172, confidence: 0.94, delta_from_baseline: 8 },
    { horizon_minutes: 30, predicted_aqi: 184, confidence: 0.89, delta_from_baseline: 20 },
    { horizon_minutes: 45, predicted_aqi: 195, confidence: 0.84, delta_from_baseline: 31 },
    { horizon_minutes: 60, predicted_aqi: 191, confidence: 0.78, delta_from_baseline: 27 }
  ],
  confidence_overall: 0.89,
  contributing_factors: [
    { factor: "Traffic Congestion Index (85%)", impact_pct: 44, direction: "increasing" },
    { factor: "Heavy Commercial Fleet Ratio (38%)", impact_pct: 26, direction: "increasing" },
    { factor: "Wind Dispersion Vector (5.2 km/h)", impact_pct: 18, direction: "decreasing" },
    { factor: "Thermal Boundary Inversion (31.5°C)", impact_pct: 12, direction: "increasing" }
  ],
  gemini_reasoning: {
    overall_pollution_risk: "Severe — Acute Localized Stagnation Trajectory",
    main_contributing_factors: [
      "Severe vehicular congestion (85% traffic density) generating high localized volumes of tailpipe NOx and fine particulates (PM2.5).",
      "Heavy commercial logistics fleet concentration (38%) producing high-opacity black carbon soot with low combustion efficiency.",
      "Low wind velocity (5.2 km/h) insufficient to trigger horizontal boundary dispersion, causing plume stacking near street level.",
      "Thermal ground inversion (31.5°C) restricting vertical atmospheric mixing layer below 350 meters."
    ],
    plain_language_explanation: "Air quality in Hyderabad is projected by the scikit-learn model to deteriorate over the next 45 minutes, spiking from 164 to 195 AQI. The accumulation is caused by dense commercial traffic during low wind conditions, trapping soot particles close to the ground.",
    recommended_authority_actions: [
      "Dynamically alter traffic signal cycles along arterial junctions to disperse multi-lane idle queues.",
      "Deploy municipal misting cannons and anti-smog water sprayers to high-density corridor bottlenecks.",
      "Dispatch roadside transport enforcement teams to inspect heavy commercial vehicles exhibiting severe tailpipe smoke.",
      "Issue real-time health advisories alerting vulnerable citizens to avoid strenuous outdoor activity near major transit routes."
    ],
    confidence_interpretation: "The Scikit-Learn regression model exhibits 89% R² predictive confidence for the 15–45 minute horizon. Prediction variance slightly widens at T+60m due to potential upstream traffic rerouting and ambient wind velocity fluctuations."
  }
};

export const MOCK_CITIZEN_REPORTS: CitizenReport[] = [
  {
    id: "cit-001",
    location: "Near Tolichowki Flyover, Hyderabad",
    description: "Heavy black exhaust plume from overloaded gravel tipper truck stationary at intersection.",
    severity: "Severe",
    vehicle_type: "Heavy Commercial Tipper",
    image_url: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=600&q=80",
    timestamp: "15 mins ago",
    status: "AI Verified — Emission Risk 88/100",
    ai_assessment: {
      emission_risk_score: 88,
      smoke_severity: "Dense Black Plume (Ringelmann Class 3.5)",
      observations: "Substantial dense particulate matter and soot ejection observed during throttle load. High unburnt carbon concentration.",
      recommended_action: "Flag for municipal roadside tailpipe audit and RTA commercial compliance check.",
      confidence: 0.94,
      vehicle_type: "Heavy Duty Multi-Axle Diesel Freight Truck"
    }
  },
  {
    id: "cit-002",
    location: "Ameerpet Metro Station Entry, Hyderabad",
    description: "Continuous blue smoke from several 2-stroke delivery autos idling in drop-off bay.",
    severity: "Moderate",
    vehicle_type: "3-Wheeler Auto-rickshaw",
    image_url: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80",
    timestamp: "42 mins ago",
    status: "AI Verified — Emission Risk 68/100",
    ai_assessment: {
      emission_risk_score: 68,
      smoke_severity: "Light Grey / Blue Tinge",
      observations: "Intermittent blue-grey lubricating oil vapor detected emitting from manifold outlet. Suggests 2-stroke lube oil combustion or fuel mix irregularity.",
      recommended_action: "Flag for scheduled PUC (Pollution Under Control) verification and carburetor tuning check.",
      confidence: 0.89,
      vehicle_type: "3-Wheeler Auto-Rickshaw (2-Stroke Engine)"
    }
  },
  {
    id: "cit-003",
    location: "Kukatpally Y-Junction, Hyderabad",
    description: "Inter-state diesel sleeper bus accelerating with continuous heavy opacity black soot.",
    severity: "Critical",
    vehicle_type: "Interstate Diesel Bus",
    image_url: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=600&q=80",
    timestamp: "1 hour ago",
    status: "AI Verified — Emission Risk 92/100",
    ai_assessment: {
      emission_risk_score: 92,
      smoke_severity: "Critical Black Soot Plume",
      observations: "Severe tailpipe soot deposition with continuous high-opacity particulate stream during acceleration.",
      recommended_action: "Forward high-priority flag to Regional Transport Authority (RTA) for immediate roadside stop.",
      confidence: 0.95,
      vehicle_type: "Interstate Diesel Transit Bus"
    }
  }
];

export const VEHICLE_TEST_PRESETS = [
  {
    id: "preset-truck",
    name: "Heavy Diesel Truck (High Emission)",
    badge: "Severe Risk",
    badgeColor: "bg-red-500/20 text-red-400 border-red-500/40",
    image: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=800&q=80",
    analysis: {
      vehicle_type: "Heavy Duty Multi-Axle Diesel Freight Truck",
      visible_exhaust_detected: true,
      smoke_severity: "Dense Black Plume (Ringelmann Scale Class 3.5)",
      emission_risk_score: 88,
      confidence: 0.94,
      observations: "Substantial dense particulate matter and soot ejection observed during throttle load. Probable fuel injector miscalibration or particulate filter failure.",
      recommended_action: "Issue high-priority municipal emission screening flag; alert traffic wardens for targeted roadside dynamometer check."
    }
  },
  {
    id: "preset-auto",
    name: "2-Stroke Auto-Rickshaw (Moderate)",
    badge: "Elevated Risk",
    badgeColor: "bg-amber-500/20 text-amber-400 border-amber-500/40",
    image: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80",
    analysis: {
      vehicle_type: "3-Wheeler Auto-Rickshaw (2-Stroke Engine)",
      visible_exhaust_detected: true,
      smoke_severity: "Light Grey / Blue Tinge",
      emission_risk_score: 68,
      confidence: 0.89,
      observations: "Distinct blue-grey lubricating oil vapor detected emitting intermittently from lower exhaust manifold. Indicative of cylinder ring wear or unburnt oil mix.",
      recommended_action: "Flag for scheduled PUC (Pollution Under Control) testing and carburetor tuning inspection."
    }
  },
  {
    id: "preset-ev",
    name: "Electric Transit Bus (Clean)",
    badge: "Clean / Low Risk",
    badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
    image: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80",
    analysis: {
      vehicle_type: "Electric Zero-Emission Municipal Transit Bus",
      visible_exhaust_detected: false,
      smoke_severity: "None (Zero Plume)",
      emission_risk_score: 12,
      confidence: 0.96,
      observations: "Zero visible plume at exhaust port. Aerodynamic body with clean undercarriage profile consistent with zero-tailpipe electric powertrain.",
      recommended_action: "No intervention required. Eligible for green transit priority corridor access."
    }
  }
];

export const HOURLY_TREND_DATA = [
  { time: "06:00", aqi: 110, vehicleDensity: 35, pm25: 45 },
  { time: "08:00", aqi: 152, vehicleDensity: 82, pm25: 78 },
  { time: "10:00", aqi: 178, vehicleDensity: 94, pm25: 96 },
  { time: "12:00", aqi: 165, vehicleDensity: 70, pm25: 84 },
  { time: "14:00", aqi: 164, vehicleDensity: 74, pm25: 82 },
  { time: "16:00", aqi: 180, vehicleDensity: 88, pm25: 98 },
  { time: "18:00", aqi: 198, vehicleDensity: 96, pm25: 118 },
  { time: "20:00", aqi: 186, vehicleDensity: 79, pm25: 104 },
  { time: "22:00", aqi: 145, vehicleDensity: 48, pm25: 68 }
];
