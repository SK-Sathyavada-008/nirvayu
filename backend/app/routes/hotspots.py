from fastapi import APIRouter, Query
from pydantic import BaseModel, Field
from typing import List, Optional
from ..services.hotspot_service import HotspotService

router = APIRouter(prefix="/api/hotspots", tags=["Hotspots"])

class HotspotItem(BaseModel):
    id: str
    name: str
    latitude: float
    longitude: float
    lat: float
    lng: float
    aqi: int
    risk_level: str
    traffic_density: str
    vehicle_emission_reports: int
    wind_speed: str
    likely_sources: str
    likely_pollution_source: Optional[str] = None
    ai_risk_assessment: Optional[str] = None
    timestamp: str

class HotspotsResponse(BaseModel):
    status: str = "success"
    city: str
    count: int
    data: List[HotspotItem]

@router.get("", response_model=HotspotsResponse)
def get_hotspots(
    city: str = Query(default="Hyderabad", description="Target metropolitan city"),
    min_aqi: Optional[int] = Query(default=None, description="Filter hotspots with AQI greater than or equal to min_aqi"),
    severity: Optional[str] = Query(default="all", description="Filter by risk severity level")
):
    hotspots = HotspotService.get_all_hotspots(city=city, min_aqi=min_aqi, severity=severity)
    return {
        "status": "success",
        "city": city,
        "count": len(hotspots),
        "data": hotspots
    }
