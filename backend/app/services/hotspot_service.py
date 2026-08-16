from typing import List, Optional
from ..data.sample_data import HYDERABAD_HOTSPOTS

class HotspotService:
    @staticmethod
    def get_all_hotspots(city: str = "Hyderabad", min_aqi: Optional[int] = None, severity: Optional[str] = None) -> List[dict]:
        """
        Retrieves spatial hotspot monitoring nodes filtered by city and severity criteria.
        """
        results = HYDERABAD_HOTSPOTS
        if min_aqi is not None:
            results = [h for h in results if h["aqi"] >= min_aqi]
        if severity and severity.lower() != "all":
            results = [h for h in results if severity.lower() in h["risk_level"].lower()]
        return results

    @staticmethod
    def get_hotspot_by_id(hotspot_id: str) -> Optional[dict]:
        for h in HYDERABAD_HOTSPOTS:
            if h["id"] == hotspot_id:
                return h
        return None
