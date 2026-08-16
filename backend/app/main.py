from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .routes import vehicle, hotspots, forecast, alerts, brics, citizen

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.PROJECT_VERSION,
    description="Hyperlocal Air-Quality & Vehicle-Emission Intelligence Platform"
)

# CORS middleware for local and production frontend clients
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(vehicle.router)
app.include_router(hotspots.router)
app.include_router(forecast.router)
app.include_router(alerts.router)
app.include_router(brics.router)
app.include_router(citizen.router)

@app.get("/")
def root():
    return {
        "platform": settings.PROJECT_NAME,
        "tagline": "AI-Powered Hyperlocal Emission & Air-Quality Intelligence",
        "version": settings.PROJECT_VERSION,
        "status": "operational",
        "endpoints": [
            "POST /api/vehicle/analyze",
            "GET  /api/hotspots",
            "GET  /api/forecast",
            "GET  /api/alerts",
            "GET  /api/brics",
            "POST /api/citizen-report",
            "GET  /api/citizen-report"
        ]
    }
