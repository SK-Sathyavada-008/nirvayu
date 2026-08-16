import os
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

# Parse any additional custom origins passed via environment variables
custom_origins_env = os.getenv("ALLOWED_ORIGINS", "")
custom_origins = [o.strip() for o in custom_origins_env.split(",") if o.strip()]

default_allowed_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://nirvayu-m4799rh3g-sk-sathyavada.vercel.app",
    "https://nirvayu.vercel.app",
    "https://nirvayu-sk-sathyavada-008.vercel.app"
]

class Settings(BaseModel):
    PROJECT_NAME: str = "NIRVĀYU Intelligence Platform"
    PROJECT_VERSION: str = "1.0.0"
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    ALLOWED_ORIGINS: list[str] = list(dict.fromkeys(default_allowed_origins + custom_origins))
    ALLOW_ORIGIN_REGEX: str = r"https://nirvayu.*\.vercel\.app"

settings = Settings()
