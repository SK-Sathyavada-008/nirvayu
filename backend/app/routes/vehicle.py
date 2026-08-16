from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from pydantic import BaseModel, Field
from typing import Optional
from ..services.gemini_service import GeminiVisionService

router = APIRouter(prefix="/api/vehicle", tags=["Vehicle AI"])

class VehicleAnalysisResponse(BaseModel):
    vehicle_type: str = Field(..., description="Detected vehicle classification")
    visible_exhaust_detected: bool = Field(..., description="Whether visible plume is present")
    smoke_severity: str = Field(..., description="Ringelmann scale or smoke opacity description")
    emission_risk_score: int = Field(..., ge=0, le=100, description="Normalized emission risk index 0-100")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Model confidence score")
    observations: str = Field(..., description="Technical visual observations")
    recommended_action: str = Field(..., description="Action recommendation for authorities")
    disclaimer: str = Field("This is an AI-based visual screening system, NOT a legally certified emissions test.")

class VehicleAnalyzeEnvelope(BaseModel):
    status: str = "success"
    filename: Optional[str] = None
    data: VehicleAnalysisResponse

@router.post("/analyze", response_model=VehicleAnalyzeEnvelope)
async def analyze_vehicle(
    file: UploadFile = File(..., description="Roadside vehicle or tailpipe image"),
    notes: Optional[str] = Form(default=None)
):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Uploaded file must be a valid image (JPEG/PNG).")
    
    contents = await file.read()
    if len(contents) == 0:
        raise HTTPException(status_code=400, detail="Uploaded image file is empty.")

    result = GeminiVisionService.analyze_vehicle_emission(contents, filename=file.filename or "")
    return {
        "status": "success",
        "filename": file.filename,
        "data": result
    }
