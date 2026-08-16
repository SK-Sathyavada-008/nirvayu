from fastapi import APIRouter
from pydantic import BaseModel, Field
from typing import List, Optional
from ..data.sample_data import BRICS_CITIES

router = APIRouter(prefix="/api/brics", tags=["National / BRICS Grid"])

class CityData(BaseModel):
    id: str
    city: str
    country: str
    latitude: float
    longitude: float
    aqi: int
    pollution_risk: str
    vehicle_emission_reports: int
    data_samples: str
    model_status: str
    last_updated: str
    state: Optional[str] = None
    active_nodes: Optional[int] = None
    primary_pollutant: Optional[str] = None
    federated_loss: Optional[float] = None

class BricsGridResponse(BaseModel):
    status: str = "success"
    network_name: str = "NIRVĀYU Federated Air-Quality Mesh (Simulated Prototype)"
    federated_aggregation_protocol: str = "FedAvg with Differential Privacy"
    global_federated_round: int = 48
    federated_nodes_online: int = 4
    total_shared_parameters: str = "36.8 Million"
    consensus_loss: float = 0.038
    schema_standard: str = "Open Climate Telemetry Schema v1.0"
    data: List[CityData]

@router.get("", response_model=BricsGridResponse)
def get_brics_network():
    """
    Standardized BRICS & National Metropolitan Network Telemetry.
    Returns identical data schemas across Hyderabad, Bangalore, Delhi, and Mumbai.
    """
    return {
        "status": "success",
        "network_name": "NIRVĀYU Federated Air-Quality Mesh (Simulated Prototype)",
        "federated_aggregation_protocol": "FedAvg with Differential Privacy",
        "global_federated_round": 48,
        "federated_nodes_online": len(BRICS_CITIES),
        "total_shared_parameters": "36.8 Million",
        "consensus_loss": 0.038,
        "schema_standard": "Open Climate Telemetry Schema v1.0",
        "data": BRICS_CITIES
    }
