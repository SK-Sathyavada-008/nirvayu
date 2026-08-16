from datetime import datetime, timezone
from typing import List, Dict, Any, Optional
from .ml_forecast import generate_aqi_forecast_ml
from .gemini_service import GeminiForecastReasoningService
from ..data.sample_data import CITIZEN_REPORTS_INITIAL

class ForecastService:
    @staticmethod
    def generate_forecast(
        city: str = "Hyderabad",
        current_aqi: int = 164,
        traffic_density: float = 0.85,
        wind_speed: float = 5.2,
        temperature: float = 31.5,
        heavy_vehicle_ratio: float = 0.38
    ) -> dict:
        """
        Orchestrates the AQI forecasting pipeline:
        1. Numerical AQI forecast computed exclusively by the Scikit-Learn predictive model.
        2. Gemini reasoning engine provides atmospheric & municipal risk interpretation.
        """
        # Step 1: Compute numerical forecast using Scikit-Learn model
        ml_result = generate_aqi_forecast_ml(
            current_aqi=current_aqi,
            traffic_density=traffic_density,
            wind_speed=wind_speed,
            temperature=temperature,
            heavy_vehicle_ratio=heavy_vehicle_ratio
        )

        predictions = ml_result["predictions"]
        contributing_factors = ml_result["contributing_factors"]
        confidence_overall = ml_result["confidence_overall"]

        # Step 2: Retrieve recent emission reports for context
        try:
            from ..routes.citizen import CITIZEN_REPORTS
            recent_reports = CITIZEN_REPORTS
        except Exception:
            recent_reports = CITIZEN_REPORTS_INITIAL

        # Step 3: Invoke Gemini reasoning with inputs & ML forecast (Gemini does NOT compute numbers)
        gemini_reasoning = GeminiForecastReasoningService.generate_reasoning(
            current_aqi=current_aqi,
            predicted_aqi_values=predictions,
            traffic_density=traffic_density,
            wind_speed=wind_speed,
            temperature=temperature,
            heavy_vehicle_ratio=heavy_vehicle_ratio,
            recent_emission_reports=recent_reports,
            city=city
        )

        return {
            "city": city,
            "current_aqi": current_aqi,
            "traffic_density": traffic_density,
            "wind_speed": wind_speed,
            "temperature": temperature,
            "heavy_vehicle_ratio": heavy_vehicle_ratio,
            "forecast_timestamp": datetime.now(timezone.utc).isoformat(),
            "numerical_prediction_source": "Scikit-Learn ML Model",
            "reasoning_source": "Gemini Reasoning Engine",
            "predictions": predictions,
            "confidence_overall": confidence_overall,
            "contributing_factors": contributing_factors,
            "gemini_reasoning": gemini_reasoning
        }
